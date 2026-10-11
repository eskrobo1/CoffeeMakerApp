// components/ContactSupport.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  ArrowLeft,
  AlertTriangle,
  HelpCircle,
  Package,
  Send,
  CheckCircle,
  MessageSquare,
} from "lucide-react-native";
import { useTheme } from "../constants/Theme";

interface ContactSupportProps {
  onBack: () => void;
}

type Category = "technical" | "supply" | "maintenance" | "other";

interface SentMessage {
  id: string;
  category: Category;
  message: string;
  sentAt: string;
}

const STORAGE_KEY = "supportMessages";

const categories: {
  id: Category;
  label: string;
  icon: any;
  color: string;
  bgColor: string;
}[] = [
  {
    id: "technical",
    label: "Technical Issue",
    icon: AlertTriangle,
    color: "#dc2626",
    bgColor: "#fee2e2",
  },
  {
    id: "supply",
    label: "Supply Request",
    icon: Package,
    color: "#2563eb",
    bgColor: "#dbeafe",
  },
  {
    id: "maintenance",
    label: "Maintenance",
    icon: CheckCircle,
    color: "#9333ea",
    bgColor: "#f3e8ff",
  },
  {
    id: "other",
    label: "Other",
    icon: HelpCircle,
    color: "#0ea5e9",
    bgColor: "#e0f2fe",
  },
];

const formatSentDate = (iso: string) => {
  const d = new Date(iso);
  const now = new Date();
  const isToday = d.toDateString() === now.toDateString();
  const hh = d.getHours().toString().padStart(2, "0");
  const mm = d.getMinutes().toString().padStart(2, "0");
  if (isToday) return `Today at ${hh}:${mm}`;
  const dd = d.getDate().toString().padStart(2, "0");
  const mo = (d.getMonth() + 1).toString().padStart(2, "0");
  return `${dd}.${mo}. at ${hh}:${mm}`;
};

