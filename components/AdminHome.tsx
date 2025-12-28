import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Play, AlertTriangle, Plus } from "lucide-react-native";
import { useTheme, Shadows } from "../constants/Theme";

interface AdminHomeProps {
  userName: string;
  favorites: string[];
  onSelectDrink: (drinkId: string) => void;
  onToggleFavorite: (drinkId: string) => void;
  onQuickBrew?: (drinkId: string) => void;
}

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
];

// Coffee cup SVG component
const CoffeeCup = ({ size = 50 }: { size?: number }) => (
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
        backgroundColor: "#C4A484",
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

export function AdminHome({
  userName,
  favorites,
  onSelectDrink,
  onToggleFavorite,
  onQuickBrew,
}: AdminHomeProps) {
  const { colors } = useTheme();
  const favoriteDrinks = drinks.filter((drink) => favorites.includes(drink.id));
  const displayName = userName.split("@")[0];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Content */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Greeting */}
        <Text style={[styles.greeting, { color: colors.foreground }]}>
          Hello, {displayName}
        </Text>

        {/* Alert */}
        <View style={styles.alert}>
          <View style={styles.alertIcon}>
            <AlertTriangle size={20} color="#d97706" />
          </View>
          <View style={styles.alertContent}>
            <Text style={styles.alertTitle}>Low Coffee Supply</Text>
            <Text style={styles.alertDescription}>
              Coffee beans at 28% (below 30%). Restock recommended.
            </Text>
          </View>
        </View>

        {/* Favorites */}
        {favoriteDrinks.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
              Favorites
            </Text>
            <View style={styles.drinksGrid}>
              {favoriteDrinks.map((drink) => (
                <View
                  key={drink.id}
                  style={[
                    styles.drinkCard,
                    Shadows.sm,
                    {
                      backgroundColor: colors.card,
                      borderColor: colors.border,
                    },
                  ]}
                >
                  <CoffeeCup size={45} />
                  <View style={styles.drinkCardFooter}>
                    <TouchableOpacity
                      onPress={() => onSelectDrink(drink.id)}
                      style={styles.drinkName}
                    >
                      <Text
                        style={[
                          styles.drinkNameText,
                          { color: colors.foreground },
                        ]}
                        numberOfLines={2}
                      >
                        {drink.name}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => onQuickBrew?.(drink.id)}
                      style={styles.quickBrewButton}
                    >
                      <Play size={12} color="#ffffff" fill="#ffffff" />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

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
                  styles.drinkCardLarge,
                  Shadows.sm,
                  { backgroundColor: colors.card, borderColor: colors.border },
                ]}
              >
                <CoffeeCup size={50} />
                <Text
                  style={[
                    styles.drinkCardLargeText,
                    { color: colors.foreground },
                  ]}
                  numberOfLines={2}
                >
                  {drink.name}
                </Text>
              </TouchableOpacity>
            ))}

            {/* Custom */}
            <TouchableOpacity
              onPress={() => onSelectDrink("custom")}
              style={[
                styles.customCard,
                { backgroundColor: colors.muted, borderColor: colors.border },
              ]}
            >
              <View
                style={[styles.customIcon, { backgroundColor: colors.card }]}
              >
                <Plus size={24} color={colors.mutedForeground} />
              </View>
              <Text
                style={[styles.customText, { color: colors.mutedForeground }]}
              >
                Custom
              </Text>
            </TouchableOpacity>
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
  alert: {
    flexDirection: "row",
    backgroundColor: "#fef3c7",
    borderWidth: 1,
    borderColor: "#fde68a",
    borderRadius: 16,
    padding: 16,
    gap: 12,
    marginBottom: 24,
  },
  alertIcon: {
    width: 32,
    height: 32,
    backgroundColor: "#fef9c3",
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  alertContent: {
    flex: 1,
  },
  alertTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#78350f",
    marginBottom: 4,
  },
  alertDescription: {
    fontSize: 12,
    color: "#a16207",
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 16,
  },
  drinksGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  drinkCard: {
    width: "48%",
    borderWidth: 1,
    borderRadius: 16,
    padding: 12,
    minHeight: 120,
    justifyContent: "space-between",
    alignItems: "center",
  },
  drinkCardFooter: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
    marginTop: 8,
  },
  drinkName: {
    flex: 1,
  },
  drinkNameText: {
    fontSize: 12,
    textAlign: "left",
  },
  quickBrewButton: {
    width: 24,
    height: 24,
    backgroundColor: "#000000",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  drinkCardLarge: {
    width: "48%",
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    minHeight: 140,
    alignItems: "center",
    justifyContent: "center",
  },
  drinkCardLargeText: {
    fontSize: 14,
    textAlign: "center",
    marginTop: 8,
  },
  customCard: {
    width: "48%",
    borderWidth: 2,
    borderStyle: "dashed",
    borderRadius: 16,
    padding: 16,
    minHeight: 140,
    alignItems: "center",
    justifyContent: "center",
  },
  customIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  customText: {
    fontSize: 14,
  },
});
