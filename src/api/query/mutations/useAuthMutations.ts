import {useMutation, useQueryClient} from '@tanstack/react-query';
import {useSetAtom} from 'jotai';
import {authService, setAuthToken as setAxiosAuthToken} from '@/api';
import {queryKeys} from '../queryClient';
import {
  userAtom,
  isAuthenticatedAtom,
  authTokenAtom,
} from '@/store/atoms';
import type {
  LoginRequest,
  RegisterRequest,
  VerifyEmailRequest,
  VerifyEmailCodeRequest,
} from '@/api/types';

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
  const setAuthToken = useSetAtom(authTokenAtom);
  const setIsAuthenticated = useSetAtom(isAuthenticatedAtom);

  return useMutation({
    mutationFn: (data: LoginRequest) => authService.login(data),
    onSuccess: (response) => {
      // Update Jotai state
      setUser(response.user);
      setAuthToken(response.token);
      setIsAuthenticated(true);
      
      // Set axios token
      setAxiosAuthToken(response.token);
      
      // Invalidate and refetch user queries
      queryClient.invalidateQueries({queryKey: queryKeys.auth.user});
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
  const setAuthToken = useSetAtom(authTokenAtom);
  const setIsAuthenticated = useSetAtom(isAuthenticatedAtom);

  return useMutation({
    mutationFn: (data: RegisterRequest) => authService.register(data),
    onSuccess: (response) => {
      // Update Jotai state
      setUser(response.user);
      setAuthToken(response.token);
      setIsAuthenticated(true);
      
      // Set axios token
      setAxiosAuthToken(response.token);
      
      // Invalidate queries
      queryClient.invalidateQueries({queryKey: queryKeys.auth.user});
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
  const setIsAuthenticated = useSetAtom(isAuthenticatedAtom);

  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      // Clear Jotai state
      setUser(null);
      setAuthToken(null);
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
 * Forgot Password Mutation
 */
export const useForgotPasswordMutation = () => {
  return useMutation({
    mutationFn: (data: {email: string}) => authService.forgotPassword(data),
  });
};

/**
 * Reset Password Mutation
 */
export const useResetPasswordMutation = () => {
  return useMutation({
    mutationFn: (data: {code: string; newPassword: string}) =>
      authService.resetPassword(data),
  });
};

/**
 * Verify Email Code Mutation (confirm verification)
 */
export const useVerifyEmailCodeMutation = () => {
  return useMutation({
    mutationFn: (data: VerifyEmailCodeRequest) => authService.verifyEmailCode(data),
  });
};

