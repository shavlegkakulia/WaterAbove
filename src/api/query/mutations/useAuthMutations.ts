import {useMutation, useQueryClient} from '@tanstack/react-query';
import {useSetAtom} from 'jotai';
import {authService, setAuthToken as setAxiosAuthToken} from '@/api';
import {queryKeys} from '../queryClient';
import {
  userAtom,
  isAuthenticatedAtom,
  authTokenAtom,
  refreshTokenAtom,
  tokenExpiryAtom,
} from '@/store/atoms';
import {storeAuthTokens} from '@/api/utils/tokenStorage';
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  VerifyEmailRequest,
  VerifyEmailCodeRequest,
  SetPasswordRequest,
  User,
  ApiUser,
  ResetPasswordResponse,
} from '@/api/types';

/**
 * Helper function to convert ApiUser to User
 * Handles nullable values from API
 */
const mapApiUserToUser = (apiUser: ApiUser | null | undefined): User | null => {
  if (!apiUser) {
    return null;
  }
  
  return {
    id: apiUser.id || '',
    email: apiUser.email || '',
    name: apiUser.fullName || apiUser.username || undefined,
    avatar: apiUser.profile?.avatarUrl || undefined,
    createdAt: apiUser.createdAt || new Date().toISOString(),
    updatedAt: apiUser.updatedAt || new Date().toISOString(),
  };
};

/**
 * Login Mutation
 * 
 * @example
 * const loginMutation = useLoginMutation();
 * 
 * loginMutation.mutate(
 *   { email: 'user@example.com', password: 'pass' },
 *   {
 *     onSuccess: (data) => console.log('Logged in:', data),
 *     onError: (error) => console.error('Login failed:', error),
 *   }
 * );
 */
export const useLoginMutation = () => {
  const queryClient = useQueryClient();
  const setUser = useSetAtom(userAtom);

  return useMutation({
    mutationFn: (data: LoginRequest) => authService.login(data),
    onSuccess: (response: LoginResponse) => {
      if (response.success && response.data) {
        const {tokens, user: apiUser} = response.data;
        
        // Store tokens and expiry if available
        if (tokens?.accessToken) {
          storeAuthTokens(
            tokens.accessToken,
            tokens.refreshToken || undefined,
            tokens.expiresIn || undefined
          );
        }
        
        // Update user state if available
        const user = mapApiUserToUser(apiUser);
        if (user) {
          setUser(user);
        }
        
        // Invalidate and refetch user queries
        queryClient.invalidateQueries({queryKey: queryKeys.auth.user});
      }
    },
    onError: (error: any) => {
      console.error('Login error:', error);
    },
  });
};

/**
 * Register Mutation
 * 
 * @example
 * const registerMutation = useRegisterMutation();
 * 
 * registerMutation.mutate(
 *   { email: 'user@example.com', password: 'pass', name: 'John' },
 *   {
 *     onSuccess: () => console.log('Registered!'),
 *   }
 * );
 */
export const useRegisterMutation = () => {
  const queryClient = useQueryClient();
  const setUser = useSetAtom(userAtom);

  return useMutation({
    mutationFn: (data: RegisterRequest) => authService.register(data),
    onSuccess: (response: RegisterResponse) => {
      if (response.success && response.data) {
        const {tokens, user: apiUser} = response.data;
        
        // Store tokens and expiry if available
        if (tokens?.accessToken) {
          storeAuthTokens(
            tokens.accessToken,
            tokens.refreshToken || undefined,
            tokens.expiresIn || undefined
          );
        }
        
        // Update user state if available
        const user = mapApiUserToUser(apiUser);
        if (user) {
          setUser(user);
        }
        
        // Invalidate queries
        queryClient.invalidateQueries({queryKey: queryKeys.auth.user});
      }
    },
  });
};

/**
 * Logout Mutation
 * 
 * @example
 * const logoutMutation = useLogoutMutation();
 * logoutMutation.mutate();
 */
export const useLogoutMutation = () => {
  const queryClient = useQueryClient();
  const setUser = useSetAtom(userAtom);
  const setAuthToken = useSetAtom(authTokenAtom);
  const setRefreshToken = useSetAtom(refreshTokenAtom);
  const setTokenExpiry = useSetAtom(tokenExpiryAtom);
  const setIsAuthenticated = useSetAtom(isAuthenticatedAtom);

  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      // Clear Jotai state
      setUser(null);
      setAuthToken(null);
      setRefreshToken(null);
      setTokenExpiry(null);
      setIsAuthenticated(false);
      
      // Clear axios token
      setAxiosAuthToken(null);
      
      // Clear all queries
      queryClient.clear();
    },
  });
};

