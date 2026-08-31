import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../../theme/colors';
import ProgressStepper from '../../../components/ui/ProgressStepper';

export default function RequestSuccessScreen({ route, navigation }) {
    // Recibimos los datos reales que nos mandará la pantalla de creación
    const { requestData } = route.params || {};

    // Valores por defecto por si falta algún dato
    const techName = requestData?.technicianName || 'Profesional asignado';
    const serviceName = requestData?.categoryName || 'Servicio solicitado';
    const date = requestData?.suggested_date || 'A coordinar';
    const time = requestData?.suggested_time_range || 'A coordinar';

    const ReceiptRow = ({ label, value, highlight }) => (
        <View style={styles.receiptRow}>
            <Text style={styles.receiptLabel}>{label}</Text>
            <Text style={[styles.receiptValue, highlight && styles.highlightText]}>{value}</Text>
        </View>
    );

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>

                <View style={styles.iconCircle}>
                    <Ionicons name="checkmark-sharp" size={48} color={colors.primary} />
                </View>

                <Text style={styles.title}>¡SOLICITUD ENVIADA!</Text>
                <Text style={styles.subtitle}>Tu requerimiento será notificado al técnico.</Text>

                <ProgressStepper currentStep={0} />

                <View style={styles.receiptCard}>
                    <Text style={styles.receiptTitle}>Detalles de la solicitud</Text>

                    {/* USAMOS LOS DATOS REALES AQUÍ */}
                    <ReceiptRow label="Técnico:" value={techName} />
                    <ReceiptRow label="Servicio:" value={serviceName} />
                    <ReceiptRow label="Fecha sugerida:" value={date} />
                    <ReceiptRow label="Hora o rango:" value={time} />
                    <ReceiptRow label="Tarifa:" value="A convenir con el técnico" highlight={true} />
                </View>

                <TouchableOpacity
                    style={styles.primaryButton}
                    activeOpacity={0.8}
                    onPress={() => navigation.navigate('Solicitudes')}
                >
                    <Text style={styles.primaryButtonText}>VER ESTADO DE SOLICITUD</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.secondaryButton}
                    activeOpacity={0.7}
                    onPress={() => navigation.navigate('Inicio')}
                >
                    <Text style={styles.secondaryButtonText}>VOLVER AL INICIO</Text>
                </TouchableOpacity>

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: colors.background },
    container: { padding: 20, alignItems: 'center', paddingTop: 40 },
    iconCircle: { width: 90, height: 90, borderRadius: 45, backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
    title: { fontSize: 24, fontWeight: '900', color: colors.textMain, marginBottom: 8, letterSpacing: 0.5 },
    subtitle: { fontSize: 14, color: colors.textMuted, marginBottom: 10 },
    receiptCard: { width: '100%', backgroundColor: colors.surface, borderRadius: 16, padding: 20, borderWidth: 1, borderColor: colors.border, marginBottom: 30, shadowColor: colors.shadow, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 3 },
    receiptTitle: { fontSize: 16, fontWeight: 'bold', color: colors.textMain, marginBottom: 15 },
    receiptRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
    receiptLabel: { fontSize: 14, color: colors.textMuted, flex: 1 },
    receiptValue: { fontSize: 14, color: colors.textMain, fontWeight: '500', textAlign: 'right', flex: 1.5 },
    highlightText: { fontWeight: 'bold', color: colors.primary },
    primaryButton: { width: '100%', backgroundColor: colors.primary, height: 55, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginBottom: 15, shadowColor: colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 },
    primaryButtonText: { color: colors.white, fontSize: 14, fontWeight: 'bold', letterSpacing: 0.5 },
    secondaryButton: { width: '100%', backgroundColor: colors.surface, height: 55, borderRadius: 12, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.border },
    secondaryButtonText: { color: colors.textMain, fontSize: 14, fontWeight: 'bold' }
});