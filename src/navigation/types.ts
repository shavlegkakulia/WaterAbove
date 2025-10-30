export type RootStackParamList = {
  Verification: undefined;
  Login: undefined;
  // Add more screens here as you build them
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

