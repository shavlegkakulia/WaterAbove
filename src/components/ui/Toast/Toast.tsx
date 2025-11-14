import React, {useEffect} from 'react';
import {StyleSheet, Animated, TouchableOpacity} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useAtomValue, useSetAtom} from 'jotai';
import {toastsAtom, removeToastAtom} from '@/store/atoms';
import {colors, spacing, borderRadius, shadows} from '@/theme';
import {Text} from '@/components/ui/Typography';
import {Icon} from '@/components/ui/Icon';
import {selectPlatform} from '@/utils';

const ToastItem: React.FC<{
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
  sequenceDelay: number;
  onDismiss: (id: string) => void;
}> = ({id, type, message, duration = 3000, sequenceDelay, onDismiss}) => {
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(-50)).current;
  const dismissingRef = React.useRef(false);
  const initialDelayRef = React.useRef(sequenceDelay);
  const hasEnteredRef = React.useRef(false);

  useEffect(() => {
    const delay = initialDelayRef.current;
    const timer = setTimeout(() => {
      hasEnteredRef.current = true;
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }, delay);

    return () => clearTimeout(timer);
  }, [fadeAnim, slideAnim]);

  const handleDismiss = React.useCallback(() => {
    if (dismissingRef.current) {
      return;
    }
    dismissingRef.current = true;
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: -50,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onDismiss(id);
      dismissingRef.current = false;
    });
  }, [fadeAnim, slideAnim, id, onDismiss]);

  useEffect(() => {
    if (!duration) {
      return;
    }
    const delay = initialDelayRef.current + duration;
    const timer = setTimeout(() => {
      handleDismiss();
    }, delay);
    return () => clearTimeout(timer);
  }, [duration, handleDismiss]);

  const getToastStyle = () => {
    const baseStyle = {
      backgroundColor: colors.backgroundCard,
      borderLeftWidth: 4,
    };

    switch (type) {
      case 'success':
        return {
          ...baseStyle,
          borderLeftColor: colors.success,
        };
      case 'error':
        return {
          ...baseStyle,
          borderLeftColor: colors.error,
        };
      case 'warning':
        return {
          ...baseStyle,
          borderLeftColor: colors.warning,
        };
      case 'info':
        return {
          ...baseStyle,
          borderLeftColor: colors.info,
        };
      default:
        return baseStyle;
    }
  };

  const getIconName = (): 'CheckCircle' | 'XCircle' | 'AlertCircle' | 'Info' => {
    switch (type) {
      case 'success':
        return 'CheckCircle';
      case 'error':
        return 'XCircle';
      case 'warning':
        return 'AlertCircle'; // Using AlertCircle instead of AlertTriangle
      case 'info':
        return 'Info';
      default:
        return 'Info';
    }
  };

  return (
    <Animated.View
      style={[
        styles.toastContainer,
        {
          opacity: fadeAnim,
          transform: [{translateY: slideAnim}],
        },
      ]}>
      <TouchableOpacity
        style={[styles.toast, getToastStyle()]}
        activeOpacity={0.8}
        onPress={handleDismiss}>
        <Icon
          name={getIconName()}
          size={20}
          color={
            type === 'success'
              ? colors.success
              : type === 'error'
              ? colors.error
              : type === 'warning'
              ? colors.warning
              : colors.info
          }
        />
        <Text variant="body16Regular" style={styles.message}>
          {message}
        </Text>
        <TouchableOpacity onPress={handleDismiss} style={styles.closeButton}>
          <Icon name="X" size={16} color={colors.textSecondary} />
        </TouchableOpacity>
      </TouchableOpacity>
    </Animated.View>
  );
};

export const Toast: React.FC = () => {
  const toasts = useAtomValue(toastsAtom);
  const removeToast = useSetAtom(removeToastAtom);

  if (toasts.length === 0) {
    return null;
  }

  const orderedToasts = [...toasts].sort((a, b) => a.sequence - b.sequence);

  return (
    <SafeAreaView style={styles.container} edges={['top']} pointerEvents="box-none">
      {orderedToasts.map((toast) => (
        <ToastItem
          key={toast.id}
          id={toast.id}
          type={toast.type}
          message={toast.message}
          duration={toast.duration}
          sequenceDelay={toast.sequence * 500}
          onDismiss={removeToast}
        />
      ))}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 9999,
    paddingHorizontal: spacing.md,
    ...(selectPlatform({
      ios: {
        paddingTop: spacing.xs,
      },
      android: {
        paddingTop: spacing.sm,
      },
    }) ?? {}),
  },
  toastContainer: {
    marginBottom: spacing.sm,
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    ...shadows.md,
    minHeight: 48,
  },
  message: {
    flex: 1,
    marginLeft: spacing.sm,
    color: colors.textPrimary,
  },
  closeButton: {
    padding: spacing.xs,
    marginLeft: spacing.sm,
  },
});

