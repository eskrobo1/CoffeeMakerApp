// components/ui/AppSlider.tsx
// Čisti JS slider — radi u svim Android release buildovima.
// Koristi gestureState.dx (relativni pomak) umjesto locationX koji uzrokuje flickering.
import React, { useRef, useState } from "react";
import {
  View,
  PanResponder,
  StyleSheet,
  StyleProp,
  ViewStyle,
  ColorValue,
  GestureResponderEvent,
  PanResponderGestureState,
} from "react-native";

interface AppSliderProps {
  value: number;
  onValueChange: (value: number) => void;
  minimumValue?: number;
  maximumValue?: number;
  step?: number;
  minimumTrackTintColor?: ColorValue;
  maximumTrackTintColor?: ColorValue;
  thumbTintColor?: ColorValue;
  style?: StyleProp<ViewStyle>;
}

const THUMB_R = 13;

export function AppSlider({
  value,
  onValueChange,
  minimumValue = 0,
  maximumValue = 100,
  step = 0,
  minimumTrackTintColor = "#000000",
  maximumTrackTintColor = "#e5e7eb",
  thumbTintColor = "#000000",
  style,
}: AppSliderProps) {
  const [trackWidth, setTrackWidth] = useState(1);

  // Refovi — izbjegavaju stale closure u PanResponder
  const trackWidthRef = useRef(1);
  const minRef = useRef(minimumValue);
  const maxRef = useRef(maximumValue);
  const stepRef = useRef(step);
  const cbRef = useRef(onValueChange);
  // Trenutna vrijednost i početna vrijednost geste — ključ za fix flickeringa
  const currentValueRef = useRef(value);
  const startValueRef = useRef(value);

  // Sinkroniziraj refove sa prop-ovima
  minRef.current = minimumValue;
  maxRef.current = maximumValue;
  stepRef.current = step;
  cbRef.current = onValueChange;
  currentValueRef.current = value;

  const range = Math.max(1, maximumValue - minimumValue);
  const ratio = Math.max(0, Math.min(1, (value - minimumValue) / range));
  const usableWidth = Math.max(0, trackWidth - THUMB_R * 2);
  const fillWidth = ratio * usableWidth;
  const thumbLeft = ratio * usableWidth;

  const clamp = (v: number): number => {
    const s = stepRef.current;
    if (s > 0) v = Math.round(v / s) * s;
    return Math.max(minRef.current, Math.min(maxRef.current, v));
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onStartShouldSetPanResponderCapture: () => true,
      onMoveShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponderCapture: () => true,

      // ── Grant: samo zapamti početnu vrijednost, NE mijenjaj slider ───────
      // Problem s locationX: mjeri se relativno na touched View (thumb),
      // ne na container, pa bi skok na 0 (početak thumba) uzrokovao flickering.
      onPanResponderGrant: (_e: GestureResponderEvent) => {
        startValueRef.current = currentValueRef.current;
      },

      // ── Move: koristi gs.dx (relativni pomak prsta od starta geste) ──────
      // gs.dx uvijek mjeri pomak od mjesta gdje je prst pritisnuo,
      // pa nema flickeringa i slider se pokreće s trenutne pozicije.
      onPanResponderMove: (
        _e: GestureResponderEvent,
        gs: PanResponderGestureState,
      ) => {
        const uw = Math.max(1, trackWidthRef.current - THUMB_R * 2);
        const deltaRatio = gs.dx / uw;
        const deltaValue = deltaRatio * (maxRef.current - minRef.current);
        const newValue = clamp(startValueRef.current + deltaValue);
        cbRef.current(newValue);
      },
    }),
  ).current;

  return (
    <View
      style={[styles.container, style]}
      onLayout={(e) => {
        const w = e.nativeEvent.layout.width;
        trackWidthRef.current = w;
        setTrackWidth(w);
      }}
      {...panResponder.panHandlers}
    >
      {/* Track pozadina */}
      <View
        style={[
          styles.track,
          { backgroundColor: maximumTrackTintColor as string },
        ]}
      >
        {/* Ispunjeni dio — numerička širina u pikselima */}
        <View
          style={[
            styles.trackFill,
            {
              backgroundColor: minimumTrackTintColor as string,
              width: fillWidth,
            },
          ]}
        />
      </View>

      {/* Thumb */}
      {trackWidth > 1 && (
        <View
          style={[
            styles.thumb,
            {
              left: thumbLeft,
              backgroundColor: thumbTintColor as string,
              borderColor: thumbTintColor as string,
            },
          ]}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 40,
    justifyContent: "center",
    paddingHorizontal: THUMB_R,
  },
  track: {
    height: 4,
    borderRadius: 2,
    overflow: "hidden",
  },
  trackFill: {
    height: 4,
    borderRadius: 2,
  },
  thumb: {
    position: "absolute",
    width: THUMB_R * 2,
    height: THUMB_R * 2,
    borderRadius: THUMB_R,
    borderWidth: 2,
    top: 7,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    backgroundColor: "#fff",
  },
});
