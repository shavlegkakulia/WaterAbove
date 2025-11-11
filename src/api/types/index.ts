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
 * User Purpose
 */
export type UserPurpose =
  | 'starting-a-business'
  | 'networking'
  | 'looking-for-work'
  | 'hiring'
  | 'making-friends'
  | 'dating';

/**
 * User Topic
 */
export type UserTopic =
  | 'writing'
  | 'technology'
  | 'skilled-trades'
  | 'start-ups'
  | 'music'
  | 'marketing'
  | 'podcasting'
  | 'film'
  | 'photography'
  | 'health-and-wellness'
  | 'art-and-design'
  | 'hospitality'
  | 'travel'
  | 'finances'
  | 'education'
  | 'ecommerce'
  | 'coaching'
  | 'care-giving'
  | 'spirituality'
  | 'biz-ops'
  | 'parenting'
  | 'events'
  | 'animals'
  | 'gaming'
  | 'cooking';

/**
 * User Employment Status
 */
export type UserEmploymentStatus =
  | 'entrepreneur'
  | 'self-employed'
  | 'homemaker'
  | 'student'
  | 'retired'
  | 'employee'
  | 'looking-for-work'
  | 'hiring'
  | 'side-hustler'
  | 'unemployed'
  | 'prefer-not-to-say';

/**
 * User Level of Education
 */
export type UserLevelOfEducation =
  | 'no-formal-education'
  | 'some-high-school'
  | 'high-school-diploma-ged'
  | 'associates-degree'
  | 'bachelors-degree'
  | 'masters-degree'
  | 'doctorate-degree'
  | 'professional-degree'
  | 'trade-technical'
  | 'prefer-not-to-say';

/**
 * User Gender
 */
export type UserGender = 'male' | 'female' | 'other' | 'unspecified';

/**
 * User Zodiac Sign
 */
export type UserZodiacSign =
  | 'aries'
  | 'taurus'
  | 'gemini'
  | 'cancer'
  | 'leo'
  | 'virgo'
  | 'libra'
  | 'scorpio'
  | 'ophiuchus'
  | 'sagittarius'
  | 'capricorn'
  | 'aquarius'
  | 'pisces';

/**
 * User Relationship Status
 */
export type UserRelationshipStatus =
  | 'working-on-myself'
  | 'just-vibing'
  | 'dating'
  | 'in-a-relationship'
  | 'single'
  | 'single-and-seeking'
  | 'happily-single'
  | 'married';

/**
 * User Opinion on Having Children
 */
export type UserOpinionOnHavingChildren =
  | 'prefer-not-to-say'
  | 'have-kids'
  | 'want-kids'
  | 'do-not-want-kids'
  | 'unsure';

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
    purpose?: string | string[];
    profileCompletionPercentage?: number;
    showAge?: boolean;
    showDob?: boolean;
    isOnMemberMap?: boolean;
    shareLocation?: boolean;
    isInterestedInBeingAMentor?: boolean;
    isInterestedInBeingMentored?: boolean;
    isInterestedInFindingAnAccountabilityPartner?: boolean;
    shareTravelLocation?: boolean;
    travelLocation?: string | null;
    topicsThatMatter?: string[];
    employmentStatus?: string[];
    educationLevel?: string;
    educationField?: string;
    educationSchool?: string;
    relationshipStatus?: string;
    interestedIn?: string;
    height?: number;
    weight?: number;
    doesSmoke?: boolean;
    doesDrink?: boolean;
    opinionOnHavingChildren?: string;
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

// ============================================================================
// Location Types
// ============================================================================

export interface LocationAutocompleteRequest {
  input: string;
  limit?: number;
}

export interface LocationMatchContinent {
  id: string;
  name: string;
  code?: string | null;
}

export interface LocationMatchCountry {
  id: string;
  name: string;
  code?: string | null;
  continentId?: string | null;
}

export interface LocationMatchRegion {
  id: string;
  name: string;
  code?: string | null;
  countryId?: string | null;
  countryName?: string | null;
}

export interface LocationMatchCity {
  id: string;
  name: string;
  countryId?: string | null;
  countryName?: string | null;
  regionId?: string | null;
  code?: string | null;
}

export interface LocationMatch {
  continent?: LocationMatchContinent;
  country?: LocationMatchCountry;
  region?: LocationMatchRegion;
  city?: LocationMatchCity;
}

export interface LocationAutocompleteSuggestion {
  description: string;
  placeId: string;
  types?: string[];
  matchedSubstrings?: Array<{ length: number; offset: number }>;
  structuredFormatting?: {
    mainText: string;
    secondaryText?: string;
  };
  terms?: Array<{ offset: number; value: string }>;
  formattedAddress?: string;
  location?: {
    lat: number;
    lng: number;
  };
  addressComponents?: Array<{
    longName: string;
    shortName: string;
    types: string[];
  }>;
  locationMatch?: LocationMatch;
}

export type LocationAutocompleteApiResponse =
  ApiSuccessResponse<LocationAutocompleteSuggestion[]>;

export interface LocationMemberCountsRequest {
  cityId?: string;
  countryId?: string;
  regionId?: string;
  continentId?: string;
}

export interface LocationMemberCount {
  id: string;
  name: string;
  code?: string | null;
  memberCount: number;
}

export interface LocationMemberCountsResponse {
  continent?: LocationMemberCount;
  country?: LocationMemberCount;
  region?: LocationMemberCount;
  city?: LocationMemberCount;
}

export type LocationMemberCountsApiResponse = ApiSuccessResponse<LocationMemberCountsResponse>;

export interface UpdateUserLocationRequest {
  continentId?: string;
  countryId?: string;
  regionId?: string;
  cityId?: string;
  showOnProfile: boolean;
  subscribeToMemberMap: boolean;
  subscribeToContinentGroup: boolean;
  subscribeToCountryGroup: boolean;
  subscribeToRegionGroup: boolean;
  subscribeToCityGroup: boolean;
  formattedAddress: string;
}

export interface UserLocationResponse {
  id: string;
  userId: string;
  continentId?: string;
  countryId?: string;
  regionId?: string;
  cityId?: string;
  formattedAddress: string;
  showOnProfile: boolean;
  subscribeToMemberMap: boolean;
  subscribeToContinentGroup: boolean;
  subscribeToCountryGroup: boolean;
  subscribeToRegionGroup: boolean;
  subscribeToCityGroup: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateUserLocationResponse {
  location: UserLocationResponse;
}

export type UpdateUserLocationApiResponse = ApiSuccessResponse<UpdateUserLocationResponse>;

// Legacy types (kept for backward compatibility)
export interface ApiError {
  message: string;
  code?: string;
  details?: Record<string, any>;
}
