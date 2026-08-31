import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Modal, Alert, ActivityIndicator, Platform, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { colors } from '../../theme/colors';
import InputField from '../../components/InputField';
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
      setHistorial(data || []);
    } catch (error) {
      if (Platform.OS === 'web') window.alert('Error: No se pudo obtener el historial.');
      else Alert.alert('Error', 'No se pudo obtener el historial.');
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(useCallback(() => { fetchHistory(); }, []));

  const handleOpenDetail = (job) => {
    setSelectedJob(job);
    setModalVisible(true);
  };

  const handleUpdateStatus = async (dbStatus) => {
    if (!selectedJob) return;
    try {
      await technicianService.updateRequestStatus(selectedJob.id, dbStatus);
      setHistorial((prev) => prev.map((item) => item.id === selectedJob.id ? { ...item, status: dbStatus } : item));
      setModalVisible(false);

      const msg = 'El estado fue actualizado correctamente.';
      if (Platform.OS === 'web') window.alert(msg);
      else Alert.alert('Éxito', msg);
    } catch (error) {
      const errMsg = error.message || 'No se pudo actualizar el estado.';
      if (Platform.OS === 'web') window.alert(`Error: ${errMsg}`);
      else Alert.alert('Error', errMsg);
    }
  };

  const handleConfirmComplete = () => {
    const msg = '¿Estás seguro de que deseas marcar este trabajo como completado?';
    if (Platform.OS === 'web') {
      if (window.confirm(msg)) handleUpdateStatus('completed');
    } else {
      Alert.alert('Confirmar Finalización', msg, [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Sí, Completar', style: 'default', onPress: () => handleUpdateStatus('completed') },
      ]);
    }
  };

  const handleConfirmReject = () => {
    const msg = '¿Estás seguro de que deseas cancelar esta solicitud?';
    if (Platform.OS === 'web') {
      if (window.confirm(msg)) handleUpdateStatus('rejected');
    } else {
      Alert.alert('Cancelar Solicitud', msg, [
        { text: 'No', style: 'cancel' },
        { text: 'Sí, Cancelar', style: 'destructive', onPress: () => handleUpdateStatus('rejected') },
      ]);
    }
  };

  const mapStatusLabel = (status) => {
    switch (status) {
      case 'pending': return 'Pendiente';
      case 'accepted': return 'En Proceso';
      case 'completed': return 'Completado';
      case 'rejected': return 'Cancelado';
      default: return status;
    }
  };

  const filteredHistorial = historial.filter((item) => {
    const labelStatus = mapStatusLabel(item.status);
    const matchesFilter = filter === 'Todos' || labelStatus === filter;
    const matchesSearch = item.description?.toLowerCase().includes(search.toLowerCase()) || item.client?.full_name?.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.surface} />

      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Mi Historial</Text>
        <Text style={styles.headerSubtitle}>Gestión de trabajos activos y pasados</Text>
      </View>

      <View style={styles.contentContainer}>
        <InputField placeholder="Buscar por cliente o descripción..." value={search} onChangeText={setSearch} />

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow} style={{ maxHeight: 45, marginTop: 10 }}>
          {['Todos', 'Pendiente', 'En Proceso', 'Completado', 'Cancelado'].map((status) => (
            <TouchableOpacity key={status} style={[styles.filterChip, filter === status && styles.filterChipActive]} onPress={() => setFilter(status)} activeOpacity={0.7}>
              <Text style={[styles.filterText, filter === status && styles.filterTextActive]}>{status}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.listContent}>
          {loading ? (
            <View style={styles.centerContainer}>
              <ActivityIndicator size="large" color={colors.primary} />
            </View>
          ) : (
            filteredHistorial.map((item) => {
              const statusText = mapStatusLabel(item.status);
              let badgeStyle = styles.badgeWarning;
              let badgeTextStyle = styles.textWarning;

              if (item.status === 'completed') { badgeStyle = styles.badgeSuccess; badgeTextStyle = styles.textSuccess; }
              else if (item.status === 'rejected') { badgeStyle = styles.badgeDanger; badgeTextStyle = styles.textDanger; }
              else if (item.status === 'accepted') { badgeStyle = styles.badgePrimary; badgeTextStyle = styles.textPrimary; }

              return (
                <TouchableOpacity key={item.id} style={styles.card} activeOpacity={0.8} onPress={() => handleOpenDetail(item)}>
                  <View style={styles.cardHeader}>
                    <Text style={styles.serviceTitle} numberOfLines={1}>{item.category?.name || 'Servicio'}</Text>
                    <View style={[styles.statusBadge, badgeStyle]}>
                      <Text style={[styles.statusBadgeText, badgeTextStyle]}>{statusText}</Text>
                    </View>
                  </View>

                  <View style={styles.infoRow}>
                    <Ionicons name="person-outline" size={16} color={colors.textMuted} />
                    <Text style={styles.infoText}>Cliente: <Text style={styles.boldText}>{item.client?.full_name || 'Cliente'}</Text></Text>
                  </View>

                  <View style={styles.detailRow}>
                    <View style={styles.infoRow}>
                      <Ionicons name="calendar-outline" size={16} color={colors.textMuted} />
                      <Text style={styles.infoText}>{item.suggested_date}</Text>
                    </View>
                    <Text style={styles.zoneText}>{item.zone}</Text>
                  </View>
                </TouchableOpacity>
              );
            })
          )}

          {!loading && filteredHistorial.length === 0 && (
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIconCircle}>
                <Ionicons name="folder-open-outline" size={40} color={colors.primary} />
              </View>
              <Text style={styles.emptyTitle}>Sin resultados</Text>
              <Text style={styles.emptyText}>No encontramos trabajos bajo estos filtros.</Text>
            </View>
          )}
        </ScrollView>
      </View>

      {/* MODAL BOTTOM SHEET DE DETALLES */}
      <Modal visible={modalVisible} animationType="slide" transparent={true} onRequestClose={() => setModalVisible(false)}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setModalVisible(false)}>
          <TouchableOpacity activeOpacity={1} style={styles.modalContainer} onPress={(e) => e.stopPropagation()}>
            <View style={styles.modalDragIndicator} />

            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Detalle del Trabajo</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeModalBtn}>
                <Ionicons name="close" size={24} color={colors.textMain} />
              </TouchableOpacity>
            </View>

            {selectedJob && (
              <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
                <Text style={styles.modalJobTitle}>{selectedJob.category?.name}</Text>

                <View style={styles.modalCardInfo}>
                  <View style={styles.modalSection}>
                    <Text style={styles.modalLabel}>Estado Actual:</Text>
                    <Text style={styles.modalValueHighlight}>{mapStatusLabel(selectedJob.status)}</Text>
                  </View>
                  <View style={styles.modalSection}>
                    <Text style={styles.modalLabel}>Cliente a contactar:</Text>
                    <Text style={styles.modalValue}>{selectedJob.client?.full_name}</Text>
                    <Text style={styles.modalValueContact}>{selectedJob.client?.phone || 'Sin Teléfono registrado'}</Text>
                  </View>
                  <View style={styles.modalSection}>
                    <Text style={styles.modalLabel}>Descripción del problema:</Text>
                    <Text style={styles.modalValueDesc}>{selectedJob.description}</Text>
                  </View>
                </View>

                {/* BOTONES */}
                {selectedJob.status === 'completed' || selectedJob.status === 'rejected' ? (
                  <View style={[styles.completedBox, selectedJob.status === 'rejected' && { backgroundColor: '#FEE2E2' }]}>
                    <Ionicons name={selectedJob.status === 'completed' ? "checkmark-circle" : "close-circle"} size={24} color={selectedJob.status === 'completed' ? colors.success : colors.error} />
                    <Text style={[styles.completedText, { color: selectedJob.status === 'completed' ? colors.success : colors.error }]}>
                      Este trabajo está {selectedJob.status === 'completed' ? 'completado y archivado' : 'cancelado'}.
                    </Text>
                  </View>
                ) : (
                  <View style={styles.modalActions}>
                    {selectedJob.status === 'pending' && (
                      <TouchableOpacity style={[styles.actionBtn, { backgroundColor: colors.primary }]} onPress={() => handleUpdateStatus('accepted')} activeOpacity={0.8}>
                        <Text style={styles.actionBtnText}>ACEPTAR TRABAJO</Text>
                      </TouchableOpacity>
                    )}

                    {selectedJob.status === 'accepted' && (
                      <TouchableOpacity style={[styles.actionBtn, { backgroundColor: colors.success }]} onPress={handleConfirmComplete} activeOpacity={0.8}>
                        <Ionicons name="checkmark-done" size={20} color={colors.white} style={{ marginRight: 8 }} />
                        <Text style={styles.actionBtnText}>MARCAR COMO COMPLETADO</Text>
                      </TouchableOpacity>
                    )}

                    <TouchableOpacity style={styles.actionBtnOutline} onPress={handleConfirmReject} activeOpacity={0.6}>
                      <Text style={styles.actionBtnTextOutline}>Cancelar solicitud</Text>
                    </TouchableOpacity>
                  </View>
                )}
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
  headerContainer: { paddingHorizontal: 20, paddingTop: 15, paddingBottom: 10, backgroundColor: colors.surface, borderBottomWidth: 1, borderBottomColor: colors.border, elevation: 2, shadowColor: '#000', shadowOpacity: 0.03, shadowRadius: 4, shadowOffset: { width: 0, height: 2 }, zIndex: 10 },
  headerTitle: { fontSize: 26, fontWeight: '900', color: colors.textMain, letterSpacing: -0.5 },
  headerSubtitle: { fontSize: 14, color: colors.textMuted, marginTop: 4, fontWeight: '500' },

  contentContainer: { flex: 1, paddingHorizontal: 16, paddingTop: 15 },

  filterRow: { flexDirection: 'row', gap: 8, paddingRight: 20 },
  filterChip: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, height: 36, justifyContent: 'center' },
  filterChipActive: { backgroundColor: colors.textMain, borderColor: colors.textMain },
  filterText: { fontSize: 12, fontWeight: '600', color: colors.textMuted },
  filterTextActive: { color: colors.surface, fontWeight: 'bold' },

  listContent: { paddingBottom: 40, paddingTop: 15 },
  centerContainer: { marginTop: 40, alignItems: 'center' },

  card: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 20, padding: 18, marginBottom: 15, shadowColor: colors.shadow, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  serviceTitle: { fontSize: 16, fontWeight: '900', color: colors.textMain, flex: 1, marginRight: 10, letterSpacing: -0.3 },

  statusBadge: { paddingVertical: 4, paddingHorizontal: 10, borderRadius: 12 },
  statusBadgeText: { fontSize: 11, fontWeight: 'bold' },
  badgeSuccess: { backgroundColor: colors.successSoft }, textSuccess: { color: colors.success },
  badgeDanger: { backgroundColor: '#FEE2E2' }, textDanger: { color: colors.error },
  badgeWarning: { backgroundColor: '#FFF9C4' }, textWarning: { color: '#F9A825' },
  badgePrimary: { backgroundColor: colors.primarySoft }, textPrimary: { color: colors.primary },

  infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  infoText: { fontSize: 13, color: colors.textMuted, marginLeft: 6 },
  boldText: { fontWeight: 'bold', color: colors.textMain },

  detailRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 },
  zoneText: { fontSize: 13, fontWeight: 'bold', color: colors.primary },

  emptyContainer: { alignItems: 'center', marginTop: 60, paddingHorizontal: 30 },
  emptyIconCircle: { width: 70, height: 70, borderRadius: 35, backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  emptyTitle: { fontSize: 18, fontWeight: 'bold', color: colors.textMain, marginBottom: 6 },
  emptyText: { fontSize: 14, color: colors.textMuted, textAlign: 'center', lineHeight: 20 },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.4)', justifyContent: 'flex-end' },
  modalContainer: { backgroundColor: colors.background, borderTopLeftRadius: 30, borderTopRightRadius: 30, paddingHorizontal: 24, paddingTop: 12, maxHeight: '85%', elevation: 20 },
  modalDragIndicator: { width: 40, height: 5, backgroundColor: colors.border, borderRadius: 3, alignSelf: 'center', marginBottom: 15 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 20, fontWeight: '900', color: colors.textMain, letterSpacing: -0.5 },
  closeModalBtn: { backgroundColor: colors.surface, padding: 6, borderRadius: 20, borderWidth: 1, borderColor: colors.border },

  modalJobTitle: { fontSize: 22, fontWeight: '900', color: colors.primary, marginBottom: 20, letterSpacing: -0.5 },
  modalCardInfo: { backgroundColor: colors.surface, borderRadius: 16, padding: 20, borderWidth: 1, borderColor: colors.border, marginBottom: 20 },
  modalSection: { marginBottom: 15 },
  modalLabel: { fontSize: 12, color: colors.textMuted, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 },
  modalValue: { fontSize: 15, color: colors.textMain, fontWeight: '500' },
  modalValueContact: { fontSize: 15, color: colors.primary, fontWeight: 'bold', marginTop: 2 },
  modalValueHighlight: { fontSize: 16, fontWeight: '900', color: colors.textMain },
  modalValueDesc: { fontSize: 14, color: colors.textMain, lineHeight: 22, backgroundColor: colors.background, padding: 12, borderRadius: 12, borderWidth: 1, borderColor: colors.border, marginTop: 4 },

  modalActions: { gap: 12, marginBottom: 20 },
  actionBtn: { flexDirection: 'row', height: 56, borderRadius: 16, alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 3 },
  actionBtnText: { color: colors.white, fontSize: 14, fontWeight: 'bold', letterSpacing: 0.5 },
  actionBtnOutline: { height: 50, borderRadius: 16, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.error },
  actionBtnTextOutline: { color: colors.error, fontSize: 14, fontWeight: 'bold' },

  completedBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.successSoft, padding: 16, borderRadius: 16, marginTop: 10, gap: 10, marginBottom: 20 },
  completedText: { fontSize: 13, fontWeight: 'bold', flex: 1, lineHeight: 18 },
});