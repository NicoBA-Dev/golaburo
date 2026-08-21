import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';

export default function TechnicianMiniProfile({ name, rating, reviews, verified, onChatPress }) {
    return (
        <View style={styles.container}>
            {/* Avatar */}
            <View style={styles.avatar}>
                <Ionicons name="person" size={24} color={colors.textMuted} />
            </View>

            {/* Información */}
            <View style={styles.info}>
                <View style={styles.nameRow}>
                    <Text style={styles.name} numberOfLines={1}>{name}</Text>
                    {verified && (
                        <Ionicons name="checkmark-circle" size={16} color={colors.primary} style={styles.badge} />
                    )}
                </View>
                <Text style={styles.ratingText}>
                    <Ionicons name="star" size={14} color="#F9A825" /> {rating} de 5 ({reviews} Calificaciones)
                </Text>
            </View>

            {/* Botón de Chat */}
            <TouchableOpacity style={styles.chatButton} onPress={onChatPress} activeOpacity={0.7}>
                <Ionicons name="chatbubble-ellipses-outline" size={24} color={colors.textMain} />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.surface,
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: colors.border,
        marginBottom: 20,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: colors.background,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 15,
        borderWidth: 1,
        borderColor: colors.border,
    },
    info: {
        flex: 1,
    },
    nameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    name: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.textMain,
    },
    badge: {
        marginLeft: 4,
    },
    ratingText: {
        fontSize: 13,
        color: colors.textMuted,
    },
    chatButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: colors.background,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 10,
    },
});