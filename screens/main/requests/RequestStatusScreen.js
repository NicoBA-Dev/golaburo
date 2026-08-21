import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../../theme/colors';
import ProgressStepper from '../../../components/ui/ProgressStepper';

export default function RequestStatusScreen({ route, navigation }) {
    // Recibimos los datos de la tarjeta que se tocó
    const { requestData } = route.params;

    const ReceiptRow = ({ label, value, highlight }) => (
        <View style={styles.receiptRow}>
            <Text style={styles.receiptLabel}>{label}</Text>
            <Text style={[styles.receiptValue, highlight && styles.highlightText]}>{value}</Text>
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
                <Text style={styles.serviceTitle}>{requestData.service}</Text>
                <Text style={styles.technicianText}>Técnico asignado: {requestData.technician}</Text>

                {/* El Stepper dinámico según el paso del pedido */}
                <ProgressStepper currentStep={requestData.step} />

                <View style={styles.receiptCard}>
                    <Text style={styles.receiptTitle}>Resumen de la orden</Text>
                    <ReceiptRow label="ID de Orden:" value={`#00${requestData.id}`} />
                    <ReceiptRow label="Fecha solicitada:" value={requestData.date} />
                    <ReceiptRow label="Estado:" value={requestData.status === 'active' ? 'En Curso' : 'Concluido'} />
                    <ReceiptRow label="Tarifa acordada:" value={`Bs. ${requestData.price}`} highlight={true} />
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
});