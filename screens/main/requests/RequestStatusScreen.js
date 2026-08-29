import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Alert, ActivityIndicator, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../../theme/colors';
import ProgressStepper from '../../../components/ui/ProgressStepper';
import { supabase } from '../../../config/supabaseConfig';

export default function RequestStatusScreen({ route, navigation }) {
    const { requestData } = route.params;

    // Estados para manejar los datos dinámicos y la carga
    const [currentStatus, setCurrentStatus] = useState(requestData.status);
    const [technicianPhone, setTechnicianPhone] = useState(null);
    const [isUpdating, setIsUpdating] = useState(false);

    const serviceName = requestData.categories?.name || 'Servicio';
    const techName = requestData.technical_profiles?.profiles?.full_name || 'Técnico';
    const shortId = requestData.id ? requestData.id.substring(0, 6).toUpperCase() : '000000';

    // Obtener el teléfono del técnico usando tu función RPC de la base de datos
    useEffect(() => {
        const fetchPhone = async () => {
            const { data, error } = await supabase.rpc('get_technician_phone', {
                p_technician_id: requestData.technician_id
            });
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

    // Función principal para cambiar el estado de la solicitud
    const updateRequestStatus = async (newStatus) => {
        const actionText = newStatus === 'completed' ? 'marcar como concluido' : 'cancelar';

        Alert.alert(
            "Confirmar acción",
            `¿Estás seguro de que deseas ${actionText} este servicio?`,
            [
                { text: "No", style: "cancel" },
                {
                    text: "Sí, confirmar",
                    onPress: async () => {
                        setIsUpdating(true);
                        try {
                            const { error } = await supabase
                                .from('service_requests')
                                .update({ status: newStatus })
                                .eq('id', requestData.id);

                            if (error) throw error;

                            setCurrentStatus(newStatus);
                            Alert.alert('Éxito', `El servicio ha sido ${newStatus === 'completed' ? 'concluido' : 'cancelado'}.`);

                            // Si se completó, volvemos atrás para que pueda calificar desde la bandeja
                            if (newStatus === 'completed') navigation.goBack();
                        } catch (error) {
                            console.error("Error al actualizar estado:", error);
                            Alert.alert('Error', error.message || 'No se pudo actualizar el estado.');
                        } finally {
                            setIsUpdating(false);
                        }
                    }
                }
            ]
        );
    };

    const handleCallTechnician = () => {
        if (technicianPhone) {
            Linking.openURL(`tel:${technicianPhone}`);
        } else {
            Alert.alert('No disponible', 'El teléfono del técnico aún no está disponible.');
        }
    };

    const ReceiptRow = ({ label, value, highlight, isError }) => (
        <View style={styles.receiptRow}>
            <Text style={styles.receiptLabel}>{label}</Text>
            <Text style={[styles.receiptValue, highlight && styles.highlightText, isError && styles.errorText]}>
                {value}
            </Text>
        </View>
    );

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={colors.textMain} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Estado de Solicitud</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.serviceTitle}>{serviceName}</Text>
                <Text style={styles.technicianText}>Profesional: {techName}</Text>

                <ProgressStepper currentStep={getStepFromStatus(currentStatus)} />

                <View style={styles.receiptCard}>
                    <Text style={styles.receiptTitle}>Detalles de la orden</Text>
                    <ReceiptRow label="ID de Orden:" value={`#${shortId}`} />
                    <ReceiptRow label="Fecha sugerida:" value={requestData.suggested_date || 'No definida'} />
                    <ReceiptRow
                        label="Estado actual:"
                        value={getStatusText(currentStatus)}
                        isError={currentStatus === 'rejected'}
                        highlight={currentStatus === 'completed'}
                    />
                    <ReceiptRow label="Descripción:" value={requestData.description || 'Sin detalle'} />
                </View>

                {/* ACCIONES DEL CLIENTE SEGÚN EL ESTADO DE LA BASE DE DATOS */}
                <View style={styles.actionsContainer}>

                    {/* Llamar al Técnico (Solo si la BD nos devolvió el teléfono) */}
                    {technicianPhone && currentStatus !== 'rejected' && (
                        <TouchableOpacity style={styles.callButton} onPress={handleCallTechnician}>
                            <Ionicons name="call" size={20} color={colors.white} style={{ marginRight: 8 }} />
                            <Text style={styles.callButtonText}>LLAMAR AL TÉCNICO</Text>
                        </TouchableOpacity>
                    )}

                    {isUpdating ? (
                        <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 20 }} />
                    ) : (
                        <>
                            {/* Marcar como concluido (Solo disponible si el estado es 'accepted') */}
                            {currentStatus === 'accepted' && (
                                <TouchableOpacity style={styles.completeButton} onPress={() => updateRequestStatus('completed')}>
                                    <Ionicons name="checkmark-circle-outline" size={20} color={colors.white} style={{ marginRight: 8 }} />
                                    <Text style={styles.completeButtonText}>MARCAR TRABAJO CONCLUIDO</Text>
                                </TouchableOpacity>
                            )}

                            {/* Cancelar solicitud (Disponible si es 'pending' o 'accepted') */}
                            {(currentStatus === 'pending' || currentStatus === 'accepted') && (
                                <TouchableOpacity style={styles.cancelButton} onPress={() => updateRequestStatus('rejected')}>
                                    <Text style={styles.cancelButtonText}>Cancelar Solicitud</Text>
                                </TouchableOpacity>
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
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 15, backgroundColor: colors.surface, borderBottomWidth: 1, borderBottomColor: colors.border },
    backButton: { padding: 5, marginLeft: -5 },
    headerTitle: { fontSize: 18, fontWeight: 'bold', color: colors.textMain },
    container: { padding: 20, alignItems: 'center' },
    serviceTitle: { fontSize: 22, fontWeight: '900', color: colors.textMain, textAlign: 'center', marginBottom: 5 },
    technicianText: { fontSize: 15, color: colors.textMuted, marginBottom: 20 },
    receiptCard: { width: '100%', backgroundColor: colors.surface, borderRadius: 16, padding: 20, borderWidth: 1, borderColor: colors.border, shadowColor: colors.shadow, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 3 },
    receiptTitle: { fontSize: 16, fontWeight: 'bold', color: colors.textMain, marginBottom: 15 },
    receiptRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
    receiptLabel: { fontSize: 14, color: colors.textMuted, flex: 1 },
    receiptValue: { fontSize: 14, color: colors.textMain, fontWeight: '500', textAlign: 'right', flex: 1.5 },
    highlightText: { fontWeight: 'bold', color: colors.primary },
    errorText: { fontWeight: 'bold', color: colors.error || '#D32F2F' },

    actionsContainer: { width: '100%', marginTop: 20 },
    callButton: { flexDirection: 'row', backgroundColor: '#000000', height: 50, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginBottom: 15 },
    callButtonText: { color: colors.white, fontSize: 14, fontWeight: 'bold' },
    completeButton: { flexDirection: 'row', backgroundColor: colors.success || '#2E7D32', height: 50, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginBottom: 15 },
    completeButtonText: { color: colors.white, fontSize: 14, fontWeight: 'bold' },
    cancelButton: { height: 50, borderRadius: 10, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.error || '#D32F2F' },
    cancelButtonText: { color: colors.error || '#D32F2F', fontSize: 14, fontWeight: 'bold' }
});