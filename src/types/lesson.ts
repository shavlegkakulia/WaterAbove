export type LessonType = 'lesson' | 'accountability';

export interface Lesson {
  id: string;
  type: LessonType;
  title: string;
  subtitle: string;
  duration?: string;
  time?: string;
  completed?: boolean;
  locked?: boolean;
}

