import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import InputField from '../../components/InputField';
import PrimaryButton from '../../components/PrimaryButton';
import { technicianService } from '../../services/technicianService';

// Mapa de conversión de categorías a profesiones
const PROFESSION_FORMATTER = {
  'Pintura': 'Pintor',
  'Plomería': 'Plomero',
  'Electricidad': 'Electricista',
  'Cerrajería': 'Cerrahero',
  'Reparación de electrodomésticos': 'Técnico de Electrodomésticos',
};

export default function PerfilTecnicoScreen({ navigation }) {
  const [techProfile, setTechProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Campos
  const [experience, setExperience] = useState('1');
  const [rate, setRate] = useState('0');
  const [bio, setBio] = useState('');

  // Estados de edición e inline saving
  const [isEditingRate, setIsEditingRate] = useState(false);
  const [isEditingBio, setIsEditingBio] = useState(false);

  const [isSavingRate, setIsSavingRate] = useState(false);
  const [isSavingBio, setIsSavingBio] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const data = await technicianService.getTechnicianProfile();
      if (data) {
        setTechProfile(data);
        setExperience(String(data.years_experience || 1));
        setRate(String(data.base_rate || 0));
        setBio(data.bio || '');
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo cargar el perfil técnico.');
    } finally {
      setLoading(false);
    }
  };

  const handleInlineSave = async (field, value) => {
    if (!techProfile) return;

    if (field === 'rate') setIsSavingRate(true);
    if (field === 'bio') setIsSavingBio(true);

    try {
      const updatedRate = field === 'rate' ? parseFloat(value) : parseFloat(rate);
      const updatedBio = field === 'bio' ? value : bio;

      await technicianService.registerTechnician({
        categoryId: techProfile.category_id,
        yearsExperience: techProfile.years_experience,
        bio: updatedBio,
        baseRate: updatedRate,
        coverageZones: techProfile.coverage_zones,
      });

      if (field === 'rate') setIsEditingRate(false);
      if (field === 'bio') setIsEditingBio(false);

    } catch (error) {
      Alert.alert('Error', 'No se pudieron guardar los cambios en Supabase.');
    } finally {
      setIsSavingRate(false);
      setIsSavingBio(false);
    }
  };

  const formatProfession = (categoryName) => {
    if (!categoryName) return 'Técnico';
    return PROFESSION_FORMATTER[categoryName] || categoryName;
  };

  const handleReturnToUserProfile = () => {
    navigation?.navigate('Main', { screen: 'Perfil' });
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.safeArea, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.topBar}>
        <Text style={styles.topBarTitle}>Perfil de Técnico</Text>
      </View>

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Calificación Global */}
        <View style={styles.ratingContainer}>
          <Text style={styles.ratingTitle}>
            Calificación Global: <Text style={styles.ratingValue}>{techProfile?.avg_rating || 0} / 5</Text>
          </Text>
          <View style={styles.starsRow}>
            {[1, 2, 3, 4, 5].map((star) => (
              <Ionicons
                key={star}
                name={star <= Math.round(techProfile?.avg_rating || 0) ? 'star' : 'star-outline'}
                size={24}
                color={colors.warning}
              />
            ))}
          </View>
        </View>

        {/* Avatar e Identidad con Profesión Formateada */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarContainer}>
            <Ionicons name="person-outline" size={42} color={colors.primary} />
          </View>
          <Text style={styles.userName}>{techProfile?.profiles?.full_name || 'Técnico Registrado'}</Text>
          <Text style={styles.professionText}>{formatProfession(techProfile?.categories?.name)}</Text>
        </View>

        {/* SECCIÓN DATOS TÉCNICOS */}
        <Text style={styles.sectionTitle}>Información de Técnico</Text>
        <View style={styles.cardSection}>

          {/* Campo: Años de Experiencia (No Editable) */}
          <View style={styles.fieldWrapper}>
            <View style={styles.inputContainer}>
              <InputField
                label="Años de Experiencia (No modificable)"
                value={`${experience} ${parseInt(experience, 10) === 1 ? 'año' : 'años'}`}
                editable={false}
              />
            </View>
          </View>

          {/* Campo: Tarifa Base por Hora */}
          <View style={styles.fieldWrapper}>
            <View style={styles.inputContainer}>
              <InputField
                label="Tarifa Base por Hora (Bs)"
                value={rate}
                onChangeText={setRate}
                keyboardType="numeric"
                editable={isEditingRate}
              />
            </View>
            <TouchableOpacity
              disabled={isSavingRate}
              style={[styles.editIconBtn, isEditingRate && styles.editIconBtnActive]}
              onPress={() => isEditingRate ? handleInlineSave('rate', rate) : setIsEditingRate(true)}
            >
              {isSavingRate ? (
                <ActivityIndicator size="small" color={colors.primary} />
              ) : (
                <Ionicons
                  name={isEditingRate ? 'checkmark' : 'pencil-outline'}
                  size={20}
                  color={isEditingRate ? colors.primary : colors.textMain}
                />
              )}
            </TouchableOpacity>
          </View>

          {/* Campo: Biografía / Descripción */}
          <View style={styles.fieldWrapper}>
            <View style={styles.inputContainer}>
              <InputField
                label="Biografía / Descripción"
                value={bio}
                onChangeText={setBio}
                editable={isEditingBio}
              />
            </View>
            <TouchableOpacity
              disabled={isSavingBio}
              style={[styles.editIconBtn, isEditingBio && styles.editIconBtnActive]}
              onPress={() => isEditingBio ? handleInlineSave('bio', bio) : setIsEditingBio(true)}
            >
              {isSavingBio ? (
                <ActivityIndicator size="small" color={colors.primary} />
              ) : (
                <Ionicons
                  name={isEditingBio ? 'checkmark' : 'pencil-outline'}
                  size={20}
                  color={isEditingBio ? colors.primary : colors.textMain}
                />
              )}
            </TouchableOpacity>
          </View>

        </View>

        {/* Botón de Redirección al Perfil de Usuario */}
        <PrimaryButton
          title="Dirigir al Perfil de Usuario"
          onPress={handleReturnToUserProfile}
          variant="primary"
          style={styles.returnBtn}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.surface,
  },
  topBarTitle: { fontSize: typography.fontSize.lg, fontWeight: typography.fontWeight.bold, color: colors.primary },
  container: { padding: 16, paddingBottom: 40 },
  ratingContainer: { alignItems: 'center', marginBottom: 16 },
  ratingTitle: { fontSize: typography.fontSize.md, fontWeight: typography.fontWeight.semibold, color: colors.textMain, marginBottom: 6 },
  ratingValue: { fontWeight: typography.fontWeight.bold },
  starsRow: { flexDirection: 'row', gap: 4 },
  avatarSection: { alignItems: 'center', marginBottom: 20 },
  avatarContainer: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  userName: { fontSize: typography.fontSize.xl, fontWeight: typography.fontWeight.bold, color: colors.textMain },
  professionText: { fontSize: typography.fontSize.md, color: colors.primary, marginTop: 2, fontWeight: typography.fontWeight.bold },
  sectionTitle: { fontSize: typography.fontSize.md, fontWeight: typography.fontWeight.bold, color: colors.textMuted, marginBottom: 8, marginLeft: 4 },
  cardSection: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.border,
    elevation: 2,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
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
  returnBtn: { marginTop: 4, marginBottom: 10 },
});