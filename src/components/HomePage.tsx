import React, { useState } from 'react';
import { TrendingUp, Calendar, Target, Gift, DollarSign, Activity, Plus, Minus, Zap, Award, BarChart3, Clock, Wallet, CreditCard, Star, Crown, Shield } from 'lucide-react';
import { updateUserProfile, createDeposit, claimDailyIncome, getDailyIncomeStatus } from '../services/api';
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

  const handleDailySignIn = async () => {
    setDailyIncomeSuccess('');
    setDailyIncomeError('');
    setDailyIncomeLoading(true);
    try {
      const response = await claimDailyIncome();
      setDailyIncomeSuccess(response.message || 'Daily income claimed!');
      if (onWalletsUpdate && response.data && typeof response.data.normalWalletBalance === 'number') {
        onWalletsUpdate({
          investmentWallet: { balance: investmentWalletBalance },
          normalWallet: { balance: response.data.normalWalletBalance },
        });
      }
    } catch (err: any) {
      setDailyIncomeError(err.message || 'Failed to claim daily income.');
    } finally {
      setDailyIncomeLoading(false);
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
    paymentMethod: 'upi',
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
      setDepositForm({ amount: '', paymentMethod: 'upi', paymentId: '', walletType: 'investment', paymentProof: null });
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
        <div className="px-4 sm:px-6 -mt-16 relative z-10 pb-8">
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
          
          <div className="absolute bottom-4 left-4 right-4">
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/20 shadow-2xl">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                  {/* <Crown className="w-6 h-6 text-white" /> */}
                </div>
                <div>
                  {/* <h1 className="text-white text-lg font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                    PREMIUM HOTELS & RESORTS
                  </h1> */}
                  <p className="text-white/80 text-sm">Investment Partners</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Premium Quick Actions */}
      <div className="px-4 sm:px-6 -mt-16 relative z-10">
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
                className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
                onClick={() => setShowTransferModal(true)}
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
              <div className="text-2xl sm:text-3xl font-bold text-blue-600 mb-1">${(userStats?.dailyIncome?.totalEarned || 0).toLocaleString()}</div>
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
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="text-xl sm:text-2xl font-bold text-orange-600 mb-1">${(userStats?.investmentWallet?.balance || 0).toLocaleString()}</div>
              <div className="text-xs sm:text-sm text-gray-600 font-medium">Total Investment</div>
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
                disabled={dailyIncomeLoading}
                className="px-3 sm:px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-lg hover:from-yellow-500 hover:to-orange-600 transition-all duration-300 font-medium shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                {dailyIncomeLoading ? (
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
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md relative">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-700"
              onClick={() => setShowUpdateModal(false)}
            >
              &times;
            </button>
            <h2 className="text-xl font-bold mb-4">Update Profile</h2>
            {updateError && <div className="mb-2 text-red-600">{updateError}</div>}
            {updateSuccess && <div className="mb-2 text-green-600">{updateSuccess}</div>}
            <form onSubmit={handleUpdateSubmit} className="space-y-4">
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
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md relative">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-700"
              onClick={() => setShowDepositModal(false)}
            >
              &times;
            </button>
            <h2 className="text-xl font-bold mb-4">Deposit Funds</h2>
            {depositError && <div className="mb-2 text-red-600">{depositError}</div>}
            {depositSuccess && <div className="mb-2 text-green-600">{depositSuccess}</div>}
            <form onSubmit={handleDepositSubmit} className="space-y-4" encType="multipart/form-data">
              <div>
                <label className="block text-sm font-medium mb-1">Amount</label>
                <input
                  type="number"
                  name="amount"
                  value={depositForm.amount}
                  onChange={handleDepositChange}
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Payment Method</label>
                <select
                  name="paymentMethod"
                  value={depositForm.paymentMethod}
                  onChange={handleDepositChange}
                  className="w-full border rounded px-3 py-2"
                  required
                >
                  <option value="upi">UPI</option>
                  <option value="crypto">Crypto</option>
                  <option value="netbanking">Net Banking</option>
                  <option value="bank">Bank Transfer</option>
                </select>
              </div>
              {/* QR code section for UPI */}
              {depositForm.paymentMethod === 'upi' && (
                <div className="flex flex-col items-center mb-2">
                  <label className="block text-sm font-medium mb-1">Scan UPI QR Code</label>
                  <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi://pay?pa=UPI_ID" alt="UPI QR Code" className="w-36 h-36 rounded border mb-2" />
                  <span className="text-xs text-gray-500">Scan this QR code with your UPI app to pay</span>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium mb-1">Payment ID</label>
                <input
                  type="text"
                  name="paymentId"
                  value={depositForm.paymentId}
                  onChange={handleDepositChange}
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Wallet Type</label>
                <select
                  name="walletType"
                  value={depositForm.walletType}
                  onChange={handleDepositChange}
                  className="w-full border rounded px-3 py-2"
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
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>
              <div className="flex justify-end space-x-2 mt-4">
                <button
                  type="button"
                  className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                  onClick={() => setShowDepositModal(false)}
                  disabled={depositLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700"
                  disabled={depositLoading}
                >
                  {depositLoading ? 'Submitting...' : 'Submit'}
                </button>
              </div>
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
    </div>
  );
};

export default HomePage;