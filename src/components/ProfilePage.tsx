import React from 'react';
import { User, Settings, HelpCircle, LogOut, ChevronRight, Wallet, Award, BarChart3, Clock } from 'lucide-react';

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

interface ProfilePageProps {
  userStats: UserStats;
  onLogout: () => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ userStats, onLogout }) => {
  const menuItems = [
    { icon: Wallet, label: 'Wallet', value: `₹${userStats.totalIncome.toLocaleString()}` },
    { icon: Award, label: 'Level', value: `${userStats.checkInLevel}` },
    { icon: BarChart3, label: 'Investments', value: `${userStats.activeInvestments}` },
    { icon: Clock, label: 'Member Since', value: 'Jan 2024' },
  ];

  const actionItems = [
    { icon: Settings, label: 'Settings', hasArrow: true, action: () => {} },
    { icon: HelpCircle, label: 'Help & Support', hasArrow: true, action: () => {} },
    { icon: LogOut, label: 'Logout', hasArrow: false, isRed: true, action: onLogout },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-teal-600 px-4 py-8 text-white">
        <div className="text-center">
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-xl font-semibold mb-2">User Profile</h1>
          <p className="text-sm opacity-80">UID: {userStats.uid}</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="px-4 -mt-8 relative z-10">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Account Overview</h2>
          <div className="grid grid-cols-2 gap-4">
            {menuItems.map((item, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <item.icon className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <div className="text-sm text-gray-600">{item.label}</div>
                  <div className="font-semibold text-gray-800">{item.value}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Performance</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Daily Income</span>
              <span className="font-semibold text-green-600">₹{userStats.dailyIncome}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Investment</span>
              <span className="font-semibold text-blue-600">₹{userStats.totalInvestment.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Team Income</span>
              <span className="font-semibold text-purple-600">₹{userStats.teamIncome}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Team Members</span>
              <span className="font-semibold text-teal-600">{userStats.teamMembers}</span>
            </div>
          </div>
        </div>

        {/* Action Items */}
        <div className="bg-white rounded-xl shadow-lg mb-6">
          {actionItems.map((item, index) => (
            <div key={index} className={`border-b border-gray-100 last:border-b-0`}>
              <button 
                onClick={item.action}
                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 ${item.isRed ? 'bg-red-100' : 'bg-gray-100'} rounded-full flex items-center justify-center`}>
                    <item.icon className={`w-5 h-5 ${item.isRed ? 'text-red-600' : 'text-gray-600'}`} />
                  </div>
                  <span className={`font-medium ${item.isRed ? 'text-red-600' : 'text-gray-800'}`}>
                    {item.label}
                  </span>
                </div>
                {item.hasArrow && <ChevronRight className="w-5 h-5 text-gray-400" />}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;