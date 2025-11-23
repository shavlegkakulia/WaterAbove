import {atom} from 'jotai';
import {atomWithStorage, createJSONStorage} from 'jotai/utils';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Course Progress State
 * Tracks which lessons have been watched for each course
 * Structure: { courseId: { lessonId: true } }
 */
export interface CourseProgress {
  [courseId: string]: {
    [lessonId: string]: boolean;
  };
}

// Persisted course progress (React Native AsyncStorage)
export const courseProgressAtom = atomWithStorage<CourseProgress>(
  'course_progress',
  {},
  createJSONStorage(() => AsyncStorage)
);

/**
 * Mark a lesson as watched
 */
export const markLessonWatchedAtom = atom(
  null,
  async (get, set, {courseId, lessonId}: {courseId: string; lessonId: string}) => {
    const current = await get(courseProgressAtom);
    const currentProgress: CourseProgress = current || {};
    set(courseProgressAtom, {
      ...currentProgress,
      [courseId]: {
        ...(currentProgress[courseId] || {}),
        [lessonId]: true,
      },
    });
  }
);

/**
 * Check if a lesson is watched
 */
export const isLessonWatchedAtom = (courseId: string, lessonId: string) =>
  atom(async (get) => {
    const progress = await get(courseProgressAtom);
    const courseProgress: CourseProgress = progress || {};
    return courseProgress[courseId]?.[lessonId] === true;
  });

/**
 * Get watched lessons count for a course
 */
export const getWatchedLessonsCountAtom = (courseId: string) =>
  atom(async (get) => {
    const progress = await get(courseProgressAtom);
    const courseProgress: CourseProgress = progress || {};
    const course = courseProgress[courseId] || {};
    return Object.values(course).filter(Boolean).length;
  });

/**
 * Check if course has any watched lessons
 */
export const hasWatchedLessonsAtom = (courseId: string) =>
  atom(async (get) => {
    const progress = await get(courseProgressAtom);
    const courseProgress: CourseProgress = progress || {};
    const course = courseProgress[courseId] || {};
    return Object.values(course).some(Boolean);
  });

/**
 * Check if all lessons in a course are watched
 */
export const isCourseCompletedAtom = (courseId: string, totalLessons: number) =>
  atom(async (get) => {
    const progress = await get(courseProgressAtom);
    const courseProgress: CourseProgress = progress || {};
    const course = courseProgress[courseId] || {};
    const watchedCount = Object.values(course).filter(Boolean).length;
    return watchedCount >= totalLessons;
  });

/**
 * Lesson Notes State
 * Stores notes for accountability tasks
 * Structure: { courseId: { lessonId: noteText } }
 */
export interface LessonNotes {
  [courseId: string]: {
    [lessonId: string]: string; // note text
  };
}

// Atom for storing lesson notes, persisted to AsyncStorage
export const lessonNotesAtom = atomWithStorage<LessonNotes>(
  'lessonNotes',
  {},
  createJSONStorage(() => AsyncStorage)
);

/**
 * Get note for a lesson
 */
export const getLessonNoteAtom = (courseId: string, lessonId: string) =>
  atom(async (get) => {
    const notes = await get(lessonNotesAtom);
    const courseNotes: LessonNotes = notes || {};
    const lessonNotes = courseNotes[courseId] || {};
    return lessonNotes[lessonId] || '';
  });

/**
 * Update note for a lesson
 */
export const updateLessonNoteAtom = atom(
  null,
  async (get, set, {courseId, lessonId, note}: {courseId: string; lessonId: string; note: string}) => {
    const current = await get(lessonNotesAtom);
    const currentNotes: LessonNotes = current || {};
    set(lessonNotesAtom, {
      ...currentNotes,
      [courseId]: {
        ...(currentNotes[courseId] || {}),
        [lessonId]: note,
      },
    });
  }
);

