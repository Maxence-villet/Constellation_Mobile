import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Colors } from "@/app/constants/colors";

const { height } = Dimensions.get("window");

const SLIDES = [
  {
    image: require("../../../assets/images/onboarding/slide1.png"),
    titleLine1: "Votre équipe,",
    titleLine2: "votre univers",
    subtitle: "Créez votre Constellation, rassemblez vos Étoiles et organisez vos projets facilement.",
  },
  {
    image: require("../../../assets/images/onboarding/slide2.png"),
    titleLine1: "Brillez chaque",
    titleLine2: "semaine",
    subtitle: "Gagnez des Points Stellaires en accomplissant vos tâches. Le bilan hebdomadaire récompense les meilleures Étoiles.",
  },
  {
    image: require("../../../assets/images/onboarding/slide3.png"),
    titleLine1: "Chaque tâche",
    titleLine2: "a son étoile",
    subtitle: "Assignez, déléguez, suivez. Chaque membre sait exactement ce qu'il doit accomplir.",
  },
];

const BLOB_SIZE = 120;

export default function OnboardingScreen() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const slide = SLIDES[currentIndex];

  function goToNextSlide() {
    if (currentIndex === SLIDES.length - 1) {
      router.replace("/(tabs)");
    } else {
      setCurrentIndex(currentIndex + 1);
    }
  }

  function skipOnboarding() {
    router.replace("/(tabs)");
  }

  return (
    <View style={styles.screen}>

      <View style={styles.illustrationZone} pointerEvents="none">
        <Image
          source={slide.image}
          style={styles.illustrationImage}
          resizeMode="cover"
        />
      </View>

      <View style={styles.bottomZone}>

        <View style={styles.textContent}>
          <Text style={styles.titleDark}>{slide.titleLine1}</Text>
          <Text style={styles.titleOrange}>{slide.titleLine2}</Text>
          <Text style={styles.subtitle}>{slide.subtitle}</Text>
        </View>

        <SafeAreaView edges={["bottom"]} style={styles.navFixed}>
          <View style={styles.dots}>
            {SLIDES.map((_, i) => (
              <View
                key={i}
                style={[styles.dot, i === currentIndex && styles.dotActive]}
              />
            ))}
          </View>

          <TouchableOpacity onPress={skipOnboarding}>
            <Text style={styles.skipLabel}>Skip</Text>
          </TouchableOpacity>
        </SafeAreaView>

        <TouchableOpacity
          onPress={goToNextSlide}
          style={styles.cornerBlob}
          activeOpacity={0.85}
        >
          <Image
            source={require("../../../assets/images/icons/button.png")}
            style={styles.cornerBlobImage}
            resizeMode="stretch"
          />
        </TouchableOpacity>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#FAFAFA",
  },
  illustrationZone: {
    height: height * 0.56,
    overflow: "hidden",
  },
  illustrationImage: {
    width: "100%",
    height: "100%",
  },
  bottomZone: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    overflow: "hidden",
  },
  textContent: {
    paddingLeft: 28,
    paddingRight: 28,
    paddingTop: 22,
    paddingBottom: 70,
    gap: 10,
  },
  titleDark: {
    fontSize: 30,
    fontWeight: "800",
    fontStyle: "italic",
    color: Colors.light.darkBlue,
    lineHeight: 38,
  },
  titleOrange: {
    fontSize: 30,
    fontWeight: "800",
    fontStyle: "italic",
    color: Colors.home.orange,
    lineHeight: 38,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.home.darkPurple,
    lineHeight: 22,
    opacity: 0.7,
  },
  navFixed: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 70,
    paddingLeft: 28,
    paddingRight: BLOB_SIZE + 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dots: {
    flexDirection: "row",
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.home.darkPurple,
    opacity: 0.35,
  },
  dotActive: {
    width: 24,
    opacity: 1,
    backgroundColor: Colors.light.darkBlue,
  },
  skipLabel: {
    fontSize: 15,
    fontWeight: "500",
    color: Colors.home.darkPurple,
    opacity: 0.55,
  },
  cornerBlob: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: BLOB_SIZE,
    height: BLOB_SIZE,
  },
  cornerBlobImage: {
    width: "100%",
    height: "100%",
  },
});