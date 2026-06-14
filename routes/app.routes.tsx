// routes/app.routes.tsx
import ConstellationListScreen from "@/app/ConstellationListScreen";
import CreateConstellationScreen from "@/app/CreateConstellationScreen";
import { useAuth } from "@/src/Contexts/AuthContexts";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../app/HomeScreen";
import LoginScreen from "../app/LoginScreen";
import RegisterScreen from "../app/RegisterScreen";
import WelcomeScreen from "../app/WelcomeScreen";

export type RootStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Home: undefined;
  Register: undefined;
  CreateConstellation: undefined;
  ConstellationList: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
}

function AppStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen
        name="ConstellationList"
        component={ConstellationListScreen}
      />
      <Stack.Screen
        name="CreateConstellation"
        component={CreateConstellationScreen}
      />
    </Stack.Navigator>
  );
}

export function AppRoutes() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  return user ? <AppStack /> : <AuthStack />;
}
