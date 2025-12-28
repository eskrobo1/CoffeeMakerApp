import React from "react";
import { View, StyleSheet, ViewStyle } from "react-native";
import Slider from "@react-native-community/slider";

interface SliderProps {
  value: number[];
  onValueChange: (value: number[]) => void;
  max?: number;
  min?: number;
  step?: number;
  style?: ViewStyle;
  disabled?: boolean;
}

export function CustomSlider({
  value = [0],
  onValueChange,
  max = 100,
  min = 0,
  step = 1,
  style,
  disabled = false,
}: SliderProps) {
  const handleValueChange = (val: number) => {
    onValueChange([val]);
  };

  return (
    <View style={[styles.container, style]}>
      <Slider
        value={value[0]}
        onValueChange={handleValueChange}
        minimumValue={min}
        maximumValue={max}
        step={step}
        disabled={disabled}
        minimumTrackTintColor="#D97706"
        maximumTrackTintColor="#e5e7eb"
        thumbTintColor="#D97706"
        style={styles.slider}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    justifyContent: "center",
  },
  slider: {
    width: "100%",
    height: 40,
  },
});

export { CustomSlider as Slider };
