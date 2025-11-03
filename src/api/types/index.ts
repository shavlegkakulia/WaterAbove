/**
 * API Request/Response Types
 */

// Common types
export interface ApiError {
  message: string;
  code?: string;
  details?: Record<string, any>;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// User types
export interface User {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
  phone?: string;
  bio?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfileRequest {
  name?: string;
  phone?: string;
  bio?: string;
}

// Auth types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
  refreshToken: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name?: string;
}

export interface RegisterResponse {
  user: User;
  token: string;
  refreshToken: string;
}

export interface VerifyEmailRequest {
  email: string;
}

export interface VerifyEmailResponse {
  success: boolean;
  data?: Record<string, any> | null;
  error?: string;
}

export interface VerifyEmailCodeRequest {
  email: string;
  code: string;
}

// Auth status
export interface AuthStatusResponse {
  success: boolean;
  data?: {
    authenticated: boolean;
    user?: User | null;
    accessToken?: string;
    refreshToken?: string;
    message?: string;
  } | null;
  error?: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  code: string;
  newPassword: string;
}

export interface SetPasswordRequest {
  password: string;
}

export interface SetPasswordResponse {
  success: boolean;
  data: {
    id: string;
    email: string;
    username: string | null;
    fullName: string;
    firstName: string | null;
    lastName: string | null;
    role: string;
    isVerified: boolean;
    isPaymentActive: boolean;
    hasPassword: boolean;
    createdAt: string;
    updatedAt: string;
  };
  message: string;
}

export interface CheckUsernameAvailabilityRequest {
  username: string;
}

export interface CheckUsernameAvailabilityResponse {
  available: boolean;
  message?: string;
}

// Accept Terms
export interface AcceptTermsRequest {
  termsVersion: string;
  privacyPolicyVersion: string;
}

export interface AcceptTermsResponse {
  success: boolean;
  data: {
    userId: string;
    avatarUrl: string | null;
    dateOfBirth: string | null;
    gender: string;
    genderOther: string | null;
    zodiacSign: string | null;
    profileCompletionPercentage: number;
    showAge: boolean;
    showDob: boolean;
    termsAcceptedAt: string;
    termsVersion: string;
    privacyPolicyAcceptedAt: string;
    privacyPolicyVersion: string;
    marketingEmails: boolean;
    newsletterEmails: boolean;
    smsNotifications: boolean;
    isInterestedInBeingAMentor: boolean;
    isInterestedInBeingMentored: boolean;
    isInterestedInFindingAnAccountabilityPartner: boolean;
    shareTravelLocation: boolean;
    travelLocation: string | null;
    educationField: string | null;
    educationSchool: string | null;
    educationLevel: string | null;
    height: number | null;
    weight: number | null;
    interestedIn: string | null;
    relationshipStatus: string | null;
    doesSmoke: boolean;
    doesDrink: boolean;
    opinionOnHavingChildren: string | null;
    purpose: string | null;
    topicsThatMatter: string | null;
    employmentStatus: string | null;
    createdAt: string;
    updatedAt: string;
  };
  message: string;
}

// Upload Image
export interface UploadImageResponse {
  success: boolean;
  data: {
    url: string;
    filename: string;
  };
}

// Update User (new format)
export interface UpdateUserRequest {
  userData?: {
    username?: string;
  };
  profileData?: {
    dateOfBirth?: string; // Format: "DD-MM-YYYY"
    termsAndConditions?: boolean;
    avatarUrl?: string;
    profileCompletionPercentage?: number;
  };
}

export interface UpdateUserResponse {
  success: boolean;
  data: {
    id: string;
    email: string;
    username: string;
    fullName: string;
    firstName: string | null;
    lastName: string | null;
    role: string;
    isVerified: boolean;
    isPaymentActive: boolean;
    hasPassword: boolean;
    createdAt: string;
    updatedAt: string;
  };
  message: string;
}

// Config types
export interface AppConfig {
  version: string;
  features: Record<string, boolean>;
  maintenance: boolean;
}

export interface DeviceConfig {
  minVersion: string;
  forceUpdate: boolean;
  updateUrl?: string;
}

