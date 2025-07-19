import React, { useState, useEffect, createContext, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { Home, Building2, Users, User, ArrowLeft, X, Copy, Share2, TrendingUp, Calendar, Target, Gift, DollarSign, Activity, AlertCircle, Trophy } from 'lucide-react';
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
import LevelsStatusPage from './components/LevelsStatusPage';
import { getUserProfile, getAuthToken, getWallets, getUserReferrals, clearAuthData, setUnauthorizedHandler, getInvestmentPlans, InvestmentPlan } from './services/api';

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

// Auth Context
interface AuthContextType {
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
  isLoading: boolean;
  setIsLoading: (value: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

// Public Route Component (redirects to home if already authenticated)
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

// Toast Component
const Toast = ({ message, type, onClose }: { message: string; type: 'error' | 'success' | 'info'; onClose: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = type === 'error' ? 'bg-red-500' : type === 'success' ? 'bg-green-500' : 'bg-blue-500';
  const iconColor = type === 'error' ? 'text-red-500' : type === 'success' ? 'text-green-500' : 'text-blue-500';

  return (
    <div className={`fixed top-4 right-4 z-50 ${bgColor} text-white px-6 py-4 rounded-lg shadow-lg max-w-sm animate-in slide-in-from-right`}>
      <div className="flex items-center space-x-3">
        <AlertCircle className="w-5 h-5 flex-shrink-0" />
        <p className="text-sm font-medium">{message}</p>
        <button
          onClick={onClose}
          className="ml-auto text-white hover:text-gray-200 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
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
  const [toast, setToast] = useState<{ message: string; type: 'error' | 'success' | 'info' } | null>(null);
  const [investmentPlans, setInvestmentPlans] = useState<InvestmentPlan[]>([]);
  const [plansLoading, setPlansLoading] = useState(false);
  const [plansError, setPlansError] = useState('');
  // Placeholder for user investments
  const [userInvestments, setUserInvestments] = useState<Investment[]>([]); // TODO: Fetch from API when available

  // Set up unauthorized handler
  useEffect(() => {
    const handleUnauthorized = () => {
      setIsAuthenticated(false);
      setProfile(null);
      setWallets({
        investmentWallet: { balance: 0 },
        normalWallet: { balance: 0 }
      });
      setReferrals([]);
      setReferralCode('');
      setCurrentPage('home');
      
      // Show toast notification
      setToast({
        message: 'Session expired. Please login again.',
        type: 'error'
      });
    };

    setUnauthorizedHandler(handleUnauthorized);
  }, []);

  // Check for existing authentication on component mount
  useEffect(() => {
    const checkAuth = () => {
      const token = getAuthToken();
      if (token) {
        setIsAuthenticated(true);
        handleAuthSuccess();
      } else {
        setIsAuthenticated(false);
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  useEffect(() => {
    const fetchPlans = async () => {
      setPlansLoading(true);
      setPlansError('');
      try {
        const res = await getInvestmentPlans();
        setInvestmentPlans(res.data);
      } catch (err: any) {
        setPlansError(err.message || 'Failed to fetch investment plans');
      } finally {
        setPlansLoading(false);
      }
    };
    fetchPlans();
  }, []);

  const fetchWallets = async () => {
    setIsLoadingWallets(true);
    try {
      const walletsResponse = await getWallets();
      setWallets(walletsResponse.data);
    } catch (error) {
      console.error('Error fetching wallets:', error);
      // Don't show error message for 401 as it's handled automatically
      if (error instanceof Error && !error.message.includes('Session expired')) {
        // You could show a toast notification here for other errors
        console.error('Wallets fetch error:', error.message);
      }
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
      console.error('Error fetching referrals:', error);
      setReferralCode('');
      // Don't show error message for 401 as it's handled automatically
      if (error instanceof Error && !error.message.includes('Session expired')) {
        // You could show a toast notification here for other errors
        console.error('Referrals fetch error:', error.message);
      }
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
      console.error('Error fetching profile:', error);
      setProfile(null);
      // Don't show error message for 401 as it's handled automatically
      if (error instanceof Error && !error.message.includes('Session expired')) {
        // You could show a toast notification here for other errors
        console.error('Profile fetch error:', error.message);
      }
    } finally {
      setIsLoadingProfile(false);
    }
  };

  const handleLogout = () => {
    clearAuthData();
    setIsAuthenticated(false);
    setProfile(null);
    setWallets({
      investmentWallet: { balance: 0 },
      normalWallet: { balance: 0 }
    });
    setReferrals([]);
    setReferralCode('');
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
    try {
      // This would be replaced with actual login API call
      // For now, simulate successful login
      setIsAuthenticated(true);
      await handleAuthSuccess();
    } catch (error) {
      throw error;
    }
  };

  const handleSignup = async (userData: any) => {
    try {
      // This would be replaced with actual signup API call
      // For now, simulate successful signup
      setIsAuthenticated(true);
      await handleAuthSuccess();
    } catch (error) {
      throw error;
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage userStats={profile} isLoading={isLoadingProfile || isLoadingWallets} investmentWalletBalance={wallets.investmentWallet.balance} normalWalletBalance={wallets.normalWallet.balance} />;
      case 'my-investments':
        return <MyInvestmentsPage investments={userInvestments} onInvestmentSelect={handleHotelSelect} onWalletsUpdate={setWallets} plans={investmentPlans} plansLoading={plansLoading} plansError={plansError} />;
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
      case 'levels-status':
        return <LevelsStatusPage />;
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
          
          {/* <button
            onClick={() => setCurrentPage('my-investments')}
            className={`flex flex-col items-center justify-center py-1 px-2 min-w-0 flex-1 transition-colors ${
              currentPage === 'my-investments' || currentPage === 'hotel-detail' ? 'text-blue-600' : 'text-gray-600'
            }`}
          >
            <Building2 className="w-6 h-6 mb-1 flex-shrink-0" />
            <span className="text-xs leading-tight text-center font-medium">My Investments</span>
          </button> */}
          
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
            onClick={() => setCurrentPage('levels-status')}
            className={`flex flex-col items-center justify-center py-1 px-2 min-w-0 flex-1 transition-colors ${
              currentPage === 'levels-status' ? 'text-blue-600' : 'text-gray-600'
            }`}
          >
            <Trophy className="w-6 h-6 mb-1 flex-shrink-0" />
            <span className="text-xs leading-tight font-medium">Levels</span>
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

  // Auth context value
  const authContextValue: AuthContextType = {
    isAuthenticated,
    setIsAuthenticated,
    isLoading,
    setIsLoading
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      <Router>
        <Routes>
          {/* Public routes - redirect to home if already authenticated */}
          <Route path="/login" element={
            <PublicRoute>
              <LoginPageWrapper />
            </PublicRoute>
          } />
          
          <Route path="/signup" element={
            <PublicRoute>
              <SignupPageWrapper />
            </PublicRoute>
          } />
          
          {/* Protected routes - redirect to login if not authenticated */}
          <Route path="/" element={
            <ProtectedRoute>
              <AuthenticatedApp />
            </ProtectedRoute>
          } />
          
          {/* Catch all route - redirect to login if not authenticated */}
          <Route path="*" element={
            <ProtectedRoute>
              <AuthenticatedApp />
            </ProtectedRoute>
          } />
        </Routes>

        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </Router>
    </AuthContext.Provider>
  );
}

export default App;