import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors, radii, spacing } from "../../theme";

type HomeScreenProps = {
  onStart: () => void;
};

export function HomeScreen({ onStart }: HomeScreenProps) {
  return (
    <View style={styles.root}>
      <Text style={styles.title}>BeatUP!!</Text>
      <Pressable style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]} onPress={onStart}>
        <Text style={styles.buttonLabel}>Start</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.cafeBackground,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xl,
  },
  title: {
    fontSize: 48,
    fontWeight: "800",
    color: colors.textDark,
  },
  button: {
    backgroundColor: colors.tomHit,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: radii.pill,
    borderWidth: 4,
    borderColor: colors.bubbleBorder,
  },
  buttonPressed: {
    opacity: 0.7,
  },
  buttonLabel: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.textDark,
  },
});
