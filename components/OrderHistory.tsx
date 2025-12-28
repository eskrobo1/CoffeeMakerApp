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
import { ArrowLeft, AlertCircle } from "lucide-react-native";
import { Button } from "./ui/button";
import type { Order } from "../types";

interface OrderHistoryProps {
  orders: Order[];
  onRepeatOrder: (order: Order) => void;
  saveOrderHistory?: boolean;
  userName?: string;
  onBack?: () => void;
}

export function OrderHistory({
  orders,
  onRepeatOrder,
  saveOrderHistory,
  userName,
  onBack,
}: OrderHistoryProps) {
  const formatDate = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);

    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    return date.toLocaleDateString();
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <ArrowLeft size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.greeting}>Hello, {userName || "Guest"}</Text>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {saveOrderHistory === false && (
          <View style={styles.alertContainer}>
            <AlertCircle size={20} color="#2563eb" style={styles.alertIcon} />
            <View style={styles.alertContent}>
              <Text style={styles.alertTitle}>History Saving is Off</Text>
              <Text style={styles.alertDescription}>
                Order history is not being saved. Enable it in your profile
                settings to track your orders.
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
            {orders.map((order) => (
              <View key={order.id} style={styles.orderCard}>
                <View style={styles.orderContent}>
                  {/* Coffee Icon */}
                  <View style={styles.coffeeIcon}>
                    <Text style={styles.coffeeEmoji}>☕</Text>
                  </View>

                  {/* Order Details */}
                  <View style={styles.orderDetails}>
                    <Text style={styles.drinkName}>{order.drinkName}</Text>
                    <Text style={styles.timestamp}>
                      {formatDate(order.timestamp)}
                    </Text>
                    <Text style={styles.orderSpecs}>
                      <Text style={styles.capitalize}>{order.strength}</Text>{" "}
                      strength,{" "}
                      <Text style={styles.capitalize}>{order.milkType}</Text>{" "}
                      milk, Size:{" "}
                      <Text style={styles.capitalize}>{order.size}</Text>
                    </Text>

                    <TouchableOpacity
                      style={styles.repeatButton}
                      onPress={() => onRepeatOrder(order)}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.repeatButtonText}>Repeat</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  header: {
    backgroundColor: "#ffffff",
    paddingHorizontal: 24,
    paddingTop: Platform.OS === "ios" ? 60 : 20,
    paddingBottom: 24,
  },
  backButton: {
    marginBottom: 16,
    width: 40,
    height: 40,
    justifyContent: "center",
  },
  greeting: {
    fontSize: 24,
    fontWeight: "600",
    color: "#111827",
  },
  content: {
    flex: 1,
  },
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
  alertIcon: {
    marginTop: 2,
    marginRight: 12,
  },
  alertContent: {
    flex: 1,
  },
  alertTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1e3a8a",
    marginBottom: 4,
  },
  alertDescription: {
    fontSize: 12,
    color: "#1d4ed8",
    lineHeight: 18,
  },
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
  emptyIconText: {
    fontSize: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
  },
  ordersList: {
    gap: 16,
  },
  orderCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    marginBottom: 16,
  },
  orderContent: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  coffeeIcon: {
    width: 64,
    height: 80,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  coffeeEmoji: {
    fontSize: 48,
  },
  orderDetails: {
    flex: 1,
  },
  drinkName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
  },
  timestamp: {
    fontSize: 12,
    color: "#6b7280",
    marginBottom: 8,
  },
  orderSpecs: {
    fontSize: 12,
    color: "#4b5563",
    marginBottom: 12,
    lineHeight: 18,
  },
  capitalize: {
    textTransform: "capitalize",
  },
  repeatButton: {
    width: "100%",
    height: 40,
    backgroundColor: "#000000",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  repeatButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
  },
});
