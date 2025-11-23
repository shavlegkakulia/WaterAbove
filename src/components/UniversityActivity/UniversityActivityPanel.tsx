import React, { useMemo } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { CommonActions } from '@react-navigation/native';
import { DrawerContentComponentProps } from '@react-navigation/drawer';
import { useAtomValue } from 'jotai';
import { Icon } from '@/components/ui/Icon';
import { CompletedCircle } from '@/components/ui/CompletedCircle';
import { Text, CircularProgressBar, Button } from '@/components';
import { colors, spacing } from '@/theme';
import { moderateScale } from '@/utils';
import { coursesData } from '@/data/courses';
import { 
  getWatchedLessonsCountAtom,
  hasWatchedLessonsAtom,
  isCourseCompletedAtom,
} from '@/store/atoms/courseProgressAtoms';

interface CourseItem {
  id: string;
  title: string;
  status: 'in-progress' | 'completed' | 'not-started';
  progress?: number; // 0-100 for in-progress
}

interface UniversityActivityPanelProps {
  courses?: CourseItem[];
  navigation?: DrawerContentComponentProps['navigation'];
}

export const UniversityActivityPanel: React.FC<
  UniversityActivityPanelProps
> = ({ courses, navigation }) => {
  if (!navigation) {
    return null;
  }

  // Use courses from prop or default from coursesData
  const displayCourses = courses || coursesData.map(course => ({
    id: course.id,
    title: course.title,
    status: course.status,
    progress: course.progress,
  }));

  const handleCoursePress = (course: CourseItem) => {
    navigation.dispatch(
      CommonActions.navigate({
        name: 'CourseDetail',
        params: {
          courseId: course.id,
          courseTitle: course.title,
          progress: course.progress,
        },
      }),
    );
  };

  // Component for individual course item
  const CourseItemComponent: React.FC<{course: CourseItem; onPress: (course: CourseItem) => void}> = ({course, onPress}) => {
    // Get course data from coursesData
    const courseData = useMemo(() => coursesData.find(c => c.id === course.id), [course.id]);
    const totalLessons = courseData?.lessons.length || 0;
    
    // Get progress from Jotai state
    const watchedCount = useAtomValue(useMemo(() => getWatchedLessonsCountAtom(course.id), [course.id]));
    const hasWatched = useAtomValue(useMemo(() => hasWatchedLessonsAtom(course.id), [course.id]));
    const isCompleted = useAtomValue(useMemo(() => isCourseCompletedAtom(course.id, totalLessons), [course.id, totalLessons]));
    
    // Calculate progress percentage
    const progressPercentage = totalLessons > 0 
      ? Math.round((watchedCount / totalLessons) * 100)
      : 0;

    return (
      <TouchableOpacity
        style={styles.courseItem}
        onPress={() => onPress(course)}
        activeOpacity={0.7}
      >
        <Text
          variant="body16Regular"
          color="textWhiteWA"
          style={styles.courseTitle}
        >
          {course.title}
        </Text>
        <View style={styles.courseAction}>
          {isCompleted ? (
            <CompletedCircle
              width={24}
              height={24}
              borderColor={colors.success}
              borderWidth={2}
              strokeWidth={2}
              strokeColor={colors.success}
              iconSize={12}
            />
          ) : hasWatched && progressPercentage > 0 ? (
            <CircularProgressBar
              progress={progressPercentage}
              size={moderateScale(42)}
              strokeWidth={moderateScale(5)}
              gradientColors={[
                { color: '#37B8CD', offset: '24.99%' },
                { color: '#46C2A3', offset: '47.02%' },
              ]}
              gradientAngle={36}
              unfilledColor={colors.gray700}
              textColor={colors.white}
              textPosition="inside"
              insideText={`${progressPercentage}%`}
              textStyle={styles.progressText}
            />
          ) : (
            <Button
              title="Start"
              variant="outline"
              size="small"
              onPress={() => onPress(course)}
              containerStyle={styles.startButton}
              textStyle={styles.startButtonText}
            />
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View>
      {/* Header */}
      <View style={styles.header}>
        <Icon
          name="ChartNoAxesColumn"
          size={moderateScale(24)}
          color={colors.success}
          strokeWidth={2}
        />
        <Text
          variant="heading20Bold"
          color="success"
          style={styles.headerTitle}
        >
          My University Activity
        </Text>
      </View>

      {/* Course List */}
      <View style={styles.courseList}>
        {displayCourses.map(course => (
          <CourseItemComponent 
            key={course.id} 
            course={course} 
            onPress={handleCoursePress} 
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: moderateScale(spacing.sm),
    marginBottom: moderateScale(spacing.md),
  },
  headerTitle: {
    textAlign: 'center',
    fontSize: moderateScale(20),
  },
  courseList: {
    gap: moderateScale(spacing.sm),
  },
  courseItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#2F384752',
    borderRadius: moderateScale(12),
    paddingHorizontal: moderateScale(19),
    paddingVertical: moderateScale(14),
    height: moderateScale(70),
  },
  courseTitle: {
    flex: 1,
  },
  courseAction: {
    width: moderateScale(80),
    alignItems: 'center',
    marginLeft: moderateScale(spacing.md),
  },
  progressText: {
    color: "#C7DBD6",
    fontSize: moderateScale(12),
    fontWeight: '700',
  },
  startButton: {
    borderWidth: 1,
    borderColor: colors.success,
    backgroundColor: 'transparent',
    borderRadius: moderateScale(20),
    paddingHorizontal: moderateScale(spacing.md),
    paddingVertical: moderateScale(spacing.sm),
    minHeight: undefined,
  },
  startButtonText: {
    color: colors.success,
    fontSize: moderateScale(14),
  },
});
