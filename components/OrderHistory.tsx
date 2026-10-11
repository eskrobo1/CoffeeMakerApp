// components/OrderHistory.tsx
import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import { ArrowLeft, AlertCircle } from "lucide-react-native";
import { Order } from "../hooks/useOrders";

interface OrderHistoryProps {
  orders: Order[];
  onRepeatOrder: (order: Order) => void;
  saveOrderHistory?: boolean;
  userName?: string;
  onBack?: () => void;
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

// Status boja i tekst
const getStatusStyle = (status: string) => {
  switch (status) {
    case "completed":
      return { color: "#16a34a", label: "Completed" };
    case "cancelled":
      return { color: "#dc2626", label: "Cancelled" };
    case "pending":
      return { color: "#d97706", label: "Pending" };
    case "brewing":
      return { color: "#2563eb", label: "Brewing" };
    default:
      return { color: "#6b7280", label: status };
  }
};

export function OrderHistory({
  orders,
  onRepeatOrder,
  saveOrderHistory,
  userName,
  onBack,
}: OrderHistoryProps) {
  // ── Timestamp fix ─────────────────────────────────────────────────────────
  // SQLite datetime('now') čuva u UTC.
  // Dodajemo 'Z' da JavaScript pravilno parsira kao UTC,
  // a onda getHours() vraća lokalno vrijeme uređaja.
  const formatDate = (dateString: string) => {
    // Dodaj Z ako nema timezone info (SQLite format: "2024-01-15 14:32:00")
    const normalized =
      dateString.includes("Z") || dateString.includes("+")
        ? dateString
        : dateString.replace(" ", "T") + "Z";

    const date = new Date(normalized);
    if (isNaN(date.getTime())) return dateString;

    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const timeStr = `${hours}:${minutes}`;

    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    if (isToday) return `Today at ${timeStr}`;

    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    return `${day}.${month}. at ${timeStr}`;
  };
  // ─────────────────────────────────────────────────────────────────────────

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={onBack}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <ArrowLeft size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Order History</Text>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {saveOrderHistory === false && (
          <View style={styles.alertContainer}>
            <AlertCircle
              size={20}
              color="#2563eb"
              style={{ marginTop: 2, marginRight: 12 }}
            />
            <View style={styles.alertContent}>
              <Text style={styles.alertTitle}>History Saving is Off</Text>
              <Text style={styles.alertDescription}>
                Enable it in your profile settings to track your orders.
              </Text>
            </View>
          </View>
        )}

        {orders.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <Text style={styles.emptyIconText}>☕</Text>
            </View>
            <Text style={styles.emptyTitle}>No orders yet</Text>
            <Text style={styles.emptyDescription}>
              Your order history will appear here
            </Text>
          </View>
        ) : (
          <View style={styles.ordersList}>
            {orders.map((order) => {
              const statusStyle = getStatusStyle(order.status);
              const canRepeat =
                order.status === "completed" || order.status === "cancelled";
              return (
                <View key={order.id} style={styles.orderCard}>
                  <View style={styles.orderContent}>
                    {/* Slika */}
                    <View style={styles.coffeeImageContainer}>
                      {drinkImages[order.drink_id] ? (
                        <Image
                          source={drinkImages[order.drink_id]}
                          style={styles.coffeeImage}
                          resizeMode="contain"
                        />
                      ) : (
                        <Text style={styles.coffeeEmoji}>☕</Text>
                      )}
                    </View>

                    {/* Detalji */}
                    <View style={styles.orderDetails}>
                      <Text style={styles.drinkName}>{order.drink_name}</Text>

                      {/* Timestamp u 24h formatu */}
                      <Text style={styles.timestamp}>
                        {formatDate(order.created_at)}
                      </Text>

                      {/* Status */}
                      <Text
                        style={[
                          styles.statusBadge,
                          { color: statusStyle.color },
                        ]}
                      >
                        {statusStyle.label}
                      </Text>

                      <Text style={styles.orderSpecs}>
                        <Text style={styles.capitalize}>{order.strength}</Text>{" "}
                        strength ·{" "}
                        <Text style={styles.capitalize}>
                          {order.milk_type || "no"}
                        </Text>{" "}
                        milk ·{" "}
                        <Text style={styles.capitalize}>{order.size}</Text>
                      </Text>

                      {canRepeat && (
                        <TouchableOpacity
                          style={styles.repeatButton}
                          onPress={() => onRepeatOrder(order)}
                          activeOpacity={0.8}
                        >
                          <Text style={styles.repeatButtonText}>Repeat</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9fafb" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 16,
    gap: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: { fontSize: 20, fontWeight: "600", color: "#111827" },
  content: { flex: 1 },
  contentContainer: {
    paddingHorizontal: 24,
    paddingVertical: 24,
    paddingBottom: 140,
  },
  alertContainer: {
    backgroundColor: "#eff6ff",
    borderWidth: 1,
    borderColor: "#bfdbfe",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "flex-start",
  },
  alertContent: { flex: 1 },
  alertTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1e3a8a",
    marginBottom: 4,
  },
  alertDescription: { fontSize: 12, color: "#1d4ed8", lineHeight: 18 },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 64,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    backgroundColor: "#e5e7eb",
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  emptyIconText: { fontSize: 40 },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 8,
  },
  emptyDescription: { fontSize: 14, color: "#6b7280", textAlign: "center" },
  ordersList: { gap: 16 },
  orderCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    marginBottom: 4,
  },
  orderContent: { flexDirection: "row", alignItems: "flex-start" },
  coffeeImageContainer: {
    width: 64,
    height: 80,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  coffeeImage: { width: 64, height: 64 },
  coffeeEmoji: { fontSize: 48 },
  orderDetails: { flex: 1 },
  drinkName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
  },
  timestamp: { fontSize: 12, color: "#6b7280", marginBottom: 4 },
  statusBadge: { fontSize: 12, fontWeight: "600", marginBottom: 6 },
  orderSpecs: {
    fontSize: 12,
    color: "#4b5563",
    marginBottom: 12,
    lineHeight: 18,
  },
  capitalize: { textTransform: "capitalize" },
  repeatButton: {
    width: "100%",
    height: 40,
    backgroundColor: "#000000",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  repeatButtonText: { color: "#ffffff", fontSize: 14, fontWeight: "600" },
});
