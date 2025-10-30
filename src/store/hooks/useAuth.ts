import {useAtom, useAtomValue} from 'jotai';
import {
  userAtom,
  isAuthenticatedAtom,
  authTokenAtom,
  isLoggedInAtom,
  verificationEmailAtom,
} from '@/store/atoms';
import {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useVerifyEmailMutation,
} from '@/api/query';
// setAxiosAuthToken used in mutation files, not needed here directly

/**
 * Authentication Hook
 * 
 * Combines React Query mutations with Jotai state management
 * 
 * @example
 * const {user, isAuthenticated, login, logout, register} = useAuth();
 * 
 * // Login
 * const loginResult = await login('user@example.com', 'password');
 * if (loginResult.success) {
 *   console.log('Logged in!');
 * } else {
 *   console.error(loginResult.error);
 * }
 */
export const useAuth = () => {
  const [user] = useAtom(userAtom);
  const isAuthenticated = useAtomValue(isAuthenticatedAtom);
  const [authToken] = useAtom(authTokenAtom);
  const isLoggedIn = useAtomValue(isLoggedInAtom);
  // Note: this hook exposes auth actions; internal setter not needed here now
  
  // React Query mutations
  const loginMutation = useLoginMutation();
  const registerMutation = useRegisterMutation();
  const logoutMutation = useLogoutMutation();
  
  // Wrapper functions for backward compatibility
  const login = async (email: string, password: string) => {
    try {
      await loginMutation.mutateAsync({email, password});
      return {success: true};
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Login failed';
      return {success: false, error: errorMessage};
    }
  };

  const logout = async () => {
    try {
      await logoutMutation.mutateAsync();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const register = async (email: string, password: string, name?: string) => {
    try {
      await registerMutation.mutateAsync({email, password, name});
      return {success: true};
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Registration failed';
      return {success: false, error: errorMessage};
    }
  };


  // Get loading state from active mutation
  const isLoading = loginMutation.isPending || registerMutation.isPending || logoutMutation.isPending;

  return {
    user,
    isAuthenticated,
    isLoading,
    authToken,
    isLoggedIn,
    login,
    logout,
    register,
    // Expose mutations for advanced usage
    loginMutation,
    registerMutation,
    logoutMutation,
  };
};

/**
 * Email Verification Hook
 * 
 * Combines React Query mutation with Jotai state management
 * 
 * @example
 * const {email, isVerifying, error, verifyEmail, resetVerification} = useEmailVerification();
 * 
 * const result = await verifyEmail('user@example.com');
 * if (result.success) {
 *   console.log('Verification email sent');
 * }
 */
export const useEmailVerification = () => {
  const [email, setEmail] = useAtom(verificationEmailAtom);
  
  // React Query mutation
  const verifyEmailMutation = useVerifyEmailMutation();
  
  const verifyEmail = async (emailToVerify: string) => {
    try {
      const response = await verifyEmailMutation.mutateAsync({email: emailToVerify});

      // Special case: server returns success with error "User already verified"
      const alreadyVerified =
        response.success === true &&
        (response.error === 'User already verified' || (response.data as any)?.user?.isVerified === true);

      if (response.success && !alreadyVerified) {
        setEmail(emailToVerify);
        return {success: true};
      }

      if (alreadyVerified) {
        const user = (response.data as any)?.user;
        return {success: true, alreadyVerified: true, user};
      }

      const serverError = response.error || 'Email verification failed';
      return {success: false, error: serverError};
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || err.message || 'Email verification failed';
      return {success: false, error: errorMessage};
    }
  };

  const resetVerification = () => {
    setEmail('');
  };

  // Use mutation's loading and error states instead of manual Jotai atoms
  return {
    email,
    isVerifying: verifyEmailMutation.isPending,
    error: verifyEmailMutation.error?.message || null,
    verifyEmail,
    resetVerification,
    // Expose mutation for advanced usage
    verifyEmailMutation,
  };
};

