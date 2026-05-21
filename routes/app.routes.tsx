// routes/app.routes.tsx
import OnboardingScreen from "@/app/OnboardingScreen";
import WelcomeScreen from "@/app/WelcomeScreen";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

export type RootStackParamList = {
  Toto: undefined;
  Home: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export function AppRoutes() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} />
      <Stack.Screen name="OnboardingScreen" component={OnboardingScreen} />
    </Stack.Navigator>
  );
}
