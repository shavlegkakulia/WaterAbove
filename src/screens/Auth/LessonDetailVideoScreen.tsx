import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { Icon } from '@/components/ui/Icon';
import {
  Text,
  Header,
  BackButton,
  PrimaryActionButton,
} from '@/components';
import { AuthScreenWrapper } from '@/components/AuthScreenWrapper';
import { colors, spacing } from '@/theme';
import { moderateScale } from '@/utils';
import { RootStackParamList } from '@/navigation/types';

export const LessonDetailVideoScreen: React.FC = () => {
  const navigation = useNavigation<DrawerNavigationProp<RootStackParamList, 'LessonDetailVideo'>>();

  const handleGoBack = () => {
    // Navigate to CourseDetail screen
    navigation.navigate('CourseDetail', {});
  };

  return (
    <AuthScreenWrapper withScrollView={false} bgColor={colors.backgroundDark}>
      <Header />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View>
          {/* Header Section */}
          <View style={styles.headerSection}>
            <View style={styles.headerTop}>
              <BackButton onPress={handleGoBack} />
              <Text
                variant="heading20Bold"
                color="success"
                style={styles.courseTitle}
              >
                9-Week Accelerator
              </Text>
              <Text
                variant="paragraph14Bold"
                color="textWhiteWA"
                style={styles.subtitle}
              >
                Discover Your Story
              </Text>
            </View>
          </View>
          <View style={styles.videoContainer}>
            <Image
              source={require('@/assets/images/videoTemplate.png')}
              style={styles.videoImage}
            />
          </View>
          <View style={styles.videoDescriptionContainer}>
            <Text variant="paragraph14Bold" color="textWhiteWA">
              {
                'Please watch this entire video ⬆ and complete Accountability Tasks. \n\nThe Accountability Tasks can be found in the ➡️ next lecture ➡️'
              }
            </Text>
          </View>
        </View>

        <PrimaryActionButton
          title="Start Accountability Task"
          rightIcon="ChevronRight"
          iconSize={20}
          containerStyle={styles.buttonContainer}
        />
      </ScrollView>
    </AuthScreenWrapper>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    width: '100%',
  },
  scrollContent: {
    paddingBottom: moderateScale(spacing.md),
    minHeight: '100%',
    justifyContent: 'space-between',
  },
  headerSection: {
    paddingTop: moderateScale(spacing.md),
    paddingBottom: moderateScale(24),
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  courseTitle: {
    flex: 1,
  },
  subtitle: {
    position: 'absolute',
    bottom: -moderateScale(10),
    left: 57,
    marginTop: moderateScale(spacing.xs),
  },
  videoContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: moderateScale(39),
  },
  videoImage: {
    width: '100%',
    height: 205,
    resizeMode: 'contain',
    objectFit: 'contain',
  },
  videoDescriptionContainer: {
    marginBottom: moderateScale(spacing.xl),
  },
  buttonContainer: {
    marginBottom: moderateScale(spacing.xl),
  },
});

export default LessonDetailVideoScreen;
