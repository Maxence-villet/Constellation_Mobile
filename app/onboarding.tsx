import { Stack } from "expo-router";
import OnboardingScreen from "./screens/onboarding/OnboardingScreen";

export default function Onboarding() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <OnboardingScreen />
    </>
  );
}