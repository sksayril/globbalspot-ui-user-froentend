import React, { useState } from 'react';
import { ChevronRight, TrendingUp, Clock, DollarSign, Star, Crown, Shield, Award, Calendar, Target, X, Eye, Download } from 'lucide-react';
import { Investment } from '../App';
import { getUserDeposits, transferWallet } from '../services/api';

interface MyInvestmentsPageProps {
  investments: Investment[];
  onInvestmentSelect: (hotel: any) => void;
  onWalletsUpdate?: (wallets: { investmentWallet: { balance: number }; normalWallet: { balance: number } }) => void;
}

const MyInvestmentsPage: React.FC<MyInvestmentsPageProps> = ({ investments, onInvestmentSelect, onWalletsUpdate }) => {
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [deposits, setDeposits] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  // Transfer Wallet modal state
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [transferAmount, setTransferAmount] = useState('');
  const [transferError, setTransferError] = useState('');
  const [transferLoading, setTransferLoading] = useState(false);
  const [fromWallet, setFromWallet] = useState('investment');
  const [toWallet, setToWallet] = useState('normal');
  const [transferSuccess, setTransferSuccess] = useState('');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-emerald-600 bg-emerald-100 border-emerald-200';
      case 'completed':
        return 'text-blue-600 bg-blue-100 border-blue-200';
      case 'pending':
        return 'text-orange-600 bg-orange-100 border-orange-200';
      default:
        return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'E2': return 'from-emerald-500 to-emerald-600';
      case 'E3': return 'from-blue-500 to-blue-600';
      case 'E4': return 'from-purple-500 to-purple-600';
      case 'E5': return 'from-orange-500 to-orange-600';
      case 'V2': return 'from-red-500 to-red-600';
      case 'V7': return 'from-yellow-500 to-yellow-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const totalActiveInvestments = investments.filter(inv => inv.status === 'active').length;
  const totalEarnings = investments.reduce((sum, inv) => sum + inv.totalEarned, 0);
  const totalInvested = investments.reduce((sum, inv) => sum + inv.hotel.price, 0);

  const handleDepositStatusClick = async () => {
    setShowDepositModal(true);
    setIsLoading(true);
    setError('');
    
    try {
      const response = await getUserDeposits();
      setDeposits(response.data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch deposits');
    } finally {
      setIsLoading(false);
    }
  };

  // Handler for Transfer Wallet click
  const handleTransferWalletClick = () => {
    setShowTransferModal(true);
    setTransferAmount('');
    setTransferError('');
    setTransferSuccess('');
  };

  // Handler for Transfer submit
  const handleTransferSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTransferError('');
    setTransferSuccess('');
    if (!transferAmount || isNaN(Number(transferAmount)) || Number(transferAmount) <= 0) {
      setTransferError('Please enter a valid amount');
      return;
    }
    if (fromWallet === toWallet) {
      setTransferError('Please select different wallets');
      return;
    }
    setTransferLoading(true);
    try {
      const response = await transferWallet({
        fromWallet,
        toWallet,
        amount: Number(transferAmount),
      });
      setTransferSuccess(response.message || 'Transfer completed successfully');
      if (onWalletsUpdate && response.data && response.data.newBalances) {
        onWalletsUpdate({
          investmentWallet: { balance: response.data.newBalances.investment },
          normalWallet: { balance: response.data.newBalances.normal },
        });
      }
      setTimeout(() => {
        setShowTransferModal(false);
        setTransferAmount('');
        setTransferSuccess('');
      }, 1500);
    } catch (err: any) {
      setTransferError(err.message || 'Failed to transfer');
    } finally {
      setTransferLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Premium Header */}
      <div className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-700 px-4 sm:px-6 py-6 sm:py-8 text-white overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl transform translate-x-16 -translate-y-16"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-300/20 rounded-full blur-2xl"></div>
        
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/30 shadow-lg">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                My Investments
              </h1>
              <p className="text-white/80 text-sm">Portfolio Management</p>
            </div>
          </div>
          <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/20">
            <ChevronRight className="w-5 h-5 text-white" />
          </div>
        </div>
      </div>

      {/* Premium Investment Summary */}
      <div className="px-2 sm:px-6 py-6 sm:py-8">
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/50 p-4 sm:p-8 mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <Star className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">Investment Overview</h2>
            <div className="flex-1"></div>
            <span className="text-xs font-semibold text-indigo-600 bg-indigo-100 px-3 py-1 rounded-full">PREMIUM</span>
          </div>
          
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-6">
            <button 
              onClick={handleDepositStatusClick}
              className="group text-center p-5 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl border border-blue-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer w-full"
            >
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <TrendingUp className="w-7 h-7 text-white" />
              </div>
              {/* <div className="text-2xl font-bold text-blue-700 mb-1">{totalActiveInvestments}</div> */}
              <div className="text-sm text-gray-600 font-medium">Deposit Status</div>
            </button>
            <button
              onClick={handleTransferWalletClick}
              className="group text-center p-5 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl border border-emerald-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer w-full"
            >
              <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <DollarSign className="w-7 h-7 text-white" />
              </div>
              {/* <div className="text-2xl font-bold text-emerald-700 mb-1">${totalEarnings.toLocaleString()}</div> */}
              <div className="text-sm text-gray-600 font-medium">Transfer Wallet</div>
            </button>
            <div className="group text-center p-5 bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl border border-purple-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Clock className="w-7 h-7 text-white" />
              </div>
              <div className="text-2xl font-bold text-purple-700 mb-1">${totalInvested.toLocaleString()}</div>
              <div className="text-sm text-gray-600 font-medium">Total Invested</div>
            </div>
          </div>
        </div>

        {/* Premium Investment List */}
        <div className="space-y-4 sm:space-y-6">
          {investments.map((investment) => (
            <div
              key={investment.id}
              className="group bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 overflow-hidden hover:shadow-2xl hover:bg-white/90 transition-all duration-300 hover:-translate-y-2"
            >
              <div className="flex flex-col xs:flex-row">
                {/* Premium Hotel Image */}
                <div className="w-full xs:w-28 h-32 xs:h-32 relative overflow-hidden flex-shrink-0">
                  <img
                    src={investment.hotel.image}
                    alt={investment.hotel.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className={`bg-gradient-to-r ${getTierColor(investment.hotel.tier)} px-3 py-1 rounded-lg shadow-lg border border-white/30 backdrop-blur-sm`}>
                      <span className="text-white font-bold text-sm">{investment.hotel.tier}</span>
                    </div>
                  </div>
                  {/* Premium Badge for High Tiers */}
                  {(investment.hotel.tier === 'V7' || investment.hotel.tier === 'V2') && (
                    <div className="absolute top-2 right-2 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                      <Crown className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>

                {/* Premium Investment Details */}
                <div className="flex-1 p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 space-y-2 sm:space-y-0">
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-1 sm:space-y-0 sm:space-x-3 mb-2">
                        <h3 className="font-bold text-gray-800 text-lg group-hover:text-gray-900 transition-colors">
                          {investment.hotel.name}
                        </h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(investment.status)}`}>
                          {investment.status.charAt(0).toUpperCase() + investment.status.slice(1)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Premium Stats Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 mb-4 sm:mb-5">
                    <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200">
                      <div className="text-xs font-medium text-gray-600 mb-1">Invested</div>
                      <div className="font-bold text-blue-700">${investment.hotel.price.toLocaleString()}</div>
                    </div>
                    <div className="text-center p-3 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl border border-emerald-200">
                      <div className="text-xs font-medium text-gray-600 mb-1">Daily Income</div>
                      <div className="font-bold text-emerald-700">${investment.hotel.dailyIncome}</div>
                    </div>
                    <div className="text-center p-3 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200">
                      <div className="text-xs font-medium text-gray-600 mb-1">Total Earned</div>
                      <div className="font-bold text-purple-700">${investment.totalEarned.toLocaleString()}</div>
                    </div>
                    <div className="text-center p-3 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl border border-orange-200">
                      <div className="text-xs font-medium text-gray-600 mb-1">Days Left</div>
                      <div className={`font-bold ${
                        investment.daysRemaining <= 3 ? 'text-red-600' :
                        investment.daysRemaining <= 7 ? 'text-orange-600' :
                        'text-orange-700'
                      }`}>{investment.daysRemaining}</div>
                    </div>
                  </div>

                  {/* Enhanced Progress Section */}
                  <div className="space-y-3 sm:space-y-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-semibold text-gray-700">Investment Progress</span>
                        <div className={`w-2 h-2 rounded-full ${
                          investment.daysRemaining <= 3 ? 'bg-red-500' :
                          investment.daysRemaining <= 7 ? 'bg-orange-500' :
                          'bg-emerald-500'
                        } animate-pulse`}></div>
                      </div>
                      <div className="text-left sm:text-right">
                        <span className="font-bold text-base sm:text-lg bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                          {investment.currentProgress}%
                        </span>
                        <div className="text-xs text-gray-500">
                          {investment.hotel.contractPeriod - investment.daysRemaining} / {investment.hotel.contractPeriod} days
                        </div>
                      </div>
                    </div>
                    
                    <div className="relative">
                      <div className="w-full bg-gray-200 rounded-full h-3 sm:h-4 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-pink-400 via-pink-500 to-purple-600 h-3 sm:h-4 rounded-full transition-all duration-500 relative overflow-hidden"
                          style={{ width: `${investment.currentProgress}%` }}
                        >
                          <div className="absolute inset-0 bg-white/30 animate-pulse"></div>
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer"></div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row justify-between text-xs text-gray-500 mt-2 sm:mt-0">
                      <span className="flex items-center space-x-1 mb-1 sm:mb-0">
                        <Calendar className="w-3 h-3" />
                        <span>Started: {new Date(investment.purchaseDate).toLocaleDateString()}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Target className="w-3 h-3" />
                        <span>Completion: {new Date(Date.now() + investment.daysRemaining * 24 * 60 * 60 * 1000).toLocaleDateString()}</span>
                      </span>
                    </div>
                  </div>

                  {/* Premium Action Button */}
                  <div className="mt-4 sm:mt-5">
                    <button
                      onClick={() => onInvestmentSelect(investment.hotel)}
                      className={`w-full bg-gradient-to-r ${getTierColor(investment.hotel.tier)} text-white py-2 sm:py-3 rounded-xl text-xs sm:text-sm font-semibold hover:shadow-lg hover:scale-105 transition-all duration-200`}
                    >
                      View Investment Details
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Premium Hover Overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            </div>
          ))}

          {/* Premium Membership Cards Section */}
          <div className="mt-8 sm:mt-12">
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 mb-6 sm:mb-8">
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                <Crown className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800">Premium Membership Cards</h3>
            </div>
            
            <div className="grid grid-cols-1 gap-4 sm:gap-6">
              {/* Basic Membership */}
              <div className="group bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-4 sm:p-6 border border-gray-300 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-gray-400 to-gray-500 rounded-xl flex items-center justify-center shadow-md">
                      <span className="text-white font-bold text-xs">BASIC</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800 text-lg">Basic Membership</h4>
                      <p className="text-gray-600 text-sm">Entry level access with basic features</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-700 mb-2">10 USDT</div>
                    <button className="bg-gradient-to-r from-gray-600 to-gray-700 text-white px-6 py-2 rounded-xl text-sm font-semibold hover:from-gray-700 hover:to-gray-800 transition-all duration-200 shadow-md hover:shadow-lg">
                      Upgrade Now
                    </button>
                  </div>
                </div>
              </div>

              {/* Silver Membership */}
              <div className="group bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-4 sm:p-6 border border-blue-300 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-md">
                      <span className="text-white font-bold text-xs">SILVER</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800 text-lg">Silver Membership</h4>
                      <p className="text-gray-600 text-sm">Enhanced features and priority support</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-700 mb-2">50 USDT</div>
                    <button className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-2 rounded-xl text-sm font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg">
                      Upgrade Now
                    </button>
                  </div>
                </div>
              </div>

              {/* Gold Membership */}
              <div className="group bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-4 sm:p-6 border border-purple-300 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
                      <span className="text-white font-bold text-xs">GOLD</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800 text-lg">Gold Membership</h4>
                      <p className="text-gray-600 text-sm">Premium features and exclusive benefits</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-purple-700 mb-2">250 USDT</div>
                    <button className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-6 py-2 rounded-xl text-sm font-semibold hover:from-purple-600 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg">
                      Upgrade Now
                    </button>
                  </div>
                </div>
              </div>

              {/* Platinum Membership */}
              <div className="group bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl p-4 sm:p-6 border border-emerald-300 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-md">
                      <span className="text-white font-bold text-xs">PLAT</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800 text-lg">Platinum Membership</h4>
                      <p className="text-gray-600 text-sm">VIP access and concierge services</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-emerald-700 mb-2">500 USDT</div>
                    <button className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-6 py-2 rounded-xl text-sm font-semibold hover:from-emerald-600 hover:to-emerald-700 transition-all duration-200 shadow-md hover:shadow-lg">
                      Upgrade Now
                    </button>
                  </div>
                </div>
              </div>

              {/* Diamond Membership */}
              <div className="group bg-gradient-to-br from-yellow-50 to-orange-100 rounded-2xl p-4 sm:p-6 border border-yellow-300 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden">
                <div className="absolute top-2 right-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-2 py-1 rounded-lg text-xs font-bold shadow-lg">
                  VIP
                </div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0">
                  <div className="flex items-center space-x-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center shadow-md">
                      <Crown className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800 text-lg">Diamond Membership</h4>
                      <p className="text-gray-600 text-sm">Ultimate luxury and exclusive privileges</p>
                    </div>
                  </div>
                  <div className="text-left sm:text-right">
                    <div className="text-2xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent mb-2">1000 USDT</div>
                    <button className="bg-gradient-to-r from-yellow-500 to-orange-600 text-white px-6 py-2 rounded-xl text-sm font-semibold hover:from-yellow-600 hover:to-orange-700 transition-all duration-200 shadow-md hover:shadow-lg">
                      Upgrade Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Deposit Status Modal */}
      {showDepositModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">Deposit Status</h2>
                  <p className="text-sm text-gray-600">View all your deposit requests</p>
                </div>
              </div>
              <button
                onClick={() => setShowDepositModal(false)}
                className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors"
              >
                <X className="w-4 h-4 text-gray-600" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600 font-medium">Loading deposits...</p>
                  </div>
                </div>
              ) : error ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <X className="w-8 h-8 text-red-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Error Loading Deposits</h3>
                  <p className="text-gray-600 mb-4">{error}</p>
                  <button
                    onClick={handleDepositStatusClick}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              ) : !deposits || deposits.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">No Deposits Found</h3>
                  <p className="text-gray-600">You haven't made any deposits yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {deposits?.map((deposit) => (
                    <div
                      key={deposit._id}
                      className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-300"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                            deposit.status === 'approved' ? 'bg-emerald-500' :
                            deposit.status === 'pending' ? 'bg-orange-500' :
                            deposit.status === 'rejected' ? 'bg-red-500' :
                            'bg-gray-500'
                          }`}>
                            <span className="text-white font-bold text-sm">
                              {deposit.status.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-800">${deposit.amount.toLocaleString()}</h3>
                            <p className="text-sm text-gray-600 capitalize">{deposit.paymentMethod.replace('_', ' ')}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            deposit.status === 'approved' ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' :
                            deposit.status === 'pending' ? 'bg-orange-100 text-orange-700 border border-orange-200' :
                            deposit.status === 'rejected' ? 'bg-red-100 text-red-700 border border-red-200' :
                            'bg-gray-100 text-gray-700 border border-gray-200'
                          }`}>
                            {deposit.status.charAt(0).toUpperCase() + deposit.status.slice(1)}
                          </span>
                        </div>
                      </div>

                      {/* Payment Proof Image */}
                      {deposit.paymentProof && (
                        <div className="mb-4">
                          <div className="text-xs font-medium text-gray-600 mb-2">Payment Proof</div>
                          <div className="relative group">
                            <img
                              src={`http://localhost:3100/${deposit.paymentProof.replace(/\\/g, '/')}`}
                              alt="Payment Proof"
                              className="w-full h-32 object-cover rounded-lg border border-gray-200 cursor-pointer hover:opacity-90 transition-opacity"
                              onClick={() => window.open(`http://localhost:3100/${deposit.paymentProof.replace(/\\/g, '/')}`, '_blank')}
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors rounded-lg flex items-center justify-center">
                              <Eye className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="bg-white/80 rounded-lg p-3 border border-gray-200">
                          <div className="text-xs font-medium text-gray-600 mb-1">Payment ID</div>
                          <div className="font-semibold text-gray-800 text-sm">{deposit.paymentId}</div>
                        </div>
                        <div className="bg-white/80 rounded-lg p-3 border border-gray-200">
                          <div className="text-xs font-medium text-gray-600 mb-1">Wallet Type</div>
                          <div className="font-semibold text-gray-800 text-sm capitalize">{deposit.walletType}</div>
                        </div>
                      </div>

                      {/* Admin Notes */}
                      {deposit.adminNotes && (
                        <div className="mb-4">
                          <div className="text-xs font-medium text-gray-600 mb-1">Admin Notes</div>
                          <div className="bg-white/80 rounded-lg p-3 border border-gray-200">
                            <div className="text-sm text-gray-800">{deposit.adminNotes}</div>
                          </div>
                        </div>
                      )}

                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>Created: {new Date(deposit.createdAt).toLocaleDateString()}</span>
                        <span>Updated: {new Date(deposit.updatedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
              <div className="text-sm text-gray-600">
                Total Deposits: {deposits?.length || 0}
              </div>
              <button
                onClick={() => setShowDepositModal(false)}
                className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Transfer Wallet Modal */}
      {showTransferModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800">Transfer Wallet</h2>
              <button
                onClick={() => setShowTransferModal(false)}
                className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors"
              >
                <X className="w-4 h-4 text-gray-600" />
              </button>
            </div>
            <form onSubmit={handleTransferSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">Amount</label>
                <input
                  type="number"
                  min="1"
                  step="any"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  value={transferAmount}
                  onChange={e => setTransferAmount(e.target.value)}
                  placeholder="Enter amount to transfer"
                  disabled={transferLoading}
                  required
                />
              </div>
              <div className="mb-4 flex space-x-2">
                <div className="flex-1">
                  <label className="block text-gray-700 font-medium mb-2">From Wallet</label>
                  <select
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    value={fromWallet}
                    onChange={e => setFromWallet(e.target.value)}
                    disabled={transferLoading}
                  >
                    <option value="investment">Investment</option>
                    <option value="normal">Normal</option>
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block text-gray-700 font-medium mb-2">To Wallet</label>
                  <select
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    value={toWallet}
                    onChange={e => setToWallet(e.target.value)}
                    disabled={transferLoading}
                  >
                    <option value="normal">Normal</option>
                    <option value="investment">Investment</option>
                  </select>
                </div>
              </div>
              {transferError && <div className="text-red-600 text-sm mt-1">{transferError}</div>}
              {transferSuccess && <div className="text-emerald-600 text-sm mt-1">{transferSuccess}</div>}
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                  onClick={() => setShowTransferModal(false)}
                  disabled={transferLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition-colors disabled:opacity-60"
                  disabled={transferLoading}
                >
                  {transferLoading ? 'Transferring...' : 'Transfer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyInvestmentsPage;