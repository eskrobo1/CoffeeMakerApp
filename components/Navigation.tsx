import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { Home, Calendar, Settings } from "lucide-react-native";
import { useTheme } from "../constants/Theme";

type TabId = "home" | "schedule" | "settings";

interface NavigationProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

export function Navigation({ activeTab, onTabChange }: NavigationProps) {
  const { colors } = useTheme();

  const tabs = [
    { id: "home" as const, label: "Home", icon: Home },
    { id: "schedule" as const, label: "Schedule", icon: Calendar },
    { id: "settings" as const, label: "Settings", icon: Settings },
  ];

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.background, borderTopColor: colors.border },
      ]}
    >
      <View style={styles.content}>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <TouchableOpacity
              key={tab.id}
              onPress={() => onTabChange(tab.id)}
              style={styles.tab}
            >
              <Icon size={24} color={isActive ? "#ea580c" : "#9ca3af"} />
              <Text
                style={[
                  styles.tabLabel,
                  { color: isActive ? "#ea580c" : "#9ca3af" },
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
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
  content: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 8,
  },
  tab: {
    flexDirection: "column",
    alignItems: "center",
    gap: 4,
    paddingVertical: 8,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: "500",
  },
});
