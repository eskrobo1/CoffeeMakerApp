import * as React from "react";
import {
  View,
  ScrollView,
  Dimensions,
  StyleSheet,
  ViewStyle,
  TouchableOpacity,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";
import { ArrowLeft, ArrowRight } from "lucide-react-native";

interface CarouselContextProps {
  orientation: "horizontal" | "vertical";
  scrollToIndex: (index: number) => void;
  currentIndex: number;
  canScrollPrev: boolean;
  canScrollNext: boolean;
  itemCount: number;
}

const CarouselContext = React.createContext<CarouselContextProps | null>(null);

function useCarousel() {
  const context = React.useContext(CarouselContext);
  if (!context) {
    throw new Error("useCarousel must be used within a <Carousel />");
  }
  return context;
}

interface CarouselProps {
  orientation?: "horizontal" | "vertical";
  children: React.ReactNode;
  style?: ViewStyle;
  onIndexChange?: (index: number) => void;
}

export function Carousel({
  orientation = "horizontal",
  children,
  style,
  onIndexChange,
}: CarouselProps) {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const scrollViewRef = React.useRef<ScrollView>(null);
  const { width, height } = Dimensions.get("window");

  const childArray = React.Children.toArray(children);
  const itemCount = childArray.length;

  const canScrollPrev = currentIndex > 0;
  const canScrollNext = currentIndex < itemCount - 1;

  const scrollToIndex = (index: number) => {
    if (index < 0 || index >= itemCount) return;

    const offset =
      orientation === "horizontal" ? width * index : height * index;
    scrollViewRef.current?.scrollTo({
      x: orientation === "horizontal" ? offset : 0,
      y: orientation === "vertical" ? offset : 0,
      animated: true,
    });
    setCurrentIndex(index);
    onIndexChange?.(index);
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offset =
      orientation === "horizontal"
        ? event.nativeEvent.contentOffset.x
        : event.nativeEvent.contentOffset.y;
    const index = Math.round(
      offset / (orientation === "horizontal" ? width : height)
    );
    if (index !== currentIndex) {
      setCurrentIndex(index);
      onIndexChange?.(index);
    }
  };

  return (
    <CarouselContext.Provider
      value={{
        orientation,
        scrollToIndex,
        currentIndex,
        canScrollPrev,
        canScrollNext,
        itemCount,
      }}
    >
      <View style={[styles.carousel, style]}>{children}</View>
    </CarouselContext.Provider>
  );
}

interface CarouselContentProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export function CarouselContent({ children, style }: CarouselContentProps) {
  const { orientation } = useCarousel();
  const scrollViewRef = React.useRef<ScrollView>(null);
  const { width, height } = Dimensions.get("window");

  return (
    <ScrollView
      ref={scrollViewRef}
      horizontal={orientation === "horizontal"}
      pagingEnabled
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
      style={[styles.carouselContent, style]}
      contentContainerStyle={
        orientation === "horizontal"
          ? styles.horizontalContainer
          : styles.verticalContainer
      }
    >
      {children}
    </ScrollView>
  );
}

interface CarouselItemProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export function CarouselItem({ children, style }: CarouselItemProps) {
  const { width, height } = Dimensions.get("window");
  const { orientation } = useCarousel();

  return (
    <View
      style={[
        styles.carouselItem,
        {
          width: orientation === "horizontal" ? width : "100%",
          height: orientation === "vertical" ? height : "auto",
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

interface CarouselPreviousProps {
  style?: ViewStyle;
}

export function CarouselPrevious({ style }: CarouselPreviousProps) {
  const { scrollToIndex, currentIndex, canScrollPrev, orientation } =
    useCarousel();

  return (
    <TouchableOpacity
      style={[
        styles.navButton,
        styles.previousButton,
        orientation === "vertical" && styles.previousButtonVertical,
        !canScrollPrev && styles.navButtonDisabled,
        style,
      ]}
      onPress={() => scrollToIndex(currentIndex - 1)}
      disabled={!canScrollPrev}
      activeOpacity={0.7}
    >
      <ArrowLeft size={20} color={canScrollPrev ? "#000000" : "#9CA3AF"} />
    </TouchableOpacity>
  );
}

interface CarouselNextProps {
  style?: ViewStyle;
}

export function CarouselNext({ style }: CarouselNextProps) {
  const { scrollToIndex, currentIndex, canScrollNext, orientation } =
    useCarousel();

  return (
    <TouchableOpacity
      style={[
        styles.navButton,
        styles.nextButton,
        orientation === "vertical" && styles.nextButtonVertical,
        !canScrollNext && styles.navButtonDisabled,
        style,
      ]}
      onPress={() => scrollToIndex(currentIndex + 1)}
      disabled={!canScrollNext}
      activeOpacity={0.7}
    >
      <ArrowRight size={20} color={canScrollNext ? "#000000" : "#9CA3AF"} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  carousel: {
    position: "relative",
    width: "100%",
  },
  carouselContent: {
    overflow: "hidden",
  },
  horizontalContainer: {
    flexDirection: "row",
  },
  verticalContainer: {
    flexDirection: "column",
  },
  carouselItem: {
    justifyContent: "center",
    alignItems: "center",
  },
  navButton: {
    position: "absolute",
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  previousButton: {
    top: "50%",
    left: -48,
    transform: [{ translateY: -16 }],
  },
  nextButton: {
    top: "50%",
    right: -48,
    transform: [{ translateY: -16 }],
  },
  previousButtonVertical: {
    top: -48,
    left: "50%",
    transform: [{ translateX: -16 }, { rotate: "90deg" }],
  },
  nextButtonVertical: {
    bottom: -48,
    left: "50%",
    transform: [{ translateX: -16 }, { rotate: "90deg" }],
  },
  navButtonDisabled: {
    opacity: 0.5,
  },
});
