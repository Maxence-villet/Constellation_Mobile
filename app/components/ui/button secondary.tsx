import { Colors } from "@/app/constants/colors";
import { StyleSheet, Text, TextStyle, View, ViewStyle } from "react-native";

type ButtonVariant = "primary" | "secondary";

interface ButtonProps {
  label: string;
  // onPress: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: string;
}

export default function ButtonSecondary({
  label,
  // onPress,
  variant = "primary",
  disabled = false,
  style,
  textStyle,
  icon,
}: ButtonProps) {
  return (
    <View style={[styles.base, styles.secondary, style]}>
      <Text style={[styles.label, styles.labelSecondary]}>
        {label}
        {icon && <Text>{icon}</Text>}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    width: "100%",
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  primary: {
    backgroundColor: Colors.home.orange,
  },
  secondary: {
    backgroundColor: Colors.home.mediumBlue,
  },
  disabled: {
    opacity: 0.5,
  },
  label: {
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  labelPrimary: {
    color: Colors.home.darkBlue,
  },
  labelSecondary: {
    color: Colors.home.lightWhite,
  },
});
