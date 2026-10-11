// components/AdminHome.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import { Play, AlertTriangle, Plus, MessageSquare } from "lucide-react-native";
import { useTheme, Shadows } from "../constants/Theme";
import { useDatabase } from "../contexts/DatabaseContext";
import type { FavoriteConfig } from "../hooks/useFavorites";

interface AdminHomeProps {
  userName: string;
  favoriteConfigs: FavoriteConfig[];
  onSelectDrink: (drinkId: string) => void;
  onSelectFavorite: (fav: FavoriteConfig) => void;
  onQuickBrewFavorite: (fav: FavoriteConfig) => void;
  hasActiveOrder?: boolean;
  onGoToBrewing?: () => void;
  notifications?: boolean;
  disabledDrinkIds?: string[];
  onGoToMessages?: () => void; // za klik na message banner
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

export function AdminHome({
  userName,
  favoriteConfigs,
  onSelectDrink,
  onSelectFavorite,
  onQuickBrewFavorite,
  hasActiveOrder,
  onGoToBrewing,
  notifications = true,
  disabledDrinkIds = [],
  onGoToMessages,
}: AdminHomeProps) {
  const { colors } = useTheme();
  const { db, isReady } = useDatabase();
  const [unreadMessages, setUnreadMessages] = useState(0);

  const displayName = userName.includes("@")
    ? userName.split("@")[0]
    : userName;
  const drinks = allDrinks.filter((d) => !disabledDrinkIds.includes(d.id));

  // Provjeri nepročitane poruke
  useEffect(() => {
    if (!db || !isReady) return;
    db.getFirstAsync<{ count: number }>(
      `SELECT COUNT(*) as count FROM user_messages WHERE status = 'unread'`,
    )
      .then((r) => {
        if (r) setUnreadMessages(r.count);
      })
      .catch(() => {});
  }, [db, isReady]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={[styles.greeting, { color: colors.foreground }]}>
          Hello, {displayName}
        </Text>

        {/* Busy banner — brewing */}
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

        {/* ── Plava notifikacija za nove poruke od korisnika ─────────────────── */}
        {unreadMessages > 0 && (
          <TouchableOpacity
            style={styles.messageBanner}
            onPress={onGoToMessages}
            activeOpacity={0.8}
          >
            <View style={styles.messageBannerIcon}>
              <MessageSquare size={16} color="#2563eb" />
            </View>
            <Text style={styles.messageBannerText}>
              {unreadMessages} new{" "}
              {unreadMessages === 1 ? "message" : "messages"} from users
            </Text>
            <Text style={styles.messageBannerLink}>View →</Text>
          </TouchableOpacity>
        )}
        {/* ────────────────────────────────────────────────────────────────────── */}

        {/* Low coffee supply — samo kad su notifikacije ON */}
        {notifications !== false && (
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
        )}

        {/* Favourites */}
        {favoriteConfigs.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
              Favourites
            </Text>
            <View style={styles.drinksGrid}>
              {favoriteConfigs.map((fav) => (
                <View
                  key={fav.id}
                  style={[
                    styles.drinkCard,
                    Shadows.sm,
                    {
                      backgroundColor: colors.card,
                      borderColor: colors.border,
                    },
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
                  <View style={styles.drinkCardFooter}>
                    <TouchableOpacity
                      onPress={() => onSelectFavorite(fav)}
                      disabled={hasActiveOrder}
                      style={styles.drinkName}
                    >
                      <Text
                        style={[
                          styles.drinkNameText,
                          { color: colors.foreground },
                        ]}
                        numberOfLines={1}
                      >
                        {fav.name}
                      </Text>
                      <Text
                        style={[
                          styles.drinkConfigHint,
                          { color: colors.mutedForeground },
                        ]}
                        numberOfLines={1}
                      >
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
                        styles.quickBrewButton,
                        hasActiveOrder && styles.quickBrewDisabled,
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
                  styles.drinkCardLarge,
                  Shadows.sm,
                  { backgroundColor: colors.card, borderColor: colors.border },
                  hasActiveOrder && styles.cardDisabled,
                ]}
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
                    styles.drinkCardLargeText,
                    { color: colors.foreground },
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
              style={[
                styles.customCard,
                { backgroundColor: colors.muted, borderColor: colors.border },
                hasActiveOrder && styles.cardDisabled,
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
  container: { flex: 1 },
  content: { flex: 1 },
  scrollContent: { paddingHorizontal: 24, paddingTop: 8, paddingBottom: 140 },
  greeting: { fontSize: 20, fontWeight: "600", marginBottom: 24 },
  busyBanner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#000000",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 12,
  },
  busyBannerText: { color: "#ffffff", fontSize: 14, fontWeight: "500" },
  busyBannerLink: { color: "#10b981", fontSize: 14, fontWeight: "600" },
  // Plava notifikacija za poruke
  messageBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#eff6ff",
    borderWidth: 1,
    borderColor: "#bfdbfe",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 12,
    gap: 10,
  },
  messageBannerIcon: {
    width: 28,
    height: 28,
    backgroundColor: "#dbeafe",
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  messageBannerText: {
    flex: 1,
    color: "#1d4ed8",
    fontSize: 14,
    fontWeight: "500",
  },
  messageBannerLink: { color: "#2563eb", fontSize: 14, fontWeight: "600" },
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
  alertContent: { flex: 1 },
  alertTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#78350f",
    marginBottom: 4,
  },
  alertDescription: { fontSize: 12, color: "#a16207" },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 16, fontWeight: "600", marginBottom: 16 },
  drinksGrid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  drinkCard: {
    width: "48%",
    borderWidth: 1,
    borderRadius: 16,
    padding: 12,
    minHeight: 120,
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardDisabled: { opacity: 0.4 },
  favoriteImage: { width: "100%", height: 60, alignSelf: "center" },
  drinkCardFooter: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
    marginTop: 8,
  },
  drinkName: { flex: 1 },
  drinkNameText: { fontSize: 12, fontWeight: "600" },
  drinkConfigHint: { fontSize: 11, marginTop: 2 },
  quickBrewButton: {
    width: 24,
    height: 24,
    backgroundColor: "#000000",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  quickBrewDisabled: { backgroundColor: "#9ca3af" },
  drinkCardLarge: {
    width: "48%",
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    minHeight: 140,
    alignItems: "center",
    justifyContent: "center",
  },
  drinkImage: { width: 70, height: 70, marginBottom: 8 },
  drinkCardLargeText: { fontSize: 14, textAlign: "center", marginTop: 8 },
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
