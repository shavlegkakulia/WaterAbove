export type RootStackParamList = {
  Verification: undefined;
  Login: { email?: string; alreadyVerified?: boolean } | undefined;
  EmailCode: { email: string };
  EmailVerifiedSuccess: { email: string };
  // Add more screens here as you build them
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

