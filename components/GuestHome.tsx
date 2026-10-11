// components/GuestHome.tsx
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import { Plus } from "lucide-react-native";
import { useTheme, Shadows } from "../constants/Theme";

interface GuestHomeProps {
  onSelectDrink: (drinkId: string) => void;
  hasActiveOrder?: boolean;
  onGoToBrewing?: () => void;
  disabledDrinkIds?: string[];
}

const allDrinks = [
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
  { id: "portion-of-milk", name: "Portion of milk" },
  { id: "portion-of-milk-foam", name: "Portion of milk foam" },
];

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

export function GuestHome({
  onSelectDrink,
  hasActiveOrder,
  onGoToBrewing,
  disabledDrinkIds = [],
}: GuestHomeProps) {
  const { colors } = useTheme();
  const drinks = allDrinks.filter((d) => !disabledDrinkIds.includes(d.id));

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.greeting, { color: colors.foreground }]}>
          Hello, Guest
        </Text>

        {hasActiveOrder && (
          <TouchableOpacity
            style={styles.busyBanner}
            onPress={onGoToBrewing}
            activeOpacity={0.8}
          >
            <Text style={styles.busyBannerText}>
              ☕ Your order is in progress
            </Text>
            <Text style={styles.busyBannerLink}>View →</Text>
          </TouchableOpacity>
        )}

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
            Choose your coffee
          </Text>
          <View style={styles.drinksGrid}>
            {drinks.map((drink) => (
              <TouchableOpacity
                key={drink.id}
                onPress={() => onSelectDrink(drink.id)}
                disabled={hasActiveOrder}
                style={[
                  styles.drinkCard,
                  Shadows.sm,
                  { backgroundColor: colors.card, borderColor: colors.border },
                  hasActiveOrder && styles.cardDisabled,
                ]}
                activeOpacity={0.7}
              >
                {drinkImages[drink.id] && (
                  <Image
                    source={drinkImages[drink.id]}
                    style={styles.drinkImage}
                    resizeMode="contain"
                  />
                )}
                <Text
                  style={[styles.drinkName, { color: colors.foreground }]}
                  numberOfLines={2}
                >
                  {drink.name}
                </Text>
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              onPress={() => onSelectDrink("custom")}
              disabled={hasActiveOrder}
              style={[
                styles.customCard,
                { backgroundColor: colors.muted, borderColor: colors.border },
                hasActiveOrder && styles.cardDisabled,
              ]}
              activeOpacity={0.7}
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
  container: { flex: 1 },
  content: { flex: 1 },
  scrollContent: { paddingHorizontal: 24, paddingTop: 8, paddingBottom: 140 },
  greeting: { fontSize: 20, fontWeight: "600", marginBottom: 16 },

  busyBanner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#000000",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
  },
  busyBannerText: { color: "#ffffff", fontSize: 14, fontWeight: "500" },
  busyBannerLink: { color: "#10b981", fontSize: 14, fontWeight: "600" },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 16, fontWeight: "600", marginBottom: 16 },
  drinksGrid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  drinkCard: {
    width: "48%",
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    minHeight: 140,
    alignItems: "center",
    justifyContent: "center",
  },
  cardDisabled: { opacity: 0.4 },
  drinkImage: { width: 70, height: 70, marginBottom: 8 },
  drinkName: { fontSize: 14, textAlign: "center", lineHeight: 18 },
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
  customText: { fontSize: 14 },
});
