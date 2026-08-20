import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';

export default function TechnicianCard({ name, rating, reviews, description, zones, price, verified, onPress }) {
    return (
        <TouchableOpacity style={styles.card} activeOpacity={0.7} onPress={onPress}>

            {/* Fila Superior: Avatar y Datos Principales */}
            <View style={styles.headerRow}>
                {/* Avatar Placeholder */}
                <View style={styles.avatarContainer}>
                    <Ionicons name="person" size={32} color={colors.textMuted} />
                </View>

                <View style={styles.infoContainer}>
                    <View style={styles.nameRow}>
                        <Text style={styles.name} numberOfLines={1}>{name}</Text>
                        {verified && (
                            <View style={styles.badge}>
                                <Ionicons name="checkmark-circle" size={14} color={colors.surface} />
                                <Text style={styles.badgeText}>Verificado</Text>
                            </View>
                        )}
                    </View>

                    <View style={styles.ratingRow}>
                        <Ionicons name="star" size={16} color={colors.warning || '#F9A825'} />
                        <Text style={styles.ratingText}>{rating}</Text>
                        <Text style={styles.reviewsText}>({reviews} reseñas)</Text>
                    </View>
                </View>
            </View>

            {/* Fila Inferior: Detalles del Servicio */}
            <View style={styles.detailsContainer}>
                <Text style={styles.description} numberOfLines={2}>{description}</Text>

                <View style={styles.metaRow}>
                    <Text style={styles.metaLabel}>Zona: </Text>
                    <Text style={styles.metaValue} numberOfLines={1}>{zones}</Text>
                </View>

                <View style={styles.metaRow}>
                    <Text style={styles.metaLabel}>Tarifa base: </Text>
                    <Text style={styles.priceValue}>Bs. {price}</Text>
                </View>
            </View>

        </TouchableOpacity>
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
        // Sombra sutil para separar del fondo
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    avatarContainer: {
        width: 60,
        height: 60,
        borderRadius: 12, // Cuadrado con bordes redondeados como en el mock
        backgroundColor: colors.background,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 15,
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
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.textMain,
        marginRight: 8,
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
        fontSize: 10,
        fontWeight: 'bold',
        marginLeft: 2,
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    ratingText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: colors.textMain,
        marginLeft: 4,
        marginRight: 4,
    },
    reviewsText: {
        fontSize: 13,
        color: colors.textMuted,
    },
    detailsContainer: {
        borderTopWidth: 1,
        borderTopColor: colors.border,
        paddingTop: 12,
    },
    description: {
        fontSize: 14,
        color: colors.textMain,
        marginBottom: 8,
        lineHeight: 20,
    },
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    metaLabel: {
        fontSize: 13,
        fontWeight: 'bold',
        color: colors.textMain,
    },
    metaValue: {
        fontSize: 13,
        color: colors.textMuted,
        flex: 1,
    },
    priceValue: {
        fontSize: 14,
        fontWeight: 'bold',
        color: colors.primary, // Resaltamos el precio en verde
    },
});