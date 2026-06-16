// routes/app.routes.tsx
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigatorScreenParams } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ChatScreen from "../app/ChatScreen";
import ConstellationDetailScreen from "../app/ConstellationDetailScreen";
import ConstellationListScreen from "../app/ConstellationListScreen";
import CreateConstellationScreen from "../app/CreateConstellationScreen";
import HomeScreen from "../app/HomeScreen";
import InviteMemberScreen from "../app/InviteMemberScreen";
import LoginScreen from "../app/LoginScreen";
import NotificationsScreen from "../app/NotificationsScreen";
import ProfileScreen from "../app/ProfileScreen";
import RegisterScreen from "../app/RegisterScreen";
import WelcomeScreen from "../app/WelcomeScreen";
import { useAuth } from "../src/Contexts/AuthContexts";
import { BottomNavbar } from "../src/View/Components/BottomNavbar";

export type HomeStackParamList = {
  Home: undefined;
  Notifications: undefined;
};

export type ConstellationsStackParamList = {
  ConstellationList: undefined;
  ConstellationDetail: {
    constellationId: string;
    constellationName: string;
    constellationDescription: string;
    members: any[];
  };
  CreateConstellation: undefined;
  InviteMember: { constellationId: string; constellationName: string };
};

export type MainTabsParamList = {
  HomeTab: NavigatorScreenParams<HomeStackParamList> | undefined;
  ConstellationsTab:
    | NavigatorScreenParams<ConstellationsStackParamList>
    | undefined;
  Chat: undefined;
  Profile: undefined;
};

export type AuthStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Register: undefined;
};

export type RootStackParamList = HomeStackParamList &
  ConstellationsStackParamList;

const HomeStack = createNativeStackNavigator<HomeStackParamList>();
const ConstellationsStack =
  createNativeStackNavigator<ConstellationsStackParamList>();
const Tab = createBottomTabNavigator<MainTabsParamList>();
const AuthNav = createNativeStackNavigator<AuthStackParamList>();

function HomeStackNavigator() {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name="Home" component={HomeScreen} />
      <HomeStack.Screen name="Notifications" component={NotificationsScreen} />
    </HomeStack.Navigator>
  );
}

function ConstellationsStackNavigator() {
  return (
    <ConstellationsStack.Navigator screenOptions={{ headerShown: false }}>
      <ConstellationsStack.Screen
        name="ConstellationList"
        component={ConstellationListScreen}
      />
      <ConstellationsStack.Screen
        name="ConstellationDetail"
        component={ConstellationDetailScreen}
      />
      <ConstellationsStack.Screen
        name="CreateConstellation"
        component={CreateConstellationScreen}
      />
      <ConstellationsStack.Screen
        name="InviteMember"
        component={InviteMemberScreen}
      />
    </ConstellationsStack.Navigator>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      tabBar={(props) => <BottomNavbar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="HomeTab" component={HomeStackNavigator} />
      <Tab.Screen
        name="ConstellationsTab"
        component={ConstellationsStackNavigator}
      />
      <Tab.Screen name="Chat" component={ChatScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

function AuthStack() {
  return (
    <AuthNav.Navigator screenOptions={{ headerShown: false }}>
      <AuthNav.Screen name="Welcome" component={WelcomeScreen} />
      <AuthNav.Screen name="Login" component={LoginScreen} />
      <AuthNav.Screen name="Register" component={RegisterScreen} />
    </AuthNav.Navigator>
  );
}

export function AppRoutes() {
  const { user, isLoading } = useAuth();
  if (isLoading) return null;
  return user ? <MainTabs /> : <AuthStack />;
}
