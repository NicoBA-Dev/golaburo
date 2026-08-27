import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Modal,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import InputField from '../../components/InputField';
import PrimaryButton from '../../components/PrimaryButton';
import { technicianService } from '../../services/technicianService';

export default function TecnicoHistorialScreen() {
  const [historial, setHistorial] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('Todos');
  const [search, setSearch] = useState('');

  const [selectedJob, setSelectedJob] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const data = await technicianService.getRequestsHistory();
      setHistorial(data);
    } catch (error) {
      Alert.alert('Error', 'No se pudo obtener el historial de Supabase.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleOpenDetail = (job) => {
    setSelectedJob(job);
    setModalVisible(true);
  };

  const handleUpdateStatus = async (dbStatus) => {
    if (!selectedJob) return;

    try {
      await technicianService.updateRequestStatus(selectedJob.id, dbStatus);
      
      setHistorial((prev) =>
        prev.map((item) =>
          item.id === selectedJob.id ? { ...item, status: dbStatus } : item
        )
      );

      setModalVisible(false);
      Alert.alert('Éxito', 'El estado fue actualizado en Supabase.');
    } catch (error) {
      Alert.alert('Error', error.message || 'No se pudo actualizar el estado.');
    }
  };

  const mapStatusLabel = (status) => {
    switch (status) {
      case 'accepted': return 'En Proceso';
      case 'completed': return 'Completado';
      case 'rejected': return 'Cancelado';
      default: return status;
    }
  };

  const filteredHistorial = historial.filter((item) => {
    const labelStatus = mapStatusLabel(item.status);
    const matchesFilter = filter === 'Todos' || labelStatus === filter;
    const matchesSearch =
      item.description?.toLowerCase().includes(search.toLowerCase()) ||
      item.client?.full_name?.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.topBar}>
        <Text style={styles.topBarTitle}>Historial de Trabajos</Text>
      </View>

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <InputField
          placeholder="Buscar por trabajo o cliente..."
          value={search}
          onChangeText={setSearch}
        />

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

        {loading ? (
          <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 30 }} />
        ) : (
          filteredHistorial.map((item) => {
            const isCompleted = item.status === 'completed';
            const isCancel = item.status === 'rejected';

            return (
              <TouchableOpacity
                key={item.id}
                style={styles.card}
                activeOpacity={0.85}
                onPress={() => handleOpenDetail(item)}
              >
                <View style={styles.cardHeader}>
                  <Text style={styles.serviceTitle}>{item.category?.name || 'Servicio'}</Text>
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
                    {mapStatusLabel(item.status)}
                  </Text>
                </View>

                <Text style={styles.infoText}>
                  <Text style={styles.boldText}>Cliente: </Text>
                  {item.client?.full_name || 'Cliente'}
                </Text>

                <View style={styles.detailRow}>
                  <Text style={styles.infoText}>
                    <Text style={styles.boldText}>Fecha: </Text>
                    {item.suggested_date}
                  </Text>
                  <Text style={styles.montoText}>{item.zone}</Text>
                </View>

                <View style={styles.tapNoticeRow}>
                  <Text style={styles.tapNoticeText}>Toca para ver o modificar detalles</Text>
                  <Ionicons name="chevron-forward" size={14} color={colors.primary} />
                </View>
              </TouchableOpacity>
            );
          })
        )}

        {!loading && filteredHistorial.length === 0 && (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No se encontraron registros en la base de datos.</Text>
          </View>
        )}
      </ScrollView>

      {/* MODAL DETALLADO DE SOLICITUD */}
      <Modal
        visible={modalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
        >
          <TouchableOpacity
            activeOpacity={1}
            style={styles.modalContainer}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={styles.modalDragIndicator} />

            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Detalle del Trabajo</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close-circle" size={26} color={colors.textMuted} />
              </TouchableOpacity>
            </View>

            {selectedJob && (
              <ScrollView showsVerticalScrollIndicator={false}>
                <Text style={styles.modalJobTitle}>{selectedJob.category?.name}</Text>

                <View style={styles.modalSection}>
                  <Text style={styles.modalLabel}>Estado Actual:</Text>
                  <Text style={styles.modalValueHighlight}>{mapStatusLabel(selectedJob.status)}</Text>
                </View>

                <View style={styles.modalSection}>
                  <Text style={styles.modalLabel}>Cliente:</Text>
                  <Text style={styles.modalValue}>
                    {selectedJob.client?.full_name} ({selectedJob.client?.phone || 'Sin Teléfono'})
                  </Text>
                </View>

                <View style={styles.modalSection}>
                  <Text style={styles.modalLabel}>Ubicación:</Text>
                  <Text style={styles.modalValue}>
                    {selectedJob.address} - {selectedJob.zone}
                  </Text>
                </View>

                <View style={styles.modalSection}>
                  <Text style={styles.modalLabel}>Descripción:</Text>
                  <Text style={styles.modalValue}>{selectedJob.description}</Text>
                </View>

                <Text style={styles.actionHeaderTitle}>Cambiar Estado en Supabase:</Text>

                <PrimaryButton
                  title="MARCAR COMO COMPLETADO"
                  onPress={() => handleUpdateStatus('completed')}
                  variant="primary"
                  style={styles.actionBtn}
                />

                <PrimaryButton
                  title="MARCAR EN PROCESO / EN CURSO"
                  onPress={() => handleUpdateStatus('accepted')}
                  style={[styles.actionBtn, { backgroundColor: colors.textMain }]}
                />

                <PrimaryButton
                  title="CANCELAR SOLICITUD"
                  onPress={() => handleUpdateStatus('rejected')}
                  variant="outline"
                  style={[styles.actionBtn, { borderColor: colors.error }]}
                />
              </ScrollView>
            )}
          </TouchableOpacity>
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
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.surface,
  },
  topBarTitle: { fontSize: typography.fontSize.lg, fontWeight: typography.fontWeight.bold, color: colors.primary },
  container: { padding: 16, paddingBottom: 40 },
  filterRow: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  filterChip: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  filterChipActive: { backgroundColor: colors.primarySoft, borderColor: colors.primary },
  filterText: { fontSize: typography.fontSize.xs, fontWeight: typography.fontWeight.semibold, color: colors.textMuted },
  filterTextActive: { color: colors.primary, fontWeight: typography.fontWeight.bold },
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  serviceTitle: { fontSize: typography.fontSize.md, fontWeight: typography.fontWeight.bold, color: colors.textMain, flex: 1 },
  statusBadge: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 8,
    overflow: 'hidden',
  },
  badgeSuccess: { backgroundColor: colors.successSoft, color: colors.success },
  badgeDanger: { backgroundColor: colors.errorSoft, color: colors.error },
  badgeWarning: { backgroundColor: colors.primarySoft, color: colors.primary },
  infoText: { fontSize: typography.fontSize.sm, color: colors.textMain, marginBottom: 4 },
  boldText: { fontWeight: typography.fontWeight.bold },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  montoText: { fontSize: typography.fontSize.md, fontWeight: typography.fontWeight.bold, color: colors.primary },
  tapNoticeRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', marginTop: 10, gap: 4 },
  tapNoticeText: { fontSize: typography.fontSize.xs, color: colors.primary, fontWeight: typography.fontWeight.medium },
  emptyContainer: { alignItems: 'center', marginTop: 40 },
  emptyText: { fontSize: typography.fontSize.md, color: colors.textMuted },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(15, 23, 42, 0.25)', justifyContent: 'flex-end' },
  modalContainer: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 28,
    maxHeight: '80%',
    elevation: 20,
  },
  modalDragIndicator: {
    width: 38,
    height: 4,
    backgroundColor: colors.border,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 12,
  },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  modalTitle: { fontSize: typography.fontSize.lg, fontWeight: typography.fontWeight.bold, color: colors.textMain },
  modalJobTitle: { fontSize: typography.fontSize.xl, fontWeight: typography.fontWeight.bold, color: colors.primary, marginBottom: 14 },
  modalSection: { marginBottom: 10 },
  modalLabel: { fontSize: typography.fontSize.xs, color: colors.textMuted, fontWeight: typography.fontWeight.semibold },
  modalValue: { fontSize: typography.fontSize.sm, color: colors.textMain, marginTop: 2 },
  modalValueHighlight: { fontSize: typography.fontSize.md, fontWeight: typography.fontWeight.bold, color: colors.primary, marginTop: 2 },
  actionHeaderTitle: { fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.bold, color: colors.textMain, marginTop: 14, marginBottom: 10 },
  actionBtn: { marginBottom: 10 },
});