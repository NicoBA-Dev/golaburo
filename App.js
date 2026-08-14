import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { colors } from "./theme/colors";

export default function App() {
  return (
    <View style={styles.container}>
      <View style={styles.cardPrimary}>
        <Text style={styles.cardTitle}>GoLaburo</Text>
        <Text style={styles.cardSubtitle}>StyleSheet funcionando ✓</Text>
      </View>
      <View style={styles.cardSurface}>
        <Text style={styles.textMain}>Color primario</Text>
        <Text style={styles.textMuted}>bg-surface y text-textMuted</Text>
      </View>
      <View style={styles.cardSecondary}>
        <Text style={styles.cardTitle}>Color secundario</Text>
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background,
  },
  cardPrimary: {
    backgroundColor: colors.primary,
    padding: 24,
    borderRadius: 16,
    marginBottom: 16,
    width: "80%",
    alignItems: "center",
  },
  cardSurface: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    borderRadius: 12,
    width: "80%",
  },
  cardSecondary: {
    backgroundColor: colors.secondary,
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
    width: "80%",
    alignItems: "center",
  },
  cardTitle: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "bold",
  },
  cardSubtitle: {
    color: "#FFFFFF",
    fontSize: 13,
    marginTop: 4,
  },
  textMain: {
    color: colors.textMain,
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  textMuted: {
    color: colors.textMuted,
    fontSize: 13,
  },
});