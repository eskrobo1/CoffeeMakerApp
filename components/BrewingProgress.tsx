// components/BrewingProgress.tsx
import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  BackHandler,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useTheme } from "../constants/Theme";
import Svg, { Circle } from "react-native-svg";
import { Order } from "../hooks/useOrders";
import { drinkMeasurements } from "../data/drinkMeasurements";

interface BrewingProgressProps {
  userOrders: Order[];
  selectedOrderId: string;
  onSelectOrder: (id: string) => void;
  userName?: string;
  currentlyBrewingId: string | null;
  waitingForCupId: string | null;
  brewProgress: number;
  brewTimeLeft: number;
  onPlaceCup: () => void;
  onCancelOrder: (orderId: string) => void;
  getQueuePosition: (orderId: string) => number;
  totalInQueue: number;
}

// "custom" je namjerno ISKLJUČEN — prikazuje se genericka ☕ ikonica
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

const getMeasurements = (drinkId: string, size: string) => {
  const drink = drinkMeasurements.find((d) => d.id === drinkId);
  if (!drink) return { water: 0, milk: 0, milkFoam: 0, coffee: 0, sugar: 0 };
  const sizeKey = (size as "small" | "medium" | "large") || "medium";
  const s = drink[sizeKey] || drink.medium;
  return {
    water: s.water || 0,
    milk: s.milk || 0,
    milkFoam: s.milkFoam || 0,
    coffee: s.coffee || 0,
    sugar: 0,
  };
};

// Genericka ikonica za custom napitak ili nepoznate drinkId-ove
const GenericCoffeeCup = () => (
  <View style={styles.genericCupWrap}>
    <Text style={styles.genericCupEmoji}>☕</Text>
  </View>
);

type OrderPhase = "waiting" | "place-cup" | "brewing";

