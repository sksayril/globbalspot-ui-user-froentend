import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { Home, Building2, Users, User, ArrowLeft, X, Copy, Share2, TrendingUp, Calendar, Target, Gift, DollarSign, Activity } from 'lucide-react';
import { CardSkeleton, GridSkeleton } from './components/SkeletonLoader';
import HomePage from './components/HomePage';
import MyInvestmentsPage from './components/MyInvestmentsPage';
import HotelDetail from './components/HotelDetail';
import TeamsPage from './components/TeamsPage';
import ProfilePage from './components/ProfilePage';
import ActivityPage from './components/ActivityPage';
import PurchaseModal from './components/PurchaseModal';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import { getUserProfile, getAuthToken, getWallets, getUserReferrals } from './services/api';

export interface Hotel {
  id: string;
  name: string;
  tier: string;
  price: number;
  dailyIncome: number;
  contractPeriod: number;
  dailyRate: number;
  progress: number;
  image: string;
  description: string;
  purchaseLimit: number;
  levelRequirement: string;
  totalProfit: number;
  principalIncome: number;
  purchaseDate?: string;
  status: 'active' | 'completed' | 'pending';
}

export interface Investment {
  id: string;
  hotel: Hotel;
  purchaseDate: string;
  currentProgress: number;
  totalEarned: number;
  daysRemaining: number;
  status: 'active' | 'completed' | 'pending';
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [wallets, setWallets] = useState({
    investmentWallet: { balance: 0 },
    normalWallet: { balance: 0 }
  });
  const [isLoadingWallets, setIsLoadingWallets] = useState(false);
  const [referrals, setReferrals] = useState<any[]>([]);
  const [referralCode, setReferralCode] = useState<string>('');
  const [isLoadingReferrals, setIsLoadingReferrals] = useState(false);

  // Check for existing authentication on component mount
  useEffect(() => {
    const token = getAuthToken();
    if (token) {
      setIsAuthenticated(true);
      handleAuthSuccess();
    }
  }, []);

  const hotels: Hotel[] = [
    {
      id: 'e2',
      name: 'Economy hotel: E2',
      tier: 'E2',
      price: 2000,
      dailyIncome: 60,
      contractPeriod: 15,
      dailyRate: 3.0,
      progress: 69,
      image: 'https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&cs=tinysrgb&w=800',
      description: 'Economy hotels provide the most basic accommodation services at low prices, targeting budget-conscious travelers.',
      purchaseLimit: 1,
      levelRequirement: 'E2',
      totalProfit: 900,
      principalIncome: 2900,
      status: 'active'
    },
    {
      id: 'e3',
      name: 'Economy hotel: E3',
      tier: 'E3',
      price: 5000,
      dailyIncome: 155,
      contractPeriod: 30,
      dailyRate: 3.1,
      progress: 70,
      image: 'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=800',
      description: 'Mid-tier economy hotels with enhanced amenities and better service quality.',
      purchaseLimit: 1,
      levelRequirement: 'E3',
      totalProfit: 4650,
      principalIncome: 9650,
      status: 'active'
    },
    {
      id: 'e4',
      name: 'Economy hotel: E4',
      tier: 'E4',
      price: 10000,
      dailyIncome: 320,
      contractPeriod: 60,
      dailyRate: 3.2,
      progress: 65,
      image: 'https://images.pexels.com/photos/1134176/pexels-photo-1134176.jpeg?auto=compress&cs=tinysrgb&w=800',
      description: 'Premium economy hotels with superior facilities and prime locations.',
      purchaseLimit: 1,
      levelRequirement: 'E4',
      totalProfit: 19200,
      principalIncome: 29200,
      status: 'active'
    },
    {
      id: 'e5',
      name: 'Economy hotel: E5',
      tier: 'E5',
      price: 20000,
      dailyIncome: 660,
      contractPeriod: 90,
      dailyRate: 3.3,
      progress: 55,
      image: 'https://images.pexels.com/photos/1743231/pexels-photo-1743231.jpeg?auto=compress&cs=tinysrgb&w=800',
      description: 'High-end economy hotels with luxury amenities and exceptional service.',
      purchaseLimit: 1,
      levelRequirement: 'E5',
      totalProfit: 59400,
      principalIncome: 79400,
      status: 'active'
    },
    {
      id: 'v2',
      name: 'Economy hotel: V2',
      tier: 'V2',
      price: 50000,
      dailyIncome: 1700,
      contractPeriod: 120,
      dailyRate: 3.4,
      progress: 59,
      image: 'https://images.pexels.com/photos/2017802/pexels-photo-2017802.jpeg?auto=compress&cs=tinysrgb&w=800',
      description: 'Premium resort-style hotels with comprehensive facilities and services.',
      purchaseLimit: 1,
      levelRequirement: 'V2',
      totalProfit: 204000,
      principalIncome: 254000,
      status: 'active'
    },
    {
      id: 'v7',
      name: 'V7 Manager Exclusive: V7',
      tier: 'V7',
      price: 1000000,
      dailyIncome: 100000,
      contractPeriod: 365,
      dailyRate: 10.0,
      progress: 36,
      image: 'https://images.pexels.com/photos/2736388/pexels-photo-2736388.jpeg?auto=compress&cs=tinysrgb&w=800',
      description: 'Exclusive luxury resort investment with premium returns and VIP management.',
      purchaseLimit: 1,
      levelRequirement: 'V7',
      totalProfit: 36500000,
      principalIncome: 37500000,
      status: 'active'
    }
  ];

