import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, ActivityIndicator, Alert, Linking, Platform, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { colors } from '../../theme/colors';
import { claimService } from '../../services/claimService';
import { authService } from '../../services/authService';
import { profileService } from '../../services/profileService'; // <-- IMPORTANTE: Agregamos tu servicio de perfiles

export default function TecnicoReclamosScreen() {
    const [claims, setClaims] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('Pendientes');

    const fetchTechClaims = async () => {
        setLoading(true);
        try {
            const session = await authService.getCurrentSession();
            if (!session) return;

            // 🌟 LA MAGIA ESTÁ AQUÍ 🌟
            // Obtenemos tu perfil de profesional para usar el ID correcto
            const techProfile = await profileService.getTechnicalProfile(session.user.id);

            // Usamos el ID del perfil técnico (si no existe, usamos el normal por si acaso)
            const realTechnicianId = techProfile ? techProfile.id : session.user.id;

            const data = await claimService.getTechnicianClaims(realTechnicianId);
            setClaims(data || []);
        } catch (error) {
            if (Platform.OS === 'web') window.alert('Error al cargar garantías.');
            else Alert.alert('Error', 'No pudimos cargar los reportes.');
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(useCallback(() => { fetchTechClaims(); }, []));

    const handleResolve = async (id) => {
        const executeResolve = async () => {
            try {
                await claimService.markAsResolved(id);
                fetchTechClaims();
            } catch (error) {
                Alert.alert("Error", "No se pudo actualizar el estado");
            }
        };

        if (Platform.OS === 'web') {
            if (window.confirm("¿Confirmas que el problema fue solucionado con el cliente?")) executeResolve();
        } else {
            Alert.alert("Resolver Reclamo", "¿Confirmas que el problema fue solucionado?", [
                { text: "Cancelar", style: "cancel" },
                { text: "Sí, resuelto", onPress: executeResolve }
            ]);
        }
    };

    const callClient = (phone) => {
        if (!phone) return Alert.alert("Aviso", "El cliente no tiene teléfono registrado.");
        Linking.openURL(`tel:${phone}`);
    };

    const filteredClaims = claims.filter(c => {
        if (filter === 'Todos') return c.status !== 'cancelled';
        if (filter === 'Pendientes') return c.status === 'pending';
        if (filter === 'Resueltos') return c.status === 'resolved';
        return true;
    });

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="dark-content" backgroundColor={colors.surface} />

            <View style={styles.headerContainer}>
                <Text style={styles.headerTitle}>Garantías y Reportes</Text>
                <Text style={styles.headerSubtitle}>Atiende los requerimientos de tus clientes</Text>
            </View>

            <View style={styles.filterRow}>
                {['Pendientes', 'Resueltos', 'Todos'].map(f => (
                    <TouchableOpacity key={f} style={[styles.filterChip, filter === f && styles.filterActive]} onPress={() => setFilter(f)} activeOpacity={0.8}>
                        <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>{f}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
                {loading ? (
                    <ActivityIndicator size="large" color={colors.error} style={{ marginTop: 50 }} />
                ) : filteredClaims.length === 0 ? (
                    <View style={styles.emptyState}>
                        <View style={styles.emptyIconBg}>
                            <Ionicons name="shield-checkmark" size={50} color={colors.success} />
                        </View>
                        <Text style={styles.emptyTitle}>¡Excelente trabajo!</Text>
                        <Text style={styles.emptyText}>No tienes reclamos {filter.toLowerCase()} en este momento.</Text>
                    </View>
                ) : (
                    filteredClaims.map(item => (
                        <View key={item.id} style={styles.card}>
                            <View style={styles.cardHeader}>
                                <View style={styles.reasonBadge}>
                                    <Ionicons name="warning-outline" size={14} color={colors.error} style={{ marginRight: 4 }} />
                                    <Text style={styles.reasonText}>{item.reason}</Text>
                                </View>
                                <Text style={[styles.status, item.status === 'resolved' ? styles.statusOk : styles.statusPending]}>
                                    {item.status === 'resolved' ? 'RESUELTO' : 'PENDIENTE'}
                                </Text>
                            </View>

                            <Text style={styles.serviceText}>Servicio: <Text style={{ fontWeight: 'bold' }}>{item.service_requests?.categories?.name || 'Servicio General'}</Text></Text>

                            <View style={styles.clientBox}>
                                <Ionicons name="person-circle-outline" size={20} color={colors.textMuted} />
                                <Text style={styles.clientName}>{item.client?.full_name || 'Cliente'}</Text>
                                <TouchableOpacity onPress={() => callClient(item.client?.phone)} style={styles.callBtn}>
                                    <Ionicons name="call" size={14} color={colors.white} />
                                </TouchableOpacity>
                            </View>

                            <Text style={styles.descriptionLabel}>DETALLE DEL CLIENTE:</Text>
                            <Text style={styles.description}>{item.description}</Text>

                            {item.status === 'pending' && (
                                <TouchableOpacity style={styles.resolveAction} onPress={() => handleResolve(item.id)} activeOpacity={0.8}>
                                    <Ionicons name="checkmark-done-circle" size={20} color={colors.white} style={{ marginRight: 8 }} />
                                    <Text style={styles.resolveActionText}>MARCAR COMO RESUELTO</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    ))
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: colors.background },
    headerContainer: { paddingHorizontal: 20, paddingTop: 15, paddingBottom: 15, backgroundColor: colors.surface, borderBottomWidth: 1, borderBottomColor: colors.border },
    headerTitle: { fontSize: 24, fontWeight: '900', color: colors.textMain, letterSpacing: -0.5 },
    headerSubtitle: { fontSize: 14, color: colors.textMuted, marginTop: 4, fontWeight: '500' },
    filterRow: { flexDirection: 'row', paddingHorizontal: 20, paddingVertical: 12, gap: 10, backgroundColor: colors.surface, borderBottomWidth: 1, borderBottomColor: colors.border, elevation: 2, shadowColor: '#000', shadowOpacity: 0.03, shadowRadius: 4, shadowOffset: { width: 0, height: 2 }, zIndex: 10 },
    filterChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: colors.background, borderWidth: 1, borderColor: colors.border },
    filterActive: { backgroundColor: colors.textMain, borderColor: colors.textMain },
    filterText: { fontWeight: 'bold', color: colors.textMuted, fontSize: 12 },
    filterTextActive: { color: colors.surface },
    container: { padding: 16, paddingBottom: 40 },
    emptyState: { alignItems: 'center', marginTop: 60, paddingHorizontal: 20 },
    emptyIconBg: { width: 80, height: 80, borderRadius: 40, backgroundColor: colors.successSoft, justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
    emptyTitle: { fontSize: 20, fontWeight: 'bold', color: colors.textMain, marginBottom: 5 },
    emptyText: { color: colors.textMuted, fontSize: 15, textAlign: 'center', lineHeight: 22 },
    card: { backgroundColor: colors.surface, padding: 18, borderRadius: 20, marginBottom: 16, borderWidth: 1, borderColor: colors.border, shadowColor: colors.shadow, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
    reasonBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FEE2E2', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 12 },
    reasonText: { fontSize: 13, fontWeight: '900', color: colors.error },
    status: { fontSize: 10, fontWeight: 'bold', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
    statusPending: { backgroundColor: '#FFF9C4', color: '#F9A825' },
    statusOk: { backgroundColor: colors.successSoft, color: colors.success },
    serviceText: { fontSize: 14, color: colors.textMuted, marginBottom: 12 },
    clientBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.background, padding: 10, borderRadius: 12, marginBottom: 15 },
    clientName: { fontSize: 15, fontWeight: 'bold', color: colors.textMain, marginLeft: 8, flex: 1 },
    callBtn: { backgroundColor: colors.primary, width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
    descriptionLabel: { fontSize: 11, fontWeight: 'bold', color: colors.textMuted, letterSpacing: 0.5, marginBottom: 6 },
    description: { fontSize: 14, color: colors.textMain, lineHeight: 22 },
    resolveAction: { flexDirection: 'row', marginTop: 20, backgroundColor: colors.textMain, height: 50, borderRadius: 14, alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 3 },
    resolveActionText: { color: colors.white, fontWeight: '900', fontSize: 13, letterSpacing: 0.5 }
});