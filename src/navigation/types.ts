export type RootStackParamList = {
  Initializing: undefined;
  Verification: undefined;
  Login: { email?: string; alreadyVerified?: boolean; } | undefined;
  EmailCode: { email: string };
  EmailVerifiedSuccess: { email: string };
  PasswordSetup: { email: string };
  Personalization: { email: string };
  LocationPersonalization: { email: string };
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

