import React from 'react';
import { TrendingUp, Calendar, Target, Gift, DollarSign, Activity, Plus, Minus, Zap, Award, BarChart3, Clock, Wallet, CreditCard } from 'lucide-react';

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

interface HomePageProps {
  userStats: UserStats;
}

const HomePage: React.FC<HomePageProps> = ({ userStats }) => {
  // Calculate wallet balances
  const investmentWalletBalance = userStats.totalIncome - 5000; // Assuming some withdrawals
  const normalWalletBalance = 8500; // Available balance for new investments

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50">
      {/* Header with Hotel Image */}
      <div className="relative">
        <div className="h-64 bg-gradient-to-br from-blue-600 to-teal-600 relative overflow-hidden">
          <img 
            src="https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg?auto=compress&cs=tinysrgb&w=1200" 
            alt="Resort" 
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-blue-900/50 to-transparent"></div>
          <div className="absolute bottom-4 left-4 right-4">
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 border border-white/30">
              <h1 className="text-white text-lg font-semibold">HOTELS & RESORTS PARTNERS</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div className="px-4 -mt-8 relative z-10">
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <Plus className="w-5 h-5 text-orange-600" />
              </div>
              <span className="font-medium text-gray-800">Recharge</span>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Minus className="w-5 h-5 text-blue-600" />
              </div>
              <span className="font-medium text-gray-800">Withdraw</span>
            </div>
          </div>
        </div>

        {/* Wallet Balances Section */}
        <div className="grid grid-cols-1 gap-4 mb-6">
          {/* Investment Wallet Balance */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-4 shadow-lg text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                  <Wallet className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Investment Wallet</h3>
                  <p className="text-sm opacity-80">Available for withdrawal</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">₹{investmentWalletBalance.toLocaleString()}</div>
                <div className="text-sm opacity-80">Balance</div>
              </div>
            </div>
          </div>

          {/* Normal Wallet Balance */}
          <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl p-4 shadow-lg text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Normal Wallet</h3>
                  <p className="text-sm opacity-80">Available for investment</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">₹{normalWalletBalance.toLocaleString()}</div>
                <div className="text-sm opacity-80">Balance</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-800 mb-1">Asset appreciation</h3>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                  <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                </div>
                <button className="bg-red-500 text-white px-3 py-1 rounded text-sm mt-2">
                  Learn More
                </button>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <Calendar className="w-5 h-5 text-teal-600" />
                  <span className="font-medium text-gray-800">Daily Sign-in</span>
                </div>
                <div className="flex items-center space-x-2 mb-2">
                  <Gift className="w-5 h-5 text-purple-600" />
                  <span className="font-medium text-gray-800">Bonus</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-blue-100 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-800 mb-1">Lucky Draw</h3>
                <button className="bg-gray-200 text-gray-700 px-3 py-1 rounded text-sm">
                  Go
                </button>
              </div>
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                <Target className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-gray-100 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-800 mb-1">About</h3>
                <button className="bg-gray-200 text-gray-700 px-3 py-1 rounded text-sm">
                  Detail
                </button>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <Activity className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Investment Overview</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">₹{userStats.dailyIncome}</div>
              <div className="text-sm text-gray-600">Daily Income</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">₹{userStats.totalIncome.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Total Income</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100 mb-6">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Award className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="text-lg font-semibold text-gray-800">Level {userStats.checkInLevel}</div>
              <div className="text-sm text-gray-600">Check-in Level</div>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <BarChart3 className="w-6 h-6 text-purple-600" />
              </div>
              <div className="text-lg font-semibold text-gray-800">{userStats.activeInvestments}</div>
              <div className="text-sm text-gray-600">Active Investments</div>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <DollarSign className="w-6 h-6 text-teal-600" />
              </div>
              <div className="text-lg font-semibold text-gray-800">₹{userStats.totalInvestment.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Total Investment</div>
            </div>
          </div>
        </div>

        {/* India Partner Model */}
        <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100 mb-6">
          <div className="text-center">
            <h2 className="text-xl font-bold text-gray-800 mb-4">INDIA PARTNER MODEL</h2>
            <img 
              src="https://images.pexels.com/photos/1134176/pexels-photo-1134176.jpeg?auto=compress&cs=tinysrgb&w=800" 
              alt="Luxury Hotel Room" 
              className="w-full h-48 object-cover rounded-lg"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;