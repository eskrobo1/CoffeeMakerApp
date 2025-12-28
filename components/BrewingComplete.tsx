import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useTheme } from "../constants/Theme";
import { Button } from "./ui/button";

interface BrewingCompleteProps {
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
  onDone: () => void;
}

// Coffee cup SVG component
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

// Checkmark icon
const CheckmarkIcon = () => (
  <View style={styles.checkmarkContainer}>
    <View style={styles.checkmarkStroke} />
    <View style={styles.checkmarkStem} />
  </View>
);

export function BrewingComplete({
  drinkName,
  measurements,
  size,
  strength,
  milkType,
  onDone,
}: BrewingCompleteProps) {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.greeting, { color: colors.foreground }]}>
          Hello, Guest
        </Text>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Drink Image */}
        <View style={styles.drinkImageContainer}>
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

        {/* Recipe Summary */}
        <View style={[styles.recipeSummary, { backgroundColor: colors.muted }]}>
          <Text style={[styles.recipeText, { color: colors.mutedForeground }]}>
            Size: {size}, {strength} strength, {milkType} milk
          </Text>
        </View>

        {/* Success Icon */}
        <View style={styles.successIcon}>
          <CheckmarkIcon />
        </View>

        {/* Message */}
        <Text style={[styles.successTitle, { color: colors.foreground }]}>
          Enjoy your coffee
        </Text>
        <Text
          style={[styles.successMessage, { color: colors.mutedForeground }]}
        >
          Don't forget to put a cup{"\n"}for the next brew.
        </Text>
      </ScrollView>

      {/* Done Button */}
      <View style={styles.footer}>
        <Button onPress={onDone} style={styles.doneButton}>
          Done
        </Button>
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
  },
  scrollContent: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  drinkImageContainer: {
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
  recipeSummary: {
    width: "100%",
    borderRadius: 16,
    padding: 16,
    marginBottom: 32,
  },
  recipeText: {
    fontSize: 14,
    textAlign: "center",
  },
  successIcon: {
    width: 80,
    height: 80,
    backgroundColor: "#10b981",
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  checkmarkContainer: {
    width: 40,
    height: 40,
    position: "relative",
  },
  checkmarkStroke: {
    position: "absolute",
    width: 3,
    height: 12,
    backgroundColor: "#ffffff",
    borderRadius: 2,
    transform: [{ rotate: "45deg" }],
    left: 12,
    top: 20,
  },
  checkmarkStem: {
    position: "absolute",
    width: 3,
    height: 24,
    backgroundColor: "#ffffff",
    borderRadius: 2,
    transform: [{ rotate: "-45deg" }],
    left: 22,
    top: 8,
  },
  successTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 8,
  },
  successMessage: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 21,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  doneButton: {
    width: "100%",
    height: 56,
    backgroundColor: "#000000",
    borderRadius: 28,
  },
});
