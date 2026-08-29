import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';

export default function TechnicianMiniProfile({ name, avatarUrl, rating, reviews, verified }) {
    return (
        <View style={styles.container}>
            {/* Avatar del Técnico (Soporta URL real o ícono por defecto) */}
            <View style={styles.avatarContainer}>
                {avatarUrl ? (
                    <Image source={{ uri: avatarUrl }} style={styles.avatarImage} />
                ) : (
                    <Ionicons name="person" size={28} color={colors.primarySoft} />
                )}
            </View>

            {/* Información Principal */}
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
                    <Text style={styles.ratingText}>
                        {rating} <Text style={styles.reviewsText}>({reviews} reseñas)</Text>
                    </Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.surface,
        padding: 14,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: colors.border,
        // Sombra sutil para darle profundidad
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.03,
        shadowRadius: 8,
        elevation: 2,
    },
    avatarContainer: {
        width: 52,
        height: 52,
        borderRadius: 26,
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
        fontSize: 16,
        fontWeight: '900',
        color: colors.textMain,
        letterSpacing: -0.3,
        marginRight: 6,
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
    },
    reviewsText: {
        fontWeight: '500',
        color: colors.textMuted,
    }
});