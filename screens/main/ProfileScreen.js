import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { authService } from '../../services/authService';

export default function ProfileScreen() {

    const handleLogout = async () => {
        try {
            await authService.logout();
            // ¡El AppNavigator detectará esto automáticamente y te mandará al Login!
        } catch (error) {
            Alert.alert('Error', 'Hubo un problema al cerrar sesión.');
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>

                {/* Cabecera del Perfil */}
                <View style={styles.header}>
                    <View style={styles.avatarContainer}>
                        <Ionicons name="person" size={40} color={colors.primary} />
                    </View>
                    <Text style={styles.name}>Juan Pérez</Text>
                    <Text style={styles.email}>juan.perez@ejemplo.com</Text>
                </View>

                {/* Opciones de la cuenta */}
                <View style={styles.optionsContainer}>
                    <TouchableOpacity style={styles.optionBtn} activeOpacity={0.7}>
                        <Ionicons name="settings-outline" size={24} color={colors.textMain} />
                        <Text style={styles.optionText}>Configuración de la cuenta</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.optionBtn} activeOpacity={0.7}>
                        <Ionicons name="shield-checkmark-outline" size={24} color={colors.textMain} />
                        <Text style={styles.optionText}>Privacidad y Seguridad</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.optionBtn} activeOpacity={0.7}>
                        <Ionicons name="help-circle-outline" size={24} color={colors.textMain} />
                        <Text style={styles.optionText}>Ayuda y Soporte</Text>
                    </TouchableOpacity>
                </View>

                {/* Botón de Cerrar Sesión */}
                <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.8}>
                    <Ionicons name="log-out-outline" size={24} color={colors.error || '#C62828'} />
                    <Text style={styles.logoutText}>Cerrar sesión</Text>
                </TouchableOpacity>

            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: colors.background },
    container: { flex: 1, padding: 20 },
    header: { alignItems: 'center', marginTop: 20, marginBottom: 40 },
    avatarContainer: {
        width: 90, height: 90, borderRadius: 45,
        backgroundColor: colors.surface,
        alignItems: 'center', justifyContent: 'center',
        marginBottom: 15,
        borderWidth: 2, borderColor: colors.primary,
        elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4
    },
    name: { fontSize: 24, fontWeight: 'bold', color: colors.textMain, marginBottom: 4 },
    email: { fontSize: 14, color: colors.textMuted },
    optionsContainer: { flex: 1 },
    optionBtn: {
        flexDirection: 'row', alignItems: 'center',
        backgroundColor: colors.surface,
        padding: 16, borderRadius: 16, marginBottom: 12,
        borderWidth: 1, borderColor: colors.border
    },
    optionText: { fontSize: 16, color: colors.textMain, marginLeft: 15, fontWeight: '500' },
    logoutBtn: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
        backgroundColor: '#FFEBEE', // Fondo rojo muy suave
        padding: 16, borderRadius: 16, marginTop: 'auto', marginBottom: 10,
        borderWidth: 1, borderColor: '#FFCDD2'
    },
    logoutText: { fontSize: 16, color: '#C62828', marginLeft: 8, fontWeight: 'bold' }
});