import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors, radii, spacing } from "../../theme";

export function CafeBanner() {
  return (
    <View style={styles.container}>
      {/* Hanging chains/supports */}
      <View style={styles.chainsRow}>
        <View style={styles.chain}>
          <View style={styles.chainRing} />
          <View style={styles.chainLink} />
          <View style={styles.chainRing} />
        </View>
        <View style={styles.chain}>
          <View style={styles.chainRing} />
          <View style={styles.chainLink} />
          <View style={styles.chainRing} />
        </View>
      </View>

      {/* Main Wooden / Awning Signboard */}
      <View style={styles.bannerOuter}>
        {/* Ribbon banner cut-out decorative tabs on left & right */}
        <View style={[styles.ribbonEnd, styles.ribbonLeft]} />
        <View style={[styles.ribbonEnd, styles.ribbonRight]} />

        <View style={styles.bannerInner}>
          <View style={styles.contentRow}>
            <Text style={styles.sideIcon}>🥁</Text>
            <View style={styles.textStack}>
              <Text style={styles.title}>BEATUP CAFÉ</Text>
              <Text style={styles.subtitle}>RHYTHM & BAKERY</Text>
            </View>
            <Text style={styles.sideIcon}>☕</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 6,
    alignSelf: "center",
    alignItems: "center",
    zIndex: 10,
  },
  chainsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: 170,
    height: 14,
    marginBottom: -2,
    zIndex: 1,
  },
  chain: {
    alignItems: "center",
  },
  chainRing: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#7D5D42",
    borderWidth: 1,
    borderColor: "#3E2718",
  },
  chainLink: {
    width: 2,
    height: 6,
    backgroundColor: "#543C28",
  },
  bannerOuter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#5B3A29",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: radii.md,
    borderWidth: 3,
    borderColor: "#3E2314",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  ribbonEnd: {
    position: "absolute",
    width: 14,
    height: 28,
    backgroundColor: "#442718",
    borderWidth: 2,
    borderColor: "#301A0E",
    zIndex: -1,
  },
  ribbonLeft: {
    left: -8,
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4,
    transform: [{ rotate: "-6deg" }],
  },
  ribbonRight: {
    right: -8,
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
    transform: [{ rotate: "6deg" }],
  },
  bannerInner: {
    backgroundColor: "#FDF5E6",
    paddingHorizontal: spacing.md,
    paddingVertical: 4,
    borderRadius: radii.sm,
    borderWidth: 2,
    borderColor: "#D8A46B",
  },
  contentRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  sideIcon: {
    fontSize: 14,
  },
  textStack: {
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "900",
    color: "#4A2711",
    letterSpacing: 2,
    textShadowColor: "rgba(0,0,0,0.1)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  subtitle: {
    fontSize: 8,
    fontWeight: "800",
    color: "#B46530",
    letterSpacing: 1.5,
    marginTop: -2,
  },
});
