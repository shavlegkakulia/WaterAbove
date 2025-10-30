import {atom} from 'jotai';
import {atomWithStorage, createJSONStorage} from 'jotai/utils';
import AsyncStorage from '@react-native-async-storage/async-storage';

// User state
export interface User {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
}

// Auth state atoms
export const userAtom = atom<User | null>(null);
export const isAuthenticatedAtom = atom<boolean>(false);

// Persisted auth token (React Native AsyncStorage)
export const authTokenAtom = atomWithStorage<string | null>(
  'auth_token',
  null,
  createJSONStorage(() => AsyncStorage)
);

// Derived atom - check if user is logged in
export const isLoggedInAtom = atom(
  (get) => get(isAuthenticatedAtom) && get(userAtom) !== null
);

// Email verification state - stores the email that successfully requested verification
export const verificationEmailAtom = atom<string>('');

