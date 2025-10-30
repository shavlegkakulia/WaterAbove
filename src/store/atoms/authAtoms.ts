import {atom} from 'jotai';
import {atomWithStorage} from 'jotai/utils';

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
export const isLoadingAuthAtom = atom<boolean>(false);

// Persisted auth token
export const authTokenAtom = atomWithStorage<string | null>('auth_token', null);

// Derived atom - check if user is logged in
export const isLoggedInAtom = atom(
  (get) => get(isAuthenticatedAtom) && get(userAtom) !== null
);

// Email verification state
export const verificationEmailAtom = atom<string>('');
export const isVerifyingEmailAtom = atom<boolean>(false);
export const verificationErrorAtom = atom<string | null>(null);

