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
  Activity,
  X
} from 'lucide-react';
import { getLevelsStatus, LevelsStatusResponse } from '../services/api';
import { CardSkeleton, GridSkeleton } from './SkeletonLoader';

const LevelsStatusPage: React.FC = () => {
  const [levelsData, setLevelsData] = useState<LevelsStatusResponse['data'] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [levelDetails, setLevelDetails] = useState<any>(null);
  const [showLevelDetails, setShowLevelDetails] = useState(false);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [characterLevelDetails, setCharacterLevelDetails] = useState<any>(null);
  const [showCharacterLevelDetails, setShowCharacterLevelDetails] = useState(false);
  const [isLoadingCharacterDetails, setIsLoadingCharacterDetails] = useState(false);
  const [levelProgress, setLevelProgress] = useState<any>(null);
  const [isLoadingProgress, setIsLoadingProgress] = useState(false);

  useEffect(() => {
    fetchLevelsStatus();
    fetchLevelProgress();
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

  const forceUpdateLevels = async () => {
    try {
      setIsUpdating(true);
      setError(null);
      
      const response = await fetch('https://api.goalsbot.com/users/update-levels', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      
      if (data.success) {
        // Refresh the levels data after successful update
        await fetchLevelsStatus();
        alert('Levels updated successfully!');
      } else {
        setError(data.message || 'Failed to update levels');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update levels');
    } finally {
      setIsUpdating(false);
    }
  };

  const fetchLevelDetails = async () => {
    try {
      setIsLoadingDetails(true);
      setError(null);
      
      const response = await fetch('https://api.goalsbot.com/users/debug-digit-level', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
      });

      const data = await response.json();
      
      if (data.success) {
        setLevelDetails(data.data);
        setShowLevelDetails(true);
      } else {
        setError(data.message || 'Failed to fetch level details');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch level details');
    } finally {
      setIsLoadingDetails(false);
    }
  };

  const fetchCharacterLevelDetails = async () => {
    try {
      setIsLoadingCharacterDetails(true);
      setError(null);
      
      const response = await fetch('https://api.goalsbot.com/users/debug-character-level', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
      });

      const data = await response.json();
      
      if (data.success) {
        setCharacterLevelDetails(data.data);
        setShowCharacterLevelDetails(true);
      } else {
        setError(data.message || 'Failed to fetch character level details');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch character level details');
    } finally {
      setIsLoadingCharacterDetails(false);
    }
  };

  const fetchLevelProgress = async () => {
    try {
      setIsLoadingProgress(true);
      setError(null);
      
      const response = await fetch('https://api.goalsbot.com/users/level-progress', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
      });

      const data = await response.json();
      
      if (data.success) {
        setLevelProgress(data.data);
      } else {
        setError(data.message || 'Failed to fetch level progress');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch level progress');
    } finally {
      setIsLoadingProgress(false);
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
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-3 sm:space-y-0 mb-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <div className="text-center sm:text-left">
                <h1 className="text-2xl sm:text-3xl font-bold mb-2">Levels & Status</h1>
                <p className="text-indigo-100 opacity-90">Track your progress and earnings</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <button
                onClick={fetchLevelDetails}
                disabled={isLoadingDetails}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl disabled:cursor-not-allowed"
              >
                {isLoadingDetails ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Loading...</span>
                  </>
                ) : (
                  <>
                    <Target className="w-4 h-4" />
                    <span>Level Details</span>
                  </>
                )}
              </button>
              <button
                onClick={fetchCharacterLevelDetails}
                disabled={isLoadingCharacterDetails}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl disabled:cursor-not-allowed"
              >
                {isLoadingCharacterDetails ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Loading...</span>
                  </>
                ) : (
                  <>
                    <Crown className="w-4 h-4" />
                    <span>Character Level Status</span>
                  </>
                )}
              </button>
              <button
                onClick={forceUpdateLevels}
                disabled={isUpdating}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl disabled:cursor-not-allowed"
              >
                {isUpdating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Updating...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4" />
                    <span>Force Update Levels</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Premium Content */}
      <div className="px-4 sm:px-6 py-6 sm:py-8">
        <div className="max-w-4xl mx-auto">
          {/* Income Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-8">
            <div className="group bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/50 hover:shadow-2xl hover:bg-white/90 transition-all duration-300 hover:-translate-y-1">
              <div className="flex flex-col items-center text-center space-y-2 sm:space-y-3">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Crown className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-yellow-600 mb-1">${(levelsData.dailyIncome.characterLevel + levelsData.dailyIncome.digitLevel).toFixed(3)}</div>
                <div className="text-xs sm:text-sm text-gray-600 font-medium">My Level Income</div>
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

          {/* Level Progress Section */}
          {levelProgress && levelProgress.digitLevel && levelProgress.characterLevel && (
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 sm:p-8 shadow-xl border border-white/50 mb-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div className="text-center sm:text-left">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">Level Progress</h2>
                  <p className="text-gray-600">Track your progress towards next levels</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Digit Level Progress */}
                <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                      <Target className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-purple-800 text-lg">Digit Level Progress</h3>
                      <p className="text-purple-600 text-sm">Current: {levelProgress.digitLevel.currentLevel}</p>
                    </div>
                  </div>
                  
                  {/* Next Level Progress */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-purple-700">Next Level: {levelProgress.digitLevel.nextLevel}</span>
                      <span className="font-semibold text-purple-800">{levelProgress.digitLevel.nextLevelRequirements?.progress?.overall || 0}%</span>
                    </div>
                    <div className="w-full bg-purple-200 rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-purple-500 to-purple-600 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${levelProgress.digitLevel.nextLevelRequirements?.progress?.overall || 0}%` }}
                      ></div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-3 text-xs">
                      <div>
                        <div className="flex justify-between text-purple-700">
                          <span>Members:</span>
                          <span>{levelProgress.digitLevel.nextLevelRequirements?.current?.members || 0}/{levelProgress.digitLevel.nextLevelRequirements?.requirements?.members || 0}</span>
                        </div>
                        <div className="w-full bg-purple-200 rounded-full h-2 mt-1">
                          <div 
                            className="bg-purple-500 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${levelProgress.digitLevel.nextLevelRequirements?.progress?.members || 0}%` }}
                          ></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-purple-700">
                          <span>Wallet:</span>
                          <span>${(levelProgress.digitLevel.nextLevelRequirements?.current?.wallet || 0).toFixed(0)}/${levelProgress.digitLevel.nextLevelRequirements?.requirements?.wallet || 0}</span>
                        </div>
                        <div className="w-full bg-purple-200 rounded-full h-2 mt-1">
                          <div 
                            className="bg-purple-500 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${levelProgress.digitLevel.nextLevelRequirements?.progress?.wallet || 0}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* All Levels Progress */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-purple-800 text-sm">All Levels:</h4>
                    {Object.entries(levelProgress.digitLevel.levels || {}).map(([level, data]: [string, any]) => (
                      <div key={level} className="bg-white/50 rounded-lg p-3">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-purple-700 text-sm font-medium">{data.name}</span>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            data.met ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {data.met ? 'Achieved' : `${data.progress.overall}%`}
                          </span>
                        </div>
                        <div className="w-full bg-purple-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all duration-500 ${
                              data.met ? 'bg-green-500' : 'bg-purple-500'
                            }`}
                            style={{ width: `${data.progress.overall}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Character Level Progress */}
                <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl p-6 border border-orange-200">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                      <Crown className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-orange-800 text-lg">Character Level Progress</h3>
                      <p className="text-orange-600 text-sm">Current: {levelProgress.characterLevel.currentLevel}</p>
                    </div>
                  </div>
                  
                  {/* Next Level Progress */}
                  <div className="mb-4">
                                            <div className="flex justify-between text-sm mb-2">
                          <span className="text-orange-700">Next Level: {levelProgress.characterLevel.nextLevel}</span>
                          <span className="font-semibold text-orange-800">{levelProgress.characterLevel.nextLevelRequirements?.progress || 0}%</span>
                        </div>
                    <div className="w-full bg-orange-200 rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-orange-500 to-orange-600 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${levelProgress.characterLevel.nextLevelRequirements?.progress || 0}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-orange-600 mt-2">
                      {levelProgress.characterLevel.nextLevelRequirements?.description || 'No description available'}
                    </div>
                  </div>

                  {/* All Levels Progress */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-orange-800 text-sm">All Levels:</h4>
                    {Object.entries(levelProgress.characterLevel.levels || {}).map(([level, data]: [string, any]) => (
                      <div key={level} className="bg-white/50 rounded-lg p-3">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-orange-700 text-sm font-medium">{data.name}</span>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            data.met ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {data.met ? 'Achieved' : `${data.progress}%`}
                          </span>
                        </div>
                        <div className="w-full bg-orange-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all duration-500 ${
                              data.met ? 'bg-green-500' : 'bg-orange-500'
                            }`}
                            style={{ width: `${data.progress}%` }}
                          ></div>
                        </div>
                        <div className="text-xs text-orange-600 mt-1">{data.description}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Summary */}
              <div className="mt-6 bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-xl p-4 border border-emerald-200">
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-emerald-800">{levelProgress.summary?.currentDigitLevel || 'N/A'}</div>
                    <div className="text-xs text-emerald-600">Current Digit Level</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-emerald-800">{levelProgress.summary?.currentCharacterLevel || 'N/A'}</div>
                    <div className="text-xs text-emerald-600">Current Character Level</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-emerald-800">{levelProgress.summary?.totalLevelsAchieved || 0}</div>
                    <div className="text-xs text-emerald-600">Levels Achieved</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-emerald-800">{levelProgress.summary?.nextMilestone || 'N/A'}</div>
                    <div className="text-xs text-emerald-600">Next Milestone</div>
                  </div>
                </div>
              </div>
            </div>
          )}

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
                    <span className="font-semibold text-orange-800">${levelsData.characterLevel.totalEarned.toFixed(3)}</span>
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
                    <span className="font-semibold text-purple-800">${levelsData.digitLevel.totalEarned.toFixed(3)}</span>
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


        </div>
      </div>

      {/* Level Details Modal */}
      {showLevelDetails && levelDetails && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/50 w-full max-w-4xl max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl transform translate-x-8 -translate-y-8"></div>
              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/30 shadow-lg">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Level Details</h3>
                    <p className="text-white/80 text-sm">Current Level: {levelDetails.currentLevel}</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowLevelDetails(false)}
                  className="w-10 h-10 bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-xl flex items-center justify-center transition-all duration-200 border border-white/20"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 max-h-96 overflow-y-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* User Info */}
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
                  <h4 className="font-bold text-blue-800 text-lg mb-3">User Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-blue-700">Name:</span>
                      <span className="font-semibold text-blue-800">{levelDetails.user.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-700">Email:</span>
                      <span className="font-semibold text-blue-800">{levelDetails.user.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-700">Wallet Balance:</span>
                      <span className="font-semibold text-blue-800">${levelDetails.user.normalWalletBalance.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Direct Referrals */}
                <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-xl p-4 border border-emerald-200">
                  <h4 className="font-bold text-emerald-800 text-lg mb-3">Direct Referrals</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-emerald-700">Total Members:</span>
                      <span className="font-semibold text-emerald-800">{levelDetails.directReferrals.total}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-emerald-700">Valid Members:</span>
                      <span className="font-semibold text-emerald-800">{levelDetails.directReferrals.valid}</span>
                    </div>
                  </div>
                </div>

                {/* Level Status */}
                <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
                  <h4 className="font-bold text-purple-800 text-lg mb-3">Level Status</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-purple-700">Current Level:</span>
                      <span className="font-semibold text-purple-800">{levelDetails.currentLevel}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-purple-700">Calculated Level:</span>
                      <span className="font-semibold text-purple-800">{levelDetails.calculatedLevel}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-purple-700">Level Changed:</span>
                      <span className="font-semibold text-purple-800">{levelDetails.levelChanged ? 'Yes' : 'No'}</span>
                    </div>
                  </div>
                </div>

                {/* Daily Benefits */}
                <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl p-4 border border-orange-200">
                  <h4 className="font-bold text-orange-800 text-lg mb-3">Current Daily Benefits</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-orange-700">Level:</span>
                      <span className="font-semibold text-orange-800">{levelDetails.dailyBenefits.currentLevel.level}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-orange-700">Percentage:</span>
                      <span className="font-semibold text-orange-800">{levelDetails.dailyBenefits.currentLevel.percentage}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-orange-700">Daily Income:</span>
                      <span className="font-semibold text-orange-800">${levelDetails.dailyBenefits.currentLevel.dailyIncome.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-orange-700">Monthly Income:</span>
                      <span className="font-semibold text-orange-800">${levelDetails.dailyBenefits.currentLevel.monthlyIncome.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Level Checks */}
              <div className="mt-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200">
                <h4 className="font-bold text-gray-800 text-lg mb-3">Level Requirements Check</h4>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  {Object.entries(levelDetails.levelChecks).map(([level, checks]: [string, any]) => (
                    <div key={level} className="bg-white rounded-lg p-3 border border-gray-200">
                      <div className="text-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-2 ${
                          checks.result ? 'bg-green-500' : 'bg-red-500'
                        }`}>
                          <span className="text-white text-xs font-bold">{level}</span>
                        </div>
                        <div className="text-xs space-y-1">
                          <div className={`flex justify-between ${checks.members ? 'text-green-600' : 'text-red-600'}`}>
                            <span>Members:</span>
                            <span>{checks.members ? '✓' : '✗'}</span>
                          </div>
                          <div className={`flex justify-between ${checks.wallet ? 'text-green-600' : 'text-red-600'}`}>
                            <span>Wallet:</span>
                            <span>{checks.wallet ? '✓' : '✗'}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Next Level Benefits */}
              <div className="mt-6 bg-gradient-to-r from-indigo-50 to-indigo-100 rounded-xl p-4 border border-indigo-200">
                <h4 className="font-bold text-indigo-800 text-lg mb-3">Next Level Benefits</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {Object.entries(levelDetails.dailyBenefits.nextLevel).map(([level, benefits]: [string, any]) => (
                    <div key={level} className="bg-white rounded-lg p-3 border border-indigo-200">
                      <div className="text-center">
                        <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center mx-auto mb-2">
                          <span className="text-white text-xs font-bold">{level}</span>
                        </div>
                        <div className="text-xs space-y-1">
                          <div className="text-indigo-600">
                            <span>Members:</span>
                            <div className="font-semibold text-indigo-800">{benefits.membersNeeded}</div>
                          </div>
                          <div className="text-indigo-600">
                            <span>Wallet:</span>
                            <div className="font-semibold text-indigo-800">${benefits.walletNeeded.toFixed(0)}</div>
                          </div>
                          <div className="text-indigo-600">
                            <span>Daily:</span>
                            <div className="font-semibold text-indigo-800">${benefits.potentialDailyIncome.toFixed(2)}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Direct Members List */}
              {levelDetails.directReferrals.members.length > 0 && (
                <div className="mt-6 bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-xl p-4 border border-emerald-200">
                  <h4 className="font-bold text-emerald-800 text-lg mb-3">Direct Members</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-48 overflow-y-auto">
                    {levelDetails.directReferrals.members.map((member: any, index: number) => (
                      <div key={index} className="bg-white rounded-lg p-3 border border-emerald-200">
                        <div className="text-sm space-y-1">
                          <div className="font-semibold text-emerald-800">{member.name}</div>
                          <div className="text-emerald-600 text-xs">{member.email}</div>
                          <div className="flex justify-between text-xs">
                            <span className="text-emerald-600">Wallet:</span>
                            <span className="font-semibold text-emerald-800">${member.walletBalance.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-emerald-600">Valid:</span>
                            <span className={`font-semibold ${member.isValid ? 'text-green-600' : 'text-red-600'}`}>
                              {member.isValid ? '✓' : '✗'}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Character Level Details Modal */}
      {showCharacterLevelDetails && characterLevelDetails && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/50 w-full max-w-4xl max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl transform translate-x-8 -translate-y-8"></div>
              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/30 shadow-lg">
                    <Crown className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Character Level Status</h3>
                    <p className="text-white/80 text-sm">Current Level: {characterLevelDetails.characterLevel.currentLevel}</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowCharacterLevelDetails(false)}
                  className="w-10 h-10 bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-xl flex items-center justify-center transition-all duration-200 border border-white/20"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 max-h-96 overflow-y-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* User Info */}
                <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
                  <h4 className="font-bold text-purple-800 text-lg mb-3">User Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-purple-700">Name:</span>
                      <span className="font-semibold text-purple-800">{characterLevelDetails.user.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-purple-700">Email:</span>
                      <span className="font-semibold text-purple-800">{characterLevelDetails.user.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-purple-700">Referred By:</span>
                      <span className="font-semibold text-purple-800">{characterLevelDetails.user.referredBy || 'None'}</span>
                    </div>
                  </div>
                </div>

                {/* Character Level Status */}
                <div className="bg-gradient-to-r from-indigo-50 to-indigo-100 rounded-xl p-4 border border-indigo-200">
                  <h4 className="font-bold text-indigo-800 text-lg mb-3">Character Level Status</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-indigo-700">Current Level:</span>
                      <span className="font-semibold text-indigo-800">{characterLevelDetails.characterLevel.currentLevel}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-indigo-700">Calculated Level:</span>
                      <span className="font-semibold text-indigo-800">{characterLevelDetails.characterLevel.calculatedLevel}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-indigo-700">Level Changed:</span>
                      <span className="font-semibold text-indigo-800">{characterLevelDetails.characterLevel.levelChanged ? 'Yes' : 'No'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-indigo-700">Depth:</span>
                      <span className="font-semibold text-indigo-800">{characterLevelDetails.characterLevel.depth}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-indigo-700">Max Depth:</span>
                      <span className="font-semibold text-indigo-800">{characterLevelDetails.characterLevel.maxDepth}</span>
                    </div>
                  </div>
                </div>

                {/* Direct Referrals */}
                <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-xl p-4 border border-emerald-200">
                  <h4 className="font-bold text-emerald-800 text-lg mb-3">Direct Referrals</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-emerald-700">Total Members:</span>
                      <span className="font-semibold text-emerald-800">{characterLevelDetails.directReferrals.total}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-emerald-700">Total Balance:</span>
                      <span className="font-semibold text-emerald-800">${characterLevelDetails.directReferrals.totalBalance.toFixed(3)}</span>
                    </div>
                  </div>
                </div>

                {/* Current Daily Benefits */}
                <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl p-4 border border-orange-200">
                  <h4 className="font-bold text-orange-800 text-lg mb-3">Current Daily Benefits</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-orange-700">Level:</span>
                      <span className="font-semibold text-orange-800">{characterLevelDetails.dailyBenefits.currentLevel.level}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-orange-700">Percentage:</span>
                      <span className="font-semibold text-orange-800">{characterLevelDetails.dailyBenefits.currentLevel.percentage}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-orange-700">Daily Income:</span>
                      <span className="font-semibold text-orange-800">${characterLevelDetails.dailyBenefits.currentLevel.dailyIncome.toFixed(3)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-orange-700">Monthly Income:</span>
                      <span className="font-semibold text-orange-800">${characterLevelDetails.dailyBenefits.currentLevel.monthlyIncome.toFixed(3)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-orange-700">Source Balance:</span>
                      <span className="font-semibold text-orange-800">${characterLevelDetails.dailyBenefits.currentLevel.sourceBalance.toFixed(3)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Analysis */}
              <div className="mt-6 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
                <h4 className="font-bold text-blue-800 text-lg mb-3">Analysis</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-blue-700">Has Direct Referrals:</span>
                    <span className="font-semibold text-blue-800">{characterLevelDetails.analysis.hasDirectReferrals ? 'Yes' : 'No'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-700">Can Earn Character Income:</span>
                    <span className="font-semibold text-blue-800">{characterLevelDetails.analysis.canEarnCharacterIncome ? 'Yes' : 'No'}</span>
                  </div>
                  <div className="text-blue-700">
                    <span className="font-medium">Income Source:</span>
                    <div className="font-semibold text-blue-800 mt-1">{characterLevelDetails.analysis.incomeSource}</div>
                  </div>
                  <div className="text-blue-700">
                    <span className="font-medium">Recommendation:</span>
                    <div className="font-semibold text-blue-800 mt-1">{characterLevelDetails.analysis.recommendation}</div>
                  </div>
                </div>
              </div>

              {/* All Level Benefits */}
              <div className="mt-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200">
                <h4 className="font-bold text-gray-800 text-lg mb-3">All Level Benefits</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                  {Object.entries(characterLevelDetails.dailyBenefits.allLevels).map(([level, benefits]: [string, any]) => (
                    <div key={level} className="bg-white rounded-lg p-3 border border-gray-200">
                      <div className="text-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-2 ${
                          level === characterLevelDetails.characterLevel.currentLevel ? 'bg-purple-500' : 'bg-gray-400'
                        }`}>
                          <span className="text-white text-xs font-bold">{level}</span>
                        </div>
                        <div className="text-xs space-y-1">
                          <div className="text-gray-600">
                            <span>Percentage:</span>
                            <div className="font-semibold text-gray-800">{benefits.percentage}%</div>
                          </div>
                          <div className="text-gray-600">
                            <span>Daily:</span>
                            <div className="font-semibold text-gray-800">${benefits.potentialDailyIncome.toFixed(3)}</div>
                          </div>
                          <div className="text-gray-600">
                            <span>Monthly:</span>
                            <div className="font-semibold text-gray-800">${benefits.potentialMonthlyIncome.toFixed(3)}</div>
                          </div>
                        </div>
                        <div className="text-xs text-gray-500 mt-2">{benefits.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Direct Members List */}
              {characterLevelDetails.directReferrals.members.length > 0 && (
                <div className="mt-6 bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-xl p-4 border border-emerald-200">
                  <h4 className="font-bold text-emerald-800 text-lg mb-3">Direct Members</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-48 overflow-y-auto">
                    {characterLevelDetails.directReferrals.members.map((member: any, index: number) => (
                      <div key={index} className="bg-white rounded-lg p-3 border border-emerald-200">
                        <div className="text-sm space-y-1">
                          <div className="font-semibold text-emerald-800">{member.name}</div>
                          <div className="text-emerald-600 text-xs">{member.email}</div>
                          <div className="flex justify-between text-xs">
                            <span className="text-emerald-600">Wallet:</span>
                            <span className="font-semibold text-emerald-800">${member.walletBalance.toFixed(3)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LevelsStatusPage; 