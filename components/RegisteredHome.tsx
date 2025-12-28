import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Platform,
} from "react-native";
import { Plus, Play } from "lucide-react-native";

interface RegisteredHomeProps {
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
  { id: "portion-of-milk-foam", name: "Portion of milk foam" },
];

export function RegisteredHome({
  userName,
  favorites,
  onSelectDrink,
  onToggleFavorite,
  onQuickBrew,
}: RegisteredHomeProps) {
  const displayName = userName.split("@")[0];

  // Get favorite drinks
  const favoriteDrinks = drinks.filter((drink) => favorites.includes(drink.id));

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      {/* Content */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Greeting */}
        <Text style={styles.greeting}>Hello, {displayName}</Text>

        {/* Favorites Section */}
        {favoriteDrinks.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Favorites</Text>

            <View style={styles.grid}>
              {favoriteDrinks.map((drink) => (
                <View key={drink.id} style={styles.favoriteCard}>
                  <View style={styles.coffeeIcon}>
                    <Text style={styles.coffeeEmoji}>☕</Text>
                  </View>
                  <View style={styles.favoriteActions}>
                    <TouchableOpacity
                      onPress={() => onSelectDrink(drink.id)}
                      style={styles.drinkNameButton}
                    >
                      <Text style={styles.drinkNameText} numberOfLines={2}>
                        {drink.name}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => onQuickBrew?.(drink.id)}
                      style={styles.playButton}
                      activeOpacity={0.8}
                    >
                      <Play size={12} color="#ffffff" fill="#ffffff" />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* List of drinks */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Choose your coffee</Text>
          <View style={styles.grid}>
            {drinks.slice(0, -1).map((drink) => (
              <TouchableOpacity
                key={drink.id}
                onPress={() => onSelectDrink(drink.id)}
                style={styles.drinkCard}
                activeOpacity={0.7}
              >
                <View style={styles.drinkIcon}>
                  <Text style={styles.drinkEmoji}>☕</Text>
                </View>
                <Text style={styles.drinkName} numberOfLines={2}>
                  {drink.name}
                </Text>
              </TouchableOpacity>
            ))}

            {/* Custom Drink Button */}
            <TouchableOpacity
              onPress={() => onSelectDrink("custom")}
              style={styles.customCard}
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
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 24,
    paddingTop: Platform.OS === "ios" ? 60 : 20,
    paddingBottom: 140,
  },
  greeting: {
    fontSize: 20,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 16,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
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
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  coffeeIcon: {
    width: 48,
    height: 64,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginBottom: 4,
  },
  coffeeEmoji: {
    fontSize: 40,
  },
  favoriteActions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  drinkNameButton: {
    flex: 1,
  },
  drinkNameText: {
    fontSize: 12,
    color: "#111827",
  },
  playButton: {
    width: 24,
    height: 24,
    backgroundColor: "#000000",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
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
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  drinkIcon: {
    width: 56,
    height: 80,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  drinkEmoji: {
    fontSize: 48,
  },
  drinkName: {
    fontSize: 14,
    color: "#111827",
    textAlign: "center",
    lineHeight: 18,
  },
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
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  customText: {
    fontSize: 14,
    color: "#4b5563",
  },
});
