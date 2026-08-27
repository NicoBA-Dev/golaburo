import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import InputField from '../../components/InputField';
import PrimaryButton from '../../components/PrimaryButton';
import { authService } from '../../services/authService';
import { profileService } from '../../services/profileService';
import { storageService } from '../../services/storageService';

export default function ProfileScreen({ navigation }) {
  const [userId, setUserId] = useState(null);
  const [userData, setUserData] = useState({
    nombre: '',
    location: 'Cochabamba, Bolivia',
    phone: '',
    isTechnician: false,
  });

  const [nombre, setNombre] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  const [isEditingNombre, setIsEditingNombre] = useState(false);
  const [isEditingPhone, setIsEditingPhone] = useState(false);

  const [isSavingNombre, setIsSavingNombre] = useState(false);
  const [isSavingPhone, setIsSavingPhone] = useState(false);
  const [loading, setLoading] = useState(false);

  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const session = await authService.getCurrentSession();
        if (!session) return;

        const currentUserId = session.user.id;
        const currentEmail = session.user.email;
        setUserId(currentUserId);
        setEmail(currentEmail);

        const profile = await profileService.getProfile(currentUserId);
        const techProfile = await profileService.getTechnicalProfile(currentUserId);

        setUserData({
          nombre: profile?.full_name || 'Usuario',
          phone: profile?.phone || '',
          isTechnician: !!techProfile,
        });

        setNombre(profile?.full_name || '');
        setPhone(profile?.phone || '');

        const localPrefs = await storageService.getLocalPreferences();
        setNotificationsEnabled(localPrefs.notificationsEnabled);

        await storageService.saveLocalPreferences(currentEmail, localPrefs.notificationsEnabled);
      } catch (error) {
        console.error('Error cargando perfil:', error);
      }
    };

    const unsubscribe = navigation?.addListener('focus', loadData);
    return unsubscribe;
  }, [navigation]);

  const handleInlineSave = async (field, value) => {
    if (!userId) return;

    if (field === 'full_name') setIsSavingNombre(true);
    if (field === 'phone') setIsSavingPhone(true);

    try {
      await profileService.updateProfile(userId, { [field]: value });

      setUserData((prev) => ({
        ...prev,
        [field === 'full_name' ? 'nombre' : 'phone']: value,
      }));

      if (field === 'full_name') setIsEditingNombre(false);
      if (field === 'phone') setIsEditingPhone(false);
    } catch (error) {
      Alert.alert('Error', 'No se pudo actualizar el dato en el servidor.');
    } finally {
      setIsSavingNombre(false);
      setIsSavingPhone(false);
    }
  };

  const handleToggleNotifications = async (value) => {
    setNotificationsEnabled(value);
    await storageService.saveLocalPreferences(email, value);
  };

  const handleClearLocalData = async () => {
    const success = await storageService.clearLocalPreferences();
    if (success) {
      setNotificationsEnabled(false);
      Alert.alert('Datos eliminados', 'Tus preferencias locales han sido borradas del dispositivo.');
    }
  };

  const handleConvertToTechnician = () => navigation?.navigate('RegistroTecnicoScreen');
  const handleGoToTechnicianPanel = () => navigation?.navigate('TecnicoPanel');

  const handleLogout = async () => {
    try {
      setLoading(true);
      await authService.logout();
    } catch (error) {
      Alert.alert('Error', 'Hubo un problema al cerrar sesión.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation?.goBack()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={colors.textMain} />
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>Mi Perfil</Text>
      </View>

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <Ionicons name="person-outline" size={40} color={colors.primary} />
          </View>
          <Text style={styles.name}>{userData.nombre}</Text>
          <Text style={styles.location}>{userData.location}</Text>
        </View>

        <Text style={styles.sectionTitle}>Datos Personales</Text>
        <View style={styles.cardSection}>
          <View style={styles.fieldWrapper}>
            <View style={styles.inputContainer}>
              <InputField
                label="Nombre Completo"
                value={nombre}
                onChangeText={setNombre}
                editable={isEditingNombre}
              />
            </View>
            <TouchableOpacity
              disabled={isSavingNombre}
              style={[styles.editIconBtn, isEditingNombre && styles.editIconBtnActive]}
              onPress={() => (isEditingNombre ? handleInlineSave('full_name', nombre) : setIsEditingNombre(true))}
            >
              {isSavingNombre ? (
                <ActivityIndicator size="small" color={colors.primary} />
              ) : (
                <Ionicons
                  name={isEditingNombre ? 'checkmark' : 'pencil-outline'}
                  size={20}
                  color={isEditingNombre ? colors.primary : colors.textMain}
                />
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.fieldWrapper}>
            <View style={styles.inputContainer}>
              <InputField
                label="Teléfono"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                editable={isEditingPhone}
              />
            </View>
            <TouchableOpacity
              disabled={isSavingPhone}
              style={[styles.editIconBtn, isEditingPhone && styles.editIconBtnActive]}
              onPress={() => (isEditingPhone ? handleInlineSave('phone', phone) : setIsEditingPhone(true))}
            >
              {isSavingPhone ? (
                <ActivityIndicator size="small" color={colors.primary} />
              ) : (
                <Ionicons
                  name={isEditingPhone ? 'checkmark' : 'pencil-outline'}
                  size={20}
                  color={isEditingPhone ? colors.primary : colors.textMain}
                />
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.fieldWrapper}>
            <View style={styles.inputContainer}>
              <InputField
                label="Email (Cuenta de acceso)"
                value={email}
                keyboardType="email-address"
                autoCapitalize="none"
                editable={false}
              />
            </View>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Preferencias de la App</Text>
        <View style={styles.cardSection}>
          <View style={styles.preferenceRow}>
            <View style={styles.preferenceTextContainer}>
              <Ionicons name="notifications-outline" size={22} color={colors.textMain} />
              <Text style={styles.preferenceText}>Recibir notificaciones</Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={handleToggleNotifications}
              trackColor={{ false: colors.border, true: colors.primarySoft }}
              thumbColor={notificationsEnabled ? colors.primary : colors.textMuted}
            />
          </View>

          <TouchableOpacity style={styles.clearDataBtn} onPress={handleClearLocalData}>
            <Ionicons name="trash-outline" size={18} color={colors.error} />
            <Text style={styles.clearDataText}>Borrar preferencias locales</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Modo Trabajador</Text>
        {!userData.isTechnician ? (
          <PrimaryButton
            title="CONVERTIRSE EN TÉCNICO"
            onPress={handleConvertToTechnician}
            style={styles.btnPrimary}
          />
        ) : (
          <TouchableOpacity
            style={styles.technicianPanelBtn}
            onPress={handleGoToTechnicianPanel}
            activeOpacity={0.85}
          >
            <Ionicons name="construct-outline" size={20} color={colors.white} style={{ marginRight: 8 }} />
            <Text style={styles.technicianPanelBtnText}>IR A MI PANEL DE TÉCNICO</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={handleLogout}
          disabled={loading}
          activeOpacity={0.8}
        >
          <Ionicons name="log-out-outline" size={20} color={colors.error} />
          <Text style={styles.logoutText}>Cerrar sesión de forma segura</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.surface,
  },
  backBtn: { padding: 4, marginRight: 12 },
  topBarTitle: { fontSize: typography.fontSize.lg, fontWeight: typography.fontWeight.bold, color: colors.textMain },
  container: { padding: 16, paddingBottom: 40 },
  header: { alignItems: 'center', marginBottom: 24 },
  avatarContainer: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    elevation: 2,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  name: { fontSize: typography.fontSize.xl, fontWeight: typography.fontWeight.bold, color: colors.textMain, marginBottom: 2 },
  location: { fontSize: typography.fontSize.sm, color: colors.textMuted },
  sectionTitle: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    color: colors.textMuted,
    marginBottom: 8,
    marginLeft: 4,
    marginTop: 10,
  },
  cardSection: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    elevation: 2,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  fieldWrapper: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 },
  inputContainer: { flex: 1 },
  editIconBtn: {
    padding: 10,
    marginBottom: 16,
    marginLeft: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
  },
  editIconBtnActive: { borderColor: colors.primary, backgroundColor: colors.primarySoft },
  preferenceRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 8 },
  preferenceTextContainer: { flexDirection: 'row', alignItems: 'center' },
  preferenceText: { fontSize: typography.fontSize.md, color: colors.textMain, marginLeft: 12, fontWeight: typography.fontWeight.medium },
  clearDataBtn: { flexDirection: 'row', alignItems: 'center', marginTop: 16, paddingTop: 16, borderTopWidth: 1, borderTopColor: colors.border },
  clearDataText: { color: colors.error, fontSize: typography.fontSize.sm, marginLeft: 8, fontWeight: typography.fontWeight.medium },
  btnPrimary: { marginBottom: 10, borderRadius: 12 },
  technicianPanelBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 10,
    elevation: 3,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  technicianPanelBtnText: { color: colors.white, fontSize: typography.fontSize.md, fontWeight: typography.fontWeight.bold },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.errorSoft,
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 10,
  },
  logoutText: { fontSize: typography.fontSize.sm, color: colors.error, marginLeft: 8, fontWeight: typography.fontWeight.bold },
});