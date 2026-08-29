import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import CustomTextInput from '../../components/forms/CustomTextInput';
import { technicianService } from '../../services/technicianService';

export default function EditPerfilTecnicoScreen({ navigation, route }) {
  const techProfile = route.params?.techProfile;

  const [rate, setRate] = useState(String(techProfile?.base_rate || '0'));
  const [bio, setBio] = useState(techProfile?.bio || '');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!rate || isNaN(rate) || Number(rate) <= 0) {
      Alert.alert('Campo requerido', 'Por favor ingresa una tarifa válida por hora.');
      return;
    }

    setIsSaving(true);
    try {
      await technicianService.registerTechnician({
        categoryId: techProfile.category_id,
        yearsExperience: techProfile.years_experience,
        bio: bio.trim(),
        baseRate: parseFloat(rate),
        coverageZones: techProfile.coverage_zones,
      });

      Alert.alert('¡Éxito!', 'Tu información técnica se actualizó correctamente.');
      navigation.goBack();
    } catch (error) {
      console.error('Error guardando perfil técnico:', error);
      Alert.alert('Error', 'No pudimos guardar los cambios en Supabase.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView style={styles.keyboardView} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="close" size={26} color={colors.textMain} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Editar Perfil Técnico</Text>
          <View style={{ width: 26 }} />
        </View>

        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          {/* Avatar del Técnico */}
          <View style={styles.avatarSection}>
            <View style={styles.avatarContainer}>
              {techProfile?.profiles?.avatar_url ? (
                <Image source={{ uri: techProfile.profiles.avatar_url }} style={styles.avatarImage} />
              ) : (
                <Ionicons name="person" size={50} color={colors.primarySoft} />
              )}
            </View>
            <Text style={styles.userNameText}>{techProfile?.profiles?.full_name}</Text>
          </View>

          {/* Formulario de Edición Técnica */}
          <CustomTextInput
            label="Tarifa Base por Hora (Bs)"
            placeholder="Ej. 150"
            value={rate}
            onChangeText={setRate}
            keyboardType="numeric"
            iconName="cash-outline"
          />

          <CustomTextInput
            label="Biografía / Descripción Profesional"
            placeholder="Describe tus servicios, experiencia y garantías..."
            value={bio}
            onChangeText={setBio}
            multiline={true}
            numberOfLines={4}
            iconName="document-text-outline"
          />

          <Text style={styles.infoText}>
            Nota: Los años de experiencia y la especialidad principal están protegidos para mantener la validez de las calificaciones[cite: 16].
          </Text>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.saveButton, isSaving && styles.disabledButton]}
            onPress={handleSave}
            disabled={isSaving}
          >
            {isSaving ? (
              <ActivityIndicator size="small" color={colors.white} />
            ) : (
              <Text style={styles.saveButtonText}>GUARDAR CAMBIOS</Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  keyboardView: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: { padding: 5, marginLeft: -5 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: colors.textMain },
  container: { padding: 20 },

  avatarSection: { alignItems: 'center', marginBottom: 25, marginTop: 10 },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.primary,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  avatarImage: { width: '100%', height: '100%' },
  userNameText: { fontSize: 18, fontWeight: 'bold', color: colors.textMain, marginTop: 10 },

  infoText: { fontSize: 13, color: colors.textMuted, textAlign: 'center', marginTop: 10, lineHeight: 20 },
  footer: { padding: 20, backgroundColor: colors.surface, borderTopWidth: 1, borderTopColor: colors.border },
  saveButton: { backgroundColor: colors.primary, height: 55, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  disabledButton: { opacity: 0.7 },
  saveButtonText: { color: colors.white, fontSize: 15, fontWeight: 'bold' },
});