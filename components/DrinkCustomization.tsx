// components/DrinkCustomization.tsx
import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
  TextInput,
  Alert,
} from "react-native";
import { ArrowLeft, Heart, X, Flame } from "lucide-react-native";
import { useTheme } from "../constants/Theme";
import { Button } from "./ui/button";
import { AppSlider } from "./ui/AppSlider";
import { drinkMeasurements } from "../data/drinkMeasurements";
import {
  drinkBaseCalories,
  MILK_KCAL_PER_ML,
  FOAM_KCAL_PER_SECOND,
  SUGAR_KCAL_PER_GRAM,
  STRENGTH_FACTOR,
} from "../data/drinkCalories";
import type { FavoriteConfig, AddFavoriteParams } from "../hooks/useFavorites";

interface DrinkCustomizationProps {
  drinkId: string;
  userName?: string;
  onBack: () => void;
  onStartBrew: (config: any) => void;
  favoriteConfigs?: FavoriteConfig[];
  onAddFavorite?: (params: AddFavoriteParams) => Promise<number | null>;
  onRemoveFavorite?: (favoriteId: number) => Promise<boolean>;
  initialConfig?: FavoriteConfig;
}

type Size = "small" | "medium" | "large";
type Strength = "light" | "regular" | "strong";
type MilkType = "regular" | "plant-based";

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

