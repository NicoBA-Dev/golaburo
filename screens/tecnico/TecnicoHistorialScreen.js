import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Modal,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import InputField from '../../components/InputField';
import PrimaryButton from '../../components/PrimaryButton';

// Datos de prueba ampliados
const INITIAL_HISTORIAL = [
  {
    id: '101',
    servicio: 'Mantenimiento de Calefón',
    cliente: 'Carlos Mendoza',
    telefono: '76543210',
    zona: 'Queru Queru (Cercado)',
    direccion: 'Av. América #1234',
    fecha: '10/08/2026',
    monto: 'Bs. 150',
    estado: 'En Proceso', // 'Completado' | 'En Proceso' | 'Cancelado'
    rating: 5,
    comentario: 'Revisión general de fuga de gas y limpieza de inyectores.',
  },
  {
    id: '102',
    servicio: 'Cambio de llaves de paso',
    cliente: 'Ana Patricia V.',
    telefono: '71234567',
    zona: 'Sarco',
    direccion: 'Calle Melchor Pérez #567',
    fecha: '05/08/2026',
    monto: 'Bs. 90',
    estado: 'Completado',
    rating: 4,
    comentario: 'Buen servicio, resolvió el problema rápido.',
  },
  {
    id: '103',
    servicio: 'Instalación de lavadora',
    cliente: 'Roberto S.',
    telefono: '60708090',
    zona: 'Cala Cala',
    direccion: 'Av. Juan de la Rosa #890',
    fecha: '28/07/2026',
    monto: 'Bs. 120',
    estado: 'Cancelado',
    rating: null,
    comentario: 'El cliente canceló la solicitud por motivos personales.',
  },
];

