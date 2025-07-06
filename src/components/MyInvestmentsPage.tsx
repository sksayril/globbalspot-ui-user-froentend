import React from 'react';
import { ChevronRight, TrendingUp, Clock, DollarSign } from 'lucide-react';
import { Investment } from '../App';

interface MyInvestmentsPageProps {
  investments: Investment[];
  onInvestmentSelect: (hotel: any) => void;
}

const MyInvestmentsPage: React.FC<MyInvestmentsPageProps> = ({ investments, onInvestmentSelect }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-600 bg-green-100';
      case 'completed':
        return 'text-blue-600 bg-blue-100';
      case 'pending':
        return 'text-orange-600 bg-orange-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const totalActiveInvestments = investments.filter(inv => inv.status === 'active').length;
  const totalEarnings = investments.reduce((sum, inv) => sum + inv.totalEarned, 0);
  const totalInvested = investments.reduce((sum, inv) => sum + inv.hotel.price, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-600 to-blue-600 px-4 py-6 text-white">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">My Investments</h1>
          <ChevronRight className="w-6 h-6" />
        </div>
      </div>

      {/* Investment Summary */}
      <div className="px-4 py-6">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Investment Overview</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
              <div className="text-lg font-bold text-gray-800">{totalActiveInvestments}</div>
              <div className="text-sm text-gray-600">Active</div>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
              <div className="text-lg font-bold text-gray-800">₹{totalEarnings.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Total Earned</div>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Clock className="w-6 h-6 text-purple-600" />
              </div>
              <div className="text-lg font-bold text-gray-800">₹{totalInvested.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Invested</div>
            </div>
          </div>
        </div>

        {/* Investment List */}
        <div className="space-y-4">
          {investments.map((investment) => (
            <div
              key={investment.id}
              className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden"
            >
              <div className="flex">
                {/* Hotel Image */}
                <div className="w-24 h-24 relative">
                  <img
                    src={investment.hotel.image}
                    alt={investment.hotel.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <span className="text-white font-bold text-xl">{investment.hotel.tier}</span>
                  </div>
                </div>

                {/* Investment Details */}
                <div className="flex-1 p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-800">{investment.hotel.name}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(investment.status)}`}>
                      {investment.status.charAt(0).toUpperCase() + investment.status.slice(1)}
                    </span>
                  </div>

                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Invested</span>
                      <span className="font-medium">₹{investment.hotel.price.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Daily income</span>
                      <span className="font-medium">₹{investment.hotel.dailyIncome}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total earned</span>
                      <span className="font-medium text-green-600">₹{investment.totalEarned.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Days remaining</span>
                      <span className="font-medium">{investment.daysRemaining} days</span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-gray-600">Progress</span>
                      <span className="font-medium text-pink-600">{investment.currentProgress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-pink-400 to-pink-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${investment.currentProgress}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="mt-3">
                    <button
                      onClick={() => onInvestmentSelect(investment.hotel)}
                      className="w-full bg-teal-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-teal-700 transition-colors"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* No More Data */}
          <div className="text-center py-8">
            <p className="text-gray-500">No more investments</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyInvestmentsPage;