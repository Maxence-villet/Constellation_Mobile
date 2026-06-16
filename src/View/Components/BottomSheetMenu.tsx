// src/View/Components/BottomSheetMenu.tsx
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Modal,
  PanResponder,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const SHEET_TRANSLATE_MAX = 360;
const NAVBAR_HEIGHT = 80;

type IoniconName =
  | "document-text-outline"
  | "planet-outline"
  | "cloud-upload-outline"
  | "time-outline";

interface MenuItem {
  id: string;
  icon: IoniconName;
  label: string;
  route: string | null;
}

const MENU_ITEMS: MenuItem[] = [
  {
    id: "task",
    icon: "document-text-outline",
    label: "Ajouter une tache",
    route: null,
  },
  {
    id: "constellation",
    icon: "planet-outline",
    label: "Creer une constellation",
    route: "CreateConstellation",
  },
  {
    id: "document",
    icon: "cloud-upload-outline",
    label: "Importer un document",
    route: null,
  },
  {
    id: "appointment",
    icon: "time-outline",
    label: "Definir un rendez-vous",
    route: null,
  },
];

interface Props {
  visible: boolean;
  onClose: () => void;
  onNavigate: (route: string) => void;
}

export function BottomSheetMenu({ visible, onClose, onNavigate }: Props) {
  const insets = useSafeAreaInsets();
  const [isRendered, setIsRendered] = useState(false);

  const slideAnim = useRef(new Animated.Value(SHEET_TRANSLATE_MAX)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  // Stable refs to avoid stale closures in PanResponder
  const onCloseRef = useRef(onClose);
  const onNavigateRef = useRef(onNavigate);
  useEffect(() => {
    onCloseRef.current = onClose;
    onNavigateRef.current = onNavigate;
  });

  useEffect(() => {
    if (visible) {
      setIsRendered(true);
      slideAnim.setValue(SHEET_TRANSLATE_MAX);
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          damping: 22,
          stiffness: 200,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 220,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: SHEET_TRANSLATE_MAX,
          duration: 260,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start(() => setIsRendered(false));
    }
  }, [visible, slideAnim, opacityAnim]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_, g) => g.dy > 6,
      onPanResponderMove: (_, g) => {
        if (g.dy > 0) slideAnim.setValue(g.dy);
      },
      onPanResponderRelease: (_, g) => {
        if (g.dy > 90 || g.vy > 0.6) {
          onCloseRef.current();
        } else {
          Animated.spring(slideAnim, {
            toValue: 0,
            damping: 18,
            useNativeDriver: true,
          }).start();
        }
      },
    }),
  ).current;

  if (!isRendered) return null;

  const handleAction = (route: string | null) => {
    if (!route) return;
    onCloseRef.current();
    setTimeout(() => onNavigateRef.current(route), 30);
  };

  return (
    <Modal
      transparent
      visible={isRendered}
      animationType="none"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <Animated.View style={[styles.backdrop, { opacity: opacityAnim }]} />
      </TouchableWithoutFeedback>

      <Animated.View
        style={[
          styles.sheet,
          {
            bottom: NAVBAR_HEIGHT + (insets.bottom > 0 ? insets.bottom : 8),
            transform: [{ translateY: slideAnim }],
          },
        ]}
        {...panResponder.panHandlers}
      >
        <View style={styles.handle} />

        {MENU_ITEMS.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={[styles.menuItem, !item.route && styles.menuItemDisabled]}
            onPress={() => handleAction(item.route)}
            activeOpacity={item.route ? 0.65 : 1}
          >
            <View style={styles.iconWrap}>
              <Ionicons
                name={item.icon}
                size={22}
                color={item.route ? "#0d084d" : "#94a3b8"}
              />
            </View>
            <Text
              style={[
                styles.menuLabel,
                !item.route && styles.menuLabelDisabled,
              ]}
            >
              {item.label}
            </Text>
            {!item.route && <Text style={styles.soonBadge}>Bientot</Text>}
          </TouchableOpacity>
        ))}
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(10, 37, 64, 0.52)",
  },
  sheet: {
    position: "absolute",
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.14,
    shadowRadius: 20,
    elevation: 24,
  },
  handle: {
    width: 44,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#e2e8f0",
    alignSelf: "center",
    marginBottom: 22,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 13,
    paddingHorizontal: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#e8edf2",
    backgroundColor: "#f8fafc",
    marginBottom: 10,
    gap: 14,
  },
  menuItemDisabled: {
    opacity: 0.6,
  },
  iconWrap: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: "#0d084d0f",
    alignItems: "center",
    justifyContent: "center",
  },
  menuLabel: {
    flex: 1,
    fontSize: 15,
    fontWeight: "600",
    color: "#0f172a",
  },
  menuLabelDisabled: {
    color: "#64748b",
  },
  soonBadge: {
    fontSize: 11,
    color: "#94a3b8",
    backgroundColor: "#f1f5f9",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
});
