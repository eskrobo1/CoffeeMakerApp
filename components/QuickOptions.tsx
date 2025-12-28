import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Coffee, Sparkles, Moon, Zap } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";

interface QuickOptionsProps {
  disabled: boolean;
  onBrew: () => void;
}

interface Preset {
  name: string;
  icon: typeof Zap;
  colors: readonly [string, string];
}

export function QuickOptions({ disabled, onBrew }: QuickOptionsProps) {
  const presets: Preset[] = [
    { name: "Espresso", icon: Zap, colors: ["#ef4444", "#f97316"] },
    { name: "Cappuccino", icon: Coffee, colors: ["#d97706", "#ea580c"] },
    { name: "Latte", icon: Sparkles, colors: ["#ca8a04", "#d97706"] },
    { name: "Decaf", icon: Moon, colors: ["#a855f7", "#ec4899"] },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Quick Presets</Text>
      <View style={styles.grid}>
        {presets.map((preset) => {
          const IconComponent = preset.icon;
          return (
            <TouchableOpacity
              key={preset.name}
              onPress={onBrew}
              disabled={disabled}
              activeOpacity={0.8}
              style={styles.buttonWrapper}
            >
              <LinearGradient
                colors={preset.colors}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[styles.button, disabled && styles.buttonDisabled]}
              >
                <IconComponent size={24} color="#ffffff" style={styles.icon} />
                <Text style={styles.buttonText}>{preset.name}</Text>
              </LinearGradient>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 16,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  buttonWrapper: {
    width: "48%",
    aspectRatio: 1.2,
  },
  button: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  icon: {
    marginBottom: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
  },
});
