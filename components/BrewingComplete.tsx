// components/BrewingComplete.tsx
import React from "react";
import { View, Text, StyleSheet, ScrollView, Image } from "react-native";
import { useTheme } from "../constants/Theme";
import { Button } from "./ui/button";

interface BrewingCompleteProps {
  drinkId: string;
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
  userName?: string;
  onDone: () => void;
}

// "custom" je namjerno ISKLJUČEN iz drinkImages
// — prikazujemo genericku ☕ ikonicu umjesto slike drugog napitka
const drinkImages: { [key: string]: any } = {
  "caffe-latte": require("../assets/drinks/caffe-latte.png"),
  espresso: require("../assets/drinks/espresso.png"),
  ristretto: require("../assets/drinks/ristretto.png"),
  cortado: require("../assets/drinks/cortado.png"),
  "latte-macchiato": require("../assets/drinks/latte-macchiato.png"),
  coffee: require("../assets/drinks/coffee.png"),
  cappuccino: require("../assets/drinks/cappuccino.png"),
  "cold-brew-coffee": require("../assets/drinks/cold-brew-coffee.png"),
  "espresso-macchiato": require("../assets/drinks/espresso-macchiato.png"),
  "flat-white": require("../assets/drinks/flat-white.png"),
  americano: require("../assets/drinks/americano.png"),
  "lungo-barista": require("../assets/drinks/lungo-barista.png"),
  "sweet-latte": require("../assets/drinks/sweet-latte.png"),
  "espresso-doppio": require("../assets/drinks/espresso-doppio.png"),
  "hot-water": require("../assets/drinks/hot-water.png"),
  "portion-of-milk": require("../assets/drinks/portion-of-milk.png"),
  "portion-of-milk-foam": require("../assets/drinks/portion-of-milk-foam.png"),
};

// Generički prikaz kafe (za custom i nepoznate napitke)
const GenericCoffeeImage = () => (
  <View style={styles.genericImageWrap}>
    <Text style={styles.genericEmoji}>☕</Text>
  </View>
);

export function BrewingComplete({
  drinkId,
  drinkName,
  size,
  strength,
  milkType,
  userName,
  onDone,
}: BrewingCompleteProps) {
  const { colors } = useTheme();

  // Kratki opis napitka ispod naziva
  const drinkDesc = [
    size.charAt(0).toUpperCase() + size.slice(1),
    strength !== "regular" ? strength : null,
    milkType === "plant-based"
      ? "Plant-based milk"
      : milkType === "regular" && drinkId !== "hot-water"
        ? null
        : null,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.greeting, { color: colors.foreground }]}>
          Hello, {userName || "Guest"}
        </Text>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Drink image or generic ☕ for custom */}
        <View style={styles.drinkImageContainer}>
          {drinkImages[drinkId] ? (
            <Image
              source={drinkImages[drinkId]}
              style={styles.drinkImageStyle}
              resizeMode="contain"
            />
          ) : (
            // custom drink ili nepoznati drinkId → generička ☕ ikonica
            <GenericCoffeeImage />
          )}
        </View>

        {/* Drink name */}
        <Text style={[styles.drinkName, { color: colors.foreground }]}>
          {drinkName}
        </Text>
        {drinkDesc ? (
          <Text
            style={[styles.drinkDescription, { color: colors.mutedForeground }]}
          >
            {drinkDesc}
          </Text>
        ) : null}

        {/* ☕ ikonica za "Enjoy" */}
        <View style={styles.coffeeIconWrapper}>
          <Text style={styles.coffeeEmoji}>☕</Text>
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
  container: { flex: 1 },
  header: { paddingHorizontal: 24, paddingTop: 16, paddingBottom: 16 },
  greeting: { fontSize: 20, fontWeight: "600" },
  content: { flex: 1 },
  scrollContent: {
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
  },
  drinkImageContainer: { marginBottom: 16 },
  drinkImageStyle: { width: 120, height: 120 },
  // Generic ☕ za custom napitak
  genericImageWrap: {
    width: 120,
    height: 120,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f3f4f6",
    borderRadius: 60,
  },
  genericEmoji: { fontSize: 56 },
  drinkName: { fontSize: 20, fontWeight: "600", marginBottom: 6 },
  drinkDescription: { fontSize: 13, marginBottom: 32, color: "#6b7280" },
  coffeeIconWrapper: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: "#fef3c7",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
    shadowColor: "#d97706",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  coffeeEmoji: { fontSize: 48, lineHeight: 56 },
  successTitle: { fontSize: 22, fontWeight: "700", marginBottom: 10 },
  successMessage: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 22,
    color: "#6b7280",
  },
  footer: { paddingHorizontal: 24, paddingBottom: 24, paddingTop: 8 },
  doneButton: {
    width: "100%",
    height: 56,
    backgroundColor: "#000000",
    borderRadius: 28,
  },
});
