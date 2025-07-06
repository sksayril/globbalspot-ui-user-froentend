import React, { useState } from 'react';
import { Copy, Share2, ChevronRight, Users, DollarSign, TrendingUp, X } from 'lucide-react';

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

interface TeamsPageProps {
  userStats: UserStats;
}

interface TeamMember {
  account: string;
  jointime: string;
  referrer: number;
  assets: number;
}

const TeamsPage: React.FC<TeamsPageProps> = ({ userStats }) => {
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
    { level: 'A', count: 1, color: 'bg-orange-500' },
    { level: 'B', count: 1, color: 'bg-red-400' },
    { level: 'C', count: 0, color: 'bg-red-400' },
    { level: 'D', count: 0, color: 'bg-red-400' }
  ];

  const teamAssets = [
    { level: 'A', amount: 320, color: 'bg-orange-500' },
    { level: 'B', amount: 320, color: 'bg-red-400' },
    { level: 'C', amount: 0, color: 'bg-red-400' },
    { level: 'D', amount: 0, color: 'bg-red-400' }
  ];

  const teamInvestments = [
    { level: 'A', count: 1, color: 'bg-teal-600' },
    { level: 'B', count: 1, color: 'bg-red-400' },
    { level: 'C', count: 0, color: 'bg-red-400' },
    { level: 'D', count: 0, color: 'bg-red-400' }
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
    D: []
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
    switch (level) {
      case 'A': return 'bg-orange-500';
      case 'B': return 'bg-red-400';
      case 'C': return 'bg-red-400';
      case 'D': return 'bg-red-400';
      default: return 'bg-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white px-4 py-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-teal-600" />
            </div>
            <div>
              <div className="text-sm text-gray-600">UID: {userStats.uid}</div>
              <div className="text-sm text-gray-600">Invite Code: {userStats.inviteCode}</div>
            </div>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => copyToClipboard(userStats.uid, 'uid')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Copy className="w-5 h-5 text-gray-600" />
            </button>
            <button
              onClick={() => copyToClipboard(userStats.inviteCode, 'invite')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Copy className="w-5 h-5 text-gray-600" />
            </button>
            <button className="bg-black text-white px-4 py-2 rounded-lg">
              Invite
            </button>
          </div>
        </div>

        {/* Team Stats */}
        <div className="bg-gradient-to-r from-slate-600 to-slate-700 rounded-lg p-4 text-white">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold">0</div>
              <div className="text-sm opacity-80">Team income today</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{userStats.teamIncome}</div>
              <div className="text-sm opacity-80">Total team income</div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="text-center">
              <div className="text-2xl font-bold">0</div>
              <div className="text-sm opacity-80">Team increased today</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">-</div>
              <div className="text-sm opacity-80">Team Total asset</div>
            </div>
          </div>
        </div>
      </div>

      {/* Team Sections */}
      <div className="p-4 space-y-6 pb-24">
        {/* Team Registration */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <Users className="w-6 h-6 text-gray-600" />
              <span className="font-semibold text-gray-800">Team Registration</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </div>
          <div className="p-4">
            <div className="grid grid-cols-4 gap-4">
              {teamLevels.map((level) => (
                <div key={level.level} className="text-center">
                  <button
                    onClick={() => handleTeamLevelClick(level.level)}
                    className={`w-12 h-12 ${level.color} rounded-lg flex items-center justify-center mx-auto mb-2 hover:opacity-80 transition-opacity`}
                  >
                    <span className="text-white font-bold">{level.level}</span>
                  </button>
                  <div className="text-lg font-semibold">{level.count}</div>
                  <div className="text-sm text-gray-600">Person</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Team Assets */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <DollarSign className="w-6 h-6 text-gray-600" />
              <span className="font-semibold text-gray-800">Team Assets</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </div>
          <div className="p-4">
            <div className="grid grid-cols-4 gap-4">
              {teamAssets.map((asset) => (
                <div key={asset.level} className="text-center">
                  <div className={`w-12 h-12 ${asset.color} rounded-lg flex items-center justify-center mx-auto mb-2`}>
                    <DollarSign className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-lg font-semibold">{asset.amount}</div>
                  <div className="text-sm text-gray-600">
                    {asset.level === 'A' ? 'Team assets' : 'Asset'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Team Investment Number */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <TrendingUp className="w-6 h-6 text-gray-600" />
              <span className="font-semibold text-gray-800">Team Investment Number</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </div>
          <div className="p-4">
            <div className="grid grid-cols-4 gap-4">
              {teamInvestments.map((investment) => (
                <div key={investment.level} className="text-center">
                  <div className={`w-12 h-12 ${investment.color} rounded-lg flex items-center justify-center mx-auto mb-2`}>
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-lg font-semibold">{investment.count}</div>
                  <div className="text-sm text-gray-600">Investment</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Team Details Modal - Fixed UI */}
      {showTeamDetails && selectedTeamLevel && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-md rounded-xl shadow-2xl max-h-[90vh] flex flex-col">
            {/* Modal Header - Fixed */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 flex-shrink-0">
              <h2 className="text-lg font-semibold text-gray-800">Team Level {selectedTeamLevel}</h2>
              <button
                onClick={closeTeamDetails}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Level Tabs - Fixed */}
            <div className="flex border-b border-gray-200 flex-shrink-0">
              {['A', 'B', 'C', 'D'].map((level) => (
                <button
                  key={level}
                  onClick={() => setSelectedTeamLevel(level)}
                  className={`flex-1 py-3 px-4 text-center font-medium transition-colors ${
                    selectedTeamLevel === level
                      ? `${getSelectedLevelColor(level)} text-white`
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>

            {/* Table Header - Fixed */}
            <div className="grid grid-cols-4 gap-2 p-4 bg-gray-50 text-sm font-medium text-gray-600 flex-shrink-0">
              <div className="text-center">Account</div>
              <div className="text-center">Jointime</div>
              <div className="text-center">Referrer</div>
              <div className="text-center">Assets</div>
            </div>

            {/* Team Members List - Scrollable */}
            <div className="flex-1 overflow-y-auto">
              {teamMembersData[selectedTeamLevel]?.length > 0 ? (
                <>
                  {teamMembersData[selectedTeamLevel].map((member, index) => (
                    <div key={index} className="grid grid-cols-4 gap-2 p-4 border-b border-gray-100 text-sm">
                      <div className="font-medium text-gray-800 text-center">{member.account}</div>
                      <div className="text-gray-600 text-center">{member.jointime}</div>
                      <div className="text-gray-600 text-center">{member.referrer}</div>
                      <div className="font-medium text-gray-800 text-center">{member.assets}</div>
                    </div>
                  ))}
                  
                  {/* No more data footer */}
                  <div className="p-6 text-center text-gray-500 text-sm">
                    No more data
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center p-8">
                  <div className="text-center">
                    <div className="text-gray-400 mb-2 text-lg">No team members</div>
                    <div className="text-sm text-gray-500">No members in level {selectedTeamLevel} yet</div>
                  </div>
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