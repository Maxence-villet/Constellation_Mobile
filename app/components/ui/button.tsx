import react from "react";
import {
    TouchableOpacity,
    Text, 
    StyleSheet,
    ActivityIndicator,
    ViewStyle,
    TextStyle,
    View
} from "react-native";
import { Colors } from "@/app/constants/colors";

type ButtonVariant = "primary" | "secondary";

interface ButtonProps {
    label: string;
    onPress: () => void;
    variant?: ButtonVariant;
    isLoading?: boolean;
    disabled?: boolean;
    style?: ViewStyle;
    textStyle?: TextStyle;
    icon?: string;
}

export function Button({
    label,
    onPress,
    variant = "primary",
    isLoading = false,
    disabled = false,
    style,
    textStyle,
    icon,
}: ButtonProps) {
    const isPrimary = variant === "primary";

    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={disabled || isLoading}
            activeOpacity={0.8}
            style={[
                styles.base,
                isPrimary ? styles.primary : styles.secondary,
                (disabled || isLoading) && styles.disabled,
                style,
            ]}
        >
            {isLoading ? (
                <ActivityIndicator color={isPrimary ? Colors.home.darkBlue : Colors.home.white} />
            ): (
                <Text
                    style={[
                        styles.label,
                        isPrimary ? styles.labelPrimary : styles.labelSecondary,
                        textStyle,
                    ]}
                >
                    {label}
                    {icon && <Text>{icon}</Text>}
                </Text>
            )}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    base:  {
        width: "100%",
        height: 56,
        borderRadius: 28,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 24
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