// components/SupplyManagement.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  ArrowLeft,
  Coffee,
  Package,
  TrendingUp,
  AlertTriangle,
  RefreshCw,
  X,
} from "lucide-react-native";
import { Progress } from "./ui/progress";
import { LinearGradient } from "expo-linear-gradient";

interface SupplyManagementProps {
  onBack: () => void;
}

export const SUPPLY_LEVELS_KEY = "supplyLevels";
export const SUPPLY_TOTALS = {
  coffee: 2000, // g
  milk: 1500, // ml
  plantMilk: 1000, // ml
  sugar: 1500, // g
  water: 10000, // ml
};
export const SUPPLY_DEFAULTS = {
  coffee: 28,
  milk: 72,
  plantMilk: 65,
  sugar: 45,
  water: 88,
};

const SUPPLY_DEFS = [
  {
    id: "coffee",
    name: "Coffee Beans",
    icon: Coffee,
    colors: ["#6F4E37", "#8B5A3C"] as const,
    unit: "g",
    refillNote: "Replace or refill coffee bean container",
  },
  {
    id: "milk",
    name: "Regular Milk",
    icon: Package,
    colors: ["#0d9488", "#0891b2"] as const,
    unit: "ml",
    refillNote: "Add fresh regular milk",
  },
  {
    id: "plantMilk",
    name: "Plant-Based Milk",
    icon: Package,
    colors: ["#10b981", "#059669"] as const,
    unit: "ml",
    refillNote: "Add fresh plant-based milk",
  },
  {
    id: "sugar",
    name: "Sugar",
    icon: Package,
    colors: ["#ec4899", "#f43f5e"] as const,
    unit: "g",
    refillNote: "Refill sugar dispenser",
  },
  {
    id: "water",
    name: "Water",
    icon: Package,
    colors: ["#22d3ee", "#3b82f6"] as const,
    unit: "ml",
    refillNote: "Connect to water supply or refill tank",
  },
];

