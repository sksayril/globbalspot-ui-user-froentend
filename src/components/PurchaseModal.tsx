import React from 'react';
import { X, Star, Crown, Shield, Award } from 'lucide-react';
import { Hotel } from '../App';

interface PurchaseModalProps {
  hotel: Hotel;
  onClose: () => void;
  onConfirm: () => void;
}

const PurchaseModal: React.FC<PurchaseModalProps> = ({ hotel, onClose, onConfirm }) => {
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

  const TierIcon = getTierIcon(hotel.tier);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end justify-center z-50 p-4">
      <div className="bg-white/95 backdrop-blur-xl w-full max-w-md rounded-3xl shadow-2xl border border-white/50 transform transition-all duration-300 overflow-hidden">
        {/* Premium Header */}
        <div className={`bg-gradient-to-r ${getTierColor(hotel.tier)} p-6 text-white relative overflow-hidden`}>
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl transform translate-x-8 -translate-y-8"></div>
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/30 shadow-lg">
                <TierIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Confirm Investment</h2>
                <p className="text-white/80 text-sm">Premium Hotel Purchase</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-xl flex items-center justify-center transition-all duration-200 border border-white/20"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Premium Order Details */}
        <div className="p-8">
          <div className="space-y-6 mb-8">
            {/* Hotel Preview */}
            <div className="bg-gradient-to-r from-gray-50 to-white p-5 rounded-2xl border border-gray-200 shadow-sm">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 relative overflow-hidden rounded-xl">
                  <img
                    src={hotel.image}
                    alt={hotel.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-white font-bold text-sm">{hotel.tier}</span>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-800 mb-1">{hotel.name}</h3>
                  <p className="text-sm text-gray-600">{hotel.description}</p>
                </div>
              </div>
            </div>

            {/* Investment Details Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200">
                <div className="text-xs font-medium text-gray-600 mb-1">Investment Amount</div>
                <div className="font-bold text-blue-700 text-lg">${hotel.price.toLocaleString()}</div>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl border border-emerald-200">
                <div className="text-xs font-medium text-gray-600 mb-1">Daily Income</div>
                <div className="font-bold text-emerald-700 text-lg">${hotel.dailyIncome}</div>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200">
                <div className="text-xs font-medium text-gray-600 mb-1">Contract Period</div>
                <div className="font-bold text-purple-700 text-lg">{hotel.contractPeriod} Days</div>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl border border-orange-200">
                <div className="text-xs font-medium text-gray-600 mb-1">Total Profit</div>
                <div className="font-bold text-orange-700 text-lg">${hotel.totalProfit.toLocaleString()}</div>
              </div>
            </div>

            {/* Additional Details */}
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600 font-medium">Daily Return Rate</span>
                <span className="font-bold text-emerald-600">{hotel.dailyRate}%</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600 font-medium">Processing Fee</span>
                <span className="font-medium text-gray-800">$0.00</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600 font-medium">Discount</span>
                <span className="font-medium text-gray-800">-$0.00</span>
              </div>
              <div className="flex justify-between items-center py-3 border-t border-gray-200">
                <span className="text-gray-800 font-bold">Total Pay Amount</span>
                <span className="font-bold text-2xl bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  ${hotel.price.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Premium Warning */}
          <div className="bg-gradient-to-r from-orange-50 to-red-50 p-4 rounded-xl border border-orange-200 mb-6">
            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4 text-orange-600" />
              <span className="text-sm font-medium text-orange-800">
                Investment Limit: Maximum {hotel.purchaseLimit} purchases allowed
              </span>
            </div>
          </div>

          {/* Premium Confirm Button */}
          <button
            onClick={onConfirm}
            className={`w-full bg-gradient-to-r ${getTierColor(hotel.tier)} text-white py-4 rounded-2xl font-bold text-lg hover:shadow-xl hover:scale-105 transition-all duration-300 shadow-lg relative overflow-hidden group`}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <span className="relative z-10">Confirm Investment</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PurchaseModal;