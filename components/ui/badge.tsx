import * as React from "react";
import { View, Text, StyleSheet, ViewStyle, TextStyle } from "react-native";

interface BadgeProps {
  variant?: "default" | "destructive";
  children: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Badge = React.forwardRef<View, BadgeProps>(
  ({ variant = "default", children, style, textStyle }, ref) => {
    const variantStyles =
      variant === "destructive" ? styles.destructive : styles.default;

    const variantTextStyles =
      variant === "destructive" ? styles.destructiveText : styles.defaultText;

    return (
      <View ref={ref} style={[styles.badge, variantStyles, style]}>
        {typeof children === "string" ? (
          <Text style={[styles.badgeText, variantTextStyles, textStyle]}>
            {children}
          </Text>
        ) : (
          children
        )}
      </View>
    );
  }
);

Badge.displayName = "Badge";

const styles = StyleSheet.create({
  badge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    borderRadius: 9999,
    borderWidth: 1,
    paddingVertical: 2,
    paddingHorizontal: 10,
  },
  default: {
    backgroundColor: "#000000",
    borderColor: "transparent",
  },
  destructive: {
    backgroundColor: "#EF4444",
    borderColor: "transparent",
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "500",
  },
  defaultText: {
    color: "#FFFFFF",
  },
  destructiveText: {
    color: "#FFFFFF",
  },
});
