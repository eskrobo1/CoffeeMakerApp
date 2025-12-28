import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ViewStyle,
  TextStyle,
  Animated,
  Dimensions,
} from "react-native";

interface TooltipProps {
  content: string | React.ReactNode;
  children: React.ReactNode;
  placement?: "top" | "bottom" | "left" | "right";
  delayDuration?: number;
  style?: ViewStyle;
  contentStyle?: ViewStyle;
  textStyle?: TextStyle;
}

export function Tooltip({
  content,
  children,
  placement = "top",
  delayDuration = 0,
  style,
  contentStyle,
  textStyle,
}: TooltipProps) {
  const [visible, setVisible] = useState(false);
  const [tooltipLayout, setTooltipLayout] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const triggerRef = useRef<View>(null);

  const showTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      triggerRef.current?.measure((x, y, width, height, pageX, pageY) => {
        setTooltipLayout({ x: pageX, y: pageY, width, height });
        setVisible(true);

        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 150,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 150,
            useNativeDriver: true,
          }),
        ]).start();
      });
    }, delayDuration);
  };

  const hideTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setVisible(false);
    });
  };

  const getTooltipPosition = () => {
    const { width: screenWidth, height: screenHeight } =
      Dimensions.get("window");
    const tooltipWidth = 200; // Aproksimativna širina
    const tooltipHeight = 40; // Aproksimativna visina
    const offset = 8;

    let top = 0;
    let left = 0;

    switch (placement) {
      case "top":
        top = tooltipLayout.y - tooltipHeight - offset;
        left = tooltipLayout.x + tooltipLayout.width / 2 - tooltipWidth / 2;
        break;
      case "bottom":
        top = tooltipLayout.y + tooltipLayout.height + offset;
        left = tooltipLayout.x + tooltipLayout.width / 2 - tooltipWidth / 2;
        break;
      case "left":
        top = tooltipLayout.y + tooltipLayout.height / 2 - tooltipHeight / 2;
        left = tooltipLayout.x - tooltipWidth - offset;
        break;
      case "right":
        top = tooltipLayout.y + tooltipLayout.height / 2 - tooltipHeight / 2;
        left = tooltipLayout.x + tooltipLayout.width + offset;
        break;
    }

    // Osiguravanje da tooltip ne izlazi van ekrana
    if (left < 10) left = 10;
    if (left + tooltipWidth > screenWidth - 10)
      left = screenWidth - tooltipWidth - 10;
    if (top < 10) top = 10;
    if (top + tooltipHeight > screenHeight - 10)
      top = screenHeight - tooltipHeight - 10;

    return { top, left };
  };

  return (
    <>
      <TouchableOpacity
        ref={triggerRef}
        onPressIn={showTooltip}
        onPressOut={hideTooltip}
        activeOpacity={1}
        style={style}
      >
        {children}
      </TouchableOpacity>

      {visible && (
        <Modal transparent visible={visible} animationType="none">
          <TouchableOpacity
            style={styles.overlay}
            activeOpacity={1}
            onPress={hideTooltip}
          >
            <Animated.View
              style={[
                styles.tooltipContainer,
                getTooltipPosition(),
                {
                  opacity: fadeAnim,
                  transform: [{ scale: scaleAnim }],
                },
                contentStyle,
              ]}
            >
              {typeof content === "string" ? (
                <Text style={[styles.tooltipText, textStyle]}>{content}</Text>
              ) : (
                content
              )}
            </Animated.View>
          </TouchableOpacity>
        </Modal>
      )}
    </>
  );
}

// Dummy komponente za API kompatibilnost
export function TooltipProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export function TooltipTrigger({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export function TooltipContent({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "transparent",
  },
  tooltipContainer: {
    position: "absolute",
    backgroundColor: "#111827",
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    maxWidth: 200,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  tooltipText: {
    color: "#ffffff",
    fontSize: 12,
    textAlign: "center",
  },
});
