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
import {
  validateName,
  validateEmail,
  validatePassword,
  validateConfirmPassword,
  validatePhone,
  getPasswordStrength,
} from '../../utils/validators';

const STRENGTH_LABELS = ['Muy débil', 'Débil', 'Buena', 'Fuerte'];
const STRENGTH_COLORS = [colors.error, colors.warning, colors.primary, colors.primary];

export default function RegisterScreen({ navigation }) {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [telefono, setTelefono] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState({
    nombre: null,
    email: null,
    password: null,
    confirmPassword: null,
    telefono: null,
    terms: null,
  });
  const [formError, setFormError] = useState('');

  const strength = getPasswordStrength(password);

  const validators = {
    nombre: validateName,
    email: validateEmail,
    password: validatePassword,
    telefono: validatePhone,
    confirmPassword: (value) => validateConfirmPassword(password, value),
  };

  const validateField = (field, value) => {
    const message = validators[field] ? validators[field](value) : null;
    setErrors((prev) => ({ ...prev, [field]: message }));
    return message;
  };

  const validateAll = () => {
    const nextErrors = {
      nombre: validateName(nombre),
      email: validateEmail(email),
      password: validatePassword(password),
      confirmPassword: validateConfirmPassword(password, confirmPassword),
      telefono: validatePhone(telefono),
      terms: acceptedTerms ? null : 'Debes aceptar los términos y condiciones.',
    };
    setErrors(nextErrors);
    return Object.values(nextErrors).every((msg) => !msg);
  };

  const handleRegister = async () => {
    setFormError('');
    if (!validateAll()) return;

    setLoading(true);
    try {
      await authService.register({
        email: email.trim(),
        password,
        nombre: nombre.trim(),
        telefono: telefono.trim(),
      });
      navigation.navigate('Login', { registered: true });
    } catch (err) {
      setFormError('Hubo un problema con el registro. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
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
            <Text style={styles.title}>Crear cuenta</Text>
            <Text style={styles.subtitle}>
              Completa tus datos para empezar a usar la plataforma.
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
                label="Nombre completo"
                value={nombre}
                onChangeText={(text) => {
                  setNombre(text);
                  if (errors.nombre) validateField('nombre', text);
                }}
                onBlur={() => validateField('nombre', nombre)}
                placeholder="Juan Pérez"
                error={errors.nombre}
              />

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
                label="Número de teléfono"
                value={telefono}
                onChangeText={(text) => {
                  setTelefono(text);
                  if (errors.telefono) validateField('telefono', text);
                }}
                onBlur={() => validateField('telefono', telefono)}
                placeholder="700 00000"
                keyboardType="phone-pad"
                error={errors.telefono}
                helperText={!errors.telefono ? 'Ej: 700 00000 o +591 700 00000' : undefined}
              />

              <InputField
                label="Contraseña"
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  if (errors.password) validateField('password', text);
                  if (confirmPassword && errors.confirmPassword) {
                    validateField('confirmPassword', confirmPassword);
                  }
                }}
                onBlur={() => validateField('password', password)}
                placeholder="••••••••"
                secureTextEntry
                error={errors.password}
              />

              {password && !errors.password ? (
                <View style={styles.strengthRow}>
                  {[0, 1, 2].map((i) => (
                    <View
                      key={i}
                      style={[
                        styles.strengthBar,
                        {
                          backgroundColor:
                            i < strength ? STRENGTH_COLORS[strength] : colors.border,
                        },
                      ]}
                    />
                  ))}
                  <Text style={[styles.strengthLabel, { color: STRENGTH_COLORS[strength] }]}>
                    {STRENGTH_LABELS[strength]}
                  </Text>
                </View>
              ) : null}

              <InputField
                label="Confirmar contraseña"
                value={confirmPassword}
                onChangeText={(text) => {
                  setConfirmPassword(text);
                  if (errors.confirmPassword) validateField('confirmPassword', text);
                }}
                onBlur={() => validateField('confirmPassword', confirmPassword)}
                placeholder="••••••••"
                secureTextEntry
                error={errors.confirmPassword}
              />

              <TouchableOpacity
                style={styles.termsRow}
                onPress={() => {
                  setAcceptedTerms((prev) => !prev);
                  if (errors.terms) setErrors((prev) => ({ ...prev, terms: null }));
                }}
                activeOpacity={0.7}
              >
                <View
                  style={[
                    styles.checkbox,
                    acceptedTerms && styles.checkboxChecked,
                    errors.terms && !acceptedTerms ? styles.checkboxError : null,
                  ]}
                >
                  {acceptedTerms ? <Text style={styles.checkmark}>✓</Text> : null}
                </View>
                <Text style={styles.termsText}>
                  Acepto los <Text style={styles.termsLink}>términos y condiciones</Text>
                </Text>
              </TouchableOpacity>
              {errors.terms ? <Text style={styles.errorText}>{errors.terms}</Text> : null}

              <PrimaryButton
                title={loading ? 'Registrando...' : 'Regístrate'}
                onPress={handleRegister}
                loading={loading}
                style={styles.btn}
              />
            </View>

            <TouchableOpacity
              style={styles.footerBanner}
              onPress={() => navigation.navigate('Login')}
            >
              <Text style={styles.bannerText}>
                ¿Ya tienes cuenta? <Text style={styles.boldText}>Inicia sesión aquí</Text>
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
  scroll: { flexGrow: 1, padding: 24, alignItems: 'center' },
  header: { alignItems: 'center', marginTop: 10, marginBottom: 24, width: '100%' },
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
  strengthRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: -8,
    marginBottom: 14,
    gap: 4,
  },
  strengthBar: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    marginRight: 4,
  },
  strengthLabel: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
    marginLeft: 6,
  },
  termsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 4,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  checkboxChecked: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  checkboxError: {
    borderColor: colors.error,
  },
  checkmark: {
    color: colors.white,
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
  },
  termsText: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
    flexShrink: 1,
  },
  termsLink: {
    color: colors.primary,
    fontWeight: fontWeight.semibold,
  },
  errorText: {
    fontSize: fontSize.xs,
    color: colors.error,
    marginTop: 4,
    marginBottom: 12,
    marginLeft: 30,
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
    marginTop: 20,
    marginBottom: 10,
  },
});