export function ContactSupport({ onBack }: ContactSupportProps) {
  const { colors } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  );
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const [pastMessages, setPastMessages] = useState<SentMessage[]>([]);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((val) => {
        if (val) setPastMessages(JSON.parse(val));
      })
      .catch(() => {});
  }, []);

  const canSend = selectedCategory !== null && message.trim().length >= 10;

  const handleSend = async () => {
    if (!canSend) {
      Alert.alert(
        "Incomplete",
        "Please select a category and write a message (at least 10 characters).",
      );
      return;
    }
    const newMsg: SentMessage = {
      id: Date.now().toString(),
      category: selectedCategory!,
      message: message.trim(),
      sentAt: new Date().toISOString(),
    };
    const updated = [newMsg, ...pastMessages];
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated)).catch(
      () => {},
    );
    setPastMessages(updated);
    setSent(true);
  };

  if (sent) {
    return (
      <View style={[styles.container, { backgroundColor: "#f9fafb" }]}>
        <View style={[styles.header, { backgroundColor: colors.background }]}>
          <TouchableOpacity
            onPress={() => {
              setSent(false);
              setSelectedCategory(null);
              setMessage("");
            }}
            style={styles.backButton}
          >
            <ArrowLeft size={24} color={colors.foreground} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.foreground }]}>
            Contact Support
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
            Your message has been sent to the support team. You can expect a
            response within 24 hours.
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
    // behavior="padding" radi na oba platforme — gura sadržaj gore iznad tastature
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior="padding"
      keyboardVerticalOffset={Platform.OS === "android" ? 0 : 0}
    >
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
              Contact Support
            </Text>
            <Text style={[styles.headerSub, { color: colors.mutedForeground }]}>
              Message goes to your equipment supplier
            </Text>
          </View>
        </View>

        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          // Automatski skrolaj da je aktivni input vidljiv
          automaticallyAdjustKeyboardInsets
        >
          {/* Info */}
          <View
            style={[
              styles.infoCard,
              { backgroundColor: "#e0f2fe", borderColor: "#7dd3fc" },
            ]}
          >
            <Text style={styles.infoText}>
              Your message will be sent directly to the authorised service team.
              No personal data is required — your admin account is already
              associated with this machine.
            </Text>
          </View>

          {/* Category */}
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

          {/* Message */}
          <Text style={[styles.sectionLabel, { color: colors.foreground }]}>
            Message
          </Text>
          <TextInput
            value={message}
            onChangeText={setMessage}
            placeholder="Describe your issue or request in detail..."
            placeholderTextColor={colors.mutedForeground}
            multiline
            // Manji broj linija — 4 umjesto 6, lakše vidljivo s tastaturom
            numberOfLines={4}
            style={[
              styles.messageInput,
              {
                color: colors.foreground,
                borderColor: colors.border,
                backgroundColor: colors.card,
              },
            ]}
            textAlignVertical="top"
            maxLength={500}
            scrollEnabled={false} // Sprječava konflikt između input scrolla i ScrollView scrolla
          />
          <Text style={[styles.charCount, { color: colors.mutedForeground }]}>
            {message.length}/500
          </Text>

          {/* Send — odmah ispod poruke, uvijek vidljivo */}
          <TouchableOpacity
            style={[styles.sendButton, !canSend && styles.sendButtonDisabled]}
            onPress={handleSend}
            activeOpacity={0.85}
          >
            <Send size={18} color="#ffffff" />
            <Text style={styles.sendButtonText}>Send Message</Text>
          </TouchableOpacity>

          {/* Recent messages */}
          {pastMessages.length > 0 && (
            <View style={styles.historySection}>
              <View style={styles.historyHeader}>
                <MessageSquare size={16} color={colors.mutedForeground} />
                <Text
                  style={[styles.historyTitle, { color: colors.foreground }]}
                >
                  Recent Messages
                </Text>
              </View>
              {pastMessages.map((msg) => {
                const cat = categories.find((c) => c.id === msg.category);
                return (
                  <View
                    key={msg.id}
                    style={[
                      styles.historyCard,
                      {
                        backgroundColor: colors.card,
                        borderColor: colors.border,
                      },
                    ]}
                  >
                    <View style={styles.historyCardHeader}>
                      {cat && (
                        <View
                          style={[
                            styles.historyBadge,
                            { backgroundColor: cat.bgColor },
                          ]}
                        >
                          <Text
                            style={[
                              styles.historyBadgeText,
                              { color: cat.color },
                            ]}
                          >
                            {cat.label}
                          </Text>
                        </View>
                      )}
                      <Text
                        style={[
                          styles.historyDate,
                          { color: colors.mutedForeground },
                        ]}
                      >
                        {formatSentDate(msg.sentAt)}
                      </Text>
                    </View>
                    <Text
                      style={[
                        styles.historyMessage,
                        { color: colors.foreground },
                      ]}
                      numberOfLines={3}
                    >
                      {msg.message}
                    </Text>
                  </View>
                );
              })}
            </View>
          )}
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
  infoCard: { borderRadius: 12, borderWidth: 1, padding: 14, marginBottom: 20 },
  infoText: { fontSize: 13, color: "#0369a1", lineHeight: 20 },
  sectionLabel: { fontSize: 15, fontWeight: "600", marginBottom: 12 },
  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 20,
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
    // Fiksna visina — 4 linije vidljive, ne gura send button van ekrana
    height: 120,
    marginBottom: 6,
  },
  charCount: { fontSize: 12, textAlign: "right", marginBottom: 16 },
  sendButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#0ea5e9",
    height: 52,
    borderRadius: 26,
    marginBottom: 8,
  },
  sendButtonDisabled: { backgroundColor: "#9ca3af" },
  sendButtonText: { color: "#ffffff", fontSize: 16, fontWeight: "600" },
  historySection: { marginTop: 28 },
  historyHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 14,
  },
  historyTitle: { fontSize: 16, fontWeight: "600" },
  historyCard: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
  },
  historyCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  historyBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  historyBadgeText: { fontSize: 12, fontWeight: "600" },
  historyDate: { fontSize: 12 },
  historyMessage: { fontSize: 14, lineHeight: 20 },
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
