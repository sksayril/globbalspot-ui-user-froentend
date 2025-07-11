// API base URL
const API_BASE_URL = 'http://localhost:3100';

// API request headers
const getHeaders = () => ({
  'Content-Type': 'application/json',
});

// API request wrapper with error handling
const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...getHeaders(),
        ...options.headers,
      },
    });

    const data = await response.json();
    return { response, data };
  } catch (error) {
    throw new Error('Network error. Please check your connection and try again.');
  }
};

// User signup API call
export interface SignupRequest {
  name: string;
  email: string;
  phone: string;
  password: string;
  referralCode?: string;
}

export interface SignupResponse {
  success: boolean;
  message: string;
  data: {
    user: {
      id: string;
      name: string;
      email: string;
      phone: string;
      referralCode: string;
      referredBy: string;
    };
    token: string;
  };
}

export const signupUser = async (userData: SignupRequest): Promise<SignupResponse> => {
  const { response, data } = await apiRequest('/users/signup', {
    method: 'POST',
    body: JSON.stringify(userData),
  });

  if (!response.ok || !data.success) {
    throw new Error(data.message || 'Registration failed. Please try again.');
  }

  return data;
};

// User login API call (for future use)
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    user: {
      id: string;
      name: string;
      email: string;
      phone: string;
      referralCode: string;
    };
    token: string;
  };
}

export const loginUser = async (credentials: LoginRequest): Promise<LoginResponse> => {
  const { response, data } = await apiRequest('/users/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });

  if (!response.ok || !data.success) {
    throw new Error(data.message || 'Login failed. Please try again.');
  }

  return data;
};

// Auth storage utilities
export const storeAuthData = (token: string, user: any) => {
  localStorage.setItem('authToken', token);
  localStorage.setItem('userData', JSON.stringify(user));
};

export const getAuthToken = (): string | null => {
  return localStorage.getItem('authToken');
};

export const getUserData = () => {
  const userData = localStorage.getItem('userData');
  return userData ? JSON.parse(userData) : null;
};

export const clearAuthData = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('userData');
};

// User profile API call
export interface UserProfileResponse {
  success: boolean;
  data: {
    investmentWallet: {
      balance: number;
      transactions: any[];
    };
    normalWallet: {
      balance: number;
      transactions: any[];
    };
    dailyIncome: {
      lastClaimed: string | null;
      totalEarned: number;
      todayEarned: number;
    };
    firstDepositBonus: {
      hasReceived: boolean;
      amount: number;
      percentage: number;
      receivedAt: string | null;
    };
    _id: string;
    name: string;
    email: string;
    phone: string;
    originalPassword: string;
    role: string;
    isBlocked: boolean;
    isActive: boolean;
    referralCode: string;
    referredBy: {
      _id: string;
      name: string;
      email: string;
      referralCode: string;
    } | null;
    referralLevel: number;
    profileImage: string | null;
    createdAt: string;
    updatedAt: string;
    __v: number;
    potentialDailyIncome: number;
    canClaimDailyIncome: boolean;
  };
}

export const getUserProfile = async (): Promise<UserProfileResponse> => {
  const token = getAuthToken();
  if (!token) throw new Error('No authentication token found');
  const { response, data } = await apiRequest('/users/profile', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!response.ok || !data.success) {
    throw new Error(data.message || 'Failed to fetch user profile');
  }
  return data;
}; 

export interface UpdateProfileRequest {
  name: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  };
}

export interface UpdateProfileResponse {
  success: boolean;
  message: string;
  data: {
    user: {
      id: string;
      name: string;
      email: string;
      phone: string;
      referralCode: string;
      dailyIncome: number;
      totalIncome: number;
      checkInLevel: number;
      totalInvestment: number;
      activeInvestments: number;
      teamIncome: number;
      teamMembers: number;
      uid: string;
      address: {
        street: string;
        city: string;
        state: string;
        country: string;
        zipCode: string;
      };
    };
  };
}

export const updateUserProfile = async (body: UpdateProfileRequest): Promise<UpdateProfileResponse> => {
  const token = getAuthToken();
  if (!token) throw new Error('No authentication token found');
  const { response, data } = await apiRequest('/users/profile', {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });
  if (!response.ok || !data.success) {
    throw new Error(data.message || 'Failed to update profile');
  }
  return data;
}; 

export interface WalletsResponse {
  success: boolean;
  message: string;
  data: {
    investmentWallet: {
      balance: number;
    };
    normalWallet: {
      balance: number;
    };
  };
}

export const getWallets = async (): Promise<WalletsResponse> => {
  const token = getAuthToken();
  if (!token) throw new Error('No authentication token found');
  const { response, data } = await apiRequest('/users/wallets', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok || !data.success) {
    throw new Error(data.message || 'Failed to fetch wallets');
  }
  return data;
}; 

