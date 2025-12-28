import * as React from "react";
import { View, Text, StyleSheet, ViewStyle, Dimensions } from "react-native";
import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph,
  StackedBarChart,
} from "react-native-chart-kit";

export type ChartConfig = {
  [k in string]: {
    label?: React.ReactNode;
    icon?: React.ComponentType;
    color?: string;
  };
};

type ChartContextProps = {
  config: ChartConfig;
};

const ChartContext = React.createContext<ChartContextProps | null>(null);

function useChart() {
  const context = React.useContext(ChartContext);
  if (!context) {
    throw new Error("useChart must be used within a <ChartContainer />");
  }
  return context;
}

interface ChartContainerProps {
  config: ChartConfig;
  children: React.ReactNode;
  style?: ViewStyle;
}

export function ChartContainer({
  config,
  children,
  style,
}: ChartContainerProps) {
  return (
    <ChartContext.Provider value={{ config }}>
      <View style={[styles.chartContainer, style]}>{children}</View>
    </ChartContext.Provider>
  );
}

interface ChartTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
  style?: ViewStyle;
}

export function ChartTooltip({
  active,
  payload,
  label,
  style,
}: ChartTooltipProps) {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  return (
    <View style={[styles.tooltip, style]}>
      {label && <Text style={styles.tooltipLabel}>{label}</Text>}
      {payload.map((entry, index) => (
        <View key={index} style={styles.tooltipItem}>
          <View
            style={[styles.tooltipIndicator, { backgroundColor: entry.color }]}
          />
          <Text style={styles.tooltipText}>
            {entry.name}: {entry.value}
          </Text>
        </View>
      ))}
    </View>
  );
}

interface ChartTooltipContentProps {
  active?: boolean;
  payload?: any[];
  label?: string;
  hideLabel?: boolean;
  hideIndicator?: boolean;
  indicator?: "line" | "dot" | "dashed";
  style?: ViewStyle;
}

export function ChartTooltipContent({
  active,
  payload,
  label,
  hideLabel = false,
  hideIndicator = false,
  indicator = "dot",
  style,
}: ChartTooltipContentProps) {
  const { config } = useChart();

  if (!active || !payload || payload.length === 0) {
    return null;
  }

  return (
    <View style={[styles.tooltipContent, style]}>
      {!hideLabel && label && (
        <Text style={styles.tooltipContentLabel}>{label}</Text>
      )}
      <View style={styles.tooltipContentItems}>
        {payload.map((item, index) => {
          const itemConfig = config[item.dataKey] || {};
          return (
            <View key={index} style={styles.tooltipContentItem}>
              {!hideIndicator && (
                <View
                  style={[
                    styles.tooltipContentIndicator,
                    indicator === "dot" && styles.indicatorDot,
                    indicator === "line" && styles.indicatorLine,
                    indicator === "dashed" && styles.indicatorDashed,
                    { backgroundColor: item.color },
                  ]}
                />
              )}
              <View style={styles.tooltipContentTextContainer}>
                <Text style={styles.tooltipContentName}>
                  {itemConfig.label || item.name}
                </Text>
                <Text style={styles.tooltipContentValue}>
                  {item.value?.toLocaleString()}
                </Text>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}

interface ChartLegendProps {
  payload?: any[];
  style?: ViewStyle;
}

export function ChartLegend({ payload, style }: ChartLegendProps) {
  if (!payload || payload.length === 0) {
    return null;
  }

  return (
    <View style={[styles.legend, style]}>
      {payload.map((entry, index) => (
        <View key={index} style={styles.legendItem}>
          <View
            style={[styles.legendIndicator, { backgroundColor: entry.color }]}
          />
          <Text style={styles.legendText}>{entry.value}</Text>
        </View>
      ))}
    </View>
  );
}

interface ChartLegendContentProps {
  payload?: any[];
  hideIcon?: boolean;
  verticalAlign?: "top" | "bottom";
  nameKey?: string;
  style?: ViewStyle;
}

export function ChartLegendContent({
  payload,
  hideIcon = false,
  verticalAlign = "bottom",
  nameKey,
  style,
}: ChartLegendContentProps) {
  const { config } = useChart();

  if (!payload || payload.length === 0) {
    return null;
  }

  return (
    <View
      style={[
        styles.legendContent,
        verticalAlign === "top" ? styles.legendTop : styles.legendBottom,
        style,
      ]}
    >
      {payload.map((item, index) => {
        const key = nameKey || item.dataKey || "value";
        const itemConfig = config[key] || {};

        return (
          <View key={index} style={styles.legendContentItem}>
            {!hideIcon && (
              <View
                style={[
                  styles.legendContentIndicator,
                  { backgroundColor: item.color },
                ]}
              />
            )}
            <Text style={styles.legendContentText}>
              {itemConfig.label || item.value}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

// Chart configuration helper
export const chartConfig = {
  backgroundGradientFrom: "#FFFFFF",
  backgroundGradientTo: "#FFFFFF",
  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  strokeWidth: 2,
  barPercentage: 0.5,
  useShadowColorFromDataset: false,
  decimalPlaces: 0,
  propsForLabels: {
    fontSize: 12,
    fontFamily: "System",
  },
  propsForDots: {
    r: "4",
    strokeWidth: "2",
  },
};

const styles = StyleSheet.create({
  chartContainer: {
    width: "100%",
    aspectRatio: 16 / 9,
    justifyContent: "center",
    alignItems: "center",
  },
  tooltip: {
    backgroundColor: "#FFFFFF",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  tooltipLabel: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 8,
  },
  tooltipItem: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 4,
  },
  tooltipIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  tooltipText: {
    fontSize: 12,
    color: "#6B7280",
  },
  tooltipContent: {
    backgroundColor: "#FFFFFF",
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    minWidth: 128,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  tooltipContentLabel: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 6,
  },
  tooltipContentItems: {
    gap: 6,
  },
  tooltipContentItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  tooltipContentIndicator: {
    width: 10,
    height: 10,
    borderRadius: 2,
  },
  indicatorDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  indicatorLine: {
    width: 4,
    height: 10,
    borderRadius: 2,
  },
  indicatorDashed: {
    width: 0,
    height: 10,
    borderWidth: 1.5,
    borderStyle: "dashed",
  },
  tooltipContentTextContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  tooltipContentName: {
    fontSize: 12,
    color: "#6B7280",
  },
  tooltipContentValue: {
    fontSize: 12,
    fontWeight: "500",
    fontFamily: "monospace",
  },
  legend: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 16,
    paddingVertical: 12,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  legendIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 12,
    color: "#6B7280",
  },
  legendContent: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },
  legendTop: {
    paddingBottom: 12,
  },
  legendBottom: {
    paddingTop: 12,
  },
  legendContentItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  legendContentIndicator: {
    width: 8,
    height: 8,
    borderRadius: 2,
  },
  legendContentText: {
    fontSize: 12,
    color: "#6B7280",
  },
});
