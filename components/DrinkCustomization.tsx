import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { ArrowLeft, Heart } from "lucide-react-native";
import { useTheme } from "../constants/Theme";
import { Button } from "./ui/button";
import Slider from "@react-native-community/slider";

interface DrinkCustomizationProps {
  drinkId: string;
  onBack: () => void;
  onStartBrew: (config: any) => void;
  onToggleFavorite?: (drinkId: string) => void;
  isFavorite?: boolean;
}

type Size = "small" | "medium" | "large";
type Strength = "light" | "regular" | "strong";
type MilkType = "regular" | "plant-based";

// Mock drink data - you'll need to create data/drinkMeasurements.ts
const mockDrink = {
  id: "caffe-latte",
  name: "Caffè Latte",
  description: "Espresso mixed with steamed milk",
  small: { water: 30, milk: 120, milkFoam: 5, coffee: 7.5 },
  medium: { water: 50, milk: 200, milkFoam: 8, coffee: 15 },
  large: { water: 70, milk: 280, milkFoam: 10, coffee: 22.5 },
};

const CoffeeCup = ({ color = "#C4A484" }: { color?: string }) => (
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
        backgroundColor: color,
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

export function DrinkCustomization({
  drinkId,
  onBack,
  onStartBrew,
  onToggleFavorite,
  isFavorite,
}: DrinkCustomizationProps) {
  const { colors } = useTheme();
  const [size, setSize] = useState<Size>("medium");
  const [strength, setStrength] = useState<Strength>("regular");
  const [milkType, setMilkType] = useState<MilkType>("regular");
  const [milkAmount, setMilkAmount] = useState(50);
  const [sugar, setSugar] = useState(0);
  const [foamLevel, setFoamLevel] = useState(50);

  const drink = mockDrink;
  const measurements = drink[size];

  const handleMake = () => {
    onStartBrew({
      drinkId,
      drinkName: drink.name,
      size,
      strength,
      milkType,
      measurements: {
        water: measurements.water,
        milk: Math.round(measurements.milk * (milkAmount / 100)),
        milkFoam: Math.round(measurements.milkFoam * (foamLevel / 100)),
        coffee:
          measurements.coffee *
          (strength === "light" ? 0.8 : strength === "strong" ? 1.2 : 1),
        sugar,
      },
    });
  };

  const getDrinkColor = () => {
    if (drinkId.includes("latte") || drinkId.includes("macchiato"))
      return "#C4A484";
    if (drinkId.includes("milk")) return "#F5F5F5";
    return "#6F4E37";
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <ArrowLeft size={20} color={colors.foreground} />
        </TouchableOpacity>
        <Text style={[styles.greeting, { color: colors.foreground }]}>
          Hello, Guest
        </Text>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Drink Image */}
        <View style={styles.drinkSection}>
          <CoffeeCup color={getDrinkColor()} />
          <Text style={[styles.drinkName, { color: colors.foreground }]}>
            {drink.name}
          </Text>
          <Text
            style={[styles.drinkDescription, { color: colors.mutedForeground }]}
          >
            {drink.description}
          </Text>
          {onToggleFavorite && (
            <TouchableOpacity
              onPress={() => onToggleFavorite(drinkId)}
              style={[
                styles.favoriteButton,
                { backgroundColor: isFavorite ? "#ef4444" : colors.muted },
              ]}
            >
              <Heart
                size={16}
                color={isFavorite ? "#ffffff" : "#000000"}
                fill={isFavorite ? "#ffffff" : "transparent"}
              />
            </TouchableOpacity>
          )}
        </View>

        {/* Size Selection */}
        <View style={styles.section}>
          <Text style={[styles.label, { color: colors.foreground }]}>Size</Text>
          <View style={styles.buttonGrid}>
            {(["small", "medium", "large"] as Size[]).map((s) => (
              <TouchableOpacity
                key={s}
                onPress={() => setSize(s)}
                style={[
                  styles.sizeButton,
                  { borderColor: size === s ? "#000000" : colors.border },
                ]}
              >
                <View
                  style={{
                    width: s === "small" ? 30 : s === "medium" ? 35 : 40,
                    height: 40,
                    backgroundColor: size === s ? "#000000" : colors.muted,
                    borderRadius: 8,
                  }}
                />
                <Text style={[styles.buttonText, { color: colors.foreground }]}>
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Strength */}
        <View style={styles.section}>
          <Text style={[styles.label, { color: colors.foreground }]}>
            Flavour
          </Text>
          <View style={styles.buttonGrid}>
            {(["light", "regular", "strong"] as Strength[]).map((str) => (
              <TouchableOpacity
                key={str}
                onPress={() => setStrength(str)}
                style={[
                  styles.optionButton,
                  { borderColor: strength === str ? "#000000" : colors.border },
                ]}
              >
                <View
                  style={{
                    width: 30,
                    height: 30,
                    backgroundColor:
                      strength === str ? "#000000" : colors.muted,
                    borderRadius: 15,
                  }}
                />
                <Text style={[styles.buttonText, { color: colors.foreground }]}>
                  {str.charAt(0).toUpperCase() + str.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Milk Type */}
        {measurements.milk > 0 && (
          <View style={styles.section}>
            <Text style={[styles.label, { color: colors.foreground }]}>
              Milk type
            </Text>
            <View style={styles.buttonGrid}>
              {(["regular", "plant-based"] as MilkType[]).map((type) => (
                <TouchableOpacity
                  key={type}
                  onPress={() => setMilkType(type)}
                  style={[
                    styles.milkButton,
                    {
                      borderColor:
                        milkType === type ? "#000000" : colors.border,
                    },
                  ]}
                >
                  <Text
                    style={[styles.buttonText, { color: colors.foreground }]}
                  >
                    {type === "regular" ? "Regular" : "Plant based"}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Milk Amount */}
        {measurements.milk > 0 && (
          <View style={styles.section}>
            <Text style={[styles.label, { color: colors.foreground }]}>
              Milk Amount
            </Text>
            <Slider
              value={milkAmount}
              onValueChange={setMilkAmount}
              minimumValue={0}
              maximumValue={100}
              minimumTrackTintColor="#000000"
              maximumTrackTintColor={colors.muted}
              thumbTintColor="#000000"
              style={styles.slider}
            />
            <View style={styles.sliderLabels}>
              <Text
                style={[styles.sliderLabel, { color: colors.mutedForeground }]}
              >
                Less
              </Text>
              <Text
                style={[styles.sliderLabel, { color: colors.mutedForeground }]}
              >
                More
              </Text>
            </View>
          </View>
        )}

        {/* Sugar */}
        <View style={styles.section}>
          <Text style={[styles.label, { color: colors.foreground }]}>
            Sugar
          </Text>
          <Slider
            value={sugar}
            onValueChange={setSugar}
            minimumValue={0}
            maximumValue={15}
            step={1}
            minimumTrackTintColor="#000000"
            maximumTrackTintColor={colors.muted}
            thumbTintColor="#000000"
            style={styles.slider}
          />
          <View style={styles.sliderLabels}>
            <Text
              style={[styles.sliderLabel, { color: colors.mutedForeground }]}
            >
              0g
            </Text>
            <Text
              style={[styles.sliderLabel, { color: colors.mutedForeground }]}
            >
              {sugar}g
            </Text>
            <Text
              style={[styles.sliderLabel, { color: colors.mutedForeground }]}
            >
              15g
            </Text>
          </View>
        </View>

        {/* Foam Level */}
        {measurements.milkFoam > 0 && (
          <View style={styles.section}>
            <Text style={[styles.label, { color: colors.foreground }]}>
              Foam Level
            </Text>
            <Slider
              value={foamLevel}
              onValueChange={setFoamLevel}
              minimumValue={0}
              maximumValue={100}
              minimumTrackTintColor="#000000"
              maximumTrackTintColor={colors.muted}
              thumbTintColor="#000000"
              style={styles.slider}
            />
            <View style={styles.sliderLabels}>
              <Text
                style={[styles.sliderLabel, { color: colors.mutedForeground }]}
              >
                Less
              </Text>
              <Text
                style={[styles.sliderLabel, { color: colors.mutedForeground }]}
              >
                More
              </Text>
            </View>
          </View>
        )}

        {/* Make Button */}
        <Button onPress={handleMake} style={styles.makeButton}>
          Make
        </Button>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingVertical: 8,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "flex-start",
    marginBottom: 8,
  },
  greeting: {
    fontSize: 20,
    fontWeight: "600",
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 140,
  },
  drinkSection: {
    alignItems: "center",
    marginBottom: 24,
  },
  drinkName: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 12,
    marginBottom: 4,
  },
  drinkDescription: {
    fontSize: 14,
    textAlign: "center",
  },
  favoriteButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 12,
  },
  buttonGrid: {
    flexDirection: "row",
    gap: 12,
  },
  sizeButton: {
    flex: 1,
    borderWidth: 2,
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    gap: 8,
  },
  optionButton: {
    flex: 1,
    borderWidth: 2,
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    gap: 8,
  },
  milkButton: {
    flex: 1,
    borderWidth: 2,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 12,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 14,
  },
  slider: {
    width: "100%",
    height: 40,
  },
  sliderLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  sliderLabel: {
    fontSize: 12,
  },
  makeButton: {
    width: "100%",
    height: 56,
    backgroundColor: "#000000",
    borderRadius: 28,
    marginTop: 16,
  },
});
