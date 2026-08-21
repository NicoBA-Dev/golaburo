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
import { userService } from '../../services/userService';

export default function PerfilTecnicoScreen({ navigation }) {
  const [techData, setTechData] = useState({
    nombre: 'Juan Pérez',
    location: 'Cochabamba, Bolivia',
    rating: '4.8 / 5',
    experience: '1 año',
    specialty: 'Plomería',
    days: 'Lunes a Viernes',
    schedule: '08:00 AM - 12:00 PM',
  });

  const [isEditingExp, setIsEditingExp] = useState(false);
  const [isEditingSpec, setIsEditingSpec] = useState(false);
  const [isEditingDays, setIsEditingDays] = useState(false);
  const [isEditingSchedule, setIsEditingSchedule] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      const user = await userService.getUserProfile();
      if (user?.technicianData) {
        setTechData((prev) => ({
          ...prev,
          nombre: user.nombre || prev.nombre,
          location: user.location || prev.location,
          experience: user.technicianData.experience || prev.experience,
          specialty: user.technicianData.specialty || prev.specialty,
          days: user.technicianData.days || prev.days,
          schedule: user.technicianData.schedule || prev.schedule,
        }));
      }
    };
    loadProfile();
  }, []);

  const handleSaveTechField = async () => {
    setLoading(true);
    try {
      await userService.registerTechnician({
        experience: techData.experience,
        specialty: techData.specialty,
        days: techData.days,
        schedule: techData.schedule,
      });

      setIsEditingExp(false);
      setIsEditingSpec(false);
      setIsEditingDays(false);
      setIsEditingSchedule(false);

      Alert.alert('Éxito', 'Información del perfil técnico actualizada.');
    } catch (error) {
      Alert.alert('Error', 'No se pudieron guardar los cambios.');
    } finally {
      setLoading(false);
    }
  };

  // Redirección directa a la pestaña de Perfil dentro del MainTabNavigator
  const handleReturnToUserProfile = () => {
    navigation?.navigate('Main', { screen: 'Perfil' });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* TopBar Superior */}
      <View style={styles.topBar}>
        <TouchableOpacity
          onPress={() => navigation?.navigate('TecnicoSolicitudesScreen')}
          style={styles.backBtn}
        >
          <Ionicons name="chevron-back" size={24} color={colors.textMain} />
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>Perfil de Técnico</Text>
      </View>

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Calificación Global */}
        <View style={styles.ratingContainer}>
          <Text style={styles.ratingTitle}>
            Calificación Global: <Text style={styles.ratingValue}>{techData.rating}</Text>
          </Text>
          <View style={styles.starsRow}>
            {[1, 2, 3, 4].map((star) => (
              <Ionicons key={star} name="star" size={28} color={colors.warning} />
            ))}
            <Ionicons name="star-half" size={28} color={colors.warning} />
          </View>
        </View>

        {/* Avatar e Identidad del Técnico */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarContainer}>
            <Ionicons name="person-outline" size={42} color={colors.textMuted} />
            <TouchableOpacity style={styles.avatarEditBadge}>
              <Ionicons name="pencil" size={12} color={colors.white} />
            </TouchableOpacity>
          </View>
          <View style={styles.nameRow}>
            <Text style={styles.userName}>{techData.nombre}</Text>
            <Ionicons name="pencil-outline" size={18} color={colors.textMain} style={{ marginLeft: 6 }} />
          </View>
          <Text style={styles.userLocation}>{techData.location}</Text>
        </View>

        {/* Campos Editables */}
        <View style={styles.fieldRow}>
          <View style={styles.inputFlex}>
            <InputField
              label="Años de Experiencia"
              value={techData.experience}
              onChangeText={(val) => setTechData({ ...techData, experience: val })}
              editable={isEditingExp}
            />
          </View>
          <TouchableOpacity
            style={[styles.editBtn, isEditingExp && styles.editBtnActive]}
            onPress={() => setIsEditingExp((prev) => !prev)}
          >
            <Ionicons
              name={isEditingExp ? 'checkmark' : 'pencil-outline'}
              size={18}
              color={isEditingExp ? colors.primary : colors.textMain}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.fieldRow}>
          <View style={styles.inputFlex}>
            <InputField
              label="Área de Especialidad"
              value={techData.specialty}
              onChangeText={(val) => setTechData({ ...techData, specialty: val })}
              editable={isEditingSpec}
            />
          </View>
          <TouchableOpacity
            style={[styles.editBtn, isEditingSpec && styles.editBtnActive]}
            onPress={() => setIsEditingSpec((prev) => !prev)}
          >
            <Ionicons
              name={isEditingSpec ? 'checkmark' : 'pencil-outline'}
              size={18}
              color={isEditingSpec ? colors.primary : colors.textMain}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.fieldRow}>
          <View style={styles.inputFlex}>
            <InputField
              label="Días Disponibles"
              value={techData.days}
              onChangeText={(val) => setTechData({ ...techData, days: val })}
              editable={isEditingDays}
            />
          </View>
          <TouchableOpacity
            style={[styles.editBtn, isEditingDays && styles.editBtnActive]}
            onPress={() => setIsEditingDays((prev) => !prev)}
          >
            <Ionicons
              name={isEditingDays ? 'checkmark' : 'pencil-outline'}
              size={18}
              color={isEditingDays ? colors.primary : colors.textMain}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.fieldRow}>
          <View style={styles.inputFlex}>
            <InputField
              label="Horas Disponibles"
              value={techData.schedule}
              onChangeText={(val) => setTechData({ ...techData, schedule: val })}
              editable={isEditingSchedule}
            />
          </View>
          <TouchableOpacity
            style={[styles.editBtn, isEditingSchedule && styles.editBtnActive]}
            onPress={() => setIsEditingSchedule((prev) => !prev)}
          >
            <Ionicons
              name={isEditingSchedule ? 'checkmark' : 'pencil-outline'}
              size={18}
              color={isEditingSchedule ? colors.primary : colors.textMain}
            />
          </TouchableOpacity>
        </View>

        {(isEditingExp || isEditingSpec || isEditingDays || isEditingSchedule) && (
          <PrimaryButton
            title="GUARDAR CAMBIOS"
            onPress={handleSaveTechField}
            loading={loading}
            style={styles.saveBtn}
          />
        )}

        {/* Botón que redirige explícitamente a la pestaña Perfil de Usuario */}
        <PrimaryButton
          title="Dirigir al Perfil de Usuario"
          onPress={handleReturnToUserProfile}
          variant="primary"
          style={styles.returnBtn}
        />
      </ScrollView>

      {/* Barra de Navegación del Técnico */}
      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={styles.navTab}
          onPress={() => navigation?.navigate('TecnicoSolicitudesScreen')}
        >
          <Text style={styles.navTabText}>SOLICITUDES</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navTab}
          onPress={() => navigation?.navigate('TecnicoHistorialScreen')}
        >
          <Text style={styles.navTabText}>HISTORIAL</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.navTab, styles.navTabActive]}>
          <Text style={[styles.navTabText, styles.navTabTextActive]}>PERFIL TÉCNICO</Text>
        </TouchableOpacity>
      </View>
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
  container: { padding: 16, paddingBottom: 80 },
  ratingContainer: { alignItems: 'center', marginBottom: 16 },
  ratingTitle: { fontSize: typography.fontSize.md, fontWeight: typography.fontWeight.semibold, color: colors.textMain, marginBottom: 6 },
  ratingValue: { fontWeight: typography.fontWeight.bold },
  starsRow: { flexDirection: 'row', gap: 4 },
  avatarSection: { alignItems: 'center', marginBottom: 20 },
  avatarContainer: {
    width: 90,
    height: 90,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: colors.textMuted,
    backgroundColor: colors.disabledBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    position: 'relative',
  },
  avatarEditBadge: { position: 'absolute', right: -4, bottom: -4, backgroundColor: colors.black, padding: 6, borderRadius: 12 },
  nameRow: { flexDirection: 'row', alignItems: 'center' },
  userName: { fontSize: typography.fontSize.xl, fontWeight: typography.fontWeight.bold, color: colors.textMain },
  userLocation: { fontSize: typography.fontSize.sm, color: colors.textMuted, marginTop: 2 },
  fieldRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  inputFlex: { flex: 1 },
  editBtn: { padding: 10, marginBottom: 14, marginLeft: 8, borderRadius: 8, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface },
  editBtnActive: { borderColor: colors.primary, backgroundColor: colors.primarySoft },
  saveBtn: { marginBottom: 12 },
  returnBtn: { marginTop: 8, marginBottom: 10 },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingVertical: 10,
    paddingHorizontal: 8,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  navTab: { borderWidth: 1, borderColor: colors.border, borderRadius: 20, paddingVertical: 6, paddingHorizontal: 14, backgroundColor: colors.surface },
  navTabActive: { backgroundColor: colors.primarySoft, borderColor: colors.primary },
  navTabText: { fontSize: typography.fontSize.xs, fontWeight: typography.fontWeight.bold, color: colors.textMuted },
  navTabTextActive: { color: colors.primary },
});