import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Home, Clock, User, Shield } from "lucide-react-native";
import { useTheme } from "../constants/Theme";

type UserType = "guest" | "registered" | "admin";

interface BottomNavProps {
  activeScreen: string;
  userType: UserType;
  onNavigate: (screen: string) => void;
}

export function BottomNav({
  activeScreen,
  userType,
  onNavigate,
}: BottomNavProps) {
  const { colors } = useTheme();

  const isActive = (screen: string) => {
    return (
      activeScreen === screen ||
      (screen === "home" && activeScreen === "customize") ||
      (screen === "admin" &&
        ["analytics", "supplies", "availability"].includes(activeScreen))
    );
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.background, borderTopColor: "#f3f4f6" },
      ]}
    >
      <View
        style={[styles.content, userType === "admin" && styles.contentAdmin]}
      >
        <TouchableOpacity
          onPress={() => onNavigate("home")}
          style={styles.button}
        >
          <Home
            size={24}
            color={isActive("home") ? "#000000" : "#9ca3af"}
            fill={isActive("home") ? "#000000" : "transparent"}
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => onNavigate("history")}
          style={styles.button}
        >
          <Clock
            size={24}
            color={isActive("history") ? "#000000" : "#9ca3af"}
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => onNavigate("profile")}
          style={styles.button}
        >
          <User size={24} color={isActive("profile") ? "#000000" : "#9ca3af"} />
        </TouchableOpacity>

        {userType === "admin" && (
          <TouchableOpacity
            onPress={() => onNavigate("admin")}
            style={styles.button}
          >
            <Shield
              size={24}
              color={isActive("admin") ? "#000000" : "#9ca3af"}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderTopWidth: 1,
    paddingHorizontal: 32,
    paddingVertical: 12,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  content: {
    flexDirection: "row",
    justifyContent: "space-around",
    gap: 16,
  },
  contentAdmin: {
    justifyContent: "space-between",
  },
  button: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
  },
});
