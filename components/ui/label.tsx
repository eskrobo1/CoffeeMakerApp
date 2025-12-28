import * as React from "react";
import { Text, StyleSheet, TextStyle } from "react-native";

interface LabelProps {
  children: React.ReactNode;
  htmlFor?: string;
  style?: TextStyle;
}

export function Label({ children, htmlFor, style }: LabelProps) {
  return <Text style={[styles.label, style]}>{children}</Text>;
}

const styles = StyleSheet.create({
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#000000",
    marginBottom: 4,
  },
});