  // Sample user investments
  const userInvestments: Investment[] = [
    {
      id: 'inv1',
      hotel: hotels[0],
      purchaseDate: '2024-01-15',
      currentProgress: 69,
      totalEarned: 1380,
      daysRemaining: 5,
      status: 'active'
    },
    {
      id: 'inv2',
      hotel: hotels[1],
      purchaseDate: '2024-01-10',
      currentProgress: 70,
      totalEarned: 3255,
      daysRemaining: 9,
      status: 'active'
    },
    {
      id: 'inv3',
      hotel: hotels[2],
      purchaseDate: '2024-01-05',
      currentProgress: 65,
      totalEarned: 12480,
      daysRemaining: 21,
      status: 'active'
    }
  ];

  const fetchWallets = async () => {
    setIsLoadingWallets(true);
    try {
      const walletsResponse = await getWallets();
      setWallets(walletsResponse.data);
    } catch (error) {
      // Optionally handle error
    } finally {
      setIsLoadingWallets(false);
    }
  };

  const fetchReferrals = async () => {
    setIsLoadingReferrals(true);
    try {
      const referralsResponse = await getUserReferrals();
      setReferralCode(referralsResponse.data.referralCode);
    } catch (error) {
      setReferralCode('');
    } finally {
      setIsLoadingReferrals(false);
    }
  };

  const handleAuthSuccess = async () => {
    setIsAuthenticated(true);
    await fetchUserProfile();
    await fetchWallets();
    await fetchReferrals();
  };

  const fetchUserProfile = async () => {
    const token = getAuthToken();
    if (!token) return;
    setIsLoadingProfile(true);
    try {
      const profileResponse = await getUserProfile();
      setProfile(profileResponse.data);
    } catch (error) {
      setProfile(null);
    } finally {
      setIsLoadingProfile(false);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentPage('home');
  };

  const handleHotelSelect = (hotel: Hotel) => {
    setSelectedHotel(hotel);
    setCurrentPage('hotel-detail');
  };

  const handlePurchase = (hotel: Hotel) => {
    setSelectedHotel(hotel);
    setShowPurchaseModal(true);
  };

  const handleConfirmPurchase = () => {
    if (selectedHotel) {
      setProfile((prev: any) => ({
        ...prev,
        totalInvestment: prev.totalInvestment + selectedHotel.price,
        activeInvestments: prev.activeInvestments + 1,
        dailyIncome: prev.dailyIncome + selectedHotel.dailyIncome
      }));
      setShowPurchaseModal(false);
      setCurrentPage('home');
    }
  };

  const handleLogin = async (credentials: any) => {
    console.log('Login attempt:', credentials);
    // The login API call is handled in LoginPage component
    // This function is called after successful login
    await handleAuthSuccess();
  };

  const handleSignup = async (userData: any) => {
    console.log('Signup attempt:', userData);
    // The signup API call is handled in SignupPage component
    // This function is called after successful signup
    await handleAuthSuccess();
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage userStats={profile} isLoading={isLoadingProfile || isLoadingWallets} investmentWalletBalance={wallets.investmentWallet.balance} normalWalletBalance={wallets.normalWallet.balance} />;
      case 'my-investments':
        return <MyInvestmentsPage investments={userInvestments} onInvestmentSelect={handleHotelSelect} onWalletsUpdate={setWallets} />;
      case 'hotel-detail':
        return selectedHotel ? (
          <HotelDetail 
            hotel={selectedHotel} 
            onBack={() => setCurrentPage('my-investments')}
            onPurchase={handlePurchase}
          />
        ) : null;
      case 'teams':
        return <TeamsPage userStats={profile} referralCode={referralCode} />;
      case 'activity':
        return <ActivityPage userStats={profile} />;
      case 'profile':
        return <ProfilePage profile={profile} onLogout={handleLogout} />;
      default:
        return <HomePage userStats={profile} isLoading={isLoadingProfile || isLoadingWallets} investmentWalletBalance={wallets.investmentWallet.balance} normalWalletBalance={wallets.normalWallet.balance} />;
    }
  };

