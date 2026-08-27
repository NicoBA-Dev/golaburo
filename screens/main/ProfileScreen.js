import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import InputField from '../../components/InputField';
import PrimaryButton from '../../components/PrimaryButton';
import { authService } from '../../services/authService';
import { profileService } from '../../services/profileService';

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

  // Nuevos estados de carga independientes para mejor UX
  const [isSavingNombre, setIsSavingNombre] = useState(false);
  const [isSavingPhone, setIsSavingPhone] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const session = await authService.getCurrentSession();
        if (!session) return;

        const currentUserId = session.user.id;
        setUserId(currentUserId);
        setEmail(session.user.email);

        const profile = await profileService.getProfile(currentUserId);
        const techProfile = await profileService.getTechnicalProfile(currentUserId);

        // PROTECCIÓN AÑADIDA CON '?.'
        setUserData({
          nombre: profile?.full_name || '',
          phone: profile?.phone || '',
          isTechnician: !!techProfile,
        });

        setNombre(profile?.full_name || '');
        setPhone(profile?.phone || '');

      } catch (error) {
        console.error("Error cargando perfil:", error);
      }
    };

    const unsubscribe = navigation?.addListener('focus', loadData);
    return unsubscribe;
  }, [navigation]);

  // NUEVA FUNCIÓN: Guardado en línea instantáneo
  const handleInlineSave = async (field, value) => {
    if (!userId) return;

    if (field === 'full_name') setIsSavingNombre(true);
    if (field === 'phone') setIsSavingPhone(true);

    try {
      await profileService.updateProfile(userId, { [field]: value });

      setUserData((prev) => ({
        ...prev,
        [field === 'full_name' ? 'nombre' : 'phone']: value
      }));

      // Apagamos el modo edición solo si tuvo éxito
      if (field === 'full_name') setIsEditingNombre(false);
      if (field === 'phone') setIsEditingPhone(false);

    } catch (error) {
      Alert.alert('Error', 'No se pudo actualizar el dato en el servidor.');
    } finally {
      setIsSavingNombre(false);
      setIsSavingPhone(false);
    }
  };

  const handleConvertToTechnician = () => {
    navigation?.navigate('RegistroTecnicoScreen');
  };

  const handleGoToTechnicianPanel = () => {
    navigation?.navigate('TecnicoPanel');
  };

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
            <Ionicons name="person-outline" size={40} color={colors.textMuted} />
          </View>
          <Text style={styles.name}>{userData.nombre || 'Cargando...'}</Text>
          <Text style={styles.location}>{userData.location}</Text>
        </View>

        {/* Campo Nombre con Auto-Guardado */}
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
            onPress={() => {
              if (isEditingNombre) {
                // Si estaba editando, al tocar guarda los datos
                handleInlineSave('full_name', nombre);
              } else {
                // Si no estaba editando, activa la edición
                setIsEditingNombre(true);
              }
            }}
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

        {/* Campo Teléfono con Auto-Guardado */}
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
            onPress={() => {
              if (isEditingPhone) {
                handleInlineSave('phone', phone);
              } else {
                setIsEditingPhone(true);
              }
            }}
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

        {/* Campo Email (Solo Lectura) */}
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

        <TouchableOpacity style={styles.sectionCard} activeOpacity={0.8}>
          <Ionicons name="location-outline" size={32} color={colors.textMain} style={styles.cardIcon} />
          <View style={styles.cardTextContainer}>
            <Text style={styles.cardTitle}>Mis Direcciones</Text>
            <Text style={styles.cardDetail}>Trabajo: Av. Aroma</Text>
            <Text style={styles.cardDetail}>Casa: Calle Santiváñez</Text>
          </View>
        </TouchableOpacity>

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
            <Text style={styles.technicianPanelBtnText}>PANEL DE TÉCNICO</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={handleLogout}
          disabled={loading}
          activeOpacity={0.8}
        >
          <Ionicons name="log-out-outline" size={20} color={colors.error} />
          <Text style={styles.logoutText}>Cerrar sesión</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  topBar: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.border, backgroundColor: colors.surface },
  backBtn: { padding: 4, marginRight: 12 },
  topBarTitle: { fontSize: typography.fontSize.lg, fontWeight: typography.fontWeight.bold, color: colors.textMain },
  container: { padding: 16, paddingBottom: 30 },
  header: { alignItems: 'center', marginBottom: 20 },
  avatarContainer: { width: 100, height: 100, borderRadius: 8, borderWidth: 1.5, borderColor: colors.textMuted, borderStyle: 'dashed', backgroundColor: colors.disabledBg, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  name: { fontSize: typography.fontSize.xl, fontWeight: typography.fontWeight.bold, color: colors.textMain, marginBottom: 2 },
  location: { fontSize: typography.fontSize.sm, color: colors.textMuted },
  fieldWrapper: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  inputContainer: { flex: 1 },
  editIconBtn: { padding: 10, marginBottom: 14, marginLeft: 8, borderRadius: 8, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface },
  editIconBtnActive: { borderColor: colors.primary, backgroundColor: colors.primarySoft },
  sectionCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderWidth: 1.5, borderColor: colors.border, borderRadius: 12, padding: 14, marginBottom: 16 },
  cardIcon: { marginRight: 14 },
  cardTextContainer: { flex: 1 },
  cardTitle: { fontSize: typography.fontSize.md, fontWeight: typography.fontWeight.bold, color: colors.textMain, marginBottom: 2 },
  cardDetail: { fontSize: typography.fontSize.sm, color: colors.textMuted },
  btnPrimary: { marginBottom: 10 },
  technicianPanelBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: colors.primary, paddingVertical: 15, borderRadius: 12, marginBottom: 10 },
  technicianPanelBtnText: { color: colors.white, fontSize: typography.fontSize.md, fontWeight: typography.fontWeight.semibold },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: colors.errorSoft, paddingVertical: 12, borderRadius: 12, marginTop: 10 },
  logoutText: { fontSize: typography.fontSize.sm, color: colors.error, marginLeft: 6, fontWeight: typography.fontWeight.semibold },
});