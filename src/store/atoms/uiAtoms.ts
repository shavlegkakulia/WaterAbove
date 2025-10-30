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
export interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}

export const toastsAtom = atom<Toast[]>([]);

// Add toast action
export const addToastAtom = atom(
  null,
  (get, set, toast: Omit<Toast, 'id'>) => {
    const newToast: Toast = {
      ...toast,
      id: Date.now().toString(),
      duration: toast.duration || 3000,
    };
    set(toastsAtom, [...get(toastsAtom), newToast]);

    // Auto remove after duration
    if (newToast.duration) {
      setTimeout(() => {
        set(toastsAtom, get(toastsAtom).filter((t) => t.id !== newToast.id));
      }, newToast.duration);
    }
  }
);

// Remove toast action
export const removeToastAtom = atom(
  null,
  (get, set, toastId: string) => {
    set(toastsAtom, get(toastsAtom).filter((t) => t.id !== toastId));
  }
);

