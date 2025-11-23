import { Course } from '@/types/course';
import { Lesson } from '@/types/lesson';

const disclaimerText = `(disclaimer: All content on this website is the property of WatersAbove / J M A TRADING LLC and is intended for personal, non-commercial use only. Unauthorized sharing, reproduction, or distribution of any content from this site outside of watersabove.com is strictly prohibited. This content and any communication with WatersAbove / J M A TRADING LLC is not financial advice, WatersAbove / J M A TRADING LLC is not a financial advisor. This content is for entertainment purposes only. Please do your own research and use any materials on this website or communications with WatersAbove as entertainment materials and not Financial / Investment / Tax / Health or Legal advice.

This service is NOT for Trading/Gambling/Betting Advice or for providing Trading Calls/Trading Signals/or Profit Sharing and WatersAbove / J M A TRADING LLC will NOT be held responsible for any actions taken by the customer with their finances. The customer agrees to take full responsibility with how they utilize this service and how they manage their finances during and after utilizing this service.)`;

export const coursesData: Course[] = [
  {
    id: '1',
    title: 'THE OBSERVER',
    progress: 25,
    status: 'in-progress',
    lessons: [
      {
        id: '1-1',
        type: 'lesson',
        title: 'Lesson 1: Discover Your Story',
        subtitle: 'THE OBSERVER',
        duration: '23:00',
        time: '23:00',
        completed: true,
        locked: false,
      },
      {
        id: '1-2',
        type: 'accountability',
        title: 'Accountability Task: Discover Your Story',
        subtitle: 'THE OBSERVER',
        completed: true,
        locked: false,
      },
      {
        id: '1-3',
        type: 'lesson',
        title: 'Lesson 2: Discover Your Commitment',
        subtitle: 'THE OBSERVER',
        duration: '23:00',
        time: '23:00',
        completed: true,
        locked: false,
      },
      {
        id: '1-4',
        type: 'accountability',
        title: 'Accountability Task: Discover Your Commitment',
        subtitle: 'THE OBSERVER',
        completed: true,
        locked: false,
      },
      {
        id: '1-5',
        type: 'lesson',
        title: 'Lesson 3: Discover Your Why',
        subtitle: 'THE OBSERVER',
        duration: '23:00',
        time: '23:00',
        completed: false,
        locked: false,
      },
      {
        id: '1-6',
        type: 'accountability',
        title: 'Accountability Task: Discover Your Why',
        subtitle: 'THE OBSERVER',
        completed: false,
        locked: false,
      },
      {
        id: '1-7',
        type: 'lesson',
        title: 'Lesson 4: Discover Your Mirror',
        subtitle: 'THE OBSERVER',
        duration: '23:00',
        time: '23:00',
        completed: false,
        locked: false,
      },
      {
        id: '1-8',
        type: 'accountability',
        title: 'Accountability Task: Discover Your Mirror',
        subtitle: 'THE OBSERVER',
        completed: false,
        locked: false,
      },
    ],
  },
  {
    id: '2',
    title: 'THE BUILDER',
    progress: 0,
    status: 'not-started',
    lessons: [
      {
        id: '2-1',
        type: 'lesson',
        title: 'Lesson 1: The Builder',
        subtitle: 'THE BUILDER',
        duration: '23:00',
        time: '23:00',
        completed: false,
        locked: false,
      },
      {
        id: '2-2',
        type: 'accountability',
        title: 'Accountability Task: The Builder',
        subtitle: 'THE BUILDER',
        completed: false,
        locked: false,
      },
      {
        id: '2-3',
        type: 'lesson',
        title: 'Lesson 2: Build Your Brand',
        subtitle: 'THE BUILDER',
        duration: '23:00',
        time: '23:00',
        completed: false,
        locked: false,
      },
      {
        id: '2-4',
        type: 'accountability',
        title: 'Accountability Task: Build Your Brand',
        subtitle: 'THE BUILDER',
        completed: false,
        locked: false,
      },
      {
        id: '2-5',
        type: 'lesson',
        title: 'Lesson 3: Build Your Resilience',
        subtitle: 'THE BUILDER',
        duration: '23:00',
        time: '23:00',
        completed: false,
        locked: false,
      },
      {
        id: '2-6',
        type: 'accountability',
        title: 'Accountability Task: Build Your Resilience',
        subtitle: 'THE BUILDER',
        completed: false,
        locked: false,
      },
    ],
  },
];

// Lesson details with full content
export interface LessonDetail {
  id: string;
  courseId: string;
  title: string;
  type: 'lesson' | 'accountability';
  videoUrl?: string;
  imageUrl?: string | number; // Can be string (remote URI) or number (local require() asset)
  description: string;
  duration?: string; // Video duration in format "MM:SS" or "HH:MM:SS"
}

