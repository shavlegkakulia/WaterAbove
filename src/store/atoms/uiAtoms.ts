import {atom} from 'jotai';

// Theme
export type ThemeMode = 'light' | 'dark';
export const themeModeAtom = atom<ThemeMode>('dark');

// Loading states
export const globalLoadingAtom = atom<boolean>(false);

// Modal/Dialog states
export const isModalOpenAtom = atom<boolean>(false);
export const modalContentAtom = atom<string | null>(null);

// Toast/Notification
let toastSequenceCounter = 0;

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
  sequence: number;
  createdAt: number;
}

export const toastsAtom = atom<Toast[]>([]);

// Add toast action
export const addToastAtom = atom(
  null,
  (get, set, toast: Omit<Toast, 'id'>) => {
    const sequence = toastSequenceCounter++;
    const newToast: Toast = {
      ...toast,
      id: `${Date.now()}-${sequence}`,
      duration: toast.duration || 3000,
      sequence,
      createdAt: Date.now(),
    };
    set(toastsAtom, [...get(toastsAtom), newToast]);
  }
);

// Remove toast action
export const removeToastAtom = atom(
  null,
  (get, set, toastId: string) => {
    set(toastsAtom, get(toastsAtom).filter((t) => t.id !== toastId));
  }
);

