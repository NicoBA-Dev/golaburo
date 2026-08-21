import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../../theme/colors';

export default function TechnicianProfileScreen({ route, navigation }) {
    const { technician } = route.params || {};

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={colors.textMain} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Perfil del Técnico</Text>
                <View style={{ width: 24 }} />
            </View>

            <View style={styles.container}>
                <Ionicons name="person-circle-outline" size={100} color={colors.primary} />
                <Text style={styles.name}>{technician?.name || 'Técnico'}</Text>
                <Text style={styles.description}>
                    Esta pantalla mostrará el portafolio, fotos de trabajos anteriores y todas las reseñas detalladas de este trabajador.
                </Text>

                <TouchableOpacity
                    style={styles.requestButton}
                    activeOpacity={0.8}
                    onPress={() => navigation.navigate('CreateRequest', { technician })}
                >
                    <Text style={styles.requestButtonText}>Solicitar a este técnico</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: colors.background },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 15, backgroundColor: colors.surface, borderBottomWidth: 1, borderBottomColor: colors.border },
    backButton: { padding: 5, marginLeft: -5 },
    headerTitle: { fontSize: 18, fontWeight: 'bold', color: colors.textMain },
    container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },
    name: { fontSize: 24, fontWeight: 'bold', color: colors.textMain, marginTop: 15, marginBottom: 10 },
    description: { fontSize: 15, color: colors.textMuted, textAlign: 'center', marginBottom: 30, lineHeight: 22 },
    requestButton: { backgroundColor: colors.primary, paddingHorizontal: 30, paddingVertical: 15, borderRadius: 12 },
    requestButtonText: { color: colors.white, fontWeight: 'bold', fontSize: 16 }
});