export function BrewingProgress({
  userOrders,
  selectedOrderId,
  onSelectOrder,
  userName,
  currentlyBrewingId,
  waitingForCupId,
  brewProgress,
  brewTimeLeft,
  onPlaceCup,
  onCancelOrder,
  getQueuePosition,
  totalInQueue,
}: BrewingProgressProps) {
  const { colors } = useTheme();

  // Blokiraj hardware back
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => true,
    );
    return () => backHandler.remove();
  }, []);

  const selectedOrder =
    userOrders.find((o) => o.id === selectedOrderId) || userOrders[0];
  if (!selectedOrder) return null;

  const getPhase = (order: Order): OrderPhase => {
    if (currentlyBrewingId === order.id) return "brewing";
    if (waitingForCupId === order.id) return "place-cup";
    return "waiting";
  };

  const phase = getPhase(selectedOrder);
  const queuePos = getQueuePosition(selectedOrder.id);
  const measurements = getMeasurements(
    selectedOrder.drink_id,
    selectedOrder.size,
  );

  const sizeFmt =
    selectedOrder.size.charAt(0).toUpperCase() + selectedOrder.size.slice(1);
  const strengthFmt =
    selectedOrder.strength.charAt(0).toUpperCase() +
    selectedOrder.strength.slice(1);
  const milkFmt =
    (selectedOrder.milk_type || "regular") === "regular"
      ? "Regular milk"
      : "Plant-based milk";

  const getTabIndicator = (order: Order) =>
    currentlyBrewingId === order.id
      ? "●"
      : waitingForCupId === order.id
        ? "!"
        : "·";
  const getTabIndicatorColor = (order: Order) =>
    currentlyBrewingId === order.id
      ? "#10b981"
      : waitingForCupId === order.id
        ? "#f59e0b"
        : colors.mutedForeground;

  // Prikaz slike napitka — za custom i nepoznate prikazuje ☕
  const DrinkImg = ({ drinkId }: { drinkId: string }) =>
    drinkImages[drinkId] ? (
      <Image
        source={drinkImages[drinkId]}
        style={styles.drinkImageStyle}
        resizeMode="contain"
      />
    ) : (
      <GenericCoffeeCup />
    );

  const canCancel =
    selectedOrder.status === "pending" &&
    currentlyBrewingId !== selectedOrder.id;

  const radius = 56;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - brewProgress / 100);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.greeting, { color: colors.foreground }]}>
          Hello, {userName || "Guest"}
        </Text>
      </View>

      {/* Tabs */}
      {userOrders.length > 1 && (
        <View style={[styles.tabBar, { borderBottomColor: colors.border }]}>
          {userOrders.map((order) => {
            const isSelected = order.id === selectedOrderId;
            const shortName =
              order.drink_name.length > 12
                ? order.drink_name.slice(0, 11) + "…"
                : order.drink_name;
            return (
              <TouchableOpacity
                key={order.id}
                style={[
                  styles.tab,
                  isSelected
                    ? styles.tabSelected
                    : { backgroundColor: colors.muted },
                ]}
                onPress={() => onSelectOrder(order.id)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.tabText,
                    { color: isSelected ? "#ffffff" : colors.mutedForeground },
                  ]}
                  numberOfLines={1}
                >
                  {shortName}
                </Text>
                <Text
                  style={[
                    styles.tabDot,
                    { color: getTabIndicatorColor(order) },
                  ]}
                >
                  {getTabIndicator(order)}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      )}

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Drink image + name */}
        <View style={styles.drinkImageWrap}>
          <DrinkImg drinkId={selectedOrder.drink_id} />
        </View>
        <Text style={[styles.drinkName, { color: colors.foreground }]}>
          {selectedOrder.drink_name}
        </Text>
        <Text style={[styles.recipeHint, { color: colors.mutedForeground }]}>
          {sizeFmt} · {strengthFmt} · {milkFmt}
        </Text>

        {/* ── WAITING ─────────────────────────────────────────────────────── */}
        {phase === "waiting" && (
          <>
            <View style={[styles.waitCard, { backgroundColor: colors.muted }]}>
              <Text
                style={[styles.waitLabel, { color: colors.mutedForeground }]}
              >
                Your position in queue
              </Text>
              <Text style={[styles.waitPosition, { color: colors.foreground }]}>
                {queuePos} of {totalInQueue}
              </Text>
              <Text style={[styles.waitSub, { color: colors.mutedForeground }]}>
                {queuePos - 1} drink{queuePos - 1 !== 1 ? "s" : ""} ahead of you
              </Text>
              {currentlyBrewingId && (
                <View
                  style={[
                    styles.currentBrewBadge,
                    { backgroundColor: colors.background },
                  ]}
                >
                  <View style={styles.brewDot} />
                  <Text
                    style={[
                      styles.currentBrewText,
                      { color: colors.mutedForeground },
                    ]}
                  >
                    Current drink ready in {brewTimeLeft}s
                  </Text>
                </View>
              )}
            </View>
            <Text style={[styles.waitNote, { color: colors.mutedForeground }]}>
              We'll notify you when it's your turn
            </Text>
          </>
        )}

        {/* ── PLACE CUP ───────────────────────────────────────────────────── */}
        {phase === "place-cup" && (
          <>
            <View style={styles.yourTurnBadge}>
              <Text style={styles.yourTurnText}>It's your turn!</Text>
              <Text style={styles.yourTurnPos}>
                {queuePos} of {totalInQueue}
              </Text>
            </View>
            <View
              style={[
                styles.placeCupCard,
                { borderColor: colors.border, backgroundColor: colors.card },
              ]}
            >
              <View style={styles.cupIconWrap}>
                <View style={styles.cupBody} />
                <View style={styles.cupHandle} />
                <View style={styles.cupSaucer} />
              </View>
              <Text
                style={[styles.placeCupTitle, { color: colors.foreground }]}
              >
                Place your cup
              </Text>
              <Text
                style={[styles.placeCupSub, { color: colors.mutedForeground }]}
              >
                Put an empty cup under the spout before brewing starts.
              </Text>
            </View>
            <TouchableOpacity
              style={styles.placeCupBtn}
              onPress={onPlaceCup}
              activeOpacity={0.85}
            >
              <Text style={styles.placeCupBtnText}>
                Cup is placed — Start brewing
              </Text>
            </TouchableOpacity>
          </>
        )}

        {/* ── BREWING ─────────────────────────────────────────────────────── */}
        {phase === "brewing" && (
          <>
            <View
              style={[styles.recipeCard, { backgroundColor: colors.muted }]}
            >
              <View style={styles.measurementsGrid}>
                {measurements.coffee > 0 && (
                  <View style={styles.measurement}>
                    <Text
                      style={[
                        styles.measurementLabel,
                        { color: colors.mutedForeground },
                      ]}
                    >
                      Coffee
                    </Text>
                    <Text
                      style={[
                        styles.measurementValue,
                        { color: colors.foreground },
                      ]}
                    >
                      {measurements.coffee.toFixed(1)}g
                    </Text>
                  </View>
                )}
                {measurements.water > 0 && (
                  <View style={styles.measurement}>
                    <Text
                      style={[
                        styles.measurementLabel,
                        { color: colors.mutedForeground },
                      ]}
                    >
                      Water
                    </Text>
                    <Text
                      style={[
                        styles.measurementValue,
                        { color: colors.foreground },
                      ]}
                    >
                      {measurements.water}ml
                    </Text>
                  </View>
                )}
                {measurements.milk > 0 && (
                  <View style={styles.measurement}>
                    <Text
                      style={[
                        styles.measurementLabel,
                        { color: colors.mutedForeground },
                      ]}
                    >
                      Milk
                    </Text>
                    <Text
                      style={[
                        styles.measurementValue,
                        { color: colors.foreground },
                      ]}
                    >
                      {measurements.milk}ml
                    </Text>
                  </View>
                )}
                {measurements.milkFoam > 0 && (
                  <View style={styles.measurement}>
                    <Text
                      style={[
                        styles.measurementLabel,
                        { color: colors.mutedForeground },
                      ]}
                    >
                      Foam
                    </Text>
                    <Text
                      style={[
                        styles.measurementValue,
                        { color: colors.foreground },
                      ]}
                    >
                      {measurements.milkFoam}s
                    </Text>
                  </View>
                )}
              </View>
              <View
                style={[styles.recipeFooter, { borderTopColor: colors.border }]}
              >
                <Text
                  style={[
                    styles.recipeFooterText,
                    { color: colors.mutedForeground },
                  ]}
                >
                  {sizeFmt} · {strengthFmt} · {milkFmt}
                </Text>
              </View>
            </View>

            <View style={styles.queueSection}>
              <Text
                style={[styles.queueLabel, { color: colors.mutedForeground }]}
              >
                Queue Position
              </Text>
              <Text style={[styles.queueValue, { color: colors.foreground }]}>
                {queuePos} of {totalInQueue}
              </Text>
            </View>

            <View style={styles.progressContainer}>
              <Svg
                width={128}
                height={128}
                style={StyleSheet.absoluteFillObject}
              >
                <Circle
                  cx={64}
                  cy={64}
                  r={radius}
                  stroke={colors.muted}
                  strokeWidth={8}
                  fill="none"
                />
                <Circle
                  cx={64}
                  cy={64}
                  r={radius}
                  stroke="#000000"
                  strokeWidth={8}
                  fill="none"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  rotation="-90"
                  origin="64, 64"
                />
              </Svg>
              <View style={styles.progressTextWrap}>
                <Text style={[styles.timeText, { color: colors.foreground }]}>
                  {brewTimeLeft}s
                </Text>
              </View>
            </View>
            <Text style={[styles.statusText, { color: colors.foreground }]}>
              Brewing..
            </Text>
          </>
        )}

        {/* Cancel */}
        {canCancel && (
          <TouchableOpacity
            style={[styles.cancelBtn, { borderColor: colors.border }]}
            onPress={() => onCancelOrder(selectedOrder.id)}
            activeOpacity={0.7}
          >
            <Text style={[styles.cancelBtnText, { color: "#dc2626" }]}>
              Cancel this order
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 24, paddingTop: 16, paddingBottom: 12 },
  greeting: { fontSize: 20, fontWeight: "600" },
  tabBar: {
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  tab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  tabSelected: { backgroundColor: "#000000" },
  tabText: { fontSize: 13, fontWeight: "500", flexShrink: 1 },
  tabDot: { fontSize: 16, fontWeight: "700" },
  scrollView: { flex: 1 },
  scrollContent: {
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 120,
  },
  drinkImageWrap: { marginBottom: 16 },
  drinkImageStyle: { width: 100, height: 100 },
  // ── Genericka ikonica za custom napitak ──────────────────────────────────
  genericCupWrap: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#f3f4f6",
    alignItems: "center",
    justifyContent: "center",
  },
  genericCupEmoji: { fontSize: 48 },
  // ─────────────────────────────────────────────────────────────────────────
  drinkName: { fontSize: 18, fontWeight: "600", marginBottom: 4 },
  recipeHint: { fontSize: 13, marginBottom: 24 },
  waitCard: {
    width: "100%",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    marginBottom: 16,
  },
  waitLabel: { fontSize: 13, marginBottom: 8 },
  waitPosition: { fontSize: 42, fontWeight: "700", lineHeight: 48 },
  waitSub: { fontSize: 14, marginTop: 4 },
  currentBrewBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  brewDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: "#10b981" },
  currentBrewText: { fontSize: 13 },
  waitNote: { fontSize: 13, textAlign: "center" },
  yourTurnBadge: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginBottom: 16,
    backgroundColor: "#10b981",
  },
  yourTurnText: { color: "#ffffff", fontSize: 14, fontWeight: "600" },
  yourTurnPos: { color: "#ffffff", fontSize: 13 },
  placeCupCard: {
    width: "100%",
    borderRadius: 16,
    borderWidth: 1,
    padding: 24,
    alignItems: "center",
    marginBottom: 24,
  },
  cupIconWrap: {
    width: 56,
    height: 58,
    alignItems: "center",
    marginBottom: 16,
  },
  cupBody: {
    width: 36,
    height: 32,
    backgroundColor: "#9ca3af",
    borderRadius: 4,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  cupHandle: {
    position: "absolute",
    right: 2,
    top: 6,
    width: 12,
    height: 16,
    borderWidth: 3,
    borderColor: "#9ca3af",
    borderRadius: 8,
  },
  cupSaucer: {
    width: 44,
    height: 7,
    backgroundColor: "#d1d5db",
    borderRadius: 4,
    marginTop: 3,
  },
  placeCupTitle: { fontSize: 18, fontWeight: "600", marginBottom: 8 },
  placeCupSub: { fontSize: 14, textAlign: "center", lineHeight: 20 },
  placeCupBtn: {
    width: "100%",
    height: 56,
    backgroundColor: "#000000",
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  placeCupBtnText: { color: "#ffffff", fontSize: 16, fontWeight: "600" },
  recipeCard: {
    width: "100%",
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  measurementsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 16 },
  measurement: { width: "45%" },
  measurementLabel: { fontSize: 12, marginBottom: 4 },
  measurementValue: { fontSize: 16, fontWeight: "500" },
  recipeFooter: { marginTop: 12, paddingTop: 12, borderTopWidth: 1 },
  recipeFooterText: { fontSize: 12 },
  queueSection: { alignItems: "center", marginBottom: 24 },
  queueLabel: { fontSize: 13, marginBottom: 4 },
  queueValue: { fontSize: 20, fontWeight: "600" },
  progressContainer: { width: 128, height: 128, marginBottom: 16 },
  progressTextWrap: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
  },
  timeText: { fontSize: 24, fontWeight: "600" },
  statusText: { fontSize: 16, marginBottom: 24 },
  cancelBtn: {
    width: "100%",
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
  },
  cancelBtnText: { fontSize: 15, fontWeight: "500" },
});
