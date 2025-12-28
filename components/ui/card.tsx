// components/ui/Card.tsx
import React from "react";
import { View, Text, StyleSheet, ViewProps, TextProps } from "react-native";
import { useTheme, Shadows } from "../../constants/Theme";

interface CardProps extends ViewProps {
  children: React.ReactNode;
}

export function Card({ style, children, ...props }: CardProps) {
  const { colors, typography } = useTheme();

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          borderRadius: typography.borderRadius.xl,
        },
        Shadows.md,
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
}

export function CardHeader({ style, children, ...props }: CardProps) {
  return (
    <View style={[styles.cardHeader, style]} {...props}>
      {children}
    </View>
  );
}

export function CardTitle({ style, children, ...props }: TextProps) {
  const { colors } = useTheme();

  return (
    <Text
      style={[styles.cardTitle, { color: colors.cardForeground }, style]}
      {...props}
    >
      {children}
    </Text>
  );
}

export function CardDescription({ style, children, ...props }: TextProps) {
  const { colors } = useTheme();

  return (
    <Text
      style={[styles.cardDescription, { color: colors.mutedForeground }, style]}
      {...props}
    >
      {children}
    </Text>
  );
}

export function CardAction({ style, children, ...props }: CardProps) {
  return (
    <View style={[styles.cardAction, style]} {...props}>
      {children}
    </View>
  );
}

export function CardContent({ style, children, ...props }: CardProps) {
  return (
    <View style={[styles.cardContent, style]} {...props}>
      {children}
    </View>
  );
}

export function CardFooter({ style, children, ...props }: CardProps) {
  const { colors } = useTheme();

  return (
    <View
      style={[styles.cardFooter, { borderTopColor: colors.border }, style]}
      {...props}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "column",
    gap: 24,
    borderWidth: 1,
  },
  cardHeader: {
    paddingHorizontal: 24,
    paddingTop: 24,
    gap: 6,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    lineHeight: 18,
  },
  cardDescription: {
    fontSize: 14,
    lineHeight: 21,
  },
  cardAction: {
    position: "absolute",
    top: 24,
    right: 24,
  },
  cardContent: {
    paddingHorizontal: 24,
  },
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingBottom: 24,
    borderTopWidth: 1,
    paddingTop: 24,
  },
});
