import React from 'react';
import { ChevronRight, Star, Crown, TrendingUp, Calendar, DollarSign, Award } from 'lucide-react';
import { Hotel } from '../App';

interface HotelsPageProps {
  hotels: Hotel[];
  onHotelSelect: (hotel: Hotel) => void;
}

const HotelsPage: React.FC<HotelsPageProps> = ({ hotels, onHotelSelect }) => {
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

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case 'V7': return Crown;
      case 'V2': return Award;
      default: return Star;
    }
  };

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
              <Star className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                Premium Hotels
              </h1>
              <p className="text-white/80 text-sm">Investment Opportunities</p>
            </div>
          </div>
          <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/20">
            <ChevronRight className="w-5 h-5 text-white" />
          </div>
        </div>
      </div>

      {/* Premium Hotel List */}
      <div className="p-6 space-y-6 pb-24">
        {hotels.map((hotel, index) => {
          const TierIcon = getTierIcon(hotel.tier);
          return (
            <div
              key={hotel.id}
              className="group bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 overflow-hidden hover:shadow-2xl hover:bg-white/90 transition-all duration-300 hover:-translate-y-2"
            >
              <div className="flex">
                {/* Premium Hotel Image */}
                <div className="w-28 h-28 relative overflow-hidden">
                  <img
                    src={hotel.image}
                    alt={hotel.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className={`bg-gradient-to-r ${getTierColor(hotel.tier)} px-3 py-1 rounded-lg shadow-lg border border-white/30 backdrop-blur-sm`}>
                      <span className="text-white font-bold text-sm">{hotel.tier}</span>
                    </div>
                  </div>
                  {/* Premium Badge for High Tiers */}
                  {(hotel.tier === 'V7' || hotel.tier === 'V2') && (
                    <div className="absolute top-2 right-2 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                      <Crown className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>

                {/* Premium Hotel Details */}
                <div className="flex-1 p-5">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <TierIcon className={`w-5 h-5 text-${hotel.tier === 'V7' ? 'yellow' : hotel.tier === 'V2' ? 'purple' : 'blue'}-600`} />
                        <h3 className="font-bold text-gray-800 text-lg group-hover:text-gray-900 transition-colors">
                          {hotel.name}
                        </h3>
                      </div>
                      <p className="text-xs text-gray-600 mb-3 leading-relaxed">{hotel.description}</p>
                    </div>
                    <button
                      onClick={() => onHotelSelect(hotel)}
                      className={`bg-gradient-to-r ${getTierColor(hotel.tier)} text-white px-5 py-2 rounded-xl text-sm font-semibold hover:shadow-lg hover:scale-105 transition-all duration-200 ml-4`}
                    >
                      Invest Now
                    </button>
                  </div>

                  {/* Premium Stats Grid */}
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="text-center p-3 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl border border-emerald-200">
                      <div className="flex items-center justify-center mb-1">
                        <DollarSign className="w-4 h-4 text-emerald-600 mr-1" />
                        <span className="text-xs font-medium text-gray-600">Price</span>
                      </div>
                      <div className="font-bold text-emerald-700">${hotel.price.toLocaleString()}</div>
                    </div>
                    <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200">
                      <div className="flex items-center justify-center mb-1">
                        <TrendingUp className="w-4 h-4 text-blue-600 mr-1" />
                        <span className="text-xs font-medium text-gray-600">Daily</span>
                      </div>
                      <div className="font-bold text-blue-700">${hotel.dailyIncome}</div>
                    </div>
                    <div className="text-center p-3 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200">
                      <div className="flex items-center justify-center mb-1">
                        <Calendar className="w-4 h-4 text-purple-600 mr-1" />
                        <span className="text-xs font-medium text-gray-600">Period</span>
                      </div>
                      <div className="font-bold text-purple-700">{hotel.contractPeriod}d</div>
                    </div>
                  </div>

                  {/* Premium Progress Section */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-gray-700">Investment Progress</span>
                        <div className={`w-2 h-2 rounded-full ${
                          hotel.progress >= 80 ? 'bg-emerald-500' :
                          hotel.progress >= 50 ? 'bg-yellow-500' :
                          'bg-orange-500'
                        } animate-pulse`}></div>
                      </div>
                      <span className="font-bold text-lg bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                        {hotel.progress}%
                      </span>
                    </div>
                    
                    <div className="relative">
                      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-pink-400 via-pink-500 to-purple-600 h-3 rounded-full transition-all duration-500 relative overflow-hidden"
                          style={{ width: `${hotel.progress}%` }}
                        >
                          <div className="absolute inset-0 bg-white/30 animate-pulse"></div>
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer"></div>
                        </div>
                      </div>
                    </div>

                    {/* ROI and Stats */}
                    <div className="flex justify-between items-center pt-2">
                      <div className="text-xs text-gray-600">
                        <span className="font-medium">ROI: </span>
                        <span className="text-emerald-600 font-bold">{hotel.dailyRate}%</span>
                      </div>
                      <div className="text-xs text-gray-600">
                        <span className="font-medium">Total Profit: </span>
                        <span className="text-blue-600 font-bold">${hotel.totalProfit.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Premium Hover Overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            </div>
          );
        })}

        {/* Premium No More Data Section */}
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Star className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-500 font-medium">All premium hotels displayed</p>
          <p className="text-gray-400 text-sm mt-1">More opportunities coming soon</p>
        </div>
      </div>
    </div>
  );
};

export default HotelsPage;