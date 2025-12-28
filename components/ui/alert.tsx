import * as React from "react";
import { View, Text, StyleSheet, ViewStyle, TextStyle } from "react-native";

interface AlertProps {
  variant?: "default" | "destructive";
  children: React.ReactNode;
  style?: ViewStyle;
}

export function Alert({ variant = "default", children, style }: AlertProps) {
  const variantStyles =
    variant === "destructive" ? styles.destructive : styles.default;

  return (
    <View style={[styles.alert, variantStyles, style]} role="alert">
      {children}
    </View>
  );
}

interface AlertTitleProps {
  children: React.ReactNode;
  style?: TextStyle;
}

export function AlertTitle({ children, style }: AlertTitleProps) {
  return <Text style={[styles.alertTitle, style]}>{children}</Text>;
}

interface AlertDescriptionProps {
  children: React.ReactNode;
  style?: TextStyle;
}

export function AlertDescription({ children, style }: AlertDescriptionProps) {
  return <Text style={[styles.alertDescription, style]}>{children}</Text>;
}

const styles = StyleSheet.create({
  alert: {
    width: "100%",
    borderRadius: 8,
    borderWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 4,
  },
  default: {
    backgroundColor: "#FFFFFF",
    borderColor: "#E5E7EB",
  },
  destructive: {
    backgroundColor: "#FFFFFF",
    borderColor: "#FEE2E2",
  },
  alertTitle: {
    fontSize: 14,
    fontWeight: "500",
    lineHeight: 16,
    marginBottom: 4,
  },
  alertDescription: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 20,
  },
});
