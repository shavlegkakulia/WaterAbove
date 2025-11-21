import { ApiUser } from "@/api";

export type RootStackParamList = {
  Initializing: undefined;
  Verification: undefined;
  Login: { email?: string; alreadyVerified?: boolean; } | undefined;
  EmailCode: { email: string };
  EmailVerifiedSuccess: { email: string };
  PasswordSetup: { email: string };
  Personalization: { email: string };
  LocationPersonalization: { userLocation?: ApiUser['userLocation']; profileCompletionPercentage?: number };
  ProfilePersonalization: { profileCompletionPercentage?: number; userProfile?: ApiUser['profile'] };
  TopicsPersonalization: { profileCompletionPercentage?: number; userProfile?: ApiUser['profile'] };
  CareerPersonalization: { profileCompletionPercentage?: number; userProfile?: ApiUser['profile'] };
  LifestylePersonalization: { profileCompletionPercentage?: number; userProfile?: ApiUser['profile'] };
  ProfileCompleted: undefined;
  Welcome: { avatarUrl?: string; avatarBase64?: string; email?: string };
  ForgotPassword: undefined;
  CheckInbox: { email: string };
  SetNewPassword: { email: string; resetCode: string };
  PasswordUpdatedSuccess: undefined;
  ArchiveHome: undefined;
  CourseDetail: { courseId?: string; courseTitle?: string; progress?: number };
  LessonDetailVideo: { lessonId?: string; lessonTitle?: string; progress?: number };
  // Add more screens here as you build them
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

