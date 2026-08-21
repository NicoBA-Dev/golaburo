import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';

export default function TechnicianCard({
    name, rating, reviews, description, zones, price, verified,
    onProfilePress, onRequestPress
}) {
    return (
        <View style={styles.card}>

            {/* Cuerpo de la tarjeta (Tocar aquí va al Perfil) */}
            <TouchableOpacity activeOpacity={0.7} onPress={onProfilePress}>
                {/* Fila Superior: Avatar y Datos Principales */}
                <View style={styles.headerRow}>
                    <View style={styles.avatarContainer}>
                        <Ionicons name="person" size={28} color={colors.textMuted} />
                    </View>

                    <View style={styles.infoContainer}>
                        <View style={styles.nameRow}>
                            <Text style={styles.name} numberOfLines={1}>{name}</Text>
                            {verified && (
                                <View style={styles.badge}>
                                    <Ionicons name="checkmark-circle" size={12} color={colors.surface} />
                                    <Text style={styles.badgeText}>Verificado</Text>
                                </View>
                            )}
                        </View>

                        <View style={styles.ratingRow}>
                            <Ionicons name="star" size={14} color="#F9A825" />
                            <Text style={styles.ratingText}>{rating}</Text>
                            <Text style={styles.reviewsText}>({reviews} reseñas)</Text>
                        </View>
                    </View>
                </View>

                {/* Detalles del Servicio */}
                <View style={styles.detailsContainer}>
                    <Text style={styles.description} numberOfLines={2}>{description}</Text>

                    <View style={styles.metaContainer}>
                        <View style={styles.metaItem}>
                            <Ionicons name="location-outline" size={14} color={colors.textMuted} />
                            <Text style={styles.metaText} numberOfLines={1}>{zones}</Text>
                        </View>
                        <View style={styles.metaItem}>
                            <Ionicons name="cash-outline" size={14} color={colors.textMuted} />
                            <Text style={styles.metaText}>Bs. {price} (Tarifa base)</Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>

            {/* Fila de Acción (Botones independientes) */}
            <View style={styles.actionRow}>
                <TouchableOpacity style={styles.iconBtn} activeOpacity={0.7} onPress={onProfilePress}>
                    <Ionicons name="person-outline" size={20} color={colors.textMain} />
                    <Text style={styles.iconBtnText}>Perfil</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.primaryBtn} activeOpacity={0.8} onPress={onRequestPress}>
                    <Text style={styles.primaryBtnText}>Solicitar</Text>
                    <Ionicons name="arrow-forward" size={18} color={colors.surface} style={{ marginLeft: 4 }} />
                </TouchableOpacity>
            </View>

        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: colors.surface,
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: colors.border,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    avatarContainer: {
        width: 50,
        height: 50,
        borderRadius: 25, // Lo hacemos circular, es más amigable para avatares
        backgroundColor: colors.background,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
        borderWidth: 1,
        borderColor: colors.border,
    },
    infoContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    nameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
        flexWrap: 'wrap',
    },
    name: {
        fontSize: 17,
        fontWeight: 'bold',
        color: colors.textMain,
        marginRight: 6,
    },
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.primary,
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 12,
    },
    badgeText: {
        color: colors.surface,
        fontSize: 9,
        fontWeight: 'bold',
        marginLeft: 2,
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    ratingText: {
        fontSize: 13,
        fontWeight: 'bold',
        color: colors.textMain,
        marginLeft: 4,
        marginRight: 4,
    },
    reviewsText: {
        fontSize: 12,
        color: colors.textMuted,
    },
    detailsContainer: {
        marginBottom: 12,
    },
    description: {
        fontSize: 13,
        color: colors.textMain,
        marginBottom: 10,
        lineHeight: 18,
    },
    metaContainer: {
        backgroundColor: colors.background,
        padding: 10,
        borderRadius: 8,
        gap: 6, // Espaciado entre elementos (React Native moderno)
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    metaText: {
        fontSize: 12,
        color: colors.textMuted,
        marginLeft: 6,
        flex: 1,
    },
    actionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderTopWidth: 1,
        borderTopColor: colors.border,
        paddingTop: 12,
    },
    iconBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 12,
    },
    iconBtnText: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.textMain,
        marginLeft: 6,
    },
    primaryBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1A1A1A', // Botón de acción oscuro premium
        paddingVertical: 10,
        paddingHorizontal: 18,
        borderRadius: 10,
    },
    primaryBtnText: {
        color: colors.surface,
        fontSize: 14,
        fontWeight: 'bold',
    },
});