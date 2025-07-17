import React, { useState, useEffect } from 'react';
import { Copy, Share2, ChevronRight, Users, DollarSign, TrendingUp, X, Star, Crown, Shield, Award, Check, MessageCircle, Facebook, Twitter, Globe } from 'lucide-react';
import { CardSkeleton, GridSkeleton } from './SkeletonLoader';
import { getTeamIncome, TeamIncomeResponse } from '../services/api';

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

interface TeamIncomeData {
  user: {
    id: string;
    name: string;
    email: string;
    referralCode: string;
    characterLevel: string;
    digitLevel: string | null;
  };
  levelBasedIncome: {
    characterLevelIncome: number;
    digitLevelIncome: number;
    totalDailyTeamIncome: number;
    characterLevel: string;
    digitLevel: string | null;
  };
  teamIncomeByLevel: {
    level1: any;
    level2: any;
    level3: any;
    level4: any;
    level5: any;
  };
  totalTeamMembers: number;
  totalTeamIncome: number;
  totalNormalWalletBalance: number;
  totalInvestmentWalletBalance: number;
  summary: {
    level1Members: number;
    level2Members: number;
    level3Members: number;
    level4Members: number;
    level5Members: number;
    totalMembers: number;
    totalIncome: number;
    totalNormalWallet: number;
    totalInvestmentWallet: number;
    dailyTeamIncome: number;
  };
}

