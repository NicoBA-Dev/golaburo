import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';

export default function TechnicianCard({
    name, avatarUrl, rating, reviews, description, zones, price, verified,
    onProfilePress, onRequestPress,
    isFavorite, onToggleFavorite,
}) {
    return (
        <View style={styles.card}>

            {/* Botón de Favorito (esquina superior derecha) */}
            {onToggleFavorite ? (
                <TouchableOpacity
                    style={styles.favoriteBtn}
                    activeOpacity={0.7}
                    onPress={onToggleFavorite}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                    <Ionicons
                        name={isFavorite ? 'heart' : 'heart-outline'}
                        size={22}
                        color={isFavorite ? colors.secondary : colors.textMuted}
                    />
                </TouchableOpacity>
            ) : null}

            {/* Cuerpo de la tarjeta (Tocar aquí va al Perfil) */}
            <TouchableOpacity activeOpacity={0.7} onPress={onProfilePress}>

                {/* Fila Superior: Avatar y Datos Principales */}
                <View style={styles.headerRow}>
                    <View style={styles.avatarContainer}>
                        {avatarUrl ? (
                            <Image source={{ uri: avatarUrl }} style={styles.avatarImage} />
                        ) : (
                            <Ionicons name="person" size={28} color={colors.primarySoft} />
                        )}
                    </View>

                    <View style={styles.infoContainer}>
                        <View style={styles.nameRow}>
                            <Text style={styles.name} numberOfLines={1}>{name}</Text>
                            {verified && (
                                <View style={styles.verifiedBadge}>
                                    <Ionicons name="checkmark" size={10} color={colors.white} />
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
                            <Ionicons name="location" size={16} color={colors.primary} />
                            <Text style={styles.metaText} numberOfLines={1}>{zones}</Text>
                        </View>
                        <View style={styles.metaItem}>
                            <Ionicons name="wallet" size={16} color={colors.success} />
                            <Text style={styles.metaText}>Bs. {price} (Tarifa base)</Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>

            {/* Fila de Acción (Botones independientes) */}
            <View style={styles.actionRow}>
                <TouchableOpacity style={styles.iconBtn} activeOpacity={0.7} onPress={onProfilePress}>
                    <Ionicons name="person-circle-outline" size={22} color={colors.textMain} />
                    <Text style={styles.iconBtnText}>Ver perfil</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.primaryBtn} activeOpacity={0.8} onPress={onRequestPress}>
                    <Text style={styles.primaryBtnText}>SOLICITAR</Text>
                    <Ionicons name="arrow-forward" size={18} color={colors.white} style={{ marginLeft: 6 }} />
                </TouchableOpacity>
            </View>

        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: colors.surface,
        borderRadius: 20,
        padding: 18,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: colors.border,
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.04,
        shadowRadius: 12,
        elevation: 3,
    },
    favoriteBtn: {
        position: 'absolute',
        top: 14,
        right: 14,
        zIndex: 1,
        padding: 4,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingRight: 30,
        marginBottom: 14,
    },
    avatarContainer: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: colors.background,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 14,
        borderWidth: 1,
        borderColor: colors.border,
        overflow: 'hidden',
    },
    avatarImage: {
        width: '100%',
        height: '100%',
    },
    infoContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    nameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    name: {
        fontSize: 17,
        fontWeight: '900',
        color: colors.textMain,
        marginRight: 6,
        letterSpacing: -0.3,
    },
    verifiedBadge: {
        backgroundColor: colors.primary,
        width: 16,
        height: 16,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
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
        fontWeight: '500',
        color: colors.textMuted,
    },
    detailsContainer: {
        marginBottom: 14,
    },
    description: {
        fontSize: 14,
        color: colors.textMuted,
        marginBottom: 14,
        lineHeight: 20,
    },
    metaContainer: {
        backgroundColor: colors.background,
        padding: 12,
        borderRadius: 12,
        gap: 8,
        borderWidth: 1,
        borderColor: colors.border,
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    metaText: {
        fontSize: 13,
        color: colors.textMain,
        fontWeight: '500',
        marginLeft: 8,
        flex: 1,
    },
    actionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderTopWidth: 1,
        borderTopColor: colors.border,
        paddingTop: 15,
        marginTop: 5,
    },
    iconBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 6,
    },
    iconBtnText: {
        fontSize: 14,
        fontWeight: '700',
        color: colors.textMain,
        marginLeft: 6,
    },
    primaryBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.primary,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 14,
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 3,
    },
    primaryBtnText: {
        color: colors.white,
        fontSize: 13,
        fontWeight: '900',
        letterSpacing: 0.5,
    },
});