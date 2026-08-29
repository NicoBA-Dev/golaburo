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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';

import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import InputField from '../../components/InputField';
import PrimaryButton from '../../components/PrimaryButton';
import { technicianService } from '../../services/technicianService';

export default function TecnicoSolicitudesScreen() {
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchPending = async () => {
    try {
      setLoading(true);
      const data = await technicianService.getPendingRequests();
      setSolicitudes(data || []);
    } catch (error) {
      Alert.alert('Error', 'No se pudieron consultar las solicitudes entrantes.');
    } finally {
      setLoading(false);
    }
  };

  // Recarga automáticamente al entrar a la pantalla
  useFocusEffect(
    useCallback(() => {
      fetchPending();
    }, [])
  );

  const handleAceptar = async (id) => {
    try {
      await technicianService.updateRequestStatus(id, 'accepted');
      Alert.alert('Solicitud Aceptada', 'Has aceptado la solicitud. Pasa al historial en curso.');
      setSolicitudes((prev) => prev.filter((s) => s.id !== id));
    } catch (error) {
      Alert.alert('Error', error.message || 'No se pudo aceptar la solicitud.');
    }
  };

  const handleRechazar = async (id) => {
    try {
      await technicianService.updateRequestStatus(id, 'rejected');
      Alert.alert('Solicitud Rechazada', 'La solicitud ha sido descartada.');
      setSolicitudes((prev) => prev.filter((s) => s.id !== id));
    } catch (error) {
      Alert.alert('Error', error.message || 'No se pudo rechazar la solicitud.');
    }
  };

  const filteredSolicitudes = solicitudes.filter(
    (s) =>
      s.description?.toLowerCase().includes(search.toLowerCase()) ||
      s.client?.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      s.zone?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.topBar}>
        <Text style={styles.headerTitle}>GO LABURO - Técnico</Text>
      </View>

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <InputField placeholder="Buscar por zona o cliente..." value={search} onChangeText={setSearch} />

        {loading ? (
          <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 30 }} />
        ) : (
          filteredSolicitudes.map((item) => (
            <View key={item.id} style={styles.card}>
              <Text style={styles.cardTitle}>{item.category?.name || 'Servicio Solicitado'}</Text>

              <View style={styles.infoRow}>
                <Text style={styles.infoText}>
                  <Text style={styles.boldText}>Cliente: </Text>
                  {item.client?.full_name || 'Cliente'}
                </Text>
                <Ionicons name="call-outline" size={16} color={colors.primary} style={styles.callIcon} />
              </View>

              <Text style={styles.infoText}>
                <Text style={styles.boldText}>Zona: </Text>
                {item.zone}
              </Text>

              <Text style={styles.infoText}>
                <Text style={styles.boldText}>Fecha/Hora: </Text>
                {item.suggested_date} ({item.suggested_time_range || 'Por convenir'})
              </Text>

              <Text style={styles.descriptionText}>
                <Text style={styles.boldText}>Descripción: </Text>
                {item.description}
              </Text>

              {/* UBICACIÓN MOVIDA ARRIBA DE LOS BOTONES */}
              <View style={styles.mapWidget}>
                <Ionicons name="location" size={24} color={colors.primary} style={{ marginRight: 8 }} />
                <Text style={styles.mapAddress}>{item.address}, {item.zone}</Text>
              </View>

              {/* BOTONES DE ACCIÓN */}
              <View style={styles.actionButtonsRow}>
                <PrimaryButton
                  title="RECHAZAR"
                  onPress={() => handleRechazar(item.id)}
                  variant="outline"
                  style={styles.btnRechazar}
                />
                <PrimaryButton
                  title="ACEPTAR"
                  onPress={() => handleAceptar(item.id)}
                  variant="primary"
                  style={styles.btnAceptar}
                />
              </View>
            </View>
          ))
        )}

        {!loading && filteredSolicitudes.length === 0 && (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No hay solicitudes pendientes en Supabase.</Text>
          </View>
        )}
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
  headerTitle: { fontSize: typography.fontSize.lg, fontWeight: typography.fontWeight.bold, color: colors.primary },
  container: { padding: 16, paddingBottom: 40 },
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },
  cardTitle: { fontSize: typography.fontSize.lg, fontWeight: typography.fontWeight.bold, color: colors.textMain, marginBottom: 8 },
  infoRow: { flexDirection: 'row', alignItems: 'center' },
  infoText: { fontSize: typography.fontSize.sm, color: colors.textMain, marginBottom: 4 },
  boldText: { fontWeight: typography.fontWeight.bold },
  callIcon: { marginLeft: 6, marginBottom: 4 },
  descriptionText: { fontSize: typography.fontSize.sm, color: colors.textMain, marginTop: 4, marginBottom: 12 },
  mapWidget: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primarySoft,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 10,
    marginBottom: 14,
  },
  mapAddress: { fontSize: typography.fontSize.xs, color: colors.textMain, flex: 1 },
  actionButtonsRow: { flexDirection: 'row', gap: 12 },
  btnRechazar: { flex: 1, borderColor: colors.error },
  btnAceptar: { flex: 1, backgroundColor: colors.primary },
  emptyContainer: { alignItems: 'center', marginTop: 40 },
  emptyText: { fontSize: typography.fontSize.md, color: colors.textMuted },
});