import React from "react";
import { View, StyleSheet, ViewStyle } from "react-native";

interface ProgressProps {
  value?: number;
  height?: number;
  style?: ViewStyle;
  barStyle?: ViewStyle;
}

export function Progress({
  value = 0,
  height = 8,
  style,
  barStyle,
}: ProgressProps) {
  const clampedValue = Math.min(100, Math.max(0, value));

  return (
    <View style={[styles.container, { height }, style]}>
      <View
        style={[
          styles.bar,
          {
            width: `${clampedValue}%`,
          },
          barStyle,
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    borderRadius: 999,
    backgroundColor: "#E5E7EB", // gray-200
    overflow: "hidden",
  },
  bar: {
    height: "100%",
    borderRadius: 999,
    backgroundColor: "#F59E0B", // amber-500
  },
});
