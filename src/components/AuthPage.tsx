import React, { useState } from 'react';
import { Star, Crown, Shield, TrendingUp, Award, Zap } from 'lucide-react';
import LoginPage from './LoginPage';
import SignupPage from './SignupPage';

interface AuthPageProps {
  onAuthSuccess: () => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ onAuthSuccess }) => {
  const [currentView, setCurrentView] = useState<'welcome' | 'login' | 'signup'>('welcome');

  const handleLogin = (credentials: any) => {
    console.log('Login attempt:', credentials);
    // Here you would typically validate credentials with your backend
    onAuthSuccess();
  };

  const handleSignup = (userData: any) => {
    console.log('Signup attempt:', userData);
    // Here you would typically create account with your backend
    onAuthSuccess();
  };

  const renderWelcome = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/5 via-purple-600/5 to-blue-700/5"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-indigo-200/30 to-transparent rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-purple-200/30 to-transparent rounded-full blur-2xl"></div>
      
      <div className="px-6 w-full max-w-lg relative z-10">
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-10 text-center">
          {/* Premium Logo/Brand */}
          <div className="mb-10">
            <div className="relative mx-auto mb-6">
              <div className="w-32 h-32 bg-gradient-to-br from-indigo-500 via-purple-600 to-blue-700 rounded-full flex items-center justify-center mx-auto shadow-2xl relative overflow-hidden">
                <img 
                  src="https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg?auto=compress&cs=tinysrgb&w=400" 
                  alt="Premium Hotel Investment" 
                  className="w-full h-full rounded-full object-cover opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/60 via-purple-800/40 to-transparent rounded-full"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Crown className="w-12 h-12 text-white drop-shadow-lg" />
                </div>
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                <Star className="w-4 h-4 text-white" />
              </div>
            </div>
            
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-700 bg-clip-text text-transparent mb-3">
              PREMIUM HOTELS & RESORTS
            </h1>
            <p className="text-gray-600 font-medium">Elite Investment Partners</p>
          </div>

          {/* Premium Welcome Message */}
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 leading-tight">
              Welcome to Luxury Hotel Investment
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Join the elite circle of investors and start your journey to financial freedom through premium hotel investments
            </p>
          </div>

          {/* Premium Action Buttons */}
          <div className="space-y-4 mb-10">
            <button
              onClick={() => setCurrentView('login')}
              className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-700 text-white py-4 rounded-2xl font-bold text-lg hover:from-indigo-700 hover:via-purple-700 hover:to-blue-800 transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-1 relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="relative z-10">Sign In to Premium Account</span>
            </button>
            
            <button
              onClick={() => setCurrentView('signup')}
              className="w-full bg-white border-2 border-indigo-600 text-indigo-600 py-4 rounded-2xl font-bold text-lg hover:bg-indigo-50 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1 group"
            >
              <span className="group-hover:scale-105 transition-transform duration-200 inline-block">Create Elite Account</span>
            </button>
          </div>

          {/* Premium Features Grid */}
          <div className="border-t border-gray-200 pt-8">
            <h3 className="text-lg font-bold text-gray-800 mb-6">Why Choose Premium Investment?</h3>
            <div className="grid grid-cols-3 gap-6">
              <div className="group">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <h4 className="font-bold text-gray-800 mb-1">High Returns</h4>
                <p className="text-xs text-gray-600 leading-relaxed">Up to 10% daily returns on premium investments</p>
              </div>
              
              <div className="group">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Crown className="w-8 h-8 text-white" />
                </div>
                <h4 className="font-bold text-gray-800 mb-1">Luxury Hotels</h4>
                <p className="text-xs text-gray-600 leading-relaxed">Exclusive 5-star resort partnerships worldwide</p>
              </div>
              
              <div className="group">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h4 className="font-bold text-gray-800 mb-1">Secure</h4>
                <p className="text-xs text-gray-600 leading-relaxed">Bank-level security with full insurance coverage</p>
              </div>
            </div>
          </div>

          {/* Premium Benefits */}
          <div className="mt-8 p-6 bg-gradient-to-r from-indigo-50 via-purple-50 to-blue-50 rounded-2xl border border-indigo-200">
            <div className="flex items-center justify-center space-x-2 mb-3">
              <Award className="w-5 h-5 text-indigo-600" />
              <span className="font-bold text-indigo-600 text-sm">PREMIUM MEMBER BENEFITS</span>
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs text-gray-700">
              <div className="flex items-center space-x-2">
                <Zap className="w-3 h-3 text-yellow-500" />
                <span>24/7 VIP Support</span>
              </div>
              <div className="flex items-center space-x-2">
                <Zap className="w-3 h-3 text-yellow-500" />
                <span>Priority Processing</span>
              </div>
              <div className="flex items-center space-x-2">
                <Zap className="w-3 h-3 text-yellow-500" />
                <span>Exclusive Deals</span>
              </div>
              <div className="flex items-center space-x-2">
                <Zap className="w-3 h-3 text-yellow-500" />
                <span>Bonus Rewards</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (currentView === 'welcome') {
    return renderWelcome();
  }

  if (currentView === 'login') {
    return (
      <LoginPage
        onLogin={handleLogin}
        onSwitchToSignup={() => setCurrentView('signup')}
        onBack={() => setCurrentView('welcome')}
      />
    );
  }

  if (currentView === 'signup') {
    return (
      <SignupPage
        onSignup={handleSignup}
        onSwitchToLogin={() => setCurrentView('login')}
        onBack={() => setCurrentView('welcome')}
      />
    );
  }

  return null;
};

export default AuthPage;