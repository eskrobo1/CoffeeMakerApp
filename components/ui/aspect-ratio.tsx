import * as React from "react";
import { View, StyleSheet, ViewStyle } from "react-native";

interface AspectRatioProps {
  ratio?: number;
  children: React.ReactNode;
  style?: ViewStyle;
}

export function AspectRatio({ ratio = 1, children, style }: AspectRatioProps) {
  return (
    <View style={[styles.container, style]}>
      <View style={[styles.content, { aspectRatio: ratio }]}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  content: {
    width: "100%",
  },
});
