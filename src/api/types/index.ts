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