export const lessonsDetailData: LessonDetail[] = [
  {
    id: '1-1',
    courseId: '1',
    type: 'lesson',
    title: 'Lesson 1: Discover Your Story',
    videoUrl: '@/assets/video.mp4',
    duration: '23:00',
    description: `Please watch this entire video ⬆ and complete Accountability Tasks in your Notebook 📝

The Accountability Tasks can be found in the ➡️ next lecture ➡️

${disclaimerText}`,
  },
  {
    id: '1-2',
    courseId: '1',
    type: 'accountability',
    title: 'Accountability Task: Discover Your Story',
    imageUrl: require('@/assets/course1/image1.png'),
    description: `1. What was a recent experience where you 'Reacted' when you could have 'Responded' and what would you change now that you've gone through this lesson?

2. What does Authenticity, Vulnerability, and Relatability mean to you and how do these 3 words fit into YOUR story?

Once you've completed the 'Accountability Tasks' above you can move on to the Next Lesson

${disclaimerText}`,
  },
  {
    id: '1-3',
    courseId: '1',
    type: 'lesson',
    title: 'Lesson 2: Discover Your Commitment',
    videoUrl: '@/assets/video.mp4',
    duration: '23:00',
    description: `Please watch this entire video ⬆ and complete Accountability Tasks in your Notebook 📝

The Accountability Tasks can be found in the ➡️ next lecture ➡️

${disclaimerText}`,
  },
  {
    id: '1-4',
    courseId: '1',
    type: 'accountability',
    title: 'Accountability Task: Discover Your Commitment',
    imageUrl: require('@/assets/course1/image2.png'),
    description: `1. Where is your focus lately? (Where are you putting your energy?)

2. Why haven't you committed to embracing this further?

3. What is the 1st commitment you can make in order to get you out of your comfort zone and start taking actionable steps to embody what success means to you?

Once you've completed the 'Accountability Tasks' above you can move on to the Next Lesson

${disclaimerText}`,
  },
  {
    id: '1-5',
    courseId: '1',
    type: 'lesson',
    title: 'Lesson 3: Discover Your Why',
    videoUrl: '@/assets/video.mp4',
    duration: '23:00',
    description: `Please watch this entire video ⬆ and complete Accountability Tasks in your Notebook 📝

The Accountability Tasks can be found in the ➡️ next lecture ➡️

${disclaimerText}`,
  },
  {
    id: '1-6',
    courseId: '1',
    type: 'accountability',
    title: 'Accountability Task: Discover Your Why',
    imageUrl: require('@/assets/course1/image3.png'),
    description: `1. What is your 'WHY'?

2. Why is this your 'WHY'?

Once you've completed the 'Accountability Tasks' above you can move on to the Next Lesson

${disclaimerText}`,
  },
  {
    id: '1-7',
    courseId: '1',
    type: 'lesson',
    title: 'Lesson 4: Discover Your Mirror',
    videoUrl: '@/assets/video.mp4',
    duration: '23:00',
    description: `Please watch this entire video ⬆ and complete Accountability Tasks in your Notebook 📝

The Accountability Tasks can be found in the ➡️ next lecture ➡️

${disclaimerText}`,
  },
  {
    id: '1-8',
    courseId: '1',
    type: 'accountability',
    title: 'Accountability Task: Discover Your Mirror',
    imageUrl: require('@/assets/course1/image4.png'),
    description: `1. Where am I now?

2. Where am I going?

Once you've completed the 'Accountability Tasks' above you can move on to the Next Lesson

${disclaimerText}`,
  },
  // THE BUILDER course lessons
  {
    id: '2-1',
    courseId: '2',
    type: 'lesson',
    title: 'Lesson 1: The Builder',
    videoUrl: '@/assets/video.mp4',
    duration: '23:00',
    description: `Please watch this entire video ⬆ and complete Accountability Tasks in your Notebook 📝

The Accountability Tasks can be found in the ➡️ next lecture ➡️

${disclaimerText}`,
  },
  {
    id: '2-2',
    courseId: '2',
    type: 'accountability',
    title: 'Accountability Task: The Builder',
    imageUrl: require('@/assets/course2/image1.png'),
    description: `1. Identify Your "Attention Breaks"

2. How do you plan on removing those Attention Breaks?

Once you've completed the 'Accountability Tasks' above you can move on to the Next Lesson

${disclaimerText}`,
  },
  {
    id: '2-3',
    courseId: '2',
    type: 'lesson',
    title: 'Lesson 2: Build Your Brand',
    videoUrl: '@/assets/video.mp4',
    duration: '23:00',
    description: `Please watch this entire video ⬆ and complete Accountability Tasks in your Notebook 📝

The Accountability Tasks can be found in the ➡️ next lecture ➡️

${disclaimerText}`,
  },
  {
    id: '2-4',
    courseId: '2',
    type: 'accountability',
    title: 'Accountability Task: Build Your Brand',
    imageUrl: require('@/assets/course2/image2.png'),
    description: `1. What are your Ideas, Art, and Aesthetic?

2. Do an 'Inspiration Inventory'

3. Create Your Brand Logo & Name

Once you've completed the 'Accountability Tasks' above you can move on to the Next Lesson

${disclaimerText}`,
  },
  {
    id: '2-5',
    courseId: '2',
    type: 'lesson',
    title: 'Lesson 3: Build Your Resilience',
    videoUrl: '@/assets/video.mp4',
    duration: '23:00',
    description: `Please watch this entire video ⬆ and complete Accountability Tasks in your Notebook 📝

The Accountability Tasks can be found in the ➡️ next lecture ➡️

${disclaimerText}`,
  },
  {
    id: '2-6',
    courseId: '2',
    type: 'accountability',
    title: 'Accountability Task: Build Your Resilience',
    imageUrl: require('@/assets/course2/image3.png'),
    description: `1. What quality do you admire most about what you discovered while doing the 'Inspiration Inventory'?

2. How can your 'Practice' more instead of 'consuming' more and how can you refine the Map you designed to take more Focused Actions?

Once you've completed the 'Accountability Tasks' above you can move on to the Next Lesson

${disclaimerText}`,
  },
];

// Helper function to get course by id
export const getCourseById = (id: string): Course | undefined => {
  return coursesData.find(course => course.id === id);
};

// Helper function to get lesson detail by id
export const getLessonDetailById = (id: string): LessonDetail | undefined => {
  return lessonsDetailData.find(lesson => lesson.id === id);
};

// Helper function to get lessons for a course
export const getLessonsByCourseId = (courseId: string): Lesson[] => {
  const course = getCourseById(courseId);
  return course?.lessons || [];
};

