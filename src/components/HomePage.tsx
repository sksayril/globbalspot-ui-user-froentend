import React, { useState, useEffect } from 'react';
// @ts-ignore
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import { TrendingUp, Calendar, Target, Gift, DollarSign, Activity, Plus, Minus, Zap, Award, BarChart3, Clock, Wallet, CreditCard, Star, Crown, Shield, Copy, Trophy, Users, GiftIcon, Share2, MessageCircle, Facebook, Twitter, X } from 'lucide-react';
import { 
  updateUserProfile, 
  createDeposit, 
  claimDailyIncome, 
  getDailyIncomeStatus, 
  getContentList, 
  ContentItem, 
  createWithdrawalRequest,
  getActiveLuckyDraws,
  joinLuckyDraw,
  claimLuckyDrawPrize,
  getLuckyDrawStats,
  getUnclaimedPrizes,
  LuckyDraw,
  LuckyDrawStats,
  UnclaimedPrize
} from '../services/api';
import { CardSkeleton, StatsCardSkeleton, GridSkeleton } from './SkeletonLoader';

interface HomePageProps {
  userStats: any; // Changed to any to match the new profile structure
  isLoading?: boolean;
  investmentWalletBalance: number;
  normalWalletBalance: number;
  onWalletsUpdate?: (wallets: { investmentWallet: { balance: number }; normalWallet: { balance: number } }) => void;
}

