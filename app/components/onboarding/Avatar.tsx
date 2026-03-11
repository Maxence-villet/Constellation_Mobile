import React from "react";
import { Image, ImageSourcePropType, View } from "react-native";

interface AvatarProps {
    source: ImageSourcePropType;
    size?: number;
    top?: number;
    left?: number;
    right?: number;
    bottom?: number;
    borderColor?: string;
}

export function Avatar({
    source,
    size = 64,
    top,
    left,
    right,
    bottom,
    borderColor = "#FFFFFF",
}: AvatarProps) {
   
    return (
    <View
      style={{
        position: "absolute",
        width: size,
        height: size,
        borderRadius: size / 2,
        borderWidth: 3,
        borderColor,
        overflow: "hidden",
        top,
        left,
        right,
        bottom,
      }}
    >
        <Image
            source={source}
            style={{ width: "100%", height: "100%" }}
            resizeMode="cover"
        />
    </View>
    );
}