import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';

export default function RequestCard({ service, technician, date, status, isRated, onPress, onRatePress }) {
    const isCompleted = status === 'completed';

    return (
        <View style={styles.card}>
            {/* Cuerpo de la tarjeta (Tocar aquí va a los detalles) */}
            <TouchableOpacity activeOpacity={0.7} onPress={onPress}>
                <View style={styles.header}>
                    <Text style={styles.serviceTitle} numberOfLines={1}>{service}</Text>

                    <View style={[styles.badge, isCompleted ? styles.badgeSuccess : styles.badgeWarning]}>
                        <Ionicons
                            name={isCompleted ? "checkmark-circle" : "time"}
                            size={14}
                            color={isCompleted ? colors.success : colors.warning}
                        />
                        <Text style={[styles.badgeText, isCompleted ? styles.textSuccess : styles.textWarning]}>
                            {isCompleted ? 'Concluido' : 'En proceso'}
                        </Text>
                    </View>
                </View>

                <View style={styles.infoRow}>
                    <Ionicons name="person-outline" size={16} color={colors.textMuted} />
                    <Text style={styles.infoText}>Técnico: {technician}</Text>
                </View>
                <View style={styles.infoRow}>
                    <Ionicons name="calendar-outline" size={16} color={colors.textMuted} />
                    <Text style={styles.infoText}>Fecha: {date}</Text>
                </View>
            </TouchableOpacity>

            {/* Fila de Acción (Totalmente separada para evitar bugs de toques) */}
            {isCompleted && !isRated && (
                <TouchableOpacity style={styles.rateButton} onPress={onRatePress} activeOpacity={0.8}>
                    <Text style={styles.rateButtonText}>Calificar Servicio</Text>
                </TouchableOpacity>
            )}

            {isCompleted && isRated && (
                <View style={styles.ratedMessage}>
                    <Ionicons name="star" size={14} color="#F9A825" />
                    <Text style={styles.ratedText}>Servicio calificado</Text>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: colors.surface, borderRadius: 16, padding: 16,
        marginBottom: 16, borderWidth: 1, borderColor: colors.border,
        shadowColor: colors.shadow, shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.04, shadowRadius: 8, elevation: 2,
    },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
    serviceTitle: { fontSize: 16, fontWeight: 'bold', color: colors.textMain, flex: 1, marginRight: 10 },
    badge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
    badgeWarning: { backgroundColor: colors.warningSoft },
    badgeSuccess: { backgroundColor: colors.successSoft },
    badgeText: { fontSize: 11, fontWeight: 'bold', marginLeft: 4 },
    textWarning: { color: colors.warning },
    textSuccess: { color: colors.success },
    infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
    infoText: { fontSize: 13, color: colors.textMuted, marginLeft: 8 },
    rateButton: {
        marginTop: 12, paddingVertical: 10, borderRadius: 10,
        borderWidth: 1, borderColor: colors.primary, alignItems: 'center',
    },
    rateButtonText: { color: colors.primary, fontSize: 13, fontWeight: 'bold' },
    ratedMessage: {
        flexDirection: 'row', alignItems: 'center', marginTop: 12,
        paddingTop: 12, borderTopWidth: 1, borderTopColor: colors.border,
    },
    ratedText: { fontSize: 13, color: colors.textMuted, fontWeight: '500', marginLeft: 6 }
});