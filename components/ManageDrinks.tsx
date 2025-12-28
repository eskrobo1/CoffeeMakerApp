import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import {
  ArrowLeft,
  Coffee,
  Milk,
  Droplet,
  Sparkles,
  Wind,
  Save,
} from "lucide-react-native";
import { useTheme, Shadows } from "../constants/Theme";
import { Button } from "./ui/button";

interface ManageDrinksProps {
  onBack: () => void;
}

interface DrinkOption {
  id: string;
  name: string;
  icon: "coffee" | "milk" | "droplet" | "sparkles" | "wind";
  enabled: boolean;
  description: string;
}

export function ManageDrinks({ onBack }: ManageDrinksProps) {
  const { colors } = useTheme();
  const [drinks, setDrinks] = useState<DrinkOption[]>([
    {
      id: "espresso",
      name: "Espresso",
      icon: "coffee",
      enabled: true,
      description: "Strong & bold shot",
    },
    {
      id: "cappuccino",
      name: "Cappuccino",
      icon: "milk",
      enabled: true,
      description: "Rich with foam",
    },
    {
      id: "latte",
      name: "Latte",
      icon: "droplet",
      enabled: true,
      description: "Smooth & milky",
    },
    {
      id: "mocha",
      name: "Mocha",
      icon: "sparkles",
      enabled: true,
      description: "Chocolate blend",
    },
    {
      id: "americano",
      name: "Americano",
      icon: "wind",
      enabled: true,
      description: "Diluted espresso",
    },
    {
      id: "macchiato",
      name: "Macchiato",
      icon: "coffee",
      enabled: false,
      description: "Espresso with milk",
    },
    {
      id: "flat-white",
      name: "Flat White",
      icon: "milk",
      enabled: false,
      description: "Velvety microfoam",
    },
  ]);

  const toggleDrink = (id: string) => {
    setDrinks(
      drinks.map((drink) =>
        drink.id === id ? { ...drink, enabled: !drink.enabled } : drink
      )
    );
  };

  const handleSave = () => {
    Alert.alert("Success", "Drink availability updated successfully!");
    setTimeout(onBack, 1000);
  };

  const enabledCount = drinks.filter((d) => d.enabled).length;

  const getIcon = (iconType: string, size: number, color: string) => {
    switch (iconType) {
      case "coffee":
        return <Coffee size={size} color={color} />;
      case "milk":
        return <Milk size={size} color={color} />;
      case "droplet":
        return <Droplet size={size} color={color} />;
      case "sparkles":
        return <Sparkles size={size} color={color} />;
      case "wind":
        return <Wind size={size} color={color} />;
      default:
        return <Coffee size={size} color={color} />;
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <ArrowLeft size={24} color="#ffffff" />
          </TouchableOpacity>
          <View>
            <Text style={styles.headerTitle}>Manage Drinks</Text>
            <Text style={styles.headerSubtitle}>
              Enable or disable drink options
            </Text>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsCard}>
          <Text style={styles.statsLabel}>Active Drinks</Text>
          <Text style={styles.statsValue}>
            {enabledCount}/{drinks.length}
          </Text>
        </View>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
      >
        {drinks.map((drink) => (
          <View
            key={drink.id}
            style={[
              styles.drinkCard,
              Shadows.sm,
              { backgroundColor: colors.card },
              !drink.enabled && styles.drinkCardDisabled,
            ]}
          >
            <View style={styles.drinkCardContent}>
              <View
                style={[
                  styles.drinkIcon,
                  { backgroundColor: drink.enabled ? "#f59e0b" : colors.muted },
                ]}
              >
                {getIcon(
                  drink.icon,
                  20,
                  drink.enabled ? "#ffffff" : colors.mutedForeground
                )}
              </View>
              <View style={styles.drinkInfo}>
                <Text style={[styles.drinkName, { color: colors.foreground }]}>
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
        ))}

        {/* Info */}
        <View style={styles.infoCard}>
          <Text style={styles.infoText}>
            Disabled drinks will not appear in the drink selection menu for
            users.
          </Text>
        </View>
      </ScrollView>

      {/* Fixed Bottom Button */}
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
  container: {
    flex: 1,
    backgroundColor: "#fef3c7",
  },
  header: {
    backgroundColor: "#7c3aed",
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 32,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
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
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#ffffff",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#e9d5ff",
  },
  statsCard: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statsLabel: {
    fontSize: 14,
    color: "#ffffff",
  },
  statsValue: {
    fontSize: 24,
    fontWeight: "600",
    color: "#ffffff",
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 120,
  },
  drinkCard: {
    borderRadius: 16,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  drinkCardDisabled: {
    opacity: 0.6,
  },
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
  drinkInfo: {
    flex: 1,
  },
  drinkName: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 4,
  },
  drinkDescription: {
    fontSize: 14,
  },
  switch: {
    width: 44,
    height: 24,
    borderRadius: 12,
    padding: 2,
  },
  switchThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#ffffff",
  },
  infoCard: {
    backgroundColor: "#dbeafe",
    borderWidth: 2,
    borderColor: "#93c5fd",
    borderRadius: 16,
    padding: 16,
    marginTop: 8,
  },
  infoText: {
    fontSize: 14,
    color: "#1e3a8a",
  },
  footer: {
    position: "absolute",
    bottom: 80,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderTopWidth: 1,
  },
  saveButton: {
    width: "100%",
    height: 48,
    backgroundColor: "#7c3aed",
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  saveButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
  },
});
