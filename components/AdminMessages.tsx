// components/AdminMessages.tsx
import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import {
  ArrowLeft,
  Coffee,
  Settings,
  User,
  HelpCircle,
  MessageSquare,
  CheckCheck,
} from "lucide-react-native";
import { useTheme } from "../constants/Theme";
import { useDatabase } from "../contexts/DatabaseContext";

interface UserMessage {
  id: string;
  sender_name: string;
  sender_type: "guest" | "registered";
  sender_email: string | null;
  category: "order_problem" | "machine_issue" | "account" | "other";
  message: string;
  status: "unread" | "read";
  created_at: string;
}

interface AdminMessagesProps {
  onBack: () => void;
}

const categoryInfo: Record<
  string,
  { label: string; icon: any; color: string; bgColor: string }
> = {
  order_problem: {
    label: "Order Problem",
    icon: Coffee,
    color: "#ea580c",
    bgColor: "#ffedd5",
  },
  machine_issue: {
    label: "Machine Issue",
    icon: Settings,
    color: "#dc2626",
    bgColor: "#fee2e2",
  },
  account: {
    label: "Account Issue",
    icon: User,
    color: "#2563eb",
    bgColor: "#dbeafe",
  },
  other: {
    label: "Other",
    icon: HelpCircle,
    color: "#6b7280",
    bgColor: "#f3f4f6",
  },
};

const formatDate = (iso: string) => {
  const d = new Date(iso.includes("T") ? iso : iso.replace(" ", "T") + "Z");
  if (isNaN(d.getTime())) return iso;
  const now = new Date();
  const isToday = d.toDateString() === now.toDateString();
  const hh = d.getHours().toString().padStart(2, "0");
  const mm = d.getMinutes().toString().padStart(2, "0");
  if (isToday) return `Today at ${hh}:${mm}`;
  return `${d.getDate().toString().padStart(2, "0")}.${(d.getMonth() + 1).toString().padStart(2, "0")}. at ${hh}:${mm}`;
};

