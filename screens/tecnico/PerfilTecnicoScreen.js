import React, { useState, useCallback } from 'react';
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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';

import { colors } from '../../theme/colors';
import { technicianService } from '../../services/technicianService';

const PROFESSION_FORMATTER = {
  Pintura: 'Pintor',
  Plomería: 'Plomero',
  Electricidad: 'Electricista',
  Cerrajería: 'Cerrajero',
  'Reparación de electrodomésticos': 'Técnico de Electrodomésticos',
};

export default function PerfilTecnicoScreen({ navigation }) {
  const [techProfile, setTechProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      fetchProfile();
    }, [])
  );

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const data = await technicianService.getTechnicianProfile();
      if (data) {
        setTechProfile(data);
      }
    } catch (error) {
      console.error('Error cargando perfil técnico:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatProfession = (categoryName) => {
    if (!categoryName) return 'Profesional';
    return PROFESSION_FORMATTER[categoryName] || categoryName;
  };

  const handleReturnToUserProfile = () => {
    navigation?.navigate('Main', { screen: 'Perfil' });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation?.goBack()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={26} color={colors.textMain} />
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>Perfil Profesional</Text>
        <View style={{ width: 34 }} />
      </View>

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
          {/* Cabecera del Perfil Técnico */}
          <View style={styles.header}>
            <View style={styles.avatarContainer}>
              {techProfile?.profiles?.avatar_url ? (
                <Image source={{ uri: techProfile.profiles.avatar_url }} style={styles.avatarImage} />
              ) : (
                <Ionicons name="person" size={50} color={colors.primarySoft} />
              )}
            </View>

            <Text style={styles.name}>{techProfile?.profiles?.full_name || 'Técnico Registrado'}</Text>
            <Text style={styles.professionText}>{formatProfession(techProfile?.categories?.name)}</Text>

            {/* Valoración por estrellas */}
            <View style={styles.ratingRow}>
              {[1, 2, 3, 4, 5].map((star) => (
                <Ionicons
                  key={star}
                  name={star <= Math.round(techProfile?.avg_rating || 0) ? 'star' : 'star-outline'}
                  size={18}
                  color={colors.warning}
                />
              ))}
              <Text style={styles.ratingText}>({techProfile?.avg_rating || 0}/5)</Text>
            </View>

            <TouchableOpacity
              style={styles.editProfileBtn}
              activeOpacity={0.8}
              onPress={() => {
                // Busca la pantalla en la pila global
                navigation.getParent()?.navigate('EditPerfilTecnico', { techProfile }) ||
                  navigation.navigate('EditPerfilTecnico', { techProfile });
              }}
            >
              <Ionicons name="pencil" size={16} color={colors.white} style={{ marginRight: 6 }} />
              <Text style={styles.editProfileText}>Editar Perfil Técnico</Text>
            </TouchableOpacity>
          </View>

          {/* Tarjeta de Resumen Técnico */}
          <Text style={styles.sectionTitle}>Información Técnica</Text>
          <View style={styles.cardSection}>
            <View style={styles.infoRow}>
              <Ionicons name="time-outline" size={22} color={colors.primary} />
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>Experiencia</Text>
                <Text style={styles.infoValue}>
                  {techProfile?.years_experience || 1} {techProfile?.years_experience === 1 ? 'año' : 'años'}
                </Text>
              </View>
            </View>

            <View style={[styles.infoRow, styles.borderTop]}>
              <Ionicons name="cash-outline" size={22} color={colors.primary} />
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>Tarifa Base por Hora</Text>
                <Text style={styles.infoValue}>Bs. {techProfile?.base_rate || 0} / hr</Text>
              </View>
            </View>

            <View style={[styles.infoRow, styles.borderTop]}>
              <Ionicons name="document-text-outline" size={22} color={colors.primary} />
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>Biografía / Descripción</Text>
                <Text style={styles.infoValue}>{techProfile?.bio || 'Sin biografía registrada.'}</Text>
              </View>
            </View>
          </View>

          {/* Botón de retorno al Perfil de Usuario */}
          <View style={styles.workerSection}>
            <TouchableOpacity
              style={[styles.actionBtn, { backgroundColor: colors.primary }]}
              onPress={handleReturnToUserProfile}
              activeOpacity={0.85}
            >
              <Ionicons name="person-circle-outline" size={20} color={colors.white} style={{ marginRight: 8 }} />
              <Text style={styles.actionBtnText}>IR A MI PERFIL DE USUARIO</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 15,
    backgroundColor: colors.surface,
  },
  backBtn: { padding: 4 },
  topBarTitle: { fontSize: 18, fontWeight: 'bold', color: colors.textMain },
  container: { padding: 20, paddingBottom: 40 },

  header: { alignItems: 'center', marginBottom: 25, paddingTop: 10 },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.border,
    overflow: 'hidden',
    marginBottom: 12,
  },
  avatarImage: { width: '100%', height: '100%' },
  name: { fontSize: 24, fontWeight: '900', color: colors.textMain, marginBottom: 2 },
  professionText: { fontSize: 15, color: colors.primary, fontWeight: 'bold', marginBottom: 8 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 15 },
  ratingText: { fontSize: 13, color: colors.textMuted, marginLeft: 4, fontWeight: '600' },
  editProfileBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  editProfileText: { color: colors.white, fontSize: 14, fontWeight: 'bold' },

  sectionTitle: { fontSize: 14, fontWeight: 'bold', color: colors.textMuted, marginBottom: 10, marginLeft: 5, textTransform: 'uppercase' },
  cardSection: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 25,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },

  infoRow: { flexDirection: 'row', alignItems: 'flex-start', paddingVertical: 8 },
  borderTop: { borderTopWidth: 1, borderTopColor: colors.border, marginTop: 12, paddingTop: 14 },
  infoTextContainer: { marginLeft: 14, flex: 1 },
  infoLabel: { fontSize: 12, color: colors.textMuted, fontWeight: '600', marginBottom: 2 },
  infoValue: { fontSize: 15, color: colors.textMain, fontWeight: '500', lineHeight: 20 },

  workerSection: { marginTop: 10 },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
    borderRadius: 14,
    marginBottom: 15,
  },
  actionBtnText: { fontSize: 14, fontWeight: 'bold', color: colors.white, letterSpacing: 0.5 },
});