/**
 * API Request/Response Types
 */

// ============================================================================
// Common Response Types
// ============================================================================

/**
 * Standard API Success Response
 */
export interface ApiSuccessResponse<T = any> {
  success: true;
  data: T;
  message?: string;
  error?: string;
}

/**
 * Standard API Error Response
 */
export interface ApiErrorResponse {
  success: false | Record<string, any>;
  error: string;
  code?: string;
  details?: Record<string, any>;
}

/**
 * Standard API Response (union of success and error)
 */
export type ApiResponse<T = any> = ApiSuccessResponse<T> | ApiErrorResponse;

// ============================================================================
// User Profile Types
// ============================================================================

/**
 * User Role
 */
export type UserRole = 'OWNER' | 'MEMBER' | 'ADMIN';

/**
 * User Profile
 * All values are nullable - API could return all, none, or any combination
 */
export interface UserProfile {
  id?: string | null;
  userId?: string | null;
  avatarUrl?: string | null;
  dateOfBirth?: string | null; // ISO date string
  gender?: string | null;
  genderOther?: string | null;
  zodiacSign?: string | null;
  profileCompletionPercentage?: number | null;
  showAge?: boolean | null;
  showDob?: boolean | null;
  termsAcceptedAt?: string | null; // ISO date string
  termsVersion?: string | null;
  privacyPolicyAcceptedAt?: string | null; // ISO date string
  privacyPolicyVersion?: string | null;
  marketingEmails?: boolean | null;
  newsletterEmails?: boolean | null;
  smsNotifications?: boolean | null;
  isInterestedInBeingAMentor?: boolean | null;
  isInterestedInBeingMentored?: boolean | null;
  isInterestedInFindingAnAccountabilityPartner?: boolean | null;
  shareTravelLocation?: boolean | null;
  travelLocation?: string | null;
  educationField?: string | null;
  educationSchool?: string | null;
  educationLevel?: string | null;
  height?: number | null;
  weight?: number | null;
  interestedIn?: string | null;
  relationshipStatus?: string | null;
  doesSmoke?: boolean | null;
  doesDrink?: boolean | null;
  opinionOnHavingChildren?: string | null;
  purpose?: string[] | null;
  topicsThatMatter?: string[] | null;
  employmentStatus?: string[] | null;
  createdAt?: string | null; // ISO date string
  updatedAt?: string | null; // ISO date string
  deletedAt?: string | null; // ISO date string
}

/**
 * User Location
 * All values are nullable - API could return all, none, or any combination
 */
export interface UserLocation {
  id?: string | null;
  userId?: string | null;
  continentId?: string | null;
  countryId?: string | null;
  regionId?: string | null;
  cityId?: string | null;
  formattedAddress?: string | null;
  showOnProfile?: boolean | null;
  subscribeToMemberMap?: boolean | null;
  subscribeToContinentGroup?: boolean | null;
  subscribeToCountryGroup?: boolean | null;
  subscribeToRegionGroup?: boolean | null;
  subscribeToCityGroup?: boolean | null;
  createdAt?: string | null; // ISO date string
  updatedAt?: string | null; // ISO date string
}

/**
 * Full User Object (from API)
 * All values are nullable - API could return all, none, or any combination
 */
export interface ApiUser {
  id?: string | null;
  email?: string | null;
  username?: string | null;
  fullName?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  role?: UserRole | null;
  isVerified?: boolean | null;
  isPaymentActive?: boolean | null;
  hasPassword?: boolean | null;
  profile?: UserProfile | null;
  userLocation?: UserLocation | null;
  updatedAt?: string | null; // ISO date string
  createdAt?: string | null; // ISO date string
  deletedAt?: string | null; // ISO date string
}

/**
 * Simplified User (for internal use)
 */
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

// ============================================================================
// Authentication Tokens
// ============================================================================

/**
 * Authentication Tokens
 * All values are nullable - API could return all, none, or any combination
 */
export interface AuthTokens {
  accessToken?: string | null;
  refreshToken?: string | null;
  expiresIn?: number | null; // Token expiration time in seconds
}

/**
 * Authentication Data (common structure for auth responses)
 * All values are nullable - API could return all, none, or any combination
 */
export interface AuthData {
  authenticated?: boolean | null;
  tokens?: AuthTokens | null;
  user?: ApiUser | null;
}

// ============================================================================
// Auth Request Types
// ============================================================================

export interface LoginRequest {
  email: string;
  username?: string;
  password: string;
  deviceInfo?: Record<string, any>;
  sessionId?: string;
}

export interface RegisterRequest {
  email: string;
  username?: string;
  fullName?: string;
  password: string;
  deviceInfo?: Record<string, any>;
  sessionId?: string;
}

