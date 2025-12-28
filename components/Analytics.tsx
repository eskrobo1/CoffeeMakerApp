// components/Analytics.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
} from "react-native";
import {
  ArrowLeft,
  Download,
  Mail,
  TrendingUp,
  Coffee,
} from "lucide-react-native";
import { useTheme, Shadows } from "../constants/Theme";
import { Button } from "./ui/button";

interface AnalyticsProps {
  adminEmail: string;
  onBack: () => void;
}

const dataByYear: Record<string, any[]> = {
  "2025": [
    { month: "Jan", orders: 720, coffee: 14400, milk: 10800, sugar: 2040 },
    { month: "Feb", orders: 690, coffee: 13800, milk: 10350, sugar: 1950 },
    { month: "Mar", orders: 620, coffee: 12400, milk: 9300, sugar: 1760 },
    { month: "Apr", orders: 560, coffee: 11200, milk: 8400, sugar: 1590 },
    { month: "May", orders: 520, coffee: 10400, milk: 7800, sugar: 1470 },
    { month: "Jun", orders: 420, coffee: 8400, milk: 6300, sugar: 1200 },
    { month: "Jul", orders: 380, coffee: 7600, milk: 5700, sugar: 1080 },
    { month: "Aug", orders: 410, coffee: 8200, milk: 6150, sugar: 1160 },
    { month: "Sep", orders: 490, coffee: 9800, milk: 7350, sugar: 1390 },
    { month: "Oct", orders: 580, coffee: 11600, milk: 8700, sugar: 1640 },
    { month: "Nov", orders: 650, coffee: 13000, milk: 9750, sugar: 1840 },
    { month: "Dec", orders: 750, coffee: 15000, milk: 11250, sugar: 2120 },
  ],
  "2024": [
    { month: "Jan", orders: 650, coffee: 13000, milk: 9750, sugar: 1840 },
    { month: "Feb", orders: 620, coffee: 12400, milk: 9300, sugar: 1760 },
    { month: "Mar", orders: 560, coffee: 11200, milk: 8400, sugar: 1590 },
    { month: "Apr", orders: 510, coffee: 10200, milk: 7650, sugar: 1440 },
    { month: "May", orders: 480, coffee: 9600, milk: 7200, sugar: 1360 },
    { month: "Jun", orders: 380, coffee: 7600, milk: 5700, sugar: 1080 },
    { month: "Jul", orders: 340, coffee: 6800, milk: 5100, sugar: 960 },
    { month: "Aug", orders: 370, coffee: 7400, milk: 5550, sugar: 1050 },
    { month: "Sep", orders: 450, coffee: 9000, milk: 6750, sugar: 1270 },
    { month: "Oct", orders: 520, coffee: 10400, milk: 7800, sugar: 1470 },
    { month: "Nov", orders: 590, coffee: 11800, milk: 8850, sugar: 1670 },
    { month: "Dec", orders: 680, coffee: 13600, milk: 10200, sugar: 1930 },
  ],
  "2023": [
    { month: "Jan", orders: 580, coffee: 11600, milk: 8700, sugar: 1640 },
    { month: "Feb", orders: 550, coffee: 11000, milk: 8250, sugar: 1560 },
    { month: "Mar", orders: 490, coffee: 9800, milk: 7350, sugar: 1390 },
    { month: "Apr", orders: 450, coffee: 9000, milk: 6750, sugar: 1270 },
    { month: "May", orders: 420, coffee: 8400, milk: 6300, sugar: 1190 },
    { month: "Jun", orders: 330, coffee: 6600, milk: 4950, sugar: 930 },
    { month: "Jul", orders: 290, coffee: 5800, milk: 4350, sugar: 820 },
    { month: "Aug", orders: 320, coffee: 6400, milk: 4800, sugar: 900 },
    { month: "Sep", orders: 380, coffee: 7600, milk: 5700, sugar: 1080 },
    { month: "Oct", orders: 450, coffee: 9000, milk: 6750, sugar: 1270 },
    { month: "Nov", orders: 520, coffee: 10400, milk: 7800, sugar: 1470 },
    { month: "Dec", orders: 610, coffee: 12200, milk: 9150, sugar: 1730 },
  ],
};

const drinkPopularity = [
  { name: "Cappuccino", count: 245, percentage: 100 },
  { name: "Latte", count: 198, percentage: 81 },
  { name: "Espresso", count: 167, percentage: 68 },
  { name: "Mocha", count: 142, percentage: 58 },
  { name: "Hot Chocolate", count: 98, percentage: 40 },
];

