import {useAtom, useAtomValue} from 'jotai';
import {
  userAtom,
  isAuthenticatedAtom,
  isLoadingAuthAtom,
  authTokenAtom,
  isLoggedInAtom,
  verificationEmailAtom,
  isVerifyingEmailAtom,
  verificationErrorAtom,
} from '@/store/atoms';
import {authService} from '@/api';

export const useAuth = () => {
  const [user, setUser] = useAtom(userAtom);
  const [isAuthenticated, setIsAuthenticated] = useAtom(isAuthenticatedAtom);
  const [isLoading, setIsLoading] = useAtom(isLoadingAuthAtom);
  const [authToken, setAuthToken] = useAtom(authTokenAtom);
  const isLoggedIn = useAtomValue(isLoggedInAtom);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await authService.login({email, password});
      
      // Update state
      setUser(response.user);
      setAuthToken(response.token); // Jotai atom (persisted)
      setAuthToken(response.token); // Axios client
      setIsAuthenticated(true);
      
      return {success: true};
    } catch (error: any) {
      console.error('Login error:', error);
      const errorMessage = error.response?.data?.message || 'Login failed';
      return {success: false, error: errorMessage};
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear state
      setUser(null);
      setAuthToken(null); // Jotai atom (persisted)
      setAuthToken(null); // Axios client
      setIsAuthenticated(false);
    }
  };

  const register = async (email: string, password: string, name?: string) => {
    setIsLoading(true);
    try {
      const response = await authService.register({email, password, name});
      
      // Update state
      setUser(response.user);
      setAuthToken(response.token); // Jotai atom (persisted)
      setAuthToken(response.token); // Axios client
      setIsAuthenticated(true);
      
      return {success: true};
    } catch (error: any) {
      console.error('Register error:', error);
      const errorMessage = error.response?.data?.message || 'Registration failed';
      return {success: false, error: errorMessage};
    } finally {
      setIsLoading(false);
    }
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    authToken,
    isLoggedIn,
    login,
    logout,
    register,
  };
};

export const useEmailVerification = () => {
  const [email, setEmail] = useAtom(verificationEmailAtom);
  const [isVerifying, setIsVerifying] = useAtom(isVerifyingEmailAtom);
  const [error, setError] = useAtom(verificationErrorAtom);

  const verifyEmail = async (emailToVerify: string) => {
    setIsVerifying(true);
    setError(null);
    
    try {
      const response = await authService.verifyEmail({email: emailToVerify});
      
      setEmail(emailToVerify);
      return {success: true, message: response.message};
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Email verification failed';
      setError(errorMessage);
      return {success: false, error: errorMessage};
    } finally {
      setIsVerifying(false);
    }
  };

  const resetVerification = () => {
    setEmail('');
    setError(null);
    setIsVerifying(false);
  };

  return {
    email,
    isVerifying,
    error,
    verifyEmail,
    resetVerification,
  };
};

