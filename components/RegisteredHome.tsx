// components/RegisteredHome.tsx
import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import { Plus, Play } from "lucide-react-native";
import type { FavoriteConfig } from "../hooks/useFavorites";

interface RegisteredHomeProps {
  userName: string;
  favoriteConfigs: FavoriteConfig[];
  onSelectDrink: (drinkId: string) => void;
  onSelectFavorite: (fav: FavoriteConfig) => void;
  onQuickBrewFavorite: (fav: FavoriteConfig) => void;
  hasActiveOrder?: boolean;
  onGoToBrewing?: () => void;
  disabledDrinkIds?: string[];
}

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

export function RegisteredHome({
  userName,
  favoriteConfigs,
  onSelectDrink,
  onSelectFavorite,
  onQuickBrewFavorite,
  hasActiveOrder,
  onGoToBrewing,
  disabledDrinkIds = [],
}: RegisteredHomeProps) {
  const displayName = userName.split("@")[0];

  // Filtriraj onemogućene napitke
  const drinks = allDrinks.filter((d) => !disabledDrinkIds.includes(d.id));

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.greeting}>Hello, {displayName}</Text>

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

        {/* Favourites */}
        {favoriteConfigs.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Favourites</Text>
            <View style={styles.grid}>
              {favoriteConfigs.map((fav) => (
                <View
                  key={fav.id}
                  style={[
                    styles.favoriteCard,
                    hasActiveOrder && styles.cardDisabled,
                  ]}
                >
                  {drinkImages[fav.drink_id] && (
                    <Image
                      source={drinkImages[fav.drink_id]}
                      style={styles.favoriteImage}
                      resizeMode="contain"
                    />
                  )}
                  <View style={styles.favoriteActions}>
                    <TouchableOpacity
                      onPress={() => onSelectFavorite(fav)}
                      disabled={hasActiveOrder}
                      style={styles.drinkNameButton}
                    >
                      <Text style={styles.drinkNameText} numberOfLines={1}>
                        {fav.name}
                      </Text>
                      <Text style={styles.drinkConfigHint} numberOfLines={1}>
                        {fav.size} · {fav.strength} ·{" "}
                        {fav.milk_type === "regular"
                          ? "reg. milk"
                          : "plant milk"}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => onQuickBrewFavorite(fav)}
                      disabled={hasActiveOrder}
                      style={[
                        styles.playButton,
                        hasActiveOrder && styles.playButtonDisabled,
                      ]}
                    >
                      <Play size={12} color="#ffffff" fill="#ffffff" />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* All drinks */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Choose your coffee</Text>
          <View style={styles.grid}>
            {drinks.map((drink) => (
              <TouchableOpacity
                key={drink.id}
                onPress={() => onSelectDrink(drink.id)}
                disabled={hasActiveOrder}
                style={[
                  styles.drinkCard,
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
                  style={[
                    styles.drinkName,
                    hasActiveOrder && styles.textDisabled,
                  ]}
                  numberOfLines={2}
                >
                  {drink.name}
                </Text>
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              onPress={() => onSelectDrink("custom")}
              disabled={hasActiveOrder}
              style={[styles.customCard, hasActiveOrder && styles.cardDisabled]}
              activeOpacity={0.7}
            >
              <View style={styles.customIconContainer}>
                <Plus size={24} color="#4b5563" />
              </View>
              <Text style={styles.customText}>Custom</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#ffffff" },
  content: { flex: 1 },
  contentContainer: {
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 140,
  },
  greeting: {
    fontSize: 20,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 24,
  },
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
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 16,
  },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  favoriteCard: {
    width: "48%",
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 16,
    padding: 12,
    minHeight: 120,
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  cardDisabled: { opacity: 0.4 },
  favoriteImage: {
    width: "100%",
    height: 64,
    alignSelf: "center",
    marginBottom: 4,
  },
  favoriteActions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  drinkNameButton: { flex: 1 },
  drinkNameText: { fontSize: 13, fontWeight: "600", color: "#111827" },
  drinkConfigHint: { fontSize: 11, color: "#6b7280", marginTop: 2 },
  playButton: {
    width: 24,
    height: 24,
    backgroundColor: "#000000",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  playButtonDisabled: { backgroundColor: "#9ca3af" },
  drinkCard: {
    width: "48%",
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 16,
    padding: 16,
    minHeight: 140,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  drinkImage: { width: 70, height: 70, marginBottom: 8 },
  drinkName: {
    fontSize: 14,
    color: "#111827",
    textAlign: "center",
    lineHeight: 18,
  },
  textDisabled: { color: "#9ca3af" },
  customCard: {
    width: "48%",
    backgroundColor: "#f9fafb",
    borderWidth: 2,
    borderColor: "#d1d5db",
    borderStyle: "dashed",
    borderRadius: 16,
    padding: 16,
    minHeight: 140,
    alignItems: "center",
    justifyContent: "center",
  },
  customIconContainer: {
    width: 48,
    height: 48,
    backgroundColor: "#ffffff",
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  customText: { fontSize: 14, color: "#4b5563" },
});
