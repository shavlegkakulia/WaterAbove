import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { CommonActions } from '@react-navigation/native';
import { DrawerContentComponentProps } from '@react-navigation/drawer';
import { Icon } from '@/components/ui/Icon';
import { CompletedCircle } from '@/components/ui/CompletedCircle';
import { Text, CircularProgressBar, Button } from '@/components';
import { colors, spacing } from '@/theme';
import { moderateScale } from '@/utils';

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

const defaultCourses: CourseItem[] = [
  { id: '1', title: 'Course Title', status: 'in-progress', progress: 80 },
  { id: '2', title: 'Course Title', status: 'completed' },
  { id: '3', title: 'Course Title', status: 'not-started' },
  { id: '4', title: 'Course Title', status: 'not-started' },
];

export const UniversityActivityPanel: React.FC<
  UniversityActivityPanelProps
> = ({ courses = defaultCourses, navigation }) => {
  if (!navigation) {
    return null;
  }

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

  const renderCourseItem = (course: CourseItem) => {
    return (
      <TouchableOpacity
        key={course.id}
        style={styles.courseItem}
        onPress={() => handleCoursePress(course)}
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
          {course.status === 'in-progress' && course.progress !== undefined && (
            <CircularProgressBar
              progress={course.progress}
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
              insideText={`${Math.round(course.progress)}%`}
              textStyle={styles.progressText}
            />
          )}
          {course.status === 'completed' && (
            <CompletedCircle
              width={24}
              height={24}
              borderColor={colors.success}
              borderWidth={2}
              strokeWidth={2}
              strokeColor={colors.success}
              iconSize={12}
            />
          )}
          {course.status === 'not-started' && (
            <Button
              title="Start"
              variant="outline"
              size="small"
              onPress={() => {}}
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
      <View style={styles.courseList}>{courses.map(renderCourseItem)}</View>
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
