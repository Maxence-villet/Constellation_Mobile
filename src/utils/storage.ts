// src/utils/storage.ts

import AsyncStorage from "@react-native-async-storage/async-storage";
import { User } from "../Models/User";

const USER_KEY = "@app_user";

export async function storeUserData(user: User): Promise<void> {
  await AsyncStorage.setItem(USER_KEY, JSON.stringify(user.toJSON));
}

export async function getUserData(): Promise<User | null> {
  const raw = await AsyncStorage.getItem(USER_KEY);
  if (!raw) {
    return null;
  }
  const data = JSON.parse(raw);
  return new User(data);
}

export async function clearUserData(): Promise<void> {
  await AsyncStorage.removeItem(USER_KEY);
}
