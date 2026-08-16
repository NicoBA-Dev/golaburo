import { StatusBar } from "expo-status-bar";
import { StyleSheet, SafeAreaView } from "react-native";
// Asegúrate de que la ruta coincida con donde guardaste la pantalla
import BienvenidaScreen from "./screens/BienvenidaScreen";
import { colors } from "./theme/colors";

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <BienvenidaScreen />
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background, // Mantiene el fondo general de la app
  },
});