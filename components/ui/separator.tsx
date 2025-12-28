import React from "react";
import { View, StyleSheet } from "react-native";

interface SeparatorProps {
  orientation?: "horizontal" | "vertical";
}

export function Separator({ orientation = "horizontal" }: SeparatorProps) {
  return (
    <View
      style={[
        styles.base,
        orientation === "horizontal" ? styles.horizontal : styles.vertical,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: "#E5E7EB", // border color
    flexShrink: 0,
  },
  horizontal: {
    height: StyleSheet.hairlineWidth,
    width: "100%",
  },
  vertical: {
    width: StyleSheet.hairlineWidth,
    height: "100%",
  },
});
