import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';

export default function CategoryCard({ title, description, iconName, onPress }) {
    return (
        <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
            <View style={styles.iconContainer}>
                <Ionicons name={iconName} size={28} color={colors.primary} />
            </View>
            <Text style={styles.title}>{title}</Text>
            {description ? (
                <Text style={styles.description} numberOfLines={2}>{description}</Text>
            ) : null}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: colors.surface,
        width: '48%',
        padding: 16,
        borderRadius: 20,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: colors.border,
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 3,
        alignItems: 'flex-start',
    },
    iconContainer: {
        backgroundColor: colors.primarySoft,
        width: 46,
        height: 46,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 14,
    },
    title: {
        fontSize: 15,
        fontWeight: 'bold',
        color: colors.textMain,
        marginBottom: 4,
    },
    description: {
        fontSize: 12,
        color: colors.textMuted,
        lineHeight: 16,
    },
});