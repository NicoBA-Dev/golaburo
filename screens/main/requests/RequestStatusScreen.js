import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Alert, ActivityIndicator, Linking, Platform, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../../theme/colors';
import ProgressStepper from '../../../components/ui/ProgressStepper';
import { supabase } from '../../../config/supabaseConfig';

export default function RequestStatusScreen({ route, navigation }) {
    // BLINDAJE WEB
    if (!route || !route.params || !route.params.requestData) {
        return (
            <SafeAreaView style={[styles.safeArea, { justifyContent: 'center', alignItems: 'center' }]}>
                <Ionicons name="warning-outline" size={50} color={colors.warning} />
                <Text style={{ marginTop: 10, fontSize: 16, color: colors.textMuted }}>No se encontraron los datos del servicio.</Text>
                <TouchableOpacity style={{ marginTop: 20, padding: 10, backgroundColor: colors.primary, borderRadius: 8 }} onPress={() => navigation.navigate('RequestsList')}>
                    <Text style={{ color: colors.white, fontWeight: 'bold' }}>Volver a mis solicitudes</Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }

    const { requestData } = route.params;

    const [currentStatus, setCurrentStatus] = useState(requestData.status);
    const [technicianPhone, setTechnicianPhone] = useState(null);
    const [isUpdating, setIsUpdating] = useState(false);

    const serviceName = requestData.categories?.name || 'Servicio';
    const techName = requestData.technical_profiles?.profiles?.full_name || 'Técnico';
    const shortId = requestData.id ? requestData.id.substring(0, 6).toUpperCase() : '000000';

    useEffect(() => {
        const fetchPhone = async () => {
            const { data, error } = await supabase.rpc('get_technician_phone', { p_technician_id: requestData.technician_id });
            if (data && !error) setTechnicianPhone(data);
        };
        if (requestData.technician_id) fetchPhone();
    }, [requestData.technician_id]);

    const getStepFromStatus = (status) => {
        switch (status) {
            case 'pending': return 0;
            case 'accepted': return 1;
            case 'completed': return 3;
            case 'rejected': return 0;
            default: return 0;
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'pending': return 'Esperando confirmación';
            case 'accepted': return 'En Curso / Aceptado';
            case 'completed': return 'Concluido';
            case 'rejected': return 'Cancelado';
            default: return 'Desconocido';
        }
    };

    const updateRequestStatus = async (newStatus) => {
        const actionText = newStatus === 'completed' ? 'marcar como concluido' : 'cancelar';
        const msg = `¿Estás seguro de que deseas ${actionText} este servicio?`;

        const executeUpdate = async () => {
            setIsUpdating(true);
            try {
                const { data, error } = await supabase.from('service_requests').update({ status: newStatus }).eq('id', requestData.id).select();
                if (error) throw error;
                if (!data || data.length === 0) throw new Error("La base de datos bloqueó la acción.");

                setCurrentStatus(newStatus);
                const successMsg = `El servicio ha sido ${newStatus === 'completed' ? 'concluido' : 'cancelado'}.`;
                if (Platform.OS === 'web') window.alert(successMsg); else Alert.alert('Éxito', successMsg);

                if (newStatus !== 'completed') navigation.goBack();
            } catch (error) {
                const errorMsg = error.message || 'No se pudo actualizar el estado.';
                if (Platform.OS === 'web') window.alert(errorMsg); else Alert.alert('Error', errorMsg);
            } finally {
                setIsUpdating(false);
            }
        };

        if (Platform.OS === 'web') {
            if (window.confirm(msg)) executeUpdate();
        } else {
            Alert.alert("Confirmar acción", msg, [{ text: "No", style: "cancel" }, { text: "Sí, confirmar", onPress: executeUpdate }]);
        }
    };

    const handleCallTechnician = () => {
        if (technicianPhone) Linking.openURL(`tel:${technicianPhone}`);
        else Alert.alert('No disponible', 'El teléfono del profesional aún no está disponible.');
    };

    const ReceiptRow = ({ label, value, highlight, isError }) => (
        <View style={styles.receiptRow}>
            <Text style={styles.receiptLabel}>{label}</Text>
            <Text style={[styles.receiptValue, highlight && styles.highlightText, isError && styles.errorText]}>{value}</Text>
        </View>
    );

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="dark-content" backgroundColor={colors.surface} />

            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={colors.textMain} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Estado del Servicio</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
                <Text style={styles.serviceTitle}>{serviceName}</Text>
                <Text style={styles.technicianText}>Profesional: <Text style={{ fontWeight: 'bold' }}>{techName}</Text></Text>

                <ProgressStepper currentStep={getStepFromStatus(currentStatus)} />

                <View style={styles.receiptCard}>
                    <Text style={styles.receiptTitle}>Detalles de la orden</Text>
                    <ReceiptRow label="ID de Orden:" value={`#${shortId}`} />
                    <ReceiptRow label="Fecha sugerida:" value={requestData.suggested_date || 'No definida'} />
                    <ReceiptRow label="Estado actual:" value={getStatusText(currentStatus)} isError={currentStatus === 'rejected'} highlight={currentStatus === 'completed'} />
                    <ReceiptRow label="Descripción:" value={requestData.description || 'Sin detalle'} />
                </View>

                {/* =========================================
                    NUEVA ÁREA DE BOTONES (MEJORA UI/UX)
                ========================================== */}
                <View style={styles.actionsContainer}>

                    {/* Botón de Llamada (Primario Oscuro) */}
                    {technicianPhone && currentStatus !== 'rejected' && (
                        <TouchableOpacity style={styles.callButton} onPress={handleCallTechnician} activeOpacity={0.85}>
                            <View style={styles.callIconWrapper}>
                                <Ionicons name="call" size={18} color={colors.surface} />
                            </View>
                            <Text style={styles.callButtonText}>LLAMAR AL PROFESIONAL</Text>
                        </TouchableOpacity>
                    )}

                    {isUpdating ? (
                        <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 20 }} />
                    ) : (
                        <>
                            {/* Botón de Concluir (Primario Éxito) */}
                            {currentStatus === 'accepted' && (
                                <TouchableOpacity style={styles.completeButton} onPress={() => updateRequestStatus('completed')} activeOpacity={0.85}>
                                    <Ionicons name="checkmark-done" size={22} color={colors.white} style={{ marginRight: 8 }} />
                                    <Text style={styles.completeButtonText}>TRABAJO CONCLUIDO</Text>
                                </TouchableOpacity>
                            )}

                            {/* Botón de Cancelar (Fantasma / Sutil) */}
                            {(currentStatus === 'pending' || currentStatus === 'accepted') && (
                                <TouchableOpacity style={styles.cancelGhostButton} onPress={() => updateRequestStatus('rejected')} activeOpacity={0.6}>
                                    <Text style={styles.cancelGhostText}>Cancelar esta solicitud</Text>
                                </TouchableOpacity>
                            )}

                            {/* Caja Especial de Garantías (Atención Visual) */}
                            {currentStatus === 'completed' && (
                                <View style={styles.claimsSupportBox}>
                                    <View style={styles.claimsHeader}>
                                        <Ionicons name="headset-outline" size={24} color={colors.primary} />
                                        <Text style={styles.claimsSupportTitle}>¿Problemas con el servicio?</Text>
                                    </View>
                                    <Text style={styles.claimsSupportDesc}>Si el trabajo no quedó bien o necesitas hacer valer tu garantía, estamos aquí para ayudarte.</Text>

                                    <TouchableOpacity style={styles.claimActionButton} onPress={() => navigation.navigate('CreateClaim', { requestData })} activeOpacity={0.8}>
                                        <Text style={styles.claimActionText}>SOLICITAR GARANTÍA</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity style={styles.viewHistoryLink} onPress={() => navigation.navigate('ClaimsList')} activeOpacity={0.6}>
                                        <Text style={styles.viewHistoryText}>Ver mi historial de reclamos</Text>
                                        <Ionicons name="arrow-forward" size={14} color={colors.textMuted} />
                                    </TouchableOpacity>
                                </View>
                            )}
                        </>
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: colors.background },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 15, backgroundColor: colors.surface, borderBottomWidth: 1, borderBottomColor: colors.border, elevation: 2, shadowColor: '#000', shadowOpacity: 0.03, shadowRadius: 4, shadowOffset: { width: 0, height: 2 } },
    backButton: { padding: 5, marginLeft: -5 },
    headerTitle: { fontSize: 18, fontWeight: 'bold', color: colors.textMain },

    container: { padding: 20, alignItems: 'center', paddingBottom: 40 },
    serviceTitle: { fontSize: 26, fontWeight: '900', color: colors.textMain, textAlign: 'center', marginBottom: 6, letterSpacing: -0.5 },
    technicianText: { fontSize: 15, color: colors.textMuted, marginBottom: 10 },

    receiptCard: { width: '100%', backgroundColor: colors.surface, borderRadius: 20, padding: 20, borderWidth: 1, borderColor: colors.border, shadowColor: colors.shadow, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.04, shadowRadius: 10, elevation: 2 },
    receiptTitle: { fontSize: 16, fontWeight: '900', color: colors.textMain, marginBottom: 15, letterSpacing: -0.3 },
    receiptRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
    receiptLabel: { fontSize: 14, color: colors.textMuted, flex: 1, fontWeight: '500' },
    receiptValue: { fontSize: 14, color: colors.textMain, fontWeight: '600', textAlign: 'right', flex: 1.5 },
    highlightText: { fontWeight: '900', color: colors.primary },
    errorText: { fontWeight: 'bold', color: colors.error || '#D32F2F' },

    /* MEJORAS DE LOS BOTONES */
    actionsContainer: { width: '100%', marginTop: 25 },

    callButton: { flexDirection: 'row', backgroundColor: '#111827', height: 60, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginBottom: 15, shadowColor: '#000', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.15, shadowRadius: 10, elevation: 5 },
    callIconWrapper: { backgroundColor: 'rgba(255,255,255,0.15)', padding: 6, borderRadius: 10, marginRight: 10 },
    callButtonText: { color: colors.surface, fontSize: 14, fontWeight: '900', letterSpacing: 0.5 },

    completeButton: { flexDirection: 'row', backgroundColor: colors.success || '#10B981', height: 60, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginBottom: 15, shadowColor: colors.success || '#10B981', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.25, shadowRadius: 10, elevation: 5 },
    completeButtonText: { color: colors.white, fontSize: 14, fontWeight: '900', letterSpacing: 0.5 },

    cancelGhostButton: { height: 50, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginTop: 5 },
    cancelGhostText: { color: colors.textMuted, fontSize: 14, fontWeight: 'bold', textDecorationLine: 'underline' },

    /* NUEVO DISEÑO CAJA DE GARANTÍAS */
    claimsSupportBox: { width: '100%', marginTop: 10, backgroundColor: colors.surface, padding: 22, borderRadius: 24, borderWidth: 1, borderColor: colors.border, shadowColor: colors.shadow, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 12, elevation: 2 },
    claimsHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
    claimsSupportTitle: { fontSize: 17, fontWeight: '900', color: colors.textMain, marginLeft: 8, letterSpacing: -0.3 },
    claimsSupportDesc: { fontSize: 13, color: colors.textMuted, lineHeight: 20, marginBottom: 20 },

    claimActionButton: { width: '100%', height: 54, borderRadius: 14, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FEF2F2', borderWidth: 1, borderColor: '#FECACA' },
    claimActionText: { color: colors.error || '#DC2626', fontSize: 13, fontWeight: '900', letterSpacing: 0.5 },

    viewHistoryLink: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 18, paddingTop: 18, borderTopWidth: 1, borderTopColor: colors.border },
    viewHistoryText: { color: colors.textMuted, fontWeight: '600', fontSize: 13, marginRight: 4 }
});