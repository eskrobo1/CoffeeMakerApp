import React, { useEffect, useRef } from "react";
import { View, Animated, StyleSheet, ViewStyle } from "react-native";

interface SkeletonProps {
  style?: ViewStyle;
  width?: number | string;
  height?: number | string;
  borderRadius?: number;
}

export function Skeleton({
  style,
  width,
  height,
  borderRadius = 6,
}: SkeletonProps) {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );

    animation.start();

    return () => {
      animation.stop();
    };
  }, [opacity]);

  const dynamicStyle: ViewStyle = {};
  if (width !== undefined) dynamicStyle.width = width as any;
  if (height !== undefined) dynamicStyle.height = height as any;
  if (borderRadius !== undefined) dynamicStyle.borderRadius = borderRadius;

  return (
    <Animated.View
      style={[styles.skeleton, dynamicStyle, { opacity }, style]}
    />
  );
}

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: "#e5e7eb",
  },
});
