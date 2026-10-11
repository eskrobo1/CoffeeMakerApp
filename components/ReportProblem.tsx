// components/ReportProblem.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import {
  ArrowLeft,
  Coffee,
  Settings,
  User,
  HelpCircle,
  Send,
} from "lucide-react-native";
import * as Crypto from "expo-crypto";
import { useTheme } from "../constants/Theme";
import { useDatabase } from "../contexts/DatabaseContext";

type Category = "order_problem" | "machine_issue" | "account" | "other";

interface ReportProblemProps {
  userName?: string;
  userType: "guest" | "registered";
  displayName?: string;
  onBack: () => void;
}

const categories: {
  id: Category;
  label: string;
  icon: any;
  color: string;
  bgColor: string;
}[] = [
  {
    id: "order_problem",
    label: "Order Problem",
    icon: Coffee,
    color: "#ea580c",
    bgColor: "#ffedd5",
  },
  {
    id: "machine_issue",
    label: "Machine Issue",
    icon: Settings,
    color: "#dc2626",
    bgColor: "#fee2e2",
  },
  {
    id: "account",
    label: "Account Issue",
    icon: User,
    color: "#2563eb",
    bgColor: "#dbeafe",
  },
  {
    id: "other",
    label: "Other",
    icon: HelpCircle,
    color: "#6b7280",
    bgColor: "#f3f4f6",
  },
];

export function ReportProblem({
  userName,
  userType,
  displayName,
  onBack,
}: ReportProblemProps) {
  const { colors } = useTheme();
  const { db, isReady } = useDatabase();
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  );
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  // Minimum 1 karakter — bez gornjeg ograničenja
  const canSend = selectedCategory !== null && message.trim().length >= 1;

  const handleSend = async () => {
    if (!canSend || !db || !isReady) return;
    setSending(true);
    try {
      const id = Crypto.randomUUID();
      const senderName =
        userType === "guest" ? "Guest" : displayName || userName || "User";
      await db.runAsync(
        `INSERT INTO user_messages (id, sender_name, sender_type, sender_email, category, message, status, created_at)
         VALUES (?, ?, ?, ?, ?, ?, 'unread', datetime('now'))`,
        [
          id,
          senderName,
          userType,
          userType === "registered" ? userName || null : null,
          selectedCategory,
          message.trim(),
        ],
      );
      setSent(true);
    } catch (err) {
      console.error("❌ Error sending report:", err);
      Alert.alert("Error", "Could not send your message. Please try again.");
    } finally {
      setSending(false);
    }
  };

  if (sent) {
    return (
      <View style={[styles.container, { backgroundColor: "#f9fafb" }]}>
        <View style={[styles.header, { backgroundColor: colors.background }]}>
          <TouchableOpacity
            onPress={onBack}
            style={styles.backButton}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <ArrowLeft size={24} color={colors.foreground} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.foreground }]}>
            Report a Problem
          </Text>
        </View>
        <View style={styles.successContainer}>
          <View style={styles.successIconWrap}>
            <Text style={styles.successEmoji}>✅</Text>
          </View>
          <Text style={[styles.successTitle, { color: colors.foreground }]}>
            Message Sent!
          </Text>
          <Text
            style={[styles.successMessage, { color: colors.mutedForeground }]}
          >
            Your message has been sent to the administrator.
          </Text>
          <TouchableOpacity
            style={styles.doneButton}
            onPress={onBack}
            activeOpacity={0.8}
          >
            <Text style={styles.doneButtonText}>Done</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
      <View style={[styles.container, { backgroundColor: "#f9fafb" }]}>
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
              Report a Problem
            </Text>
            <Text style={[styles.headerSub, { color: colors.mutedForeground }]}>
              Send a message to the administrator
            </Text>
          </View>
        </View>

        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View
            style={[
              styles.infoCard,
              { backgroundColor: "#fef3c7", borderColor: "#fde68a" },
            ]}
          >
            <Text style={styles.infoText}>
              💬 Your message will be sent to the machine administrator.
            </Text>
          </View>

          <Text style={[styles.sectionLabel, { color: colors.foreground }]}>
            Category
          </Text>
          <View style={styles.categoryGrid}>
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isSelected = selectedCategory === cat.id;
              return (
                <TouchableOpacity
                  key={cat.id}
                  style={[
                    styles.categoryCard,
                    {
                      backgroundColor: isSelected ? cat.bgColor : colors.card,
                      borderColor: isSelected ? cat.color : colors.border,
                    },
                  ]}
                  onPress={() => setSelectedCategory(cat.id)}
                  activeOpacity={0.7}
                >
                  <View
                    style={[
                      styles.categoryIcon,
                      { backgroundColor: cat.bgColor },
                    ]}
                  >
                    <Icon size={18} color={cat.color} />
                  </View>
                  <Text
                    style={[
                      styles.categoryLabel,
                      { color: isSelected ? cat.color : colors.foreground },
                    ]}
                  >
                    {cat.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <Text style={[styles.sectionLabel, { color: colors.foreground }]}>
            Your Message
          </Text>
          <TextInput
            value={message}
            onChangeText={setMessage}
            placeholder="Describe the problem..."
            placeholderTextColor={colors.mutedForeground}
            multiline
            // Bez maxLength — korisnik piše koliko želi
            style={[
              styles.messageInput,
              {
                color: colors.foreground,
                borderColor: colors.border,
                backgroundColor: colors.card,
              },
            ]}
            textAlignVertical="top"
            scrollEnabled={false}
          />

          <TouchableOpacity
            style={[
              styles.sendButton,
              (!canSend || sending) && styles.sendButtonDisabled,
            ]}
            onPress={handleSend}
            disabled={!canSend || sending}
            activeOpacity={0.85}
          >
            <Send size={18} color="#ffffff" />
            <Text style={styles.sendButtonText}>
              {sending ? "Sending..." : "Send to Admin"}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
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
  scrollContent: { padding: 24, paddingBottom: 40 },
  infoCard: { borderRadius: 12, borderWidth: 1, padding: 14, marginBottom: 24 },
  infoText: { fontSize: 13, color: "#92400e", lineHeight: 20 },
  sectionLabel: { fontSize: 15, fontWeight: "600", marginBottom: 12 },
  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 24,
  },
  categoryCard: {
    width: "48%",
    borderWidth: 2,
    borderRadius: 14,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  categoryIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  categoryLabel: { fontSize: 13, fontWeight: "500", flex: 1 },
  messageInput: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
    fontSize: 15,
    minHeight: 140,
    marginBottom: 20,
  },
  sendButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#000000",
    height: 52,
    borderRadius: 26,
  },
  sendButtonDisabled: { backgroundColor: "#9ca3af" },
  sendButtonText: { color: "#ffffff", fontSize: 16, fontWeight: "600" },
  successContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
  },
  successIconWrap: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: "#dcfce7",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  successEmoji: { fontSize: 48 },
  successTitle: { fontSize: 22, fontWeight: "700", marginBottom: 12 },
  successMessage: {
    fontSize: 15,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 32,
  },
  doneButton: {
    width: "100%",
    height: 56,
    backgroundColor: "#000000",
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  doneButtonText: { color: "#ffffff", fontSize: 16, fontWeight: "600" },
});
