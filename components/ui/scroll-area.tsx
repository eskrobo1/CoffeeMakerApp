import React from "react";
import { ScrollView, View, StyleSheet } from "react-native";

interface ScrollAreaProps {
  children: React.ReactNode;
  horizontal?: boolean;
  contentContainerStyle?: object;
}

export function ScrollArea({
  children,
  horizontal = false,
  contentContainerStyle,
}: ScrollAreaProps) {
  return (
    <ScrollView
      horizontal={horizontal}
      showsVerticalScrollIndicator={!horizontal}
      showsHorizontalScrollIndicator={horizontal}
      contentContainerStyle={[styles.content, contentContainerStyle]}
    >
      {children}
    </ScrollView>
  );
}

/**
 * ScrollBar u React Native ne postoji kao custom komponenta.
 * Ostavljen je samo radi API kompatibilnosti.
 */
export function ScrollBar() {
  return null;
}

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
  },
});
