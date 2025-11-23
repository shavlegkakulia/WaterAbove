import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import { Icon } from '@/components/ui/Icon';
import { useAtomValue, useSetAtom } from 'jotai';
import { userAtom } from '@/store/atoms';
import { colors, spacing } from '@/theme';
import { moderateScale } from '@/utils';
import { useNavigation } from '@react-navigation/native';
import { DrawerActions } from '@react-navigation/native';
import { env } from '@/config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  courseProgressAtom, 
  lessonNotesAtom 
} from '@/store/atoms/courseProgressAtoms';

export interface HeaderProps {
  /** Optional custom menu icon press handler */
  onMenuPress?: () => void;
  /** Optional custom profile photo press handler */
  onProfilePress?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onMenuPress,
  onProfilePress,
}) => {
  const navigation = useNavigation();
  const user = useAtomValue(userAtom);
  const setCourseProgress = useSetAtom(courseProgressAtom);
  const setLessonNotes = useSetAtom(lessonNotesAtom);
  
  const handleMenuPress = () => {
    if (onMenuPress) {
      onMenuPress();
    } else {
      navigation.dispatch(DrawerActions.openDrawer());
    }
  };

  const clearStorage = async () => {
    try {
      // Clear course progress
      setCourseProgress({});
      
      // Clear lesson notes
      setLessonNotes({});
      
      // Clear all AsyncStorage keys related to course progress
      await AsyncStorage.multiRemove([
        'course_progress',
        'lessonNotes',
      ]);
      
      Alert.alert('Success', 'Storage cleared successfully');
    } catch (error) {
      console.error('Error clearing storage:', error);
      Alert.alert('Error', 'Failed to clear storage');
    }
  };

  const handleProfilePress = () => {
    if (onProfilePress) {
      onProfilePress();
    } else {
      // Default: show alert to confirm storage clear
      Alert.alert(
        'Clear Storage',
        'Are you sure you want to clear all course progress and notes? This action cannot be undone.',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Clear',
            style: 'destructive',
            onPress: clearStorage,
          },
        ]
      );
    }
  };

  const avatar = user?.avatar
    ? { uri: `${env.HOST_URL}${user.avatar}` }
    : require('@/assets/images/avatar.png');

  return (
    <View style={styles.container}>
      {/* Menu Icon - Left */}
      <TouchableOpacity
        onPress={handleMenuPress}
        style={styles.menuButton}
        activeOpacity={0.7}
      >
        <Icon
          name="ChartNoAxesColumn"
          size={moderateScale(24)}
          color={colors.white}
          strokeWidth={2}
        />
      </TouchableOpacity>

      {/* Profile Photo - Right */}
      <TouchableOpacity
        onPress={handleProfilePress}
        style={styles.profileButton}
        activeOpacity={0.7}
      >
        <Image source={avatar} style={styles.profileImage} resizeMode="cover" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    backgroundColor: 'transparent',
  },
  menuButton: {
    padding: moderateScale(spacing.xs),
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileButton: {
    padding: moderateScale(spacing.xs),
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImage: {
    width: moderateScale(32),
    height: moderateScale(32),
    borderRadius: moderateScale(16),
    borderWidth: 2,
    borderColor: '#C7DBD6',
  },
});
