// styles/globalStyles.ts
import { StyleSheet, Platform } from "react-native";

export const BOTTOM_NAV_HEIGHT = Platform.select({
  ios: 90,
  android: 80,
  default: 80,
});

export const globalStyles = StyleSheet.create({
  screenContainer: {
    flex: 1,
  },
  screenWithBottomNav: {
    flex: 1,
    paddingBottom: BOTTOM_NAV_HEIGHT, // Prostor za bottom navigation
  },
  scrollContentWithBottomNav: {
    paddingBottom: BOTTOM_NAV_HEIGHT + 20, // Extra prostor za scroll
  },
});
