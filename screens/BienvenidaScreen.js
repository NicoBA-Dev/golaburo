import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator, SafeAreaView, Animated } from 'react-native';
import { colors } from '../theme/colors';

export default function BienvenidaScreen() {
  // Valores iniciales para las animaciones
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    // Ejecutar animaciones al montar la pantalla
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 1000, useNativeDriver: false }),
      Animated.timing(slideAnim, { toValue: 0, duration: 800, useNativeDriver: false })
    ]).start();
  }, [fadeAnim, slideAnim]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>

        <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
          <Image source={require('../assets/logo-small.png')} style={styles.logoHeader} resizeMode="contain" />
        </Animated.View>

        {/* Contenido animado deslizándose hacia arriba */}
        <Animated.View style={[styles.centerContent, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <Image source={require('../assets/main-icon.png')} style={styles.mainIcon} resizeMode="contain" />
          <Text style={styles.title}>¡Bienvenido a{'\n'}Go Laburo!</Text>
          <Text style={styles.subtitle}>Encuentra el técnico ideal{'\n'}para tu hogar</Text>

          <View style={styles.starsContainer}>
            {[1, 2, 3, 4, 5].map((item) => (
              <Text key={item} style={styles.star}>★</Text>
            ))}
          </View>
        </Animated.View>

        <Animated.View style={[styles.footer, { opacity: fadeAnim }]}>
          {/* Cápsula de carga */}
          <View style={styles.loadingCapsule}>
            <ActivityIndicator size="small" color={colors.primary} />
            <Text style={styles.loadingText}>Conectando de forma segura...</Text>
          </View>
          <Text style={styles.copyright}>© 2024 Go Laburo</Text>
        </Animated.View>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1, alignItems: 'center', justifyContent: 'space-between', paddingVertical: 40, paddingHorizontal: 20 },
  header: { marginTop: 20, alignItems: 'center', width: '100%' },
  logoHeader: { width: 150, height: 45, tintColor: colors.primary },
  centerContent: { alignItems: 'center', justifyContent: 'center', flex: 1, width: '100%' },
  mainIcon: { width: 160, height: 160, marginBottom: 30., tintColor: colors.primary },
  title: { fontSize: 36, fontWeight: '900', color: colors.primary, textAlign: 'center', marginBottom: 10, letterSpacing: 0.5 },
  subtitle: { fontSize: 18, color: colors.textMain, textAlign: 'center', marginBottom: 25, lineHeight: 24 },
  starsContainer: { flexDirection: 'row', gap: 6 },
  star: { fontSize: 28, color: colors.primary },
  footer: { alignItems: 'center', paddingBottom: 15 },
  loadingCapsule: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, paddingHorizontal: 20, paddingVertical: 10, borderRadius: 25, marginBottom: 15, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 3 },
  loadingText: { fontSize: 14, color: colors.textMain, fontWeight: '600', marginLeft: 12 },
  copyright: { fontSize: 12, color: colors.textMuted, letterSpacing: 0.5 },
});