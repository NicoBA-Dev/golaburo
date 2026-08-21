import React, { useState } from 'react';
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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import InputField from '../../components/InputField';
import PrimaryButton from '../../components/PrimaryButton';
import { userService } from '../../services/userService';

// Listas de selección
const YEARS_OPTIONS = ['1 año', '2 años', '3 años', '4 años', '5+ años'];

// TODO: Para añadir más áreas en el futuro, agregar aquí o consumir desde la tabla "categorias" de Supabase
const SPECIALTY_OPTIONS = ['Plomería', 'Electricista', 'Cerrajería', 'Pintura'];

const DAYS_OPTIONS = [
  'Lunes a Viernes',
  'Lunes a Sábado',
  'Fines de Semana',
  'Todos los días',
];

const SCHEDULE_OPTIONS = [
  'Media Jornada (08:00 AM - 12:00 PM)',
  'Media Jornada (02:00 PM - 06:00 PM)',
  'Jornada Completa (08:00 AM - 18:00 PM)',
];

export default function RegistroTecnicoScreen({ navigation }) {
  const [experience, setExperience] = useState('1 año');
  const [specialty, setSpecialty] = useState('Plomería');
  const [days, setDays] = useState('Lunes a Viernes');
  const [schedule, setSchedule] = useState('Jornada Completa (08:00 AM - 18:00 PM)');
  const [rate, setRate] = useState('150');
  const [loading, setLoading] = useState(false);

  // Estados para Modales de Selección
  const [modalType, setModalType] = useState(null); // 'years' | 'specialty' | 'days' | 'schedule'

  const handleSave = async () => {
    if (!rate || isNaN(rate) || Number(rate) <= 0) {
      Alert.alert('Error', 'Ingrese una tarifa numérica válida mayor a 0.');
      return;
    }

    setLoading(true);
    try {
      await userService.registerTechnician({
        experience,
        specialty,
        days,
        schedule,
        rate: Number(rate),
      });

      Alert.alert('¡Felicidades!', 'Tu registro como técnico se ha completado.');
      navigation?.goBack();
    } catch (error) {
      Alert.alert('Error', 'No se pudo guardar la información.');
    } finally {
      setLoading(false);
    }
  };

  const openPicker = (type) => setModalType(type);
  const closePicker = () => setModalType(null);

  const getModalData = () => {
    switch (modalType) {
      case 'years': return YEARS_OPTIONS;
      case 'specialty': return SPECIALTY_OPTIONS;
      case 'days': return DAYS_OPTIONS;
      case 'schedule': return SCHEDULE_OPTIONS;
      default: return [];
    }
  };

  const handleSelectOption = (item) => {
    if (modalType === 'years') setExperience(item);
    if (modalType === 'specialty') setSpecialty(item);
    if (modalType === 'days') setDays(item);
    if (modalType === 'schedule') setSchedule(item);
    closePicker();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* TopBar Superior */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation?.goBack()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={colors.textMain} />
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>Registrarse como Técnico</Text>
      </View>

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        
        {/* Select: Años de Experiencia */}
        <Text style={styles.fieldLabel}>Años de Experiencia</Text>
        <TouchableOpacity style={styles.selectCard} onPress={() => openPicker('years')}>
          <Text style={styles.selectValue}>{experience}</Text>
          <Ionicons name="chevron-down" size={20} color={colors.textMain} />
        </TouchableOpacity>

        {/* Select: Área de Especialidad */}
        <Text style={styles.fieldLabel}>Área de Especialidad</Text>
        <TouchableOpacity style={styles.selectCard} onPress={() => openPicker('specialty')}>
          <Text style={styles.selectValue}>{specialty}</Text>
          <Ionicons name="chevron-down" size={20} color={colors.textMain} />
        </TouchableOpacity>

        {/* Configurar Disponibilidad */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Configurar Disponibilidad</Text>
          
          <Text style={styles.subLabel}>Días Disponibles</Text>
          <TouchableOpacity style={styles.subSelectCard} onPress={() => openPicker('days')}>
            <Text style={styles.subSelectValue}>{days}</Text>
            <Ionicons name="chevron-down" size={18} color={colors.textMain} />
          </TouchableOpacity>

          <Text style={styles.subLabel}>Horario / Jornada</Text>
          <TouchableOpacity style={styles.subSelectCard} onPress={() => openPicker('schedule')}>
            <Text style={styles.subSelectValue}>{schedule}</Text>
            <Ionicons name="chevron-down" size={18} color={colors.textMain} />
          </TouchableOpacity>
        </View>

        {/* Tarifa Recomendada */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Tarifa Recomendada (Bs/hora)</Text>
          <Text style={styles.helperText}>
            Ingrese el monto por hora recomendado para sus servicios (solo números):
          </Text>
          
          <InputField
            value={rate}
            onChangeText={(val) => setRate(val.replace(/[^0-9]/g, ''))}
            keyboardType="numeric"
            placeholder="Ej. 150"
          />
        </View>

        {/* Botones de Acción */}
        <PrimaryButton
          title="GUARDAR Y CONTINUAR"
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
      </ScrollView>

      {/* Modal de Selección Genérico */}
      <Modal visible={Boolean(modalType)} transparent animationType="fade">
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={closePicker}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Seleccione una opción</Text>
            <FlatList
              data={getModalData()}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.modalOption} onPress={() => handleSelectOption(item)}>
                  <Text style={styles.modalOptionText}>{item}</Text>
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
  fieldLabel: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textMain,
    marginBottom: 6,
  },
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
  subLabel: { fontSize: typography.fontSize.xs, fontWeight: typography.fontWeight.semibold, color: colors.textMuted, marginBottom: 4 },
  subSelectCard: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  subSelectValue: { fontSize: typography.fontSize.xs, color: colors.textMain, flex: 1 },
  helperText: { fontSize: typography.fontSize.xs, color: colors.textMuted, marginBottom: 10 },
  btnPrimary: { marginBottom: 10, backgroundColor: colors.black },
  btnSecondary: { marginBottom: 16 },
  
  // Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 },
  modalContent: { backgroundColor: colors.surface, borderRadius: 16, padding: 20, maxHeight: '60%' },
  modalTitle: { fontSize: typography.fontSize.md, fontWeight: typography.fontWeight.bold, marginBottom: 15, textAlign: 'center' },
  modalOption: { paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.border },
  modalOptionText: { fontSize: typography.fontSize.base, color: colors.textMain, textAlign: 'center' },
});