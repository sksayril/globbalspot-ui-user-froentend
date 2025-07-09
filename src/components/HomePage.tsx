import React from 'react';
import { TrendingUp, Calendar, Target, Gift, DollarSign, Activity, Plus, Minus, Zap, Award, BarChart3, Clock, Wallet, CreditCard, Star, Crown, Shield } from 'lucide-react';

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

  // Handle daily sign-in
  const handleDailySignIn = () => {
    // Add daily sign-in logic here
    alert('Daily sign-in completed! +50 bonus added to your account.');
  };

  // Handle level sign-in
  const handleLevelSignIn = () => {
    // Add level sign-in logic here
    alert(`Level ${userStats.checkInLevel} sign-in completed! Level bonus unlocked.`);
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
      <div className="px-6 -mt-16 relative z-10">
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="group bg-white/80 backdrop-blur-xl rounded-2xl p-5 shadow-xl border border-white/50 hover:shadow-2xl hover:bg-white/90 transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Plus className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="font-semibold text-gray-800 text-lg">Deposit</span>
                <p className="text-sm text-gray-600">Add funds instantly</p>
              </div>
            </div>
          </div>
          <div className="group bg-white/80 backdrop-blur-xl rounded-2xl p-5 shadow-xl border border-white/50 hover:shadow-2xl hover:bg-white/90 transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Minus className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="font-semibold text-gray-800 text-lg">Withdraw</span>
                <p className="text-sm text-gray-600">Quick transfers</p>
              </div>
            </div>
          </div>
        </div>

        {/* Premium Wallet Balances */}
        <div className="grid grid-cols-1 gap-6 mb-8">
          {/* Investment Wallet Balance */}
          <div className="group relative overflow-hidden bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-700 rounded-2xl p-6 shadow-2xl text-white hover:shadow-3xl transition-all duration-300 hover:-translate-y-1">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl transform translate-x-8 -translate-y-8"></div>
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/30 shadow-lg">
                  <Wallet className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-xl mb-1">Total Investment</h3>
                  <p className="text-emerald-100 opacity-90">Available for withdrawal</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold mb-1">${investmentWalletBalance.toLocaleString()}</div>
                <div className="text-emerald-100 opacity-80">Balance</div>
              </div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>

          {/* Normal Wallet Balance */}
          <div className="group relative overflow-hidden bg-gradient-to-br from-purple-500 via-purple-600 to-indigo-700 rounded-2xl p-6 shadow-2xl text-white hover:shadow-3xl transition-all duration-300 hover:-translate-y-1">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl transform translate-x-8 -translate-y-8"></div>
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/30 shadow-lg">
                  <CreditCard className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-xl mb-1">Premium Wallet</h3>
                  <p className="text-purple-100 opacity-90">Ready for investments</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold mb-1">${normalWalletBalance.toLocaleString()}</div>
                <div className="text-purple-100 opacity-80">Balance</div>
              </div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
        </div>

        {/* Premium Feature Cards */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/50 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-gray-800 mb-2">Asset Appreciation</h3>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-md">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 bg-gradient-to-r from-orange-400 to-orange-500 rounded-full shadow-sm"></div>
                    <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                  </div>
                </div>
                <button className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-xl text-sm font-medium mt-3 hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-lg hover:shadow-xl">
                  Learn More
                </button>
              </div>
            </div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/50">
            <div className="space-y-4">
              {/* Premium Daily Sign-in Button */}
              <button
                onClick={handleDailySignIn}
                className="w-full flex items-center space-x-3 p-4 bg-gradient-to-r from-teal-500 via-teal-600 to-emerald-600 hover:from-teal-600 hover:via-teal-700 hover:to-emerald-700 text-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-2xl hover:-translate-y-1 group"
              >
                <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/30 group-hover:scale-110 transition-transform duration-300">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <div className="text-left">
                  <span className="font-semibold block">Daily Sign-in</span>
                  <span className="text-xs opacity-90">Earn daily rewards</span>
                </div>
              </button>

              {/* Premium Level Sign-in Button */}
              <button
                onClick={handleLevelSignIn}
                className="w-full flex items-center space-x-3 p-4 bg-gradient-to-r from-purple-500 via-purple-600 to-indigo-600 hover:from-purple-600 hover:via-purple-700 hover:to-indigo-700 text-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-2xl hover:-translate-y-1 group"
              >
                <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/30 group-hover:scale-110 transition-transform duration-300">
                  <Gift className="w-5 h-5 text-white" />
                </div>
                <div className="text-left">
                  <span className="font-semibold block">Level Sign-in</span>
                  <span className="text-xs opacity-90">Level {userStats.checkInLevel} bonus</span>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Premium Additional Features */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          <div className="group bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 shadow-xl border border-blue-200 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-gray-800 mb-2">Lucky Draw</h3>
                <button className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg">
                  Play Now
                </button>
              </div>
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Target className="w-7 h-7 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="group bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 shadow-xl border border-gray-200 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-gray-800 mb-2">About</h3>
                <button className="bg-gradient-to-r from-gray-600 to-gray-700 text-white px-4 py-2 rounded-xl text-sm font-medium hover:from-gray-700 hover:to-gray-800 transition-all duration-200 shadow-md hover:shadow-lg">
                  Learn More
                </button>
              </div>
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Activity className="w-7 h-7 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Premium Investment Overview */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-white/50 mb-8">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-800">Investment Overview</h3>
            <div className="flex-1"></div>
            <span className="text-xs font-semibold text-indigo-600 bg-indigo-100 px-3 py-1 rounded-full">PREMIUM</span>
          </div>
          
          <div className="grid grid-cols-2 gap-6">
            <div className="group text-center p-4 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl border border-emerald-200 hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Star className="w-6 h-6 text-white" />
              </div>
              <div className="text-3xl font-bold text-emerald-600 mb-1">${userStats.dailyIncome}</div>
              <div className="text-sm text-gray-600 font-medium">Today Income</div>
            </div>
            <div className="group text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200 hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Wallet className="w-6 h-6 text-white" />
              </div>
              <div className="text-3xl font-bold text-blue-600 mb-1">${userStats.totalIncome.toLocaleString()}</div>
              <div className="text-sm text-gray-600 font-medium">Total Income</div>
            </div>
          </div>

          {/* Additional Stats Row */}
          <div className="grid grid-cols-2 gap-6 mt-6">
            <div className="group text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200 hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-purple-600 mb-1">Level {userStats.checkInLevel}</div>
              <div className="text-sm text-gray-600 font-medium">VIP Level</div>
            </div>
            <div className="group text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl border border-orange-200 hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-orange-600 mb-1">${userStats.totalInvestment.toLocaleString()}</div>
              <div className="text-sm text-gray-600 font-medium">Total Investment</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;