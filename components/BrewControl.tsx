import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Coffee } from "lucide-react-native";
import { useTheme } from "../constants/Theme";
import Slider from "@react-native-community/slider";

interface BrewControlProps {
  drinkId: string;
  drinkName: string;
  onBrew: () => void;
  isBrewing: boolean;
  disabled: boolean;
}

// Mapa slika za svaki napitak
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
  custom: require("../assets/drinks/espresso.png"), // fallback
};

export function BrewControl({
  drinkId,
  drinkName,
  onBrew,
  isBrewing,
  disabled,
}: BrewControlProps) {
  const { colors } = useTheme();
  const [strength, setStrength] = useState<"mild" | "medium" | "strong">(
    "medium"
  );
  const [size, setSize] = useState<"small" | "medium" | "large">("medium");
  const [temperature, setTemperature] = useState(92);

  const strengthOptions: Array<"mild" | "medium" | "strong"> = [
    "mild",
    "medium",
    "strong",
  ];
  const sizeOptions: Array<{
    value: "small" | "medium" | "large";
    label: string;
    ml: string;
  }> = [
    { value: "small", label: "Small", ml: "120ml" },
    { value: "medium", label: "Medium", ml: "240ml" },
    { value: "large", label: "Large", ml: "360ml" },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Drink Preview */}
        <View style={styles.drinkPreview}>
          <View
            style={[
              styles.drinkImageContainer,
              { backgroundColor: colors.muted },
            ]}
          >
            {drinkImages[drinkId] ? (
              <Image
                source={drinkImages[drinkId]}
                style={styles.drinkImage}
                resizeMode="contain"
              />
            ) : (
              <Coffee size={60} color={colors.mutedForeground} />
            )}
          </View>
          <Text style={[styles.drinkNameText, { color: colors.foreground }]}>
            {drinkName}
          </Text>
        </View>

        <Text style={[styles.title, { color: colors.foreground }]}>
          Customize Your Brew
        </Text>

        <View style={styles.section}>
          {/* Strength */}
          <View style={styles.control}>
            <Text style={[styles.label, { color: colors.mutedForeground }]}>
              Strength
            </Text>
            <View style={styles.buttonGrid}>
              {strengthOptions.map((level) => (
                <TouchableOpacity
                  key={level}
                  onPress={() => setStrength(level)}
                  disabled={disabled}
                  style={[
                    styles.optionButton,
                    strength === level
                      ? styles.optionButtonActive
                      : { backgroundColor: colors.muted },
                    disabled && styles.optionButtonDisabled,
                  ]}
                >
                  <Text
                    style={[
                      styles.optionButtonText,
                      strength === level
                        ? styles.optionButtonTextActive
                        : { color: colors.foreground },
                    ]}
                  >
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Size */}
          <View style={styles.control}>
            <Text style={[styles.label, { color: colors.mutedForeground }]}>
              Size
            </Text>
            <View style={styles.buttonGrid}>
              {sizeOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  onPress={() => setSize(option.value)}
                  disabled={disabled}
                  style={[
                    styles.optionButton,
                    size === option.value
                      ? styles.optionButtonActive
                      : { backgroundColor: colors.muted },
                    disabled && styles.optionButtonDisabled,
                  ]}
                >
                  <Text
                    style={[
                      styles.optionButtonText,
                      size === option.value
                        ? styles.optionButtonTextActive
                        : { color: colors.foreground },
                    ]}
                  >
                    {option.label}
                  </Text>
                  <Text
                    style={[
                      styles.optionButtonSubtext,
                      size === option.value && styles.optionButtonSubtextActive,
                    ]}
                  >
                    {option.ml}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Temperature */}
          <View style={styles.control}>
            <View style={styles.labelRow}>
              <Text style={[styles.label, { color: colors.mutedForeground }]}>
                Temperature
              </Text>
              <Text
                style={[styles.temperatureValue, { color: colors.foreground }]}
              >
                {temperature}°C
              </Text>
            </View>
            <Slider
              value={temperature}
              onValueChange={setTemperature}
              minimumValue={85}
              maximumValue={96}
              step={1}
              disabled={disabled}
              minimumTrackTintColor="#ea580c"
              maximumTrackTintColor="#e5e7eb"
              thumbTintColor="#ea580c"
              style={styles.slider}
            />
            <View style={styles.temperatureLabels}>
              <Text
                style={[
                  styles.temperatureLabel,
                  { color: colors.mutedForeground },
                ]}
              >
                85°C
              </Text>
              <Text
                style={[
                  styles.temperatureLabel,
                  { color: colors.mutedForeground },
                ]}
              >
                96°C
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Brew Button */}
      <TouchableOpacity
        onPress={onBrew}
        disabled={disabled || isBrewing}
        style={[
          styles.brewButton,
          (disabled || isBrewing) && styles.brewButtonDisabled,
        ]}
        activeOpacity={0.8}
      >
        <Coffee size={24} color="#ffffff" />
        <Text style={styles.brewButtonText}>
          {isBrewing ? "Brewing..." : "Start Brewing"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
  },
  content: {
    gap: 24,
  },
  drinkPreview: {
    alignItems: "center",
    marginBottom: 8,
  },
  drinkImageContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  drinkImage: {
    width: 90,
    height: 90,
  },
  drinkNameText: {
    fontSize: 20,
    fontWeight: "600",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
  },
  section: {
    gap: 24,
  },
  control: {
    gap: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
  },
  labelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  temperatureValue: {
    fontSize: 14,
    fontWeight: "600",
  },
  buttonGrid: {
    flexDirection: "row",
    gap: 8,
  },
  optionButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  optionButtonActive: {
    backgroundColor: "#ea580c",
  },
  optionButtonDisabled: {
    opacity: 0.5,
  },
  optionButtonText: {
    fontSize: 14,
    fontWeight: "500",
  },
  optionButtonTextActive: {
    color: "#ffffff",
  },
  optionButtonSubtext: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 4,
  },
  optionButtonSubtextActive: {
    color: "rgba(255, 255, 255, 0.8)",
  },
  slider: {
    width: "100%",
    height: 40,
  },
  temperatureLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  temperatureLabel: {
    fontSize: 12,
  },
  brewButton: {
    backgroundColor: "#ea580c",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    paddingVertical: 20,
    borderRadius: 16,
    marginTop: 24,
  },
  brewButtonDisabled: {
    backgroundColor: "#e5e7eb",
  },
  brewButtonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "600",
  },
});
