import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, ScrollView, Image } from 'react-native';
import { colors } from '../../theme/colors';
import InputField from '../../components/InputField';
import PrimaryButton from '../../components/PrimaryButton';
import { authService } from '../../services/authService';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      await authService.login(email, password);
      // Aquí podrías redirigir al Home si el login es exitoso
    } catch (err) {
      alert('Error de conexión. Verifica tus credenciales.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <Image source={require('../../assets/logo-small.png')} style={styles.logo} resizeMode="contain" />
          <Text style={styles.title}>Inicia sesión</Text>
          <Text style={styles.subtitle}>Accede a tu cuenta para encontrar o solicitar servicios.</Text>
        </View>

        <View style={styles.card}>
          <InputField label="Correo electrónico" value={email} onChangeText={setEmail} placeholder="nombre@ejemplo.com" keyboardType="email-address" />
          <InputField label="Contraseña" value={password} onChangeText={setPassword} placeholder="••••••••" secureTextEntry />

          <PrimaryButton title={loading ? 'Conectando...' : 'Iniciar sesión'} onPress={handleLogin} style={styles.btn} />

          <TouchableOpacity style={styles.footerBanner} onPress={() => navigation.navigate('Register')}>
            <Text style={styles.bannerText}>¿Eres nuevo? <Text style={styles.boldText}>Regístrate aquí</Text></Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.copyright}>© 2024 Go Laburo</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  scroll: { flexGrow: 1, justifyContent: 'space-between', padding: 24, alignItems: 'center' },
  header: { alignItems: 'center', marginTop: 10, width: '100%' },
  // En tus StyleSheet de Login y Register:
  logo: {
    width: 160,
    height: 45,
    marginBottom: 16,
    tintColor: colors.primary // Vuelve el verde puro aquí también
  },
  title: { fontSize: 26, fontWeight: 'bold', color: colors.primary, marginBottom: 6 },
  subtitle: { fontSize: 14, color: colors.textMuted, textAlign: 'center', paddingHorizontal: 10, marginBottom: 20 },
  card: { backgroundColor: colors.surface, borderRadius: 16, width: '100%', overflow: 'hidden', elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 8 },
  btn: { marginTop: 10, marginBottom: 15, marginHorizontal: 20, width: 'auto' },
  footerBanner: { backgroundColor: '#F8FAF8', paddingVertical: 14, alignItems: 'center', borderTopWidth: 1, borderColor: colors.border },
  bannerText: { fontSize: 14, color: colors.primary },
  boldText: { fontWeight: 'bold' },
  copyright: { fontSize: 12, color: colors.textMuted, marginTop: 20, marginBottom: 10 },
});