export interface LogoutRequest {
  data?: Record<string, any>;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface VerifyEmailRequest {
  email: string;
}

export interface VerifyEmailCodeRequest {
  email: string;
  code: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
}

export interface SetPasswordRequest {
  password: string;
}

// ============================================================================
// Auth Response Types
// ============================================================================

/**
 * Login Response
 */
export type LoginResponse = ApiSuccessResponse<AuthData>;

/**
 * Register Response
 */
export type RegisterResponse = ApiSuccessResponse<AuthData>;

/**
 * Verify Email Response (send-email-verification)
 */
export type VerifyEmailResponse = ApiSuccessResponse<{
  message?: string;
}>;

/**
 * Verify Email Code Response
 */
export type VerifyEmailCodeResponse = ApiSuccessResponse<AuthData>;

/**
 * Auth Status Response
 */
export type AuthStatusResponse = ApiSuccessResponse<AuthData>;

/**
 * Reset Password Response
 */
export type ResetPasswordResponse = ApiSuccessResponse<AuthData>;

/**
 * Set Password Response
 */
export type SetPasswordResponse = ApiSuccessResponse<AuthData>;

/**
 * Send Forgot Password Email Response
 */
export type SendForgotPasswordEmailResponse = ApiSuccessResponse<{
  message?: string;
}>;

// ============================================================================
// User Request/Response Types
// ============================================================================

export interface UpdateUserRequest {
  userData?: {
    email?: string;
    username?: string;
    fullName?: string;
    firstName?: string;
    lastName?: string;
    role?: UserRole;
    isVerified?: boolean;
    isPaymentActive?: boolean;
  } | null;
  profileData?: {
    avatarUrl?: string;
    dateOfBirth?: string | number | boolean | object | null; // Can be various types
    gender?: 'MALE' | 'FEMALE' | 'OTHER' | string;
    genderOther?: string;
    zodiacSign?: string;
    purpose?: string;
    profileCompletionPercentage?: number;
    showAge?: boolean;
    showDob?: boolean;
    isOnMemberMap?: boolean;
    shareLocation?: boolean;
    street?: string;
    postalCode?: string;
    termsAcceptedAt?: number;
    termsVersion?: string;
    privacyPolicyAcceptedAt?: number;
    privacyPolicyVersion?: string;
    marketingEmails?: boolean;
    newsletterEmails?: boolean;
    smsNotifications?: boolean;
  } | null;
}

/**
 * Update User Response
 */
export type UpdateUserResponse = ApiSuccessResponse<AuthData>;

/**
 * Set Password Response (user endpoint)
 */
export type SetPasswordUserResponse = ApiSuccessResponse<AuthData>;

// ============================================================================
// Other Types
// ============================================================================

export interface CheckUsernameAvailabilityRequest {
  username: string;
}

/**
 * Check Username Availability Response
 */
export type CheckUsernameAvailabilityResponse = ApiSuccessResponse<{
  username?: string;
  available?: boolean;
}>;

export interface AcceptTermsRequest {
  termsVersion: string;
  privacyPolicyVersion: string;
  marketingEmails?: boolean;
  newsletterEmails?: boolean;
  smsNotifications?: boolean;
}

/**
 * Accept Terms Response
 * All values are nullable - API could return all, none, or any combination
 */
export type AcceptTermsResponse = ApiSuccessResponse<{
  userId?: string | null;
  avatarUrl?: string | null;
  dateOfBirth?: string | null;
  gender?: string | null;
  genderOther?: string | null;
  zodiacSign?: string | null;
  profileCompletionPercentage?: number | null;
  showAge?: boolean | null;
  showDob?: boolean | null;
  termsAcceptedAt?: string | null;
  termsVersion?: string | null;
  privacyPolicyAcceptedAt?: string | null;
  privacyPolicyVersion?: string | null;
  marketingEmails?: boolean | null;
  newsletterEmails?: boolean | null;
  smsNotifications?: boolean | null;
  isInterestedInBeingAMentor?: boolean | null;
  isInterestedInBeingMentored?: boolean | null;
  isInterestedInFindingAnAccountabilityPartner?: boolean | null;
  shareTravelLocation?: boolean | null;
  travelLocation?: string | null;
  educationField?: string | null;
  educationSchool?: string | null;
  educationLevel?: string | null;
  height?: number | null;
  weight?: number | null;
  interestedIn?: string | null;
  relationshipStatus?: string | null;
  doesSmoke?: boolean | null;
  doesDrink?: boolean | null;
  opinionOnHavingChildren?: string | null;
  purpose?: string | null;
  topicsThatMatter?: string | null;
  employmentStatus?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
}>;

export interface UploadImageResponse {
  success: boolean;
  data: {
    url: string;
    filename: string;
  };
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

// Legacy types (kept for backward compatibility)
export interface ApiError {
  message: string;
  code?: string;
  details?: Record<string, any>;
}
