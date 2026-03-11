import React from "react";
import { View } from "react-native";

interface DotProps {
    size: number;
    color: string;
    top?: number;
    left?: number;
    right?: number;
    bottom?: number;
}


export function Dot({ size, color, top, left, right, bottom }: DotProps) {
    return (
        <View
            style={{
                position: "absolute",
                width: size,
                height: size,
                borderRadius: size / 2,
                backgroundColor: color,
                top,
                left,
                right,
                bottom,
            }}
        >
        </View>
    )
}