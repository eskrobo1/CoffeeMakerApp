import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import {
  Coffee,
  Milk,
  Heart,
  Droplet,
  Sparkles,
  Wind,
  Plus,
  AlertCircle,
} from "lucide-react-native";
import { useTheme, Shadows } from "../constants/Theme";

type UserType = "guest" | "registered" | "admin";

interface Drink {
  id: string;
  name: string;
  description: string;
  icon: "coffee" | "milk" | "droplet" | "sparkles" | "wind" | "plus";
  color: string;
}

interface DrinkSelectionHomeProps {
  onSelectDrink: (drinkId: string) => void;
  userType: UserType;
  userName?: string;
  favorites?: string[];
  onToggleFavorite?: (drinkId: string) => void;
  cupDetected: boolean;
  hasAlerts?: boolean;
}

const drinks: Drink[] = [
  {
    id: "espresso",
    name: "Espresso",
    description: "Strong & bold",
    icon: "coffee",
    color: "#78350f",
  },
  {
    id: "cappuccino",
    name: "Cappuccino",
    description: "Rich & creamy",
    icon: "milk",
    color: "#ea580c",
  },
  {
    id: "latte",
    name: "Latte",
    description: "Smooth & mild",
    icon: "droplet",
    color: "#f59e0b",
  },
  {
    id: "mocha",
    name: "Mocha",
    description: "Sweet chocolate",
    icon: "sparkles",
    color: "#c2410c",
  },
  {
    id: "americano",
    name: "Americano",
    description: "Classic & clean",
    icon: "wind",
    color: "#b45309",
  },
  {
    id: "custom",
    name: "Custom Drink",
    description: "Create your own",
    icon: "plus",
    color: "#9333ea",
  },
];

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
    case "plus":
      return <Plus size={size} color={color} />;
    default:
      return <Coffee size={size} color={color} />;
  }
};

export function DrinkSelectionHome({
  onSelectDrink,
  userType,
  userName,
  favorites = [],
  onToggleFavorite,
  cupDetected,
  hasAlerts = false,
}: DrinkSelectionHomeProps) {
  const { colors } = useTheme();
  const favoriteDrinks = drinks.filter((d) => favorites.includes(d.id));

  return (
    <View style={styles.container}>
      {/* Welcome Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          {userType === "guest"
            ? "Welcome!"
            : `Hi, ${userName?.split("@")[0]}!`}
        </Text>
        <Text style={styles.headerSubtitle}>
          What would you like to brew today?
        </Text>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Alerts */}
        {hasAlerts && (
          <View style={styles.alertCard}>
            <View style={styles.alertIcon}>
              <AlertCircle size={20} color="#a16207" />
            </View>
            <View style={styles.alertContent}>
              <Text style={styles.alertTitle}>Low Coffee Supply</Text>
              <Text style={styles.alertDescription}>
                Coffee beans below 30%. Restock recommended.
              </Text>
            </View>
          </View>
        )}

        {/* Cup Warning */}
        {!cupDetected && (
          <View style={[styles.alertCard, styles.alertCardDanger]}>
            <View style={[styles.alertIcon, styles.alertIconDanger]}>
              <Coffee size={24} color="#dc2626" />
            </View>
            <View>
              <Text style={styles.alertTitleDanger}>No cup detected</Text>
              <Text style={styles.alertDescriptionDanger}>
                Please place a cup to continue
              </Text>
            </View>
          </View>
        )}

        {/* Favorites Section */}
        {userType !== "guest" && favoriteDrinks.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Heart size={20} color="#ef4444" fill="#ef4444" />
              <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
                Your Favorites
              </Text>
            </View>
            <View style={styles.favoritesGrid}>
              {favoriteDrinks.slice(0, 4).map((drink) => (
                <TouchableOpacity
                  key={drink.id}
                  onPress={() => onSelectDrink(drink.id)}
                  disabled={!cupDetected}
                  style={[
                    styles.favoriteCard,
                    Shadows.lg,
                    { backgroundColor: drink.color },
                    !cupDetected && styles.disabledCard,
                  ]}
                >
                  <View style={styles.quickBadge}>
                    <Text style={styles.quickBadgeText}>Quick</Text>
                  </View>
                  {getIcon(drink.icon, 36, "#ffffff")}
                  <Text style={styles.favoriteCardText}>{drink.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* All Drinks */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
            All Drinks
          </Text>
          <View style={styles.drinksGrid}>
            {drinks.map((drink) => (
              <TouchableOpacity
                key={drink.id}
                onPress={() => onSelectDrink(drink.id)}
                disabled={!cupDetected}
                style={[
                  styles.drinkCard,
                  Shadows.xl,
                  { backgroundColor: drink.color },
                  !cupDetected && styles.disabledCard,
                ]}
                activeOpacity={0.85}
              >
                {userType !== "guest" &&
                  onToggleFavorite &&
                  drink.id !== "custom" && (
                    <TouchableOpacity
                      onPress={(e) => {
                        e.stopPropagation();
                        onToggleFavorite(drink.id);
                      }}
                      style={styles.heartButton}
                    >
                      <Heart
                        size={16}
                        color="#ffffff"
                        fill={
                          favorites.includes(drink.id)
                            ? "#ffffff"
                            : "transparent"
                        }
                      />
                    </TouchableOpacity>
                  )}
                {getIcon(drink.icon, 48, "#ffffff")}
                <View style={styles.drinkCardContent}>
                  <Text style={styles.drinkCardName}>{drink.name}</Text>
                  <Text style={styles.drinkCardDescription}>
                    {drink.description}
                  </Text>
                </View>
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
    paddingBottom: 80,
  },
  header: {
    backgroundColor: "#92400e",
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 32,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "600",
    color: "#ffffff",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#fcd34d",
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
  },
  alertCard: {
    backgroundColor: "#fef3c7",
    borderWidth: 2,
    borderColor: "#fde68a",
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
  },
  alertCardDanger: {
    backgroundColor: "#fef2f2",
    borderColor: "#fecaca",
  },
  alertIcon: {
    width: 40,
    height: 40,
    backgroundColor: "#fef9c3",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  alertIconDanger: {
    backgroundColor: "#fee2e2",
  },
  alertContent: {
    flex: 1,
  },
  alertTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#78350f",
    marginBottom: 2,
  },
  alertDescription: {
    fontSize: 12,
    color: "#a16207",
  },
  alertTitleDanger: {
    fontSize: 14,
    fontWeight: "600",
    color: "#7f1d1d",
    marginBottom: 2,
  },
  alertDescriptionDanger: {
    fontSize: 12,
    color: "#991b1b",
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  favoritesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  favoriteCard: {
    width: "48%",
    height: 96,
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    position: "relative",
  },
  quickBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  quickBadgeText: {
    fontSize: 10,
    color: "#ffffff",
    fontWeight: "600",
  },
  favoriteCardText: {
    fontSize: 14,
    color: "#ffffff",
    fontWeight: "500",
  },
  drinksGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
  },
  drinkCard: {
    width: "48%",
    minHeight: 160,
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    position: "relative",
  },
  disabledCard: {
    opacity: 0.5,
  },
  heartButton: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 32,
    height: 32,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  drinkCardContent: {
    alignItems: "center",
  },
  drinkCardName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
    marginBottom: 4,
    textAlign: "center",
  },
  drinkCardDescription: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.8)",
    textAlign: "center",
  },
});
