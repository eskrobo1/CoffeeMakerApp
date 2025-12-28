import React from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import { Droplets, Coffee, Thermometer } from "lucide-react-native";
import { useTheme, Shadows } from "../constants/Theme";

interface DeviceStatusProps {
  isOn: boolean;
  isBrewing: boolean;
  waterLevel: number;
  beansLevel: number;
}

export function DeviceStatus({
  isOn,
  isBrewing,
  waterLevel,
  beansLevel,
}: DeviceStatusProps) {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.card,
          Shadows.lg,
          { backgroundColor: colors.card, borderColor: colors.border },
        ]}
      >
        {/* Status & Temperature */}
        <View style={styles.statusRow}>
          <View>
            <Text style={[styles.label, { color: colors.mutedForeground }]}>
              Status
            </Text>
            <Text
              style={[
                styles.statusValue,
                {
                  color: isBrewing
                    ? "#16a34a"
                    : isOn
                    ? "#16a34a"
                    : colors.mutedForeground,
                },
              ]}
            >
              {isBrewing ? "Brewing..." : isOn ? "Ready" : "Off"}
            </Text>
          </View>
          <View style={styles.temperatureSection}>
            <Text style={[styles.label, { color: colors.mutedForeground }]}>
              Temperature
            </Text>
            <View style={styles.temperatureRow}>
              <Thermometer size={16} color="#ea580c" />
              <Text
                style={[styles.temperatureValue, { color: colors.foreground }]}
              >
                {isOn ? "92°C" : "--°C"}
              </Text>
            </View>
          </View>
        </View>

        {/* Brewing Progress */}
        {isBrewing && (
          <View style={styles.brewingSection}>
            <View style={styles.progressBar}>
              <View style={styles.progressFill} />
            </View>
            <Text
              style={[styles.brewingText, { color: colors.mutedForeground }]}
            >
              Brewing your perfect cup...
            </Text>
          </View>
        )}

        {/* Levels */}
        <View style={styles.levelsGrid}>
          {/* Water Level */}
          <View style={styles.levelCard}>
            <View style={styles.levelHeader}>
              <Droplets size={16} color="#2563eb" />
              <Text
                style={[styles.levelLabel, { color: colors.mutedForeground }]}
              >
                Water
              </Text>
            </View>
            <View style={styles.levelBar}>
              <View
                style={[
                  styles.levelFill,
                  { width: `${waterLevel}%`, backgroundColor: "#2563eb" },
                ]}
              />
            </View>
            <Text style={[styles.levelValue, { color: colors.foreground }]}>
              {waterLevel}%
            </Text>
          </View>

          {/* Beans Level */}
          <View style={[styles.levelCard, { backgroundColor: "#fef3c7" }]}>
            <View style={styles.levelHeader}>
              <Coffee size={16} color="#92400e" />
              <Text
                style={[styles.levelLabel, { color: colors.mutedForeground }]}
              >
                Beans
              </Text>
            </View>
            <View style={[styles.levelBar, { backgroundColor: "#fde68a" }]}>
              <View
                style={[
                  styles.levelFill,
                  { width: `${beansLevel}%`, backgroundColor: "#92400e" },
                ]}
              />
            </View>
            <Text style={[styles.levelValue, { color: colors.foreground }]}>
              {beansLevel}%
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    marginTop: -16,
  },
  card: {
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
  },
  statusRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    marginBottom: 4,
  },
  statusValue: {
    fontSize: 18,
    fontWeight: "600",
  },
  temperatureSection: {
    alignItems: "flex-end",
  },
  temperatureRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  temperatureValue: {
    fontSize: 18,
    fontWeight: "600",
  },
  brewingSection: {
    marginBottom: 24,
  },
  progressBar: {
    width: "100%",
    height: 8,
    backgroundColor: "#e5e7eb",
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 8,
  },
  progressFill: {
    width: "75%",
    height: "100%",
    backgroundColor: "#ea580c",
    borderRadius: 4,
  },
  brewingText: {
    fontSize: 14,
    textAlign: "center",
  },
  levelsGrid: {
    flexDirection: "row",
    gap: 16,
  },
  levelCard: {
    flex: 1,
    backgroundColor: "#dbeafe",
    borderRadius: 16,
    padding: 16,
  },
  levelHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  levelLabel: {
    fontSize: 14,
  },
  levelBar: {
    width: "100%",
    height: 8,
    backgroundColor: "#bfdbfe",
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 8,
  },
  levelFill: {
    height: "100%",
    borderRadius: 4,
  },
  levelValue: {
    fontSize: 14,
    fontWeight: "600",
  },
});
