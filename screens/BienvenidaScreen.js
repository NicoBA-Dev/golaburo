import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator, SafeAreaView } from 'react-native';
import { colors } from '../theme/colors';
import { authService } from '../services/authService';

export default function BienvenidaScreen({ navigation }) {
  useEffect(() => {
    let isMounted = true;

    const verificarSesion = async () => {
      try {
        // Pausa de 1.5 segundos para mostrar el logo
        await new Promise((resolve) => setTimeout(resolve, 1500));

        const session = await authService.getCurrentSession();

        if (isMounted) {
          if (session?.user) {
            navigation.replace('Home');
          } else {
            navigation.replace('Login');
          }
        }
      } catch (error) {
        console.log('Error en verificación web:', error);
        if (isMounted) navigation.replace('Login');
      }
    };

    verificarSesion();

    return () => { isMounted = false; };
  }, [navigation]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Image source={require('../assets/logo-small.png')} style={styles.logoHeader} resizeMode="contain" />
        </View>

        <View style={styles.centerContent}>
          <View style={styles.iconContainer}>
            <Image source={require('../assets/main-icon.png')} style={styles.mainIcon} resizeMode="contain" />
          </View>
          <Text style={styles.title}>¡Bienvenido a{'\n'}Go Laburo!</Text>
          <Text style={styles.subtitle}>Encuentra el técnico ideal{'\n'}para tu hogar</Text>
          <View style={styles.starsContainer}>
            {[1, 2, 3, 4, 5].map((item) => (
              <Text key={item} style={styles.star}>★</Text>
            ))}
          </View>
        </View>

        <View style={styles.footer}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color={colors.primary} style={styles.loader} />
            <Text style={styles.loadingText}>Cargando aplicación...</Text>
          </View>
          <Text style={styles.copyright}>© 2024 Go Laburo</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1, alignItems: 'center', justifyContent: 'space-between', paddingVertical: 40, paddingHorizontal: 20 },
  header: { marginTop: 20, alignItems: 'center', width: '100%' },
  logoHeader: { width: 160, height: 50, tintColor: colors.primary },
  centerContent: { alignItems: 'center', justifyContent: 'center', flex: 1, width: '100%' },
  iconContainer: { marginBottom: 35, alignItems: 'center' },
  mainIcon: { width: 170, height: 170, tintColor: colors.primary },
  title: { fontSize: 34, fontWeight: '900', color: colors.primary, textAlign: 'center', marginBottom: 12 },
  subtitle: { fontSize: 18, color: colors.textPrimary, textAlign: 'center', marginBottom: 25 },
  starsContainer: { flexDirection: 'row', gap: 8 },
  star: { fontSize: 32, color: colors.primary },
  footer: { alignItems: 'center', paddingBottom: 10 },
  loadingContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  loader: { marginRight: 10 },
  loadingText: { fontSize: 16, color: colors.textSecondary, fontWeight: '500' },
  copyright: { fontSize: 13, color: colors.textSecondary, opacity: 0.7 },
});