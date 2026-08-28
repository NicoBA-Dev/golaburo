import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Alert,
  Modal,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import InputField from '../../components/InputField';
import PrimaryButton from '../../components/PrimaryButton';
import { technicianService } from '../../services/technicianService';

const YEARS_OPTIONS = ['1 año', '2 años', '3 años', '4 años', '5+ años'];

export default function RegistroTecnicoScreen({ navigation }) {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [experience, setExperience] = useState('1 año');
  const [bio, setBio] = useState('Especialista disponible para trabajos del hogar.');
  const [rate, setRate] = useState('150');
  const [loading, setLoading] = useState(false);
  const [fetchingCats, setFetchingCats] = useState(true);

  const [modalType, setModalType] = useState(null); // 'years' | 'category'

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setFetchingCats(true);
      const data = await technicianService.getCategories();
      setCategories(data);
      if (data.length > 0) setSelectedCategory(data[0]);
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar las categorías de Supabase.');
    } finally {
      setFetchingCats(false);
    }
  };

  const handleSave = async () => {
    if (!selectedCategory) {
      Alert.alert('Error', 'Seleccione una categoría válida.');
      return;
    }
    if (!rate || isNaN(rate) || Number(rate) <= 0) {
      Alert.alert('Error', 'Ingrese una tarifa numérica válida mayor a 0.');
      return;
    }

    setLoading(true);
    try {
      const expYears = parseInt(experience, 10) || 1;
      await technicianService.registerTechnician({
        categoryId: selectedCategory.id,
        yearsExperience: expYears,
        bio,
        baseRate: Number(rate),
        coverageZones: ['Cercado', 'Queru Queru', 'Sarco'],
      });

      Alert.alert('¡Felicidades!', 'Tu perfil de técnico se guardó en Supabase.');
      navigation?.goBack();
    } catch (error) {
      Alert.alert('Error al Registrar', error.message || 'No se pudo guardar la información.');
    } finally {
      setLoading(false);
    }
  };

  const openPicker = (type) => setModalType(type);
  const closePicker = () => setModalType(null);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation?.goBack()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={colors.textMain} />
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>Registrarse como Técnico</Text>
      </View>

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {fetchingCats ? (
          <ActivityIndicator size="large" color={colors.primary} style={{ marginVertical: 30 }} />
        ) : (
          <>
            <Text style={styles.fieldLabel}>Especialidad / Categoría</Text>
            <TouchableOpacity style={styles.selectCard} onPress={() => openPicker('category')}>
              <Text style={styles.selectValue}>
                {selectedCategory ? selectedCategory.name : 'Seleccionar...'}
              </Text>
              <Ionicons name="chevron-down" size={20} color={colors.textMain} />
            </TouchableOpacity>

            <Text style={styles.fieldLabel}>Años de Experiencia</Text>
            <TouchableOpacity style={styles.selectCard} onPress={() => openPicker('years')}>
              <Text style={styles.selectValue}>{experience}</Text>
              <Ionicons name="chevron-down" size={20} color={colors.textMain} />
            </TouchableOpacity>

            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>Breve Descripción / Biografía</Text>
              <InputField
                value={bio}
                onChangeText={setBio}
                placeholder="Ej. Servicios rápidos con garantía..."
              />
            </View>

            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>Tarifa Base (Bs/hora)</Text>
              <InputField
                value={rate}
                onChangeText={(val) => setRate(val.replace(/[^0-9]/g, ''))}
                keyboardType="numeric"
                placeholder="Ej. 150"
              />
            </View>

            <PrimaryButton
              title="GUARDAR EN SUPABASE"
              onPress={handleSave}
              loading={loading}
              style={styles.btnPrimary}
            />

            <PrimaryButton
              title="CANCELAR"
              onPress={() => navigation?.goBack()}
              variant="outline"
              style={styles.btnSecondary}
            />
          </>
        )}
      </ScrollView>

      <Modal visible={Boolean(modalType)} transparent animationType="fade">
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={closePicker}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {modalType === 'category' ? 'Seleccione Categoría' : 'Años de Experiencia'}
            </Text>
            <FlatList
              data={modalType === 'category' ? categories : YEARS_OPTIONS}
              keyExtractor={(item) => (modalType === 'category' ? item.id : item)}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalOption}
                  onPress={() => {
                    if (modalType === 'category') setSelectedCategory(item);
                    else setExperience(item);
                    closePicker();
                  }}
                >
                  <Text style={styles.modalOptionText}>
                    {modalType === 'category' ? item.name : item}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
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
  container: { padding: 16, paddingBottom: 30 },
  fieldLabel: { fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.semibold, color: colors.textMain, marginBottom: 6 },
  selectCard: {
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectValue: { fontSize: typography.fontSize.base, color: colors.textMain },
  sectionCard: {
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
  },
  sectionTitle: { fontSize: typography.fontSize.base, fontWeight: typography.fontWeight.bold, color: colors.textMain, marginBottom: 10 },
  btnPrimary: { marginBottom: 10, backgroundColor: colors.primary },
  btnSecondary: { marginBottom: 16 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 },
  modalContent: { backgroundColor: colors.surface, borderRadius: 16, padding: 20, maxHeight: '60%' },
  modalTitle: { fontSize: typography.fontSize.md, fontWeight: typography.fontWeight.bold, marginBottom: 15, textAlign: 'center' },
  modalOption: { paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.border },
  modalOptionText: { fontSize: typography.fontSize.base, color: colors.textMain, textAlign: 'center' },
});