import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
} from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
  Animated,
  useWindowDimensions,
  Platform,
  StyleSheet,
} from "react-native";
import { PanelLeft } from "lucide-react-native";

const SIDEBAR_WIDTH = 256; // 16rem = 256px
const SIDEBAR_WIDTH_MOBILE = 288; // 18rem = 288px
const SIDEBAR_WIDTH_ICON = 48; // 3rem = 48px

type SidebarContextProps = {
  state: "expanded" | "collapsed";
  open: boolean;
  setOpen: (open: boolean) => void;
  openMobile: boolean;
  setOpenMobile: (open: boolean) => void;
  isMobile: boolean;
  toggleSidebar: () => void;
};

const SidebarContext = createContext<SidebarContextProps | null>(null);

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider.");
  }
  return context;
}

interface SidebarProviderProps {
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

export function SidebarProvider({
  defaultOpen = true,
  open: openProp,
  onOpenChange: setOpenProp,
  children,
}: SidebarProviderProps) {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const [openMobile, setOpenMobile] = useState(false);
  const [_open, _setOpen] = useState(defaultOpen);

  const open = openProp ?? _open;
  const setOpen = useCallback(
    (value: boolean | ((value: boolean) => boolean)) => {
      const openState = typeof value === "function" ? value(open) : value;
      if (setOpenProp) {
        setOpenProp(openState);
      } else {
        _setOpen(openState);
      }
    },
    [setOpenProp, open]
  );

  const toggleSidebar = useCallback(() => {
    return isMobile ? setOpenMobile((open) => !open) : setOpen((open) => !open);
  }, [isMobile, setOpen, setOpenMobile]);

  const state = open ? "expanded" : "collapsed";

  const contextValue = useMemo<SidebarContextProps>(
    () => ({
      state,
      open,
      setOpen,
      isMobile,
      openMobile,
      setOpenMobile,
      toggleSidebar,
    }),
    [state, open, setOpen, isMobile, openMobile, setOpenMobile, toggleSidebar]
  );

  return (
    <SidebarContext.Provider value={contextValue}>
      <View style={styles.wrapper}>{children}</View>
    </SidebarContext.Provider>
  );
}

interface SidebarProps {
  side?: "left" | "right";
  collapsible?: "offcanvas" | "icon" | "none";
  children: React.ReactNode;
  style?: any;
}

export function Sidebar({
  side = "left",
  collapsible = "offcanvas",
  children,
  style,
}: SidebarProps) {
  const { isMobile, state, openMobile, setOpenMobile } = useSidebar();

  if (isMobile) {
    return (
      <Modal
        visible={openMobile}
        onRequestClose={() => setOpenMobile(false)}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={styles.modalBackdrop}
            activeOpacity={1}
            onPress={() => setOpenMobile(false)}
          />
          <View
            style={[
              styles.sidebarMobile,
              side === "left" ? styles.sidebarLeft : styles.sidebarRight,
            ]}
          >
            {children}
          </View>
        </View>
      </Modal>
    );
  }

  if (collapsible === "none") {
    return <View style={[styles.sidebar, style]}>{children}</View>;
  }

  const sidebarWidth =
    state === "collapsed" && collapsible === "icon"
      ? SIDEBAR_WIDTH_ICON
      : SIDEBAR_WIDTH;

  return (
    <View style={[styles.sidebar, { width: sidebarWidth }, style]}>
      {children}
    </View>
  );
}

export function SidebarTrigger({ onPress, style }: any) {
  const { toggleSidebar } = useSidebar();

  return (
    <TouchableOpacity
      style={[styles.trigger, style]}
      onPress={(e) => {
        onPress?.(e);
        toggleSidebar();
      }}
    >
      <PanelLeft size={20} color="#000" />
    </TouchableOpacity>
  );
}

export function SidebarHeader({ children, style }: any) {
  return <View style={[styles.header, style]}>{children}</View>;
}

export function SidebarFooter({ children, style }: any) {
  return <View style={[styles.footer, style]}>{children}</View>;
}

export function SidebarContent({ children, style }: any) {
  return (
    <ScrollView
      style={[styles.content, style]}
      showsVerticalScrollIndicator={false}
    >
      {children}
    </ScrollView>
  );
}

export function SidebarGroup({ children, style }: any) {
  return <View style={[styles.group, style]}>{children}</View>;
}

export function SidebarGroupLabel({ children, style }: any) {
  return (
    <View style={[styles.groupLabel, style]}>
      {typeof children === "string" ? (
        <Text style={styles.groupLabelText}>{children}</Text>
      ) : (
        children
      )}
    </View>
  );
}

export function SidebarGroupContent({ children, style }: any) {
  return <View style={[styles.groupContent, style]}>{children}</View>;
}

export function SidebarMenu({ children, style }: any) {
  return <View style={[styles.menu, style]}>{children}</View>;
}

export function SidebarMenuItem({ children, style }: any) {
  return <View style={[styles.menuItem, style]}>{children}</View>;
}

export function SidebarMenuButton({
  children,
  onPress,
  isActive = false,
  style,
}: any) {
  return (
    <TouchableOpacity
      style={[styles.menuButton, isActive && styles.menuButtonActive, style]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {typeof children === "string" ? (
        <Text
          style={[
            styles.menuButtonText,
            isActive && styles.menuButtonTextActive,
          ]}
        >
          {children}
        </Text>
      ) : (
        children
      )}
    </TouchableOpacity>
  );
}

export function SidebarMenuSub({ children, style }: any) {
  return <View style={[styles.menuSub, style]}>{children}</View>;
}

export function SidebarMenuSubItem({ children, style }: any) {
  return <View style={[styles.menuSubItem, style]}>{children}</View>;
}

export function SidebarMenuSubButton({
  children,
  onPress,
  isActive = false,
  style,
}: any) {
  return (
    <TouchableOpacity
      style={[
        styles.menuSubButton,
        isActive && styles.menuSubButtonActive,
        style,
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {typeof children === "string" ? (
        <Text
          style={[
            styles.menuSubButtonText,
            isActive && styles.menuSubButtonTextActive,
          ]}
        >
          {children}
        </Text>
      ) : (
        children
      )}
    </TouchableOpacity>
  );
}

export function SidebarSeparator({ style }: any) {
  return <View style={[styles.separator, style]} />;
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    flexDirection: "row",
  },
  sidebar: {
    width: SIDEBAR_WIDTH,
    backgroundColor: "#f8f9fa",
    borderRightWidth: 1,
    borderRightColor: "#e5e7eb",
  },
  sidebarMobile: {
    width: SIDEBAR_WIDTH_MOBILE,
    height: "100%",
    backgroundColor: "#f8f9fa",
  },
  sidebarLeft: {
    position: "absolute",
    left: 0,
  },
  sidebarRight: {
    position: "absolute",
    right: 0,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalBackdrop: {
    flex: 1,
  },
  trigger: {
    width: 28,
    height: 28,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
  },
  header: {
    padding: 8,
    gap: 8,
  },
  footer: {
    padding: 8,
    gap: 8,
  },
  content: {
    flex: 1,
  },
  group: {
    padding: 8,
  },
  groupLabel: {
    height: 32,
    paddingHorizontal: 8,
    justifyContent: "center",
  },
  groupLabelText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#6b7280",
  },
  groupContent: {
    width: "100%",
  },
  menu: {
    gap: 4,
  },
  menuItem: {
    position: "relative",
  },
  menuButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 8,
    borderRadius: 6,
  },
  menuButtonActive: {
    backgroundColor: "#f3f4f6",
  },
  menuButtonText: {
    fontSize: 14,
    color: "#374151",
  },
  menuButtonTextActive: {
    fontWeight: "500",
    color: "#111827",
  },
  menuSub: {
    marginLeft: 14,
    paddingLeft: 10,
    borderLeftWidth: 1,
    borderLeftColor: "#e5e7eb",
    gap: 4,
  },
  menuSubItem: {
    position: "relative",
  },
  menuSubButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    height: 28,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  menuSubButtonActive: {
    backgroundColor: "#f3f4f6",
  },
  menuSubButtonText: {
    fontSize: 14,
    color: "#374151",
  },
  menuSubButtonTextActive: {
    fontWeight: "500",
    color: "#111827",
  },
  separator: {
    height: 1,
    backgroundColor: "#e5e7eb",
    marginHorizontal: 8,
  },
});
