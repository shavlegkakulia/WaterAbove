import React, { useState } from 'react';
import {
  Modal,
  View,
  StyleSheet,
  ScrollView,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { borderRadius, colors, spacing } from '@/theme';
import { Text } from '@/components/ui/Typography';
import { Button } from '@/components/ui/Button';
import { moderateScale } from '@/utils';
import { BlurView } from '@react-native-community/blur';

export interface TermsModalProps {
  visible: boolean;
  onClose: () => void;
  onAgree: () => void;
}

const TERMS_TEXT = `The Service is not available to any Users previously removed from the Service by TemplatesSite. You may be required to register with us in order to access and use certain features of the Service. If you choose to register for the Service, you agree to provide and maintain true, accurate, and current information as prompted by the Service's registration form. Registration data and certain other information about you are governed by our Privacy Policy. If you are under 16 years old, you The end.The Service is not available to any Users previously removed from the Service by TemplatesSite. You may be required to register with us in order to access and use certain features of the Service. If you choose to register for the Service, you agree to provide and maintain true, accurate, and current information as prompted by the Service's registration form. Registration data and certain other information about you are governed by our Privacy Policy. If you are under 16 years old, you The end.The Service is not available to any Users previously removed from the Service by TemplatesSite. You may be required to register with us in order to access and use certain features of the Service. If you choose to register for the Service, you agree to provide and maintain true, accurate, and current information as prompted by the Service's registration form. Registration data and certain other information about you are governed by our Privacy Policy. If you are under 16 years old, you The end.`;
const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export const TermsModal: React.FC<TermsModalProps> = ({
  visible,
  onClose,
  onAgree,
}) => {
  const [isScrolledToBottom, setIsScrolledToBottom] = useState(false);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    const paddingToBottom = 20;
    const isAtBottom =
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom;

    if (isAtBottom && !isScrolledToBottom) {
      setIsScrolledToBottom(true);
    }
  };

  const handleAgree = () => {
    setIsScrolledToBottom(false);
    onAgree();
  };

  const handleClose = () => {
    setIsScrolledToBottom(false);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity
          activeOpacity={1}
          style={styles.overlayTouchable}
          onPress={handleClose}
        />
        <View style={styles.modalContainer}>
          <BlurView
            blurAmount={50}
            blurType="dark"
            blurRadius={10}
            reducedTransparencyFallbackColor={colors.backgroundCard}
            style={styles.blurView}
          />
          {/* Header */}
          <View style={styles.header}>
            <Text variant="body16Bold" color="textPrimary" style={styles.title}>
              Terms & Conditions
            </Text>
            <Text color="textPrimary" style={styles.subtitle}>
              Scroll to Bottom to Accept
            </Text>
          </View>

          {/* Scrollable Content */}
          <View style={styles.scrollViewContainer}>
            <ScrollView
              style={styles.scrollView}
              contentContainerStyle={styles.scrollContent}
              onScroll={handleScroll}
              scrollEventThrottle={16}
              showsVerticalScrollIndicator
            >
              <Text
                variant="paragraph14Regular"
                color="textPrimary"
                style={styles.termsText}
              >
                {TERMS_TEXT}
              </Text>
            </ScrollView>
          </View>

          {/* Action Button */}
          <View style={styles.buttonContainer}>
            <Button
              title="Agree and Continue"
              variant="primary"
              size="medium"
              disabled={!isScrolledToBottom}
              onPress={handleAgree}
              containerStyle={styles.button}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: moderateScale(spacing.md),
    position: 'relative',
  },
  overlayTouchable: {
    ...StyleSheet.absoluteFillObject,
  },
  modalContainer: {
    width: '100%',
    maxWidth: moderateScale(500),
    height: SCREEN_HEIGHT * 0.85,
    maxHeight: SCREEN_HEIGHT * 0.85,
  },
  header: {
    paddingHorizontal: moderateScale(spacing.lg),
    paddingTop: moderateScale(spacing.xl),
    paddingBottom: moderateScale(spacing.md),
    alignItems: 'center',
    flexShrink: 0,
  },
  title: {
    marginBottom: moderateScale(spacing.sm),
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: 'Helvetica',
    fontSize: moderateScale(10),
    fontWeight: '400',
    lineHeight: moderateScale(14),
    textAlign: 'center',
  },
  scrollViewContainer: {
    flex: 1,
    minHeight: 0,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: moderateScale(spacing.lg),
    paddingTop: moderateScale(spacing.md),
    paddingBottom: moderateScale(spacing.lg),
  },
  termsText: {
    lineHeight: moderateScale(22),
    color: colors.textPrimary,
  },
  buttonContainer: {
    paddingHorizontal: moderateScale(spacing.lg),
    paddingVertical: moderateScale(spacing.md),
    borderTopWidth: 1,
    borderTopColor: colors.whiteOverlay4,
    flexShrink: 0,
  },
  button: {
    width: '100%',
  },
  blurView: {
    height: SCREEN_HEIGHT * 0.85,
    maxHeight: SCREEN_HEIGHT * 0.85,
    width: '100%',
    borderRadius: borderRadius.xxl,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    flexDirection: 'column',
    position: 'absolute',
  },
});
