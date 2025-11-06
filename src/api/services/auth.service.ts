import { apiClient } from '../client';
import { API_ENDPOINTS } from '../endpoints';
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  LogoutRequest,
  RefreshTokenRequest,
  VerifyEmailRequest,
  VerifyEmailResponse,
  VerifyEmailCodeRequest,
  VerifyEmailCodeResponse,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  ResetPasswordResponse,
  SetPasswordRequest,
  SetPasswordUserResponse,
  AuthStatusResponse,
  SendForgotPasswordEmailResponse,
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
    const response = await apiClient.post(API_ENDPOINTS.AUTH.LOGIN, data, {
      headers: {
        _skipTokenRefresh: true, // Skip token refresh for this auth endpoint
      },
    });
    return response.data;
  },

  /**
   * Register new user
   */
  register: async (data: RegisterRequest): Promise<RegisterResponse> => {
    const response = await apiClient.post(API_ENDPOINTS.AUTH.REGISTER, data, {
      headers: {
        _skipTokenRefresh: true, // Skip token refresh for this auth endpoint
      },
    });
    return response.data;
  },

  /**
   * Logout current user
   */
  logout: async (data?: LogoutRequest): Promise<void> => {
    await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT, data || { data: {} }, {
      headers: {
        _skipTokenRefresh: true, // Skip token refresh for this auth endpoint
      },
    });
  },

  /**
   * Refresh authentication token
   */
  refreshToken: async (refreshToken: string): Promise<LoginResponse> => {
    const response = await apiClient.post(
      API_ENDPOINTS.AUTH.REFRESH_TOKEN,
      {
        refreshToken,
      } as RefreshTokenRequest,
      {
        headers: {
          _skipTokenRefresh: true, // Skip token refresh for this auth endpoint
        },
      },
    );
    return response.data;
  },

  /**
   * Check auth status using existing token
   */
  getStatus: async (): Promise<AuthStatusResponse> => {
    const response = await apiClient.get(API_ENDPOINTS.AUTH.STATUS, {
      headers: {
        // _skipTokenRefresh: true, // Skip token refresh for this auth endpoint
      },
    });
    return response.data;
  },

  /**
   * Verify email address
   */
  verifyEmail: async (
    data: VerifyEmailRequest,
  ): Promise<VerifyEmailResponse> => {
    const response = await apiClient.post(
      API_ENDPOINTS.AUTH.VERIFY_EMAIL,
      data,
    );
    return response.data;
  },

  /**
   * Verify email with code (confirm)
   */
  verifyEmailCode: async (
    data: VerifyEmailCodeRequest,
  ): Promise<VerifyEmailCodeResponse> => {
    const response = await apiClient.post(
      API_ENDPOINTS.AUTH.VERIFY_EMAIL_CODE,
      data,
      {
        headers: {
          _skipTokenRefresh: true, // Skip token refresh for this auth endpoint
        },
      },
    );
    return response.data;
  },

  /**
   * Request password reset (send forgot password email)
   */
  sendForgotPasswordEmail: async (
    data: ForgotPasswordRequest,
  ): Promise<SendForgotPasswordEmailResponse> => {
    const response = await apiClient.post(
      API_ENDPOINTS.AUTH.SEND_FORGOT_PASSWORD_EMAIL,
      data,
      {
        headers: {
          _skipTokenRefresh: true, // Skip token refresh for this auth endpoint
        },
      },
    );
    return response.data;
  },

  /**
   * Reset password with code
   */
  resetPassword: async (
    data: ResetPasswordRequest,
  ): Promise<ResetPasswordResponse> => {
    const response = await apiClient.post(
      API_ENDPOINTS.AUTH.RESET_PASSWORD,
      data,
      {
        headers: {
          _skipTokenRefresh: true, // Skip token refresh for this auth endpoint
        },
      },
    );
    return response.data;
  },

  /**
   * Set password (for new users after email verification)
   */
  setPassword: async (
    data: SetPasswordRequest,
  ): Promise<SetPasswordUserResponse> => {
    const response = await apiClient.post(
      API_ENDPOINTS.USER.SET_PASSWORD,
      data,
      {
        headers: {
          _skipTokenRefresh: true, // Skip token refresh for this auth endpoint
        },
      },
    );
    return response.data;
  },
};
