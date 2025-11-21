import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Icon } from '@/components/ui/Icon';
import { useAtomValue } from 'jotai';
import { userAtom } from '@/store/atoms';
import { colors, spacing } from '@/theme';
import { moderateScale } from '@/utils';
import { useNavigation } from '@react-navigation/native';
import { DrawerActions } from '@react-navigation/native';
import { env } from '@/config';

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
  console.log(user);
  const handleMenuPress = () => {
    if (onMenuPress) {
      onMenuPress();
    } else {
      navigation.dispatch(DrawerActions.openDrawer());
    }
  };

  const handleProfilePress = () => {
    if (onProfilePress) {
      onProfilePress();
    } else {
      // Default: open drawer on profile press too
      navigation.dispatch(DrawerActions.openDrawer());
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