  // Show loading state while fetching initial data
  if (isLoadingProfile || isLoadingWallets) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        {/* Header skeleton */}
        <div className="relative">
          <div className="h-72 bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-700 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/60 via-purple-800/40 to-transparent"></div>
            <div className="absolute bottom-4 left-4 right-4">
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/20">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl animate-pulse"></div>
                  <div className="space-y-2">
                    <div className="h-4 w-32 bg-white/20 rounded animate-pulse"></div>
                    <div className="h-3 w-24 bg-white/20 rounded animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content skeleton */}
        <div className="px-4 sm:px-6 -mt-16 relative z-10 pb-8">
          <GridSkeleton cols={2} rows={2} />
        </div>
      </div>
    );
  }

  // Main authenticated app component
  const AuthenticatedApp = () => (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Main Content */}
      <div className="flex-1 pb-20 overflow-y-auto">
        {renderPage()}
      </div>

      {/* Bottom Navigation - Fixed and Always Visible */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 safe-area-pb">
        <div className="flex justify-around items-center px-2 py-3">
          <button
            onClick={() => setCurrentPage('home')}
            className={`flex flex-col items-center justify-center py-1 px-2 min-w-0 flex-1 transition-colors ${
              currentPage === 'home' ? 'text-blue-600' : 'text-gray-600'
            }`}
          >
            <Home className="w-6 h-6 mb-1 flex-shrink-0" />
            <span className="text-xs leading-tight font-medium">Home</span>
          </button>
          
          <button
            onClick={() => setCurrentPage('my-investments')}
            className={`flex flex-col items-center justify-center py-1 px-2 min-w-0 flex-1 transition-colors ${
              currentPage === 'my-investments' || currentPage === 'hotel-detail' ? 'text-blue-600' : 'text-gray-600'
            }`}
          >
            <Building2 className="w-6 h-6 mb-1 flex-shrink-0" />
            <span className="text-xs leading-tight text-center font-medium">My Investments</span>
          </button>
          
          <button
            onClick={() => setCurrentPage('teams')}
            className={`flex flex-col items-center justify-center py-1 px-2 min-w-0 flex-1 transition-colors ${
              currentPage === 'teams' ? 'text-blue-600' : 'text-gray-600'
            }`}
          >
            <Users className="w-6 h-6 mb-1 flex-shrink-0" />
            <span className="text-xs leading-tight font-medium">Teams</span>
          </button>
          
          <button
            onClick={() => setCurrentPage('activity')}
            className={`flex flex-col items-center justify-center py-1 px-2 min-w-0 flex-1 transition-colors ${
              currentPage === 'activity' ? 'text-blue-600' : 'text-gray-600'
            }`}
          >
            <Activity className="w-6 h-6 mb-1 flex-shrink-0" />
            <span className="text-xs leading-tight font-medium">Activity</span>
          </button>
          
          <button
            onClick={() => setCurrentPage('profile')}
            className={`flex flex-col items-center justify-center py-1 px-2 min-w-0 flex-1 transition-colors ${
              currentPage === 'profile' ? 'text-blue-600' : 'text-gray-600'
            }`}
          >
            <User className="w-6 h-6 mb-1 flex-shrink-0" />
            <span className="text-xs leading-tight font-medium">Me</span>
          </button>
        </div>
      </div>

      {/* Purchase Modal */}
      {showPurchaseModal && selectedHotel && (
        <PurchaseModal
          hotel={selectedHotel}
          onClose={() => setShowPurchaseModal(false)}
          onConfirm={handleConfirmPurchase}
        />
      )}
    </div>
  );

  // Wrapper components to use navigation hooks
  const LoginPageWrapper = () => {
    const navigate = useNavigate();
    
    return (
      <LoginPage
        onLogin={handleLogin}
        onSwitchToSignup={() => navigate('/signup')}
        onBack={() => navigate('/')}
      />
    );
  };

  const SignupPageWrapper = () => {
    const navigate = useNavigate();
    
    return (
      <SignupPage
        onSignup={handleSignup}
        onSwitchToLogin={() => navigate('/login')}
        onBack={() => navigate('/')}
      />
    );
  };

  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={
          !isAuthenticated ? (
            <LoginPageWrapper />
          ) : (
            <Navigate to="/" replace />
          )
        } />
        
        <Route path="/signup" element={
          !isAuthenticated ? (
            <SignupPageWrapper />
          ) : (
            <Navigate to="/" replace />
          )
        } />
        
        {/* Protected routes */}
        <Route path="/" element={
          isAuthenticated ? (
            <AuthenticatedApp />
          ) : (
            <Navigate to="/login" replace />
          )
        } />
        
        {/* Catch all route */}
        <Route path="*" element={
          isAuthenticated ? (
            <AuthenticatedApp />
          ) : (
            <Navigate to="/login" replace />
          )
        } />
      </Routes>
    </Router>
  );
}

export default App;