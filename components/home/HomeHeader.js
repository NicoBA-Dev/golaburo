import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';

export default function HomeHeader({ userName = 'Usuario' }) {
    // Extraemos solo el primer nombre para un saludo más amigable
    const firstName = userName ? userName.split(' ')[0] : 'Usuario';

    return (
        <View style={styles.headerContainer}>
            <View style={styles.textContainer}>
                <Text style={styles.greeting}>¡Hola, {firstName}!</Text>
                <Text style={styles.subtitle}>¿En qué te podemos ayudar hoy?</Text>
            </View>
            <View style={styles.avatarCircle}>
                <Ionicons name="person" size={24} color={colors.primary} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 25,
    },
    textContainer: {
        flex: 1,
        paddingRight: 10,
    },
    greeting: {
        fontSize: 26,
        fontWeight: 'bold',
        color: colors.primary,
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 15,
        color: colors.textMuted,
        lineHeight: 20,
    },
    avatarCircle: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: colors.primarySoft,
        alignItems: 'center',
        justifyContent: 'center',
    }
});