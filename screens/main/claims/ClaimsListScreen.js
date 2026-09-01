import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, ActivityIndicator, Alert, Platform, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { colors } from '../../../theme/colors';
import { claimService } from '../../../services/claimService';
import { authService } from '../../../services/authService';

export default function ClaimsListScreen({ navigation }) {
    const [claims, setClaims] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('Todos');

    const fetchClaims = async () => {
        setLoading(true);
        try {
            const session = await authService.getCurrentSession();
            if (!session) return;
            const data = await claimService.getClientClaims(session.user.id);
            setClaims(data || []);
        } catch (error) {
            if (Platform.OS === 'web') window.alert('Error de comunicación');
            else Alert.alert('Error', 'No pudimos cargar tus reclamos.');
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(useCallback(() => { fetchClaims(); }, []));

    const handleCancelClaim = async (id) => {
        const executeCancel = async () => {
            try {
                await claimService.cancelClaim(id);
                fetchClaims();
            } catch (error) {
                Alert.alert("Error", "No se pudo cancelar el reclamo");
            }
        };

        if (Platform.OS === 'web') {
            if (window.confirm("¿Seguro que deseas cancelar este reclamo?")) executeCancel();
        } else {
            Alert.alert("Cancelar Reclamo", "¿Llegaste a un acuerdo con el técnico?", [{ text: "No", style: "cancel" }, { text: "Sí, cancelar", style: 'destructive', onPress: executeCancel }]);
        }
    };

    const filteredClaims = claims.filter(c => {
        if (filter === 'Todos') return true;
        if (filter === 'Pendientes') return c.status === 'pending';
        if (filter === 'Resueltos') return c.status === 'resolved';
        return true;
    });

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="dark-content" backgroundColor={colors.surface} />

            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={colors.textMain} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Mis Reclamos</Text>
                <View style={{ width: 24 }} />
            </View>

            <View style={styles.filterRow}>
                {['Todos', 'Pendientes', 'Resueltos'].map(f => (
                    <TouchableOpacity key={f} style={[styles.filterChip, filter === f && styles.filterActive]} onPress={() => setFilter(f)} activeOpacity={0.8}>
                        <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>{f}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
                {loading ? (
                    <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 50 }} />
                ) : filteredClaims.length === 0 ? (
                    <View style={styles.emptyState}>
                        <View style={styles.emptyIconBg}>
                            <Ionicons name="shield-checkmark" size={45} color={colors.primary} />
                        </View>
                        <Text style={styles.emptyTitle}>Todo en orden</Text>
                        <Text style={styles.emptyText}>No tienes reclamos {filter.toLowerCase()} en este momento.</Text>
                    </View>
                ) : (
                    filteredClaims.map(item => (
                        <View key={item.id} style={styles.card}>
                            <View style={styles.cardHeader}>
                                <View style={styles.reasonBadge}>
                                    <Text style={styles.reason}>{item.reason}</Text>
                                </View>
                                <Text style={[styles.status, item.status === 'resolved' ? styles.statusOk : item.status === 'cancelled' ? styles.statusCancelled : styles.statusPending]}>
                                    {item.status === 'resolved' ? 'RESUELTO' : item.status === 'cancelled' ? 'CANCELADO' : 'PENDIENTE'}
                                </Text>
                            </View>

                            <View style={styles.techInfoBox}>
                                <Ionicons name="briefcase-outline" size={16} color={colors.textMuted} />
                                <Text style={styles.techName}>Servicio: <Text style={{ fontWeight: 'bold' }}>{item.service_requests?.categories?.name}</Text></Text>
                            </View>
                            <View style={styles.techInfoBox}>
                                <Ionicons name="person-outline" size={16} color={colors.textMuted} />
                                <Text style={styles.techName}>Técnico: <Text style={{ fontWeight: 'bold' }}>{item.technical_profiles?.profiles?.full_name || 'Técnico'}</Text></Text>
                            </View>

                            <Text style={styles.descriptionLabel}>TU DETALLE:</Text>
                            <Text style={styles.description}>{item.description}</Text>

                            {item.status === 'pending' && (
                                <TouchableOpacity style={styles.cancelAction} onPress={() => handleCancelClaim(item.id)} activeOpacity={0.7}>
                                    <Ionicons name="close-circle-outline" size={16} color={colors.error} style={{ marginRight: 4 }} />
                                    <Text style={styles.cancelActionText}>Retirar Reclamo</Text>
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
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 15, backgroundColor: colors.surface },
    backButton: { padding: 5, marginLeft: -5 },
    headerTitle: { fontSize: 18, fontWeight: '900', color: colors.textMain, letterSpacing: -0.3 },

    filterRow: { flexDirection: 'row', paddingHorizontal: 20, paddingVertical: 12, gap: 10, backgroundColor: colors.surface, borderBottomWidth: 1, borderBottomColor: colors.border, elevation: 2, shadowColor: '#000', shadowOpacity: 0.03, shadowRadius: 4, shadowOffset: { width: 0, height: 2 }, zIndex: 10 },
    filterChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: colors.background, borderWidth: 1, borderColor: colors.border },
    filterActive: { backgroundColor: colors.textMain, borderColor: colors.textMain },
    filterText: { fontWeight: 'bold', color: colors.textMuted, fontSize: 12 },
    filterTextActive: { color: colors.surface },

    container: { padding: 16, paddingBottom: 40 },
    emptyState: { alignItems: 'center', marginTop: 60 },
    emptyIconBg: { width: 80, height: 80, borderRadius: 40, backgroundColor: colors.primarySoft, justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
    emptyTitle: { fontSize: 20, fontWeight: 'bold', color: colors.textMain, marginBottom: 5 },
    emptyText: { color: colors.textMuted, fontSize: 15, textAlign: 'center' },

    card: { backgroundColor: colors.surface, padding: 18, borderRadius: 20, marginBottom: 16, borderWidth: 1, borderColor: colors.border, shadowColor: colors.shadow, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
    reasonBadge: { backgroundColor: colors.background, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, borderWidth: 1, borderColor: colors.border },
    reason: { fontSize: 14, fontWeight: '900', color: colors.textMain },

    status: { fontSize: 10, fontWeight: 'bold', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
    statusPending: { backgroundColor: '#FFF9C4', color: '#F9A825' },
    statusOk: { backgroundColor: colors.successSoft, color: colors.success },
    statusCancelled: { backgroundColor: '#FEE2E2', color: colors.error },

    techInfoBox: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
    techName: { fontSize: 14, color: colors.textMain, marginLeft: 8 },

    descriptionLabel: { fontSize: 11, fontWeight: 'bold', color: colors.textMuted, letterSpacing: 0.5, marginBottom: 6, marginTop: 10 },
    description: { fontSize: 14, color: colors.textMain, lineHeight: 22, backgroundColor: colors.background, padding: 12, borderRadius: 12, borderWidth: 1, borderColor: colors.border },

    cancelAction: { flexDirection: 'row', marginTop: 15, alignItems: 'center', alignSelf: 'flex-end', paddingVertical: 5 },
    cancelActionText: { color: colors.error, fontWeight: 'bold', fontSize: 13 }
});