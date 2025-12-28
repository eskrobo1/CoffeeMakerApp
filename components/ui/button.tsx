// components/ui/Button.tsx
import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  TouchableOpacityProps,
  ViewStyle,
  TextStyle,
} from "react-native";
import { useTheme } from "../../constants/Theme";

export interface ButtonProps extends TouchableOpacityProps {
  variant?: "default" | "ghost" | "outline" | "destructive";
  children: React.ReactNode;
}

export const Button = React.forwardRef<
  React.ComponentRef<typeof TouchableOpacity>,
  ButtonProps
>(({ variant = "default", children, style, ...props }, ref) => {
  const { colors, typography } = useTheme();

  const variantStyles: Record<string, ViewStyle> = {
    default: {
      backgroundColor: colors.primary,
    },
    ghost: {
      backgroundColor: "transparent",
    },
    outline: {
      backgroundColor: colors.background,
      borderWidth: 2,
      borderColor: colors.input,
    },
    destructive: {
      backgroundColor: colors.destructive,
    },
  };

  const textVariantStyles: Record<string, TextStyle> = {
    default: {
      color: colors.primaryForeground,
    },
    ghost: {
      color: colors.accentForeground,
    },
    outline: {
      color: colors.accentForeground,
    },
    destructive: {
      color: colors.destructiveForeground,
    },
  };

  return (
    <TouchableOpacity
      ref={ref}
      style={[
        styles.button,
        { borderRadius: typography.borderRadius.md },
        variantStyles[variant],
        style,
      ]}
      activeOpacity={0.7}
      {...props}
    >
      {typeof children === "string" ? (
        <Text style={[styles.text, textVariantStyles[variant]]}>
          {children}
        </Text>
      ) : (
        children
      )}
    </TouchableOpacity>
  );
});

Button.displayName = "Button";

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  text: {
    fontSize: 16,
    fontWeight: "500",
  },
});
