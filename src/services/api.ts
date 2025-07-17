// API base URL
const API_BASE_URL = 'http://localhost:3110';
// const API_BASE_URL = 'https://api.goalsbot.com';

// Global error handler for 401 responses
let onUnauthorized: (() => void) | null = null;

export const setUnauthorizedHandler = (handler: () => void) => {
  onUnauthorized = handler;
};

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
    
    // Handle 401 Unauthorized errors
    if (response.status === 401) {
      // Clear auth data
      clearAuthData();
      
      // Call the unauthorized handler if set
      if (onUnauthorized) {
        onUnauthorized();
      }
      
      throw new Error('Session expired. Please login again.');
    }
    
    return { response, data };
  } catch (error) {
    // If it's already a handled error, re-throw it
    if (error instanceof Error && error.message.includes('Session expired')) {
      throw error;
    }
    throw new Error('Network error. Please check your connection and try again.');
  }
};

// User signup API call
export interface SignupRequest {
  name: string;
  email: string;
  phone: string;
  password: string;
  referralCode: string;
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
  
  try {
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
  } catch (error) {
    // Re-throw the error to be handled by the calling component
    throw error;
  }
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
  
  try {
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
  } catch (error) {
    throw error;
  }
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
  
  try {
    const { response, data } = await apiRequest('/users/wallets', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (!response.ok || !data.success) {
      throw new Error(data.message || 'Failed to fetch wallets');
    }
    
    return data;
  } catch (error) {
    throw error;
  }
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
  
  try {
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
  } catch (error) {
    throw error;
  }
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

export interface ContentItem {
  _id: string;
  title: string;
  imageUrl: string;
  textData: string;
  isActive: boolean;
  createdBy: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ContentListResponse {
  success: boolean;
  data: {
    contents: ContentItem[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  };
}

export const getContentList = async (): Promise<ContentListResponse> => {
  const token = getAuthToken();
  if (!token) throw new Error('No authentication token found');
  
  try {
    const { response, data } = await apiRequest('/content/users/list', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (!response.ok || !data.success) {
      throw new Error(data.message || 'Failed to fetch content list');
    }
    
    return data;
  } catch (error) {
    throw error;
  }
}; 

// Levels Status API
export interface LevelsStatusResponse {
  success: boolean;
  data: {
    characterLevel: {
      current: string;
      percentages: {
        A: number;
        B: number;
        C: number;
        D: number;
        E: number;
      };
      lastCalculated: string;
      totalEarned: number;
    };
    digitLevel: {
      current: string;
      criteria: {
        Lvl1: { directMembers: number; memberWalletMin: number; selfWalletMin: number };
        Lvl2: { directMembers: number; memberWalletMin: number; selfWalletMin: number };
        Lvl3: { directMembers: number; memberWalletMin: number; selfWalletMin: number };
        Lvl4: { directMembers: number; memberWalletMin: number; selfWalletMin: number };
        Lvl5: { directMembers: number; memberWalletMin: number; selfWalletMin: number };
      };
      percentages: {
        Lvl1: number;
        Lvl2: number;
        Lvl3: number;
        Lvl4: number;
        Lvl5: number;
      };
      lastCalculated: string;
      totalEarned: number;
      directMembers: Array<{
        memberId: string;
        joinedAt: string;
        walletBalance: number;
      }>;
    };
    potentialIncome: {
      character: number;
      digit: number;
      total: number;
    };
    dailyIncome: {
      characterLevel: number;
      digitLevel: number;
      lastClaimed: string;
    };
    canClaim: boolean;
  };
}

export const getLevelsStatus = async (): Promise<LevelsStatusResponse> => {
  const token = getAuthToken();
  if (!token) throw new Error('No authentication token found');
  
  try {
    const { response, data } = await apiRequest('/levels/status', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (!response.ok || !data.success) {
      throw new Error(data.message || 'Failed to fetch levels status');
    }
    
    return data;
  } catch (error) {
    throw error;
  }
};

// Team Income API
export interface TeamIncomeUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  referralCode: string;
  normalWalletBalance: number;
  investmentWalletBalance: number;
  dailyIncomeEarned: number;
  joinedDate: string;
}

export interface TeamIncomeLevel {
  count: number;
  totalNormalWallet: number;
  totalInvestmentWallet: number;
  totalDailyIncome: number;
  users: TeamIncomeUser[];
}

export interface TeamIncomeSummary {
  level1Members: number;
  level2Members: number;
  level3Members: number;
  level4Members: number;
  level5Members: number;
  totalMembers: number;
  totalIncome: number;
  totalNormalWallet: number;
  totalInvestmentWallet: number;
}

export interface TeamIncomeData {
  user: {
    id: string;
    name: string;
    email: string;
    referralCode: string;
  };
  teamIncomeByLevel: {
    level1: TeamIncomeLevel;
    level2: TeamIncomeLevel;
    level3: TeamIncomeLevel;
    level4: TeamIncomeLevel;
    level5: TeamIncomeLevel;
  };
  totalTeamMembers: number;
  totalTeamIncome: number;
  totalNormalWalletBalance: number;
  totalInvestmentWalletBalance: number;
  summary: TeamIncomeSummary;
}

export interface TeamIncomeResponse {
  success: boolean;
  message: string;
  data: TeamIncomeData;
}

export const getTeamIncome = async (): Promise<TeamIncomeResponse> => {
  const token = getAuthToken();
  if (!token) throw new Error('No authentication token found');
  const { response, data } = await apiRequest('/users/team-income', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!response.ok || !data.success) {
    throw new Error(data.message || 'Failed to fetch team income');
  }
  return data;
};

// Transaction History API
export interface Transaction {
  type: string;
  amount: number;
  description: string;
  date: string;
  status: string;
  walletType: string;
  walletName: string;
}

export interface TransactionStats {
  total: number;
  byType: Record<string, number>;
  byStatus: Record<string, number>;
  totalAmount: {
    deposits: number;
    withdrawals: number;
    transfers: number;
    bonuses: number;
    dailyIncome: number;
  };
}

export interface TransactionPagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface TransactionsResponse {
  success: boolean;
  message: string;
  data: {
    transactions: Transaction[];
    stats: TransactionStats;
    pagination: TransactionPagination;
  };
}

export const getTransactions = async (): Promise<TransactionsResponse> => {
  const token = getAuthToken();
  if (!token) throw new Error('No authentication token found');
  const { response, data } = await apiRequest('/users/transactions', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!response.ok || !data.success) {
    throw new Error(data.message || 'Failed to fetch transactions');
  }
  return data;
};

// Withdrawal Request API
export interface WithdrawalRequest {
  amount: number;
  walletAddress: string;
}

export interface WithdrawalResponse {
  success: boolean;
  message: string;
  data?: {
    id: string;
    amount: number;
    walletAddress: string;
    status: string;
    createdAt: string;
  };
}

export const createWithdrawalRequest = async (body: WithdrawalRequest): Promise<WithdrawalResponse> => {
  const token = getAuthToken();
  if (!token) throw new Error('No authentication token found');
  
  try {
    const { response, data } = await apiRequest('/withdrawal/request', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    
    if (!response.ok || !data.success) {
      throw new Error(data.message || 'Failed to create withdrawal request');
    }
    
    return data;
  } catch (error) {
    throw error;
  }
};

export interface InvestmentPlan {
  _id: string;
  title: string;
  description: string;
  image: string;
  investmentRequired: number;
  dailyPercentage: number;
  durationDays: number;
  isActive: boolean;
  totalReturnPercentage: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface InvestmentPlansResponse {
  success: boolean;
  data: InvestmentPlan[];
}

export const getInvestmentPlans = async (): Promise<InvestmentPlansResponse> => {
  const token = getAuthToken();
  if (!token) throw new Error('No authentication token found');
  const { response, data } = await apiRequest('/investment/plans', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!response.ok || !data.success) {
    throw new Error(data.message || 'Failed to fetch investment plans');
  }
  return data;
};

export interface PurchaseInvestmentRequest {
  planId: string;
  investmentAmount: number;
}

export interface PurchaseInvestmentResponse {
  success: boolean;
  message: string;
  data: {
    investment: {
      id: string;
      userId: string;
      planId: string;
      investmentAmount: number;
      dailyEarning: number;
      totalEarned: number;
      startDate: string;
      endDate: string;
      isCompleted: boolean;
      isWithdrawn: boolean;
    };
    plan: {
      id: string;
      title: string;
      durationDays: number;
    };
    remainingBalance: number;
  };
}

export const purchaseInvestment = async (body: PurchaseInvestmentRequest): Promise<PurchaseInvestmentResponse> => {
  const token = getAuthToken();
  if (!token) throw new Error('No authentication token found');
  const { response, data } = await apiRequest('/investment/purchase', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  if (!response.ok || !data.success) {
    throw new Error(data.message || 'Failed to purchase investment');
  }
  return data;
};

export interface MyInvestmentPlan {
  id: string;
  _id: string; // Add this line to match API response
  title: string;
  description: string;
  image: string;
}

export interface MyInvestmentDailyEarning {
  date: string;
  amount: number;
  isClaimed: boolean;
}

export interface MyInvestment {
  id: string;
  planId: MyInvestmentPlan;
  investmentAmount: number;
  dailyEarning: number;
  totalEarned: number;
  startDate: string;
  endDate: string;
  isCompleted: boolean;
  isWithdrawn: boolean;
  remainingDays: number;
  totalReturnAmount: number;
  dailyEarnings: MyInvestmentDailyEarning[];
}

export interface MyInvestmentsResponse {
  success: boolean;
  data: MyInvestment[];
}

export const getMyInvestments = async (): Promise<MyInvestmentsResponse> => {
  const token = getAuthToken();
  if (!token) throw new Error('No authentication token found');
  const { response, data } = await apiRequest('/investment/my-investments', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!response.ok || !data.success) {
    throw new Error(data.message || 'Failed to fetch my investments');
  }
  return data;
};

// Lucky Draw API interfaces and functions
export interface LuckyDraw {
  _id: string;
  title: string;
  description: string;
  amount: number;
  maxParticipants: number;
  currentParticipants: number;
  status: string;
  startDate: string;
  endDate: string;
  drawDate: string;
  userParticipation: {
    isParticipant: boolean;
    isWinner: boolean;
    canJoin: boolean;
    canClaim?: boolean;
    joinReason?: string;
    claimReason?: string;
  };
}

export interface LuckyDrawDetails extends LuckyDraw {
  participants: Array<{
    userId: {
      _id: string;
      name: string;
      email: string;
      phone: string;
    };
    userName: string;
    userEmail: string;
    joinedAt: string;
    isWinner: boolean;
    hasClaimed: boolean;
  }>;
  winners: any[];
}

export interface ActiveLuckyDrawsResponse {
  success: boolean;
  data: {
    luckyDraws: LuckyDraw[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      itemsPerPage: number;
    };
  };
}

export const getActiveLuckyDraws = async (page = 1, limit = 10): Promise<ActiveLuckyDrawsResponse> => {
  const token = getAuthToken();
  if (!token) throw new Error('No authentication token found');
  
  const { response, data } = await apiRequest(`/luckydraw/active?page=${page}&limit=${limit}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok || !data.success) {
    throw new Error(data.message || 'Failed to fetch active lucky draws');
  }

  return data;
};

export const getLuckyDrawDetails = async (luckyDrawId: string): Promise<{ success: boolean; data: LuckyDrawDetails }> => {
  const token = getAuthToken();
  if (!token) throw new Error('No authentication token found');
  
  const { response, data } = await apiRequest(`/luckydraw/${luckyDrawId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok || !data.success) {
    throw new Error(data.message || 'Failed to fetch lucky draw details');
  }

  return data;
};

export const joinLuckyDraw = async (luckyDrawId: string): Promise<{ success: boolean; message: string; data: any }> => {
  const token = getAuthToken();
  if (!token) throw new Error('No authentication token found');
  
  const { response, data } = await apiRequest(`/luckydraw/${luckyDrawId}/join`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok || !data.success) {
    throw new Error(data.message || 'Failed to join lucky draw');
  }

  return data;
};

export const claimLuckyDrawPrize = async (luckyDrawId: string): Promise<{ success: boolean; message: string; data: any }> => {
  const token = getAuthToken();
  if (!token) throw new Error('No authentication token found');
  
  const { response, data } = await apiRequest(`/luckydraw/${luckyDrawId}/claim`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok || !data.success) {
    throw new Error(data.message || 'Failed to claim prize');
  }

  return data;
};

export interface LuckyDrawHistoryItem {
  id: string;
  title: string;
  description: string;
  amount: number;
  status: string;
  startDate: string;
  endDate: string;
  drawDate: string;
  joinedAt: string;
  isWinner: boolean;
  prizeAmount?: number;
  hasClaimed: boolean;
  claimedAt?: string;
  totalParticipants: number;
  maxParticipants: number;
}

export interface LuckyDrawHistoryResponse {
  success: boolean;
  data: {
    history: LuckyDrawHistoryItem[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      itemsPerPage: number;
    };
  };
}

export const getLuckyDrawHistory = async (page = 1, limit = 10): Promise<LuckyDrawHistoryResponse> => {
  const token = getAuthToken();
  if (!token) throw new Error('No authentication token found');
  
  const { response, data } = await apiRequest(`/luckydraw/my/history?page=${page}&limit=${limit}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok || !data.success) {
    throw new Error(data.message || 'Failed to fetch lucky draw history');
  }

  return data;
};

export interface LuckyDrawStats {
  totalParticipated: number;
  totalWon: number;
  totalPrizeAmount: number;
  totalClaimed: number;
  totalUnclaimed: number;
  winRate: number;
}

export interface LuckyDrawStatsResponse {
  success: boolean;
  data: LuckyDrawStats;
}

export const getLuckyDrawStats = async (): Promise<LuckyDrawStatsResponse> => {
  const token = getAuthToken();
  if (!token) throw new Error('No authentication token found');
  
  const { response, data } = await apiRequest('/luckydraw/my/stats', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok || !data.success) {
    throw new Error(data.message || 'Failed to fetch lucky draw stats');
  }

  return data;
};

export interface UnclaimedPrize {
  luckyDrawId: string;
  title: string;
  description: string;
  prizeAmount: number;
  drawDate: string;
  canClaim: boolean;
}

export interface UnclaimedPrizesResponse {
  success: boolean;
  data: {
    unclaimedPrizes: UnclaimedPrize[];
    totalUnclaimed: number;
    totalAmount: number;
  };
}

export const getUnclaimedPrizes = async (): Promise<UnclaimedPrizesResponse> => {
  const token = getAuthToken();
  if (!token) throw new Error('No authentication token found');
  
  const { response, data } = await apiRequest('/luckydraw/my/unclaimed', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok || !data.success) {
    throw new Error(data.message || 'Failed to fetch unclaimed prizes');
  }

  return data;
};