export function SupplyManagement({ onBack }: SupplyManagementProps) {
  const [levels, setLevels] = useState<Record<string, number>>({
    ...SUPPLY_DEFAULTS,
  });
  const [loaded, setLoaded] = useState(false);
  const [refillTarget, setRefillTarget] = useState<
    (typeof SUPPLY_DEFS)[0] | null
  >(null);
  const [showRefillModal, setShowRefillModal] = useState(false);

  // Učitaj razine iz AsyncStorage pri mount-u
  useEffect(() => {
    AsyncStorage.getItem(SUPPLY_LEVELS_KEY)
      .then((val) => {
        if (val) setLevels({ ...SUPPLY_DEFAULTS, ...JSON.parse(val) });
      })
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, []);

  const saveLevels = (newLevels: Record<string, number>) => {
    setLevels(newLevels);
    AsyncStorage.setItem(SUPPLY_LEVELS_KEY, JSON.stringify(newLevels)).catch(
      () => {},
    );
  };

  const openRefill = (def: (typeof SUPPLY_DEFS)[0]) => {
    setRefillTarget(def);
    setShowRefillModal(true);
  };

  const handleRefill = (toLevel: number) => {
    if (!refillTarget) return;
    const newLevels = {
      ...levels,
      [refillTarget.id]: Math.min(100, Math.max(0, toLevel)),
    };
    saveLevels(newLevels);
    setShowRefillModal(false);
    Alert.alert(
      "✅ Refill Simulated",
      `${refillTarget.name} filled to ${Math.round(Math.min(100, toLevel))}%.\n\n⚠️ This is a simulation of adding supplies to the machine.`,
    );
  };

  const supplies = SUPPLY_DEFS.map((d) => ({
    ...d,
    level:
      Math.round(
        (levels[d.id] ??
          SUPPLY_DEFAULTS[d.id as keyof typeof SUPPLY_DEFAULTS]) * 10,
      ) / 10,
    currentAmount: Math.round(
      ((levels[d.id] ?? SUPPLY_DEFAULTS[d.id as keyof typeof SUPPLY_DEFAULTS]) /
        100) *
        SUPPLY_TOTALS[d.id as keyof typeof SUPPLY_TOTALS],
    ),
    total: SUPPLY_TOTALS[d.id as keyof typeof SUPPLY_TOTALS],
  }));

  const lowSupplies = supplies.filter((s) => s.level < 30);

  if (!loaded) return null;

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#0f766e", "#0d9488"]}
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
              Monitor & simulate refills
            </Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.simNote}>
          <Text style={styles.simNoteText}>
            ℹ️ Supply levels decrease automatically with each completed order.
            Tap <Text style={{ fontWeight: "700" }}>Refill</Text> to simulate
            adding supplies.
          </Text>
        </View>

        <View style={styles.suppliesSection}>
          {supplies.map((supply) => {
            const IconComponent = supply.icon;
            const isLow = supply.level < 30;
            return (
              <View key={supply.id} style={styles.supplyCard}>
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
                        {supply.currentAmount.toLocaleString()} /{" "}
                        {supply.total.toLocaleString()} {supply.unit}
                      </Text>
                    </View>
                  </View>
                  <Text
                    style={[
                      styles.supplyPercentage,
                      isLow && styles.supplyPercentageLow,
                    ]}
                  >
                    {supply.level.toFixed(1)}%
                  </Text>
                </View>

                <Progress value={supply.level} height={8} />

                <TouchableOpacity
                  style={[
                    styles.refillButton,
                    { borderColor: supply.colors[1] },
                  ]}
                  onPress={() => openRefill(supply)}
                  activeOpacity={0.7}
                >
                  <RefreshCw size={14} color={supply.colors[1]} />
                  <Text
                    style={[
                      styles.refillButtonText,
                      { color: supply.colors[1] },
                    ]}
                  >
                    Refill
                  </Text>
                </TouchableOpacity>
              </View>
            );
          })}
        </View>

        {lowSupplies.length > 0 && (
          <View style={styles.warningCard}>
            <View style={styles.warningHeader}>
              <View style={styles.warningIconContainer}>
                <AlertTriangle size={20} color="#a16207" />
              </View>
              <Text style={styles.warningTitle}>Low Supply Alert</Text>
            </View>
            <Text style={styles.warningText}>
              {lowSupplies.map((s) => s.name).join(", ")}{" "}
              {lowSupplies.length === 1 ? "is" : "are"} below 30%. Restock
              recommended.
            </Text>
          </View>
        )}

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
            {[
              { text: "Coffee beans:", detail: "2–3 days" },
              { text: "Regular milk:", detail: "Daily refill" },
              { text: "Plant-based milk:", detail: "Daily refill" },
              { text: "Sugar:", detail: "5–6 days" },
            ].map((item, i) => (
              <View key={i} style={styles.forecastItem}>
                <View style={styles.forecastBullet} />
                <Text style={styles.forecastText}>
                  {item.text}{" "}
                  <Text style={styles.forecastBold}>{item.detail}</Text>
                </Text>
              </View>
            ))}
          </View>
        </LinearGradient>
      </ScrollView>

      {/* Refill Modal */}
      <Modal
        visible={showRefillModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowRefillModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>
                  Refill {refillTarget?.name}
                </Text>
                <Text style={styles.modalSub}>
                  Current:{" "}
                  {refillTarget ? (levels[refillTarget.id] ?? 0).toFixed(1) : 0}
                  %
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setShowRefillModal(false)}
                style={styles.modalCloseBtn}
              >
                <X size={20} color="#6b7280" />
              </TouchableOpacity>
            </View>
            <View style={styles.refillSimNote}>
              <Text style={styles.refillSimNoteText}>
                ⚠️ Simulation — Select how much to add to the machine
              </Text>
            </View>
            {refillTarget && (
              <Text style={styles.refillNoteText}>
                💡 {refillTarget.refillNote}
              </Text>
            )}
            <Text style={styles.refillLabel}>Choose fill level:</Text>
            <View style={styles.refillOptions}>
              {[
                {
                  label: "+25%",
                  action: () =>
                    handleRefill((levels[refillTarget!.id] ?? 0) + 25),
                },
                {
                  label: "+50%",
                  action: () =>
                    handleRefill((levels[refillTarget!.id] ?? 0) + 50),
                },
                { label: "Fill 75%", action: () => handleRefill(75) },
                {
                  label: "Fill 100%",
                  action: () => handleRefill(100),
                  primary: true,
                },
              ].map((opt) => (
                <TouchableOpacity
                  key={opt.label}
                  style={[
                    styles.refillOption,
                    opt.primary && styles.refillOptionPrimary,
                  ]}
                  onPress={opt.action}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.refillOptionText,
                      opt.primary && styles.refillOptionTextPrimary,
                    ]}
                  >
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F5DC" },
  header: {
    paddingHorizontal: 24,
    paddingTop: 50,
    paddingBottom: 24,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  headerContent: { flexDirection: "row", alignItems: "center", gap: 12 },
  backButton: {
    width: 40,
    height: 40,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  headerText: { flex: 1 },
  headerTitle: { fontSize: 20, fontWeight: "700", color: "#ffffff" },
  headerSubtitle: { fontSize: 14, color: "#99f6e4", marginTop: 2 },
  content: { flex: 1 },
  contentContainer: {
    paddingHorizontal: 24,
    paddingVertical: 24,
    paddingBottom: 140,
  },
  simNote: {
    backgroundColor: "#e0f2fe",
    borderWidth: 1,
    borderColor: "#7dd3fc",
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
  },
  simNoteText: { fontSize: 13, color: "#0369a1", lineHeight: 20 },
  suppliesSection: { marginBottom: 24 },
  supplyCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
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
  supplyInfo: { flexDirection: "row", alignItems: "center", gap: 12, flex: 1 },
  supplyIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  supplyDetails: { flex: 1 },
  supplyNameRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  supplyName: { fontSize: 16, fontWeight: "600", color: "#6F4E37" },
  lowBadge: {
    backgroundColor: "#f97316",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  lowBadgeText: { fontSize: 10, fontWeight: "600", color: "#ffffff" },
  supplyAmount: { fontSize: 14, color: "#A0826D", marginTop: 4 },
  supplyPercentage: { fontSize: 24, fontWeight: "700", color: "#6F4E37" },
  supplyPercentageLow: { color: "#ea580c" },
  refillButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    alignSelf: "flex-end",
    marginTop: 12,
    borderWidth: 1.5,
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  refillButtonText: { fontSize: 13, fontWeight: "600" },
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
  warningTitle: { fontSize: 16, fontWeight: "700", color: "#713f12" },
  warningText: { fontSize: 14, color: "#854d0e", lineHeight: 20 },
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
  forecastTitle: { fontSize: 16, fontWeight: "700", color: "#581c87" },
  forecastSubtitle: { fontSize: 14, color: "#6b21a8", marginBottom: 12 },
  forecastList: { gap: 8 },
  forecastItem: { flexDirection: "row", alignItems: "flex-start", gap: 8 },
  forecastBullet: {
    width: 6,
    height: 6,
    backgroundColor: "#7c3aed",
    borderRadius: 3,
    marginTop: 6,
  },
  forecastText: { flex: 1, fontSize: 14, color: "#6b21a8", lineHeight: 20 },
  forecastBold: { fontWeight: "700" },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalSheet: {
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  modalTitle: { fontSize: 18, fontWeight: "600", color: "#111827" },
  modalSub: { fontSize: 13, color: "#6b7280", marginTop: 2 },
  modalCloseBtn: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  refillSimNote: {
    backgroundColor: "#fef3c7",
    borderWidth: 1,
    borderColor: "#fde68a",
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
  },
  refillSimNoteText: { fontSize: 13, color: "#92400e" },
  refillNoteText: {
    fontSize: 13,
    color: "#6b7280",
    marginBottom: 20,
    lineHeight: 20,
  },
  refillLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 12,
  },
  refillOptions: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  refillOption: {
    width: "48%",
    height: 50,
    borderWidth: 1.5,
    borderColor: "#d1d5db",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  refillOptionPrimary: { backgroundColor: "#0d9488", borderColor: "#0d9488" },
  refillOptionText: { fontSize: 14, fontWeight: "600", color: "#374151" },
  refillOptionTextPrimary: { color: "#ffffff" },
});
