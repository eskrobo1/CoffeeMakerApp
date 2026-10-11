// components/CustomDrink.tsx
import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { ArrowLeft, Flame, Info } from "lucide-react-native";
import { useTheme } from "../constants/Theme";
import { Button } from "./ui/button";
import { AppSlider } from "./ui/AppSlider";
import {
  MILK_KCAL_PER_ML,
  FOAM_KCAL_PER_SECOND,
  SUGAR_KCAL_PER_GRAM,
} from "../data/drinkCalories";

type MilkType = "regular" | "plant-based";

interface CustomDrinkProps {
  userName?: string;
  userType?: "guest" | "registered" | "admin";
  onBack: () => void;
  onStartBrew: (config: any) => void;
}

export function CustomDrink({
  userName,
  onBack,
  onStartBrew,
}: CustomDrinkProps) {
  const { colors } = useTheme();

  const [shots, setShots] = useState(0);
  const [hotWater, setHotWater] = useState(0);
  const [milk, setMilk] = useState(0);
  const [milkType, setMilkType] = useState<MilkType>("regular");
  const [foamSeconds, setFoamSeconds] = useState(0);
  const [sugarG, setSugarG] = useState(0);

  const hasBase = shots >= 1 || hotWater >= 50;
  const hasMilk = milk > 0;

  const validationMessage = !hasBase
    ? "Add at least 1 espresso shot or 50ml of hot water to continue."
    : null;

  const drinkName = useMemo(() => {
    const parts: string[] = [];
    if (shots > 0) parts.push(`${shots} shot${shots > 1 ? "s" : ""}`);
    if (hotWater > 0) parts.push(`${hotWater}ml water`);
    if (milk > 0)
      parts.push(`${milkType === "plant-based" ? "plant" : "reg."} milk`);
    return parts.length > 0 ? `Custom (${parts.join(" + ")})` : "Custom Drink";
  }, [shots, hotWater, milk, milkType]);

  const totalMl = shots * 30 + hotWater + milk;
  const size: "small" | "medium" | "large" =
    totalMl <= 150 ? "small" : totalMl <= 280 ? "medium" : "large";
  const strength: "light" | "regular" | "strong" =
    shots === 0 ? "light" : shots === 1 ? "regular" : "strong";

  const calories = useMemo(() => {
    const espressoCal = shots * 5;
    const milkCal = Math.round(milk * MILK_KCAL_PER_ML[milkType]);
    const foamCal = Math.round(foamSeconds * FOAM_KCAL_PER_SECOND[milkType]);
    const sugarCal = sugarG * SUGAR_KCAL_PER_GRAM;
    return espressoCal + milkCal + foamCal + sugarCal;
  }, [shots, milk, milkType, foamSeconds, sugarG]);

  const handleMake = () => {
    if (!hasBase) {
      Alert.alert("Invalid Combination", validationMessage || "");
      return;
    }
    onStartBrew({
      drinkId: "custom",
      drinkName,
      size,
      strength,
      milkType,
      measurements: {
        water: hotWater,
        milk,
        milkFoam: foamSeconds,
        coffee: shots * 7,
        sugar: sugarG,
      },
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={onBack}
          style={styles.backButton}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <ArrowLeft size={24} color={colors.foreground} />
        </TouchableOpacity>
        <Text style={[styles.greeting, { color: colors.foreground }]}>
          Hello, {userName || "Guest"}
        </Text>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.titleSection}>
          <Text style={[styles.title, { color: colors.foreground }]}>
            Custom Drink
          </Text>
          <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
            Build your own combination from scratch
          </Text>
          <View
            style={[styles.calorieBadge, { backgroundColor: colors.muted }]}
          >
            <Flame size={14} color="#f97316" />
            <Text style={[styles.calorieValue, { color: colors.foreground }]}>
              ~{calories} kcal
            </Text>
            <Text
              style={[styles.calorieHint, { color: colors.mutedForeground }]}
            >
              estimated
            </Text>
          </View>
          {totalMl > 0 && (
            <View
              style={[styles.previewCard, { backgroundColor: colors.muted }]}
            >
              <Text style={[styles.previewName, { color: colors.foreground }]}>
                {drinkName}
              </Text>
              <Text
                style={[
                  styles.previewDetails,
                  { color: colors.mutedForeground },
                ]}
              >
                {totalMl}ml total · {size} size
                {shots > 0 ? ` · ${strength} strength` : ""}
              </Text>
            </View>
          )}
        </View>

        {/* Espresso Shots */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
              Espresso Shots
            </Text>
            <Text
              style={[styles.sectionHint, { color: colors.mutedForeground }]}
            >
              ~5 kcal each · 30ml
            </Text>
          </View>
          <View style={styles.shotSelector}>
            {[0, 1, 2, 3].map((n) => (
              <TouchableOpacity
                key={n}
                onPress={() => setShots(n)}
                style={[
                  styles.shotButton,
                  {
                    backgroundColor: shots === n ? "#000000" : colors.muted,
                    borderColor: shots === n ? "#000000" : colors.border,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.shotButtonText,
                    { color: shots === n ? "#ffffff" : colors.foreground },
                  ]}
                >
                  {n === 0 ? "None" : `${n} shot${n > 1 ? "s" : ""}`}
                </Text>
                {n > 0 && (
                  <Text
                    style={[
                      styles.shotCal,
                      {
                        color: shots === n ? "#ffffff" : colors.mutedForeground,
                      },
                    ]}
                  >
                    {n * 5} kcal
                  </Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Hot Water — AppSlider */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
              Hot Water
            </Text>
            <Text style={[styles.sectionValue, { color: colors.foreground }]}>
              {hotWater}ml
            </Text>
          </View>
          <AppSlider
            value={hotWater}
            onValueChange={(v: number) => setHotWater(Math.round(v / 10) * 10)}
            minimumValue={0}
            maximumValue={200}
            step={10}
            minimumTrackTintColor="#3b82f6"
            maximumTrackTintColor={colors.muted}
            thumbTintColor="#3b82f6"
            style={styles.slider}
          />
          <View style={styles.sliderLabels}>
            <Text
              style={[styles.sliderLabel, { color: colors.mutedForeground }]}
            >
              0ml
            </Text>
            <Text
              style={[styles.sliderLabel, { color: colors.mutedForeground }]}
            >
              200ml
            </Text>
          </View>
          {!hasBase && hotWater < 50 && shots === 0 && (
            <Text style={styles.ruleHint}>
              Minimum 50ml for hot water only drinks
            </Text>
          )}
        </View>

        {/* Milk — AppSlider */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
              Milk
            </Text>
            <Text style={[styles.sectionValue, { color: colors.foreground }]}>
              {milk}ml
            </Text>
          </View>
          <AppSlider
            value={milk}
            onValueChange={(v: number) => {
              const r = Math.round(v / 10) * 10;
              setMilk(r);
              if (r === 0) setFoamSeconds(0);
            }}
            minimumValue={0}
            maximumValue={200}
            step={10}
            minimumTrackTintColor="#f59e0b"
            maximumTrackTintColor={colors.muted}
            thumbTintColor="#f59e0b"
            style={styles.slider}
          />
          <View style={styles.sliderLabels}>
            <Text
              style={[styles.sliderLabel, { color: colors.mutedForeground }]}
            >
              None
            </Text>
            <Text
              style={[styles.sliderLabel, { color: colors.mutedForeground }]}
            >
              200ml
            </Text>
          </View>
        </View>

        {/* Milk Type */}
        {hasMilk && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
              Milk Type
            </Text>
            <View style={styles.milkTypeRow}>
              {(["regular", "plant-based"] as MilkType[]).map((t) => (
                <TouchableOpacity
                  key={t}
                  onPress={() => setMilkType(t)}
                  style={[
                    styles.milkTypeButton,
                    {
                      borderColor: milkType === t ? "#000000" : colors.border,
                      backgroundColor: milkType === t ? "#000000" : colors.card,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.milkTypeText,
                      { color: milkType === t ? "#ffffff" : colors.foreground },
                    ]}
                  >
                    {t === "regular" ? "Regular" : "Plant-based"}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Foam — AppSlider */}
        {hasMilk && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
                Milk Foam
              </Text>
              <Text style={[styles.sectionValue, { color: colors.foreground }]}>
                {foamSeconds === 0 ? "None" : `${foamSeconds}s`}
              </Text>
            </View>
            <AppSlider
              value={foamSeconds}
              onValueChange={(v: number) =>
                setFoamSeconds(Math.round(v / 5) * 5)
              }
              minimumValue={0}
              maximumValue={60}
              step={5}
              minimumTrackTintColor="#9333ea"
              maximumTrackTintColor={colors.muted}
              thumbTintColor="#9333ea"
              style={styles.slider}
            />
            <View style={styles.sliderLabels}>
              <Text
                style={[styles.sliderLabel, { color: colors.mutedForeground }]}
              >
                None
              </Text>
              <Text
                style={[styles.sliderLabel, { color: colors.mutedForeground }]}
              >
                60s
              </Text>
            </View>
          </View>
        )}

        {/* Sugar — AppSlider */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
              Sugar
            </Text>
            <Text style={[styles.sectionValue, { color: colors.foreground }]}>
              {sugarG === 0 ? "None" : `${sugarG}g (+${sugarG * 4} kcal)`}
            </Text>
          </View>
          <AppSlider
            value={sugarG}
            onValueChange={setSugarG}
            minimumValue={0}
            maximumValue={15}
            step={1}
            minimumTrackTintColor="#000000"
            maximumTrackTintColor={colors.muted}
            thumbTintColor="#000000"
            style={styles.slider}
          />
          <View style={styles.sliderLabels}>
            <Text
              style={[styles.sliderLabel, { color: colors.mutedForeground }]}
            >
              0g
            </Text>
            <Text
              style={[styles.sliderLabel, { color: colors.mutedForeground }]}
            >
              15g
            </Text>
          </View>
        </View>

        {!hasBase && (
          <View
            style={[
              styles.validationCard,
              { backgroundColor: "#fef2f2", borderColor: "#fecaca" },
            ]}
          >
            <Info size={16} color="#dc2626" />
            <Text style={styles.validationText}>{validationMessage}</Text>
          </View>
        )}

        <Button
          onPress={handleMake}
          style={[styles.makeButton, !hasBase && styles.makeButtonDisabled]}
        >
          Make
        </Button>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 8,
    gap: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  greeting: { fontSize: 20, fontWeight: "600" },
  content: { flex: 1 },
  scrollContent: { paddingHorizontal: 24, paddingBottom: 140 },
  titleSection: { alignItems: "center", marginBottom: 24 },
  title: { fontSize: 22, fontWeight: "700", marginBottom: 4 },
  subtitle: { fontSize: 14, textAlign: "center", marginBottom: 12 },
  calorieBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    marginBottom: 12,
  },
  calorieValue: { fontSize: 15, fontWeight: "600" },
  calorieHint: { fontSize: 12 },
  previewCard: {
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    alignItems: "center",
  },
  previewName: { fontSize: 14, fontWeight: "600" },
  previewDetails: { fontSize: 12, marginTop: 3 },
  section: { marginBottom: 24 },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  sectionTitle: { fontSize: 15, fontWeight: "600" },
  sectionValue: { fontSize: 14, fontWeight: "500" },
  sectionHint: { fontSize: 12 },
  shotSelector: { flexDirection: "row", gap: 8 },
  shotButton: {
    flex: 1,
    borderWidth: 1.5,
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    gap: 3,
  },
  shotButtonText: { fontSize: 13, fontWeight: "600" },
  shotCal: { fontSize: 11 },
  slider: { width: "100%", marginVertical: 4 },
  sliderLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 2,
  },
  sliderLabel: { fontSize: 12 },
  ruleHint: { fontSize: 12, color: "#f97316", marginTop: 4 },
  milkTypeRow: { flexDirection: "row", gap: 12 },
  milkTypeButton: {
    flex: 1,
    borderWidth: 2,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
  },
  milkTypeText: { fontSize: 14, fontWeight: "500" },
  validationCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
  },
  validationText: { flex: 1, fontSize: 13, color: "#dc2626", lineHeight: 20 },
  makeButton: {
    width: "100%",
    height: 56,
    backgroundColor: "#000000",
    borderRadius: 28,
    marginTop: 8,
  },
  makeButtonDisabled: { backgroundColor: "#9ca3af" },
});
