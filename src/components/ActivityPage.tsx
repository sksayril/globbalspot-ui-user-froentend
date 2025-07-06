import React, { useState } from 'react';
import { Calendar, TrendingUp, DollarSign, Clock, Filter, Search, ChevronDown } from 'lucide-react';

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
        return <Calendar className="w-5 h-5" />;
      case 'team':
        return <TrendingUp className="w-5 h-5" />;
      default:
        return <Clock className="w-5 h-5" />;
    }
  };

  const getActivityColor = (type: string, amount: number) => {
    if (amount > 0) {
      return 'text-green-600 bg-green-100';
    } else {
      return 'text-red-600 bg-red-100';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600';
      case 'pending':
        return 'text-orange-600';
      case 'failed':
        return 'text-red-600';
      default:
        return 'text-gray-600';
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-4 py-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-semibold">Activity</h1>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <Filter className="w-6 h-6" />
          </button>
        </div>

        {/* Activity Summary */}
        <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold">₹{totalIncome.toLocaleString()}</div>
              <div className="text-sm opacity-80">Total Income</div>
            </div>
            <div>
              <div className="text-2xl font-bold">₹{totalWithdrawals.toLocaleString()}</div>
              <div className="text-sm opacity-80">Withdrawals</div>
            </div>
            <div>
              <div className="text-2xl font-bold">{activities.length}</div>
              <div className="text-sm opacity-80">Transactions</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="bg-white border-b border-gray-200 px-4 py-4">
          <div className="flex space-x-2 overflow-x-auto">
            {['all', 'income', 'investment', 'withdrawal', 'bonus', 'team'].map((filter) => (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  selectedFilter === filter
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Activity List */}
      <div className="p-4">
        <div className="space-y-4">
          {filteredActivities.map((activity) => (
            <div
              key={activity.id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-4"
            >
              <div className="flex items-center space-x-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${getActivityColor(activity.type, activity.amount)}`}>
                  {getActivityIcon(activity.type)}
                </div>
                
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-semibold text-gray-800">{activity.title}</h3>
                    <div className="text-right">
                      <div className={`font-bold ${activity.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {activity.amount > 0 ? '+' : ''}₹{Math.abs(activity.amount).toLocaleString()}
                      </div>
                      <div className={`text-xs ${getStatusColor(activity.status)}`}>
                        {activity.status}
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-2">{activity.description}</p>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{new Date(activity.date).toLocaleDateString()}</span>
                    <span className="capitalize">{activity.type}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {filteredActivities.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500">No activities found</p>
            </div>
          )}
        </div>

        {/* Load More */}
        {filteredActivities.length > 0 && (
          <div className="text-center py-8">
            <button className="text-blue-600 font-medium hover:text-blue-700 transition-colors">
              Load More Activities
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityPage;