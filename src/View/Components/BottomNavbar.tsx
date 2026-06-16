// src/View/Components/BottomNavbar.tsx
import { Ionicons } from "@expo/vector-icons";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BottomSheetMenu } from "./BottomSheetMenu";

type IoniconName =
  | "home"
  | "home-outline"
  | "folder"
  | "folder-outline"
  | "chatbubbles"
  | "chatbubbles-outline"
  | "person"
  | "person-outline";

interface TabConfig {
  active: IoniconName;
  inactive: IoniconName;
  label: string;
}

const TAB_CONFIG: Record<string, TabConfig> = {
  HomeTab: {
    active: "home",
    inactive: "home-outline",
    label: "Accueil",
  },
  ConstellationsTab: {
    active: "folder",
    inactive: "folder-outline",
    label: "Dossiers",
  },
  Chat: {
    active: "chatbubbles",
    inactive: "chatbubbles-outline",
    label: "Messages",
  },
  Profile: {
    active: "person",
    inactive: "person-outline",
    label: "Profil",
  },
};

export function BottomNavbar({ state, navigation }: BottomTabBarProps) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const insets = useSafeAreaInsets();

  const leftTabs = state.routes.slice(0, 2);
  const rightTabs = state.routes.slice(2, 4);

  const renderTab = (route: (typeof state.routes)[0], routeIndex: number) => {
    const isFocused = state.index === routeIndex;
    const config = TAB_CONFIG[route.name];
    if (!config) return null;

    return (
      <TouchableOpacity
        key={route.key}
        style={styles.tab}
        onPress={() => {
          if (!isFocused) navigation.navigate(route.name);
        }}
        activeOpacity={0.7}
      >
        <Ionicons
          name={isFocused ? config.active : config.inactive}
          size={24}
          color={isFocused ? "#0d084d" : "#94a3b8"}
        />
        <Text style={[styles.tabLabel, isFocused && styles.tabLabelActive]}>
          {config.label}
        </Text>
      </TouchableOpacity>
    );
  };

  const handleNavigate = (route: string) => {
    const constellationRoutes = [
      "ConstellationList",
      "CreateConstellation",
      "ConstellationDetail",
      "InviteMember",
    ];
    if (constellationRoutes.includes(route)) {
      (navigation as any).navigate("ConstellationsTab", { screen: route });
    } else {
      (navigation as any).navigate("HomeTab", { screen: route });
    }
  };

  return (
    <>
      <BottomSheetMenu
        visible={sheetOpen}
        onClose={() => setSheetOpen(false)}
        onNavigate={handleNavigate}
      />

      <View
        style={[
          styles.navbar,
          { paddingBottom: insets.bottom > 0 ? insets.bottom : 10 },
        ]}
      >
        {leftTabs.map((route, idx) => renderTab(route, idx))}

        <TouchableOpacity
          style={[styles.centerButton, sheetOpen && styles.centerButtonOpen]}
          onPress={() => setSheetOpen((prev) => !prev)}
          activeOpacity={0.85}
        >
          <Text style={styles.centerIcon}>{sheetOpen ? "\u2715" : "+"}</Text>
        </TouchableOpacity>

        {rightTabs.map((route, idx) => renderTab(route, idx + 2))}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  navbar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
    paddingTop: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.07,
    shadowRadius: 10,
    elevation: 14,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
    paddingVertical: 4,
  },
  tabLabel: {
    fontSize: 11,
    color: "#94a3b8",
    fontWeight: "500",
  },
  tabLabelActive: {
    color: "#0d084d",
    fontWeight: "700",
  },
  centerButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#0d084d",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
    shadowColor: "#0d084d",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.38,
    shadowRadius: 12,
    elevation: 10,
  },
  centerButtonOpen: {
    backgroundColor: "#312e81",
  },
  centerIcon: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "300",
    lineHeight: 32,
    includeFontPadding: false,
  },
});