export function AdminMessages({ onBack }: AdminMessagesProps) {
  const { colors } = useTheme();
  const { db, isReady } = useDatabase();
  const [messages, setMessages] = useState<UserMessage[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMessages = useCallback(async () => {
    if (!db || !isReady) return;
    try {
      setLoading(true);
      const result = await db.getAllAsync<UserMessage>(
        `SELECT * FROM user_messages ORDER BY
         CASE status WHEN 'unread' THEN 0 ELSE 1 END,
         created_at DESC`,
      );
      setMessages(result);
    } catch (err) {
      console.error("❌ Error fetching messages:", err);
    } finally {
      setLoading(false);
    }
  }, [db, isReady]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const markAsRead = async (messageId: string) => {
    if (!db || !isReady) return;
    try {
      await db.runAsync(
        `UPDATE user_messages SET status = 'read' WHERE id = ?`,
        [messageId],
      );
      setMessages((prev) =>
        prev.map((m) =>
          m.id === messageId ? { ...m, status: "read" as const } : m,
        ),
      );
    } catch (err) {
      console.error("❌ Error marking as read:", err);
    }
  };

  const markAllAsRead = async () => {
    if (!db || !isReady) return;
    try {
      await db.runAsync(`UPDATE user_messages SET status = 'read'`);
      setMessages((prev) =>
        prev.map((m) => ({ ...m, status: "read" as const })),
      );
    } catch (err) {
      console.error("❌ Error marking all as read:", err);
    }
  };

  const unreadCount = messages.filter((m) => m.status === "unread").length;

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
        <View style={styles.headerTextRow}>
          <Text style={[styles.headerTitle, { color: colors.foreground }]}>
            User Messages
          </Text>
          {unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadBadgeText}>{unreadCount}</Text>
            </View>
          )}
        </View>
        {unreadCount > 0 && (
          <TouchableOpacity
            onPress={markAllAsRead}
            style={styles.markAllButton}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <CheckCheck size={18} color="#2563eb" />
          </TouchableOpacity>
        )}
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#000000" />
        </View>
      ) : messages.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconWrap}>
            <MessageSquare size={40} color="#d1d5db" />
          </View>
          <Text style={[styles.emptyTitle, { color: colors.foreground }]}>
            No messages yet
          </Text>
          <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
            User problem reports will appear here.
          </Text>
        </View>
      ) : (
        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {messages.map((msg) => {
            const cat = categoryInfo[msg.category] || categoryInfo.other;
            const CatIcon = cat.icon;
            const isUnread = msg.status === "unread";

            return (
              <TouchableOpacity
                key={msg.id}
                style={[
                  styles.messageCard,
                  {
                    backgroundColor: isUnread ? "#fffbeb" : colors.card,
                    borderColor: isUnread ? "#fde68a" : colors.border,
                    borderWidth: isUnread ? 1.5 : 1,
                  },
                ]}
                onPress={() => isUnread && markAsRead(msg.id)}
                activeOpacity={0.8}
              >
                {/* Top row */}
                <View style={styles.messageTop}>
                  <View
                    style={[styles.catBadge, { backgroundColor: cat.bgColor }]}
                  >
                    <CatIcon size={14} color={cat.color} />
                    <Text style={[styles.catBadgeText, { color: cat.color }]}>
                      {cat.label}
                    </Text>
                  </View>
                  <View style={styles.messageTopRight}>
                    {isUnread && <View style={styles.unreadDot} />}
                    <Text
                      style={[
                        styles.messageDate,
                        { color: colors.mutedForeground },
                      ]}
                    >
                      {formatDate(msg.created_at)}
                    </Text>
                  </View>
                </View>

                {/* Sender */}
                <View style={styles.senderRow}>
                  <View
                    style={[
                      styles.senderBadge,
                      {
                        backgroundColor:
                          msg.sender_type === "registered"
                            ? "#dbeafe"
                            : "#f3f4f6",
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.senderBadgeText,
                        {
                          color:
                            msg.sender_type === "registered"
                              ? "#2563eb"
                              : "#6b7280",
                        },
                      ]}
                    >
                      {msg.sender_type === "registered"
                        ? "Registered"
                        : "Guest"}
                    </Text>
                  </View>
                  <Text
                    style={[styles.senderName, { color: colors.foreground }]}
                  >
                    {msg.sender_name}
                    {msg.sender_email ? ` • ${msg.sender_email}` : ""}
                  </Text>
                </View>

                {/* Message */}
                <Text
                  style={[styles.messageText, { color: colors.foreground }]}
                >
                  {msg.message}
                </Text>

                {isUnread && (
                  <Text style={styles.tapToRead}>Tap to mark as read</Text>
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}
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
  headerTextRow: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  headerTitle: { fontSize: 20, fontWeight: "600" },
  unreadBadge: {
    backgroundColor: "#dc2626",
    borderRadius: 10,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  unreadBadgeText: { color: "#ffffff", fontSize: 12, fontWeight: "700" },
  markAllButton: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingContainer: { flex: 1, alignItems: "center", justifyContent: "center" },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
  },
  emptyIconWrap: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#f3f4f6",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  emptyTitle: { fontSize: 18, fontWeight: "600", marginBottom: 8 },
  emptyText: { fontSize: 14, textAlign: "center" },
  content: { flex: 1 },
  scrollContent: { padding: 24, paddingBottom: 60 },
  messageCard: { borderRadius: 16, padding: 16, marginBottom: 12 },
  messageTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  catBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  catBadgeText: { fontSize: 12, fontWeight: "600" },
  messageTopRight: { flexDirection: "row", alignItems: "center", gap: 6 },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#dc2626",
  },
  messageDate: { fontSize: 12 },
  senderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 10,
  },
  senderBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  senderBadgeText: { fontSize: 11, fontWeight: "600" },
  senderName: { fontSize: 13, fontWeight: "500", flex: 1 },
  messageText: { fontSize: 14, lineHeight: 21, marginBottom: 4 },
  tapToRead: {
    fontSize: 12,
    color: "#d97706",
    marginTop: 6,
    fontStyle: "italic",
  },
});
