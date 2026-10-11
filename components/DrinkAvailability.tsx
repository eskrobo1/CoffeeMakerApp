// components/DrinkAvailability.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  ArrowLeft,
  Coffee,
  Milk,
  Droplet,
  Sparkles,
  Save,
} from "lucide-react-native";
import { useTheme, Shadows } from "../constants/Theme";
import { Button } from "./ui/button";

const STORAGE_KEY = "disabledDrinkIds";

interface DrinkAvailabilityProps {
  onBack: () => void;
  onSaveAvailability: (disabledIds: string[]) => void; // obavijesti App.tsx
}

interface DrinkOption {
  id: string;
  name: string;
  description: string;
  icon: "coffee" | "milk" | "droplet" | "sparkles";
  enabled: boolean;
}

const defaultDrinks: DrinkOption[] = [
  {
    id: "caffe-latte",
    name: "Caffè latte",
    description: "Classic Italian latte",
    icon: "coffee",
    enabled: true,
  },
  {
    id: "espresso",
    name: "Espresso",
    description: "Strong & bold shot",
    icon: "coffee",
    enabled: true,
  },
  {
    id: "ristretto",
    name: "Ristretto",
    description: "Concentrated espresso",
    icon: "coffee",
    enabled: true,
  },
  {
    id: "cortado",
    name: "Cortado",
    description: "Espresso with milk",
    icon: "milk",
    enabled: true,
  },
  {
    id: "latte-macchiato",
    name: "Latte macchiato",
    description: "Layered espresso",
    icon: "milk",
    enabled: true,
  },
  {
    id: "coffee",
    name: "Coffee",
    description: "Classic drip coffee",
    icon: "coffee",
    enabled: true,
  },
  {
    id: "cappuccino",
    name: "Cappuccino",
    description: "Rich with foam",
    icon: "milk",
    enabled: true,
  },
  {
    id: "cold-brew-coffee",
    name: "Cold Brew Coffee",
    description: "Smooth cold brew",
    icon: "droplet",
    enabled: true,
  },
  {
    id: "espresso-macchiato",
    name: "Espresso macchiato",
    description: "Espresso marked",
    icon: "coffee",
    enabled: true,
  },
  {
    id: "flat-white",
    name: "Flat White",
    description: "Velvety microfoam",
    icon: "milk",
    enabled: true,
  },
  {
    id: "americano",
    name: "Americano",
    description: "Diluted espresso",
    icon: "coffee",
    enabled: true,
  },
  {
    id: "lungo-barista",
    name: "Lungo Barista",
    description: "Long espresso",
    icon: "coffee",
    enabled: true,
  },
  {
    id: "sweet-latte",
    name: "Sweet latte",
    description: "Sweetened latte",
    icon: "sparkles",
    enabled: true,
  },
  {
    id: "espresso-doppio",
    name: "Espresso doppio",
    description: "Double espresso",
    icon: "coffee",
    enabled: true,
  },
  {
    id: "hot-water",
    name: "Hot water",
    description: "Plain hot water",
    icon: "droplet",
    enabled: true,
  },
  {
    id: "portion-of-milk",
    name: "Portion of milk",
    description: "Steamed milk",
    icon: "milk",
    enabled: true,
  },
  {
    id: "portion-of-milk-foam",
    name: "Portion of milk foam",
    description: "Foamed milk",
    icon: "milk",
    enabled: true,
  },
];

const getIcon = (iconType: string) => {
  switch (iconType) {
    case "coffee":
      return Coffee;
    case "milk":
      return Milk;
    case "droplet":
      return Droplet;
    case "sparkles":
      return Sparkles;
    default:
      return Coffee;
  }
};

