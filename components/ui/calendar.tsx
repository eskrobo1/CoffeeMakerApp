import * as React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from "react-native";
import { ChevronLeft, ChevronRight } from "lucide-react-native";

interface CalendarProps {
  selected?: Date;
  onSelect?: (date: Date | undefined) => void;
  mode?: "single" | "multiple" | "range";
  disabled?: (date: Date) => boolean;
  style?: ViewStyle;
}

export function Calendar({
  selected,
  onSelect,
  mode = "single",
  disabled,
  style,
}: CalendarProps) {
  const [currentMonth, setCurrentMonth] = React.useState(new Date());

  const daysInMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0
  ).getDate();

  const firstDayOfMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1
  ).getDay();

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const previousMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
    );
  };

  const nextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
    );
  };

  const isSelected = (day: number) => {
    if (!selected) return false;
    const dateToCheck = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day
    );
    return (
      selected.getDate() === dateToCheck.getDate() &&
      selected.getMonth() === dateToCheck.getMonth() &&
      selected.getFullYear() === dateToCheck.getFullYear()
    );
  };

  const isToday = (day: number) => {
    const today = new Date();
    return (
      today.getDate() === day &&
      today.getMonth() === currentMonth.getMonth() &&
      today.getFullYear() === currentMonth.getFullYear()
    );
  };

  const handleDayPress = (day: number) => {
    const selectedDate = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day
    );
    if (disabled && disabled(selectedDate)) return;
    onSelect?.(selectedDate);
  };

  const renderDays = () => {
    const days = [];
    const totalCells = Math.ceil((firstDayOfMonth + daysInMonth) / 7) * 7;

    for (let i = 0; i < totalCells; i++) {
      const day = i - firstDayOfMonth + 1;
      const isValidDay = day > 0 && day <= daysInMonth;
      const dateToCheck = isValidDay
        ? new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
        : null;
      const isDisabled =
        dateToCheck && disabled ? disabled(dateToCheck) : false;

      days.push(
        <TouchableOpacity
          key={i}
          style={[
            styles.dayCell,
            !isValidDay && styles.emptyCell,
            isValidDay && isSelected(day) && styles.selectedDay,
            isValidDay && isToday(day) && styles.todayDay,
            isDisabled && styles.disabledDay,
          ]}
          onPress={() => isValidDay && !isDisabled && handleDayPress(day)}
          disabled={!isValidDay || isDisabled}
          activeOpacity={0.7}
        >
          {isValidDay && (
            <Text
              style={[
                styles.dayText,
                isSelected(day) && styles.selectedDayText,
                isDisabled && styles.disabledDayText,
              ]}
            >
              {day}
            </Text>
          )}
        </TouchableOpacity>
      );
    }

    return days;
  };

  return (
    <View style={[styles.calendar, style]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={previousMonth}
          style={styles.navButton}
          activeOpacity={0.7}
        >
          <ChevronLeft size={20} color="#6B7280" />
        </TouchableOpacity>
        <Text style={styles.monthYear}>
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </Text>
        <TouchableOpacity
          onPress={nextMonth}
          style={styles.navButton}
          activeOpacity={0.7}
        >
          <ChevronRight size={20} color="#6B7280" />
        </TouchableOpacity>
      </View>

      {/* Day names */}
      <View style={styles.dayNamesRow}>
        {dayNames.map((name) => (
          <View key={name} style={styles.dayNameCell}>
            <Text style={styles.dayNameText}>{name}</Text>
          </View>
        ))}
      </View>

      {/* Days grid */}
      <View style={styles.daysGrid}>{renderDays()}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  calendar: {
    padding: 12,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    marginBottom: 16,
  },
  navButton: {
    padding: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  monthYear: {
    fontSize: 14,
    fontWeight: "500",
  },
  dayNamesRow: {
    flexDirection: "row",
    marginBottom: 8,
  },
  dayNameCell: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 4,
  },
  dayNameText: {
    fontSize: 13,
    color: "#6B7280",
  },
  daysGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  dayCell: {
    width: "14.28%",
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 4,
  },
  emptyCell: {
    opacity: 0,
  },
  selectedDay: {
    backgroundColor: "#000000",
    borderRadius: 6,
  },
  todayDay: {
    backgroundColor: "#F3F4F6",
    borderRadius: 6,
  },
  disabledDay: {
    opacity: 0.5,
  },
  dayText: {
    fontSize: 14,
    color: "#000000",
  },
  selectedDayText: {
    color: "#FFFFFF",
    fontWeight: "500",
  },
  disabledDayText: {
    color: "#9CA3AF",
  },
});
