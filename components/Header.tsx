// components/Header.tsx
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Power } from "lucide-react-native";
import { useTheme } from "../constants/Theme";

interface HeaderProps {
  isDeviceOn: boolean;
  onTogglePower: () => void;
}

export function Header({ isDeviceOn, onTogglePower }: HeaderProps) {
  const { colors, textStyles, typography } = useTheme();

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View>
          <Text style={[textStyles.h1, styles.title]}>BrewMaster</Text>
          <Text style={[textStyles.small, styles.subtitle]}>
            Smart Coffee Maker
          </Text>
        </View>

        <TouchableOpacity
          onPress={onTogglePower}
          style={[
            styles.powerButton,
            {
              backgroundColor: isDeviceOn
                ? "rgba(255, 255, 255, 0.2)"
                : "rgba(255, 255, 255, 0.1)",
            },
          ]}
          activeOpacity={0.7}
        >
          <Power
            size={24}
            color={isDeviceOn ? "#ffffff" : "rgba(255, 255, 255, 0.5)"}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#8B4513", // Amber-900 to Orange-800 gradient approximation
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 32,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    color: "#ffffff",
    marginBottom: 4,
  },
  subtitle: {
    color: "#FCD34D", // Amber-200
    fontSize: 14,
  },
  powerButton: {
    padding: 12,
    borderRadius: 50,
  },
});