export function DrinkAvailability({
  onBack,
  onSaveAvailability,
}: DrinkAvailabilityProps) {
  const { colors } = useTheme();
  const [drinks, setDrinks] = useState<DrinkOption[]>(defaultDrinks);
  const [hasChanges, setHasChanges] = useState(false);

  // Učitaj sačuvano stanje pri pokretanju
  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((val) => {
        if (val) {
          const disabledIds: string[] = JSON.parse(val);
          setDrinks(
            defaultDrinks.map((d) => ({
              ...d,
              enabled: !disabledIds.includes(d.id),
            })),
          );
        }
      })
      .catch(() => {});
  }, []);

  const toggleDrink = (id: string) => {
    setDrinks((prev) =>
      prev.map((d) => (d.id === id ? { ...d, enabled: !d.enabled } : d)),
    );
    setHasChanges(true);
  };

  const handleSave = async () => {
    const disabledIds = drinks.filter((d) => !d.enabled).map((d) => d.id);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(disabledIds));
      onSaveAvailability(disabledIds); // obavijesti App.tsx
      setHasChanges(false);
      Alert.alert(
        "Saved",
        "Drink availability updated. Changes are now visible to all users.",
        [{ text: "OK", onPress: onBack }],
      );
    } catch {
      Alert.alert("Error", "Could not save changes. Please try again.");
    }
  };

  const enabledCount = drinks.filter((d) => d.enabled).length;

  return (
    <View style={[styles.container, { backgroundColor: "#f9fafb" }]}>
      {/* Header */}
      <View
        style={[
          styles.header,
          { backgroundColor: colors.background, borderBottomColor: "#f3f4f6" },
        ]}
      >
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <ArrowLeft size={20} color={colors.foreground} />
          </TouchableOpacity>
          <View>
            <Text style={[styles.headerTitle, { color: colors.foreground }]}>
              Drink Availability
            </Text>
            <Text
              style={[styles.headerSubtitle, { color: colors.mutedForeground }]}
            >
              Enable or disable drink options
            </Text>
          </View>
        </View>
        <View style={[styles.statsCard, { backgroundColor: colors.muted }]}>
          <Text style={[styles.statsLabel, { color: colors.mutedForeground }]}>
            Active Drinks
          </Text>
          <Text style={[styles.statsValue, { color: colors.foreground }]}>
            {enabledCount} / {drinks.length}
          </Text>
        </View>
        {hasChanges && (
          <View style={styles.unsavedBadge}>
            <Text style={styles.unsavedText}>Unsaved changes</Text>
          </View>
        )}
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.drinksList}>
          {drinks.map((drink) => {
            const IconComponent = getIcon(drink.icon);
            return (
              <View
                key={drink.id}
                style={[
                  styles.drinkCard,
                  Shadows.sm,
                  { backgroundColor: colors.card, borderColor: colors.border },
                  !drink.enabled && styles.drinkCardDisabled,
                ]}
              >
                <View style={styles.drinkCardContent}>
                  <View
                    style={[
                      styles.drinkIcon,
                      {
                        backgroundColor: drink.enabled
                          ? "#000000"
                          : colors.muted,
                      },
                    ]}
                  >
                    <IconComponent
                      size={24}
                      color={drink.enabled ? "#ffffff" : colors.mutedForeground}
                    />
                  </View>
                  <View style={styles.drinkInfo}>
                    <Text
                      style={[styles.drinkName, { color: colors.foreground }]}
                    >
                      {drink.name}
                    </Text>
                    <Text
                      style={[
                        styles.drinkDescription,
                        { color: colors.mutedForeground },
                      ]}
                    >
                      {drink.description}
                    </Text>
                  </View>
                </View>
                <TouchableOpacity
                  onPress={() => toggleDrink(drink.id)}
                  style={[
                    styles.switch,
                    { backgroundColor: drink.enabled ? "#22c55e" : "#d1d5db" },
                  ]}
                >
                  <View
                    style={[
                      styles.switchThumb,
                      { marginLeft: drink.enabled ? 20 : 2 },
                    ]}
                  />
                </TouchableOpacity>
              </View>
            );
          })}
        </View>
        <View style={styles.infoCard}>
          <Text style={styles.infoText}>
            💡 Disabled drinks will not appear in the drink selection menu for
            users.
          </Text>
        </View>
      </ScrollView>

      {/* Save Button */}
      <View
        style={[
          styles.footer,
          { backgroundColor: colors.background, borderTopColor: colors.border },
        ]}
      >
        <Button onPress={handleSave} style={styles.saveButton}>
          <Save size={20} color="#ffffff" />
          <Text style={styles.saveButtonText}>Save Changes</Text>
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
    borderBottomWidth: 1,
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    backgroundColor: "#f3f4f6",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: { fontSize: 20, fontWeight: "600" },
  headerSubtitle: { fontSize: 14 },
  statsCard: {
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statsLabel: { fontSize: 14 },
  statsValue: { fontSize: 20, fontWeight: "600" },
  unsavedBadge: {
    backgroundColor: "#fef3c7",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginTop: 8,
    alignSelf: "flex-start",
  },
  unsavedText: { fontSize: 12, color: "#92400e", fontWeight: "500" },
  content: { flex: 1 },
  scrollContent: { padding: 24, paddingBottom: 120 },
  drinksList: { gap: 12 },
  drinkCard: {
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  drinkCardDisabled: { opacity: 0.5 },
  drinkCardContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    flex: 1,
  },
  drinkIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  drinkInfo: { flex: 1 },
  drinkName: { fontSize: 16, fontWeight: "500", marginBottom: 2 },
  drinkDescription: { fontSize: 14 },
  switch: { width: 44, height: 24, borderRadius: 12, padding: 2 },
  switchThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#ffffff",
  },
  infoCard: {
    backgroundColor: "#dbeafe",
    borderWidth: 1,
    borderColor: "#93c5fd",
    borderRadius: 16,
    padding: 16,
    marginTop: 24,
  },
  infoText: { fontSize: 14, color: "#1e3a8a" },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 1,
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  saveButton: {
    width: "100%",
    height: 48,
    backgroundColor: "#000000",
    borderRadius: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  saveButtonText: { color: "#ffffff", fontSize: 14, fontWeight: "600" },
});