export function DrinkCustomization({
  drinkId,
  userName,
  onBack,
  onStartBrew,
  favoriteConfigs = [],
  onAddFavorite,
  onRemoveFavorite,
  initialConfig,
}: DrinkCustomizationProps) {
  const { colors } = useTheme();

  const [size, setSize] = useState<Size>(
    (initialConfig?.size as Size) || "medium",
  );
  const [strength, setStrength] = useState<Strength>(
    (initialConfig?.strength as Strength) || "regular",
  );
  const [milkType, setMilkType] = useState<MilkType>(
    (initialConfig?.milk_type as MilkType) || "regular",
  );
  const [milkAmount, setMilkAmount] = useState(
    initialConfig?.milk_amount_percent ?? 50,
  );
  const [sugar, setSugar] = useState(initialConfig?.sugar_g ?? 0);
  const [foamLevel, setFoamLevel] = useState(
    initialConfig?.foam_level_percent ?? 50,
  );
  const [showNameModal, setShowNameModal] = useState(false);
  const [favoriteName, setFavoriteName] = useState("");

  const drink =
    drinkMeasurements.find((d) => d.id === drinkId) || drinkMeasurements[0];
  const measurements = drink[size];
  const hasCoffee = (measurements?.coffee ?? 0) > 0;
  const hasMilk = (measurements?.milk ?? 0) > 0;
  const hasFoam = (measurements?.milkFoam ?? 0) > 0;

  const calories = useMemo(() => {
    const base =
      drinkBaseCalories[drinkId]?.[size] ?? drinkBaseCalories["custom"][size];
    const coffeeCal = hasCoffee
      ? Math.round(base * STRENGTH_FACTOR[strength])
      : 0;
    const milkCal = hasMilk
      ? Math.round(
          measurements.milk * (milkAmount / 100) * MILK_KCAL_PER_ML[milkType],
        )
      : 0;
    const foamCal = hasFoam
      ? Math.round(
          measurements.milkFoam *
            (foamLevel / 100) *
            FOAM_KCAL_PER_SECOND[milkType],
        )
      : 0;
    const sugarCal = Math.round(sugar) * SUGAR_KCAL_PER_GRAM;
    return coffeeCal + milkCal + foamCal + sugarCal;
  }, [
    drinkId,
    size,
    strength,
    milkType,
    milkAmount,
    foamLevel,
    sugar,
    measurements,
    hasCoffee,
    hasMilk,
    hasFoam,
  ]);

  const matchingFavorite = useMemo((): FavoriteConfig | null => {
    if (!onAddFavorite) return null;
    return (
      favoriteConfigs.find(
        (fav) =>
          fav.drink_id === drinkId &&
          fav.size === size &&
          fav.strength === strength &&
          fav.milk_type === milkType &&
          Math.round(fav.milk_amount_percent) === Math.round(milkAmount) &&
          Math.round(fav.foam_level_percent) === Math.round(foamLevel) &&
          fav.sugar_g === Math.round(sugar),
      ) || null
    );
  }, [
    favoriteConfigs,
    drinkId,
    size,
    strength,
    milkType,
    milkAmount,
    foamLevel,
    sugar,
    onAddFavorite,
  ]);

  const isFavorite = matchingFavorite !== null;

  const handleHeartPress = () => {
    if (isFavorite && matchingFavorite) {
      Alert.alert(
        "Remove Favourite",
        `Remove "${matchingFavorite.name}" from favourites?`,
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Remove",
            style: "destructive",
            onPress: () => onRemoveFavorite?.(matchingFavorite.id),
          },
        ],
      );
    } else {
      setFavoriteName(drink.name);
      setShowNameModal(true);
    }
  };

  const handleSaveFavorite = async () => {
    const name = favoriteName.trim();
    if (!name) {
      Alert.alert("Name required", "Please enter a name for this favourite.");
      return;
    }
    await onAddFavorite?.({
      drinkId,
      name,
      size,
      strength,
      milkType,
      milkAmountPercent: Math.round(milkAmount),
      foamLevelPercent: Math.round(foamLevel),
      sugarG: Math.round(sugar),
    });
    setShowNameModal(false);
    setFavoriteName("");
  };

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
          (hasCoffee
            ? strength === "light"
              ? 0.8
              : strength === "strong"
                ? 1.2
                : 1
            : 0),
        sugar,
      },
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={onBack}
          style={styles.backButton}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <ArrowLeft size={24} color={colors.foreground} />
        </TouchableOpacity>
        <Text style={[styles.greeting, { color: colors.foreground }]}>
          Hello, {userName || "Guest"}
        </Text>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Drink info */}
        <View style={styles.drinkSection}>
          {drinkImages[drinkId] ? (
            <Image
              source={drinkImages[drinkId]}
              style={styles.drinkImage}
              resizeMode="contain"
            />
          ) : (
            <View style={styles.genericCup}>
              <Text style={styles.genericCupEmoji}>☕</Text>
            </View>
          )}
          <Text style={[styles.drinkName, { color: colors.foreground }]}>
            {drink.name}
          </Text>
          <View
            style={[styles.calorieBadge, { backgroundColor: colors.muted }]}
          >
            <Flame size={14} color="#f97316" />
            <Text style={[styles.calorieValue, { color: colors.foreground }]}>
              ~{calories} kcal
            </Text>
            <Text
              style={[styles.calorieHint, { color: colors.mutedForeground }]}
            >
              estimated
            </Text>
          </View>
          {onAddFavorite && (
            <TouchableOpacity
              onPress={handleHeartPress}
              style={[
                styles.favoriteButton,
                { backgroundColor: isFavorite ? "#ef4444" : colors.muted },
              ]}
            >
              <Heart
                size={16}
                color={isFavorite ? "#ffffff" : colors.foreground}
                fill={isFavorite ? "#ffffff" : "transparent"}
              />
            </TouchableOpacity>
          )}
          {onAddFavorite && !isFavorite && (
            <Text
              style={[styles.favoriteHint, { color: colors.mutedForeground }]}
            >
              {favoriteConfigs.some((f) => f.drink_id === drinkId)
                ? "Settings differ from saved favourite — tap ♥ to save"
                : "Tap ♥ to add to favourites"}
            </Text>
          )}
          {onAddFavorite && isFavorite && matchingFavorite && (
            <Text style={[styles.favoriteHint, { color: "#ef4444" }]}>
              Saved as "{matchingFavorite.name}"
            </Text>
          )}
        </View>

        {/* Size */}
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

        {/* Coffee Strength */}
        {hasCoffee && (
          <View style={styles.section}>
            <Text style={[styles.label, { color: colors.foreground }]}>
              Coffee Strength
            </Text>
            <View style={styles.buttonGrid}>
              {(["light", "regular", "strong"] as Strength[]).map((str) => (
                <TouchableOpacity
                  key={str}
                  onPress={() => setStrength(str)}
                  style={[
                    styles.optionButton,
                    {
                      borderColor: strength === str ? "#000000" : colors.border,
                    },
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
                  <Text
                    style={[styles.buttonText, { color: colors.foreground }]}
                  >
                    {str.charAt(0).toUpperCase() + str.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Milk Type */}
        {hasMilk && (
          <View style={styles.section}>
            <Text style={[styles.label, { color: colors.foreground }]}>
              Milk Type
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

        {/* Milk Amount — AppSlider */}
        {hasMilk && (
          <View style={styles.section}>
            <View style={styles.sliderLabelRow}>
              <Text style={[styles.label, { color: colors.foreground }]}>
                Milk Amount
              </Text>
              <Text
                style={[styles.sliderValue, { color: colors.mutedForeground }]}
              >
                {Math.round(milkAmount)}%
              </Text>
            </View>
            <AppSlider
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

        {/* Sugar — AppSlider */}
        <View style={styles.section}>
          <View style={styles.sliderLabelRow}>
            <Text style={[styles.label, { color: colors.foreground }]}>
              Sugar
            </Text>
            <Text
              style={[styles.sliderValue, { color: colors.mutedForeground }]}
            >
              {Math.round(sugar)}g
              {sugar > 0
                ? ` (+${Math.round(sugar) * SUGAR_KCAL_PER_GRAM} kcal)`
                : ""}
            </Text>
          </View>
          <AppSlider
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
              15g
            </Text>
          </View>
        </View>

        {/* Foam Level — AppSlider */}
        {hasFoam && (
          <View style={styles.section}>
            <View style={styles.sliderLabelRow}>
              <Text style={[styles.label, { color: colors.foreground }]}>
                Foam Level
              </Text>
              <Text
                style={[styles.sliderValue, { color: colors.mutedForeground }]}
              >
                {Math.round(foamLevel)}%
              </Text>
            </View>
            <AppSlider
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

        <Button onPress={handleMake} style={styles.makeButton}>
          Make
        </Button>
      </ScrollView>

      <Modal
        visible={showNameModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowNameModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { backgroundColor: colors.card }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.foreground }]}>
                Save to Favourites
              </Text>
              <TouchableOpacity
                onPress={() => setShowNameModal(false)}
                style={styles.modalClose}
              >
                <X size={20} color={colors.mutedForeground} />
              </TouchableOpacity>
            </View>
            <Text
              style={[styles.modalSubtitle, { color: colors.mutedForeground }]}
            >
              Give this combination a name so you can find it easily.
            </Text>
            <View
              style={[styles.configSummary, { backgroundColor: colors.muted }]}
            >
              <Text
                style={[
                  styles.configSummaryText,
                  { color: colors.mutedForeground },
                ]}
              >
                {size} · {hasCoffee ? `${strength} strength · ` : ""}
                {milkType === "regular" ? "Regular milk" : "Plant-based"}
                {sugar > 0 ? ` · ${Math.round(sugar)}g sugar` : ""} · ~
                {calories} kcal
              </Text>
            </View>
            <TextInput
              value={favoriteName}
              onChangeText={setFavoriteName}
              placeholder={`e.g. My ${drink.name}`}
              placeholderTextColor={colors.mutedForeground}
              style={[
                styles.nameInput,
                {
                  color: colors.foreground,
                  borderColor: colors.border,
                  backgroundColor: colors.background,
                },
              ]}
              autoFocus
              returnKeyType="done"
              onSubmitEditing={handleSaveFavorite}
              maxLength={40}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalCancelBtn, { borderColor: colors.border }]}
                onPress={() => setShowNameModal(false)}
              >
                <Text
                  style={[styles.modalCancelText, { color: colors.foreground }]}
                >
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalSaveBtn}
                onPress={handleSaveFavorite}
              >
                <Text style={styles.modalSaveText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 8,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  greeting: { fontSize: 20, fontWeight: "600" },
  content: { flex: 1 },
  scrollContent: { paddingHorizontal: 24, paddingBottom: 140 },
  drinkSection: { alignItems: "center", marginBottom: 24, paddingTop: 8 },
  drinkImage: { width: 100, height: 100, marginBottom: 8 },
  genericCup: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#f3f4f6",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  genericCupEmoji: { fontSize: 48 },
  drinkName: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 12,
    marginBottom: 4,
  },
  calorieBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    marginBottom: 8,
  },
  calorieValue: { fontSize: 15, fontWeight: "600" },
  calorieHint: { fontSize: 12 },
  favoriteButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },
  favoriteHint: {
    fontSize: 12,
    textAlign: "center",
    marginTop: 6,
    paddingHorizontal: 24,
  },
  section: { marginBottom: 24 },
  label: { fontSize: 14, fontWeight: "500", marginBottom: 12 },
  sliderLabelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  sliderValue: { fontSize: 13 },
  buttonGrid: { flexDirection: "row", gap: 12 },
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
  buttonText: { fontSize: 14 },
  slider: { width: "100%", marginVertical: 4 },
  sliderLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 2,
  },
  sliderLabel: { fontSize: 12 },
  makeButton: {
    width: "100%",
    height: 56,
    backgroundColor: "#000000",
    borderRadius: 28,
    marginTop: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  modalCard: { width: "100%", borderRadius: 20, padding: 24 },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  modalTitle: { fontSize: 18, fontWeight: "600" },
  modalClose: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  modalSubtitle: { fontSize: 14, marginBottom: 16, lineHeight: 20 },
  configSummary: {
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 16,
  },
  configSummaryText: { fontSize: 13 },
  nameInput: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 20,
  },
  modalButtons: { flexDirection: "row", gap: 12 },
  modalCancelBtn: {
    flex: 1,
    height: 48,
    borderWidth: 1,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  modalCancelText: { fontSize: 15, fontWeight: "500" },
  modalSaveBtn: {
    flex: 1,
    height: 48,
    backgroundColor: "#000000",
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  modalSaveText: { fontSize: 15, fontWeight: "600", color: "#ffffff" },
});
