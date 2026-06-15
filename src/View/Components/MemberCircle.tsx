// src/View/Components/MemberCircle.tsx
import React from "react";
import { StyleSheet, Text, View } from "react-native";

export interface Props {
  name: string;
}

export default function MemberCircle(props: Props) {
  return (
    <View style={styles.circle}>
      <Text style={styles.name}>{props.name}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  circle: {
    backgroundColor: "#FF660070",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  name: {
    color: "#FF6600",
    fontWeight: "bold",
  },
});
