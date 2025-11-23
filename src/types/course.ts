import { Lesson } from './lesson';

export interface Course {
  id: string;
  title: string;
  subtitle?: string;
  progress?: number; // 0-100
  status: 'in-progress' | 'completed' | 'not-started';
  lessons: Lesson[];
}