/**
 * Email Verification Mutation
 * 
 * @example
 * const verifyEmailMutation = useVerifyEmailMutation();
 * 
 * verifyEmailMutation.mutate(
 *   { email: 'user@example.com' },
 *   {
 *     onSuccess: (data) => console.log(data.message),
 *   }
 * );
 */
export const useVerifyEmailMutation = () => {
  return useMutation({
    mutationFn: (data: VerifyEmailRequest) => authService.verifyEmail(data),
  });
};

/**
 * Forgot Password Mutation (send forgot password email)
 */
export const useForgotPasswordMutation = () => {
  return useMutation({
    mutationFn: (data: {email: string}) => authService.sendForgotPasswordEmail(data),
  });
};

/**
 * Reset Password Mutation
 */
export const useResetPasswordMutation = () => {
  const queryClient = useQueryClient();
  const setUser = useSetAtom(userAtom);

  return useMutation({
    mutationFn: (data: {token: string; password: string}) =>
      authService.resetPassword(data),
    onSuccess: (response: ResetPasswordResponse) => {
      if (response.success && response.data) {
        const {tokens, user: apiUser} = response.data;
        
        // Store tokens and expiry if available
        if (tokens?.accessToken) {
          storeAuthTokens(
            tokens.accessToken,
            tokens.refreshToken || undefined,
            tokens.expiresIn || undefined
          );
        }
        
        // Update user state if available
        const user = mapApiUserToUser(apiUser);
        if (user) {
          setUser(user);
        }
        
        // Invalidate user queries
        queryClient.invalidateQueries({queryKey: queryKeys.auth.user});
      }
    },
  });
};

/**
 * Verify Email Code Mutation (confirm verification)
 */
export const useVerifyEmailCodeMutation = () => {
  const queryClient = useQueryClient();
  const setUser = useSetAtom(userAtom);

  return useMutation({
    mutationFn: (data: VerifyEmailCodeRequest) => authService.verifyEmailCode(data),
    onSuccess: (response) => {
      if (response.success && response.data) {
        const {tokens, user: apiUser} = response.data;
        
        // Store tokens and expiry if available
        if (tokens?.accessToken) {
          storeAuthTokens(
            tokens.accessToken,
            tokens.refreshToken || undefined,
            tokens.expiresIn || undefined
          );
        }
        
        // Update user state if available
        const user = mapApiUserToUser(apiUser);
        if (user) {
          setUser(user);
        }
        
        // Invalidate user queries
        queryClient.invalidateQueries({queryKey: queryKeys.auth.user});
      }
    },
    onError: (error: any) => {
      console.error('Verify email code error:', error);
    },
  });
};

/**
 * Set Password Mutation (for new users after email verification)
 * 
 * @example
 * const setPasswordMutation = useSetPasswordMutation();
 * 
 * setPasswordMutation.mutate(
 *   { password: 'NewPassword123!' },
 *   {
 *     onSuccess: (response) => console.log(response.message),
 *     onError: (error) => console.error('Failed:', error),
 *   }
 * );
 */
export const useSetPasswordMutation = () => {
  const queryClient = useQueryClient();
  const setUser = useSetAtom(userAtom);

  return useMutation({
    mutationFn: (data: SetPasswordRequest) => authService.setPassword(data),
    onSuccess: (response) => {
      if (response.success && response.data) {
        const {tokens, user: apiUser} = response.data;
        
        // Store tokens and expiry if available
        if (tokens?.accessToken) {
          storeAuthTokens(
            tokens.accessToken,
            tokens.refreshToken || undefined,
            tokens.expiresIn || undefined
          );
        }
        
        // Update user state if available
        const user = mapApiUserToUser(apiUser);
        if (user) {
          setUser(user);
        }
        
        // Invalidate user queries
        queryClient.invalidateQueries({queryKey: queryKeys.auth.user});
      }
    },
    onError: (error: any) => {
      console.error('Set password error:', error);
    },
  });
};

