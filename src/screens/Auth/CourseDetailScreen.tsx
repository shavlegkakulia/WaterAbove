import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { BlurView } from '@react-native-community/blur';
import { Icon } from '@/components/ui/Icon';
import {
  Text,
  Header,
  CircularProgressBar,
  CompletedCircle,
  BackButton,
} from '@/components';
import { AuthScreenWrapper } from '@/components/AuthScreenWrapper';
import { colors, spacing, borderRadius } from '@/theme';
import { moderateScale, isIOS } from '@/utils';
import { RootStackParamList } from '@/navigation/types';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import type { Lesson } from '@/types/lesson';


export const CourseDetailScreen: React.FC = () => {
  const navigation = useNavigation<DrawerNavigationProp<RootStackParamList, 'CourseDetail'>>();
  const route = useRoute<RouteProp<RootStackParamList, 'CourseDetail'>>();
  const { progress = 75 } =
    route.params || {};

  const lessons: Lesson[] = [
    {
      id: '1',
      type: 'lesson',
      title: 'Lesson 1',
      subtitle: 'Numerology Blueprint',
      duration: '23:00',
      completed: true,
      time: '23:00',
    },
    {
      id: '2',
      type: 'accountability',
      title: 'Accountability Task',
      subtitle: 'Numerology Blueprint',
      completed: true,
    },
    {
      id: '3',
      type: 'lesson',
      title: 'Lesson 2',
      subtitle: 'Numerology Blueprint',
      duration: '23:00',
      completed: true,
      time: '23:00',
    },
    {
      id: '4',
      type: 'accountability',
      title: 'Accountability Task',
      subtitle: 'Numerology Blueprint',
      completed: true,
    },
    {
      id: '5',
      type: 'lesson',
      title: 'Lesson 1',
      subtitle: 'Numerology Blueprint',
      duration: '23:00',
      completed: false,
      locked: false,
    },
    {
      id: '6',
      type: 'lesson',
      title: 'Lesson 3',
      subtitle: 'Numerology Blueprint',
      duration: '23:00',
      completed: false,
      locked: true,
    },
  ];

  return (
    <AuthScreenWrapper withScrollView={false} bgColor={colors.backgroundDark}>
      <Header />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <View style={styles.headerSection}>
          <View style={styles.headerTop}>
            <BackButton />
            <Text
              variant="heading20Bold"
              color="success"
              style={styles.courseTitle}
            >
              9-Week Accelerator
            </Text>
          </View>

          <View style={styles.statusRow}>
            <Text variant="heading20Bold" color="success">
              Lessons
            </Text>
            <Text variant="body16Regular" color="warning">
              In-Progress
            </Text>
          </View>

          {/* Progress Circle */}
          <View style={styles.progressContainer}>
            <CircularProgressBar
              progress={progress}
              size={moderateScale(123)}
              strokeWidth={moderateScale(12)}
              gradientColors={[
                { color: '#37B8CD', offset: '24.99%' },
                { color: '#46C2A3', offset: '47.02%' },
              ]}
              gradientAngle={36}
              unfilledColor={colors.gray700}
              textColor={colors.white}
              textPosition="inside"
              insideText={`${progress}%`}
              textStyle={styles.progressText}
            />
          </View>
        </View>

        {/* Lessons List */}
        <View>
          <TouchableOpacity style={styles.sectionHeader}>
            <View style={styles.sectionHeaderContent}>
              <Text
                variant="heading20Bold"
                color="success"
                style={styles.sectionTitle}
              >
                The Observer
              </Text>
              <Icon
                name="ChevronUp"
                size={moderateScale(20)}
                color={colors.success}
              />
            </View>
            <Text variant="body16Regular" color="success">
              23:39
            </Text>
          </TouchableOpacity>

          <View style={styles.timelineContainer}>
            {lessons.map(lesson => (
              <View key={lesson.id} style={[styles.lessonItem, lesson.locked && styles.lessonItemLocked]}>
                {lesson.locked && isIOS ? (
                  <BlurView
                    style={styles.blurOverlay}
                    blurType="dark"
                    blurAmount={1}
                  />
                ) : lesson.locked ? (
                  <View style={styles.blurOverlayAndroid} />
                ) : null}
                <TouchableOpacity
                  style={[
                    styles.lessonCard,
                    lesson.locked && styles.lessonCardLocked,
                  ]}
                  disabled={lesson.locked}
                  onPress={() => {
                    if (!lesson.locked && lesson.type === 'lesson') {
                      navigation.navigate('LessonDetailVideo', {
                        lessonId: lesson.id,
                        lessonTitle: lesson.title,
                      });
                    }
                  }}
                >
                  <View style={styles.lessonCardContent}>
                    <View style={styles.lessonCardHeader}>
                      <Text variant="body16Regular" color="textWhiteWA">
                        {lesson.title}
                      </Text>
                      {lesson.completed && (
                        <CompletedCircle
                          width={16}
                          height={16}
                          borderColor={colors.success}
                          borderWidth={2}
                          strokeWidth={5}
                          strokeColor={colors.success}
                          iconSize={8}
                        />
                      )}
                      {lesson.duration && (
                        <Text variant="paragraph14Bold" color="textWhiteWA">
                          {lesson.duration}
                        </Text>
                      )}
                    </View>
                    <Text variant="body16Regular" color="textWhiteWA">
                      {lesson.subtitle}
                    </Text>
                  </View>
                </TouchableOpacity>
                {lesson.locked && (
                  <View style={styles.lessonLockedIcon}>
                    <Icon
                      name="Lock"
                      size={moderateScale(24)}
                      color={colors.textWhiteWA}
                    />
                  </View>
                )}
              </View>
            ))}
          </View>
        </View>
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
    paddingBottom: moderateScale(spacing.xl),
  },
  headerSection: {
    paddingTop: moderateScale(spacing.md),
    paddingBottom: moderateScale(56),
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: moderateScale(14),
  },
  courseTitle: {
    flex: 1,
  },
  statusRow: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: moderateScale(spacing.xs),
    marginBottom: moderateScale(spacing.md),
  },
  progressContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressText: {
    fontSize: moderateScale(35),
    fontWeight: '700',
    lineHeight: moderateScale(42),
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: moderateScale(13),
    gap: moderateScale(spacing.sm),
  },
  sectionHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: moderateScale(spacing.sm),
  },
  sectionTitle: {
    fontSize: moderateScale(18),
  },
  timelineContainer: {
    position: 'relative',
  },
  lessonItem: {
    flexDirection: 'row',
    marginBottom: moderateScale(spacing.sm),
    position: 'relative',
    paddingHorizontal: moderateScale(spacing.lg),
    paddingVertical: moderateScale(spacing.md),
    backgroundColor: colors.backgroundLessonItem,
    borderRadius: moderateScale(borderRadius.xl),
    overflow: 'hidden',
  },
  lessonCard: {
    flex: 1,
  },
  lessonCardLocked: {
    opacity: 0.2,
  },
  lessonCardContent: {
    position: 'relative',
  },
  lessonCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: moderateScale(spacing.sm),
    marginBottom: moderateScale(spacing.xs),
  },
  lessonLockedIcon: {
    position: 'absolute',
    right: moderateScale(spacing.xl),
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    top: 16,
    zIndex: 2,
  },
  blurOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: moderateScale(borderRadius.xl),
    zIndex: 1,
  },
  blurOverlayAndroid: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: moderateScale(borderRadius.xl),
    zIndex: 1,
  },
  lessonItemLocked: {
    backgroundColor: colors.backgroundLessonItemLocked,
  },
});

export default CourseDetailScreen;
