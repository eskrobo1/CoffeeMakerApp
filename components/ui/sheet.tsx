import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  View,
  Text,
  Pressable,
  Modal,
  StyleSheet,
  Animated,
  Dimensions,
} from "react-native";
import { X } from "lucide-react-native";

/* ---------------- Types ---------------- */

type Side = "top" | "right" | "bottom" | "left";

interface SheetContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  side: Side;
}

const SheetContext = createContext<SheetContextValue | null>(null);

/* ---------------- Constants ---------------- */

const SCREEN = Dimensions.get("window");
const PANEL_WIDTH = SCREEN.width * 0.75;
const PANEL_HEIGHT = SCREEN.height * 0.5;

/* ---------------- Sheet ---------------- */

interface SheetProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  side?: Side;
  children: React.ReactNode;
}

export function Sheet({
  open: controlledOpen,
  onOpenChange,
  side = "right",
  children,
}: SheetProps) {
  const [internalOpen, setInternalOpen] = useState(false);

  const open = controlledOpen ?? internalOpen;
  const setOpen = onOpenChange ?? setInternalOpen;

  return (
    <SheetContext.Provider value={{ open, setOpen, side }}>
      {children}
    </SheetContext.Provider>
  );
}

/* ---------------- Trigger ---------------- */

export function SheetTrigger({ children }: { children: React.ReactNode }) {
  const ctx = useContext(SheetContext);
  if (!ctx) throw new Error("SheetTrigger must be used inside Sheet");

  return <Pressable onPress={() => ctx.setOpen(true)}>{children}</Pressable>;
}

/* ---------------- Close ---------------- */

export function SheetClose({ children }: { children?: React.ReactNode }) {
  const ctx = useContext(SheetContext);
  if (!ctx) throw new Error("SheetClose must be used inside Sheet");

  return <Pressable onPress={() => ctx.setOpen(false)}>{children}</Pressable>;
}

/* ---------------- Content ---------------- */

interface SheetContentProps {
  children: React.ReactNode;
}

export function SheetContent({ children }: SheetContentProps) {
  const ctx = useContext(SheetContext);
  if (!ctx) throw new Error("SheetContent must be used inside Sheet");

  const { open, setOpen, side } = ctx;
  const translate = useRef(new Animated.Value(0)).current;

  const hiddenPosition = () => {
    switch (side) {
      case "left":
        return -PANEL_WIDTH;
      case "right":
        return PANEL_WIDTH;
      case "top":
        return -PANEL_HEIGHT;
      case "bottom":
        return PANEL_HEIGHT;
    }
  };

  useEffect(() => {
    translate.setValue(open ? hiddenPosition() : 0);

    Animated.timing(translate, {
      toValue: open ? 0 : hiddenPosition(),
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [open, side]);

  const animatedStyle =
    side === "left" || side === "right"
      ? { transform: [{ translateX: translate }] }
      : { transform: [{ translateY: translate }] };

  return (
    <Modal visible={open} transparent animationType="none">
      <Pressable style={styles.overlay} onPress={() => setOpen(false)} />

      <Animated.View style={[styles.sheet, sideStyles[side], animatedStyle]}>
        <Pressable style={styles.close} onPress={() => setOpen(false)}>
          <X size={16} />
        </Pressable>

        {children}
      </Animated.View>
    </Modal>
  );
}

/* ---------------- Layout helpers ---------------- */

export function SheetHeader({ children }: { children: React.ReactNode }) {
  return <View style={styles.header}>{children}</View>;
}

export function SheetFooter({ children }: { children: React.ReactNode }) {
  return <View style={styles.footer}>{children}</View>;
}

export function SheetTitle({ children }: { children: React.ReactNode }) {
  return <Text style={styles.title}>{children}</Text>;
}

export function SheetDescription({ children }: { children: React.ReactNode }) {
  return <Text style={styles.description}>{children}</Text>;
}

/* ---------------- Styles ---------------- */

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  sheet: {
    position: "absolute",
    backgroundColor: "#FFFFFF",
    paddingTop: 24,
    paddingHorizontal: 16,
    elevation: 10,
  },
  close: {
    position: "absolute",
    top: 12,
    right: 12,
    padding: 6,
  },
  header: {
    paddingBottom: 12,
    gap: 4,
  },
  footer: {
    marginTop: "auto",
    paddingVertical: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  description: {
    fontSize: 14,
    color: "#6B7280",
  },
});

const sideStyles: Record<Side, any> = {
  right: {
    right: 0,
    top: 0,
    bottom: 0,
    width: PANEL_WIDTH,
  },
  left: {
    left: 0,
    top: 0,
    bottom: 0,
    width: PANEL_WIDTH,
  },
  bottom: {
    left: 0,
    right: 0,
    bottom: 0,
    height: PANEL_HEIGHT,
  },
  top: {
    left: 0,
    right: 0,
    top: 0,
    height: PANEL_HEIGHT,
  },
};
