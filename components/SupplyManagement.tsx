import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import {
  ArrowLeft,
  Coffee,
  Package,
  Candy,
  TrendingUp,
  AlertTriangle,
} from "lucide-react-native";
import { Progress } from "./ui/progress";
import { LinearGradient } from "expo-linear-gradient";

interface SupplyManagementProps {
  onBack: () => void;
}

const supplies = [
  {
    name: "Coffee Beans",
    level: 28,
    icon: Coffee,
    colors: ["#6F4E37", "#8B5A3C"] as const,
    unit: "g",
    total: 2000,
  },
  {
    name: "Regular Milk",
    level: 72,
    icon: Package,
    colors: ["#3b82f6", "#06b6d4"] as const,
    unit: "ml",
    total: 1500,
  },
  {
    name: "Plant-Based Milk",
    level: 65,
    icon: Package,
    colors: ["#10b981", "#059669"] as const,
    unit: "ml",
    total: 1000,
  },
  {
    name: "Sugar",
    level: 45,
    icon: Candy,
    colors: ["#ec4899", "#f43f5e"] as const,
    unit: "g",
    total: 1500,
  },
  {
    name: "Water",
    level: 88,
    icon: Package,
    colors: ["#22d3ee", "#3b82f6"] as const,
    unit: "ml",
    total: 10000,
  },
];

export function SupplyManagement({ onBack }: SupplyManagementProps) {
  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={["#2563eb", "#0891b2"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity
            onPress={onBack}
            style={styles.backButton}
            activeOpacity={0.7}
          >
            <ArrowLeft size={24} color="#ffffff" />
          </TouchableOpacity>
          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>Supply Management</Text>
            <Text style={styles.headerSubtitle}>
              Monitor current stock levels
            </Text>
          </View>
        </View>
      </LinearGradient>

      {/* Content */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Supply Levels */}
        <View style={styles.suppliesSection}>
          {supplies.map((supply) => {
            const IconComponent = supply.icon;
            const currentAmount = Math.round(
              (supply.level / 100) * supply.total
            );
            const isLow = supply.level < 30;

            return (
              <View key={supply.name} style={styles.supplyCard}>
                <View style={styles.supplyHeader}>
                  <View style={styles.supplyInfo}>
                    <LinearGradient
                      colors={supply.colors}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.supplyIcon}
                    >
                      <IconComponent size={24} color="#ffffff" />
                    </LinearGradient>
                    <View style={styles.supplyDetails}>
                      <View style={styles.supplyNameRow}>
                        <Text style={styles.supplyName}>{supply.name}</Text>
                        {isLow && (
                          <View style={styles.lowBadge}>
                            <Text style={styles.lowBadgeText}>Low</Text>
                          </View>
                        )}
                      </View>
                      <Text style={styles.supplyAmount}>
                        {currentAmount} / {supply.total} {supply.unit}
                      </Text>
                    </View>
                  </View>
                  <Text
                    style={[
                      styles.supplyPercentage,
                      isLow && styles.supplyPercentageLow,
                    ]}
                  >
                    {supply.level}%
                  </Text>
                </View>
                <Progress
                  value={supply.level}
                  height={8}
                  style={isLow ? styles.progressLow : undefined}
                />
              </View>
            );
          })}
        </View>

        {/* Low Supply Warning */}
        <View style={styles.warningCard}>
          <View style={styles.warningHeader}>
            <View style={styles.warningIconContainer}>
              <AlertTriangle size={20} color="#a16207" />
            </View>
            <Text style={styles.warningTitle}>Low Supply Alert</Text>
          </View>
          <Text style={styles.warningText}>
            Coffee beans are below 30% threshold. Immediate restock recommended.
          </Text>
        </View>

        {/* Refill Recommendations */}
        <LinearGradient
          colors={["#faf5ff", "#eff6ff"]}
          style={styles.forecastCard}
        >
          <View style={styles.forecastHeader}>
            <TrendingUp size={20} color="#7c3aed" />
            <Text style={styles.forecastTitle}>Refill Forecast</Text>
          </View>
          <Text style={styles.forecastSubtitle}>
            Based on current usage patterns:
          </Text>
          <View style={styles.forecastList}>
            <View style={styles.forecastItem}>
              <View style={styles.forecastBullet} />
              <Text style={styles.forecastText}>
                Coffee beans: <Text style={styles.forecastBold}>2-3 days</Text>{" "}
                (lasts 3-4 days)
              </Text>
            </View>
            <View style={styles.forecastItem}>
              <View style={styles.forecastBullet} />
              <Text style={styles.forecastText}>
                Regular milk:{" "}
                <Text style={styles.forecastBold}>Daily refill</Text> (1500ml
                capacity)
              </Text>
            </View>
            <View style={styles.forecastItem}>
              <View style={styles.forecastBullet} />
              <Text style={styles.forecastText}>
                Plant-based milk:{" "}
                <Text style={styles.forecastBold}>Daily refill</Text> (1000ml
                capacity)
              </Text>
            </View>
            <View style={styles.forecastItem}>
              <View style={styles.forecastBullet} />
              <Text style={styles.forecastText}>
                Sugar: <Text style={styles.forecastBold}>5-6 days</Text>
              </Text>
            </View>
          </View>
        </LinearGradient>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5DC",
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 50,
    paddingBottom: 24,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  headerText: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#ffffff",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#a5f3fc",
    marginTop: 2,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 24,
    paddingVertical: 24,
    paddingBottom: 140,
  },
  suppliesSection: {
    gap: 16,
    marginBottom: 24,
  },
  supplyCard: {
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
    elevation: 1,
    marginBottom: 16,
  },
  supplyHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  supplyInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  supplyIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  supplyDetails: {
    flex: 1,
  },
  supplyNameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  supplyName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#6F4E37",
  },
  lowBadge: {
    backgroundColor: "#f97316",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  lowBadgeText: {
    fontSize: 10,
    fontWeight: "600",
    color: "#ffffff",
  },
  supplyAmount: {
    fontSize: 14,
    color: "#A0826D",
    marginTop: 4,
  },
  supplyPercentage: {
    fontSize: 24,
    fontWeight: "700",
    color: "#6F4E37",
  },
  supplyPercentageLow: {
    color: "#ea580c",
  },
  progressLow: {
    backgroundColor: "#fed7aa",
  },
  warningCard: {
    backgroundColor: "#fefce8",
    borderWidth: 2,
    borderColor: "#fde047",
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  warningHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
  },
  warningIconContainer: {
    width: 40,
    height: 40,
    backgroundColor: "#fef9c3",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  warningTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#713f12",
  },
  warningText: {
    fontSize: 14,
    color: "#854d0e",
    lineHeight: 20,
  },
  forecastCard: {
    borderWidth: 2,
    borderColor: "#e9d5ff",
    borderRadius: 16,
    padding: 20,
  },
  forecastHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  forecastTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#581c87",
  },
  forecastSubtitle: {
    fontSize: 14,
    color: "#6b21a8",
    marginBottom: 12,
  },
  forecastList: {
    gap: 8,
  },
  forecastItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
  },
  forecastBullet: {
    width: 6,
    height: 6,
    backgroundColor: "#7c3aed",
    borderRadius: 3,
    marginTop: 6,
  },
  forecastText: {
    flex: 1,
    fontSize: 14,
    color: "#6b21a8",
    lineHeight: 20,
  },
  forecastBold: {
    fontWeight: "700",
  },
});
