// components/Analytics.tsx
import React, { useState, useEffect, useMemo } from "react";
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
  ChevronDown,
  TrendingUp,
} from "lucide-react-native";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import { useTheme, Shadows } from "../constants/Theme";
import { useDatabase } from "../contexts/DatabaseContext";
import { Button } from "./ui/button";

interface AnalyticsProps {
  adminEmail: string;
  onBack: () => void;
}

const COFFEE_G_PER_ORDER = 20;
const MILK_ML_PER_ORDER = 15;
const SUGAR_G_PER_ORDER = 2.8;

const dataByYear: Record<
  string,
  {
    month: string;
    orders: number;
    coffee: number;
    milk: number;
    sugar: number;
  }[]
> = {
  "2026": [
    { month: "Jan", orders: 800, coffee: 16000, milk: 12000, sugar: 2260 },
    { month: "Feb", orders: 760, coffee: 15200, milk: 11400, sugar: 2150 },
    { month: "Mar", orders: 700, coffee: 14000, milk: 10500, sugar: 1980 },
    { month: "Apr", orders: 640, coffee: 12800, milk: 9600, sugar: 1810 },
    { month: "May", orders: 600, coffee: 12000, milk: 9000, sugar: 1700 },
    { month: "Jun", orders: 480, coffee: 9600, milk: 7200, sugar: 1360 },
    { month: "Jul", orders: 440, coffee: 8800, milk: 6600, sugar: 1250 },
    { month: "Aug", orders: 460, coffee: 9200, milk: 6900, sugar: 1290 },
    { month: "Sep", orders: 185, coffee: 3700, milk: 2775, sugar: 520 },
  ],
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

const generateReportHTML = (
  data: (typeof dataByYear)["2026"],
  year: string,
  generatedAt: string,
) => {
  const totals = {
    orders: data.reduce((s, r) => s + r.orders, 0),
    coffee: data.reduce((s, r) => s + r.coffee, 0),
    milk: data.reduce((s, r) => s + r.milk, 0),
    sugar: data.reduce((s, r) => s + r.sugar, 0),
  };
  const rows = data
    .map(
      (r, i) =>
        `<tr class="${i % 2 === 0 ? "even" : ""}"><td>${r.month}</td><td>${r.orders}</td><td>${r.coffee.toLocaleString()}g</td><td>${r.milk.toLocaleString()}ml</td><td>${r.sugar.toLocaleString()}g</td></tr>`,
    )
    .join("");
  return `<html><head><meta charset="utf-8"><style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:Arial,sans-serif;padding:40px;color:#1f2937}.header{background:#16a34a;color:white;padding:24px;border-radius:12px;margin-bottom:30px}h1{font-size:22px;margin-bottom:4px}.sub{font-size:13px;opacity:.8}table{width:100%;border-collapse:collapse}th{background:#16a34a;color:white;padding:10px 14px;text-align:left;font-size:13px}td{padding:10px 14px;border-bottom:1px solid #e5e7eb;font-size:13px}.even td{background:#f9fafb}.total td{background:#f0fdf4;font-weight:700;border-top:2px solid #16a34a}.footer{margin-top:24px;font-size:11px;color:#9ca3af;text-align:center}</style></head><body><div class="header"><h1>☕ Coffee Machine Analytics — ${year}</h1><div class="sub">Generated: ${generatedAt}</div></div><table><thead><tr><th>Month</th><th>Orders</th><th>Coffee</th><th>Milk</th><th>Sugar</th></tr></thead><tbody>${rows}</tbody><tfoot><tr class="total"><td>TOTAL</td><td>${totals.orders}</td><td>${totals.coffee.toLocaleString()}g</td><td>${totals.milk.toLocaleString()}ml</td><td>${totals.sugar.toLocaleString()}g</td></tr></tfoot></table><div class="footer">Coffee Machine Analytics App · ${generatedAt}</div></body></html>`;
};

export function Analytics({ adminEmail, onBack }: AnalyticsProps) {
  const { colors } = useTheme();
  const { db, isReady } = useDatabase();

  const [selectedYear, setSelectedYear] = useState("2026");
  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const [showDownloadDialog, setShowDownloadDialog] = useState(false);
  const [fileName, setFileName] = useState("");
  const [showYearDropdown, setShowYearDropdown] = useState(false);
  const [emailInput, setEmailInput] = useState(adminEmail);
  const [realOrdersThisMonth, setRealOrdersThisMonth] = useState(0);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    if (!db || !isReady) return;
    const now = new Date();
    // ── Samo COMPLETED narudžbine se dodaju u analytics ─────────────────────
    db.getFirstAsync<{ count: number }>(
      `SELECT COUNT(*) as count FROM orders
       WHERE status = 'completed'
       AND strftime('%Y', created_at) = ?
       AND strftime('%m', created_at) = ?`,
      [
        now.getFullYear().toString(),
        String(now.getMonth() + 1).padStart(2, "0"),
      ],
    )
      .then((r) => {
        if (r) setRealOrdersThisMonth(r.count);
      })
      .catch(() => {});
    // ─────────────────────────────────────────────────────────────────────────
  }, [db, isReady]);

  const availableYears = Object.keys(dataByYear).sort(
    (a, b) => Number(b) - Number(a),
  );
  const currentYear = new Date().getFullYear().toString();
  const currentMonthIdx = new Date().getMonth();
  const MONTH_NAMES = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const monthlyData = useMemo(() => {
    const base = dataByYear[selectedYear] || dataByYear["2026"];
    if (selectedYear !== currentYear || realOrdersThisMonth === 0) return base;
    return base.map((row, idx) => {
      if (idx !== currentMonthIdx) return row;
      return {
        ...row,
        orders: row.orders + realOrdersThisMonth,
        coffee: row.coffee + realOrdersThisMonth * COFFEE_G_PER_ORDER,
        milk: row.milk + realOrdersThisMonth * MILK_ML_PER_ORDER,
        sugar: row.sugar + Math.round(realOrdersThisMonth * SUGAR_G_PER_ORDER),
      };
    });
  }, [selectedYear, realOrdersThisMonth, currentYear, currentMonthIdx]);

  const handleDownload = async () => {
    const name = fileName.trim() || `coffee-analytics-${selectedYear}`;
    setShowDownloadDialog(false);
    setFileName("");
    setIsExporting(true);
    try {
      const html = generateReportHTML(
        monthlyData,
        selectedYear,
        new Date().toLocaleDateString("en-GB"),
      );
      const { uri } = await Print.printToFileAsync({ html, base64: false });
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri, {
          mimeType: "application/pdf",
          dialogTitle: `Save ${name}.pdf`,
          UTI: "com.adobe.pdf",
        });
      } else {
        Alert.alert("Saved", `Report saved as ${name}.pdf`);
      }
    } catch {
      Alert.alert(
        "Error",
        "Could not generate PDF.\nnpx expo install expo-print expo-sharing",
      );
    } finally {
      setIsExporting(false);
    }
  };

  const handleEmailReport = async () => {
    setShowEmailDialog(false);
    setIsExporting(true);
    try {
      const html = generateReportHTML(
        monthlyData,
        selectedYear,
        new Date().toLocaleDateString("en-GB"),
      );
      const { uri } = await Print.printToFileAsync({ html, base64: false });
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri, {
          mimeType: "application/pdf",
          dialogTitle: `Send Analytics ${selectedYear}`,
        });
      } else {
        Alert.alert("Success", `Report ready for ${emailInput}`);
      }
    } catch {
      Alert.alert("Error", "Could not generate report.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, showYearDropdown && { zIndex: 2000 }]}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <ArrowLeft size={24} color="#ffffff" />
          </TouchableOpacity>
          <View>
            <Text style={styles.headerTitle}>Analytics</Text>
            <Text style={styles.headerSubtitle}>Consumption & trends</Text>
          </View>
        </View>

        <View style={styles.yearSelector}>
          <Text style={styles.yearLabel}>Viewing Year</Text>
          <TouchableOpacity
            onPress={() => setShowYearDropdown(!showYearDropdown)}
            style={styles.yearButton}
          >
            <Text style={styles.yearButtonText}>{selectedYear}</Text>
            <ChevronDown size={20} color="#ffffff" />
          </TouchableOpacity>
          {showYearDropdown && (
            <View style={styles.dropdownMenu}>
              {availableYears.map((year) => (
                <TouchableOpacity
                  key={year}
                  onPress={() => {
                    setSelectedYear(year);
                    setShowYearDropdown(false);
                  }}
                  style={[
                    styles.dropdownItem,
                    selectedYear === year && styles.dropdownItemSelected,
                  ]}
                >
                  <Text
                    style={[
                      styles.dropdownItemText,
                      selectedYear === year && styles.dropdownItemTextSelected,
                    ]}
                  >
                    {year}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        <View style={styles.exportButtons}>
          <TouchableOpacity
            onPress={() => {
              setEmailInput(adminEmail);
              setShowEmailDialog(true);
            }}
            style={styles.exportButton}
            disabled={isExporting}
          >
            <Mail size={16} color="#ffffff" />
            <Text style={styles.exportButtonText}>
              {isExporting ? "..." : "Email"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setShowDownloadDialog(true)}
            style={styles.exportButton}
            disabled={isExporting}
          >
            <Download size={16} color="#ffffff" />
            <Text style={styles.exportButtonText}>
              {isExporting ? "Generating..." : "Download PDF"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Diskretna obavijest o realnim narudžbinama (samo completed) */}
        {selectedYear === currentYear && realOrdersThisMonth > 0 && (
          <View style={styles.realDataBanner}>
            <Text style={styles.realDataBannerText}>
              ℹ️ {realOrdersThisMonth} completed{" "}
              {realOrdersThisMonth === 1 ? "order" : "orders"} added to{" "}
              {MONTH_NAMES[currentMonthIdx]} data
            </Text>
          </View>
        )}

        <View style={[styles.card, Shadows.md]}>
          <Text style={styles.cardTitle}>Monthly Data — {selectedYear}</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View>
              <View style={styles.tableHeader}>
                <Text style={[styles.tableHeaderCell, styles.tableCellFirst]}>
                  Month
                </Text>
                <Text style={styles.tableHeaderCell}>Orders</Text>
                <Text style={styles.tableHeaderCell}>Coffee</Text>
                <Text style={styles.tableHeaderCell}>Milk</Text>
                <Text style={styles.tableHeaderCell}>Sugar</Text>
              </View>
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
                  <Text style={styles.tableCell}>
                    {row.coffee.toLocaleString()}g
                  </Text>
                  <Text style={styles.tableCell}>
                    {row.milk.toLocaleString()}ml
                  </Text>
                  <Text style={styles.tableCell}>
                    {row.sugar.toLocaleString()}g
                  </Text>
                </View>
              ))}
              <View style={styles.tableFooter}>
                <Text style={[styles.tableFooterCell, styles.tableCellFirst]}>
                  Total
                </Text>
                <Text style={styles.tableFooterCell}>
                  {monthlyData.reduce((s, r) => s + r.orders, 0)}
                </Text>
                <Text style={styles.tableFooterCell}>
                  {monthlyData
                    .reduce((s, r) => s + r.coffee, 0)
                    .toLocaleString()}
                  g
                </Text>
                <Text style={styles.tableFooterCell}>
                  {monthlyData.reduce((s, r) => s + r.milk, 0).toLocaleString()}
                  ml
                </Text>
                <Text style={styles.tableFooterCell}>
                  {monthlyData
                    .reduce((s, r) => s + r.sugar, 0)
                    .toLocaleString()}
                  g
                </Text>
              </View>
            </View>
          </ScrollView>
        </View>

        <View style={styles.predictionCard}>
          <View style={styles.predictionHeader}>
            <TrendingUp size={20} color="#7c3aed" />
            <Text style={styles.predictionTitle}>Next Month Forecast</Text>
          </View>
          <Text style={styles.predictionSubtitle}>
            Based on current trends:
          </Text>
          {[
            "Estimated orders: 750–780",
            "Coffee needed: ~15kg",
            "Milk needed: ~11.5L",
            "Sugar needed: ~2.1kg",
          ].map((item, i) => (
            <Text key={i} style={styles.predictionItem}>
              • {item}
            </Text>
          ))}
        </View>
      </ScrollView>

      <Modal visible={showEmailDialog} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.dialogModal, { backgroundColor: colors.card }]}>
            <Text style={[styles.dialogTitle, { color: colors.foreground }]}>
              Send Report via Email
            </Text>
            <Text style={styles.dialogLabel}>Report will be sent to:</Text>
            <TextInput
              value={emailInput}
              onChangeText={setEmailInput}
              placeholder="Enter email address"
              placeholderTextColor={colors.mutedForeground}
              style={[
                styles.emailInput,
                { borderColor: colors.border, color: colors.foreground },
              ]}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <Text style={styles.dialogNote}>
              Includes all analytics data for {selectedYear}.
            </Text>
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

      <Modal visible={showDownloadDialog} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.dialogModal, { backgroundColor: colors.card }]}>
            <Text style={[styles.dialogTitle, { color: colors.foreground }]}>
              Download PDF Report
            </Text>
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
  container: { flex: 1, backgroundColor: "#F5F5DC" },
  header: {
    backgroundColor: "#16a34a",
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 24,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    position: "relative",
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
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: { fontSize: 20, fontWeight: "600", color: "#ffffff" },
  headerSubtitle: { fontSize: 14, color: "#bbf7d0" },
  yearSelector: { marginBottom: 16, position: "relative" },
  yearLabel: { fontSize: 14, color: "#bbf7d0", marginBottom: 8 },
  yearButton: {
    backgroundColor: "rgba(255,255,255,0.1)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  yearButtonText: { color: "#ffffff", fontSize: 16, fontWeight: "500" },
  dropdownMenu: {
    position: "absolute",
    top: 70,
    left: 0,
    right: 0,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 10,
    overflow: "hidden",
    zIndex: 3000,
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  dropdownItemSelected: { backgroundColor: "#16a34a" },
  dropdownItemText: { fontSize: 16, color: "#111827" },
  dropdownItemTextSelected: { color: "#ffffff", fontWeight: "600" },
  exportButtons: { flexDirection: "row", gap: 12 },
  exportButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 12,
    paddingVertical: 12,
  },
  exportButtonText: { color: "#ffffff", fontSize: 14, fontWeight: "500" },
  content: { flex: 1 },
  scrollContent: { padding: 24, paddingBottom: 140 },
  realDataBanner: {
    backgroundColor: "#dcfce7",
    borderWidth: 1,
    borderColor: "#86efac",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginBottom: 16,
  },
  realDataBannerText: { fontSize: 13, color: "#15803d" },
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
    width: 90,
    fontSize: 12,
    fontWeight: "600",
    color: "#A0826D",
    textAlign: "right",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
    paddingVertical: 8,
  },
  tableRowEven: { backgroundColor: "#f9fafb" },
  tableCell: { width: 90, fontSize: 12, color: "#6F4E37", textAlign: "right" },
  tableCellFirst: { textAlign: "left" },
  tableFooter: {
    flexDirection: "row",
    backgroundColor: "rgba(111,78,55,0.05)",
    paddingVertical: 8,
  },
  tableFooterCell: {
    width: 90,
    fontSize: 12,
    fontWeight: "600",
    color: "#6F4E37",
    textAlign: "right",
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
  predictionTitle: { fontSize: 16, fontWeight: "600", color: "#581c87" },
  predictionSubtitle: { fontSize: 14, color: "#7c3aed", marginBottom: 12 },
  predictionItem: { fontSize: 14, color: "#7c3aed", marginBottom: 6 },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  dialogModal: { width: "100%", maxWidth: 400, borderRadius: 16, padding: 24 },
  dialogTitle: { fontSize: 18, fontWeight: "600", marginBottom: 16 },
  dialogLabel: { fontSize: 14, color: "#6F4E37", marginBottom: 8 },
  emailInput: {
    height: 48,
    borderWidth: 2,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 14,
    marginBottom: 12,
    backgroundColor: "#ffffff",
  },
  input: {
    height: 48,
    borderWidth: 2,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 14,
    marginBottom: 8,
  },
  dialogNote: { fontSize: 12, color: "#A0826D", marginBottom: 20 },
  dialogFooter: { flexDirection: "row", gap: 12 },
  dialogButton: { flex: 1 },
  dialogButtonText: { color: "#ffffff", marginLeft: 8 },
});
