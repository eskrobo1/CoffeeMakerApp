// components/BottomNavigation.tsx
import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native";
import { Home, Clock, User, Shield } from "lucide-react-native";
import { useTheme } from "../constants/Theme";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BOTTOM_NAV_HEIGHT } from "../styles/globalStyles";

interface BottomNavigationProps {
  activeTab: "home" | "history" | "profile" | "admin";
  onTabChange: (tab: "home" | "history" | "profile" | "admin") => void;
  userType: "guest" | "registered" | "admin";
}

export function BottomNavigation({
  activeTab,
  onTabChange,
  userType,
}: BottomNavigationProps) {
  const { colors, typography } = useTheme();
  const insets = useSafeAreaInsets();

  const tabs = [
    { id: "home", icon: Home, label: "Home", color: "#D97706" },
    { id: "history", icon: Clock, label: "History", color: "#D97706" },
    { id: "profile", icon: User, label: "Profile", color: "#D97706" },
  ];

  if (userType === "admin") {
    tabs.push({ id: "admin", icon: Shield, label: "Admin", color: "#9333EA" });
  }

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
          borderTopColor: colors.border,
          height: BOTTOM_NAV_HEIGHT + insets.bottom,
          paddingBottom: insets.bottom,
        },
      ]}
    >
      <View style={styles.content}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;

          return (
            <TouchableOpacity
              key={tab.id}
              onPress={() => {
                console.log(`✅ Tab clicked: ${tab.id}`);
                onTabChange(tab.id as any);
              }}
              style={[
                styles.tab,
                {
                  backgroundColor: isActive
                    ? tab.id === "admin"
                      ? "#F3E8FF"
                      : "#FEF3C7"
                    : "transparent",
                  borderRadius: typography.borderRadius.xl,
                },
              ]}
              activeOpacity={0.6}
              hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
            >
              <Icon size={22} color={isActive ? tab.color : "#6B7280"} />
              <Text
                style={[
                  styles.tabLabel,
                  { color: isActive ? tab.color : "#6B7280" },
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderTopWidth: 1,
    paddingHorizontal: 8,
    paddingTop: 8,
    zIndex: 999, // VAŽNO: Stavi iznad svega
    elevation: 10, // Android shadow
    shadowColor: "#000", // iOS shadow
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  content: {
    flexDirection: "row",
    gap: 6,
    paddingHorizontal: 4,
  },
  tab: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 10,
    minHeight: 60, // Minimalna visina za lak klik
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: "500",
  },
});
