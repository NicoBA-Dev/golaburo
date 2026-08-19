import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, ScrollView, Image } from 'react-native';
import { colors } from '../../theme/colors';
import InputField from '../../components/InputField';
import PrimaryButton from '../../components/PrimaryButton';
import { authService } from '../../services/authService';

export default function RegisterScreen({ navigation }) {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [telefono, setTelefono] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    setLoading(true);
    try {
      await authService.register({ email, password, nombre, telefono });
      alert('Registro completado exitosamente');
      navigation.navigate('Login');
    } catch (err) {
      alert('Hubo un problema con el registro.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Image source={require('../../assets/logo-small.png')} style={styles.logo} resizeMode="contain" />
          <Text style={styles.title}>Crear cuenta</Text>
          <Text style={styles.subtitle}>Completa tus datos para empezar a usar la plataforma.</Text>
        </View>

        <View style={styles.card}>
          <InputField label="Nombre completo" value={nombre} onChangeText={setNombre} placeholder="Juan Pérez" />
          <InputField label="Correo electrónico" value={email} onChangeText={setEmail} placeholder="nombre@ejemplo.com" keyboardType="email-address" />
          <InputField label="Contraseña" value={password} onChangeText={setPassword} placeholder="••••••••" secureTextEntry />
          <InputField label="Número de teléfono" value={telefono} onChangeText={setTelefono} placeholder="+591 700 00000" keyboardType="phone-pad" />

          <PrimaryButton title={loading ? 'Registrando...' : 'Regístrate'} onPress={handleRegister} style={styles.btn} />

          <Text style={styles.disclaimer}>Al registrarte, aceptas nuestros términos y condiciones.</Text>

          <TouchableOpacity style={styles.footerBanner} onPress={() => navigation.navigate('Login')}>
            <Text style={styles.bannerText}>¿Ya tienes cuenta? <Text style={styles.boldText}>Inicia sesión aquí</Text></Text>
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
  logo: {
    width: 160,
    height: 45,
    marginBottom: 16,
    tintColor: colors.primary
  },
  title: { fontSize: 26, fontWeight: 'bold', color: colors.primary, marginBottom: 6 },
  subtitle: { fontSize: 14, color: colors.textMuted, textAlign: 'center', paddingHorizontal: 10, marginBottom: 16 },
  card: { backgroundColor: colors.surface, borderRadius: 16, width: '100%', overflow: 'hidden', elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 8 },
  btn: { marginTop: 8, marginBottom: 10, marginHorizontal: 20, width: 'auto' },
  disclaimer: { fontSize: 11, color: colors.textMuted, textAlign: 'center', paddingHorizontal: 20, marginBottom: 16 },
  footerBanner: { backgroundColor: '#F8FAF8', paddingVertical: 14, alignItems: 'center', borderTopWidth: 1, borderColor: colors.border },
  bannerText: { fontSize: 14, color: colors.primary },
  boldText: { fontWeight: 'bold' },
  copyright: { fontSize: 12, color: colors.textMuted, marginTop: 16, marginBottom: 10 },
});