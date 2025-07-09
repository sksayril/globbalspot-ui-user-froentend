import React from 'react';
import { User, Settings, HelpCircle, LogOut, ChevronRight, Wallet, Award, BarChart3, Clock, Star, Shield, Crown } from 'lucide-react';

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
  name: string;
}

interface ProfilePageProps {
  userStats: UserStats;
  onLogout: () => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ userStats, onLogout }) => {
  const menuItems = [
    { icon: Wallet, label: 'Wallet Balance', value: `$${userStats.totalIncome.toLocaleString()}`, color: 'from-emerald-500 to-emerald-600', bgColor: 'bg-emerald-50', iconColor: 'text-emerald-600' },
    { icon: Crown, label: 'VIP Level', value: `${userStats.checkInLevel}`, color: 'from-purple-500 to-purple-600', bgColor: 'bg-purple-50', iconColor: 'text-purple-600' },
    { icon: BarChart3, label: 'Active Deals', value: `${userStats.activeInvestments}`, color: 'from-blue-500 to-blue-600', bgColor: 'bg-blue-50', iconColor: 'text-blue-600' },
    { icon: Clock, label: 'Member Since', value: 'Jan 2024', color: 'from-orange-500 to-orange-600', bgColor: 'bg-orange-50', iconColor: 'text-orange-600' },
  ];

  const performanceItems = [
    { label: "Today's Income", value: `$${userStats.dailyIncome}`, color: 'text-emerald-600', bgColor: 'bg-emerald-100', icon: Star },
    { label: 'Total Investment', value: `$${userStats.totalInvestment.toLocaleString()}`, color: 'text-blue-600', bgColor: 'bg-blue-100', icon: BarChart3 },
    { label: 'Team Income', value: `$${userStats.teamIncome}`, color: 'text-purple-600', bgColor: 'bg-purple-100', icon: Crown },
    { label: 'Team Members', value: `${userStats.teamMembers}`, color: 'text-indigo-600', bgColor: 'bg-indigo-100', icon: Shield },
  ];

  const actionItems = [
    { icon: Settings, label: 'Account Settings', hasArrow: true, isRed: false, action: () => {}, description: 'Manage your account preferences' },
    { icon: HelpCircle, label: 'Help & Support', hasArrow: true, isRed: false, action: () => {}, description: '24/7 premium support' },
    { icon: LogOut, label: 'Sign Out', hasArrow: false, isRed: true, action: onLogout, description: 'Securely logout from your account' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Premium Header with Glassmorphism */}
      <div className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-700 px-6 py-12 text-white overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-white/5 to-transparent"></div>
        
        {/* Floating Elements */}
        <div className="absolute top-8 right-8 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-4 left-8 w-24 h-24 bg-purple-300/20 rounded-full blur-2xl"></div>
        
                 <div className="relative z-10 flex items-start">
           <div className="flex items-center space-x-4 max-w-md">
             {/* Compact Premium Avatar */}
             <div className="relative flex-shrink-0">
               <div className="w-20 h-20 bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20 shadow-2xl">
                 <User className="w-8 h-8 text-white drop-shadow-lg" />
               </div>
               <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center border-2 border-white shadow-lg">
                 <Crown className="w-3 h-3 text-white" />
               </div>
             </div>
             
             {/* Compact Profile Info */}
             <div className="space-y-1">
               <h1 className="text-xl font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent drop-shadow-sm">
                 Premium Profile
               </h1>
               <p className="text-lg font-semibold text-white/95 drop-shadow-sm">{userStats.name}</p>
               <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full border border-white/20">
                 <Shield className="w-3 h-3 text-emerald-300" />
                 <span className="text-xs font-medium text-white/90">UID: {userStats.uid}</span>
               </div>
             </div>
           </div>
         </div>
      </div>

      {/* Premium Content */}
      <div className="px-6 -mt-12 relative z-10 pb-8">
        {/* Combined Premium Stats Card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 p-8 mb-8">
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">Account Overview & Analytics</h2>
            <div className="flex-1"></div>
            <span className="text-xs font-semibold text-indigo-600 bg-indigo-100 px-3 py-1 rounded-full">PREMIUM</span>
          </div>
          
          {/* Account Overview Grid */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            {menuItems.map((item, index) => (
              <div key={index} className="group relative overflow-hidden bg-gradient-to-br from-white to-gray-50 rounded-2xl p-5 border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-start space-x-4">
                  <div className={`w-12 h-12 ${item.bgColor} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <item.icon className={`w-6 h-6 ${item.iconColor}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-600 mb-1">{item.label}</div>
                    <div className="text-lg font-bold text-gray-900">{item.value}</div>
                  </div>
                </div>
                {/* Hover Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-r ${item.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-2xl`}></div>
              </div>
            ))}
          </div>

          {/* Divider */}
          <div className="relative mb-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-4 text-gray-500 font-medium">Performance Metrics</span>
            </div>
          </div>
          
          {/* Performance Analytics */}
          <div className="space-y-4">
            {performanceItems.map((item, index) => (
              <div key={index} className="group flex justify-between items-center p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all duration-300">
                <div className="flex items-center space-x-4">
                  <div className={`w-10 h-10 ${item.bgColor} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <item.icon className={`w-5 h-5 ${item.color}`} />
                  </div>
                  <span className="font-medium text-gray-700">{item.label}</span>
                </div>
                <span className={`font-bold text-lg ${item.color}`}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Premium Action Items */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 overflow-hidden">
          <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-gray-600 to-gray-700 rounded-xl flex items-center justify-center">
                <Settings className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">Quick Actions</h2>
            </div>
          </div>
          
          {actionItems.map((item, index) => (
            <div key={index} className="border-b border-gray-100 last:border-b-0">
              <button 
                onClick={item.action}
                className="group w-full flex items-center justify-between p-6 hover:bg-gradient-to-r hover:from-gray-50 hover:to-white transition-all duration-300"
              >
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 ${item.isRed ? 'bg-red-50 group-hover:bg-red-100' : 'bg-gray-50 group-hover:bg-gray-100'} rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110`}>
                    <item.icon className={`w-6 h-6 ${item.isRed ? 'text-red-600' : 'text-gray-600'} group-hover:${item.isRed ? 'text-red-700' : 'text-gray-700'}`} />
                  </div>
                  <div className="text-left">
                    <div className={`font-semibold ${item.isRed ? 'text-red-600' : 'text-gray-800'} group-hover:${item.isRed ? 'text-red-700' : 'text-gray-900'}`}>
                      {item.label}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">{item.description}</div>
                  </div>
                </div>
                {item.hasArrow && (
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all duration-300" />
                )}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;