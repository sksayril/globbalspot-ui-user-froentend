import React, { useState } from 'react';
import { Calendar, TrendingUp, DollarSign, Clock, Filter, Search, ChevronDown, Star, Crown, Award, Shield } from 'lucide-react';

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

interface ActivityItem {
  id: string;
  type: 'investment' | 'income' | 'withdrawal' | 'bonus' | 'team';
  title: string;
  description: string;
  amount: number;
  date: string;
  status: 'completed' | 'pending' | 'failed';
}

const ActivityPage: React.FC<ActivityPageProps> = ({ userStats }) => {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  const activities: ActivityItem[] = [
    {
      id: '1',
      type: 'income',
      title: 'Daily Income',
      description: 'Economy hotel: E2 daily return',
      amount: 60,
      date: '2024-01-20',
      status: 'completed'
    },
    {
      id: '2',
      type: 'income',
      title: 'Daily Income',
      description: 'Economy hotel: E3 daily return',
      amount: 155,
      date: '2024-01-20',
      status: 'completed'
    },
    {
      id: '3',
      type: 'investment',
      title: 'New Investment',
      description: 'Purchased Economy hotel: E4',
      amount: -10000,
      date: '2024-01-19',
      status: 'completed'
    },
    {
      id: '4',
      type: 'bonus',
      title: 'Check-in Bonus',
      description: 'Daily check-in reward',
      amount: 50,
      date: '2024-01-19',
      status: 'completed'
    },
    {
      id: '5',
      type: 'team',
      title: 'Team Commission',
      description: 'Commission from team member investment',
      amount: 320,
      date: '2024-01-18',
      status: 'completed'
    },
    {
      id: '6',
      type: 'withdrawal',
      title: 'Withdrawal',
      description: 'Withdrawal to bank account',
      amount: -5000,
      date: '2024-01-17',
      status: 'pending'
    },
    {
      id: '7',
      type: 'income',
      title: 'Daily Income',
      description: 'Economy hotel: V2 daily return',
      amount: 1700,
      date: '2024-01-17',
      status: 'completed'
    }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'investment':
        return <TrendingUp className="w-5 h-5" />;
      case 'income':
        return <DollarSign className="w-5 h-5" />;
      case 'withdrawal':
        return <DollarSign className="w-5 h-5" />;
      case 'bonus':
        return <Award className="w-5 h-5" />;
      case 'team':
        return <Star className="w-5 h-5" />;
      default:
        return <Clock className="w-5 h-5" />;
    }
  };

  const getActivityColor = (type: string, amount: number) => {
    if (amount > 0) {
      switch (type) {
        case 'income':
          return 'from-emerald-500 to-emerald-600';
        case 'bonus':
          return 'from-yellow-500 to-yellow-600';
        case 'team':
          return 'from-purple-500 to-purple-600';
        default:
          return 'from-green-500 to-green-600';
      }
    } else {
      switch (type) {
        case 'investment':
          return 'from-blue-500 to-blue-600';
        case 'withdrawal':
          return 'from-orange-500 to-orange-600';
        default:
          return 'from-red-500 to-red-600';
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-emerald-600 bg-emerald-100 border-emerald-200';
      case 'pending':
        return 'text-orange-600 bg-orange-100 border-orange-200';
      case 'failed':
        return 'text-red-600 bg-red-100 border-red-200';
      default:
        return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const filteredActivities = selectedFilter === 'all' 
    ? activities 
    : activities.filter(activity => activity.type === selectedFilter);

  const totalIncome = activities
    .filter(a => a.amount > 0 && a.status === 'completed')
    .reduce((sum, a) => sum + a.amount, 0);

  const totalWithdrawals = activities
    .filter(a => a.amount < 0 && a.type === 'withdrawal' && a.status === 'completed')
    .reduce((sum, a) => sum + Math.abs(a.amount), 0);

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
                <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                  Activity Center
                </h1>
                <p className="text-white/80 text-sm">Transaction History</p>
              </div>
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="p-3 bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-xl transition-all duration-200 border border-white/20 shadow-lg hover:scale-105"
            >
              <Filter className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Premium Activity Summary */}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-2xl">
            <div className="grid grid-cols-3 gap-6 text-center">
              <div className="group">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mx-auto mb-3 border border-white/30 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold mb-1">${totalIncome.toLocaleString()}</div>
                <div className="text-sm text-white/80">Total Income</div>
              </div>
              <div className="group">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mx-auto mb-3 border border-white/30 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold mb-1">${totalWithdrawals.toLocaleString()}</div>
                <div className="text-sm text-white/80">Withdrawals</div>
              </div>
              <div className="group">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mx-auto mb-3 border border-white/30 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Star className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold mb-1">{activities.length}</div>
                <div className="text-sm text-white/80">Transactions</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Premium Filters */}
      {showFilters && (
        <div className="bg-white/80 backdrop-blur-xl border-b border-gray-200 px-6 py-4 shadow-lg">
          <div className="flex space-x-3 overflow-x-auto">
            {['all', 'income', 'investment', 'withdrawal', 'bonus', 'team'].map((filter) => (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter)}
                className={`px-5 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-1 ${
                  selectedFilter === filter
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Premium Activity List */}
      <div className="p-6 space-y-4 pb-24">
        {filteredActivities.map((activity) => (
          <div
            key={activity.id}
            className="group bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 p-6 hover:shadow-2xl hover:bg-white/90 transition-all duration-300 hover:-translate-y-1"
          >
            <div className="flex items-center space-x-4">
              {/* Premium Activity Icon */}
              <div className={`w-14 h-14 bg-gradient-to-r ${getActivityColor(activity.type, activity.amount)} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                {getActivityIcon(activity.type)}
                <span className="text-white">{getActivityIcon(activity.type)}</span>
              </div>

              {/* Activity Details */}
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-gray-800 text-lg group-hover:text-gray-900 transition-colors">
                    {activity.title}
                  </h3>
                  <div className="flex items-center space-x-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(activity.status)}`}>
                      {activity.status.charAt(0).toUpperCase() + activity.status.slice(1)}
                    </span>
                    <span className={`font-bold text-lg ${
                      activity.amount > 0 
                        ? 'text-emerald-600' 
                        : 'text-red-600'
                    }`}>
                      {activity.amount > 0 ? '+' : ''}${Math.abs(activity.amount).toLocaleString()}
                    </span>
                  </div>
                </div>
                
                <p className="text-gray-600 text-sm mb-3 leading-relaxed">{activity.description}</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-xs text-gray-500">
                    <Calendar className="w-3 h-3" />
                    <span>{new Date(activity.date).toLocaleDateString()}</span>
                  </div>
                  <div className="text-xs text-gray-500">
                    Transaction ID: {activity.id}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Premium Hover Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl"></div>
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
    </div>
  );
};

export default ActivityPage;