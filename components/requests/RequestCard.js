import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';

export default function RequestCard({ service, technician, date, status, isRated, onPress, onRatePress }) {
    const isCompleted = status === 'completed';
    const isRejected = status === 'rejected'; // Nuevo estado para trabajos cancelados

    // Configuramos los colores y textos dinámicamente según el estado
    let badgeStyle = styles.badgeWarning;
    let badgeTextStyle = styles.textWarning;
    let badgeIcon = "time";
    let badgeLabel = "En proceso";

    if (isCompleted) {
        badgeStyle = styles.badgeSuccess;
        badgeTextStyle = styles.textSuccess;
        badgeIcon = "checkmark-circle";
        badgeLabel = "Concluido";
    } else if (isRejected) {
        badgeStyle = styles.badgeDanger;
        badgeTextStyle = styles.textDanger;
        badgeIcon = "close-circle";
        badgeLabel = "Cancelado";
    }

    return (
        <View style={styles.card}>
            <TouchableOpacity activeOpacity={0.7} onPress={onPress}>
                <View style={styles.header}>
                    <Text style={styles.serviceTitle} numberOfLines={1}>{service}</Text>

                    <View style={[styles.badge, badgeStyle]}>
                        <Ionicons name={badgeIcon} size={14} color={StyleSheet.flatten(badgeTextStyle).color} />
                        <Text style={[styles.badgeText, badgeTextStyle]}>{badgeLabel}</Text>
                    </View>
                </View>

                <View style={styles.infoRow}>
                    <Ionicons name="person-outline" size={16} color={colors.textMuted} />
                    <Text style={styles.infoText}>Profesional: <Text style={styles.boldText}>{technician}</Text></Text>
                </View>

                <View style={styles.infoRow}>
                    <Ionicons name="calendar-outline" size={16} color={colors.textMuted} />
                    <Text style={styles.infoText}>Programado: <Text style={styles.boldText}>{date}</Text></Text>
                </View>

                {/* Flecha indicadora discreta */}
                <View style={styles.chevronContainer}>
                    <Text style={styles.chevronText}>Ver detalles</Text>
                    <Ionicons name="chevron-forward" size={14} color={colors.primary} />
                </View>
            </TouchableOpacity>

            {/* Fila de Calificación */}
            {isCompleted && !isRated && (
                <TouchableOpacity style={styles.rateButton} onPress={onRatePress} activeOpacity={0.8}>
                    <Ionicons name="star" size={16} color={colors.surface} style={{ marginRight: 6 }} />
                    <Text style={styles.rateButtonText}>CALIFICAR SERVICIO</Text>
                </TouchableOpacity>
            )}

            {isCompleted && isRated && (
                <View style={styles.ratedMessage}>
                    <View style={styles.ratedIconCircle}>
                        <Ionicons name="star" size={12} color="#F9A825" />
                    </View>
                    <Text style={styles.ratedText}>¡Gracias por calificar este servicio!</Text>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: colors.surface, borderRadius: 20, padding: 18,
        marginBottom: 16, borderWidth: 1, borderColor: colors.border,
        shadowColor: colors.shadow, shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.05, shadowRadius: 12, elevation: 3,
    },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 15 },
    serviceTitle: { fontSize: 17, fontWeight: '900', color: colors.textMain, flex: 1, marginRight: 10, letterSpacing: -0.3 },

    badge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 12 },
    badgeWarning: { backgroundColor: colors.warningSoft },
    badgeSuccess: { backgroundColor: colors.successSoft },
    badgeDanger: { backgroundColor: colors.errorSoft || '#FEE2E2' },

    badgeText: { fontSize: 12, fontWeight: 'bold', marginLeft: 4 },
    textWarning: { color: colors.warning },
    textSuccess: { color: colors.success },
    textDanger: { color: colors.error || '#DC2626' },

    infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
    infoText: { fontSize: 14, color: colors.textMuted, marginLeft: 8 },
    boldText: { fontWeight: '600', color: colors.textMain },

    chevronContainer: { flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', marginTop: 5 },
    chevronText: { fontSize: 12, fontWeight: '600', color: colors.primary, marginRight: 4 },

    rateButton: {
        flexDirection: 'row', marginTop: 15, paddingVertical: 12, borderRadius: 12,
        backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center',
        shadowColor: colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4
    },
    rateButtonText: { color: colors.surface, fontSize: 13, fontWeight: 'bold', letterSpacing: 0.5 },

    ratedMessage: { flexDirection: 'row', alignItems: 'center', marginTop: 15, paddingTop: 15, borderTopWidth: 1, borderTopColor: colors.border },
    ratedIconCircle: { width: 24, height: 24, borderRadius: 12, backgroundColor: '#FFF9C4', alignItems: 'center', justifyContent: 'center', marginRight: 8 },
    ratedText: { fontSize: 13, color: colors.textMain, fontWeight: '600' }
});