import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, User, Mail, Phone, Lock, ArrowLeft, Gift, HelpCircle } from 'lucide-react';
import { signupUser, storeAuthData, SignupRequest } from '../services/api';

interface SignupPageProps {
  onSignup: (userData: any) => void;
  onSwitchToLogin: () => void;
  onBack: () => void;
}

const SignupPage: React.FC<SignupPageProps> = ({ onSignup, onSwitchToLogin, onBack }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: '',
    referralCode: '',
    securityQuestion: '',
    securityAnswer: '',
    agreeTerms: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);

  // Handle URL parameters for referral code
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const referralCode = urlParams.get('refer');
    if (referralCode) {
      setFormData(prev => ({
        ...prev,
        referralCode: referralCode
      }));
    }
  }, []);

  const securityQuestions = [
    'What was the name of your first pet?',
    'What is your mother\'s maiden name?',
    'What was the name of your first school?',
    'What is your favorite movie?',
    'What city were you born in?',
    'What is your favorite food?'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name] || errors.general) {
      setErrors((prev: any) => ({
        ...prev,
        [name]: '',
        general: ''
      }));
    }
  };

  const validateStep1 = () => {
    const newErrors: any = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.mobile) {
      newErrors.mobile = 'Mobile number is required';
    } else if (!/^\d{10}$/.test(formData.mobile.replace(/\D/g, ''))) {
      newErrors.mobile = 'Please enter a valid 10-digit mobile number';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain uppercase, lowercase, and number';
    }

    if (!formData.referralCode.trim()) {
      newErrors.referralCode = 'Referral code is required';
    } else if (formData.referralCode.trim().length < 3) {
      newErrors.referralCode = 'Referral code must be at least 3 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: any = {};

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain uppercase, lowercase, and number';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.securityQuestion) {
      newErrors.securityQuestion = 'Please select a security question';
    }

    if (!formData.securityAnswer.trim()) {
      newErrors.securityAnswer = 'Security answer is required';
    } else if (formData.securityAnswer.trim().length < 3) {
      newErrors.securityAnswer = 'Answer must be at least 3 characters';
    }

    if (!formData.agreeTerms) {
      newErrors.agreeTerms = 'You must agree to the terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
    }
  };

  const handleBack = () => {
    if (currentStep === 2) {
      setCurrentStep(1);
    } else {
      onBack();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStep1()) return;

    setIsLoading(true);
    
    try {
      // Prepare API request body
      const requestBody: SignupRequest = {
        name: formData.name,
        email: formData.email,
        phone: formData.mobile,
        password: formData.password,
        referralCode: formData.referralCode
      };

      // Make API call using the service
      const response = await signupUser(requestBody);

      // Store authentication data
      storeAuthData(response.data.token, response.data.user);

      setIsLoading(false);
      
      // Call the success callback to update authentication state
      onSignup(response.data);
    } catch (error) {
      console.error('Signup error:', error);
      setIsLoading(false);
      setErrors({
        general: error instanceof Error ? error.message : 'An unexpected error occurred. Please try again.'
      });
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <User className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Join Premium Investment</h2>
        <p className="text-gray-600">Step 1 of 2: Create your elite investor account</p>
      </div>

      {/* Full Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Full Name *
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <User className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors ${
              errors.name ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter your full name"
          />
        </div>
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name}</p>
        )}
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Email Address *
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Mail className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter your email"
          />
        </div>
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email}</p>
        )}
      </div>

      {/* Mobile Number */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Mobile Number *
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Phone className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="tel"
            name="mobile"
            value={formData.mobile}
            onChange={handleInputChange}
            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors ${
              errors.mobile ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter your mobile number"
          />
        </div>
        {errors.mobile && (
          <p className="mt-1 text-sm text-red-600">{errors.mobile}</p>
        )}
      </div>

      {/* Password */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Password *
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Lock className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors ${
              errors.password ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Create a strong password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5 text-gray-400" />
            ) : (
              <Eye className="h-5 w-5 text-gray-400" />
            )}
          </button>
        </div>
        {errors.password && (
          <p className="mt-1 text-sm text-red-600">{errors.password}</p>
        )}
        <p className="mt-1 text-sm text-gray-500">
          Must contain uppercase, lowercase, and number (min 8 characters)
        </p>
      </div>

      {/* Referral Code */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Referral Code *
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Gift className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            name="referralCode"
            value={formData.referralCode}
            onChange={handleInputChange}
            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors ${
              errors.referralCode ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter referral code"
          />
        </div>
        {errors.referralCode && (
          <p className="mt-1 text-sm text-red-600">{errors.referralCode}</p>
        )}
        <p className="mt-1 text-sm text-gray-500">
          Enter a referral code to get bonus rewards
        </p>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 text-white py-3 rounded-lg font-semibold text-lg hover:from-purple-700 hover:via-pink-700 hover:to-rose-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <div className="flex items-center justify-center space-x-2">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>Creating Account...</span>
          </div>
        ) : (
          'Sign In'
        )}
      </button>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Lock className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Security Setup</h2>
        <p className="text-gray-600">Step 2 of 2: Password & Security</p>
      </div>

      {/* Password */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Password *
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Lock className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
              errors.password ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Create a strong password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5 text-gray-400" />
            ) : (
              <Eye className="h-5 w-5 text-gray-400" />
            )}
          </button>
        </div>
        {errors.password && (
          <p className="mt-1 text-sm text-red-600">{errors.password}</p>
        )}
        <p className="mt-1 text-sm text-gray-500">
          Must contain uppercase, lowercase, and number (min 8 characters)
        </p>
      </div>

      {/* Confirm Password */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Confirm Password *
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Lock className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
              errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Confirm your password"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            {showConfirmPassword ? (
              <EyeOff className="h-5 w-5 text-gray-400" />
            ) : (
              <Eye className="h-5 w-5 text-gray-400" />
            )}
          </button>
        </div>
        {errors.confirmPassword && (
          <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
        )}
      </div>

      {/* Security Question */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Security Question *
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <HelpCircle className="h-5 w-5 text-gray-400" />
          </div>
          <select
            name="securityQuestion"
            value={formData.securityQuestion}
            onChange={handleInputChange}
            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
              errors.securityQuestion ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Select a security question</option>
            {securityQuestions.map((question, index) => (
              <option key={index} value={question}>
                {question}
              </option>
            ))}
          </select>
        </div>
        {errors.securityQuestion && (
          <p className="mt-1 text-sm text-red-600">{errors.securityQuestion}</p>
        )}
      </div>

      {/* Security Answer */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Security Answer *
        </label>
        <input
          type="text"
          name="securityAnswer"
          value={formData.securityAnswer}
          onChange={handleInputChange}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
            errors.securityAnswer ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Enter your answer"
        />
        {errors.securityAnswer && (
          <p className="mt-1 text-sm text-red-600">{errors.securityAnswer}</p>
        )}
      </div>

      {/* Terms and Conditions */}
      <div>
        <label className="flex items-start space-x-3">
          <input
            type="checkbox"
            name="agreeTerms"
            checked={formData.agreeTerms}
            onChange={handleInputChange}
            className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <span className="text-sm text-gray-700">
            I agree to the{' '}
            <button type="button" className="text-blue-600 hover:text-blue-700 underline">
              Terms and Conditions
            </button>{' '}
            and{' '}
            <button type="button" className="text-blue-600 hover:text-blue-700 underline">
              Privacy Policy
            </button>
          </span>
        </label>
        {errors.agreeTerms && (
          <p className="mt-1 text-sm text-red-600">{errors.agreeTerms}</p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="space-y-4">
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 text-white py-3 rounded-lg font-semibold text-lg hover:from-purple-700 hover:via-pink-700 hover:to-rose-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Creating Account...</span>
            </div>
          ) : (
            'Create Account'
          )}
        </button>

        <button
          type="button"
          onClick={() => setCurrentStep(1)}
          className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
        >
          Back to Step 1
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 px-4 py-6 text-white">
        <div className="flex items-center space-x-4">
          <button
            onClick={handleBack}
            className="p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-semibold">Join Premium</h1>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="px-4 py-4">
        <div className="flex items-center justify-center space-x-4">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
            currentStep >= 1 ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-600'
          }`}>
            1
          </div>
          <div className={`w-16 h-1 rounded ${
            currentStep >= 2 ? 'bg-purple-600' : 'bg-gray-200'
          }`}></div>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
            currentStep >= 2 ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-600'
          }`}>
            2
          </div>
        </div>
      </div>

      {/* Signup Form */}
      <div className="px-4 pb-8">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          {/* General Error Display */}
          {errors.general && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm font-medium">{errors.general}</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            {currentStep === 1 ? renderStep1() : renderStep2()}
          </form>

          {/* Switch to Login */}
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <button
                onClick={onSwitchToLogin}
                className="text-purple-600 font-semibold hover:text-purple-700 transition-colors"
              >
                Sign In
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;