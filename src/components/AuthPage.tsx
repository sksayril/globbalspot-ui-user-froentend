import React, { useState } from 'react';
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 flex items-center justify-center">
      <div className="px-4 w-full max-w-md">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          {/* Logo/Brand */}
          <div className="mb-8">
            <img 
              src="https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg?auto=compress&cs=tinysrgb&w=400" 
              alt="Hotel Investment" 
              className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
            />
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              HOTELS & RESORTS
            </h1>
            <p className="text-gray-600">Investment Partners</p>
          </div>

          {/* Welcome Message */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Welcome to Hotel Investment
            </h2>
            <p className="text-gray-600">
              Start your journey to financial freedom through hotel investments
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            <button
              onClick={() => setCurrentView('login')}
              className="w-full bg-gradient-to-r from-blue-600 to-teal-600 text-white py-3 rounded-lg font-semibold text-lg hover:from-blue-700 hover:to-teal-700 transition-all duration-200"
            >
              Sign In
            </button>
            
            <button
              onClick={() => setCurrentView('signup')}
              className="w-full bg-white border-2 border-blue-600 text-blue-600 py-3 rounded-lg font-semibold text-lg hover:bg-blue-50 transition-colors"
            >
              Create Account
            </button>
          </div>

          {/* Features */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-green-600 text-sm">💰</span>
                </div>
                <p className="text-xs text-gray-600">High Returns</p>
              </div>
              <div>
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-blue-600 text-sm">🏨</span>
                </div>
                <p className="text-xs text-gray-600">Premium Hotels</p>
              </div>
              <div>
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-purple-600 text-sm">🔒</span>
                </div>
                <p className="text-xs text-gray-600">Secure</p>
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