import React, { useMemo } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { BlurView } from '@react-native-community/blur';
import { useAtomValue } from 'jotai';
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
import { getCourseById } from '@/data/courses';
import type { Lesson } from '@/types/lesson';
import { 
  isLessonWatchedAtom,
  getWatchedLessonsCountAtom,
  isCourseCompletedAtom,
} from '@/store/atoms/courseProgressAtoms';

// Component for individual lesson item
const LessonItem: React.FC<{
  lesson: Lesson;
  courseId: string;
  navigation: DrawerNavigationProp<RootStackParamList, 'CourseDetail'>;
}> = ({ lesson, courseId, navigation }) => {
  const isLessonWatched = useAtomValue(useMemo(() => isLessonWatchedAtom(courseId, lesson.id), [courseId, lesson.id]));

  return (
    <View style={[styles.lessonItem, lesson.locked && styles.lessonItemLocked]}>
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
          if (!lesson.locked) {
            navigation.navigate('LessonDetailVideo', {
              lessonId: lesson.id,
              lessonTitle: lesson.title,
              courseId: courseId,
            });
          }
        }}
      >
        <View style={styles.lessonCardContent}>
          <View style={styles.lessonCardHeader}>
            <Text variant="body16Regular" color="textWhiteWA">
              {lesson.title}
            </Text>
            {isLessonWatched && (
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
  );
};

export const CourseDetailScreen: React.FC = () => {
  const navigation = useNavigation<DrawerNavigationProp<RootStackParamList, 'CourseDetail'>>();
  const route = useRoute<RouteProp<RootStackParamList, 'CourseDetail'>>();
  const { courseId = '1' } = route.params || {};

  // Load course from mock data
  const course = useMemo(() => getCourseById(courseId), [courseId]);
  const lessons = course?.lessons || [];
  const courseTitle = course?.title || 'Course';
  const totalLessons = lessons.length;

  // Get progress from Jotai state
  const watchedCount = useAtomValue(useMemo(() => getWatchedLessonsCountAtom(courseId), [courseId]));
  const progress = totalLessons > 0 
    ? Math.round((watchedCount / totalLessons) * 100)
    : 0;
  const isCompleted = useAtomValue(useMemo(() => isCourseCompletedAtom(courseId, totalLessons), [courseId, totalLessons]));

  // Calculate total duration in a better format
  const totalDurationMinutes = lessons
    .filter(l => l.duration)
    .reduce((total, lesson) => {
      const duration = lesson.duration?.split(':') || [];
      const minutes = parseInt(duration[0] || '0', 10);
      const seconds = parseInt(duration[1] || '0', 10);
      return total + minutes + seconds / 60;
    }, 0);

  const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = Math.floor(minutes % 60);
    if (hours > 0) {
      return `${hours}:${mins.toString().padStart(2, '0')}`;
    }
    return `${mins}`;
  };

  const canGoBack = navigation.canGoBack();

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
            {canGoBack && (
              <BackButton />
            )}
            <Text
              variant="heading20Bold"
              color="success"
              style={styles.courseTitle}
            >
              {courseTitle}
            </Text>
          </View>

          <View style={styles.statusRow}>
            <Text variant="heading20Bold" color="success">
              Lessons
            </Text>
            <Text variant="body16Regular" color={isCompleted ? 'success' : progress > 0 ? 'warning' : 'textSecondary'}>
              {isCompleted ? 'Completed' : progress > 0 ? 'In-Progress' : 'Not Started'}
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
                {courseTitle}
              </Text>
              <Icon
                name="ChevronUp"
                size={moderateScale(20)}
                color={colors.success}
              />
            </View>
            <Text variant="body16Regular" color="success">
              {formatDuration(totalDurationMinutes)}
            </Text>
          </TouchableOpacity>

          <View style={styles.timelineContainer}>
            {lessons.map(lesson => (
              <LessonItem
                key={lesson.id}
                lesson={lesson}
                courseId={courseId}
                navigation={navigation}
              />
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
