import * as React from "react";
import {
  View,
  Image,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ImageStyle,
} from "react-native";

interface AvatarProps {
  children: React.ReactNode;
  style?: ViewStyle;
  size?: number;
}

interface AvatarContextValue {
  size: number;
  imageLoaded: boolean;
  setImageLoaded: (loaded: boolean) => void;
}

const AvatarContext = React.createContext<AvatarContextValue | null>(null);

export function Avatar({ children, style, size = 40 }: AvatarProps) {
  const [imageLoaded, setImageLoaded] = React.useState(false);

  return (
    <AvatarContext.Provider value={{ size, imageLoaded, setImageLoaded }}>
      <View
        style={[
          styles.avatar,
          { width: size, height: size, borderRadius: size / 2 },
          style,
        ]}
      >
        {children}
      </View>
    </AvatarContext.Provider>
  );
}

interface AvatarImageProps {
  source: { uri: string } | number;
  alt?: string;
  style?: ImageStyle;
}

export function AvatarImage({ source, alt, style }: AvatarImageProps) {
  const context = React.useContext(AvatarContext);

  if (!context) {
    throw new Error("AvatarImage must be used within Avatar");
  }

  return (
    <Image
      source={source}
      style={[
        styles.avatarImage,
        {
          width: context.size,
          height: context.size,
          borderRadius: context.size / 2,
        },
        style,
      ]}
      accessibilityLabel={alt}
      onLoad={() => context.setImageLoaded(true)}
      onError={() => context.setImageLoaded(false)}
    />
  );
}

interface AvatarFallbackProps {
  children: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export function AvatarFallback({
  children,
  style,
  textStyle,
}: AvatarFallbackProps) {
  const context = React.useContext(AvatarContext);

  if (!context) {
    throw new Error("AvatarFallback must be used within Avatar");
  }

  // Only show fallback if image hasn't loaded
  if (context.imageLoaded) {
    return null;
  }

  return (
    <View
      style={[
        styles.avatarFallback,
        {
          width: context.size,
          height: context.size,
          borderRadius: context.size / 2,
        },
        style,
      ]}
    >
      {typeof children === "string" ? (
        <Text
          style={[
            styles.avatarFallbackText,
            { fontSize: context.size * 0.4 },
            textStyle,
          ]}
        >
          {children}
        </Text>
      ) : (
        children
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    position: "relative",
    overflow: "hidden",
  },
  avatarImage: {
    width: "100%",
    height: "100%",
  },
  avatarFallback: {
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    top: 0,
    left: 0,
  },
  avatarFallbackText: {
    fontWeight: "500",
    color: "#6B7280",
  },
});