const TeamsPage: React.FC<TeamsPageProps> = ({ userStats, referralCode }) => {
  // State for API data
  const [teamIncomeData, setTeamIncomeData] = useState<TeamIncomeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTeamIncome = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('https://api.goalsbot.com/users/team-income', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          },
        });
        const data = await res.json();
        if (data.success) {
          setTeamIncomeData(data.data);
        } else {
          setError(data.message || 'Failed to fetch team income');
        }
      } catch (err: any) {
        setError(err.message || 'Failed to fetch team income');
      } finally {
        setLoading(false);
      }
    };
    fetchTeamIncome();
  }, []);

  // Map API data to UI expected structure (MUST be before any return)
  const api = teamIncomeData;
  const teamLevels = [
    { level: 'A', count: api?.teamIncomeByLevel.level1.count || 0, color: 'from-orange-500 to-orange-600', bgColor: 'bg-orange-50', iconColor: 'text-orange-600' },
    { level: 'B', count: api?.teamIncomeByLevel.level2.count || 0, color: 'from-red-500 to-red-600', bgColor: 'bg-red-50', iconColor: 'text-red-600' },
    { level: 'C', count: api?.teamIncomeByLevel.level3.count || 0, color: 'from-pink-500 to-pink-600', bgColor: 'bg-pink-50', iconColor: 'text-pink-600' },
    { level: 'D', count: api?.teamIncomeByLevel.level4.count || 0, color: 'from-blue-500 to-blue-600', bgColor: 'bg-blue-50', iconColor: 'text-blue-600' },
    { level: 'E', count: api?.teamIncomeByLevel.level5.count || 0, color: 'from-purple-500 to-purple-600', bgColor: 'bg-purple-50', iconColor: 'text-purple-600' }
  ];
  const teamAssets = [
    { level: 'A', amount: api?.teamIncomeByLevel.level1.totalInvestmentWallet || 0, color: 'from-orange-500 to-orange-600', bgColor: 'bg-orange-50', iconColor: 'text-orange-600' },
    { level: 'B', amount: api?.teamIncomeByLevel.level2.totalInvestmentWallet || 0, color: 'from-red-500 to-red-600', bgColor: 'bg-red-50', iconColor: 'text-red-600' },
    { level: 'C', amount: api?.teamIncomeByLevel.level3.totalInvestmentWallet || 0, color: 'from-pink-500 to-pink-600', bgColor: 'bg-pink-50', iconColor: 'text-pink-600' },
    { level: 'D', amount: api?.teamIncomeByLevel.level4.totalInvestmentWallet || 0, color: 'from-blue-500 to-blue-600', bgColor: 'bg-blue-50', iconColor: 'text-blue-600' },
    { level: 'E', amount: api?.teamIncomeByLevel.level5.totalInvestmentWallet || 0, color: 'from-purple-500 to-purple-600', bgColor: 'bg-purple-50', iconColor: 'text-purple-600' }
  ];
  const teams = [
    { level: 'A', count: api?.teamIncomeByLevel.level1.count || 0, color: 'from-teal-500 to-teal-600', name: 'Alpha Team', bgColor: 'bg-teal-50', iconColor: 'text-teal-600' },
    { level: 'B', count: api?.teamIncomeByLevel.level2.count || 0, color: 'from-red-500 to-red-600', name: 'Beta Team', bgColor: 'bg-red-50', iconColor: 'text-red-600' },
    { level: 'C', count: api?.teamIncomeByLevel.level3.count || 0, color: 'from-pink-500 to-pink-600', name: 'Gamma Team', bgColor: 'bg-pink-50', iconColor: 'text-pink-600' },
    { level: 'D', count: api?.teamIncomeByLevel.level4.count || 0, color: 'from-blue-500 to-blue-600', name: 'Delta Team', bgColor: 'bg-blue-50', iconColor: 'text-blue-600' },
    { level: 'E', count: api?.teamIncomeByLevel.level5.count || 0, color: 'from-purple-500 to-purple-600', name: 'Elite Team', bgColor: 'bg-purple-50', iconColor: 'text-purple-600' }
  ];
  const teamMembersData: { [key: string]: any[] } = {
    A: api?.teamIncomeByLevel.level1.users || [],
    B: api?.teamIncomeByLevel.level2.users || [],
    C: api?.teamIncomeByLevel.level3.users || [],
    D: api?.teamIncomeByLevel.level4.users || [],
    E: api?.teamIncomeByLevel.level5.users || []
  };
  const mappedUserStats = {
    dailyIncome: { totalEarned: 0, todayEarned: 0 },
    referralLevel: 0,
    teamIncome: api?.totalTeamIncome || 0,
    teamMembers: api?.totalTeamMembers || 0,
    inviteCode: api?.user.referralCode || ''
  };

  const [copiedUID, setCopiedUID] = useState(false);
  const [copiedInvite, setCopiedInvite] = useState(false);
  const [selectedTeamLevel, setSelectedTeamLevel] = useState<string | null>(null);
  const [showTeamDetails, setShowTeamDetails] = useState(false);

  // Social sharing functions
  const generateReferralLink = (code: string) => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/signup?refer=${code}`;
  };

  const shareToWhatsApp = (code: string) => {
    const message = `Join me on our platform and earn together! Use my referral code: ${code}\n\nSign up here: ${generateReferralLink(code)}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const shareToTelegram = (code: string) => {
    const message = `Join me on our platform and earn together! Use my referral code: ${code}\n\nSign up here: ${generateReferralLink(code)}`;
    const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(generateReferralLink(code))}&text=${encodeURIComponent(message)}`;
    window.open(telegramUrl, '_blank');
  };

  const shareToFacebook = (code: string) => {
    const message = `Join me on our platform and earn together! Use my referral code: ${code}`;
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(generateReferralLink(code))}&quote=${encodeURIComponent(message)}`;
    window.open(facebookUrl, '_blank');
  };

  const shareToTwitter = (code: string) => {
    const message = `Join me on our platform and earn together! Use my referral code: ${code}\n\nSign up here: ${generateReferralLink(code)}`;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}`;
    window.open(twitterUrl, '_blank');
  };

  const shareViaLink = (code: string) => {
    const referralLink = generateReferralLink(code);
    navigator.clipboard.writeText(referralLink);
    setCopiedInvite(true);
    setTimeout(() => setCopiedInvite(false), 2000);
  };

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

  if (loading) {
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
      <div className="min-h-screen flex items-center justify-center text-red-600">{error}</div>
    );
  }

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
          <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/60 mb-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center shadow-md">
                <Copy className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-800">Your Referral Code</h2>
                <p className="text-sm text-gray-600">Share this code with friends to earn rewards</p>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-xl p-4 border border-emerald-200">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                    <Star className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <div className="font-bold text-emerald-800 text-base">{referralCode || 'N/A'}</div>
                    <div className="text-xs text-emerald-600">Your unique referral code</div>
                  </div>
                </div>
                <button
                  onClick={() => copyToClipboard(referralCode || userStats.inviteCode || '', 'invite')}
                  className="flex items-center space-x-2 px-3 py-1.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-lg hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300 text-xs font-semibold shadow-md hover:shadow-lg"
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
              
              {/* Social Sharing Buttons */}
              <div className="border-t border-emerald-200 pt-3">
                <div className="text-center mb-2">
                  <span className="text-xs font-medium text-emerald-700">Share your referral link:</span>
                </div>
                <div className="flex flex-wrap justify-center gap-1.5">
                  <button
                    onClick={() => shareToWhatsApp(referralCode || userStats.inviteCode || '')}
                    className="flex items-center space-x-1.5 px-2.5 py-1.5 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-all duration-300 shadow-md hover:shadow-lg text-xs font-medium"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </button>
                  <button
                    onClick={() => shareToTelegram(referralCode || userStats.inviteCode || '')}
                    className="flex items-center space-x-1.5 px-2.5 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all duration-300 shadow-md hover:shadow-lg text-xs font-medium"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Telegram</span>
                  </button>
                  <button
                    onClick={() => shareToFacebook(referralCode || userStats.inviteCode || '')}
                    className="flex items-center space-x-1.5 px-2.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-300 shadow-md hover:shadow-lg text-xs font-medium"
                  >
                    <Facebook className="w-3.5 h-3.5" />
                    <span>Facebook</span>
                  </button>
                  <button
                    onClick={() => shareToTwitter(referralCode || userStats.inviteCode || '')}
                    className="flex items-center space-x-1.5 px-2.5 py-1.5 bg-sky-500 hover:bg-sky-600 text-white rounded-lg transition-all duration-300 shadow-md hover:shadow-lg text-xs font-medium"
                  >
                    <Twitter className="w-3.5 h-3.5" />
                    <span>Twitter</span>
                  </button>
                  <button
                    onClick={() => shareViaLink(referralCode || userStats.inviteCode || '')}
                    className="flex items-center space-x-1.5 px-2.5 py-1.5 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-all duration-300 shadow-md hover:shadow-lg text-xs font-medium"
                  >
                    <Globe className="w-3.5 h-3.5" />
                    <span>Copy Link</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Team Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
            <div className="group bg-white/90 backdrop-blur-xl rounded-xl p-4 shadow-lg border border-white/60 hover:shadow-xl hover:bg-white/95 transition-all duration-300 hover:-translate-y-1">
              <div className="flex flex-col items-center text-center space-y-2">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-md">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <div className="text-xl font-bold text-blue-600 mb-1">{api?.totalTeamMembers || api?.summary?.totalMembers || 0}</div>
                <div className="text-xs text-gray-600 font-medium">Team Members</div>
              </div>
            </div>
            {/* <div className="group bg-white/90 backdrop-blur-xl rounded-xl p-4 shadow-lg border border-white/60 hover:shadow-xl hover:bg-white/95 transition-all duration-300 hover:-translate-y-1"> */}
              {/* <div className="flex flex-col items-center text-center space-y-2">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-md">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <div className="text-xl font-bold text-emerald-600 mb-1">${api?.totalTeamIncome || 0}</div>
                <div className="text-xs text-gray-600 font-medium">Team Income</div>
              </div> */}
            {/* </div> */}
            {/* <div className="group bg-white/90 backdrop-blur-xl rounded-xl p-4 shadow-lg border border-white/60 hover:shadow-xl hover:bg-white/95 transition-all duration-300 hover:-translate-y-1">
              <div className="flex flex-col items-center text-center space-y-2">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-md">
                  <Award className="w-5 h-5 text-white" />
                </div>
                <div className="text-xl font-bold text-purple-600 mb-1">Level {mappedUserStats?.referralLevel || 0}</div>
                <div className="text-xs text-gray-600 font-medium">VIP Level</div>
              </div>
            </div> */}
            {/* <div className="group bg-white/90 backdrop-blur-xl rounded-xl p-4 shadow-lg border border-white/60 hover:shadow-xl hover:bg-white/95 transition-all duration-300 hover:-translate-y-1">
              <div className="flex flex-col items-center text-center space-y-2">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-md">
                  <Crown className="w-5 h-5 text-white" />
                </div>
                <div className="text-xl font-bold text-orange-600 mb-1">${mappedUserStats?.dailyIncome?.totalEarned || 0}</div>
                <div className="text-xs text-gray-600 font-medium">Total Income</div>
              </div>
            </div> */}
            <div className="group bg-white/90 backdrop-blur-xl rounded-xl p-4 shadow-lg border border-white/60 hover:shadow-xl hover:bg-white/95 transition-all duration-300 hover:-translate-y-1">
              <div className="flex flex-col items-center text-center space-y-2">
                <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-md">
                  <DollarSign className="w-5 h-5 text-white" />
                </div>
                <div className="text-xl font-bold text-yellow-600 mb-1">${api?.levelBasedIncome?.totalDailyTeamIncome || 0}</div>
                <div className="text-xs text-gray-600 font-medium">My Income From Teams</div>
              </div>
            </div>
          </div>

          {/* Team Benefits Section */}
          {/* This section is now removed as per user request */}

        </div>
      </div>

      {/* Premium Team Sections */}
      <div className="px-4 sm:px-6 space-y-6 pb-24">
        {/* Premium Team Registration */}
        <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg border border-white/60 overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-md">
                <Users className="w-4 h-4 text-white" />
              </div>
              <h3 className="font-bold text-gray-800 text-base">Team Registration</h3>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </div>
          <div className="p-4">
            <div className="grid grid-cols-5 gap-3">
              {teamLevels.map((level) => (
                <div key={level.level} className="text-center">
                  <button
                    onClick={() => handleTeamLevelClick(level.level)}
                    className={`group w-12 h-12 bg-gradient-to-br ${level.color} rounded-lg flex items-center justify-center mx-auto mb-2 hover:scale-110 transition-all duration-300 shadow-md hover:shadow-lg`}
                  >
                    <span className="text-white font-bold text-base">{level.level}</span>
                  </button>
                  <div className="text-lg font-bold text-gray-800 mb-1">{level.count}</div>
                  <div className="text-xs text-gray-600 font-medium">Person</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Premium Teams */}
        <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg border border-white/60 overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center shadow-md">
                <Star className="w-4 h-4 text-white" />
              </div>
              <h3 className="font-bold text-gray-800 text-base">Teams</h3>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </div>
          <div className="p-4">
            <div className="grid grid-cols-5 gap-3">
              {teams.map((team) => (
                <div key={team.level} className="text-center">
                  <div className={`group w-12 h-12 bg-gradient-to-br ${team.color} rounded-lg flex items-center justify-center mx-auto mb-2 shadow-md hover:scale-110 transition-all duration-300 hover:shadow-lg`}>
                    <span className="text-white font-bold text-base">{team.level}</span>
                  </div>
                  <div className="text-lg font-bold text-gray-800 mb-1">{team.count}</div>
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
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600 font-medium">Name:</span>
                          <div className="font-semibold text-gray-800">{member.name}</div>
                        </div>
                        <div>
                          <span className="text-gray-600 font-medium">Email:</span>
                          <div className="font-semibold text-gray-800">{member.email}</div>
                        </div>
                        <div>
                          <span className="text-gray-600 font-medium">Phone:</span>
                          <div className="font-semibold text-gray-800">{member.phone}</div>
                        </div>
                        <div>
                          <span className="text-gray-600 font-medium">Referral Code:</span>
                          <div className="font-semibold text-gray-800">{member.referralCode}</div>
                        </div>
                        <div>
                          <span className="text-gray-600 font-medium">Normal Wallet:</span>
                          <div className="font-semibold text-emerald-600">${member.normalWalletBalance}</div>
                        </div>
                        <div>
                          <span className="text-gray-600 font-medium">Investment Wallet:</span>
                          <div className="font-semibold text-blue-600">${member.investmentWalletBalance}</div>
                        </div>
                        <div>
                          <span className="text-gray-600 font-medium">Daily Income:</span>
                          <div className="font-semibold text-orange-600">${member.dailyIncomeEarned}</div>
                        </div>
                        <div>
                          <span className="text-gray-600 font-medium">Joined:</span>
                          <div className="font-semibold text-gray-800">{new Date(member.joinedDate).toLocaleDateString()}</div>
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
          Referral link copied to clipboard!
        </div>
      )}
    </div>
  );
};

export default TeamsPage;