import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Plus, Play } from "lucide-react-native";
import { useTheme, Shadows } from "../constants/Theme";
import { globalStyles } from "../styles/globalStyles";

interface GuestHomeProps {
  onSelectDrink: (drinkId: string) => void;
}

const favoriteDrinks = [
  { id: "latte", name: "Latte", strength: "Weak, L", bgColor: "#fef3c7" },
  {
    id: "espresso",
    name: "Double Espresso",
    strength: "Strong, S",
    bgColor: "#f3e8ff",
  },
];

const drinks = [
  { id: "caffe-latte", name: "Caffè latte" },
  { id: "espresso", name: "Espresso" },
  { id: "ristretto", name: "Ristretto" },
  { id: "cortado", name: "Cortado" },
  { id: "latte-macchiato", name: "Latte macchiato" },
  { id: "coffee", name: "Coffee" },
  { id: "cappuccino", name: "Cappuccino" },
  { id: "cold-brew-coffee", name: "Cold Brew Coffee" },
  { id: "espresso-macchiato", name: "Espresso macchiato" },
  { id: "flat-white", name: "Flat White" },
  { id: "americano", name: "Americano" },
  { id: "lungo-barista", name: "Lungo Barista" },
  { id: "sweet-latte", name: "Sweet latte" },
  { id: "espresso-doppio", name: "Espresso doppio" },
  { id: "hot-water", name: "Hot water" },
  { id: "hot-water-green-tea", name: "Hot water green tea" },
  { id: "portion-of-milk", name: "Portion of milk" },
  { id: "portion-of-milk-foam", name: "Portion of milk foam" },
];

const CoffeeCup = ({
  color = "#C4A484",
  size = 50,
}: {
  color?: string;
  size?: number;
}) => (
  <View
    style={{
      width: size,
      height: size * 1.4,
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <View
      style={{
        width: size * 0.8,
        height: size * 1.2,
        backgroundColor: color,
        borderRadius: size * 0.15,
        borderTopLeftRadius: size * 0.05,
        borderTopRightRadius: size * 0.05,
      }}
    />
    <View
      style={{
        position: "absolute",
        top: 0,
        width: size * 0.9,
        height: size * 0.15,
        backgroundColor: "#E5E7EB",
        borderRadius: size * 0.5,
      }}
    />
  </View>
);

export function GuestHome({ onSelectDrink }: GuestHomeProps) {
  const { colors } = useTheme();

  const getDrinkColor = (drinkId: string) => {
    if (
      drinkId.includes("latte") ||
      drinkId.includes("macchiato") ||
      drinkId === "cappuccino" ||
      drinkId === "flat-white"
    ) {
      return "#C4A484";
    }
    if (
      drinkId.includes("espresso") ||
      drinkId === "ristretto" ||
      drinkId === "cortado" ||
      drinkId === "coffee" ||
      drinkId === "americano" ||
      drinkId === "lungo-barista"
    ) {
      return "#6F4E37";
    }
    if (drinkId.includes("milk")) {
      return "#F5F5F5";
    }
    if (drinkId.includes("water")) {
      return "#E0F2FE";
    }
    return "#C4A484";
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Content */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={[
          styles.scrollContent,
          globalStyles.scrollContentWithBottomNav,
        ]}
      >
        {/* Greeting */}
        <Text style={[styles.greeting, { color: colors.foreground }]}>
          Hello, Guest
        </Text>

        {/* Favourites */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
              Favourites
            </Text>
            <TouchableOpacity style={styles.addButton}>
              <Plus size={20} color={colors.foreground} />
            </TouchableOpacity>
          </View>

          <View style={styles.favoritesGrid}>
            {favoriteDrinks.map((drink) => (
              <TouchableOpacity
                key={drink.id}
                onPress={() => onSelectDrink(drink.id)}
                style={[
                  styles.favoriteCard,
                  { backgroundColor: drink.bgColor },
                ]}
              >
                <CoffeeCup size={45} />
                <Text
                  style={[
                    styles.favoriteCardName,
                    { color: colors.foreground },
                  ]}
                >
                  {drink.name}
                </Text>
                <Text
                  style={[
                    styles.favoriteCardStrength,
                    { color: colors.mutedForeground },
                  ]}
                >
                  {drink.strength}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* All Drinks */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
            Choose your coffee
          </Text>

          <View style={styles.drinksGrid}>
            {drinks.map((drink) => (
              <TouchableOpacity
                key={drink.id}
                onPress={() => onSelectDrink(drink.id)}
                style={[
                  styles.drinkCard,
                  Shadows.sm,
                  { backgroundColor: colors.card, borderColor: colors.border },
                ]}
              >
                <CoffeeCup color={getDrinkColor(drink.id)} size={50} />
                <Text
                  style={[styles.drinkCardName, { color: colors.foreground }]}
                  numberOfLines={2}
                >
                  {drink.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 140,
  },
  greeting: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  addButton: {
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  favoritesGrid: {
    flexDirection: "row",
    gap: 12,
  },
  favoriteCard: {
    flex: 1,
    borderRadius: 16,
    padding: 16,
    minHeight: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  favoriteCardName: {
    fontSize: 14,
    fontWeight: "500",
    marginTop: 8,
    marginBottom: 4,
  },
  favoriteCardStrength: {
    fontSize: 12,
  },
  drinksGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
  },
  drinkCard: {
    width: "48%",
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    minHeight: 140,
    alignItems: "center",
    justifyContent: "center",
  },
  drinkCardName: {
    fontSize: 14,
    textAlign: "center",
    marginTop: 12,
    lineHeight: 18,
  },
});