export interface DepositRequest {
  amount: number;
  paymentMethod: string;
  paymentId: string;
  walletType: string;
  paymentProof: File;
}

export interface DepositResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    amount: number;
    paymentMethod: string;
    walletType: string;
    status: string;
    createdAt: string;
  };
}

export const createDeposit = async (body: DepositRequest): Promise<DepositResponse> => {
  const token = getAuthToken();
  if (!token) throw new Error('No authentication token found');
  
  const formData = new FormData();
  formData.append('amount', body.amount.toString());
  formData.append('paymentMethod', body.paymentMethod);
  formData.append('paymentId', body.paymentId);
  formData.append('walletType', body.walletType);
  formData.append('paymentProof', body.paymentProof);
  
  // Debug: Log the FormData contents
  console.log('Deposit request data:', {
    amount: body.amount,
    paymentMethod: body.paymentMethod,
    paymentId: body.paymentId,
    walletType: body.walletType,
    paymentProof: body.paymentProof ? `${body.paymentProof.name} (${body.paymentProof.size} bytes)` : 'No file'
  });
  
  try {
    const response = await fetch(`${API_BASE_URL}/users/deposits`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        // Don't set Content-Type for FormData, let the browser set it with boundary
      },
      body: formData,
    });
    
    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    
    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}: Failed to create deposit`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
        console.error('Server error response:', errorData);
      } catch (parseError) {
        console.error('Failed to parse error response:', parseError);
      }
      throw new Error(errorMessage);
    }
    
    const data = await response.json();
    console.log('Success response:', data);
    
    if (!data.success) {
      throw new Error(data.message || 'Failed to create deposit');
    }
    
    return data;
  } catch (error) {
    console.error('Deposit request failed:', error);
    throw error;
  }
};

// Get user deposits API call
export interface Deposit {
  _id: string;
  user: string;
  amount: number;
  paymentMethod: string;
  paymentId: string;
  paymentProof: string;
  walletType: string;
  status: string;
  adminNotes: string;
  approvedBy: string | null;
  approvedAt: string | null;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface DepositsResponse {
  success: boolean;
  data: Deposit[];
}

export const getUserDeposits = async (): Promise<DepositsResponse> => {
  const token = getAuthToken();
  if (!token) throw new Error('No authentication token found');
  
  const { response, data } = await apiRequest('/users/deposits', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok || !data.success) {
    throw new Error(data.message || 'Failed to fetch deposits');
  }

  return data;
};

// Get user referrals API call
export interface ReferralsResponse {
  success: boolean;
  data: {
    referralCode: string;
    referredUsers: any[];
    referrer: {
      _id: string;
      name: string;
      email: string;
      referralCode: string;
    };
    totalReferrals: number;
  };
}

export const getUserReferrals = async (): Promise<ReferralsResponse> => {
  const token = getAuthToken();
  if (!token) throw new Error('No authentication token found');
  
  const { response, data } = await apiRequest('/users/referrals', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok || !data.success) {
    throw new Error(data.message || 'Failed to fetch referrals');
  }

  return data;
}; 

export interface TransferRequest {
  fromWallet: string;
  toWallet: string;
  amount: number;
}
export interface TransferResponse {
  success: boolean;
  message: string;
  data: {
    fromWallet: string;
    toWallet: string;
    amount: number;
    newBalances: {
      investment: number;
      normal: number;
    };
  };
}

export const transferWallet = async (body: TransferRequest): Promise<TransferResponse> => {
  const token = getAuthToken();
  if (!token) throw new Error('No authentication token found');
  const { response, data } = await apiRequest('/users/transfer', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  if (!response.ok || !data.success) {
    throw new Error(data.message || 'Failed to transfer');
  }
  return data;
}; 

export interface DailyIncomeResponse {
  success: boolean;
  message: string;
  data: {
    myDailyIncome: number;
    normalWalletBalance: number;
    totalEarned: number;
    lastClaimed: string;
  };
}

export const claimDailyIncome = async (): Promise<DailyIncomeResponse> => {
  const token = getAuthToken();
  if (!token) throw new Error('No authentication token found');
  const { response, data } = await apiRequest('/users/today-my-income', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok || !data.success) {
    throw new Error(data.message || 'Failed to claim daily income');
  }
  return data;
}; 

export interface DailyIncomeStatusResponse {
  success: boolean;
  data: {
    canClaim: boolean;
    message: string;
    myDailyIncome: number;
    potentialDailyIncome: number;
    normalWalletBalance: number;
    totalEarned: number;
    lastClaimed: string;
  };
}

export const getDailyIncomeStatus = async (): Promise<DailyIncomeStatusResponse> => {
  const token = getAuthToken();
  if (!token) throw new Error('No authentication token found');
  const { response, data } = await apiRequest('/users/today-my-income', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok || !data.success) {
    throw new Error(data.message || 'Failed to fetch daily income status');
  }
  return data;
}; 