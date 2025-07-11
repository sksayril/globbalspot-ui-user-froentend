import React from 'react';
import { User, Settings, HelpCircle, LogOut, ChevronRight, Wallet, Award, BarChart3, Clock, Star, Shield, Crown, CreditCard } from 'lucide-react';
import { ProfileHeaderSkeleton, CardSkeleton, GridSkeleton } from './SkeletonLoader';

interface ProfilePageProps {
  profile: any;
  onLogout: () => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ profile, onLogout }) => {
  // Show skeleton loader if profile is loading
  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <ProfileHeaderSkeleton />
        <div className="px-4 sm:px-6 -mt-12 relative z-10 pb-8">
          <CardSkeleton className="mb-8" />
          <GridSkeleton cols={2} rows={2} />
        </div>
      </div>
    );
  }

  const menuItems = [
    { icon: Wallet, label: 'Investment Wallet', value: `$${profile?.investmentWallet?.balance ?? 0}`, color: 'from-emerald-500 to-emerald-600', bgColor: 'bg-emerald-50', iconColor: 'text-emerald-600' },
    { icon: CreditCard, label: 'Normal Wallet', value: `$${profile?.normalWallet?.balance ?? 0}`, color: 'from-purple-500 to-purple-600', bgColor: 'bg-purple-50', iconColor: 'text-purple-600' },
    { icon: Crown, label: 'VIP Level', value: `${profile?.referralLevel ?? '-'}`, color: 'from-yellow-500 to-orange-500', bgColor: 'bg-yellow-50', iconColor: 'text-yellow-600' },
    { icon: Clock, label: 'Member Since', value: profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : '-', color: 'from-orange-500 to-orange-600', bgColor: 'bg-orange-50', iconColor: 'text-orange-600' },
  ];

  const performanceItems = [
    { label: "Today's Income", value: `$${profile?.dailyIncome?.todayEarned ?? 0}`, color: 'text-emerald-600', bgColor: 'bg-emerald-100', icon: Star },
    { label: 'Total Earned', value: `$${profile?.dailyIncome?.totalEarned ?? 0}`, color: 'text-blue-600', bgColor: 'bg-blue-100', icon: BarChart3 },
    { label: 'Potential Daily Income', value: `$${profile?.potentialDailyIncome ?? 0}`, color: 'text-purple-600', bgColor: 'bg-purple-100', icon: Crown },
    { label: 'Can Claim Today', value: profile?.canClaimDailyIncome ? 'Yes' : 'No', color: profile?.canClaimDailyIncome ? 'text-emerald-600' : 'text-gray-500', bgColor: 'bg-indigo-100', icon: Shield },
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
        
                 <div className="relative z-10 flex items-start px-4 sm:px-0">
           <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 max-w-md">
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
             <div className="space-y-2 sm:space-y-1">
               <h1 className="text-xl font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent drop-shadow-sm">
                 Premium Profile
               </h1>
              <p className="text-lg font-semibold text-white/95 drop-shadow-sm">{profile?.name}</p>
              <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full border border-white/20 text-xs sm:text-sm">
                <Shield className="w-3 h-3 text-emerald-300" />
                <span className="text-xs font-medium text-white/90">Email: {profile?.email}</span>
              </div>
              <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full border border-white/20 mt-1 text-xs sm:text-sm">
                <Star className="w-3 h-3 text-yellow-300" />
                <span className="text-xs font-medium text-white/90">Referral Code: {profile?.referralCode}</span>
              </div>
             </div>
           </div>
         </div>
      </div>

      {/* Premium Content */}
      <div className="px-4 sm:px-6 -mt-12 relative z-10 pb-8">
        {/* Combined Premium Stats Card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 p-8 mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-3 mb-8">
            <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-gray-800">Account Overview & Analytics</h2>
            <div className="flex-1 hidden sm:block"></div>
            <span className="text-xs font-semibold text-indigo-600 bg-indigo-100 px-3 py-1 rounded-full">PREMIUM</span>
          </div>
          
          {/* Account Overview Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            {menuItems.map((item, index) => (
              <div key={index} className="group relative overflow-hidden bg-gradient-to-br from-white to-gray-50 rounded-2xl p-5 border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
                  <div className={`w-12 h-12 ${item.bgColor} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <item.icon className={`w-6 h-6 ${item.iconColor}`} />
                  </div>
                  <div className="flex-1 min-w-0 text-center sm:text-left">
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
                <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                  <div className={`w-10 h-10 ${item.bgColor} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <item.icon className={`w-5 h-5 ${item.color}`} />
                  </div>
                  <span className="font-medium text-gray-700 text-sm sm:text-base">{item.label}</span>
                </div>
                <span className={`font-bold text-base sm:text-lg ${item.color}`}>{item.value}</span>
              </div>
            ))}
          </div>

          {/* Additional Profile Details */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-8">
            <div className="bg-white rounded-xl p-4 shadow">
              <div className="font-semibold text-gray-700 mb-2 text-sm sm:text-base">First Deposit Bonus</div>
              <div>Status: <b>{profile?.firstDepositBonus?.hasReceived ? 'Received' : 'Not Received'}</b></div>
              <div>Amount: <b>${profile?.firstDepositBonus?.amount ?? 0}</b></div>
              <div>Percentage: <b>{profile?.firstDepositBonus?.percentage ?? 0}%</b></div>
              <div>Received At: <b>{profile?.firstDepositBonus?.receivedAt ? new Date(profile.firstDepositBonus.receivedAt).toLocaleString() : '-'}</b></div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow">
              <div className="font-semibold text-gray-700 mb-2 text-sm sm:text-base">Referral</div>
              <div>Referral Code: <b>{profile?.referralCode}</b></div>
              <div>Referred By: <b>{profile?.referredBy ? profile.referredBy.name : '-'}</b></div>
              <div>Referral Level: <b>{profile?.referralLevel}</b></div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow">
              <div className="font-semibold text-gray-700 mb-2 text-sm sm:text-base">Daily Income</div>
              <div>Today: <b>${profile?.dailyIncome?.todayEarned ?? 0}</b></div>
              <div>Total Earned: <b>${profile?.dailyIncome?.totalEarned ?? 0}</b></div>
              <div>Last Claimed: <b>{profile?.dailyIncome?.lastClaimed ? new Date(profile.dailyIncome.lastClaimed).toLocaleString() : '-'}</b></div>
              <div>Can Claim: <b className={profile?.canClaimDailyIncome ? 'text-emerald-600' : 'text-gray-500'}>{profile?.canClaimDailyIncome ? 'Yes' : 'No'}</b></div>
            </div>
          </div>
        </div>

        {/* Premium Action Items */}
        <div className="space-y-3 sm:space-y-4">
          {actionItems.map((item, index) => (
            <div key={index} className="group bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/50 hover:shadow-2xl hover:bg-white/90 transition-all duration-300 hover:-translate-y-1">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-3 sm:space-y-0">
                <div className="flex items-center space-x-4 w-full sm:w-auto">
                  <div className={`w-12 h-12 ${item.isRed ? 'bg-red-100' : 'bg-gray-100'} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <item.icon className={`w-6 h-6 ${item.isRed ? 'text-red-600' : 'text-gray-600'}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className={`font-semibold text-lg ${item.isRed ? 'text-red-600' : 'text-gray-800'}`}>{item.label}</h3>
                    <p className="text-xs sm:text-sm text-gray-600">{item.description}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 w-full sm:w-auto justify-end">
                  <button
                    onClick={item.action}
                    className={`w-full sm:w-auto px-4 py-2 rounded-lg font-medium transition-all duration-300 text-sm ${
                      item.isRed 
                        ? 'bg-red-500 hover:bg-red-600 text-white shadow-lg hover:shadow-xl' 
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    }`}
                  >
                    {item.isRed ? 'Sign Out' : 'Open'}
                  </button>
                  {item.hasArrow && (
                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors duration-300" />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;