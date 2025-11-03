import {apiClient} from '../client';
import {API_ENDPOINTS} from '../endpoints';
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  VerifyEmailRequest,
  VerifyEmailResponse,
  VerifyEmailCodeRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  SetPasswordRequest,
  SetPasswordResponse,
  AuthStatusResponse,
} from '../types';

/**
 * Authentication Service
 * All auth-related API calls
 */
export const authService = {
  /**
   * Login with email and password
   */
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await apiClient.post(API_ENDPOINTS.AUTH.LOGIN, data);
    return response.data;
  },

  /**
   * Register new user
   */
  register: async (data: RegisterRequest): Promise<RegisterResponse> => {
    const response = await apiClient.post(API_ENDPOINTS.AUTH.REGISTER, data);
    return response.data;
  },

  /**
   * Logout current user
   */
  logout: async (): Promise<void> => {
    await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
  },

  /**
   * Refresh authentication token
   */
  refreshToken: async (refreshToken: string): Promise<LoginResponse> => {
    const response = await apiClient.post(API_ENDPOINTS.AUTH.REFRESH_TOKEN, {
      refreshToken,
    });
    return response.data;
  },

  /**
   * Check auth status using existing token
   */
  getStatus: async (): Promise<AuthStatusResponse> => {
    const response = await apiClient.get(API_ENDPOINTS.AUTH.STATUS);
    return response.data;
  },

  /**
   * Verify email address
   */
  verifyEmail: async (data: VerifyEmailRequest): Promise<VerifyEmailResponse> => {
    const response = await apiClient.post(API_ENDPOINTS.AUTH.VERIFY_EMAIL, data);
    return response.data;
  },

  /**
   * Verify email with code (confirm)
   */
  verifyEmailCode: async (data: VerifyEmailCodeRequest): Promise<VerifyEmailResponse> => {
    const response = await apiClient.post(API_ENDPOINTS.AUTH.VERIFY_EMAIL_CODE, data);
    return response.data;
  },

  /**
   * Request password reset
   */
  forgotPassword: async (data: ForgotPasswordRequest): Promise<void> => {
    await apiClient.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, data);
  },

  /**
   * Reset password with code
   */
  resetPassword: async (data: ResetPasswordRequest): Promise<void> => {
    await apiClient.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, data);
  },

  /**
   * Change password (authenticated)
   */
  changePassword: async (data: {
    currentPassword: string;
    newPassword: string;
  }): Promise<void> => {
    await apiClient.post(API_ENDPOINTS.AUTH.CHANGE_PASSWORD, data);
  },

  /**
   * Set password (for new users after email verification)
   */
  setPassword: async (data: SetPasswordRequest): Promise<SetPasswordResponse> => {
    const response = await apiClient.post(API_ENDPOINTS.USER.SET_PASSWORD, data);
    if (response.status >= 400) {
      const errorMessage = response.data?.message || response.data?.error || 'Failed to set password';
      throw new Error(errorMessage);
    }
    return response.data;
  },
};

