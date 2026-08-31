import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { colors } from '../../theme/colors';
import { fontSize, fontWeight, lineHeight } from '../../theme/typography';
import InputField from '../../components/InputField';
import PrimaryButton from '../../components/PrimaryButton';
import { authService } from '../../services/authService';
import { validateEmail, validateLoginPassword } from '../../utils/validators';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState({ email: null, password: null });
  const [formError, setFormError] = useState('');

  const validateField = (field, value) => {
    let message = null;
    if (field === 'email') message = validateEmail(value);
    if (field === 'password') message = validateLoginPassword(value);
    setErrors((prev) => ({ ...prev, [field]: message }));
    return message;
  };

  const validateAll = () => {
    const emailError = validateEmail(email);
    const passwordError = validateLoginPassword(password);
    setErrors({ email: emailError, password: passwordError });
    return !emailError && !passwordError;
  };

  const handleLogin = async () => {
    setFormError('');
    if (!validateAll()) return;

    setLoading(true);
    try {
      await authService.login(email.trim(), password);
      // Aquí podrías redirigir al Home si el login es exitoso
    } catch (err) {
      setFormError('No pudimos iniciar sesión. Verifica tu correo y contraseña.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 24 : 0}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <Image
              source={require('../../assets/logo-small.png')}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.title}>Inicia sesión</Text>
            <Text style={styles.subtitle}>
              Accede a tu cuenta para encontrar o solicitar servicios.
            </Text>
          </View>

          <View style={styles.card}>
            {formError ? (
              <View style={styles.formErrorBox}>
                <Text style={styles.formErrorText}>{formError}</Text>
              </View>
            ) : null}

            <View style={styles.cardBody}>
              <InputField
                label="Correo electrónico"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  if (errors.email) validateField('email', text);
                }}
                onBlur={() => validateField('email', email)}
                placeholder="nombre@ejemplo.com"
                keyboardType="email-address"
                autoCapitalize="none"
                error={errors.email}
              />

              <InputField
                label="Contraseña"
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  if (errors.password) validateField('password', text);
                }}
                onBlur={() => validateField('password', password)}
                placeholder="••••••••"
                secureTextEntry
                error={errors.password}
              />

              <PrimaryButton
                title={loading ? 'Conectando...' : 'Iniciar sesión'}
                onPress={handleLogin}
                loading={loading}
                style={styles.btn}
              />
            </View>

            <TouchableOpacity
              style={styles.footerBanner}
              onPress={() => navigation.navigate('Register')}
            >
              <Text style={styles.bannerText}>
                ¿Eres nuevo? <Text style={styles.boldText}>Regístrate aquí</Text>
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.copyright}>© 2024 Go Laburo</Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  scroll: {
    flexGrow: 1,
    padding: 24,
    alignItems: 'center',
  },
  header: { alignItems: 'center', marginTop: 10, marginBottom: 28, width: '100%' },
  logo: {
    width: 160,
    height: 45,
    marginBottom: 16,
    tintColor: colors.primary,
  },
  title: {
    fontSize: fontSize['2xl'],
    lineHeight: lineHeight['2xl'],
    fontWeight: fontWeight.bold,
    color: colors.primary,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: fontSize.base,
    lineHeight: lineHeight.base,
    color: colors.textMuted,
    textAlign: 'center',
    paddingHorizontal: 10,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    width: '100%',
    overflow: 'hidden',
    elevation: 3,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
  },
  cardBody: { paddingHorizontal: 20, paddingTop: 22 },
  formErrorBox: {
    backgroundColor: colors.errorSoft,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 10,
  },
  formErrorText: {
    color: colors.error,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    textAlign: 'center',
  },
  btn: { marginTop: 8, marginBottom: 20 },
  footerBanner: {
    backgroundColor: colors.background,
    paddingVertical: 16,
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: colors.border,
  },
  bannerText: { fontSize: fontSize.base, color: colors.textMuted },
  boldText: { fontWeight: fontWeight.bold, color: colors.primary },
  copyright: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
    marginTop: 24,
    marginBottom: 10,
  },
});