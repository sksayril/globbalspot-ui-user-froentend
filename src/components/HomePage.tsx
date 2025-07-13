import React, { useState, useEffect } from 'react';
// @ts-ignore
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import { TrendingUp, Calendar, Target, Gift, DollarSign, Activity, Plus, Minus, Zap, Award, BarChart3, Clock, Wallet, CreditCard, Star, Crown, Shield, Copy } from 'lucide-react';
import { updateUserProfile, createDeposit, claimDailyIncome, getDailyIncomeStatus, getContentList, ContentItem } from '../services/api';
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
        // Find the crypto wallet content (case insensitive search)
        const cryptoWallet = response.data.contents.find(
          content => content.title.toLowerCase().includes('crypto') && content.isActive
        );
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

  const handleDailySignIn = async () => {
    setClaimLoading(true);
    try {
      const res = await fetch('http://localhost:3100/users/today-my-income', {
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
        title: claimSuccess ? '�� Daily Income Claimed!' : 'Oops!',
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
      refreshWalletData();
    } catch (err) {
      await Swal.fire({
        icon: 'error',
        title: 'Network Error',
        text: 'Please try again.',
        confirmButtonColor: '#ef4444'
      });
    } finally {
      setClaimLoading(false);
    }
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
  // Transfer Modal state
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [depositForm, setDepositForm] = useState({
    amount: '',
    paymentMethod: 'crypto',
    paymentId: '',
    walletType: 'investment',
    paymentProof: null as File | null,
  });
  const [depositLoading, setDepositLoading] = useState(false);
  const [depositError, setDepositError] = useState('');
  const [depositSuccess, setDepositSuccess] = useState('');

  const handleDepositChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, files } = e.target as HTMLInputElement;
    if (name === 'paymentProof' && files) {
      setDepositForm(prev => ({ ...prev, paymentProof: files[0] }));
    } else {
      setDepositForm(prev => ({ ...prev, [name]: value }));
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
      setDepositForm({ amount: '', paymentMethod: 'crypto', paymentId: '', walletType: 'investment', paymentProof: null });
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
      {/* Premium Header with Enhanced Glassmorphism */}
      <div className="relative">
        <div className="h-72 bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-700 relative overflow-hidden">
          <img 
            src="https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg?auto=compress&cs=tinysrgb&w=1200" 
            alt="Resort" 
            className="w-full h-full object-cover opacity-20"
          />
          {/* Enhanced Background Effects */}
          <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/60 via-purple-800/40 to-transparent"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-white/10 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-purple-400/20 to-transparent rounded-full blur-2xl"></div>
          
          
        </div>
      </div>

      {/* Premium Quick Actions */}
      <div className="px-4 sm:px-6 mt-0 relative pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <div className="group bg-white/80 backdrop-blur-xl rounded-2xl p-5 shadow-xl border border-white/50 hover:shadow-2xl hover:bg-white/90 transition-all duration-300 hover:-translate-y-1">
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Plus className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="font-semibold text-gray-800 text-lg">Deposit</span>
                <p className="text-sm text-gray-600">Add funds instantly</p>
               </div>
               <button
                className="w-full sm:w-auto px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-sm font-medium"
                onClick={() => setShowDepositModal(true)}
               >
                 Deposit
               </button>
             </div>
           </div>
           <div className="group bg-white/80 backdrop-blur-xl rounded-2xl p-5 shadow-xl border border-white/50 hover:shadow-2xl hover:bg-white/90 transition-all duration-300 hover:-translate-y-1">
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Minus className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="font-semibold text-gray-800 text-lg">Transfer</span>
                <p className="text-sm text-gray-600">Move funds between wallets</p>
              </div>
              <button
                onClick={() => setShowTransferSection(true)}
                className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
              >
                Transfer
              </button>
            </div>
          </div>
        </div>

        {/* Premium Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-8">
          <div className="group bg-white/80 backdrop-blur-xl rounded-2xl p-4 sm:p-5 shadow-xl border border-white/50 hover:shadow-2xl hover:bg-white/90 transition-all duration-300 hover:-translate-y-1">
            <div className="flex flex-col items-center text-center space-y-2 sm:space-y-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Star className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-emerald-600 mb-1">${userStats?.dailyIncome?.todayEarned || 0}</div>
              <div className="text-xs sm:text-sm text-gray-600 font-medium">Today Income</div>
            </div>
          </div>
          <div className="group bg-white/80 backdrop-blur-xl rounded-2xl p-4 sm:p-5 shadow-xl border border-white/50 hover:shadow-2xl hover:bg-white/90 transition-all duration-300 hover:-translate-y-1">
            <div className="flex flex-col items-center text-center space-y-2 sm:space-y-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Wallet className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-blue-600 mb-1">{(userStats?.dailyIncome?.totalEarned || 0).toLocaleString()}</div>
              <div className="text-xs sm:text-sm text-gray-600 font-medium">Total Income</div>
            </div>
          </div>
          <div className="group bg-white/80 backdrop-blur-xl rounded-2xl p-4 sm:p-5 shadow-xl border border-white/50 hover:shadow-2xl hover:bg-white/90 transition-all duration-300 hover:-translate-y-1">
            <div className="flex flex-col items-center text-center space-y-2 sm:space-y-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Crown className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="text-xl sm:text-2xl font-bold text-purple-600 mb-1">Level {userStats?.referralLevel || 0}</div>
              <div className="text-xs sm:text-sm text-gray-600 font-medium">VIP Level</div>
            </div>
          </div>
          <div className="group bg-white/80 backdrop-blur-xl rounded-2xl p-4 sm:p-5 shadow-xl border border-white/50 hover:shadow-2xl hover:bg-white/90 transition-all duration-300 hover:-translate-y-1">
            <div className="flex flex-col items-center text-center space-y-2 sm:space-y-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0-6C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/>
                </svg>
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-indigo-700 mb-1">
                ${(userStats?.investmentWallet?.balance || 0).toLocaleString()}
              </div>
              <div className="text-xs sm:text-sm text-gray-600 font-medium">My InvestWallet Balance</div>
              <div className="text-xs sm:text-sm text-gray-500 mt-1 text-center">
                You can use this balance for investment purposes.
              </div>
            </div>
          </div>
          {/* New Normal Wallet Balance Card */}
          <div className="group bg-white/80 backdrop-blur-xl rounded-2xl p-4 sm:p-5 shadow-xl border border-white/50 hover:shadow-2xl hover:bg-white/90 transition-all duration-300 hover:-translate-y-1">
            <div className="flex flex-col items-center text-center space-y-2 sm:space-y-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Wallet className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-blue-600 mb-1">
                ${(userStats?.normalWallet?.balance || 0).toLocaleString()}
              </div>
              <div className="text-xs sm:text-sm text-gray-600 font-medium">Normal Wallet Balance</div>
            </div>
          </div>
        </div>

        {/* Premium Action Cards */}
        <div className="space-y-4 sm:space-y-6">
          {/* Daily Sign-in Card */}
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/50">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-gray-800 text-lg">Daily Sign-in</h3>
                  <p className="text-sm text-gray-600">Claim your daily rewards</p>
                </div>
              </div>
              <button
                onClick={handleDailySignIn}
                disabled={claimLoading}
                className="px-3 sm:px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-lg hover:from-yellow-500 hover:to-orange-600 transition-all duration-300 font-medium shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                {claimLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Claiming...</span>
                  </div>
                ) : (
                  'Claim Daily'
                )}
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-xl p-4 border border-emerald-200">
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
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                    <Target className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-blue-800">Level Bonus</div>
                    <div className="text-sm text-blue-600">Extra rewards</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Daily Income Status Card */}
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/50">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-white" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-gray-800 text-lg">Daily Income Status</h3>
                  <p className="text-sm text-gray-600">Check your earning status</p>
                </div>
              </div>
              <button
                onClick={handleStatusCheck}
                disabled={statusLoading}
                className="px-3 sm:px-4 py-2 bg-gradient-to-r from-purple-400 to-purple-600 text-white rounded-lg hover:from-purple-500 hover:to-purple-700 transition-all duration-300 font-medium shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                {statusLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Checking...</span>
                  </div>
                ) : (
                  'Check Status'
                )}
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                    <Activity className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-purple-800">Today's Earnings</div>
                    <div className="text-sm text-purple-600">${userStats?.dailyIncome?.todayEarned || 0}</div>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-r from-indigo-50 to-indigo-100 rounded-xl p-4 border border-indigo-200">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center">
                    <Zap className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-indigo-800">Level Sign-in</div>
                    <div className="text-sm text-indigo-600">Level {userStats?.referralLevel || 0} bonus</div>
                  </div>
                </div>
              </div>
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
                          src={`http://localhost:3100${cryptoWalletData.imageUrl}`}
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
                  <option value="investment">Investment</option>
                  <option value="normal">Normal</option>
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
                  const res = await fetch(`http://localhost:3100/users/user-by-referral/${transferInput}`, {
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
                        const res = await fetch('http://localhost:3100/users/transfer-to-user', {
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
    </div>
  );
};

export default HomePage;