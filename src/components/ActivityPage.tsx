import React, { useState, useEffect } from 'react';
import { Calendar, TrendingUp, DollarSign, Clock, Filter, Search, ChevronDown, Star, Crown, Award, Shield, X, Eye } from 'lucide-react';
import { getTransactions, TransactionsResponse, Transaction, getUserDeposits } from '../services/api';

interface UserStats {
  dailyIncome: number;
  totalIncome: number;
  checkInLevel: number;
  totalInvestment: number;
  activeInvestments: number;
  teamIncome: number;
  teamMembers: number;
  uid: string;
  inviteCode: string;
}

interface ActivityPageProps {
  userStats: UserStats;
}

const ActivityPage: React.FC<ActivityPageProps> = ({ userStats }) => {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [stats, setStats] = useState<TransactionsResponse['data']['stats'] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Deposit Status modal state
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [deposits, setDeposits] = useState<any[]>([]);
  const [depositsLoading, setDepositsLoading] = useState(false);
  const [depositsError, setDepositsError] = useState('');

  // Transaction Detail modal state
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await getTransactions();
        setTransactions(res.data.transactions);
        setStats(res.data.stats);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch transactions');
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, []);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'investment':
      case 'deposit':
        return <TrendingUp className="w-4 h-4" />;
      case 'income':
      case 'daily_income':
        return <DollarSign className="w-4 h-4" />;
      case 'withdrawal':
        return <DollarSign className="w-4 h-4" />;
      case 'bonus':
      case 'referral_bonus':
        return <Award className="w-4 h-4" />;
      case 'team':
      case 'commission':
        return <Star className="w-4 h-4" />;
      case 'transfer':
      case 'transfer_to_user':
      case 'transfer_from_user':
        return <Crown className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getActivityColor = (type: string, amount: number) => {
    if (amount > 0) {
      switch (type) {
        case 'income':
        case 'daily_income':
          return 'from-emerald-500 to-emerald-600';
        case 'bonus':
        case 'referral_bonus':
          return 'from-yellow-500 to-yellow-600';
        case 'team':
        case 'commission':
          return 'from-purple-500 to-purple-600';
        default:
          return 'from-green-500 to-green-600';
      }
    } else {
      switch (type) {
        case 'investment':
        case 'deposit':
          return 'from-blue-500 to-blue-600';
        case 'withdrawal':
          return 'from-orange-500 to-orange-600';
        case 'transfer':
        case 'transfer_to_user':
        case 'transfer_from_user':
          return 'from-indigo-500 to-indigo-600';
        default:
          return 'from-red-500 to-red-600';
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
      case 'approved':
        return 'text-emerald-600 bg-emerald-100 border-emerald-200';
      case 'pending':
        return 'text-orange-600 bg-orange-100 border-orange-200';
      case 'failed':
      case 'rejected':
        return 'text-red-600 bg-red-100 border-red-200';
      default:
        return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  // Helper function to format wallet addresses
  const formatWalletAddress = (address: string) => {
    if (!address) return '';
    if (address.startsWith('0x') && address.length > 10) {
      return `${address.slice(0, 6)}...${address.slice(-4)}`;
    }
    if (address.length > 12) {
      return `${address.slice(0, 8)}...${address.slice(-4)}`;
    }
    return address;
  };

  // Helper function to format numbers with max 3 decimal places
  const formatNumber = (value: number | undefined | null): string => {
    if (value === undefined || value === null) return '0';
    return Number(value).toFixed(3).replace(/\.?0+$/, '');
  };

  // Helper function to format transaction description
  const formatDescription = (description: string, type: string) => {
    if (type === 'withdrawal') {
      if (description.includes('0x') || description.length > 20) {
        return `Withdrawal request - ${formatWalletAddress(description.replace('Withdrawal request - ', ''))}`;
      }
    }
    return description;
  };

  // Handle transaction click
  const handleTransactionClick = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setShowTransactionModal(true);
  };

  // Get transaction type icon for modal
  const getTransactionTypeIcon = (type: string) => {
    switch (type) {
      case 'investment':
      case 'deposit':
        return <TrendingUp className="w-6 h-6" />;
      case 'income':
      case 'daily_income':
        return <DollarSign className="w-6 h-6" />;
      case 'withdrawal':
        return <DollarSign className="w-6 h-6" />;
      case 'bonus':
      case 'referral_bonus':
        return <Award className="w-6 h-6" />;
      case 'team':
      case 'commission':
        return <Star className="w-6 h-6" />;
      case 'transfer':
      case 'transfer_to_user':
      case 'transfer_from_user':
        return <Crown className="w-6 h-6" />;
      default:
        return <Clock className="w-6 h-6" />;
    }
  };

  const handleDepositStatusClick = async () => {
    setShowDepositModal(true);
    setDepositsLoading(true);
    setDepositsError('');
    
    try {
      const response = await getUserDeposits();
      setDeposits(response.data);
    } catch (err: any) {
      setDepositsError(err.message || 'Failed to fetch deposits');
    } finally {
      setDepositsLoading(false);
    }
  };

  const filteredActivities = selectedFilter === 'all'
    ? transactions
    : transactions.filter(activity => activity.type === selectedFilter);

  // Use API stats for summary if available
  const totalIncome = stats?.totalAmount?.deposits || 0;
  const totalWithdrawals = stats?.totalAmount?.withdrawals || 0;
  const totalTransactions = stats?.total || transactions.length;

  // Enhanced summary calculations
  const netBalance = totalIncome - totalWithdrawals;
  const depositPercent = totalIncome > 0 ? ((totalIncome - totalWithdrawals) / totalIncome) * 100 : 0;
  const biggestDeposit = transactions.filter(t => t.type === 'deposit').reduce((max, t) => t.amount > max ? t.amount : max, 0);
  const biggestWithdrawal = transactions.filter(t => t.type === 'withdrawal').reduce((max, t) => t.amount > max ? t.amount : max, 0);
  const lastTransactionDate = transactions.length > 0 ? new Date(transactions[0].date) : null;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">Loading...</div>
    );
  }
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">{error}</div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Premium Header */}
      <div className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-700 px-6 py-8 text-white overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl transform translate-x-16 -translate-y-16"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-300/20 rounded-full blur-2xl"></div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/30 shadow-lg">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                  Activity Center
                </h1>
                <p className="text-white/80 text-xs">Transaction History</p>
              </div>
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="p-3 bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-xl transition-all duration-200 border border-white/20 shadow-lg hover:scale-105"
            >
              <Filter className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Enhanced Activity Summary */}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/20 shadow-2xl mb-6">
            <div className="grid grid-cols-3 gap-4 text-center mb-3">
              <div className="group">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center mx-auto mb-2 border border-white/30 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <DollarSign className="w-5 h-5 text-white" />
                </div>
                <div className="text-lg font-bold mb-1">${formatNumber(totalIncome)}</div>
                <div className="text-xs text-white/80">Total Deposits</div>
              </div>
              <div className="group">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center mx-auto mb-2 border border-white/30 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <div className="text-lg font-bold mb-1">${formatNumber(totalWithdrawals)}</div>
                <div className="text-xs text-white/80">Withdrawals</div>
              </div>
              <div className="group">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center mx-auto mb-2 border border-white/30 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Star className="w-5 h-5 text-white" />
                </div>
                <div className="text-lg font-bold mb-1">{totalTransactions}</div>
                <div className="text-xs text-white/80">Transactions</div>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center text-white/90 text-xs">
              <div className="bg-white/10 rounded-lg p-2">
                <div className="font-medium">Net Balance</div>
                <div className="text-sm font-bold">${formatNumber(netBalance)}</div>
              </div>
              <div className="bg-white/10 rounded-lg p-2">
                <div className="font-medium">Deposit % Remaining</div>
                <div className="text-sm font-bold">{depositPercent.toFixed(1)}%</div>
              </div>
              <div className="bg-white/10 rounded-lg p-2">
                <div className="font-medium">Biggest Deposit</div>
                <div className="text-sm font-bold">${formatNumber(biggestDeposit)}</div>
              </div>
              <div className="bg-white/10 rounded-lg p-2">
                <div className="font-medium">Biggest Withdrawal</div>
                <div className="text-sm font-bold">${formatNumber(biggestWithdrawal)}</div>
              </div>
              <div className="bg-white/10 rounded-lg p-2 col-span-2 md:col-span-4">
                <div className="font-medium">Last Transaction</div>
                <div className="text-sm font-bold">{lastTransactionDate ? lastTransactionDate.toLocaleString() : 'N/A'}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Deposit Status Section */}
      <div className="px-6 py-6">
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/50 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">Deposit Status</h2>
            </div>
            <button
              onClick={handleDepositStatusClick}
              className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              View Deposits
            </button>
          </div>
          <p className="text-gray-600 text-sm">Check the status of your deposit requests and payment proofs.</p>
        </div>
      </div>

      {/* Premium Filters */}
      {showFilters && (
        <div className="bg-white/80 backdrop-blur-xl border-b border-gray-200 px-6 py-4 shadow-lg">
          <div className="flex space-x-3 overflow-x-auto">
            {['all', 'deposit', 'withdrawal', 'transfer', 'transfer_to_user', 'transfer_from_user', 'referral_bonus', 'daily_income', 'commission'].map((filter) => (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter)}
                className={`px-5 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-1 ${
                  selectedFilter === filter
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1).replace(/_/g, ' ')}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Premium Activity List */}
      <div className="p-6 space-y-4 pb-24">
        {filteredActivities.map((activity, idx) => (
          <div
            key={idx}
            className="group bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 p-4 hover:shadow-2xl hover:bg-white/90 transition-all duration-300 hover:-translate-y-1 cursor-pointer"
            onClick={() => handleTransactionClick(activity)}
          >
            <div className="flex items-center space-x-3">
              {/* Consistent Activity Icon */}
              <div className={`w-10 h-10 bg-gradient-to-r ${getActivityColor(activity.type, activity.amount)} rounded-lg flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300`}>
                {getActivityIcon(activity.type)}
              </div>

              {/* Activity Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-semibold text-gray-800 text-sm group-hover:text-gray-900 transition-colors truncate">
                    {formatDescription(activity.description, activity.type)}
                  </h3>
                  <div className="flex items-center space-x-2 ml-2">
                    {activity.amount !== 0 && (
                      <span className={`font-semibold text-sm ${
                        activity.amount > 0 
                          ? 'text-emerald-600' 
                          : 'text-red-600'
                      }`}>
                        {activity.amount > 0 ? '+' : ''}${formatNumber(Math.abs(activity.amount))}
                      </span>
                    )}
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(activity.status)}`}>
                      {activity.status.charAt(0).toUpperCase() + activity.status.slice(1)}
                    </span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1 mb-1">
                  <span className="text-xs text-gray-500 bg-gray-100 rounded px-1.5 py-0.5">{activity.walletName}</span>
                  <span className="text-xs text-gray-500 bg-gray-100 rounded px-1.5 py-0.5">{activity.type.replace(/_/g, ' ')}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1 text-xs text-gray-500">
                    <Calendar className="w-3 h-3" />
                    <span>{new Date(activity.date).toLocaleDateString()}</span>
                  </div>
                  <div className="text-xs text-gray-500">
                    Status: {activity.status.charAt(0).toUpperCase() + activity.status.slice(1)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Premium Empty State */}
        {filteredActivities.length === 0 && (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <TrendingUp className="w-10 h-10 text-gray-400" />
            </div>
            <p className="text-gray-500 font-medium mb-2">No activities found</p>
            <p className="text-gray-400 text-sm">Try adjusting your filters to see more results</p>
          </div>
        )}
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
              {depositsLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600 font-medium">Loading deposits...</p>
                  </div>
                </div>
              ) : depositsError ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <X className="w-8 h-8 text-red-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Error Loading Deposits</h3>
                  <p className="text-gray-600 mb-4">{depositsError}</p>
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
                            <h3 className="font-semibold text-gray-800">${formatNumber(deposit.amount)}</h3>
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
                              src={`https://api.goalsbot.com/${deposit.paymentProof.replace(/\\/g, '/')}`}
                              alt="Payment Proof"
                              className="w-full h-32 object-cover rounded-lg border border-gray-200 cursor-pointer hover:opacity-90 transition-opacity"
                              onClick={() => window.open(`https://api.goalsbot.com/${deposit.paymentProof.replace(/\\/g, '/')}`, '_blank')}
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

      {/* Transaction Detail Modal */}
      {showTransactionModal && selectedTransaction && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className={`w-12 h-12 bg-gradient-to-r ${getActivityColor(selectedTransaction.type, selectedTransaction.amount)} rounded-xl flex items-center justify-center`}>
                  {getTransactionTypeIcon(selectedTransaction.type)}
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-800">Transaction Details</h2>
                  <p className="text-sm text-gray-600 capitalize">{selectedTransaction.type.replace(/_/g, ' ')}</p>
                </div>
              </div>
              <button
                onClick={() => setShowTransactionModal(false)}
                className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors"
              >
                <X className="w-4 h-4 text-gray-600" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="space-y-4">
                {/* Transaction Amount */}
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200">
                  <div className="text-center">
                    <div className={`text-2xl font-bold mb-1 ${
                      selectedTransaction.amount > 0 
                        ? 'text-emerald-600' 
                        : 'text-red-600'
                    }`}>
                      {selectedTransaction.amount > 0 ? '+' : ''}${formatNumber(Math.abs(selectedTransaction.amount))}
                    </div>
                    <div className="text-sm text-gray-600">
                      {selectedTransaction.amount > 0 ? 'Credit' : 'Debit'}
                    </div>
                  </div>
                </div>

                {/* Transaction Description */}
                <div className="bg-white rounded-xl p-4 border border-gray-200">
                  <div className="text-xs font-medium text-gray-600 mb-1">Description</div>
                  <div className="font-semibold text-gray-800">{selectedTransaction.description}</div>
                </div>

                {/* Transaction Status */}
                <div className="bg-white rounded-xl p-4 border border-gray-200">
                  <div className="text-xs font-medium text-gray-600 mb-1">Status</div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(selectedTransaction.status)}`}>
                      {selectedTransaction.status.charAt(0).toUpperCase() + selectedTransaction.status.slice(1)}
                    </span>
                  </div>
                </div>

                {/* Wallet Information */}
                <div className="bg-white rounded-xl p-4 border border-gray-200">
                  <div className="text-xs font-medium text-gray-600 mb-1">Wallet</div>
                  <div className="font-semibold text-gray-800 capitalize">{selectedTransaction.walletName}</div>
                </div>

                {/* Transaction Type */}
                <div className="bg-white rounded-xl p-4 border border-gray-200">
                  <div className="text-xs font-medium text-gray-600 mb-1">Type</div>
                  <div className="font-semibold text-gray-800 capitalize">{selectedTransaction.type.replace(/_/g, ' ')}</div>
                </div>

                {/* Transaction Date */}
                <div className="bg-white rounded-xl p-4 border border-gray-200">
                  <div className="text-xs font-medium text-gray-600 mb-1">Date & Time</div>
                  <div className="font-semibold text-gray-800">
                    {new Date(selectedTransaction.date).toLocaleString()}
                  </div>
                </div>

                {/* Additional Details for Withdrawals */}
                {selectedTransaction.type === 'withdrawal' && selectedTransaction.description.includes('0x') && (
                  <div className="bg-white rounded-xl p-4 border border-gray-200">
                    <div className="text-xs font-medium text-gray-600 mb-1">Wallet Address</div>
                    <div className="font-mono text-sm text-gray-800 break-all">
                      {selectedTransaction.description.replace('Withdrawal request - ', '')}
                    </div>
                  </div>
                )}

                {/* Transaction ID (if available) */}
                {(selectedTransaction as any)._id && (
                  <div className="bg-white rounded-xl p-4 border border-gray-200">
                    <div className="text-xs font-medium text-gray-600 mb-1">Transaction ID</div>
                    <div className="font-mono text-xs text-gray-600 break-all">
                      {(selectedTransaction as any)._id}
                    </div>
                  </div>
                )}

                {/* Tags */}
                <div className="bg-white rounded-xl p-4 border border-gray-200">
                  <div className="text-xs font-medium text-gray-600 mb-2">Tags</div>
                  <div className="flex flex-wrap gap-2">
                    <span className="text-xs text-gray-500 bg-gray-100 rounded px-2 py-1">
                      {selectedTransaction.walletName}
                    </span>
                    <span className="text-xs text-gray-500 bg-gray-100 rounded px-2 py-1">
                      {selectedTransaction.type.replace(/_/g, ' ')}
                    </span>
                    <span className="text-xs text-gray-500 bg-gray-100 rounded px-2 py-1">
                      {selectedTransaction.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
              <div className="text-sm text-gray-600">
                Transaction Details
              </div>
              <button
                onClick={() => setShowTransactionModal(false)}
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

export default ActivityPage;