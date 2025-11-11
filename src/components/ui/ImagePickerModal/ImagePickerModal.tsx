import React from 'react';
import {
  Modal,
  View,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import { colors, spacing } from '@/theme';
import { Text } from '@/components/ui/Typography';
import { Icon } from '@/components/ui/Icon';
import { moderateScale } from '@/utils';

export interface ImagePickerModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectPhotoLibrary: () => void | Promise<void>;
  onSelectTakePhoto: () => void | Promise<void>;
  onSelectChooseFile: () => void | Promise<void>;
  anchorPosition?: { x: number; y: number; width: number; height: number };
}

export const ImagePickerModal: React.FC<ImagePickerModalProps> = ({
  visible,
  onClose,
  onSelectPhotoLibrary,
  onSelectTakePhoto,
  onSelectChooseFile,
  anchorPosition,
}) => {
  const handleOptionPress = (callback: () => void | Promise<void>) => {
    // Close modal immediately
    onClose();
    
    // Use requestAnimationFrame to ensure modal closes before opening picker
    requestAnimationFrame(() => {
      setTimeout(() => {
        try {
          const result = callback();
          // Handle if callback returns a promise
          if (result instanceof Promise) {
            result.catch((error) => {
              console.error('ImagePickerModal callback error:', error);
            });
          }
        } catch (error) {
          console.error('ImagePickerModal callback error:', error);
        }
      }, 200);
    });
  };

  if (!visible) return null;

  const getMenuPosition = () => {
    if (anchorPosition) {
      const menuWidth = moderateScale(280);
      // Center menu relative to anchor (profile image)
      const left = anchorPosition.x + (anchorPosition.width / 2) - (menuWidth / 2);
      return {
        top: anchorPosition.y + anchorPosition.height + moderateScale(spacing.sm),
        left: Math.max(moderateScale(spacing.md), left), // Ensure minimum padding from screen edge
      };
    }
    return {};
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <View
            style={[
              styles.menuContainer,
              anchorPosition && getMenuPosition(),
            ]}
            onStartShouldSetResponder={() => true}
          >
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => handleOptionPress(onSelectPhotoLibrary)}
            >
              <Text variant="body16Regular" color="textDark" style={styles.menuItemText}>
                Photo Library
              </Text>
              <Icon name="Image" size={20} color={colors.textDark} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => handleOptionPress(onSelectTakePhoto)}
            >
              <Text variant="body16Regular" color="textDark" style={styles.menuItemText}>
                Take Photo
              </Text>
              <Icon name="Camera" size={20} color={colors.textDark} />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.menuItem, styles.menuItemLast]}
              onPress={() => handleOptionPress(onSelectChooseFile)}
            >
              <Text variant="body16Regular" color="textDark" style={styles.menuItemText}>
                Choose File
              </Text>
              <Icon name="Folder" size={20} color={colors.textDark} />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  menuContainer: {
    backgroundColor: colors.white,
    borderRadius: moderateScale(24),
    width: moderateScale(280),
    flexShrink: 0,
    paddingVertical: moderateScale(spacing.xs),
    position: 'absolute',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    alignSelf: 'flex-start',
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: moderateScale(spacing.lg),
    paddingVertical: moderateScale(spacing.md),
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.gray200,
  },
  menuItemLast: {
    borderBottomWidth: 0,
  },
  menuItemText: {
    flex: 1,
    marginRight: moderateScale(spacing.sm),
  },
});

