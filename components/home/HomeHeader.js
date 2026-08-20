import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { colors } from '../../theme/colors';

export default function HomeHeader({ userName = 'Usuario' }) {
    return (
        <View style={styles.headerContainer}>
            <Image
                source={require('../../assets/logo-small.png')}
                style={styles.logo}
                resizeMode="contain"
            />
            <Text style={styles.greeting}>¡Hola, {userName}!</Text>
            <Text style={styles.subtitle}>Conecta con técnicos de confianza en Cochabamba.</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    headerContainer: {
        marginTop: 10,
        marginBottom: 25,
    },
    logo: {
        width: 140,
        height: 40,
        marginBottom: 15,
        tintColor: colors.primary, // Vuelve el filtro verde que quita los colores originales
    },
    greeting: {
        fontSize: 28,
        fontWeight: 'bold',
        color: colors.primary,
        marginBottom: 5,
    },
    subtitle: {
        fontSize: 16,
        color: colors.textMuted,
        lineHeight: 22,
    },
});