import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import InputField from '../../components/InputField';
import PrimaryButton from '../../components/PrimaryButton';
import { authService } from '../../services/authService';
import { userService } from '../../services/userService';

export default function ProfileScreen({ navigation }) {
  const [userData, setUserData] = useState({
    nombre: '',
    location: '',
    phone: '',
    email: '',
    isTechnician: false,
  });

  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [loading, setLoading] = useState(false);

  // Cargar datos del JSON local
  useEffect(() => {
    const loadData = async () => {
      const data = await userService.getUserProfile();
      setUserData(data);
      setPhone(data.phone);
      setEmail(data.email);
    };

    // Escucha el foco de la pantalla para refrescar los datos si volvió de registrarse como técnico
    const unsubscribe = navigation?.addListener('focus', loadData);
    return unsubscribe;
  }, [navigation]);

  const handleSave = async () => {
    setLoading(true);
    try {
      const updatedJson = { phone, email };
      await userService.updateUserProfile(updatedJson);

      setIsEditingPhone(false);
      setIsEditingEmail(false);
      setUserData((prev) => ({ ...prev, ...updatedJson }));

      Alert.alert('Éxito', 'Cambios guardados en el registro JSON local.');
    } catch (error) {
      Alert.alert('Error', 'No se pudieron guardar los cambios.');
    } finally {
      setLoading(false);
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
      {/* TopBar Superior */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation?.goBack()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={colors.textMain} />
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>Mi Perfil</Text>
      </View>

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Avatar e Identidad */}
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <Ionicons name="person-outline" size={40} color={colors.textMuted} />
            <Text style={styles.avatarText}>User Avatar</Text>
          </View>
          <Text style={styles.name}>{userData.nombre || 'Cargando...'}</Text>
          <Text style={styles.location}>{userData.location || 'Cochabamba, Bolivia'}</Text>
        </View>

        {/* Campo Teléfono */}
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
            style={[styles.editIconBtn, isEditingPhone && styles.editIconBtnActive]}
            onPress={() => setIsEditingPhone((prev) => !prev)}
          >
            <Ionicons
              name={isEditingPhone ? 'checkmark' : 'pencil-outline'}
              size={20}
              color={isEditingPhone ? colors.primary : colors.textMain}
            />
          </TouchableOpacity>
        </View>

        {/* Campo Email */}
        <View style={styles.fieldWrapper}>
          <View style={styles.inputContainer}>
            <InputField
              label="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              editable={isEditingEmail}
            />
          </View>
          <TouchableOpacity
            style={[styles.editIconBtn, isEditingEmail && styles.editIconBtnActive]}
            onPress={() => setIsEditingEmail((prev) => !prev)}
          >
            <Ionicons
              name={isEditingEmail ? 'checkmark' : 'pencil-outline'}
              size={20}
              color={isEditingEmail ? colors.primary : colors.textMain}
            />
          </TouchableOpacity>
        </View>

        {/* Sección Mis Direcciones */}
        <TouchableOpacity style={styles.sectionCard} activeOpacity={0.8}>
          <Ionicons name="location-outline" size={32} color={colors.textMain} style={styles.cardIcon} />
          <View style={styles.cardTextContainer}>
            <Text style={styles.cardTitle}>Mis Direcciones</Text>
            <Text style={styles.cardDetail}>Trabajo: Av. Aroma</Text>
            <Text style={styles.cardDetail}>Casa: Calle Santiváñez</Text>
          </View>
        </TouchableOpacity>

        {/* =========================================================================
            [PRUEBAS] Botón para convertirse en técnico (SIEMPRE VISIBLE).
            TODO: Para la versión final en producción, se puede volver a condicionar.
           ========================================================================= */}
        <PrimaryButton
          title="CONVERTIRSE EN TÉCNICO"
          onPress={handleConvertToTechnician}
          style={styles.btnPrimary}
        />

        {/* Botón exclusivo que aparece si se registró como TÉCNICO */}
        {userData.isTechnician && (
          <TouchableOpacity
            style={styles.technicianPanelBtn}
            onPress={handleGoToTechnicianPanel}
            activeOpacity={0.85}
          >
            <Ionicons name="construct-outline" size={20} color={colors.white} style={{ marginRight: 8 }} />
            <Text style={styles.technicianPanelBtnText}>PANEL DE TÉCNICO</Text>
          </TouchableOpacity>
        )}

        {/* Botón Guardar Cambios */}
        <PrimaryButton
          title="GUARDAR CAMBIOS"
          onPress={handleSave}
          loading={loading}
          variant="outline"
          style={styles.btnSecondary}
        />

        {/* Botón Cerrar Sesión */}
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
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.surface,
  },
  backBtn: {
    padding: 4,
    marginRight: 12,
  },
  topBarTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.textMain,
  },
  container: {
    padding: 16,
    paddingBottom: 30,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: colors.textMuted,
    borderStyle: 'dashed',
    backgroundColor: colors.disabledBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  avatarText: {
    fontSize: typography.fontSize.xs,
    color: colors.textMuted,
    marginTop: 2,
  },
  name: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.textMain,
    marginBottom: 2,
  },
  location: {
    fontSize: typography.fontSize.sm,
    color: colors.textMuted,
  },
  fieldWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  inputContainer: {
    flex: 1,
  },
  editIconBtn: {
    padding: 10,
    marginBottom: 14,
    marginLeft: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  editIconBtnActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primarySoft,
  },
  sectionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
  },
  cardIcon: {
    marginRight: 14,
  },
  cardTextContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    color: colors.textMain,
    marginBottom: 2,
  },
  cardDetail: {
    fontSize: typography.fontSize.sm,
    color: colors.textMuted,
  },
  btnPrimary: {
    marginBottom: 10,
  },
  technicianPanelBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 15,
    borderRadius: 12,
    marginBottom: 10,
  },
  technicianPanelBtnText: {
    color: colors.white,
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semibold,
  },
  btnSecondary: {
    marginBottom: 16,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.errorSoft,
    paddingVertical: 12,
    borderRadius: 12,
  },
  logoutText: {
    fontSize: typography.fontSize.sm,
    color: colors.error,
    marginLeft: 6,
    fontWeight: typography.fontWeight.semibold,
  },
});