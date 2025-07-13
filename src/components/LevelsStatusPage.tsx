import React, { useState, useEffect } from 'react';
import { 
  Crown, 
  Target, 
  TrendingUp, 
  DollarSign, 
  Users, 
  Award, 
  Star, 
  CheckCircle, 
  Clock, 
  Calendar,
  ArrowRight,
  Zap,
  Shield,
  Trophy,
  Gift,
  Activity
} from 'lucide-react';
import { getLevelsStatus, LevelsStatusResponse } from '../services/api';
import { CardSkeleton, GridSkeleton } from './SkeletonLoader';

const LevelsStatusPage: React.FC = () => {
  const [levelsData, setLevelsData] = useState<LevelsStatusResponse['data'] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchLevelsStatus();
  }, []);

  const fetchLevelsStatus = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await getLevelsStatus();
      setLevelsData(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch levels status');
    } finally {
      setIsLoading(false);
    }
  };

  // Show skeleton loader if data is loading
  if (isLoading) {
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

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Activity className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Error Loading Data</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchLevelsStatus}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!levelsData) {
    return null;
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getCharacterLevelColor = (level: string) => {
    const colors = {
      'A': 'from-orange-500 to-orange-600',
      'B': 'from-red-500 to-red-600',
      'C': 'from-pink-500 to-pink-600',
      'D': 'from-blue-500 to-blue-600',
      'E': 'from-purple-500 to-purple-600'
    };
    return colors[level as keyof typeof colors] || 'from-gray-500 to-gray-600';
  };

  const getDigitLevelColor = (level: string) => {
    const colors = {
      'Lvl1': 'from-green-500 to-green-600',
      'Lvl2': 'from-blue-500 to-blue-600',
      'Lvl3': 'from-purple-500 to-purple-600',
      'Lvl4': 'from-orange-500 to-orange-600',
      'Lvl5': 'from-red-500 to-red-600'
    };
    return colors[level as keyof typeof colors] || 'from-gray-500 to-gray-600';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Premium Header */}
      <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-700 px-4 sm:px-6 py-8 sm:py-12 text-white">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <div className="text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl font-bold mb-2">Levels & Status</h1>
              <p className="text-indigo-100 opacity-90">Track your progress and earnings</p>
            </div>
          </div>
        </div>
      </div>

      {/* Premium Content */}
      <div className="px-4 sm:px-6 py-6 sm:py-8">
        <div className="max-w-4xl mx-auto">
          {/* Income Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
            <div className="group bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/50 hover:shadow-2xl hover:bg-white/90 transition-all duration-300 hover:-translate-y-1">
              <div className="flex flex-col items-center text-center space-y-2 sm:space-y-3">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-emerald-600 mb-1">${levelsData.potentialIncome.total}</div>
                <div className="text-xs sm:text-sm text-gray-600 font-medium">Total Potential</div>
              </div>
            </div>
            <div className="group bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/50 hover:shadow-2xl hover:bg-white/90 transition-all duration-300 hover:-translate-y-1">
              <div className="flex flex-col items-center text-center space-y-2 sm:space-y-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-blue-600 mb-1">${levelsData.potentialIncome.character}</div>
                <div className="text-xs sm:text-sm text-gray-600 font-medium">Character Income</div>
              </div>
            </div>
            <div className="group bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/50 hover:shadow-2xl hover:bg-white/90 transition-all duration-300 hover:-translate-y-1">
              <div className="flex flex-col items-center text-center space-y-2 sm:space-y-3">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-purple-600 mb-1">${levelsData.potentialIncome.digit}</div>
                <div className="text-xs sm:text-sm text-gray-600 font-medium">Digit Income</div>
              </div>
            </div>
            <div className="group bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/50 hover:shadow-2xl hover:bg-white/90 transition-all duration-300 hover:-translate-y-1">
              <div className="flex flex-col items-center text-center space-y-2 sm:space-y-3">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Gift className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-orange-600 mb-1">{levelsData.canClaim ? 'Yes' : 'No'}</div>
                <div className="text-xs sm:text-sm text-gray-600 font-medium">Can Claim</div>
              </div>
            </div>
          </div>

          {/* Character Level Section */}
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 sm:p-8 shadow-xl border border-white/50 mb-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <div className="text-center sm:text-left">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">Character Level</h2>
                <p className="text-gray-600">Your current character level and earnings</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Current Level */}
              <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl p-6 border border-orange-200">
                <div className="flex items-center space-x-4 mb-4">
                  <div className={`w-16 h-16 bg-gradient-to-br ${getCharacterLevelColor(levelsData.characterLevel.current)} rounded-xl flex items-center justify-center shadow-lg`}>
                    <span className="text-white font-bold text-2xl">{levelsData.characterLevel.current}</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-orange-800 text-lg">Current Level</h3>
                    <p className="text-orange-600 text-sm">Character Level {levelsData.characterLevel.current}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-orange-700">Total Earned:</span>
                    <span className="font-semibold text-orange-800">${levelsData.characterLevel.totalEarned}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-orange-700">Last Calculated:</span>
                    <span className="font-semibold text-orange-800">{formatDate(levelsData.characterLevel.lastCalculated)}</span>
                  </div>
                </div>
              </div>

              {/* Level Percentages */}
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
                <h3 className="font-bold text-blue-800 text-lg mb-4">Level Percentages</h3>
                <div className="space-y-3">
                  {Object.entries(levelsData.characterLevel.percentages).map(([level, percentage]) => (
                    <div key={level} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className={`w-6 h-6 bg-gradient-to-br ${getCharacterLevelColor(level)} rounded-full flex items-center justify-center`}>
                          <span className="text-white text-xs font-bold">{level}</span>
                        </div>
                        <span className="text-blue-700 text-sm">Level {level}</span>
                      </div>
                      <span className="font-semibold text-blue-800">{percentage}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Digit Level Section */}
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 sm:p-8 shadow-xl border border-white/50 mb-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div className="text-center sm:text-left">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">Digit Level</h2>
                <p className="text-gray-600">Your current digit level and team requirements</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Current Level */}
              <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
                <div className="flex items-center space-x-4 mb-4">
                  <div className={`w-16 h-16 bg-gradient-to-br ${getDigitLevelColor(levelsData.digitLevel.current)} rounded-xl flex items-center justify-center shadow-lg`}>
                    <span className="text-white font-bold text-lg">{levelsData.digitLevel.current}</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-purple-800 text-lg">Current Level</h3>
                    <p className="text-purple-600 text-sm">Digit Level {levelsData.digitLevel.current}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-purple-700">Total Earned:</span>
                    <span className="font-semibold text-purple-800">${levelsData.digitLevel.totalEarned}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-purple-700">Direct Members:</span>
                    <span className="font-semibold text-purple-800">{levelsData.digitLevel.directMembers.length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-purple-700">Last Calculated:</span>
                    <span className="font-semibold text-purple-800">{formatDate(levelsData.digitLevel.lastCalculated)}</span>
                  </div>
                </div>
              </div>

              {/* Level Criteria */}
              <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
                <h3 className="font-bold text-green-800 text-lg mb-4">Level Criteria</h3>
                <div className="space-y-3 max-h-48 overflow-y-auto">
                  {Object.entries(levelsData.digitLevel.criteria).map(([level, criteria]) => (
                    <div key={level} className="bg-white/50 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <div className={`w-6 h-6 bg-gradient-to-br ${getDigitLevelColor(level)} rounded-full flex items-center justify-center`}>
                            <span className="text-white text-xs font-bold">{level}</span>
                          </div>
                          <span className="text-green-700 text-sm font-medium">{level}</span>
                        </div>
                        <div className="text-xs text-green-600">
                          {criteria.directMembers} members
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-green-600">Member Wallet:</span>
                          <div className="font-semibold text-green-800">${criteria.memberWalletMin}</div>
                        </div>
                        <div>
                          <span className="text-green-600">Self Wallet:</span>
                          <div className="font-semibold text-green-800">${criteria.selfWalletMin}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Direct Members Section */}
          {levelsData.digitLevel.directMembers.length > 0 && (
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 sm:p-8 shadow-xl border border-white/50 mb-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div className="text-center sm:text-left">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">Direct Members</h2>
                  <p className="text-gray-600">Your direct team members and their details</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {levelsData.digitLevel.directMembers.map((member, index) => (
                  <div key={index} className="bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-xl p-4 border border-emerald-200">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center">
                        <Users className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="font-semibold text-emerald-800">{member.memberId}</div>
                        <div className="text-xs text-emerald-600">Member ID</div>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-emerald-700">Joined:</span>
                        <span className="font-semibold text-emerald-800">{formatDate(member.joinedAt)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-emerald-700">Wallet:</span>
                        <span className="font-semibold text-emerald-800">${member.walletBalance}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Daily Income Section */}
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 sm:p-8 shadow-xl border border-white/50">
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div className="text-center sm:text-left">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">Daily Income</h2>
                <p className="text-gray-600">Your daily income breakdown</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-gradient-to-r from-indigo-50 to-indigo-100 rounded-xl p-6 border border-indigo-200">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-indigo-500 rounded-lg flex items-center justify-center">
                    <Crown className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-indigo-800 text-lg">Character Level</h3>
                    <p className="text-indigo-600 text-sm">Daily income from character level</p>
                  </div>
                </div>
                <div className="text-2xl font-bold text-indigo-800 mb-2">${levelsData.dailyIncome.characterLevel}</div>
                <div className="text-sm text-indigo-600">Per day</div>
              </div>
              
              <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                    <Target className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-purple-800 text-lg">Digit Level</h3>
                    <p className="text-purple-600 text-sm">Daily income from digit level</p>
                  </div>
                </div>
                <div className="text-2xl font-bold text-purple-800 mb-2">${levelsData.dailyIncome.digitLevel}</div>
                <div className="text-sm text-purple-600">Per day</div>
              </div>
            </div>
            
            <div className="mt-6 bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-xl p-4 border border-emerald-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Clock className="w-5 h-5 text-emerald-600" />
                  <span className="text-emerald-700 font-medium">Last Claimed:</span>
                </div>
                <span className="font-semibold text-emerald-800">{formatDate(levelsData.dailyIncome.lastClaimed)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LevelsStatusPage; 