export default function TecnicoHistorialScreen() {
  const [historial, setHistorial] = useState(INITIAL_HISTORIAL);
  const [filter, setFilter] = useState('Todos');
  const [search, setSearch] = useState('');
  
  // Estado para el modal de detalle
  const [selectedJob, setSelectedJob] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const handleOpenDetail = (job) => {
    setSelectedJob(job);
    setModalVisible(true);
  };

  const handleUpdateStatus = (newStatus) => {
    if (!selectedJob) return;

    setHistorial((prev) =>
      prev.map((item) =>
        item.id === selectedJob.id ? { ...item, estado: newStatus } : item
      )
    );

    setSelectedJob((prev) => ({ ...prev, estado: newStatus }));
    setModalVisible(false);
    Alert.alert('Estado Actualizado', `La solicitud ha sido marcada como "${newStatus}".`);
  };

  const filteredHistorial = historial.filter((item) => {
    const matchesFilter = filter === 'Todos' || item.estado === filter;
    const matchesSearch =
      item.servicio.toLowerCase().includes(search.toLowerCase()) ||
      item.cliente.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* TopBar Superior Sin botones de redirección */}
      <View style={styles.topBar}>
        <Text style={styles.topBarTitle}>Historial de Trabajos</Text>
      </View>

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Buscador */}
        <InputField
          placeholder="Buscar por trabajo o cliente..."
          value={search}
          onChangeText={setSearch}
        />

        {/* Chips de Filtro */}
        <View style={styles.filterRow}>
          {['Todos', 'En Proceso', 'Completado', 'Cancelado'].map((status) => (
            <TouchableOpacity
              key={status}
              style={[
                styles.filterChip,
                filter === status && styles.filterChipActive,
              ]}
              onPress={() => setFilter(status)}
            >
              <Text
                style={[
                  styles.filterText,
                  filter === status && styles.filterTextActive,
                ]}
              >
                {status}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Lista de Trabajos (Interactivas para abrir modal) */}
        {filteredHistorial.map((item) => {
          const isCompleted = item.estado === 'Completado';
          const isCancel = item.estado === 'Cancelado';

          return (
            <TouchableOpacity
              key={item.id}
              style={styles.card}
              activeOpacity={0.85}
              onPress={() => handleOpenDetail(item)}
            >
              <View style={styles.cardHeader}>
                <Text style={styles.serviceTitle}>{item.servicio}</Text>
                <Text
                  style={[
                    styles.statusBadge,
                    isCompleted
                      ? styles.badgeSuccess
                      : isCancel
                      ? styles.badgeDanger
                      : styles.badgeWarning,
                  ]}
                >
                  {item.estado}
                </Text>
              </View>

              <Text style={styles.infoText}>
                <Text style={styles.boldText}>Cliente: </Text>
                {item.cliente}
              </Text>

              <View style={styles.detailRow}>
                <Text style={styles.infoText}>
                  <Text style={styles.boldText}>Fecha: </Text>
                  {item.fecha}
                </Text>
                <Text style={styles.montoText}>{item.monto}</Text>
              </View>

              {isCompleted && item.rating && (
                <View style={styles.reviewBox}>
                  <View style={styles.starsRow}>
                    {[...Array(5)].map((_, i) => (
                      <Ionicons
                        key={i}
                        name={i < item.rating ? 'star' : 'star-outline'}
                        size={16}
                        color={colors.warning}
                      />
                    ))}
                  </View>
                  <Text style={styles.comentarioText}>"{item.comentario}"</Text>
                </View>
              )}

              {isCancel && (
                <Text style={styles.cancelNotice}>{item.comentario}</Text>
              )}

              <View style={styles.tapNoticeRow}>
                <Text style={styles.tapNoticeText}>Toca para ver o modificar detalles</Text>
                <Ionicons name="chevron-forward" size={14} color={colors.primary} />
              </View>
            </TouchableOpacity>
          );
        })}

        {filteredHistorial.length === 0 && (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No se encontraron registros.</Text>
          </View>
        )}
      </ScrollView>

      {/* MODAL DETALLADO DE SOLICITUD */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Detalle del Trabajo</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close-circle" size={28} color={colors.textMuted} />
              </TouchableOpacity>
            </View>

            {selectedJob && (
              <ScrollView showsVerticalScrollIndicator={false}>
                <Text style={styles.modalJobTitle}>{selectedJob.servicio}</Text>

                <View style={styles.modalSection}>
                  <Text style={styles.modalLabel}>Estado Actual:</Text>
                  <Text style={styles.modalValueHighlight}>{selectedJob.estado}</Text>
                </View>

                <View style={styles.modalSection}>
                  <Text style={styles.modalLabel}>Cliente:</Text>
                  <Text style={styles.modalValue}>{selectedJob.cliente} ({selectedJob.telefono})</Text>
                </View>

                <View style={styles.modalSection}>
                  <Text style={styles.modalLabel}>Ubicación:</Text>
                  <Text style={styles.modalValue}>{selectedJob.direccion} - {selectedJob.zona}</Text>
                </View>

                <View style={styles.modalSection}>
                  <Text style={styles.modalLabel}>Fecha de Servicio:</Text>
                  <Text style={styles.modalValue}>{selectedJob.fecha}</Text>
                </View>

                <View style={styles.modalSection}>
                  <Text style={styles.modalLabel}>Monto Acordado:</Text>
                  <Text style={styles.modalPrice}>{selectedJob.monto}</Text>
                </View>

                <View style={styles.modalSection}>
                  <Text style={styles.modalLabel}>Notas / Descripción:</Text>
                  <Text style={styles.modalValue}>{selectedJob.comentario}</Text>
                </View>

                {/* BOTONES DE CAMBIO DE ESTADO */}
                <Text style={styles.actionHeaderTitle}>Cambiar Estado de la Solicitud:</Text>

                <PrimaryButton
                  title="MARCAR COMO COMPLETADO"
                  onPress={() => handleUpdateStatus('Completado')}
                  variant="primary"
                  style={styles.actionBtn}
                />

                <PrimaryButton
                  title="MARCAR EN PROCESO / EN CURSO"
                  onPress={() => handleUpdateStatus('En Proceso')}
                  style={[styles.actionBtn, { backgroundColor: colors.textMain }]}
                />

                <PrimaryButton
                  title="CANCELAR SOLICITUD"
                  onPress={() => handleUpdateStatus('Cancelado')}
                  variant="outline"
                  style={[styles.actionBtn, { borderColor: colors.error }]}
                />
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
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
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.surface,
  },
  topBarTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
  },
  container: {
    padding: 16,
    paddingBottom: 40,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  filterChip: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  filterChipActive: {
    backgroundColor: colors.primarySoft,
    borderColor: colors.primary,
  },
  filterText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textMuted,
  },
  filterTextActive: {
    color: colors.primary,
    fontWeight: typography.fontWeight.bold,
  },
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  serviceTitle: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    color: colors.textMain,
    flex: 1,
  },
  statusBadge: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 8,
    overflow: 'hidden',
  },
  badgeSuccess: {
    backgroundColor: colors.successSoft,
    color: colors.success,
  },
  badgeDanger: {
    backgroundColor: colors.errorSoft,
    color: colors.error,
  },
  badgeWarning: {
    backgroundColor: colors.primarySoft,
    color: colors.primary,
  },
  infoText: {
    fontSize: typography.fontSize.sm,
    color: colors.textMain,
    marginBottom: 4,
  },
  boldText: {
    fontWeight: typography.fontWeight.bold,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  montoText: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
  },
  reviewBox: {
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 10,
    marginTop: 4,
  },
  starsRow: {
    flexDirection: 'row',
    gap: 2,
    marginBottom: 4,
  },
  comentarioText: {
    fontSize: typography.fontSize.xs,
    color: colors.textMuted,
    fontStyle: 'italic',
  },
  cancelNotice: {
    fontSize: typography.fontSize.xs,
    color: colors.error,
    marginTop: 4,
    fontStyle: 'italic',
  },
  tapNoticeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 10,
    gap: 4,
  },
  tapNoticeText: {
    fontSize: typography.fontSize.xs,
    color: colors.primary,
    fontWeight: typography.fontWeight.medium,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 40,
  },
  emptyText: {
    fontSize: typography.fontSize.md,
    color: colors.textMuted,
  },

  /* Modal Estilos */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.textMain,
  },
  modalJobTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
    marginBottom: 16,
  },
  modalSection: {
    marginBottom: 12,
  },
  modalLabel: {
    fontSize: typography.fontSize.xs,
    color: colors.textMuted,
    fontWeight: typography.fontWeight.semibold,
  },
  modalValue: {
    fontSize: typography.fontSize.sm,
    color: colors.textMain,
    marginTop: 2,
  },
  modalValueHighlight: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
    marginTop: 2,
  },
  modalPrice: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
    marginTop: 2,
  },
  actionHeaderTitle: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    color: colors.textMain,
    marginTop: 16,
    marginBottom: 10,
  },
  actionBtn: {
    marginBottom: 10,
  },
});