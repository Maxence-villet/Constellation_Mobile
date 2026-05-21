import { LinearGradient } from "expo-linear-gradient";
import { Link } from "expo-router";
import React from "react";
import {
  Image,
  ImageBackground,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedText } from "./components/themed-text";
import { ThemedView } from "./components/themed-view";
import Button from "./components/ui/button";
import { Colors } from "./constants/colors";

export default function WelcomeScreen() {
  return (
    <LinearGradient
      colors={[
        Colors.home.darkBlue,
        Colors.home.mediumBlue,
        Colors.home.lightPurple,
      ]}
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

          <Text style={styles.tagline}>
            METTEZ DE L'ORDRE DANS VOTRE UNIVERS
          </Text>
        </View>

        <View style={styles.actionsSection}>
          <Link href="/OnboardingScreen">
            <Button
              label="Commencer l'aventure"
              icon="◆"
              variant="primary"
              // onPress={}
            />
          </Link>

          <ThemedView>
            <ThemedText type="title">
              <Link href="/OnboardingScreen">
                <ThemedText type="title">Voici mon exemple toto</ThemedText>
              </Link>
            </ThemedText>
          </ThemedView>

          <Divider />

          <Button
            label="J'ai déjà un compte"
            variant="secondary"
            // onPress={console.log("Pressed")}
          />

          <Button
            label="Créer un compte"
            variant="secondary"
            // onPress={console.log("")}
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
