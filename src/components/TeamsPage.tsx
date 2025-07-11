import React, { useState } from 'react';
import { Copy, Share2, ChevronRight, Users, DollarSign, TrendingUp, X, Star, Crown, Shield, Award, Check } from 'lucide-react';
import { CardSkeleton, GridSkeleton } from './SkeletonLoader';

interface UserStats {
  dailyIncome?: {
    totalEarned: number;
    todayEarned: number;
  };
  referralLevel?: number;
  teamIncome?: number;
  teamMembers?: number;
  inviteCode?: string;
}

interface TeamsPageProps {
  userStats: UserStats;
  referralCode?: string;
}

interface TeamMember {
  account: string;
  jointime: string;
  referrer: number;
  assets: number;
}

const TeamsPage: React.FC<TeamsPageProps> = ({ userStats, referralCode }) => {
  // Show skeleton loader if data is loading
  if (!userStats) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="px-4 sm:px-6 py-8">
          <div className="mb-8">
            <CardSkeleton />
          </div>
          <GridSkeleton cols={2} rows={2} />
        </div>
      </div>
    );
  }

  const [copiedUID, setCopiedUID] = useState(false);
  const [copiedInvite, setCopiedInvite] = useState(false);
  const [selectedTeamLevel, setSelectedTeamLevel] = useState<string | null>(null);
  const [showTeamDetails, setShowTeamDetails] = useState(false);

  const copyToClipboard = (text: string, type: 'uid' | 'invite') => {
    navigator.clipboard.writeText(text);
    if (type === 'uid') {
      setCopiedUID(true);
      setTimeout(() => setCopiedUID(false), 2000);
    } else {
      setCopiedInvite(true);
      setTimeout(() => setCopiedInvite(false), 2000);
    }
  };

  const teamLevels = [
    { level: 'A', count: 1, color: 'from-orange-500 to-orange-600', bgColor: 'bg-orange-50', iconColor: 'text-orange-600' },
    { level: 'B', count: 1, color: 'from-red-500 to-red-600', bgColor: 'bg-red-50', iconColor: 'text-red-600' },
    { level: 'C', count: 0, color: 'from-pink-500 to-pink-600', bgColor: 'bg-pink-50', iconColor: 'text-pink-600' },
    { level: 'D', count: 0, color: 'from-blue-500 to-blue-600', bgColor: 'bg-blue-50', iconColor: 'text-blue-600' },
    { level: 'E', count: 0, color: 'from-purple-500 to-purple-600', bgColor: 'bg-purple-50', iconColor: 'text-purple-600' }
  ];

  const teamAssets = [
    { level: 'A', amount: 320, color: 'from-orange-500 to-orange-600', bgColor: 'bg-orange-50', iconColor: 'text-orange-600' },
    { level: 'B', amount: 320, color: 'from-red-500 to-red-600', bgColor: 'bg-red-50', iconColor: 'text-red-600' },
    { level: 'C', amount: 0, color: 'from-pink-500 to-pink-600', bgColor: 'bg-pink-50', iconColor: 'text-pink-600' },
    { level: 'D', amount: 0, color: 'from-blue-500 to-blue-600', bgColor: 'bg-blue-50', iconColor: 'text-blue-600' },
    { level: 'E', amount: 0, color: 'from-purple-500 to-purple-600', bgColor: 'bg-purple-50', iconColor: 'text-purple-600' }
  ];

  const teams = [
    { level: 'A', count: 1, color: 'from-teal-500 to-teal-600', name: 'Alpha Team', bgColor: 'bg-teal-50', iconColor: 'text-teal-600' },
    { level: 'B', count: 1, color: 'from-red-500 to-red-600', name: 'Beta Team', bgColor: 'bg-red-50', iconColor: 'text-red-600' },
    { level: 'C', count: 0, color: 'from-pink-500 to-pink-600', name: 'Gamma Team', bgColor: 'bg-pink-50', iconColor: 'text-pink-600' },
    { level: 'D', count: 0, color: 'from-blue-500 to-blue-600', name: 'Delta Team', bgColor: 'bg-blue-50', iconColor: 'text-blue-600' },
    { level: 'E', count: 0, color: 'from-purple-500 to-purple-600', name: 'Elite Team', bgColor: 'bg-purple-50', iconColor: 'text-purple-600' }
  ];

  // Sample team member data for different levels
  const teamMembersData: { [key: string]: TeamMember[] } = {
    A: [
      { account: '930****601', jointime: '02/07', referrer: 0, assets: 320 }
    ],
    B: [
      { account: '930****601', jointime: '02/07', referrer: 0, assets: 320 }
    ],
    C: [],
    D: [],
    E: []
  };

  const handleTeamLevelClick = (level: string) => {
    setSelectedTeamLevel(level);
    setShowTeamDetails(true);
  };

  const closeTeamDetails = () => {
    setShowTeamDetails(false);
    setSelectedTeamLevel(null);
  };

  const getSelectedLevelColor = (level: string) => {
    const team = teams.find(t => t.level === level);
    return team ? team.color : 'from-gray-500 to-gray-600';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Premium Header */}
      <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-700 px-4 sm:px-6 py-8 sm:py-12 text-white">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div className="text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl font-bold mb-2">Team Management</h1>
              <p className="text-indigo-100 opacity-90">Build your network and earn together</p>
            </div>
          </div>
        </div>
      </div>

      {/* Premium Content */}
      <div className="px-4 sm:px-6 py-6 sm:py-8">
        <div className="max-w-4xl mx-auto">
          {/* Referral Code Section */}
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 sm:p-8 shadow-xl border border-white/50 mb-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                <Copy className="w-6 h-6 text-white" />
              </div>
              <div className="text-center sm:text-left">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">Your Referral Code</h2>
                <p className="text-gray-600">Share this code with friends to earn rewards</p>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-xl p-4 sm:p-6 border border-emerald-200">
              <div className="flex flex-col sm:flex-row items-center justify-between space-y-3 sm:space-y-0">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center">
                    <Star className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-center sm:text-left">
                    <div className="font-semibold text-emerald-800 text-lg">{referralCode || 'N/A'}</div>
                    <div className="text-sm text-emerald-600">Your unique referral code</div>
                  </div>
                </div>
                <button
                  onClick={() => copyToClipboard(referralCode || userStats.inviteCode || '', 'invite')}
                  className="flex items-center space-x-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl text-sm font-medium"
                >
                  {copiedInvite ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copy Code</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Team Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
            <div className="group bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/50 hover:shadow-2xl hover:bg-white/90 transition-all duration-300 hover:-translate-y-1">
              <div className="flex flex-col items-center text-center space-y-2 sm:space-y-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-blue-600 mb-1">{userStats?.teamMembers || 0}</div>
                <div className="text-xs sm:text-sm text-gray-600 font-medium">Team Members</div>
              </div>
            </div>
            <div className="group bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/50 hover:shadow-2xl hover:bg-white/90 transition-all duration-300 hover:-translate-y-1">
              <div className="flex flex-col items-center text-center space-y-2 sm:space-y-3">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-emerald-600 mb-1">${userStats?.teamIncome || 0}</div>
                <div className="text-xs sm:text-sm text-gray-600 font-medium">Team Income</div>
              </div>
            </div>
            <div className="group bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/50 hover:shadow-2xl hover:bg-white/90 transition-all duration-300 hover:-translate-y-1">
              <div className="flex flex-col items-center text-center space-y-2 sm:space-y-3">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-purple-600 mb-1">Level {userStats?.referralLevel || 0}</div>
                <div className="text-xs sm:text-sm text-gray-600 font-medium">VIP Level</div>
              </div>
            </div>
            <div className="group bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/50 hover:shadow-2xl hover:bg-white/90 transition-all duration-300 hover:-translate-y-1">
              <div className="flex flex-col items-center text-center space-y-2 sm:space-y-3">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Crown className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-orange-600 mb-1">${userStats?.dailyIncome?.totalEarned || 0}</div>
                <div className="text-xs sm:text-sm text-gray-600 font-medium">Total Income</div>
              </div>
            </div>
          </div>

          {/* Team Benefits Section */}
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 sm:p-8 shadow-xl border border-white/50">
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div className="text-center sm:text-left">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">Team Benefits</h2>
                <p className="text-gray-600">Unlock rewards by building your team</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
                <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 mb-4">
                  <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-center sm:text-left">
                    <h3 className="font-semibold text-blue-800 text-lg">Direct Referrals</h3>
                    <p className="text-blue-600 text-sm">Earn from direct team members</p>
                  </div>
                </div>
                <ul className="space-y-2 text-xs sm:text-sm text-blue-700">
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>5% commission on deposits</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Daily income sharing</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Level-based bonuses</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
                <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 mb-4">
                  <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                    <Award className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-center sm:text-left">
                    <h3 className="font-semibold text-purple-800 text-lg">Team Rewards</h3>
                    <p className="text-purple-600 text-sm">Unlock exclusive benefits</p>
                  </div>
                </div>
                <ul className="space-y-2 text-xs sm:text-sm text-purple-700">
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span>Higher daily income rates</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span>VIP status upgrades</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span>Exclusive investment opportunities</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Premium Team Sections */}
      <div className="p-6 space-y-8 pb-24">
        {/* Premium Team Registration */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <Users className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-bold text-gray-800 text-lg">Team Registration</h3>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </div>
          <div className="p-6">
            <div className="grid grid-cols-5 gap-4">
              {teamLevels.map((level) => (
                <div key={level.level} className="text-center">
                  <button
                    onClick={() => handleTeamLevelClick(level.level)}
                    className={`group w-14 h-14 bg-gradient-to-br ${level.color} rounded-xl flex items-center justify-center mx-auto mb-3 hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-xl`}
                  >
                    <span className="text-white font-bold text-lg">{level.level}</span>
                  </button>
                  <div className="text-xl font-bold text-gray-800 mb-1">{level.count}</div>
                  <div className="text-sm text-gray-600 font-medium">Person</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Premium Team Assets */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                <DollarSign className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-bold text-gray-800 text-lg">Team Assets</h3>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </div>
          <div className="p-6">
            <div className="grid grid-cols-5 gap-4">
              {teamAssets.map((asset) => (
                <div key={asset.level} className="text-center">
                  <div className={`group w-14 h-14 bg-gradient-to-br ${asset.color} rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg hover:scale-110 transition-all duration-300 hover:shadow-xl`}>
                    <span className="text-white font-bold text-lg">{asset.level}</span>
                  </div>
                  <div className="text-xl font-bold text-gray-800 mb-1">{asset.amount}</div>
                  <div className="text-sm text-gray-600 font-medium">Assets</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Premium Teams */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Star className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-bold text-gray-800 text-lg">Teams</h3>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </div>
          <div className="p-6">
            <div className="grid grid-cols-5 gap-4">
              {teams.map((team) => (
                <div key={team.level} className="text-center">
                  <div className={`group w-14 h-14 bg-gradient-to-br ${team.color} rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg hover:scale-110 transition-all duration-300 hover:shadow-xl`}>
                    <span className="text-white font-bold text-lg">{team.level}</span>
                  </div>
                  <div className="text-xl font-bold text-gray-800 mb-1">{team.count}</div>
                  <div className="text-xs text-gray-600 font-medium leading-tight">{team.name}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Premium Team Details Modal */}
      {showTeamDetails && selectedTeamLevel && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/50 w-full max-w-md max-h-[80vh] overflow-hidden">
            {/* Modal Header */}
            <div className={`bg-gradient-to-r ${getSelectedLevelColor(selectedTeamLevel)} p-6 text-white relative overflow-hidden`}>
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl transform translate-x-8 -translate-y-8"></div>
              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/30 shadow-lg">
                    <span className="text-white font-bold text-lg">{selectedTeamLevel}</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">
                      {teams.find(t => t.level === selectedTeamLevel)?.name} Details
                    </h3>
                    <p className="text-white/80 text-sm">Level {selectedTeamLevel} Members</p>
                  </div>
                </div>
                <button
                  onClick={closeTeamDetails}
                  className="w-10 h-10 bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-xl flex items-center justify-center transition-all duration-200 border border-white/20"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 max-h-96 overflow-y-auto">
              {teamMembersData[selectedTeamLevel] && teamMembersData[selectedTeamLevel].length > 0 ? (
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 mb-4">
                    <Award className="w-5 h-5 text-indigo-600" />
                    <span className="font-semibold text-gray-800">Team Members ({teamMembersData[selectedTeamLevel].length})</span>
                  </div>
                  {teamMembersData[selectedTeamLevel].map((member, index) => (
                    <div key={index} className="bg-gradient-to-r from-gray-50 to-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600 font-medium">Account:</span>
                          <div className="font-semibold text-gray-800">{member.account}</div>
                        </div>
                        <div>
                          <span className="text-gray-600 font-medium">Join Date:</span>
                          <div className="font-semibold text-gray-800">{member.jointime}</div>
                        </div>
                        <div>
                          <span className="text-gray-600 font-medium">Referrer:</span>
                          <div className="font-semibold text-gray-800">{member.referrer}</div>
                        </div>
                        <div>
                          <span className="text-gray-600 font-medium">Assets:</span>
                          <div className="font-semibold text-emerald-600">${member.assets}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <Users className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500 font-medium mb-2">No team members yet</p>
                  <p className="text-gray-400 text-sm">Invite friends to join your {teams.find(t => t.level === selectedTeamLevel)?.name}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Toast Messages */}
      {copiedUID && (
        <div className="fixed bottom-24 left-1/2 transform -translate-x-1/2 bg-black text-white px-4 py-2 rounded-lg z-50">
          UID copied to clipboard!
        </div>
      )}
      {copiedInvite && (
        <div className="fixed bottom-24 left-1/2 transform -translate-x-1/2 bg-black text-white px-4 py-2 rounded-lg z-50">
          Invite code copied to clipboard!
        </div>
      )}
    </div>
  );
};

export default TeamsPage;