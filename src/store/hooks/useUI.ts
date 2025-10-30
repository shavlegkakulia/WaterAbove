import {useAtom, useAtomValue, useSetAtom} from 'jotai';
import {
  themeModeAtom,
  globalLoadingAtom,
  isModalOpenAtom,
  modalContentAtom,
  toastsAtom,
  addToastAtom,
  removeToastAtom,
} from '@/store/atoms';

export const useTheme = () => {
  const [themeMode, setThemeMode] = useAtom(themeModeAtom);

  const toggleTheme = () => {
    setThemeMode((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return {
    themeMode,
    setThemeMode,
    toggleTheme,
    isDark: themeMode === 'dark',
  };
};

export const useGlobalLoading = () => {
  const [isLoading, setIsLoading] = useAtom(globalLoadingAtom);
  
  return {
    isLoading,
    setIsLoading,
  };
};

export const useModal = () => {
  const [isOpen, setIsOpen] = useAtom(isModalOpenAtom);
  const [content, setContent] = useAtom(modalContentAtom);

  const openModal = (modalContent?: string) => {
    setContent(modalContent || null);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setContent(null);
  };

  return {
    isOpen,
    content,
    openModal,
    closeModal,
  };
};

export const useToast = () => {
  const toasts = useAtomValue(toastsAtom);
  const addToast = useSetAtom(addToastAtom);
  const removeToast = useSetAtom(removeToastAtom);

  const showSuccess = (message: string, duration?: number) => {
    addToast({type: 'success', message, duration});
  };

  const showError = (message: string, duration?: number) => {
    addToast({type: 'error', message, duration});
  };

  const showWarning = (message: string, duration?: number) => {
    addToast({type: 'warning', message, duration});
  };

  const showInfo = (message: string, duration?: number) => {
    addToast({type: 'info', message, duration});
  };

  return {
    toasts,
    addToast,
    removeToast,
    showSuccess,
    showError,
    showWarning,
    showInfo,
  };
};

