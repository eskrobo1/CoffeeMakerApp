// components/Instructions.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import {
  ArrowLeft,
  Coffee,
  Heart,
  Clock,
  Settings,
  AlertTriangle,
  CheckCircle,
  ChevronDown,
  ChevronRight,
} from "lucide-react-native";
import { useTheme } from "../constants/Theme";

interface InstructionsProps {
  onBack: () => void;
}

interface Section {
  id: string;
  title: string;
  icon: any;
  color: string;
  bgColor: string;
  steps: string[];
}

const sections: Section[] = [
  {
    id: "start",
    title: "Getting Started",
    icon: CheckCircle,
    color: "#16a34a",
    bgColor: "#dcfce7",
    steps: [
      "Ensure the machine is powered on and connected to WiFi.",
      "Wait for the 'Ready' status to appear on the Admin Dashboard.",
      "Make sure there is water, coffee beans and milk available.",
      "Place an empty cup under the dispensing spout before ordering.",
    ],
  },
  {
    id: "order",
    title: "Ordering a Drink",
    icon: Coffee,
    color: "#f97316",
    bgColor: "#ffedd5",
    steps: [
      "Log in with your account or continue as a Guest.",
      "Browse the drink menu and tap on your preferred drink.",
      "Customise size, strength, milk type, sugar and foam level.",
      "Tap 'Make' to place your order — it will join the queue.",
      "When prompted, place your cup and tap 'Cup is placed — Start brewing'.",
    ],
  },
  {
    id: "queue",
    title: "Queue System",
    icon: Clock,
    color: "#2563eb",
    bgColor: "#dbeafe",
    steps: [
      "Drinks are prepared one at a time in the order they are received.",
      "Your position in the queue is shown on the brewing screen.",
      "You can order up to 3 drinks at once and track each separately.",
      "Pending orders can be cancelled before brewing starts.",
      "The badge at the top of the home screen shows your active orders.",
    ],
  },
  {
    id: "favourites",
    title: "Favourites",
    icon: Heart,
    color: "#e11d48",
    bgColor: "#ffe4e6",
    steps: [
      "Tap the heart icon on any drink customisation screen to save it.",
      "Give your favourite a custom name (e.g. 'Morning Espresso').",
      "The same drink can be saved multiple times with different settings.",
      "If you change any setting, the heart will become unfilled — tap to save as a new favourite.",
      "Use the play button on a favourite card for instant quick brew.",
    ],
  },
  {
    id: "maintenance",
    title: "Maintenance",
    icon: Settings,
    color: "#9333ea",
    bgColor: "#f3e8ff",
    steps: [
      "Use 'Rinse' from the Admin Dashboard before first use of the day.",
      "Run 'Clean' cycle as indicated — recommended every 50 days.",
      "Monitor supply levels in Supply Management and restock when low.",
      "Coffee beans should be above 30% for optimal performance.",
      "Contact support if any error persists after a rinse cycle.",
    ],
  },
  {
    id: "tips",
    title: "Tips & Best Practices",
    icon: AlertTriangle,
    color: "#d97706",
    bgColor: "#fef3c7",
    steps: [
      "Always place a cup before starting a brew cycle.",
      "For best results, use freshly roasted coffee beans.",
      "Plant-based milk may require different foam settings.",
      "Allow the machine 30 seconds to warm up after being idle.",
      "Contact support if the machine shows unexpected error messages.",
    ],
  },
];

export function Instructions({ onBack }: InstructionsProps) {
  const { colors } = useTheme();
  const [expandedId, setExpandedId] = useState<string | null>("start");

  const toggleSection = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <View style={[styles.container, { backgroundColor: "#f9fafb" }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.background }]}>
        <TouchableOpacity
          onPress={onBack}
          style={styles.backButton}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <ArrowLeft size={24} color={colors.foreground} />
        </TouchableOpacity>
        <View>
          <Text style={[styles.headerTitle, { color: colors.foreground }]}>
            Machine Instructions
          </Text>
          <Text style={[styles.headerSub, { color: colors.mutedForeground }]}>
            How to use your coffee machine
          </Text>
        </View>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Intro card */}
        <View
          style={[
            styles.introCard,
            { backgroundColor: "#fff7ed", borderColor: "#fed7aa" },
          ]}
        >
          <Text style={styles.introText}>
            ☕ Welcome to your smart coffee machine. Follow the steps below to
            get the best experience.
          </Text>
        </View>

        {/* Accordion sections */}
        {sections.map((section) => {
          const Icon = section.icon;
          const isExpanded = expandedId === section.id;
          return (
            <View
              key={section.id}
              style={[
                styles.sectionCard,
                { backgroundColor: colors.card, borderColor: colors.border },
              ]}
            >
              <TouchableOpacity
                style={styles.sectionHeader}
                onPress={() => toggleSection(section.id)}
                activeOpacity={0.7}
              >
                <View
                  style={[
                    styles.sectionIconWrap,
                    { backgroundColor: section.bgColor },
                  ]}
                >
                  <Icon size={20} color={section.color} />
                </View>
                <Text
                  style={[styles.sectionTitle, { color: colors.foreground }]}
                >
                  {section.title}
                </Text>
                {isExpanded ? (
                  <ChevronDown size={18} color={colors.mutedForeground} />
                ) : (
                  <ChevronRight size={18} color={colors.mutedForeground} />
                )}
              </TouchableOpacity>

              {isExpanded && (
                <View
                  style={[
                    styles.sectionBody,
                    { borderTopColor: colors.border },
                  ]}
                >
                  {section.steps.map((step, idx) => (
                    <View key={idx} style={styles.step}>
                      <View
                        style={[
                          styles.stepNumber,
                          { backgroundColor: section.bgColor },
                        ]}
                      >
                        <Text
                          style={[
                            styles.stepNumberText,
                            { color: section.color },
                          ]}
                        >
                          {idx + 1}
                        </Text>
                      </View>
                      <Text
                        style={[styles.stepText, { color: colors.foreground }]}
                      >
                        {step}
                      </Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          );
        })}

        {/* Footer note */}
        <View style={[styles.footerNote, { backgroundColor: colors.muted }]}>
          <Text
            style={[styles.footerNoteText, { color: colors.mutedForeground }]}
          >
            For technical support or spare parts, use Contact Support in the
            Admin Dashboard.
          </Text>
        </View>
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
  headerTitle: { fontSize: 20, fontWeight: "600" },
  headerSub: { fontSize: 13, marginTop: 2 },
  content: { flex: 1 },
  scrollContent: { padding: 24, paddingBottom: 60 },
  introCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    marginBottom: 16,
  },
  introText: { fontSize: 14, color: "#92400e", lineHeight: 22 },
  sectionCard: {
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 12,
    overflow: "hidden",
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    gap: 12,
  },
  sectionIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  sectionTitle: { flex: 1, fontSize: 15, fontWeight: "600" },
  sectionBody: { borderTopWidth: 1, padding: 16, gap: 12 },
  step: { flexDirection: "row", gap: 12, alignItems: "flex-start" },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 1,
    flexShrink: 0,
  },
  stepNumberText: { fontSize: 12, fontWeight: "700" },
  stepText: { flex: 1, fontSize: 14, lineHeight: 21 },
  footerNote: { borderRadius: 12, padding: 16, marginTop: 8 },
  footerNoteText: { fontSize: 13, lineHeight: 20, textAlign: "center" },
});
