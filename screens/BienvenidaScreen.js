import React from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator, SafeAreaView } from 'react-native';
import { colors } from '../theme/colors';

export default function BienvenidaScreen() {
    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>

                {/* Header: Solo el logo completo */}
                <View style={styles.header}>
                    <Image
                        source={require('../assets/logo-small.png')}
                        style={styles.logoHeader}
                        resizeMode="contain"
                    />
                </View>

                {/* Contenido Central */}
                <View style={styles.centerContent}>
                    {/* Contenedor limpio, sin sombras ni fondos */}
                    <View style={styles.iconContainer}>
                        <Image
                            source={require('../assets/main-icon.png')}
                            style={styles.mainIcon}
                            resizeMode="contain"
                        />
                    </View>

                    <Text style={styles.title}>¡Bienvenido a{'\n'}Go Laburo!</Text>
                    <Text style={styles.subtitle}>Encuentra el técnico ideal{'\n'}para tu hogar</Text>

                    {/* Estrellas */}
                    <View style={styles.starsContainer}>
                        {[1, 2, 3, 4, 5].map((item) => (
                            <Text key={item} style={styles.star}>★</Text>
                        ))}
                    </View>
                </View>

                {/* Footer: Animación de carga y Copyright */}
                <View style={styles.footer}>
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="small" color={colors.primary} style={styles.loader} />
                        <Text style={styles.loadingText}>Cargando aplicación...</Text>
                    </View>
                    <Text style={styles.copyright}>© 2024 Go Laburo</Text>
                </View>

            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: colors.background,
    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 40,
        paddingHorizontal: 20,
    },
    header: {
        marginTop: 20,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
    },
    logoHeader: {
        width: 160, // Ancho suficiente para que se lea bien el texto de tu logo
        height: 50,
        tintColor: colors.primary,
    },
    centerContent: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        width: '100%',
    },
    iconContainer: {
        marginBottom: 35,
        alignItems: 'center',
        justifyContent: 'center',
        // Sombras eliminadas para respetar el PNG limpio
    },
    mainIcon: {
        width: 170,
        height: 170,
        tintColor: colors.primary,

        // tintColor eliminado para no sobreescribir los colores de tu imagen original
    },
    title: {
        fontSize: 34,
        fontWeight: '900',
        color: colors.primary,
        textAlign: 'center',
        marginBottom: 12,
        letterSpacing: 0.5,
    },
    subtitle: {
        fontSize: 18,
        color: colors.textMain,
        textAlign: 'center',
        marginBottom: 25,
        lineHeight: 24,
    },
    starsContainer: {
        flexDirection: 'row',
        gap: 8,
    },
    star: {
        fontSize: 32,
        color: colors.primary,
    },
    footer: {
        alignItems: 'center',
        paddingBottom: 10,
    },
    loadingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    loader: {
        marginRight: 10,
    },
    loadingText: {
        fontSize: 16,
        color: colors.textMuted,
        fontWeight: '500',
    },
    copyright: {
        fontSize: 13,
        color: colors.textMuted,
        opacity: 0.7,
    },
});