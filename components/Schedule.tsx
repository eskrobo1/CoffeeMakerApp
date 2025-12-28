import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Clock, Plus, Trash2, Coffee } from "lucide-react-native";
import { Switch } from "./ui/switch";
import { LinearGradient } from "expo-linear-gradient";

interface ScheduleItem {
  id: string;
  time: string;
  days: string[];
  enabled: boolean;
  preset: string;
}

export function Schedule() {
  const [schedules, setSchedules] = useState<ScheduleItem[]>([
    {
      id: "1",
      time: "07:00",
      days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
      enabled: true,
      preset: "Medium Coffee",
    },
    {
      id: "2",
      time: "15:00",
      days: ["Sat", "Sun"],
      enabled: false,
      preset: "Cappuccino",
    },
  ]);

  const toggleSchedule = (id: string) => {
    setSchedules(
      schedules.map((schedule) =>
        schedule.id === id
          ? { ...schedule, enabled: !schedule.enabled }
          : schedule
      )
    );
  };

  const deleteSchedule = (id: string) => {
    setSchedules(schedules.filter((schedule) => schedule.id !== id));
  };

  const addSchedule = () => {
    // Implementiraj logiku za dodavanje novog schedule-a
    console.log("Add new schedule");
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Brew Schedule</Text>
        <TouchableOpacity onPress={addSchedule} activeOpacity={0.8}>
          <LinearGradient
            colors={["#d97706", "#ea580c"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.addButton}
          >
            <Plus size={20} color="#ffffff" />
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Empty State */}
      {schedules.length === 0 ? (
        <View style={styles.emptyState}>
          <Clock size={48} color="#9ca3af" style={styles.emptyIcon} />
          <Text style={styles.emptyTitle}>No schedules set</Text>
          <Text style={styles.emptyDescription}>
            Tap + to add a new schedule
          </Text>
        </View>
      ) : (
        <View style={styles.schedulesList}>
          {schedules.map((schedule) => (
            <View
              key={schedule.id}
              style={[
                styles.scheduleCard,
                schedule.enabled
                  ? styles.scheduleCardEnabled
                  : styles.scheduleCardDisabled,
              ]}
            >
              {/* Schedule Info and Controls */}
              <View style={styles.scheduleHeader}>
                <View style={styles.scheduleInfo}>
                  <Coffee
                    size={20}
                    color={schedule.enabled ? "#ea580c" : "#9ca3af"}
                  />
                  <View style={styles.scheduleDetails}>
                    <Text style={styles.scheduleTime}>{schedule.time}</Text>
                    <Text style={styles.schedulePreset}>{schedule.preset}</Text>
                  </View>
                </View>

                <View style={styles.scheduleControls}>
                  <Switch
                    checked={schedule.enabled}
                    onCheckedChange={() => toggleSchedule(schedule.id)}
                  />
                  <TouchableOpacity
                    onPress={() => deleteSchedule(schedule.id)}
                    style={styles.deleteButton}
                    activeOpacity={0.7}
                  >
                    <Trash2 size={16} color="#9ca3af" />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Days */}
              <View style={styles.daysContainer}>
                {schedule.days.map((day) => (
                  <View
                    key={day}
                    style={[
                      styles.dayBadge,
                      schedule.enabled
                        ? styles.dayBadgeEnabled
                        : styles.dayBadgeDisabled,
                    ]}
                  >
                    <Text
                      style={[
                        styles.dayText,
                        schedule.enabled
                          ? styles.dayTextEnabled
                          : styles.dayTextDisabled,
                      ]}
                    >
                      {day}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  contentContainer: {
    padding: 24,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 48,
  },
  emptyIcon: {
    opacity: 0.5,
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 16,
    color: "#9ca3af",
    marginBottom: 4,
  },
  emptyDescription: {
    fontSize: 14,
    color: "#9ca3af",
  },
  schedulesList: {
    gap: 12,
  },
  scheduleCard: {
    backgroundColor: "#ffffff",
    borderWidth: 2,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  scheduleCardEnabled: {
    borderColor: "#fed7aa",
    backgroundColor: "#fff7ed",
  },
  scheduleCardDisabled: {
    borderColor: "#e5e7eb",
    backgroundColor: "#ffffff",
  },
  scheduleHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  scheduleInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  scheduleDetails: {
    flex: 1,
  },
  scheduleTime: {
    fontSize: 24,
    fontWeight: "600",
    color: "#111827",
  },
  schedulePreset: {
    fontSize: 14,
    color: "#4b5563",
    marginTop: 2,
  },
  scheduleControls: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  deleteButton: {
    padding: 8,
  },
  daysContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
  },
  dayBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  dayBadgeEnabled: {
    backgroundColor: "#fed7aa",
  },
  dayBadgeDisabled: {
    backgroundColor: "#e5e7eb",
  },
  dayText: {
    fontSize: 12,
    fontWeight: "500",
  },
  dayTextEnabled: {
    color: "#9a3412",
  },
  dayTextDisabled: {
    color: "#4b5563",
  },
});
