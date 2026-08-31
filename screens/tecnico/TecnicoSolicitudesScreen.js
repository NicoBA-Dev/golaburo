import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Alert, ActivityIndicator, Platform, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';

import { colors } from '../../theme/colors';
import InputField from '../../components/InputField';
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
      const errMsg = 'No se pudieron consultar las solicitudes entrantes.';
      if (Platform.OS === 'web') window.alert(errMsg);
      else Alert.alert('Error', errMsg);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchPending();
    }, [])
  );

  const handleAceptar = async (id) => {
    const msg = '¿Deseas ACEPTAR este trabajo? Se moverá a tu historial en curso.';
    const executeAccept = async () => {
      try {
        await technicianService.updateRequestStatus(id, 'accepted');
        if (Platform.OS === 'web') window.alert('¡Solicitud Aceptada!');
        else Alert.alert('Éxito', 'Has aceptado la solicitud. Pasa al historial en curso.');
        setSolicitudes((prev) => prev.filter((s) => s.id !== id));
      } catch (error) {
        const errMsg = error.message || 'No se pudo aceptar la solicitud.';
        if (Platform.OS === 'web') window.alert(`Error: ${errMsg}`);
        else Alert.alert('Error', errMsg);
      }
    };

    if (Platform.OS === 'web') {
      if (window.confirm(msg)) executeAccept();
    } else {
      Alert.alert('Aceptar Trabajo', msg, [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Sí, Aceptar', style: 'default', onPress: executeAccept }
      ]);
    }
  };

  const handleRechazar = async (id) => {
    const msg = '¿Estás seguro de que deseas RECHAZAR esta solicitud? Esta acción no se puede deshacer.';
    const executeReject = async () => {
      try {
        await technicianService.updateRequestStatus(id, 'rejected');
        if (Platform.OS === 'web') window.alert('Solicitud rechazada.');
        else Alert.alert('Rechazada', 'La solicitud ha sido descartada.');
        setSolicitudes((prev) => prev.filter((s) => s.id !== id));
      } catch (error) {
        const errMsg = error.message || 'No se pudo rechazar la solicitud.';
        if (Platform.OS === 'web') window.alert(`Error: ${errMsg}`);
        else Alert.alert('Error', errMsg);
      }
    };

    if (Platform.OS === 'web') {
      if (window.confirm(msg)) executeReject();
    } else {
      Alert.alert('Rechazar Trabajo', msg, [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Sí, Rechazar', style: 'destructive', onPress: executeReject }
      ]);
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
      <StatusBar barStyle="dark-content" backgroundColor={colors.surface} />

      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Bandeja de Entrada</Text>
        <Text style={styles.headerSubtitle}>Nuevos servicios solicitados</Text>
      </View>

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={{ marginBottom: 15 }}>
          <InputField placeholder="Buscar por zona, cliente o descripción..." value={search} onChangeText={setSearch} />
        </View>

        {loading ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>Buscando solicitudes...</Text>
          </View>
        ) : (
          filteredSolicitudes.map((item) => (
            <View key={item.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.newBadge}>
                  <Text style={styles.newBadgeText}>NUEVO</Text>
                </View>
                <Text style={styles.cardTitle}>{item.category?.name || 'Servicio Solicitado'}</Text>
              </View>

              <View style={styles.infoBlock}>
                <View style={styles.infoRow}>
                  <Ionicons name="person-circle-outline" size={18} color={colors.textMuted} style={styles.iconMargin} />
                  <Text style={styles.infoText}><Text style={styles.boldText}>Cliente:</Text> {item.client?.full_name || 'Cliente'}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Ionicons name="calendar-outline" size={18} color={colors.textMuted} style={styles.iconMargin} />
                  <Text style={styles.infoText}><Text style={styles.boldText}>Para el:</Text> {item.suggested_date} ({item.suggested_time_range || 'Por convenir'})</Text>
                </View>
              </View>

              <Text style={styles.descriptionLabel}>DESCRIPCIÓN DEL PROBLEMA</Text>
              <Text style={styles.descriptionText}>{item.description}</Text>

              <View style={styles.mapWidget}>
                <View style={styles.mapIconBg}>
                  <Ionicons name="location" size={20} color={colors.primary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.mapZoneText}>{item.zone}</Text>
                  <Text style={styles.mapAddress}>{item.address}</Text>
                </View>
              </View>

              <View style={styles.actionButtonsRow}>
                <TouchableOpacity style={styles.btnRechazar} onPress={() => handleRechazar(item.id)} activeOpacity={0.7}>
                  <Text style={styles.btnRechazarText}>Rechazar</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.btnAceptar} onPress={() => handleAceptar(item.id)} activeOpacity={0.8}>
                  <Text style={styles.btnAceptarText}>ACEPTAR TRABAJO</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}

        {!loading && filteredSolicitudes.length === 0 && (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconCircle}>
              <Ionicons name="checkmark-done-circle-outline" size={45} color={colors.primary} />
            </View>
            <Text style={styles.emptyTitle}>Todo al día</Text>
            <Text style={styles.emptyText}>No tienes solicitudes pendientes por revisar en este momento.</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  headerContainer: { paddingHorizontal: 20, paddingTop: 15, paddingBottom: 10, backgroundColor: colors.surface, borderBottomWidth: 1, borderBottomColor: colors.border, elevation: 2, shadowColor: '#000', shadowOpacity: 0.03, shadowRadius: 4, shadowOffset: { width: 0, height: 2 }, zIndex: 10 },
  headerTitle: { fontSize: 26, fontWeight: '900', color: colors.textMain, letterSpacing: -0.5 },
  headerSubtitle: { fontSize: 14, color: colors.textMuted, marginTop: 4, fontWeight: '500' },

  container: { padding: 16, paddingBottom: 40 },
  centerContainer: { marginTop: 60, alignItems: 'center' },
  loadingText: { marginTop: 12, color: colors.textMuted, fontWeight: '500' },

  card: { backgroundColor: colors.surface, borderRadius: 20, padding: 18, marginBottom: 20, borderWidth: 1, borderColor: colors.border, shadowColor: colors.shadow, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.04, shadowRadius: 12, elevation: 3 },
  cardHeader: { marginBottom: 15 },
  newBadge: { alignSelf: 'flex-start', backgroundColor: colors.primarySoft, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, marginBottom: 8 },
  newBadgeText: { color: colors.primary, fontSize: 10, fontWeight: '900', letterSpacing: 0.5 },
  cardTitle: { fontSize: 20, fontWeight: '900', color: colors.textMain, letterSpacing: -0.3 },

  infoBlock: { marginBottom: 15 },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  iconMargin: { marginRight: 8 },
  infoText: { fontSize: 14, color: colors.textMain },
  boldText: { fontWeight: 'bold', color: colors.textMuted },

  descriptionLabel: { fontSize: 11, fontWeight: 'bold', color: colors.textMuted, letterSpacing: 1, marginBottom: 6 },
  descriptionText: { fontSize: 14, color: colors.textMain, lineHeight: 22, marginBottom: 18, backgroundColor: colors.background, padding: 12, borderRadius: 12, borderWidth: 1, borderColor: colors.border },

  mapWidget: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.background, borderWidth: 1, borderColor: colors.border, borderRadius: 16, padding: 12, marginBottom: 20 },
  mapIconBg: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  mapZoneText: { fontSize: 14, fontWeight: 'bold', color: colors.textMain, marginBottom: 2 },
  mapAddress: { fontSize: 12, color: colors.textMuted },

  actionButtonsRow: { flexDirection: 'row', gap: 12, alignItems: 'center' },
  btnRechazar: { flex: 1, height: 50, alignItems: 'center', justifyContent: 'center', borderRadius: 14, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.background },
  btnRechazarText: { color: colors.textMuted, fontWeight: 'bold', fontSize: 14 },
  btnAceptar: { flex: 1.5, height: 50, alignItems: 'center', justifyContent: 'center', borderRadius: 14, backgroundColor: colors.primary, shadowColor: colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 },
  btnAceptarText: { color: colors.white, fontWeight: 'bold', fontSize: 14, letterSpacing: 0.5 },

  emptyContainer: { alignItems: 'center', justifyContent: 'center', marginTop: 60, paddingHorizontal: 30 },
  emptyIconCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  emptyTitle: { fontSize: 20, fontWeight: 'bold', color: colors.textMain, marginBottom: 8 },
  emptyText: { textAlign: 'center', color: colors.textMuted, fontSize: 15, lineHeight: 22 },
});