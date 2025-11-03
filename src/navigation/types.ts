export type RootStackParamList = {
  Verification: undefined;
  Login: { email?: string; alreadyVerified?: boolean; } | undefined;
  EmailCode: { email: string };
  EmailVerifiedSuccess: { email: string };
  PasswordSetup: { email: string };
  Personalization: { email: string };
  Welcome: undefined;
  // Add more screens here as you build them
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