const HomePage: React.FC<HomePageProps> = ({ userStats, isLoading = false, investmentWalletBalance, normalWalletBalance, onWalletsUpdate }) => {
  // Handle daily sign-in
  const [dailyIncomeSuccess, setDailyIncomeSuccess] = useState('');
  const [dailyIncomeError, setDailyIncomeError] = useState('');
  const [dailyIncomeLoading, setDailyIncomeLoading] = useState(false);

  // Crypto wallet data state
  const [cryptoWalletData, setCryptoWalletData] = useState<ContentItem | null>(null);
  const [isLoadingCryptoData, setIsLoadingCryptoData] = useState(false);

  // Fetch crypto wallet data on component mount
  useEffect(() => {
    const fetchCryptoWalletData = async () => {
      setIsLoadingCryptoData(true);
      try {
        const response = await getContentList();
        console.log(response);
      // Find the crypto wallet content (by isActive, since title is address)
      const cryptoWallet = response.data.contents.find(
        content => content.isActive
      );
      console.log('Crypto Wallet Data:', cryptoWallet);
      setCryptoWalletData(cryptoWallet || null);
      } catch (error) {
        console.error('Error fetching crypto wallet data:', error);
        setCryptoWalletData(null);
      } finally {
        setIsLoadingCryptoData(false);
      }
    };

    fetchCryptoWalletData();
  }, []);

  // Fetch Lucky Draw data on component mount
  useEffect(() => {
    const fetchLuckyDrawData = async () => {
      try {
        // Fetch active lucky draws
        setLuckyDrawLoading(true);
        const activeDrawsResponse = await getActiveLuckyDraws();
        setActiveLuckyDraws(activeDrawsResponse.data.luckyDraws);
      } catch (error) {
        console.error('Error fetching active lucky draws:', error);
      } finally {
        setLuckyDrawLoading(false);
      }

      try {
        // Fetch lucky draw stats
        setLuckyDrawStatsLoading(true);
        const statsResponse = await getLuckyDrawStats();
        setLuckyDrawStats(statsResponse.data);
      } catch (error) {
        console.error('Error fetching lucky draw stats:', error);
      } finally {
        setLuckyDrawStatsLoading(false);
      }

      try {
        // Fetch unclaimed prizes
        setUnclaimedPrizesLoading(true);
        const unclaimedResponse = await getUnclaimedPrizes();
        setUnclaimedPrizes(unclaimedResponse.data.unclaimedPrizes);
      } catch (error) {
        console.error('Error fetching unclaimed prizes:', error);
      } finally {
        setUnclaimedPrizesLoading(false);
      }
    };

    fetchLuckyDrawData();
  }, []);

  // Fetch wallet information on component mount
  useEffect(() => {
    const fetchWalletInfo = async () => {
      try {
        setWalletLoading(true);
        const response = await fetch('https://api.goalsbot.com/users/wallet-info', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          },
        });
        const data = await response.json();
        if (data.success) {
          setWalletInfo(data.data);
        }
      } catch (error) {
        console.error('Error fetching wallet info:', error);
      } finally {
        setWalletLoading(false);
      }
    };

    fetchWalletInfo();
  }, []);

  // Copy wallet ID to clipboard
  const copyWalletId = async (walletId: string) => {
    try {
      await navigator.clipboard.writeText(walletId);
      // You could add a toast notification here
      alert('Wallet ID copied to clipboard!');
    } catch (error) {
      console.error('Failed to copy wallet ID:', error);
    }
  };

  const [claimMessage, setClaimMessage] = useState('');
  const [claimType, setClaimType] = useState<'success' | 'error'>('success');
  const [claimLoading, setClaimLoading] = useState(false);

  // Daily Sign-in Modal state
  const [showDailySignInModal, setShowDailySignInModal] = useState(false);
  const [dailySignInLoading, setDailySignInLoading] = useState(false);
  const [showIncomeDetailsModal, setShowIncomeDetailsModal] = useState(false);
  const [selectedIncomeType, setSelectedIncomeType] = useState<'today' | 'total'>('today');

  // Lucky Draw state
  const [activeLuckyDraws, setActiveLuckyDraws] = useState<LuckyDraw[]>([]);
  const [luckyDrawStats, setLuckyDrawStats] = useState<LuckyDrawStats | null>(null);
  const [unclaimedPrizes, setUnclaimedPrizes] = useState<UnclaimedPrize[]>([]);
  const [luckyDrawLoading, setLuckyDrawLoading] = useState(false);
  const [luckyDrawStatsLoading, setLuckyDrawStatsLoading] = useState(false);
  const [unclaimedPrizesLoading, setUnclaimedPrizesLoading] = useState(false);

  // Refresh wallet data
  const refreshWalletData = () => {
    if (typeof onWalletsUpdate === 'function') {
      // Optionally re-fetch wallets if you have such a function
      onWalletsUpdate({
        investmentWallet: { balance: investmentWalletBalance },
        normalWallet: { balance: normalWalletBalance },
      });
    } else {
      window.location.reload();
    }
  };

  // Replace handleDailySignIn to open modal
  const handleDailySignIn = () => {
    setShowDailySignInModal(true);
  };

  // Claim daily income
  const handleDailyIncomeClaim = async () => {
    setDailySignInLoading(true);
    try {
      const res = await fetch('https://api.goalsbot.com/users/today-my-income', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json',
        },
      });
      const data = await res.json();
      const claimSuccess = data.success;
      await Swal.fire({
        icon: claimSuccess ? undefined : 'error',
        title: claimSuccess ? '🎉 Daily Income Claimed!' : 'Oops!',
        text: claimSuccess
          ? (data.message || 'You have successfully claimed your daily income!')
          : (data.message || 'Failed to claim daily income.'),
        background: 'linear-gradient(135deg, #f0f4ff 0%, #e0ffe7 100%)',
        color: '#222',
        confirmButtonColor: claimSuccess ? '#22c55e' : '#ef4444',
        confirmButtonText: claimSuccess ? 'Awesome!' : 'OK',
        customClass: {
          popup: 'swal2-border-radius',
          title: 'swal2-title-bold',
          confirmButton: 'swal2-confirm-custom'
        },
        showClass: {
          popup: 'animate__animated animate__fadeInDown'
        },
        hideClass: {
          popup: 'animate__animated animate__fadeOutUp'
        }
      });
      setShowDailySignInModal(false);
      refreshWalletData();
    } catch (err) {
      await Swal.fire({
        icon: 'error',
        title: 'Network Error',
        text: 'Please try again.',
        confirmButtonColor: '#ef4444'
      });
    } finally {
      setDailySignInLoading(false);
    }
  };

  // Claim level income
  const handleLevelIncomeClaim = async () => {
    setDailySignInLoading(true);
    try {
      // Claim team income only
      const teamRes = await fetch('https://api.goalsbot.com/users/claim-level-income', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json',
        },
      });
      const teamData = await teamRes.json();
      
      const teamSuccess = teamData.success;
      
      await Swal.fire({
        icon: teamSuccess ? undefined : 'error',
        title: teamSuccess ? '🎉 Team Income Claimed!' : 'Oops!',
        text: teamSuccess
          ? (teamData.message || 'You have successfully claimed your team income!')
          : (teamData.message || 'Failed to claim team income.'),
        background: 'linear-gradient(135deg, #f0f4ff 0%, #e0ffe7 100%)',
        color: '#222',
        confirmButtonColor: teamSuccess ? '#22c55e' : '#ef4444',
        confirmButtonText: teamSuccess ? 'Awesome!' : 'OK',
        customClass: {
          popup: 'swal2-border-radius',
          title: 'swal2-title-bold',
          confirmButton: 'swal2-confirm-custom'
        },
        showClass: {
          popup: 'animate__animated animate__fadeInDown'
        },
        hideClass: {
          popup: 'animate__animated animate__fadeOutUp'
        }
      });
      setShowDailySignInModal(false);
      refreshWalletData();
    } catch (err) {
      await Swal.fire({
        icon: 'error',
        title: 'Network Error',
        text: 'Please try again.',
        confirmButtonColor: '#ef4444'
      });
    } finally {
      setDailySignInLoading(false);
    }
  };

  // Lucky Draw handlers
  const handleJoinLuckyDraw = async (luckyDrawId: string) => {
    try {
      const response = await joinLuckyDraw(luckyDrawId);
      await Swal.fire({
        icon: 'success',
        title: '🎉 Joined Successfully!',
        text: response.message || 'You have successfully joined the lucky draw!',
        background: 'linear-gradient(135deg, #f0f4ff 0%, #e0ffe7 100%)',
        color: '#222',
        confirmButtonColor: '#22c55e',
        confirmButtonText: 'Awesome!',
        customClass: {
          popup: 'swal2-border-radius',
          title: 'swal2-title-bold',
          confirmButton: 'swal2-confirm-custom'
        },
        showClass: {
          popup: 'animate__animated animate__fadeInDown'
        },
        hideClass: {
          popup: 'animate__animated animate__fadeOutUp'
        }
      });
      // Refresh lucky draw data
      const activeDrawsResponse = await getActiveLuckyDraws();
      setActiveLuckyDraws(activeDrawsResponse.data.luckyDraws);
    } catch (error: any) {
      await Swal.fire({
        icon: 'error',
        title: 'Oops!',
        text: error.message || 'Failed to join lucky draw. Please try again.',
        confirmButtonColor: '#ef4444'
      });
    }
  };

  const handleClaimPrize = async (luckyDrawId: string) => {
    try {
      const response = await claimLuckyDrawPrize(luckyDrawId);
      await Swal.fire({
        icon: 'success',
        title: '🎉 Prize Claimed!',
        text: response.message || 'You have successfully claimed your prize!',
        background: 'linear-gradient(135deg, #f0f4ff 0%, #e0ffe7 100%)',
        color: '#222',
        confirmButtonColor: '#22c55e',
        confirmButtonText: 'Awesome!',
        customClass: {
          popup: 'swal2-border-radius',
          title: 'swal2-title-bold',
          confirmButton: 'swal2-confirm-custom'
        },
        showClass: {
          popup: 'animate__animated animate__fadeInDown'
        },
        hideClass: {
          popup: 'animate__animated animate__fadeOutUp'
        }
      });
      // Refresh data
      refreshWalletData();
      const unclaimedResponse = await getUnclaimedPrizes();
      setUnclaimedPrizes(unclaimedResponse.data.unclaimedPrizes);
    } catch (error: any) {
      await Swal.fire({
        icon: 'error',
        title: 'Oops!',
        text: error.message || 'Failed to claim prize. Please try again.',
        confirmButtonColor: '#ef4444'
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Helper function to format numbers with max 3 decimal places
  const formatNumber = (value: number | undefined | null): string => {
    if (value === undefined || value === null) return '0';
    return Number(value).toFixed(3).replace(/\.?0+$/, '');
  };

  // Helper function to calculate today's income from transactions (excluding deposits)
  const calculateTodayIncome = (userStats: any) => {
    if (!userStats?.normalWallet?.transactions) return { total: 0, referral: 0, level: 0, other: 0 };
    
    const today = new Date().toDateString();
    const todayTransactions = userStats.normalWallet.transactions.filter((tx: any) => {
      const txDate = new Date(tx.date).toDateString();
      // Only include positive amounts and exclude deposits
      return txDate === today && tx.amount > 0 && tx.type !== 'deposit';
    });

    const income = {
      total: 0,
      referral: 0,
      level: 0,
      other: 0
    };

    todayTransactions.forEach((tx: any) => {
      income.total += tx.amount;
      
      if (tx.type === 'referral_bonus') {
        income.referral += tx.amount;
      } else if (tx.type === 'level_income') {
        income.level += tx.amount;
      } else if (tx.type !== 'deposit') {
        // Include other earned income types but exclude deposits
        income.other += tx.amount;
      }
    });

    return income;
  };

  // Helper function to calculate total income from all transactions (excluding deposits)
  const calculateTotalIncome = (userStats: any) => {
    if (!userStats?.normalWallet?.transactions) return { total: 0, referral: 0, level: 0, other: 0 };
    
    const income = {
      total: 0,
      referral: 0,
      level: 0,
      other: 0
    };

    userStats.normalWallet.transactions.forEach((tx: any) => {
      // Only count positive amounts and exclude deposits
      if (tx.amount > 0 && tx.type !== 'deposit') {
        income.total += tx.amount;
        
        if (tx.type === 'referral_bonus') {
          income.referral += tx.amount;
        } else if (tx.type === 'level_income') {
          income.level += tx.amount;
        } else if (tx.type !== 'deposit') {
          // Include other earned income types but exclude deposits
          income.other += tx.amount;
        }
      }
    });

    return income;
  };

  // Helper function to get detailed transaction breakdown
  const getDetailedTransactions = (userStats: any, type: 'today' | 'total') => {
    if (!userStats?.normalWallet?.transactions) return { referral: [], level: [], other: [] };
    
    const transactions = {
      referral: [] as any[],
      level: [] as any[],
      other: [] as any[]
    };

    userStats.normalWallet.transactions.forEach((tx: any) => {
      // Filter by date if it's today's transactions
      if (type === 'today') {
        const today = new Date().toDateString();
        const txDate = new Date(tx.date).toDateString();
        if (txDate !== today || tx.amount <= 0 || tx.type === 'deposit') return;
      } else {
        // For total, exclude deposits and negative amounts
        if (tx.amount <= 0 || tx.type === 'deposit') return;
      }

      const transactionInfo = {
        ...tx,
        formattedAmount: `$${formatNumber(tx.amount)}`,
        formattedDate: new Date(tx.date).toLocaleString(),
        typeLabel: tx.type.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())
      };

      if (tx.type === 'referral_bonus') {
        transactions.referral.push(transactionInfo);
      } else if (tx.type === 'level_income') {
        transactions.level.push(transactionInfo);
      } else {
        transactions.other.push(transactionInfo);
      }
    });

    return transactions;
  };

  // Handle level sign-in
  const handleLevelSignIn = () => {
    alert(`Level ${userStats?.referralLevel || 0} sign-in completed! Level bonus unlocked.`);
  };

  // Modal state
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updateForm, setUpdateForm] = useState({
    name: userStats?.name || '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      country: '',
      zipCode: ''
    }
  });
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateError, setUpdateError] = useState('');
  const [updateSuccess, setUpdateSuccess] = useState('');

  const handleUpdateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name in updateForm.address) {
      setUpdateForm(prev => ({
        ...prev,
        address: { ...prev.address, [name]: value }
      }));
    } else {
      setUpdateForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdateLoading(true);
    setUpdateError('');
    setUpdateSuccess('');
    try {
      const response = await updateUserProfile(updateForm);
      setUpdateSuccess('Profile updated successfully!');
      setShowUpdateModal(false);
      // Optionally update the displayed name if needed:
      // setUserStats(prev => ({ ...prev, name: response.data.user.name }));
    } catch (err: any) {
      setUpdateError(err.message || 'Failed to update profile.');
    } finally {
      setUpdateLoading(false);
    }
  };

  // Deposit Modal state
  const [showDepositModal, setShowDepositModal] = useState(false);
  // Withdrawal Modal state
  const [showWithdrawalModal, setShowWithdrawalModal] = useState(false);
  // Transfer Modal state
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [depositForm, setDepositForm] = useState({
    amount: '',
    paymentMethod: 'crypto',
    paymentId: '',
    walletType: 'normal',
    paymentProof: null as File | null,
  });
  const [withdrawalForm, setWithdrawalForm] = useState({
    amount: '',
    walletAddress: '',
  });

  // Wallet Management state
  const [showWalletSetupModal, setShowWalletSetupModal] = useState(false);
  const [showWalletChangeModal, setShowWalletChangeModal] = useState(false);
  const [walletInfo, setWalletInfo] = useState<any>(null);
  const [walletChangeRequests, setWalletChangeRequests] = useState<any[]>([]);
  const [walletForm, setWalletForm] = useState({
    walletAddress: '',
    qrCode: null as File | null,
    reason: '',
  });
  const [walletChangeForm, setWalletChangeForm] = useState({
    newWalletAddress: '',
    reason: '',
    newQrCode: null as File | null,
  });
  const [walletChangeLoading, setWalletChangeLoading] = useState(false);
  const [walletError, setWalletError] = useState('');
  const [walletSuccess, setWalletSuccess] = useState('');
  const [walletLoading, setWalletLoading] = useState(false);
  const [depositLoading, setDepositLoading] = useState(false);
  const [withdrawalLoading, setWithdrawalLoading] = useState(false);
  const [depositError, setDepositError] = useState('');
  const [depositSuccess, setDepositSuccess] = useState('');
  const [withdrawalError, setWithdrawalError] = useState('');
  const [withdrawalSuccess, setWithdrawalSuccess] = useState('');

  const handleDepositChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, files } = e.target as HTMLInputElement;
    if (name === 'paymentProof' && files) {
      setDepositForm(prev => ({ ...prev, paymentProof: files[0] }));
    } else {
      setDepositForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleWithdrawalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setWithdrawalForm(prev => ({ ...prev, [name]: value }));
  };

  const handleWithdrawalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setWithdrawalLoading(true);
    setWithdrawalError('');
    setWithdrawalSuccess('');
    try {
      console.log('Withdrawal form amount:', withdrawalForm.amount);
      console.log('Withdrawal form amount type:', typeof withdrawalForm.amount);
      
      if (!withdrawalForm.amount || isNaN(parseFloat(withdrawalForm.amount))) {
        throw new Error('Please enter a valid amount');
      }
      const amount = parseFloat(withdrawalForm.amount);
      console.log('Parsed amount:', amount);
      console.log('Parsed amount type:', typeof amount);
      
      if (amount <= 0) {
        throw new Error('Amount must be greater than 0');
      }
      
      // Check if user has wallet info set up
      if (!walletInfo?.walletInfo?.address || !walletInfo?.walletInfo?.qrCode) {
        setShowWalletSetupModal(true);
        setWithdrawalError('Please set up your payment address first');
        return;
      }
      
      // Prepare JSON data for the request
      const requestData = {
        amount: amount,
        withdrawalWalletText: walletInfo.walletInfo.address,
        withdrawalWalletImage: walletInfo.walletInfo.qrCode ? `https://api.goalsbot.com/${walletInfo.walletInfo.qrCode.replace(/\\/g, '/')}` : null
      };
      
      // Debug: Log the request data
      console.log('Request data:', requestData);
      
      const response = await fetch('https://api.goalsbot.com/withdrawal/request', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });
      
      const data = await response.json();
      if (data.success) {
        setWithdrawalSuccess('Withdrawal request submitted successfully!');
        setShowWithdrawalModal(false);
        setWithdrawalForm({ amount: '', walletAddress: '' });
        refreshWalletData();
      } else {
        setWithdrawalError(data.message || 'Failed to submit withdrawal request.');
      }
    } catch (err: any) {
      setWithdrawalError(err.message || 'Failed to submit withdrawal request.');
    } finally {
      setWithdrawalLoading(false);
    }
  };

  // Wallet management functions
  const handleWalletFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, files } = e.target as HTMLInputElement;
    if (name === 'qrCode' && files) {
      setWalletForm(prev => ({ ...prev, qrCode: files[0] }));
    } else {
      setWalletForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleWalletChangeFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, files } = e.target as HTMLInputElement;
    if (name === 'newQrCode' && files) {
      setWalletChangeForm(prev => ({ ...prev, newQrCode: files[0] }));
    } else {
      setWalletChangeForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleWalletSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    setWalletLoading(true);
    setWalletError('');
    setWalletSuccess('');
    try {
      if (!walletForm.walletAddress.trim()) {
        throw new Error('Wallet address is required');
      }
      if (!walletForm.qrCode) {
        throw new Error('QR code image is required');
      }

      const formData = new FormData();
      formData.append('walletAddress', walletForm.walletAddress.trim());
      formData.append('qrCode', walletForm.qrCode);

      const response = await fetch('https://api.goalsbot.com/users/set-wallet-info', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
        body: formData,
      });

      const data = await response.json();
      if (data.success) {
        setWalletSuccess('Payment address set successfully!');
        setShowWalletSetupModal(false);
        setWalletForm({ walletAddress: '', qrCode: null, reason: '' });
        // Refresh wallet info
        const walletResponse = await fetch('https://api.goalsbot.com/users/wallet-info', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          },
        });
        const walletData = await walletResponse.json();
        if (walletData.success) {
          setWalletInfo(walletData.data);
        }
      } else {
        setWalletError(data.message || 'Failed to set wallet information.');
      }
    } catch (err: any) {
      setWalletError(err.message || 'Failed to set wallet information.');
    } finally {
      setWalletLoading(false);
    }
  };

  const handleWalletChangeRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setWalletChangeLoading(true);
    setWalletError('');
    setWalletSuccess('');
    try {
      if (!walletChangeForm.newWalletAddress.trim()) {
        throw new Error('New wallet address is required');
      }
      if (!walletChangeForm.reason.trim()) {
        throw new Error('Reason for change is required');
      }
      if (!walletChangeForm.newQrCode) {
        throw new Error('New QR code image is required');
      }

      const formData = new FormData();
      formData.append('newWalletAddress', walletChangeForm.newWalletAddress.trim());
      formData.append('reason', walletChangeForm.reason.trim());
      formData.append('newQrCode', walletChangeForm.newQrCode);

      const response = await fetch('https://api.goalsbot.com/users/request-wallet-change', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
        body: formData,
      });

      const data = await response.json();
      if (data.success) {
        setWalletSuccess('Wallet change request submitted successfully!');
        setShowWalletChangeModal(false);
        setWalletChangeForm({ newWalletAddress: '', reason: '', newQrCode: null });
      } else {
        setWalletError(data.message || 'Failed to submit wallet change request.');
      }
    } catch (err: any) {
      setWalletError(err.message || 'Failed to submit wallet change request.');
    } finally {
      setWalletChangeLoading(false);
    }
  };

  const handleDepositSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setDepositLoading(true);
    setDepositError('');
    setDepositSuccess('');
    try {
      if (!depositForm.paymentProof) throw new Error('Payment proof is required');
      if (!depositForm.amount || isNaN(parseFloat(depositForm.amount))) {
        throw new Error('Please enter a valid amount');
      }
      const amount = parseFloat(depositForm.amount);
      if (amount <= 0) {
        throw new Error('Amount must be greater than 0');
      }
      
      const response = await createDeposit({
        amount: amount,
        paymentMethod: depositForm.paymentMethod,
        paymentId: depositForm.paymentId,
        walletType: depositForm.walletType,
        paymentProof: depositForm.paymentProof,
      });
      setDepositSuccess('Deposit request submitted!');
      setShowDepositModal(false);
      setDepositForm({ amount: '', paymentMethod: 'crypto', paymentId: '', walletType: 'normal', paymentProof: null });
    } catch (err: any) {
      setDepositError(err.message || 'Failed to submit deposit.');
    } finally {
      setDepositLoading(false);
    }
  };

  // Show loading state if profile is being fetched
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        {/* Header skeleton */}
        <div className="relative">
          <div className="h-72 bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-700 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/60 via-purple-800/40 to-transparent"></div>
            <div className="absolute bottom-4 left-4 right-4">
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/20">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl animate-pulse"></div>
                  <div className="space-y-2">
                    <div className="h-4 w-32 bg-white/20 rounded animate-pulse"></div>
                    <div className="h-3 w-24 bg-white/20 rounded animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content skeleton */}
        <div className="px-4 sm:px-6 mt-0 relative pb-8">
          {/* Quick actions skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            <StatsCardSkeleton />
            <StatsCardSkeleton />
          </div>

          {/* Stats grid skeleton */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-white/80 backdrop-blur-xl rounded-2xl p-4 sm:p-5 shadow-xl border border-white/50">
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-200 rounded-xl animate-pulse"></div>
                  <div className="space-y-2 w-full">
                    <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Cards skeleton */}
          <div className="space-y-6">
            <CardSkeleton />
            <CardSkeleton />
          </div>
        </div>
      </div>
    );
  }

  const [showStatusPopup, setShowStatusPopup] = useState(false);
  const [statusLoading, setStatusLoading] = useState(false);
  const [statusError, setStatusError] = useState('');
  const [statusData, setStatusData] = useState<null | {
    canClaim: boolean;
    message: string;
    myDailyIncome: number;
    potentialDailyIncome: number;
    normalWalletBalance: number;
    totalEarned: number;
    lastClaimed: string;
  }>(null);

  const handleStatusCheck = async () => {
    setShowStatusPopup(true);
    setStatusLoading(true);
    setStatusError('');
    setStatusData(null);
    try {
      const response = await getDailyIncomeStatus();
      setStatusData(response.data);
    } catch (err: any) {
      setStatusError(err.message || 'Failed to fetch status');
    } finally {
      setStatusLoading(false);
    }
  };

  const [showTransferSection, setShowTransferSection] = useState(false);
  const [transferInput, setTransferInput] = useState('');
  const [transferUser, setTransferUser] = useState<any>(null);
  const [transferError, setTransferError] = useState('');
  const [transferLoading, setTransferLoading] = useState(false);
  const [transferAmount, setTransferAmount] = useState('');
  const [transferSubmitLoading, setTransferSubmitLoading] = useState(false);
  const [transferSubmitError, setTransferSubmitError] = useState('');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Premium Header with Original Image */}
      <div className="relative">
        <div className="h-72 relative overflow-hidden">
          <img 
            src="https://arc-anglerfish-washpost-prod-washpost.s3.amazonaws.com/public/JSECRUQUPEI6PAZ4KA7B6Y4UZE.jpg" 
            alt="Resort" 
            className="w-full h-full object-cover"
          />
          {/* Subtle overlay for better text readability */}
          <div className="absolute inset-0 bg-black/20"></div>
        </div>
      </div>

              {/* Premium Quick Actions */}
        <div className="px-4 sm:px-6 mt-0 relative pb-8">
          {/* Total Balance Card */}
          <div className="bg-white/90 backdrop-blur-xl rounded-xl p-4 shadow-lg border border-white/60 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-md">
                  <Wallet className="w-5 h-5 text-white" />
                </div>
                <div>
                  <span className="font-bold text-gray-800 text-base">Total Balance</span>
                  <p className="text-xs text-gray-600">Investment + Wallet</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-indigo-600">
                  ${((userStats?.investmentWallet?.balance || 0) + (userStats?.normalWallet?.balance || 0)).toFixed(2)}
                </div>
                <div className="text-xs text-gray-500">
                  ${(userStats?.investmentWallet?.balance || 0).toFixed(2)} + ${(userStats?.normalWallet?.balance || 0).toFixed(2)}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
            <div className="group bg-white/90 backdrop-blur-xl rounded-xl p-4 shadow-lg border border-white/60 hover:shadow-xl hover:bg-white/95 transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-md">
                  <Plus className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="font-bold text-gray-800 text-base">Deposit</span>
                  <p className="text-xs text-gray-600">Add funds instantly</p>
                </div>
                <button
                  className="px-3 py-1.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-lg hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300 text-xs font-semibold shadow-md hover:shadow-lg"
                  onClick={() => setShowDepositModal(true)}
                >
                  Deposit
                </button>
              </div>
            </div>
            <div className="group bg-white/90 backdrop-blur-xl rounded-xl p-4 shadow-lg border border-white/60 hover:shadow-xl hover:bg-white/95 transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-md">
                  <Minus className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="font-bold text-gray-800 text-base">Withdraw</span>
                  <p className="text-xs text-gray-600">Withdraw to your wallet</p>
                </div>
                <button
                  onClick={() => setShowWithdrawalModal(true)}
                  className="px-3 py-1.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-300 text-xs font-semibold shadow-md hover:shadow-lg"
                >
                  Withdraw
                </button>
              </div>
            </div>
            <div className="group bg-white/90 backdrop-blur-xl rounded-xl p-4 shadow-lg border border-white/60 hover:shadow-xl hover:bg-white/95 transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-md">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/>
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <span className="font-bold text-gray-800 text-base">Transfer</span>
                  <p className="text-xs text-gray-600">Move funds between wallets</p>
                </div>
                <button
                  onClick={() => setShowTransferSection(true)}
                  className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 text-xs font-semibold shadow-md hover:shadow-lg"
                >
                  Transfer
                </button>
              </div>
            </div>
          </div>

        {/* Premium Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-8">
          <div 
            className="group bg-white/80 backdrop-blur-xl rounded-2xl p-4 sm:p-5 shadow-xl border border-white/50 hover:shadow-2xl hover:bg-white/90 transition-all duration-300 hover:-translate-y-1 cursor-pointer"
            onClick={() => {
              setSelectedIncomeType('today');
              setShowIncomeDetailsModal(true);
            }}
          >
            <div className="flex flex-col items-center text-center space-y-2 sm:space-y-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Star className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-emerald-600 mb-1">${formatNumber(calculateTodayIncome(userStats).total)}</div>
              <div className="text-xs sm:text-sm text-gray-600 font-medium">Today Income</div>
              <div className="text-xs text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity">Tap for details</div>
            </div>
          </div>
          <div 
            className="group bg-white/80 backdrop-blur-xl rounded-2xl p-4 sm:p-5 shadow-xl border border-white/50 hover:shadow-2xl hover:bg-white/90 transition-all duration-300 hover:-translate-y-1 cursor-pointer"
            onClick={() => {
              setSelectedIncomeType('total');
              setShowIncomeDetailsModal(true);
            }}
          >
            <div className="flex flex-col items-center text-center space-y-2 sm:space-y-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Wallet className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-blue-600 mb-1">{formatNumber(calculateTotalIncome(userStats).total)}</div>
              <div className="text-xs sm:text-sm text-gray-600 font-medium">Total Income</div>
              <div className="text-xs text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity">Tap for details</div>
            </div>
          </div>
          {/* <div className="group bg-white/80 backdrop-blur-xl rounded-2xl p-4 sm:p-5 shadow-xl border border-white/50 hover:shadow-2xl hover:bg-white/90 transition-all duration-300 hover:-translate-y-1">
            <div className="flex flex-col items-center text-center space-y-2 sm:space-y-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Crown className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="text-xl sm:text-2xl font-bold text-purple-600 mb-1">Level {userStats?.referralLevel || 0}</div>
              <div className="text-xs sm:text-sm text-gray-600 font-medium">VIP Level</div>
            </div>
          </div> */}
          {/* <div className="group bg-white/80 backdrop-blur-xl rounded-2xl p-4 sm:p-5 shadow-xl border border-white/50 hover:shadow-2xl hover:bg-white/90 transition-all duration-300 hover:-translate-y-1">
            <div className="flex flex-col items-center text-center space-y-2 sm:space-y-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0-6C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/>
                </svg>
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-indigo-700 mb-1">
                ${formatNumber(userStats?.investmentWallet?.balance)}
              </div>
              <div className="text-xs sm:text-sm text-gray-600 font-medium">My InvestWallet Balance</div>
              <div className="text-xs sm:text-sm text-gray-500 mt-1 text-center">
                You can use this balance for investment purposes.
              </div>
            </div>
          </div> */}
          {/* New Normal Wallet Balance Card */}
          <div className="group bg-white/80 backdrop-blur-xl rounded-2xl p-4 sm:p-5 shadow-xl border border-white/50 hover:shadow-2xl hover:bg-white/90 transition-all duration-300 hover:-translate-y-1">
            <div className="flex flex-col items-center text-center space-y-2 sm:space-y-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Wallet className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-blue-600 mb-1">
                ${formatNumber(userStats?.normalWallet?.balance)}
              </div>
              <div className="text-xs sm:text-sm text-gray-600 font-medium">Wallet Balance</div>
            </div>
          </div>
        </div>

        {/* Premium Action Cards */}
        <div className="space-y-4 sm:space-y-6">
          {/* Daily Sign-in Card */}
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/50">
            <div className="flex items-center mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-gray-800 text-lg">Daily Level Income</h3>
                  <p className="text-sm text-gray-600">Claim your daily rewards</p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Daily Bonus Card */}
              {/* <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-xl p-4 border border-emerald-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                      <Gift className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold text-emerald-800">Daily Bonus</div>
                      <div className="text-sm text-emerald-600">$10 - $50</div>
                    </div>
                  </div>
                </div>
                <div className="text-xs text-emerald-700 mb-3">
                  Claim your daily income reward. Available once per day.
                </div>
                <button
                  onClick={handleDailyIncomeClaim}
                  disabled={dailySignInLoading}
                  className="w-full px-3 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-lg hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300 font-medium shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  {dailySignInLoading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Claiming...</span>
                    </div>
                  ) : (
                    'Claim Daily'
                  )}
                </button>
              </div> */}
              
              {/* Level Bonus Card */}
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                      <Target className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold text-blue-800">Level Bonus</div>
                      {/* <div className="text-sm text-blue-600">Level {userStats?.referralLevel || 0} rewards</div> */}
                    </div>
                  </div>
                </div>
                <div className="text-xs text-blue-700 mb-3">
                  Claim your level-based income reward. Based on your current level.
                </div>
                <button
                  onClick={handleLevelIncomeClaim}
                  disabled={dailySignInLoading}
                  className="w-full px-3 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 font-medium shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  {dailySignInLoading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Claiming...</span>
                    </div>
                  ) : (
                    'Claim Level'
                  )}
                </button>
              </div>
            </div>
          </div>



          {/* Lucky Draw Section */}
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/50">
            <div className="flex items-center mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-white" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-gray-800 text-lg">Lucky Draw</h3>
                  <p className="text-sm text-gray-600">Join draws and win prizes</p>
                </div>
              </div>
            </div>

            {/* Lucky Draw Stats */}
            {luckyDrawStats && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-3 border border-green-200">
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-600">{luckyDrawStats.totalParticipated}</div>
                    <div className="text-xs text-green-600">Participated</div>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-3 border border-blue-200">
                  <div className="text-center">
                    <div className="text-lg font-bold text-blue-600">{luckyDrawStats.totalWon}</div>
                    <div className="text-xs text-blue-600">Won</div>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-3 border border-purple-200">
                  <div className="text-center">
                    <div className="text-lg font-bold text-purple-600">{formatCurrency(luckyDrawStats.totalPrizeAmount)}</div>
                    <div className="text-xs text-purple-600">Total Won</div>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl p-3 border border-orange-200">
                  <div className="text-center">
                    <div className="text-lg font-bold text-orange-600">{luckyDrawStats.winRate}%</div>
                    <div className="text-xs text-orange-600">Win Rate</div>
                  </div>
                </div>
              </div>
            )}

            {/* Unclaimed Prizes */}
            {unclaimedPrizes.length > 0 && (
              <div className="mb-6">
                <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                  <GiftIcon className="w-4 h-4 mr-2 text-orange-500" />
                  Unclaimed Prizes ({unclaimedPrizes.length})
                </h4>
                <div className="space-y-3">
                  {unclaimedPrizes.map((prize) => (
                    <div key={prize.luckyDrawId} className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl p-4 border border-orange-200">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="font-semibold text-orange-800">{prize.title}</div>
                          <div className="text-sm text-orange-600">{prize.description}</div>
                          <div className="text-xs text-orange-500">Draw Date: {formatDate(prize.drawDate)}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-orange-600">{formatCurrency(prize.prizeAmount)}</div>
                          <button
                            onClick={() => handleClaimPrize(prize.luckyDrawId)}
                            disabled={!prize.canClaim}
                            className="mt-2 px-3 py-1 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-300 font-medium shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed text-xs"
                          >
                            {prize.canClaim ? 'Claim Prize' : 'Cannot Claim'}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Active Lucky Draws */}
            <div>
              <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                <Users className="w-4 h-4 mr-2 text-blue-500" />
                Active Lucky Draws ({activeLuckyDraws.length})
              </h4>
              {luckyDrawLoading ? (
                <div className="space-y-3">
                  {[1, 2].map((i) => (
                    <div key={i} className="bg-gray-100 rounded-xl p-4 animate-pulse">
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded mb-1"></div>
                      <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                    </div>
                  ))}
                </div>
              ) : activeLuckyDraws.length > 0 ? (
                <div className="space-y-3">
                  {activeLuckyDraws.map((luckyDraw) => (
                    <div key={luckyDraw._id} className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex-1">
                          <div className="font-semibold text-blue-800">{luckyDraw.title}</div>
                          <div className="text-sm text-blue-600">{luckyDraw.description}</div>
                          <div className="text-xs text-blue-500">
                            Ends: {formatDate(luckyDraw.endDate)} • Draw: {formatDate(luckyDraw.drawDate)}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-blue-600">{formatCurrency(luckyDraw.amount)}</div>
                          <div className="text-xs text-blue-500">
                            {luckyDraw.currentParticipants}/{luckyDraw.maxParticipants} participants
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="text-xs text-blue-600">
                          {luckyDraw.userParticipation.isParticipant ? (
                            <span className="text-green-600">✓ Already Joined</span>
                          ) : luckyDraw.userParticipation.canJoin ? (
                            <span className="text-blue-600">Available to join</span>
                          ) : (
                            <span className="text-red-600">{luckyDraw.userParticipation.joinReason}</span>
                          )}
                        </div>
                        {!luckyDraw.userParticipation.isParticipant && luckyDraw.userParticipation.canJoin && (
                          <button
                            onClick={() => handleJoinLuckyDraw(luckyDraw._id)}
                            className="px-3 py-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 font-medium shadow-lg hover:shadow-xl text-xs"
                          >
                            Join Draw
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-gray-500">
                  <Trophy className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                  <p>No active lucky draws available</p>
                  <p className="text-sm">Check back later for new opportunities!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Update Profile Modal */}
      {showUpdateModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md relative pb-24">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-700"
              onClick={() => setShowUpdateModal(false)}
            >
              &times;
            </button>
            <h2 className="text-xl font-bold mb-4">Update Profile</h2>
            {updateError && <div className="mb-2 text-red-600">{updateError}</div>}
            {updateSuccess && <div className="mb-2 text-green-600">{updateSuccess}</div>}
            <form onSubmit={handleUpdateSubmit} className="space-y-4 pb-24">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={updateForm.name}
                  onChange={handleUpdateChange}
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Phone</label>
                <input
                  type="text"
                  name="phone"
                  value={updateForm.phone}
                  onChange={handleUpdateChange}
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Street</label>
                <input
                  type="text"
                  name="street"
                  value={updateForm.address.street}
                  onChange={handleUpdateChange}
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm font-medium mb-1">City</label>
                  <input
                    type="text"
                    name="city"
                    value={updateForm.address.city}
                    onChange={handleUpdateChange}
                    className="w-full border rounded px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">State</label>
                  <input
                    type="text"
                    name="state"
                    value={updateForm.address.state}
                    onChange={handleUpdateChange}
                    className="w-full border rounded px-3 py-2"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm font-medium mb-1">Country</label>
                  <input
                    type="text"
                    name="country"
                    value={updateForm.address.country}
                    onChange={handleUpdateChange}
                    className="w-full border rounded px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Zip Code</label>
                  <input
                    type="text"
                    name="zipCode"
                    value={updateForm.address.zipCode}
                    onChange={handleUpdateChange}
                    className="w-full border rounded px-3 py-2"
                    required
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2 mt-4">
                <button
                  type="button"
                  className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                  onClick={() => setShowUpdateModal(false)}
                  disabled={updateLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700"
                  disabled={updateLoading}
                >
                  {updateLoading ? 'Updating...' : 'Update'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Daily Sign-in Modal */}
      {showDailySignInModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md relative">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-700"
              onClick={() => setShowDailySignInModal(false)}
              disabled={dailySignInLoading}
            >
              &times;
            </button>
            <h2 className="text-xl font-bold mb-4 text-center">Claim Your Rewards</h2>
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-xl p-4 border border-emerald-200 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                    <Gift className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-emerald-800">Daily Bonus</div>
                    <div className="text-sm text-emerald-600">$10 - $50</div>
                  </div>
                </div>
                <button
                  className="px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-lg font-medium shadow hover:from-yellow-500 hover:to-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={handleDailyIncomeClaim}
                  disabled={dailySignInLoading}
                >
                  {dailySignInLoading ? 'Claiming...' : 'Claim Daily'}
                </button>
              </div>
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                    <Target className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-blue-800">Level Bonus</div>
                    <div className="text-sm text-blue-600">Extra rewards</div>
                  </div>
                </div>
                <button
                  className="px-4 py-2 bg-gradient-to-r from-blue-400 to-purple-500 text-white rounded-lg font-medium shadow hover:from-blue-500 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={handleLevelIncomeClaim}
                  disabled={dailySignInLoading}
                >
                  {dailySignInLoading ? 'Claiming...' : 'Claim Level'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Deposit Modal */}
      {showDepositModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xs sm:max-w-md p-4 sm:p-8 relative pb-24 overflow-y-auto max-h-[90vh]">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-700"
              onClick={() => setShowDepositModal(false)}
            >
              &times;
            </button>
            <h2 className="text-lg sm:text-xl font-bold mb-4">Deposit Funds</h2>
            {depositError && <div className="mb-2 text-red-600 text-sm">{depositError}</div>}
            {depositSuccess && <div className="mb-2 text-green-600 text-sm">{depositSuccess}</div>}
            <form onSubmit={handleDepositSubmit} className="space-y-4" encType="multipart/form-data">
              <div>
                <label className="block text-sm font-medium mb-1">Amount</label>
                <input
                  type="number"
                  name="amount"
                  value={depositForm.amount}
                  onChange={handleDepositChange}
                  className="w-full border rounded px-3 py-2 text-base"
                  required
                />
              </div>
              {/* Payment method - always crypto */}
              <div className="mb-2">
                <label className="block text-sm font-medium mb-1">Payment Method</label>
                <div className="w-full border rounded px-3 py-2 bg-gray-100 text-gray-700 font-medium text-base">Crypto Payment</div>
              </div>
              {/* Crypto wallet QR code section */}
              <div className="flex flex-col items-center mb-2 w-full">
                <label className="block text-base font-semibold mb-2 text-center w-full">Crypto Wallet</label>
                {isLoadingCryptoData ? (
                  <div className="w-full max-w-[180px] aspect-square bg-gray-100 rounded border flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : cryptoWalletData ? (
                  <>
                    {cryptoWalletData.imageUrl && (
                      <div className="mb-4 w-full flex justify-center">
                        <img
                          src={`https://api.goalsbot.com${cryptoWalletData.imageUrl}`}
                          alt="Crypto Wallet QR Code"
                          className="w-full max-w-[180px] aspect-square rounded border object-contain bg-white"
                        />
                      </div>
                    )}
                    <div className="text-center mb-4 w-full">
                      <p className="text-sm text-gray-600 font-medium mb-2">Wallet ID:</p>
                      <div className="flex items-center justify-center space-x-2 bg-gray-100 px-3 py-2 rounded-lg w-full max-w-xs mx-auto">
                        <p className="text-base text-gray-800 font-mono break-all">{cryptoWalletData.textData}</p>
                        <button
                          type="button"
                          onClick={() => copyWalletId(cryptoWalletData.textData)}
                          className="text-blue-600 hover:text-blue-800 transition-colors flex-shrink-0"
                          title="Copy wallet ID"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="text-center mb-2">
                      <span className="text-xs text-gray-500">Scan QR code or copy wallet ID to pay</span>
                    </div>
                  </>
                ) : (
                  <div className="w-full max-w-[180px] aspect-square bg-gray-100 rounded border flex items-center justify-center">
                    <span className="text-xs text-gray-500 text-center px-2">No crypto wallet data available</span>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Payment ID</label>
                <input
                  type="text"
                  name="paymentId"
                  value={depositForm.paymentId}
                  onChange={handleDepositChange}
                  className="w-full border rounded px-3 py-2 text-base"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Wallet Type</label>
                <select
                  name="walletType"
                  value={depositForm.walletType}
                  onChange={handleDepositChange}
                  className="w-full border rounded px-3 py-2 text-base"
                  required
                >
                  <option value="normal">Normal Wallet</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Payment Proof (Image)</label>
                <input
                  type="file"
                  name="paymentProof"
                  accept="image/*"
                  onChange={handleDepositChange}
                  className="w-full border rounded px-3 py-2 text-base"
                  required
                />
              </div>
              <div className="flex flex-col gap-2 sm:flex-row sm:gap-4 justify-end mt-4 mb-2">
                <button
                  type="button"
                  className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 w-full sm:w-auto"
                  onClick={() => setShowDepositModal(false)}
                  disabled={depositLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700 w-full sm:w-auto"
                  disabled={depositLoading}
                >
                  {depositLoading ? 'Submitting...' : 'Submit'}
                </button>
              </div>
              <div className="mb-4" />
            </form>
          </div>
        </div>
      )}

      {showStatusPopup && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-xs relative">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-700"
              onClick={() => setShowStatusPopup(false)}
            >
              &times;
            </button>
            <h2 className="text-lg font-bold mb-2 text-center">Daily Income Status</h2>
            {statusLoading ? (
              <div className="text-gray-500 text-center">Checking status...</div>
            ) : statusError ? (
              <div className="text-red-600 text-center">{statusError}</div>
            ) : statusData ? (
              <div className="space-y-2">
                <div className={`font-semibold text-center ${statusData.canClaim ? 'text-emerald-600' : 'text-gray-700'}`}>{statusData.message}</div>
                <div className="text-xs text-gray-600">Today's Income: <b>${statusData.myDailyIncome}</b></div>
                <div className="text-xs text-gray-600">Potential: <b>${statusData.potentialDailyIncome}</b></div>
                <div className="text-xs text-gray-600">Wallet: <b>${statusData.normalWalletBalance}</b></div>
                <div className="text-xs text-gray-600">Total Earned: <b>${statusData.totalEarned}</b></div>
                <div className="text-xs text-gray-500">Last Claimed: {statusData.lastClaimed ? new Date(statusData.lastClaimed).toLocaleString() : '-'}</div>
              </div>
            ) : null}
          </div>
        </div>
      )}

      {showTransferSection && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md relative">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-700"
              onClick={() => setShowTransferSection(false)}
            >
              &times;
            </button>
            <h2 className="text-xl font-bold mb-4">Transfer to User</h2>
            <input
              type="text"
              placeholder="Enter Referral Code or User ID"
              value={transferInput}
              onChange={e => setTransferInput(e.target.value)}
              className="w-full border rounded px-3 py-2 mb-2"
            />
            <button
              onClick={async () => {
                setTransferLoading(true);
                setTransferError('');
                setTransferUser(null);
                try {
                  const res = await fetch(`https://api.goalsbot.com/users/user-by-referral/${transferInput}`, {
                    headers: {
                      'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                    },
                  });
                  const data = await res.json();
                  if (data.success) {
                    setTransferUser(data.data);
                  } else {
                    setTransferError(data.message || 'User not found');
                  }
                } catch {
                  setTransferError('Network error');
                } finally {
                  setTransferLoading(false);
                }
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded"
              disabled={transferLoading || !transferInput}
            >
              {transferLoading ? 'Searching...' : 'Find User'}
            </button>
            {transferError && <div className="text-red-600 mt-2">{transferError}</div>}
            {transferUser && (
              <div className="mt-4 p-4 bg-gray-50 rounded border">
                <div><b>Name:</b> {transferUser.name}</div>
                <div><b>Email:</b> {transferUser.email}</div>
                <div><b>Referral Code:</b> {transferUser.referralCode}</div>
                <div className="mt-4">
                  <label className="block text-sm font-medium mb-1">Amount to Transfer</label>
                  <input
                    type="number"
                    min="1"
                    value={transferAmount}
                    onChange={e => setTransferAmount(e.target.value)}
                    className="w-full border rounded px-3 py-2 mb-2"
                    placeholder="Enter amount"
                  />
                  <button
                    onClick={async () => {
                      setTransferSubmitLoading(true);
                      setTransferSubmitError('');
                      try {
                        const res = await fetch('https://api.goalsbot.com/users/transfer-to-user', {
                          method: 'POST',
                          headers: {
                            'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                            'Content-Type': 'application/json',
                          },
                          body: JSON.stringify({
                            fromWallet: 'normalWallet', // always use this value
                            referralCode: transferUser.referralCode,
                            amount: Number(transferAmount),
                          }),
                        });
                        const data = await res.json();
                        if (data.success) {
                          window.location.reload();
                        } else {
                          setTransferSubmitError(data.message || 'Transfer failed');
                        }
                      } catch {
                        setTransferSubmitError('Network error');
                      } finally {
                        setTransferSubmitLoading(false);
                      }
                    }}
                    className="bg-green-600 text-white px-4 py-2 rounded"
                    disabled={transferSubmitLoading || !transferAmount || Number(transferAmount) <= 0}
                  >
                    {transferSubmitLoading ? 'Transferring...' : 'Transfer'}
                  </button>
                  {transferSubmitError && <div className="text-red-600 mt-2">{transferSubmitError}</div>}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Withdrawal Modal */}
      {showWithdrawalModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xs sm:max-w-md p-4 sm:p-8 relative pb-24 overflow-y-auto max-h-[90vh]">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-700"
              onClick={() => setShowWithdrawalModal(false)}
            >
              &times;
            </button>
            <h2 className="text-lg sm:text-xl font-bold mb-4">Withdraw Funds</h2>
            {withdrawalError && <div className="mb-2 text-red-600 text-sm">{withdrawalError}</div>}
            {withdrawalSuccess && <div className="mb-2 text-green-600 text-sm">{withdrawalSuccess}</div>}
            
            {/* Wallet Information Display */}
            {walletInfo?.walletInfo && walletInfo.walletInfo.address && walletInfo.walletInfo.qrCode ? (
              <div className="mb-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-800 mb-2">Your Wallet Information</h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-blue-600">Address:</span>
                    <div className="font-mono text-blue-800 break-all">{walletInfo.walletInfo.address}</div>
                  </div>
                  {walletInfo.walletInfo.qrCode && (
                    <div>
                      <span className="text-blue-600">QR Code:</span>
                      <img 
                        src={`https://api.goalsbot.com/${walletInfo.walletInfo.qrCode.replace(/\\/g, '/')}`} 
                        alt="Wallet QR Code" 
                        className="w-24 h-24 mt-1 border rounded"
                      />
                    </div>
                  )}
                  <div>
                    <span className="text-blue-600">Status:</span>
                    <span className={`ml-1 px-2 py-1 rounded text-xs ${
                      walletInfo.walletInfo.isVerified ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {walletInfo.walletInfo.isVerified ? 'Verified' : 'Pending Verification'}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setShowWithdrawalModal(false);
                    setShowWalletChangeModal(true);
                  }}
                  className="mt-3 text-sm text-blue-600 hover:text-blue-800 underline"
                >
                  Change Wallet Information
                </button>
              </div>
            ) : (
              <div className="mb-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h3 className="font-semibold text-yellow-800 mb-2">Payment Address Setup Required</h3>
                <p className="text-sm text-yellow-700 mb-3">
                  You need to set up your payment address before making withdrawals.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setShowWithdrawalModal(false);
                    setShowWalletSetupModal(true);
                  }}
                  className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
                >
                  Set Up Payment Address
                </button>
              </div>
            )}
            
            <form onSubmit={handleWithdrawalSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Amount</label>
                <input
                  type="number"
                  name="amount"
                  value={withdrawalForm.amount}
                  onChange={handleWithdrawalChange}
                  className="w-full border rounded px-3 py-2 text-base"
                  placeholder="Enter amount to withdraw"
                  required
                  min="0.01"
                  step="0.01"
                />
                <p className="text-xs text-gray-500 mt-1">Enter the amount you want to withdraw</p>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p className="text-sm text-yellow-800">
                  <strong>Note:</strong> Withdrawal will be sent to your registered wallet address. Withdrawals may take 24-48 hours to process.
                </p>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row sm:gap-4 justify-end mt-4 mb-2">
                <button
                  type="button"
                  className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 w-full sm:w-auto"
                  onClick={() => setShowWithdrawalModal(false)}
                  disabled={withdrawalLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 w-full sm:w-auto"
                  disabled={withdrawalLoading || !walletInfo?.walletInfo?.address || !walletInfo?.walletInfo?.qrCode}
                >
                  {withdrawalLoading ? 'Submitting...' : 'Submit Withdrawal'}
                </button>
              </div>
              <div className="mb-4" />
            </form>
          </div>
        </div>
      )}

      {/* Wallet Setup Modal */}
      {showWalletSetupModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xs sm:max-w-md p-4 sm:p-8 relative pb-24 overflow-y-auto max-h-[90vh]">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-700"
              onClick={() => setShowWalletSetupModal(false)}
            >
              &times;
            </button>
            <h2 className="text-lg sm:text-xl font-bold mb-4">Set Up Payment Address</h2>
            {walletError && <div className="mb-2 text-red-600 text-sm">{walletError}</div>}
            {walletSuccess && <div className="mb-2 text-green-600 text-sm">{walletSuccess}</div>}
            
            <form onSubmit={handleWalletSetup} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Payment Address</label>
                <input
                  type="text"
                  name="walletAddress"
                  value={walletForm.walletAddress}
                  onChange={handleWalletFormChange}
                  className="w-full border rounded px-3 py-2 text-base"
                  placeholder="Enter your payment address"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Payment QR Code</label>
                <input
                  type="file"
                  name="qrCode"
                  accept="image/*"
                  onChange={handleWalletFormChange}
                  className="w-full border rounded px-3 py-2 text-base"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Upload a clear image of your payment QR code</p>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-blue-800">
                  <strong>Important:</strong> This wallet information will be used for all future withdrawals. Make sure the information is correct.
                </p>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row sm:gap-4 justify-end mt-4 mb-2">
                <button
                  type="button"
                  className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 w-full sm:w-auto"
                  onClick={() => setShowWalletSetupModal(false)}
                  disabled={walletLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 w-full sm:w-auto"
                  disabled={walletLoading}
                >
                  {walletLoading ? 'Setting Up...' : 'Set Up Payment Address'}
                </button>
              </div>
              <div className="mb-4" />
            </form>
          </div>
        </div>
      )}

      {/* Wallet Change Request Modal */}
      {showWalletChangeModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xs sm:max-w-md p-4 sm:p-8 relative pb-24 overflow-y-auto max-h-[90vh]">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-700"
              onClick={() => setShowWalletChangeModal(false)}
            >
              &times;
            </button>
            <h2 className="text-lg sm:text-xl font-bold mb-4">Request Wallet Change</h2>
            {walletError && <div className="mb-2 text-red-600 text-sm">{walletError}</div>}
            {walletSuccess && <div className="mb-2 text-green-600 text-sm">{walletSuccess}</div>}
            
            {/* Current Wallet Info */}
            {walletInfo?.walletInfo && (
              <div className="mb-4 bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-2">Current Wallet</h3>
                <div className="text-sm text-gray-600">
                  <div className="font-mono break-all">{walletInfo.walletInfo.address}</div>
                </div>
              </div>
            )}
            
            <form onSubmit={handleWalletChangeRequest} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">New Wallet Address</label>
                <input
                  type="text"
                  name="newWalletAddress"
                  value={walletChangeForm.newWalletAddress}
                  onChange={handleWalletChangeFormChange}
                  className="w-full border rounded px-3 py-2 text-base"
                  placeholder="Enter new wallet address"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">New QR Code Image</label>
                <input
                  type="file"
                  name="newQrCode"
                  accept="image/*"
                  onChange={handleWalletChangeFormChange}
                  className="w-full border rounded px-3 py-2 text-base"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Upload a clear image of your new wallet's QR code</p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Reason for Change</label>
                <textarea
                  name="reason"
                  value={walletChangeForm.reason}
                  onChange={handleWalletChangeFormChange}
                  className="w-full border rounded px-3 py-2 text-base"
                  placeholder="Explain why you need to change your wallet"
                  rows={3}
                  required
                />
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p className="text-sm text-yellow-800">
                  <strong>Note:</strong> Wallet change requests require admin approval and may take 24-48 hours to process.
                </p>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row sm:gap-4 justify-end mt-4 mb-2">
                <button
                  type="button"
                  className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 w-full sm:w-auto"
                  onClick={() => setShowWalletChangeModal(false)}
                  disabled={walletChangeLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-orange-600 text-white hover:bg-orange-700 w-full sm:w-auto"
                  disabled={walletChangeLoading}
                >
                  {walletChangeLoading ? 'Submitting...' : 'Submit Request'}
                </button>
              </div>
              <div className="mb-4" />
            </form>
          </div>
        </div>
      )}

      {/* Income Details Modal */}
      {showIncomeDetailsModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/50 w-full max-w-4xl max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white relative">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                    <BarChart3 className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">
                      {selectedIncomeType === 'today' ? 'Today\'s Income' : 'Total Income'} Details
                    </h3>
                    <p className="text-sm text-white/80">
                      Detailed breakdown of your {selectedIncomeType === 'today' ? 'today\'s' : 'total'} earnings
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowIncomeDetailsModal(false)}
                  className="w-8 h-8 bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-lg flex items-center justify-center transition-all duration-200"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              {(() => {
                const incomeData = selectedIncomeType === 'today' ? calculateTodayIncome(userStats) : calculateTotalIncome(userStats);
                const detailedTransactions = getDetailedTransactions(userStats, selectedIncomeType);
                
                return (
                  <div className="space-y-6">
                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-xl p-4 border border-emerald-200">
                        <div className="flex items-center space-x-3 mb-2">
                          <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                            <Star className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <div className="font-semibold text-emerald-800">Referral Income</div>
                            <div className="text-lg font-bold text-emerald-600">${formatNumber(incomeData.referral)}</div>
                          </div>
                        </div>
                        <div className="text-xs text-emerald-700">
                          {detailedTransactions.referral.length} transaction{detailedTransactions.referral.length !== 1 ? 's' : ''}
                        </div>
                      </div>

                      <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
                        <div className="flex items-center space-x-3 mb-2">
                          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                            <Crown className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <div className="font-semibold text-blue-800">Level Income</div>
                            <div className="text-lg font-bold text-blue-600">${formatNumber(incomeData.level)}</div>
                          </div>
                        </div>
                        <div className="text-xs text-blue-700">
                          {detailedTransactions.level.length} transaction{detailedTransactions.level.length !== 1 ? 's' : ''}
                        </div>
                      </div>

                      <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
                        <div className="flex items-center space-x-3 mb-2">
                          <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                            <Award className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <div className="font-semibold text-purple-800">Other Income</div>
                            <div className="text-lg font-bold text-purple-600">${formatNumber(incomeData.other)}</div>
                          </div>
                        </div>
                        <div className="text-xs text-purple-700">
                          {detailedTransactions.other.length} transaction{detailedTransactions.other.length !== 1 ? 's' : ''}
                        </div>
                      </div>
                    </div>

                    {/* Total Summary */}
                    <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                            <Wallet className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <div className="font-semibold text-gray-800 text-lg">Total {selectedIncomeType === 'today' ? 'Today\'s' : ''} Income</div>
                            <div className="text-sm text-gray-600">
                              Sum of all earned income {selectedIncomeType === 'today' ? 'today' : 'from all time'}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-gray-800">${formatNumber(incomeData.total)}</div>
                          <div className="text-xs text-gray-600">
                            {detailedTransactions.referral.length + detailedTransactions.level.length + detailedTransactions.other.length} total transactions
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Transaction Details */}
                    <div className="space-y-4">
                      {/* Referral Transactions */}
                      {detailedTransactions.referral.length > 0 && (
                        <div className="bg-white rounded-xl p-4 border border-gray-200">
                          <div className="flex items-center space-x-2 mb-3">
                            <Star className="w-4 h-4 text-emerald-600" />
                            <h4 className="font-semibold text-gray-800">Referral Bonuses</h4>
                            <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full">
                              {detailedTransactions.referral.length}
                            </span>
                          </div>
                          <div className="space-y-2">
                            {detailedTransactions.referral.map((tx, index) => (
                              <div key={index} className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg">
                                <div className="flex-1">
                                  <div className="font-medium text-gray-800">{tx.description}</div>
                                  <div className="text-xs text-gray-600">{tx.formattedDate}</div>
                                </div>
                                <div className="text-right">
                                  <div className="font-bold text-emerald-600">{tx.formattedAmount}</div>
                                  <div className="text-xs text-gray-500">{tx.typeLabel}</div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Level Income Transactions */}
                      {detailedTransactions.level.length > 0 && (
                        <div className="bg-white rounded-xl p-4 border border-gray-200">
                          <div className="flex items-center space-x-2 mb-3">
                            <Crown className="w-4 h-4 text-blue-600" />
                            <h4 className="font-semibold text-gray-800">Level Income</h4>
                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                              {detailedTransactions.level.length}
                            </span>
                          </div>
                          <div className="space-y-2">
                            {detailedTransactions.level.map((tx, index) => (
                              <div key={index} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                                <div className="flex-1">
                                  <div className="font-medium text-gray-800">{tx.description}</div>
                                  <div className="text-xs text-gray-600">{tx.formattedDate}</div>
                                </div>
                                <div className="text-right">
                                  <div className="font-bold text-blue-600">{tx.formattedAmount}</div>
                                  <div className="text-xs text-gray-500">{tx.typeLabel}</div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Other Income Transactions */}
                      {detailedTransactions.other.length > 0 && (
                        <div className="bg-white rounded-xl p-4 border border-gray-200">
                          <div className="flex items-center space-x-2 mb-3">
                            <Award className="w-4 h-4 text-purple-600" />
                            <h4 className="font-semibold text-gray-800">Other Income</h4>
                            <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                              {detailedTransactions.other.length}
                            </span>
                          </div>
                          <div className="space-y-2">
                            {detailedTransactions.other.map((tx, index) => (
                              <div key={index} className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                                <div className="flex-1">
                                  <div className="font-medium text-gray-800">{tx.description}</div>
                                  <div className="text-xs text-gray-600">{tx.formattedDate}</div>
                                </div>
                                <div className="text-right">
                                  <div className="font-bold text-purple-600">{tx.formattedAmount}</div>
                                  <div className="text-xs text-gray-500">{tx.typeLabel}</div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* No Transactions Message */}
                      {detailedTransactions.referral.length === 0 && 
                       detailedTransactions.level.length === 0 && 
                       detailedTransactions.other.length === 0 && (
                        <div className="text-center py-8">
                          <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-500 font-medium">No {selectedIncomeType === 'today' ? 'today\'s' : ''} income transactions found</p>
                          <p className="text-sm text-gray-400">
                            {selectedIncomeType === 'today' ? 'You haven\'t earned any income today yet.' : 'You haven\'t earned any income yet.'}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
              <div className="text-sm text-gray-600">
                {selectedIncomeType === 'today' ? 'Today\'s' : 'Total'} income breakdown
              </div>
              <button
                onClick={() => setShowIncomeDetailsModal(false)}
                className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;