export function Analytics({ adminEmail, onBack }: AnalyticsProps) {
  const { colors } = useTheme();
  const [selectedYear, setSelectedYear] = useState("2025");
  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const [showDownloadDialog, setShowDownloadDialog] = useState(false);
  const [fileName, setFileName] = useState("");
  const [showYearPicker, setShowYearPicker] = useState(false);

  const monthlyData = dataByYear[selectedYear] || dataByYear["2025"];
  const availableYears = Object.keys(dataByYear).sort(
    (a, b) => Number(b) - Number(a)
  );

  const handleEmailReport = () => {
    setShowEmailDialog(false);
    Alert.alert("Success", `Report sent to ${adminEmail}!`);
  };

  const handleDownload = () => {
    const name = fileName.trim() || `coffee-analytics-${selectedYear}`;
    setShowDownloadDialog(false);
    setFileName("");
    Alert.alert("Success", `Saving as ${name}.pdf...`);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <ArrowLeft size={24} color="#ffffff" />
          </TouchableOpacity>
          <View>
            <Text style={styles.headerTitle}>Analytics</Text>
            <Text style={styles.headerSubtitle}>Consumption & trends</Text>
          </View>
        </View>

        {/* Year Selector */}
        <View style={styles.yearSelector}>
          <Text style={styles.yearLabel}>Viewing Year</Text>
          <TouchableOpacity
            onPress={() => setShowYearPicker(true)}
            style={styles.yearButton}
          >
            <Text style={styles.yearButtonText}>{selectedYear}</Text>
          </TouchableOpacity>
        </View>

        {/* Export Buttons */}
        <View style={styles.exportButtons}>
          <TouchableOpacity
            onPress={() => setShowEmailDialog(true)}
            style={styles.exportButton}
          >
            <Mail size={16} color="#ffffff" />
            <Text style={styles.exportButtonText}>Email</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setShowDownloadDialog(true)}
            style={styles.exportButton}
          >
            <Download size={16} color="#ffffff" />
            <Text style={styles.exportButtonText}>Download</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Data Table */}
        <View style={[styles.card, Shadows.md]}>
          <Text style={styles.cardTitle}>Monthly Data - {selectedYear}</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View>
              {/* Table Header */}
              <View style={styles.tableHeader}>
                <Text
                  style={[styles.tableHeaderCell, styles.tableHeaderCellFirst]}
                >
                  Month
                </Text>
                <Text style={styles.tableHeaderCell}>Orders</Text>
                <Text style={styles.tableHeaderCell}>Coffee</Text>
                <Text style={styles.tableHeaderCell}>Milk</Text>
                <Text style={styles.tableHeaderCell}>Sugar</Text>
              </View>

              {/* Table Body */}
              {monthlyData.map((row, index) => (
                <View
                  key={row.month}
                  style={[
                    styles.tableRow,
                    index % 2 === 0 && styles.tableRowEven,
                  ]}
                >
                  <Text style={[styles.tableCell, styles.tableCellFirst]}>
                    {row.month}
                  </Text>
                  <Text style={styles.tableCell}>{row.orders}</Text>
                  <Text style={styles.tableCell}>{row.coffee}g</Text>
                  <Text style={styles.tableCell}>{row.milk}ml</Text>
                  <Text style={styles.tableCell}>{row.sugar}g</Text>
                </View>
              ))}

              {/* Table Footer */}
              <View style={styles.tableFooter}>
                <Text style={[styles.tableFooterCell, styles.tableCellFirst]}>
                  Total
                </Text>
                <Text style={styles.tableFooterCell}>
                  {monthlyData.reduce((sum, row) => sum + row.orders, 0)}
                </Text>
                <Text style={styles.tableFooterCell}>
                  {monthlyData
                    .reduce((sum, row) => sum + row.coffee, 0)
                    .toLocaleString()}
                  g
                </Text>
                <Text style={styles.tableFooterCell}>
                  {monthlyData
                    .reduce((sum, row) => sum + row.milk, 0)
                    .toLocaleString()}
                  ml
                </Text>
                <Text style={styles.tableFooterCell}>
                  {monthlyData
                    .reduce((sum, row) => sum + row.sugar, 0)
                    .toLocaleString()}
                  g
                </Text>
              </View>
            </View>
          </ScrollView>
        </View>

        {/* Simple Bar Chart Visualization */}
        <View style={[styles.card, Shadows.md]}>
          <Text style={styles.cardTitle}>
            Supply Consumption - {selectedYear}
          </Text>
          <View style={styles.chartLegend}>
            <View style={styles.legendItem}>
              <View
                style={[styles.legendDot, { backgroundColor: "#6F4E37" }]}
              />
              <Text style={styles.legendText}>Coffee (g)</Text>
            </View>
            <View style={styles.legendItem}>
              <View
                style={[styles.legendDot, { backgroundColor: "#3b82f6" }]}
              />
              <Text style={styles.legendText}>Milk (ml)</Text>
            </View>
            <View style={styles.legendItem}>
              <View
                style={[styles.legendDot, { backgroundColor: "#ec4899" }]}
              />
              <Text style={styles.legendText}>Sugar (g)</Text>
            </View>
          </View>
          <Text style={styles.chartNote}>
            Note: Charts require additional library. Data shown in table above.
          </Text>
        </View>

        {/* Popular Drinks */}
        <View style={[styles.card, Shadows.md]}>
          <Text style={styles.cardTitle}>Most Popular Drinks</Text>
          <View style={styles.drinksList}>
            {drinkPopularity.map((drink) => (
              <View key={drink.name} style={styles.drinkItem}>
                <View style={styles.drinkItemHeader}>
                  <View style={styles.drinkItemLeft}>
                    <View style={styles.drinkIcon}>
                      <Coffee size={16} color="#6F4E37" />
                    </View>
                    <Text style={styles.drinkName}>{drink.name}</Text>
                  </View>
                  <Text style={styles.drinkCount}>{drink.count}</Text>
                </View>
                <View style={styles.progressBar}>
                  <View
                    style={[
                      styles.progressFill,
                      { width: `${drink.percentage}%` },
                    ]}
                  />
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Predictions */}
        <View style={styles.predictionCard}>
          <View style={styles.predictionHeader}>
            <TrendingUp size={20} color="#7c3aed" />
            <Text style={styles.predictionTitle}>Next Month Forecast</Text>
          </View>
          <Text style={styles.predictionSubtitle}>
            Based on current trends:
          </Text>
          <View style={styles.predictionList}>
            <Text style={styles.predictionItem}>
              • Estimated orders: 750-780
            </Text>
            <Text style={styles.predictionItem}>• Coffee needed: ~15kg</Text>
            <Text style={styles.predictionItem}>• Milk needed: ~11.5L</Text>
            <Text style={styles.predictionItem}>• Sugar needed: ~2.1kg</Text>
          </View>
        </View>
      </ScrollView>

      {/* Year Picker Modal */}
      <Modal visible={showYearPicker} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.pickerModal, { backgroundColor: colors.card }]}>
            <Text style={[styles.pickerTitle, { color: colors.foreground }]}>
              Select Year
            </Text>
            {availableYears.map((year) => (
              <TouchableOpacity
                key={year}
                onPress={() => {
                  setSelectedYear(year);
                  setShowYearPicker(false);
                }}
                style={[
                  styles.yearOption,
                  selectedYear === year && styles.yearOptionSelected,
                ]}
              >
                <Text
                  style={[
                    styles.yearOptionText,
                    { color: colors.foreground },
                    selectedYear === year && styles.yearOptionTextSelected,
                  ]}
                >
                  {year}
                </Text>
              </TouchableOpacity>
            ))}
            <Button
              onPress={() => setShowYearPicker(false)}
              variant="outline"
              style={{ marginTop: 16 }}
            >
              Cancel
            </Button>
          </View>
        </View>
      </Modal>

      {/* Email Dialog */}
      <Modal visible={showEmailDialog} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.dialogModal, { backgroundColor: colors.card }]}>
            <Text style={[styles.dialogTitle, { color: colors.foreground }]}>
              Send Report via Email
            </Text>
            <View style={styles.dialogBody}>
              <Text style={styles.dialogLabel}>Report will be sent to:</Text>
              <View style={styles.emailDisplay}>
                <Text style={styles.emailText}>{adminEmail}</Text>
              </View>
              <Text style={styles.dialogNote}>
                Includes all analytics data for {selectedYear}.
              </Text>
            </View>
            <View style={styles.dialogFooter}>
              <Button
                variant="outline"
                onPress={() => setShowEmailDialog(false)}
                style={styles.dialogButton}
              >
                Cancel
              </Button>
              <Button
                onPress={handleEmailReport}
                style={[styles.dialogButton, { backgroundColor: "#16a34a" }]}
              >
                <Mail size={16} color="#ffffff" />
                <Text style={styles.dialogButtonText}>Send</Text>
              </Button>
            </View>
          </View>
        </View>
      </Modal>

      {/* Download Dialog */}
      <Modal visible={showDownloadDialog} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.dialogModal, { backgroundColor: colors.card }]}>
            <Text style={[styles.dialogTitle, { color: colors.foreground }]}>
              Download PDF Report
            </Text>
            <View style={styles.dialogBody}>
              <Text style={styles.dialogLabel}>File Name</Text>
              <TextInput
                value={fileName}
                onChangeText={setFileName}
                placeholder={`coffee-analytics-${selectedYear}`}
                placeholderTextColor={colors.mutedForeground}
                style={[
                  styles.input,
                  { borderColor: colors.border, color: colors.foreground },
                ]}
              />
              <Text style={styles.dialogNote}>
                Leave blank to use default name
              </Text>
            </View>
            <View style={styles.dialogFooter}>
              <Button
                variant="outline"
                onPress={() => setShowDownloadDialog(false)}
                style={styles.dialogButton}
              >
                Cancel
              </Button>
              <Button
                onPress={handleDownload}
                style={[styles.dialogButton, { backgroundColor: "#16a34a" }]}
              >
                <Download size={16} color="#ffffff" />
                <Text style={styles.dialogButtonText}>Download</Text>
              </Button>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5DC",
  },
  header: {
    backgroundColor: "#16a34a",
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 24,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#ffffff",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#bbf7d0",
  },
  yearSelector: {
    marginBottom: 16,
  },
  yearLabel: {
    fontSize: 14,
    color: "#bbf7d0",
    marginBottom: 8,
  },
  yearButton: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  yearButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "500",
  },
  exportButtons: {
    flexDirection: "row",
    gap: 12,
  },
  exportButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    paddingVertical: 12,
  },
  exportButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "500",
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 140,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#6F4E37",
    marginBottom: 16,
  },
  tableHeader: {
    flexDirection: "row",
    borderBottomWidth: 2,
    borderBottomColor: "#e5e7eb",
    paddingBottom: 8,
  },
  tableHeaderCell: {
    width: 80,
    fontSize: 12,
    fontWeight: "600",
    color: "#A0826D",
    textAlign: "right",
  },
  tableHeaderCellFirst: {
    textAlign: "left",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
    paddingVertical: 8,
  },
  tableRowEven: {
    backgroundColor: "#f9fafb",
  },
  tableCell: {
    width: 80,
    fontSize: 12,
    color: "#6F4E37",
    textAlign: "right",
  },
  tableCellFirst: {
    textAlign: "left",
  },
  tableFooter: {
    flexDirection: "row",
    backgroundColor: "rgba(111, 78, 55, 0.05)",
    paddingVertical: 8,
  },
  tableFooterCell: {
    width: 80,
    fontSize: 12,
    fontWeight: "600",
    color: "#6F4E37",
    textAlign: "right",
  },
  chartLegend: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
    marginTop: 16,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendText: {
    fontSize: 12,
    color: "#A0826D",
  },
  chartNote: {
    fontSize: 12,
    color: "#A0826D",
    fontStyle: "italic",
    marginTop: 16,
  },
  drinksList: {
    gap: 16,
  },
  drinkItem: {
    gap: 8,
  },
  drinkItemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  drinkItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  drinkIcon: {
    width: 32,
    height: 32,
    backgroundColor: "rgba(111, 78, 55, 0.1)",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  drinkName: {
    fontSize: 14,
    color: "#6F4E37",
  },
  drinkCount: {
    fontSize: 14,
    color: "#A0826D",
  },
  progressBar: {
    height: 8,
    backgroundColor: "#f3f4f6",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#f59e0b",
    borderRadius: 4,
  },
  predictionCard: {
    backgroundColor: "#faf5ff",
    borderWidth: 2,
    borderColor: "#e9d5ff",
    borderRadius: 16,
    padding: 20,
  },
  predictionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  predictionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#581c87",
  },
  predictionSubtitle: {
    fontSize: 14,
    color: "#7c3aed",
    marginBottom: 12,
  },
  predictionList: {
    gap: 8,
  },
  predictionItem: {
    fontSize: 14,
    color: "#7c3aed",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  pickerModal: {
    width: "100%",
    maxWidth: 300,
    borderRadius: 16,
    padding: 24,
  },
  pickerTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
    textAlign: "center",
  },
  yearOption: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  yearOptionSelected: {
    backgroundColor: "#16a34a",
  },
  yearOptionText: {
    fontSize: 16,
    textAlign: "center",
  },
  yearOptionTextSelected: {
    color: "#ffffff",
    fontWeight: "600",
  },
  dialogModal: {
    width: "100%",
    maxWidth: 400,
    borderRadius: 16,
    padding: 24,
  },
  dialogTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
  },
  dialogBody: {
    marginBottom: 24,
  },
  dialogLabel: {
    fontSize: 14,
    color: "#6F4E37",
    marginBottom: 8,
  },
  emailDisplay: {
    backgroundColor: "#F5F5DC",
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
  },
  emailText: {
    fontSize: 14,
    color: "#6F4E37",
  },
  input: {
    height: 48,
    borderWidth: 2,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 14,
    marginBottom: 8,
  },
  dialogNote: {
    fontSize: 12,
    color: "#A0826D",
  },
  dialogFooter: {
    flexDirection: "row",
    gap: 12,
  },
  dialogButton: {
    flex: 1,
  },
  dialogButtonText: {
    color: "#ffffff",
    marginLeft: 8,
  },
});
