import React from "react";
import {
  View,
  Image,
  Text,
  StyleSheet,
  ImageBackground,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Button } from "../components/ui/button";
import { Colors } from "../constants/colors";

export default function WelcomeScreen() {
  const router = useRouter();

  const handleStart = () => {
    router.push("/(auth)/register");
  };

  const handleLogin = () => {
    router.push("/(auth)/login");
  };

  return (
    <LinearGradient
      colors={[Colors.home.darkBlue, Colors.home.mediumBlue, Colors.home.lightPurple]}
      locations={[0, 0.55, 1]}
      style={styles.gradient}
    >
      <ImageBackground
        source={require("@/assets/images/Artboard/Constellation BG.png")}
        style={StyleSheet.absoluteFill}
        resizeMode="cover"
        imageStyle={{ opacity: 0.35 }}
      />

      <SafeAreaView style={styles.safeArea}>
        <View style={styles.heroSection}>
          <Image
            source={require("@/assets/images/Artboard/Logo.png")}
            style={styles.logo}
            resizeMode="contain"
          />

          <Image
            source={require("@/assets/images/Artboard/Name Logo.png")}
            style={styles.nameLogo}
            resizeMode="contain"
          />

          <Text style={styles.tagline}>METTEZ DE L'ORDRE DANS VOTRE UNIVERS</Text>
        </View>

        <View style={styles.actionsSection}>
          <Button
            label="Commencer l'aventure"
            icon="◆"
            variant="primary"
            onPress={handleStart}
          />

          <Divider />

          <Button
            label="J'ai déjà un compte"
            variant="secondary"
            onPress={handleLogin}
          />
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}


function Divider() {
  return (
    <View style={dividerStyles.row}>
      <View style={dividerStyles.line} />
      <Text style={dividerStyles.label}>ou</Text>
      <View style={dividerStyles.line} />
    </View>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: 28,
  },

  heroSection: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
  },
  logo: {
    width: 180,
    height: 180,
  },
  nameLogo: {
    width: "90%",
    height: 60,
    marginTop: 8,
  },
  tagline: {
    color: Colors.home.white,
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 1.8,
    textAlign: "center",
    opacity: 0.85,
    marginTop: 4,
  },

  actionsSection: {
    paddingBottom: Platform.OS === "android" ? 28 : 12,
    gap: 12,
  },
});

const dividerStyles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginVertical: 4,
  },
  line: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: Colors.home.lightWhite,
  },
  label: {
    color: Colors.home.lightWhite,
    fontSize: 13,
    fontWeight: "500",
  },
});