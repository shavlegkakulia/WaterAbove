import { ApiUser } from "@/api";

export type RootStackParamList = {
  Initializing: undefined;
  Verification: undefined;
  Login: { email?: string; alreadyVerified?: boolean; } | undefined;
  EmailCode: { email: string };
  EmailVerifiedSuccess: { email: string };
  PasswordSetup: { email: string };
  Personalization: { email: string };
  LocationPersonalization: { email: string; userLocation?: ApiUser['userLocation']; profileCompletionPercentage?: number };
  ProfilePersonalization: { email: string; profileCompletionPercentage?: number; userProfile?: ApiUser['profile'] };
  TopicsPersonalization: { email: string; profileCompletionPercentage?: number; userProfile?: ApiUser['profile'] };
  CareerPersonalization: { email: string; profileCompletionPercentage?: number; userProfile?: ApiUser['profile'] };
  LifestylePersonalization: { email: string; profileCompletionPercentage?: number; userProfile?: ApiUser['profile'] };
  ProfileCompleted: { email: string };
  Welcome: { avatarUrl?: string; avatarBase64?: string; email?: string };
  ForgotPassword: undefined;
  CheckInbox: { email: string };
  SetNewPassword: { email: string; resetCode: string };
  PasswordUpdatedSuccess: undefined;
  // Add more screens here as you build them
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

