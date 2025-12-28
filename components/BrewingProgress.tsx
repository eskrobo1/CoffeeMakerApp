import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "../constants/Theme";
import Svg, { Circle } from "react-native-svg";

interface BrewingProgressProps {
  drinkName: string;
  measurements: {
    water: number;
    milk: number;
    milkFoam: number;
    coffee: number;
    sugar: number;
  };
  size: string;
  strength: string;
  milkType: string;
  onComplete: () => void;
}

const LargeCoffeeCup = () => (
  <View
    style={{
      width: 70,
      height: 90,
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <View
      style={{
        width: 56,
        height: 75,
        backgroundColor: "#C4A484",
        borderRadius: 10,
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
      }}
    />
    <View
      style={{
        position: "absolute",
        top: 0,
        width: 62,
        height: 12,
        backgroundColor: "#E5E7EB",
        borderRadius: 50,
      }}
    />
  </View>
);

export function BrewingProgress({
  drinkName,
  measurements,
  size,
  strength,
  milkType,
  onComplete,
}: BrewingProgressProps) {
  const { colors } = useTheme();
  const [progress, setProgress] = useState(0);
  const [timeLeft, setTimeLeft] = useState(45);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => onComplete(), 500);
          return 100;
        }
        return prev + 2;
      });

      setTimeLeft((prev) => Math.max(0, prev - 1));
    }, 450);

    return () => clearInterval(timer);
  }, [onComplete]);

  const radius = 56;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress / 100);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.greeting, { color: colors.foreground }]}>
          Hello, Guest
        </Text>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Drink Image */}
        <View style={styles.drinkImage}>
          <LargeCoffeeCup />
        </View>

        {/* Drink Name */}
        <Text style={[styles.drinkName, { color: colors.foreground }]}>
          {drinkName}
        </Text>
        <Text
          style={[styles.drinkDescription, { color: colors.mutedForeground }]}
        >
          Espresso mixed with steamed milk.
        </Text>

        {/* Recipe Details */}
        <View style={[styles.recipeCard, { backgroundColor: colors.muted }]}>
          <View style={styles.measurementsGrid}>
            {measurements.coffee > 0 && (
              <View style={styles.measurement}>
                <Text
                  style={[
                    styles.measurementLabel,
                    { color: colors.mutedForeground },
                  ]}
                >
                  Coffee
                </Text>
                <Text
                  style={[
                    styles.measurementValue,
                    { color: colors.foreground },
                  ]}
                >
                  {measurements.coffee.toFixed(1)}g
                </Text>
              </View>
            )}
            {measurements.water > 0 && (
              <View style={styles.measurement}>
                <Text
                  style={[
                    styles.measurementLabel,
                    { color: colors.mutedForeground },
                  ]}
                >
                  Water
                </Text>
                <Text
                  style={[
                    styles.measurementValue,
                    { color: colors.foreground },
                  ]}
                >
                  {measurements.water}ml
                </Text>
              </View>
            )}
            {measurements.milk > 0 && (
              <View style={styles.measurement}>
                <Text
                  style={[
                    styles.measurementLabel,
                    { color: colors.mutedForeground },
                  ]}
                >
                  Milk
                </Text>
                <Text
                  style={[
                    styles.measurementValue,
                    { color: colors.foreground },
                  ]}
                >
                  {measurements.milk}ml
                </Text>
              </View>
            )}
            {measurements.milkFoam > 0 && (
              <View style={styles.measurement}>
                <Text
                  style={[
                    styles.measurementLabel,
                    { color: colors.mutedForeground },
                  ]}
                >
                  Foam
                </Text>
                <Text
                  style={[
                    styles.measurementValue,
                    { color: colors.foreground },
                  ]}
                >
                  {measurements.milkFoam}s
                </Text>
              </View>
            )}
          </View>
          <View
            style={[styles.recipeFooter, { borderTopColor: colors.border }]}
          >
            <Text
              style={[
                styles.recipeFooterText,
                { color: colors.mutedForeground },
              ]}
            >
              {size.charAt(0).toUpperCase() + size.slice(1)} •{" "}
              {strength.charAt(0).toUpperCase() + strength.slice(1)} •{" "}
              {milkType === "regular" ? "Regular milk" : "Plant-based milk"}
            </Text>
          </View>
        </View>

        {/* Queue Position */}
        <View style={styles.queueSection}>
          <Text style={[styles.queueLabel, { color: colors.foreground }]}>
            Queue Position
          </Text>
          <Text style={[styles.queueValue, { color: colors.foreground }]}>
            1 of 1
          </Text>
        </View>

        {/* Circular Progress */}
        <View style={styles.progressContainer}>
          <Svg width={128} height={128} style={styles.progressSvg}>
            <Circle
              cx={64}
              cy={64}
              r={radius}
              stroke={colors.muted}
              strokeWidth={8}
              fill="none"
            />
            <Circle
              cx={64}
              cy={64}
              r={radius}
              stroke="#000000"
              strokeWidth={8}
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              rotation="-90"
              origin="64, 64"
            />
          </Svg>
          <View style={styles.progressText}>
            <Text style={[styles.timeText, { color: colors.foreground }]}>
              {timeLeft}s
            </Text>
          </View>
        </View>

        {/* Status */}
        <Text style={[styles.statusText, { color: colors.foreground }]}>
          Brewing..
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 16,
  },
  greeting: {
    fontSize: 20,
    fontWeight: "600",
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingBottom: 80,
  },
  drinkImage: {
    marginBottom: 16,
  },
  drinkName: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  drinkDescription: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 24,
  },
  recipeCard: {
    width: "100%",
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  measurementsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
  },
  measurement: {
    width: "45%",
  },
  measurementLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  measurementValue: {
    fontSize: 16,
    fontWeight: "500",
  },
  recipeFooter: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
  },
  recipeFooterText: {
    fontSize: 12,
  },
  queueSection: {
    alignItems: "center",
    marginBottom: 24,
  },
  queueLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  queueValue: {
    fontSize: 20,
    fontWeight: "600",
  },
  progressContainer: {
    width: 128,
    height: 128,
    marginBottom: 16,
    position: "relative",
  },
  progressSvg: {
    position: "absolute",
  },
  progressText: {
    position: "absolute",
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  timeText: {
    fontSize: 24,
    fontWeight: "600",
  },
  statusText: {
    fontSize: 16,
  },
});
