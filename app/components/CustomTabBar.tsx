import React, { useRef, useState, useMemo, useCallback } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
} from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import Animated, {
  useAnimatedStyle,
  withTiming,
  interpolate,
  useSharedValue,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import BottomSheet, {
  BottomSheetView,
  BottomSheetBackdropProps,
} from '@gorhom/bottom-sheet';
import { BlurView } from 'expo-blur';
import { Colors } from '@/app/constants/colors';

// Backdrop personnalisé avec flou
const CustomBackdrop = (props: BottomSheetBackdropProps) => {
  const { animatedIndex, style, pressBehavior, onPress } = props;
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(animatedIndex.value, [-1, 0], [0, 0.7]),
  }));

  return (
    <TouchableWithoutFeedback
      onPress={pressBehavior === 'close' ? onPress : undefined}
    >
      <Animated.View style={[style, animatedStyle]}>
        <BlurView intensity={90} tint="dark" style={StyleSheet.absoluteFill} />
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

const CustomTabBar = ({ state, navigation }: BottomTabBarProps) => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => [220], []);

  // Valeur partagée pour l'animation du bouton
  const rotation = useSharedValue(0);

  const handlePlusPress = useCallback(() => {
    if (isSheetOpen) {
      bottomSheetRef.current?.close();
    } else {
      bottomSheetRef.current?.expand();
    }
    setIsSheetOpen(!isSheetOpen);
    rotation.value = withTiming(isSheetOpen ? 0 : 45, { duration: 300 });
  }, [isSheetOpen]);

  const handleSheetChange = useCallback((index: number) => {
    if (index === -1) {
      setIsSheetOpen(false);
      rotation.value = withTiming(0, { duration: 300 });
    }
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  const renderTabItem = (routeName: string, index: number) => {
    const isFocused = state.index === index;

    const onPress = () => {
      const event = navigation.emit({
        type: 'tabPress',
        target: routeName,
        canPreventDefault: true,
      });

      if (!isFocused && !event.defaultPrevented) {
        navigation.navigate(routeName);
      }
    };

    let iconName: keyof typeof Ionicons.glyphMap = 'home-outline';
    let focusedIconName: keyof typeof Ionicons.glyphMap = 'home';

    switch (routeName) {
      case 'index':
        iconName = 'home-outline';
        focusedIconName = 'home';
        break;
      case 'planning':
        iconName = 'folder-outline';
        focusedIconName = 'folder';
        break;
      case 'chat':
        iconName = 'chatbubble-outline';
        focusedIconName = 'chatbubble';
        break;
      case 'profile':
        iconName = 'person-outline';
        focusedIconName = 'person';
        break;
    }

    return (
      <TouchableOpacity
        key={routeName}
        onPress={onPress}
        style={styles.tabItem}
        activeOpacity={0.7}
      >
        <Ionicons
          name={isFocused ? focusedIconName : iconName}
          size={24}
          color={isFocused ? Colors.light.darkBlue : Colors.light.mediumGray}
        />
      </TouchableOpacity>
    );
  };

  return (
    <>
      <View style={styles.tabBarContainer}>
        <View style={styles.leftTabs}>
          {renderTabItem('index', 0)}
          {renderTabItem('planning', 1)}
        </View>

        <TouchableOpacity
          onPress={handlePlusPress}
          style={styles.centralButton}
          activeOpacity={0.9}
        >
          <Animated.View style={[styles.centralButtonInner, animatedStyle]}>
            <Ionicons
              name={isSheetOpen ? 'close' : 'add'}
              size={32}
              color={Colors.light.white}
            />
          </Animated.View>
        </TouchableOpacity>

        <View style={styles.rightTabs}>
          {renderTabItem('chat', 2)}
          {renderTabItem('profile', 3)}
        </View>
      </View>

      {/* Conteneur avec pointerEvents conditionnel pour éviter de bloquer les clics quand le sheet est fermé */}
      <View
        pointerEvents={isSheetOpen ? 'auto' : 'none'}
        style={StyleSheet.absoluteFill}
      >
        <BottomSheet
          ref={bottomSheetRef}
          index={-1}
          snapPoints={snapPoints}
          enablePanDownToClose
          backgroundStyle={styles.bottomSheetBackground}
          handleIndicatorStyle={styles.bottomSheetIndicator}
          onChange={handleSheetChange}
          backdropComponent={CustomBackdrop}
        >
          <BottomSheetView style={styles.bottomSheetContent}>
            <TouchableOpacity style={styles.optionItem}>
              <Ionicons name="checkbox-outline" size={28} color={Colors.light.darkBlue} />
              <Text style={styles.optionText}>Ajouter une tâche</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.optionItem}>
              <Ionicons name="star-outline" size={28} color={Colors.light.darkBlue} />
              <Text style={styles.optionText}>Créer une constellation</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.optionItem}>
              <Ionicons name="document-outline" size={28} color={Colors.light.darkBlue} />
              <Text style={styles.optionText}>Importer un document</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.optionItem}>
              <Ionicons name="calendar-outline" size={28} color={Colors.light.darkBlue} />
              <Text style={styles.optionText}>Définir un rendez-vous</Text>
            </TouchableOpacity>
          </BottomSheetView>
        </BottomSheet>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  tabBarContainer: {
    flexDirection: 'row',
    height: 70,
    backgroundColor: Colors.light.white,
    borderTopWidth: 1,
    borderTopColor: Colors.light.lightGray,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 8,
  },
  leftTabs: {
    flexDirection: 'row',
    flex: 1,
    gap: 20,
  },
  rightTabs: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'flex-end',
    gap: 20,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 40,
  },
  centralButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.light.darkBlue,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 10,
  },
  centralButtonInner: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomSheetBackground: {
    backgroundColor: Colors.light.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 20,
  },
  bottomSheetIndicator: {
    width: 40,
    height: 4,
    backgroundColor: Colors.light.mediumGray,
    opacity: 0.5,
  },
  bottomSheetContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 12,
    gap: 20,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingVertical: 8,
  },
  optionText: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.light.darkBlue,
  },
});

export default CustomTabBar;