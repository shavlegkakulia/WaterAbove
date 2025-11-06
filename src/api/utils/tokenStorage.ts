import {getDefaultStore} from 'jotai';
import {authTokenAtom, refreshTokenAtom, tokenExpiryAtom, isAuthenticatedAtom} from '@/store/atoms';
import {setAuthToken as setAxiosAuthToken} from '../client';

/**
 * Store authentication tokens and expiry
 * 
 * @param token - Access token
 * @param refreshToken - Refresh token (optional)
 * @param expiresIn - Token expiration time in seconds (optional, defaults to 900 = 15 minutes)
 */
export const storeAuthTokens = (
  token: string,
  refreshToken?: string,
  expiresIn?: number
): void => {
  const store = getDefaultStore();
  
  // Calculate expiry timestamp: current time + expiresIn seconds
  const now = Date.now();
  const expiresInSeconds = expiresIn || 900; // Default to 15 minutes if not provided
  const expiry = now + (expiresInSeconds * 1000);
  
  // Update Jotai state
  store.set(authTokenAtom, token);
  if (refreshToken) {
    store.set(refreshTokenAtom, refreshToken);
  }
  store.set(tokenExpiryAtom, expiry);
  store.set(isAuthenticatedAtom, true);
  
  // Set axios token
  setAxiosAuthToken(token);
};

/**
 * Clear authentication tokens and expiry
 */
export const clearAuthTokens = (): void => {
  const store = getDefaultStore();
  
  // Clear Jotai state
  store.set(authTokenAtom, null);
  store.set(refreshTokenAtom, null);
  store.set(tokenExpiryAtom, null);
  store.set(isAuthenticatedAtom, false);
  
  // Clear axios token
  setAxiosAuthToken(null);
};

