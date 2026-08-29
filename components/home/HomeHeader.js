import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';

export default function HomeHeader({ userName, avatarUrl, onProfilePress }) {
    return (
        <View style={styles.headerContainer}>
            <View style={styles.textContainer}>
                <Text style={styles.greeting}>¡Hola, {userName}!</Text>
                <Text style={styles.subtitle}>Encuentra a los mejores profesionales</Text>
            </View>

            <TouchableOpacity style={styles.avatarButton} onPress={onProfilePress} activeOpacity={0.8}>
                {avatarUrl ? (
                    <Image source={{ uri: avatarUrl }} style={styles.avatarImage} />
                ) : (
                    <Ionicons name="person" size={24} color={colors.primary} />
                )}
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    textContainer: {
        flex: 1,
    },
    greeting: {
        fontSize: 26,
        fontWeight: '900',
        color: colors.textMain,
        letterSpacing: -0.5,
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 14,
        color: colors.textMuted,
        fontWeight: '500',
    },
    avatarButton: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: colors.primarySoft,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: colors.border,
        overflow: 'hidden', // Importante para que la imagen quede redonda
    },
    avatarImage: {
        width: '100%',
        height: '100%',
    }
});