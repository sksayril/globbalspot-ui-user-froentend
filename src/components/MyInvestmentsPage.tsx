import React from 'react';
import { ChevronRight, TrendingUp, Clock, DollarSign, Star, Crown, Shield, Award, Calendar, Target } from 'lucide-react';
import { Investment } from '../App';

interface MyInvestmentsPageProps {
  investments: Investment[];
  onInvestmentSelect: (hotel: any) => void;
}

const MyInvestmentsPage: React.FC<MyInvestmentsPageProps> = ({ investments, onInvestmentSelect }) => {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Premium Header */}
      <div className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-700 px-6 py-8 text-white overflow-hidden">
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
      <div className="px-6 py-8">
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/50 p-8 mb-8">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <Star className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">Investment Overview</h2>
            <div className="flex-1"></div>
            <span className="text-xs font-semibold text-indigo-600 bg-indigo-100 px-3 py-1 rounded-full">PREMIUM</span>
          </div>
          
          <div className="grid grid-cols-3 gap-6">
            <div className="group text-center p-5 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl border border-blue-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <TrendingUp className="w-7 h-7 text-white" />
              </div>
              <div className="text-2xl font-bold text-blue-700 mb-1">{totalActiveInvestments}</div>
              <div className="text-sm text-gray-600 font-medium">Active Investments</div>
            </div>
            <div className="group text-center p-5 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl border border-emerald-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <DollarSign className="w-7 h-7 text-white" />
              </div>
              <div className="text-2xl font-bold text-emerald-700 mb-1">${totalEarnings.toLocaleString()}</div>
              <div className="text-sm text-gray-600 font-medium">Total Earned</div>
            </div>
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
        <div className="space-y-6">
          {investments.map((investment) => (
            <div
              key={investment.id}
              className="group bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 overflow-hidden hover:shadow-2xl hover:bg-white/90 transition-all duration-300 hover:-translate-y-2"
            >
              <div className="flex">
                {/* Premium Hotel Image */}
                <div className="w-28 h-32 relative overflow-hidden">
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
                <div className="flex-1 p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
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
                  <div className="grid grid-cols-4 gap-4 mb-5">
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
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-semibold text-gray-700">Investment Progress</span>
                        <div className={`w-2 h-2 rounded-full ${
                          investment.daysRemaining <= 3 ? 'bg-red-500' :
                          investment.daysRemaining <= 7 ? 'bg-orange-500' :
                          'bg-emerald-500'
                        } animate-pulse`}></div>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-lg bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                          {investment.currentProgress}%
                        </span>
                        <div className="text-xs text-gray-500">
                          {investment.hotel.contractPeriod - investment.daysRemaining} / {investment.hotel.contractPeriod} days
                        </div>
                      </div>
                    </div>
                    
                    <div className="relative">
                      <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-pink-400 via-pink-500 to-purple-600 h-4 rounded-full transition-all duration-500 relative overflow-hidden"
                          style={{ width: `${investment.currentProgress}%` }}
                        >
                          <div className="absolute inset-0 bg-white/30 animate-pulse"></div>
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer"></div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between text-xs text-gray-500">
                      <span className="flex items-center space-x-1">
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
                  <div className="mt-5">
                    <button
                      onClick={() => onInvestmentSelect(investment.hotel)}
                      className={`w-full bg-gradient-to-r ${getTierColor(investment.hotel.tier)} text-white py-3 rounded-xl text-sm font-semibold hover:shadow-lg hover:scale-105 transition-all duration-200`}
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
          <div className="mt-12">
            <div className="flex items-center space-x-3 mb-8">
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                <Crown className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800">Premium Membership Cards</h3>
            </div>
            
            <div className="grid grid-cols-1 gap-6">
              {/* Basic Membership */}
              <div className="group bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 border border-gray-300 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
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
              <div className="group bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-300 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
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
              <div className="group bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 border border-purple-300 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
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
              <div className="group bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl p-6 border border-emerald-300 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
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
              <div className="group bg-gradient-to-br from-yellow-50 to-orange-100 rounded-2xl p-6 border border-yellow-300 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden">
                <div className="absolute top-2 right-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-2 py-1 rounded-lg text-xs font-bold shadow-lg">
                  VIP
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center shadow-md">
                      <Crown className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800 text-lg">Diamond Membership</h4>
                      <p className="text-gray-600 text-sm">Ultimate luxury and exclusive privileges</p>
                    </div>
                  </div>
                  <div className="text-right">
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
    </div>
  );
};

export default MyInvestmentsPage;