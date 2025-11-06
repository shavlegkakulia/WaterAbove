import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  ImageBackground,
  KeyboardAvoidingView,
  ViewStyle,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { spacing, KEYBOARD_AVOIDING_VIEW_BEHAVIOR } from '@/theme';
import bgImage from '@/assets/images/bgbg.png';

export interface AuthScreenWrapperProps {
  children: React.ReactNode;
  /** Whether to wrap content in KeyboardAvoidingView (for screens with inputs) */
  withKeyboardAvoiding?: boolean;
  /** Whether to wrap content in ScrollView (for scrollable content) */
  withScrollView?: boolean;
  /** Style for the content container */
  contentContainerStyle?: ViewStyle;
  /** Style for ScrollView content */
  scrollContentStyle?: ViewStyle;
  /** Whether to show vertical scroll indicator */
  showsVerticalScrollIndicator?: boolean;
}

export const AuthScreenWrapper: React.FC<AuthScreenWrapperProps> = ({
  children,
  withKeyboardAvoiding = true,
  withScrollView = true,
  contentContainerStyle,
  scrollContentStyle,
  showsVerticalScrollIndicator = false,
}) => {
  const insets = useSafeAreaInsets();

  const content = (
    <ImageBackground
      source={bgImage}
      style={styles.background}
      resizeMode="cover"
    >
      {withScrollView ? (
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            scrollContentStyle,
            {
              paddingTop: insets.top,
              paddingBottom: insets.bottom,
            },
          ]}
          showsVerticalScrollIndicator={showsVerticalScrollIndicator}
          keyboardShouldPersistTaps="handled"
        >
          <View style={[styles.container, contentContainerStyle]}>
            {children}
          </View>
        </ScrollView>
      ) : (
        <View
          style={[
            styles.container,
            contentContainerStyle,
            {
              paddingTop: insets.top,
              paddingBottom: insets.bottom,
            },
          ]}
        >
          {children}
        </View>
      )}
    </ImageBackground>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={[]}>
      {withKeyboardAvoiding ? (
        <KeyboardAvoidingView
          behavior={KEYBOARD_AVOIDING_VIEW_BEHAVIOR}
          style={styles.keyboardView}
        >
          {content}
        </KeyboardAvoidingView>
      ) : (
        content
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  background: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
  },
});
