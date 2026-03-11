

import React from "react";
import { View, StyleSheet } from "react-native";

interface BubbleProps {
  width?: number;
  lines?: number;
  top?: number;
  left?: number;
  right?: number;
  bottom?: number;
}

export function Bubble({ width = 180, lines = 2, top, left, right, bottom }: BubbleProps) {
  return (
    <View style={[styles.bubble, { width, top, left, right, bottom }]}>
      {Array.from({ length: lines }).map((_, i) => (
        <View
          key={i}
          style={[styles.line, i === lines - 1 && styles.lineShort]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  bubble: {
    position: "absolute",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 14,
    gap: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  line: {
    height: 8,
    borderRadius: 4,
    backgroundColor: "#E5E5EF",
    width: "85%",
  },
  lineShort: {
    width: "55%",
  },
});