import React, { useMemo, useRef, useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import Video, { VideoRef, OnProgressData } from 'react-native-video';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { useAtomValue, useSetAtom } from 'jotai';
import {
  Text,
  Header,
  BackButton,
  PrimaryActionButton,
} from '@/components';
import { AuthScreenWrapper } from '@/components/AuthScreenWrapper';
import { colors, spacing, borderRadius } from '@/theme';
import { moderateScale } from '@/utils';
import { RootStackParamList } from '@/navigation/types';
import { getLessonDetailById, getCourseById } from '@/data/courses';
import { 
  isLessonWatchedAtom, 
  markLessonWatchedAtom,
  getLessonNoteAtom,
  updateLessonNoteAtom,
} from '@/store/atoms/courseProgressAtoms';

const VIDEO_ASPECT = 199 / 112; // იგივე ფიგმას პროპორცია

export const LessonDetailVideoScreen: React.FC = () => {
  const navigation = useNavigation<DrawerNavigationProp<RootStackParamList, 'LessonDetailVideo'>>();
  const route = useRoute<RouteProp<RootStackParamList, 'LessonDetailVideo'>>();
  const { lessonId, courseId = '1' } = route.params || {};

  const videoRef = useRef<VideoRef>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [watchedPercentage, setWatchedPercentage] = useState(0); // 0-100

  // Load lesson detail from mock data
  const lessonDetail = useMemo(() => getLessonDetailById(lessonId || ''), [lessonId]);
  const course = useMemo(() => getCourseById(courseId), [courseId]);

  // Check if lesson is already watched
  const isLessonWatched = useAtomValue(
    useMemo(() => isLessonWatchedAtom(courseId, lessonId || ''), [courseId, lessonId])
  );
  const markLessonWatched = useSetAtom(markLessonWatchedAtom);

  // Get and update lesson note from storage
  const savedNote = useAtomValue(
    useMemo(() => getLessonNoteAtom(courseId, lessonId || ''), [courseId, lessonId])
  );
  const updateNote = useSetAtom(updateLessonNoteAtom);
  const [noteText, setNoteText] = useState(''); // Local state for note text
  const [isSubmitted, setIsSubmitted] = useState(false); // Track if accountability task is submitted

  // Load saved note when component mounts or lessonId changes
  useEffect(() => {
    if (savedNote) {
      setNoteText(savedNote);
      // If note exists and is not empty, mark as submitted (so Next Lesson button shows)
      if (savedNote.trim()) {
        setIsSubmitted(true);
      }
    } else {
      // Reset note text if no saved note
      setNoteText('');
      setIsSubmitted(false);
    }
  }, [savedNote]);

  // Check if input should be disabled
  // Input is disabled if: lesson is watched OR note is already saved
  const isInputDisabled = isLessonWatched || (!!savedNote && savedNote.trim().length > 0);

  // Save note to local state only (don't save to storage until Submit)
  const handleNoteChange = (text: string) => {
    if (!isInputDisabled) {
      setNoteText(text);
      // Don't save to storage immediately - only on Submit
    }
  };

  // Track if 80% threshold has been reached (for video lessons)
  const hasReached80Percent = watchedPercentage >= 80;
  const isVideoButtonDisabled = !hasReached80Percent && !isLessonWatched;
  
  // For accountability tasks, button is disabled if note is empty
  const isAccountabilityButtonDisabled = lessonDetail?.type === 'accountability' 
    ? !noteText.trim() 
    : false;

  const handleGoBack = () => {
    // Navigate to CourseDetail screen
    navigation.navigate('CourseDetail', { courseId });
  };

  // Check if there's a next lesson for the button
  const currentLessonIndex = course?.lessons ? course.lessons.findIndex(l => l.id === lessonId) : -1;
  const totalLessons = course?.lessons?.length || 0;
  const hasNextLesson = currentLessonIndex >= 0 && currentLessonIndex < totalLessons - 1;
  const nextLesson = hasNextLesson && course?.lessons ? course.lessons[currentLessonIndex + 1] : null;
  
  // Debug: log lesson info
  useEffect(() => {
    console.log('LessonDetailVideoScreen - Lesson calculation:', {
      lessonId,
      courseId,
      course: course ? { id: course.id, title: course.title, lessonsCount: course.lessons?.length } : null,
      currentLessonIndex,
      totalLessons,
      hasNextLesson,
      nextLesson: nextLesson ? { id: nextLesson.id, title: nextLesson.title, locked: nextLesson.locked } : null,
    });
  }, [lessonId, courseId, currentLessonIndex, totalLessons, hasNextLesson, nextLesson, course]);

  // Get video source - check if it's local asset path
  const videoSource = useMemo(() => {
    if (!lessonDetail?.videoUrl) return null;
    
    // Check if videoUrl is local asset path
    if (lessonDetail.videoUrl === '@/assets/video.mp4') {
      try {
        return require('@/assets/video.mp4');
      } catch (error) {
        console.error('Error loading local video:', error);
        return null;
      }
    }
    
    // Remote video URL
    return { uri: lessonDetail.videoUrl };
  }, [lessonDetail?.videoUrl]);

  const handleLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  // Track video progress
  const handleProgress = (data: OnProgressData) => {
    if (data.seekableDuration > 0) {
      const currentProgress = (data.currentTime / data.seekableDuration) * 100;
      setWatchedPercentage(Math.min(100, currentProgress));
      
      // Mark as watched if 80% threshold reached
      if (currentProgress >= 80 && !isLessonWatched && lessonDetail?.type === 'lesson') {
        markLessonWatched({ courseId, lessonId: lessonId || '' });
      }
    }
  };

  // Load progress if lesson is already watched
  useEffect(() => {
    if (isLessonWatched) {
      setWatchedPercentage(100);
      // If accountability task is already watched, mark as submitted
      if (lessonDetail?.type === 'accountability') {
        setIsSubmitted(true);
      }
    }
  }, [isLessonWatched, lessonDetail?.type]);

  // Don't auto-mark as submitted based on noteText
  // Only mark as submitted after actual Submit button click

  // Handle submit for accountability tasks
  const handleSubmit = async () => {
    if (lessonDetail?.type === 'accountability' && noteText.trim() && !isLessonWatched) {
      try {
        // First, save note to storage
        updateNote({ courseId, lessonId: lessonId || '', note: noteText });
        
        // Then, mark lesson as watched - this is async and updates Jotai state
        await markLessonWatched({ courseId, lessonId: lessonId || '' });
        
        // Mark as submitted to change button to "Next Lesson"
        // Note: Don't clear noteText - it should remain visible but readonly
        setIsSubmitted(true);
      } catch (error) {
        console.error('Error submitting accountability task:', error);
      }
    }
  };

  // Handle Next Lesson navigation for accountability tasks
  const handleNextLesson = () => {
    if (nextLesson && !nextLesson.locked) {
      navigation.navigate('LessonDetailVideo', {
        lessonId: nextLesson.id,
        lessonTitle: nextLesson.title,
        courseId: courseId,
      });
    }
  };

  // Check if this is an accountability task
  const isAccountabilityTask = lessonDetail?.type === 'accountability';

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
                {course?.title || 'Course'}
              </Text>
              <View style={styles.subtitleContainer}>
                <Text
                  variant="paragraph14Bold"
                  color="textWhiteWA"
                  style={styles.subtitle}
                >
                  {lessonDetail?.title || 'Lesson'}
                </Text>
                {lessonDetail?.duration && (
                  <Text
                    variant="paragraph14Bold"
                    color="textWhiteWA"
                    style={styles.duration}
                  >
                    {lessonDetail.duration}
                  </Text>
                )}
              </View>
            </View>
          </View>
          
          {/* Video or Image Container */}
          {(lessonDetail?.type === 'lesson' && lessonDetail?.videoUrl) || (lessonDetail?.type === 'accountability' && lessonDetail?.imageUrl) ? (
            <View style={styles.videoContainer}>
              {lessonDetail.type === 'lesson' && lessonDetail.videoUrl && videoSource ? (
                <View style={styles.videoWrapper}>
                  <Video
                    ref={videoRef}
                    source={videoSource}
                    style={styles.video}
                    controls={true}
                    resizeMode="contain"
                    onLoad={handleLoad}
                    onError={handleError}
                    onProgress={handleProgress}
                    paused={false}
                    repeat={false}
                    progressUpdateInterval={1000} // Update every second
                  />
                  {isLoading && (
                    <View style={styles.loadingOverlay}>
                      <ActivityIndicator size="large" color={colors.success} />
                    </View>
                  )}
                  {hasError && (
                    <View style={styles.errorOverlay}>
                      <Text variant="body16Regular" color="textSecondary" style={styles.errorText}>
                        Failed to load video
                      </Text>
                    </View>
                  )}
                </View>
              ) : lessonDetail.type === 'lesson' && lessonDetail.videoUrl ? (
                <View style={styles.imageContainer}>
                  <Image
                    source={require('@/assets/images/videoTemplate.png')}
                    style={styles.imageContent}
                    resizeMode="cover"
                  />
                </View>
              ) : lessonDetail.type === 'accountability' && lessonDetail.imageUrl ? (
                <View style={styles.imageContainer}>
                  <Image
                    source={
                      typeof lessonDetail.imageUrl === 'number'
                        ? lessonDetail.imageUrl
                        : { uri: lessonDetail.imageUrl }
                    }
                    style={styles.imageContent}
                    resizeMode="cover"
                  />
                </View>
              ) : (
                <Image
                  source={require('@/assets/images/videoTemplate.png')}
                  style={styles.videoImage}
                />
              )}
            </View>
          ) : (
            <View style={styles.videoContainer}>
              {lessonDetail?.type === 'lesson' ? (
                <View style={styles.imageContainer}>
                  <Image
                    source={require('@/assets/images/videoTemplate.png')}
                    style={styles.imageContent}
                    resizeMode="cover"
                  />
                </View>
              ) : (
                <View style={[styles.imageContainer, styles.placeholderImage]}>
                  <Text variant="body16Regular" color="textSecondary" style={styles.placeholderText}>
                    Image will be displayed here
                  </Text>
                </View>
              )}
            </View>
          )}

          {/* Description */}
          <View style={styles.videoDescriptionContainer}>
            <Text variant="paragraph14Bold" color="textWhiteWA" style={styles.descriptionText}>
              {lessonDetail?.description || 'No description available.'}
            </Text>
          </View>

          {/* Accountability Task Input Section */}
          {isAccountabilityTask && (
            <View style={styles.accountabilitySection}>
              <Text variant="heading20Bold" color="success" style={styles.accountabilityTitle}>
                Submit Your Accountability Tasks Here:
              </Text>
              <TextInput
                style={[
                  styles.noteInput,
                  isInputDisabled && styles.noteInputReadonly
                ]}
                placeholder="Submit Your Accountability Task HERE"
                placeholderTextColor="#F1F1F1"
                multiline={true}
                numberOfLines={8}
                value={noteText}
                onChangeText={handleNoteChange}
                textAlignVertical="top"
                editable={!isInputDisabled}
              />
              {isSubmitted ? (
                nextLesson && !nextLesson.locked ? (
                  <PrimaryActionButton
                    title={nextLesson.type === 'accountability' ? 'Start Accountability Task' : 'Next Lesson'}
                    rightIcon="ChevronRight"
                    iconSize={20}
                    containerStyle={styles.submitButton}
                    disabled={false}
                    onPress={handleNextLesson}
                  />
                ) : null
              ) : (
                <PrimaryActionButton
                  title="Submit"
                  containerStyle={styles.submitButton}
                  disabled={isAccountabilityButtonDisabled || isLessonWatched}
                  onPress={handleSubmit}
                />
              )}
            </View>
          )}
        </View>

        {/* Action Button - Always show for video lessons (disabled only if <80% watched) */}
        {!isAccountabilityTask && (
          <PrimaryActionButton
            title={
              watchedPercentage >= 80
                ? (nextLesson?.type === 'accountability' ? 'Start Accountability Task' : 'Next Lesson')
                : (nextLesson?.type === 'accountability' ? 'Start Accountability Task' : 'Next Lesson')
            }
            rightIcon="ChevronRight"
            iconSize={20}
            containerStyle={styles.buttonContainer}
            disabled={isVideoButtonDisabled}
            onPress={() => {
              console.log('PrimaryActionButton onPress called', { 
                isVideoButtonDisabled, 
                nextLesson,
                course: course ? { id: course.id, lessonsCount: course.lessons?.length } : null,
                currentLessonIndex,
                lessonId,
              });
              // Navigate to next lesson if button is active and next lesson exists
              console.log('Next Lesson button pressed', {
                nextLesson,
                isVideoButtonDisabled,
                courseId,
                currentLessonIndex: course?.lessons.findIndex(l => l.id === lessonId),
              });
              
              if (!nextLesson) {
                console.log('No next lesson available');
                return;
              }
              
              if (nextLesson.locked) {
                console.log('Next lesson is locked');
                return;
              }
              
              console.log('Navigating to next lesson:', nextLesson.id);
              
              // Navigate to next lesson
              navigation.navigate('LessonDetailVideo', {
                lessonId: nextLesson.id,
                lessonTitle: nextLesson.title,
                courseId: courseId,
              });
            }}
          />
        )}
    
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
  subtitleContainer: {
    position: 'absolute',
    bottom: -moderateScale(10),
    left: 57,
    marginTop: moderateScale(spacing.xs),
    flexDirection: 'row',
    alignItems: 'center',
    gap: moderateScale(spacing.sm),
  },
  subtitle: {
    flex: 1,
  },
  duration: {
    marginLeft: moderateScale(spacing.xs),
  },
  videoContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: moderateScale(spacing.lg),
  },
  videoWrapper: {
    width: '100%',
    height: 205,
    backgroundColor: colors.black,
    position: 'relative',
    overflow: 'hidden',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  videoImage: {
    width: '100%',
    aspectRatio: VIDEO_ASPECT,
  },
  imageContainer: {
    width: '100%',
    aspectRatio: VIDEO_ASPECT,
    overflow: 'hidden',
  },
  imageContent: {
    width: '100%',
    height: '100%',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.black,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.black,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    textAlign: 'center',
    color: colors.textSecondary,
  },
  videoDescriptionContainer: {
    marginBottom: moderateScale(spacing.xl),
  },
  descriptionText: {
    lineHeight: moderateScale(22),
    fontSize: moderateScale(14),
  },
  placeholderImage: {
    backgroundColor: colors.gray700,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  placeholderText: {
    textAlign: 'center',
  },
  buttonContainer: {
    marginBottom: moderateScale(spacing.xl),
  },
  accountabilitySection: {
    marginTop: moderateScale(spacing.xl),
    marginBottom: moderateScale(spacing.xl),
  },
  accountabilityTitle: {
    marginBottom: moderateScale(spacing.md),
  },
  noteInput: {
    width: '100%',
    minHeight: moderateScale(150),
    backgroundColor: colors.backgroundInput || '#1F252F',
    borderWidth: 1.2,
    borderColor: '#0369F1',
    borderRadius: moderateScale(borderRadius.md),
    paddingHorizontal: moderateScale(spacing.md),
    paddingVertical: moderateScale(spacing.md),
    color: colors.white || '#F1F1F1',
    fontSize: moderateScale(14),
    marginBottom: moderateScale(spacing.md),
    textAlignVertical: 'top',
    lineHeight: moderateScale(20),
  },
  noteInputReadonly: {
    opacity: 0.7,
  },
  submitButton: {
    marginTop: moderateScale(spacing.md),
  },
});

export default LessonDetailVideoScreen;
