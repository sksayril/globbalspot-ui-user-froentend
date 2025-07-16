import React, { useState, useEffect } from 'react';
import { User, Settings, HelpCircle, LogOut, ChevronRight, Wallet, Award, BarChart3, Clock, Star, Shield, Crown, CreditCard, MessageCircle, Plus, X, Send, FileText, AlertCircle, CheckCircle, Clock as ClockIcon, Paperclip } from 'lucide-react';
import { ProfileHeaderSkeleton, CardSkeleton, GridSkeleton } from './SkeletonLoader';

interface ProfilePageProps {
  profile: any;
  onLogout: () => void;
}

interface SupportTicket {
  _id: string;
  subject: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high';
  category: string;
  lastMessage: string;
  createdAt: string;
  messages: Message[];
}

interface Message {
  _id: string;
  sender: {
    _id: string;
    name: string;
    email: string;
  };
  senderType: 'user' | 'admin';
  content: string;
  messageType: 'text' | 'file';
  fileUrl?: string;
  isRead: boolean;
  timestamp: string;
}

interface CreateTicketData {
  subject: string;
  category: string;
  priority: 'low' | 'medium' | 'high';
  message: string;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ profile, onLogout }) => {
  // Support state management
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [showCreateTicket, setShowCreateTicket] = useState(false);
  const [showTicketDetails, setShowTicketDetails] = useState(false);
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [newMessage, setNewMessage] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [createTicketForm, setCreateTicketForm] = useState<CreateTicketData>({
    subject: '',
    category: 'general',
    priority: 'medium',
    message: ''
  });

  // API functions
  const fetchTickets = async () => {
    try {
      const response = await fetch('https://7cvccltb-3100.inc1.devtunnels.ms/chat/my-tickets', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setTickets(data.data);
      }
    } catch (error) {
      console.error('Error fetching tickets:', error);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const response = await fetch('https://7cvccltb-3100.inc1.devtunnels.ms/chat/unread-count', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setUnreadCount(data.data.unreadCount);
      }
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  const createTicket = async (ticketData: CreateTicketData) => {
    setLoading(true);
    try {
      const response = await fetch('https://7cvccltb-3100.inc1.devtunnels.ms/chat/create-ticket', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(ticketData),
      });
      const data = await response.json();
      if (data.success) {
        setShowCreateTicket(false);
        setShowSupportModal(false);
        setCreateTicketForm({
          subject: '',
          category: 'general',
          priority: 'medium',
          message: ''
        });
        fetchTickets();
      }
    } catch (error) {
      console.error('Error creating ticket:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (ticketId: string, message: string, file?: File) => {
    try {
      const formData = new FormData();
      formData.append('message', message);
      formData.append('messageType', 'text');
      if (file) {
        formData.append('file', file);
        formData.append('messageType', 'file');
      }

      const response = await fetch(`https://7cvccltb-3100.inc1.devtunnels.ms/chat/ticket/${ticketId}/message`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
        body: formData,
      });
      const data = await response.json();
      if (data.success) {
        setNewMessage('');
        setSelectedFile(null);
        fetchTicketDetails(ticketId);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const fetchTicketDetails = async (ticketId: string) => {
    try {
      const response = await fetch(`https://7cvccltb-3100.inc1.devtunnels.ms/chat/ticket/${ticketId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setSelectedTicket(data.data);
      }
    } catch (error) {
      console.error('Error fetching ticket details:', error);
    }
  };

  const closeTicket = async (ticketId: string) => {
    try {
      const response = await fetch(`https://7cvccltb-3100.inc1.devtunnels.ms/chat/ticket/${ticketId}/close`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        fetchTickets();
        setShowTicketDetails(false);
        setSelectedTicket(null);
      }
    } catch (error) {
      console.error('Error closing ticket:', error);
    }
  };

  useEffect(() => {
    fetchTickets();
    fetchUnreadCount();
  }, []);

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
    { 
      icon: HelpCircle, 
      label: 'Help & Support', 
      hasArrow: true, 
      isRed: false, 
      action: () => {
        // Show support modal with tickets list
        setShowSupportModal(true);
        setShowCreateTicket(false);
        setShowTicketDetails(false);
      }, 
      description: `24/7 premium support ${unreadCount > 0 ? `(${unreadCount} unread)` : ''}`,
      badge: unreadCount > 0 ? unreadCount : undefined
    },
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
                  <div className={`w-12 h-12 ${item.isRed ? 'bg-red-100' : 'bg-gray-100'} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 relative`}>
                    <item.icon className={`w-6 h-6 ${item.isRed ? 'text-red-600' : 'text-gray-600'}`} />
                    {item.badge && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                        {item.badge}
                      </div>
                    )}
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

      {/* Support Modals */}
      
      {/* Create Ticket Modal */}
      {showCreateTicket && showSupportModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/50 w-full max-w-md max-h-[90vh] overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 text-white relative">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                    <Plus className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="text-lg font-bold">Create Support Ticket</h3>
                </div>
                <button
                  onClick={() => {
                    setShowCreateTicket(false);
                    setShowSupportModal(false);
                  }}
                  className="w-8 h-8 bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-lg flex items-center justify-center transition-all duration-200"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>

            <div className="p-6 max-h-96 overflow-y-auto">
              <form onSubmit={(e) => {
                e.preventDefault();
                createTicket(createTicketForm);
              }} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                  <input
                    type="text"
                    value={createTicketForm.subject}
                    onChange={(e) => setCreateTicketForm(prev => ({ ...prev, subject: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Brief description of your issue"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={createTicketForm.category}
                    onChange={(e) => setCreateTicketForm(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="general">General</option>
                    <option value="payment">Payment</option>
                    <option value="technical">Technical</option>
                    <option value="account">Account</option>
                    <option value="investment">Investment</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                  <select
                    value={createTicketForm.priority}
                    onChange={(e) => setCreateTicketForm(prev => ({ ...prev, priority: e.target.value as any }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                  <textarea
                    value={createTicketForm.message}
                    onChange={(e) => setCreateTicketForm(prev => ({ ...prev, message: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={4}
                    placeholder="Describe your issue in detail..."
                    required
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateTicket(false);
                      setShowSupportModal(false);
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 disabled:opacity-50"
                  >
                    {loading ? 'Creating...' : 'Create Ticket'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Ticket Details Modal */}
      {showTicketDetails && selectedTicket && showSupportModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/50 w-full max-w-2xl max-h-[90vh] overflow-hidden">
            <div className="bg-gradient-to-r from-green-500 to-blue-600 p-4 text-white relative">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                    <MessageCircle className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">{selectedTicket.subject}</h3>
                    <p className="text-sm text-white/80">
                      {selectedTicket.status} • {selectedTicket.priority} priority
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowTicketDetails(false);
                    setShowSupportModal(false);
                  }}
                  className="w-8 h-8 bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-lg flex items-center justify-center transition-all duration-200"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>

            <div className="flex flex-col h-96">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {selectedTicket.messages.map((message, index) => (
                  <div key={index} className={`flex ${message.senderType === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xs sm:max-w-md lg:max-w-lg ${
                      message.senderType === 'user' 
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white' 
                        : 'bg-gray-100 text-gray-800'
                    } rounded-lg p-3 shadow-sm`}>
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-xs font-medium opacity-75">
                          {message.sender.name}
                        </span>
                        <span className="text-xs opacity-60">
                          {new Date(message.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm">{message.content}</p>
                      {message.fileUrl && (
                        <div className="mt-2">
                          <a 
                            href={message.fileUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-xs underline flex items-center space-x-1"
                          >
                            <FileText className="w-3 h-3" />
                            <span>View Attachment</span>
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input */}
              <div className="border-t border-gray-200 p-4">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <input
                    type="file"
                    onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <Paperclip className="w-4 h-4" />
                  </label>
                  <button
                    onClick={() => sendMessage(selectedTicket._id, newMessage, selectedFile || undefined)}
                    disabled={!newMessage.trim()}
                    className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
                {selectedFile && (
                  <div className="mt-2 text-xs text-gray-600">
                    Selected file: {selectedFile.name}
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="border-t border-gray-200 p-4">
              <div className="flex justify-between">
                <button
                  onClick={() => closeTicket(selectedTicket._id)}
                  disabled={selectedTicket.status === 'closed'}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
                >
                  Close Ticket
                </button>
                <button
                  onClick={() => fetchTicketDetails(selectedTicket._id)}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Refresh
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Support Tickets List Modal */}
      {showSupportModal && !showCreateTicket && !showTicketDetails && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/50 w-full max-w-2xl max-h-[90vh] overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 text-white relative">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                    <MessageCircle className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="text-lg font-bold">Support Tickets</h3>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setShowCreateTicket(true)}
                    className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-all duration-200 text-sm"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      setShowCreateTicket(false);
                      setShowSupportModal(false);
                    }}
                    className="w-8 h-8 bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-lg flex items-center justify-center transition-all duration-200"
                  >
                    <X className="w-4 h-4 text-white" />
                  </button>
                </div>
              </div>
            </div>

            <div className="p-4 max-h-96 overflow-y-auto">
              {tickets.length === 0 ? (
                <div className="text-center py-8">
                  <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No support tickets yet</p>
                  <p className="text-sm text-gray-400">Create your first ticket to get help</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {tickets.map((ticket) => (
                    <div
                      key={ticket._id}
                      onClick={() => {
                        fetchTicketDetails(ticket._id);
                        setShowTicketDetails(true);
                      }}
                      className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-200 cursor-pointer"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-gray-800">{ticket.subject}</h4>
                        <div className="flex items-center space-x-2">
                          {ticket.status === 'open' && <AlertCircle className="w-4 h-4 text-orange-500" />}
                          {ticket.status === 'in_progress' && <ClockIcon className="w-4 h-4 text-blue-500" />}
                          {ticket.status === 'resolved' && <CheckCircle className="w-4 h-4 text-green-500" />}
                          {ticket.status === 'closed' && <X className="w-4 h-4 text-gray-500" />}
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            ticket.priority === 'high' ? 'bg-red-100 text-red-600' :
                            ticket.priority === 'medium' ? 'bg-yellow-100 text-yellow-600' :
                            'bg-green-100 text-green-600'
                          }`}>
                            {ticket.priority}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <span>{ticket.category}</span>
                        <span>{new Date(ticket.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;