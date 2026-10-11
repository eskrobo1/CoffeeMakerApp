import React, { useEffect, useState, useRef } from "react";
import { View, Text, StyleSheet, Animated, Easing, Image } from "react-native";
import { Coffee, Clock, Users } from "lucide-react-native";
import { Progress } from "./ui/progress";
import { LinearGradient } from "expo-linear-gradient";

interface OrderProgressProps {
  drinkName: string;
  drinkId: string;
  onComplete: () => void;
}

// Mapa slika za svaki napitak
const drinkImages: { [key: string]: any } = {
  "caffe-latte": require("../assets/drinks/caffe-latte.png"),
  espresso: require("../assets/drinks/espresso.png"),
  ristretto: require("../assets/drinks/ristretto.png"),
  cortado: require("../assets/drinks/cortado.png"),
  "latte-macchiato": require("../assets/drinks/latte-macchiato.png"),
  coffee: require("../assets/drinks/coffee.png"),
  cappuccino: require("../assets/drinks/cappuccino.png"),
  "cold-brew-coffee": require("../assets/drinks/cold-brew-coffee.png"),
  "espresso-macchiato": require("../assets/drinks/espresso-macchiato.png"),
  "flat-white": require("../assets/drinks/flat-white.png"),
  americano: require("../assets/drinks/americano.png"),
  "lungo-barista": require("../assets/drinks/lungo-barista.png"),
  "sweet-latte": require("../assets/drinks/sweet-latte.png"),
  "espresso-doppio": require("../assets/drinks/espresso-doppio.png"),
  "hot-water": require("../assets/drinks/hot-water.png"),
  "portion-of-milk": require("../assets/drinks/portion-of-milk.png"),
  "portion-of-milk-foam": require("../assets/drinks/portion-of-milk-foam.png"),
  custom: require("../assets/drinks/espresso.png"), // fallback za custom
};

const drinkNames: Record<string, string> = {
  espresso: "Espresso",
  cappuccino: "Cappuccino",
  latte: "Latte",
  mocha: "Mocha",
  hotChocolate: "Hot Chocolate",
  custom: "Custom Drink",
};

export function OrderProgress({
  drinkName,
  drinkId,
  onComplete,
}: OrderProgressProps) {
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState("Grinding beans");
  const queuePosition = 0;
  const totalInQueue = 1;
  const estimatedTime = 45;

  // Animacija za pulsiranje slike napitka
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Pulse animacija
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );
    pulseAnimation.start();

    return () => {
      pulseAnimation.stop();
    };
  }, [pulseAnim]);

  useEffect(() => {
    const stages = [
      { name: "Grinding beans", duration: 2000 },
      { name: "Heating water", duration: 2000 },
      { name: "Brewing coffee", duration: 3000 },
      { name: "Adding milk", duration: 2000 },
      { name: "Finishing up", duration: 1000 },
    ];

    let currentProgress = 0;
    let currentStage = 0;

    const runStages = async () => {
      for (const s of stages) {
        setStage(s.name);
        const increment = 100 / stages.length;
        const steps = 20;
        const stepDuration = s.duration / steps;

        for (let i = 0; i < steps; i++) {
          await new Promise((resolve) => setTimeout(resolve, stepDuration));
          currentProgress += increment / steps;
          setProgress(Math.min(currentProgress, 100));
        }
        currentStage++;
      }

      setProgress(100);
      setStage("Complete!");
      setTimeout(onComplete, 1500);
    };

    runStages();
  }, [onComplete]);

  return (
    <LinearGradient colors={["#6F4E37", "#A0826D"]} style={styles.container}>
      <View style={styles.content}>
        {/* Drink Image Animation */}
        <Animated.View
          style={[
            styles.drinkImageContainer,
            {
              transform: [{ scale: pulseAnim }],
            },
          ]}
        >
          {drinkImages[drinkId] ? (
            <Image
              source={drinkImages[drinkId]}
              style={styles.drinkImage}
              resizeMode="contain"
            />
          ) : (
            <Coffee size={80} color="#ffffff" />
          )}
        </Animated.View>

        {/* Drink Name */}
        <Text style={styles.drinkName}>
          {drinkNames[drinkName] || drinkName}
        </Text>
        <Text style={styles.stage}>{stage}</Text>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <Progress
            value={progress}
            height={12}
            style={styles.progressTrack}
            barStyle={styles.progressIndicator}
          />
          <Text style={styles.progressText}>
            {Math.round(progress)}% Complete
          </Text>
        </View>

        {/* Queue Info */}
        <View style={styles.queueInfo}>
          <View style={styles.infoCard}>
            <View style={styles.iconCircle}>
              <Users size={20} color="#ffffff" />
            </View>
            <Text style={styles.infoLabel}>Queue Position</Text>
            <Text style={styles.infoValue}>
              {queuePosition + 1} of {totalInQueue}
            </Text>
          </View>

          <View style={styles.infoCard}>
            <View style={styles.iconCircle}>
              <Clock size={20} color="#ffffff" />
            </View>
            <Text style={styles.infoLabel}>Est. Time</Text>
            <Text style={styles.infoValue}>
              {Math.max(5, Math.round(estimatedTime * (1 - progress / 100)))}s
            </Text>
          </View>
        </View>

        {/* Tip */}
        <View style={styles.tipCard}>
          <Text style={styles.tipText}>
            💡 Your drink will be ready soon! Please wait at the machine.
          </Text>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  drinkImageContainer: {
    width: 140,
    height: 140,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 70,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 32,
  },
  drinkImage: {
    width: 100,
    height: 100,
  },
  drinkName: {
    fontSize: 28,
    fontWeight: "700",
    color: "#ffffff",
    marginBottom: 8,
    textAlign: "center",
  },
  stage: {
    fontSize: 16,
    color: "#F5F5DC",
    marginBottom: 32,
    textAlign: "center",
  },
  progressContainer: {
    width: "100%",
    maxWidth: 300,
    marginBottom: 32,
  },
  progressTrack: {
    height: 12,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 6,
  },
  progressIndicator: {
    backgroundColor: "#ffffff",
  },
  progressText: {
    color: "#F5F5DC",
    textAlign: "center",
    marginTop: 12,
    fontSize: 14,
  },
  queueInfo: {
    flexDirection: "row",
    gap: 16,
    width: "100%",
    maxWidth: 300,
    marginBottom: 32,
  },
  infoCard: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
  },
  iconCircle: {
    width: 40,
    height: 40,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 12,
    color: "#F5F5DC",
    marginBottom: 4,
    textAlign: "center",
  },
  infoValue: {
    fontSize: 20,
    fontWeight: "700",
    color: "#ffffff",
    textAlign: "center",
  },
  tipCard: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 16,
    padding: 16,
    maxWidth: 300,
  },
  tipText: {
    fontSize: 14,
    color: "#F5F5DC",
    textAlign: "center",
    lineHeight: 20,
  },
});
