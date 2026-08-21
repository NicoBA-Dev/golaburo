import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';

// Componentes
import HomeHeader from '../../components/home/HomeHeader';
import CategoryCard from '../../components/home/CategoryCard';

export default function HomeScreen() {
    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

                {/* Cabecera limpia */}
                <HomeHeader userName="Juan" />

                <Text style={styles.sectionTitle}>¿Qué servicio necesitas?</Text>

                {/* Cuadrícula de Servicios (2 columnas) */}
                <View style={styles.gridContainer}>
                    <CategoryCard
                        title="Plomería"
                        description="Fugas, grifería, tuberías"
                        iconName="water-outline"
                    />
                    <CategoryCard
                        title="Electricidad"
                        description="Cortocircuitos, cableado"
                        iconName="flash-outline"
                    />
                    <CategoryCard
                        title="Cerrajería"
                        description="Aperturas, chapas, llaves"
                        iconName="key-outline"
                    />
                    <CategoryCard
                        title="Pintura"
                        description="Interiores, exteriores"
                        iconName="color-palette-outline"
                    />
                </View>

                {/* Banner Destacado: Reparación de Equipos */}
                <TouchableOpacity style={styles.specialBanner} activeOpacity={0.8}>
                    <View style={styles.specialIconBg}>
                        <Ionicons name="hardware-chip-outline" size={32} color={colors.primary} />
                    </View>
                    <View style={styles.bannerTextContainer}>
                        <Text style={styles.bannerTitle}>Reparación de equipos</Text>
                        <Text style={styles.bannerDesc}>Lavadoras, cocinas y microondas en Sarco, Tiquipaya y Cercado.</Text>
                    </View>
                </TouchableOpacity>

                {/* Badge de Seguridad (Usando el verde principal para dar confianza) */}
                <View style={styles.trustBadge}>
                    <Ionicons name="shield-checkmark" size={36} color={colors.surface} />
                    <View style={styles.trustTextContainer}>
                        <Text style={styles.trustTitle}>Técnicos 100% Verificados</Text>
                        <Text style={styles.trustDesc}>Revisamos antecedentes y certificaciones en Bolivia.</Text>
                    </View>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: colors.background,
    },
    scroll: {
        padding: 20,
        paddingBottom: 40,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.textMain,
        marginBottom: 15,
    },
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    specialBanner: {
        backgroundColor: colors.surface,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: colors.border,
        marginBottom: 20,
    },
    specialIconBg: {
        backgroundColor: colors.background,
        padding: 12,
        borderRadius: 12,
        marginRight: 15,
    },
    bannerTextContainer: {
        flex: 1,
    },
    bannerTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.textMain,
        marginBottom: 4,
    },
    bannerDesc: {
        fontSize: 13,
        color: colors.textMuted,
        lineHeight: 18,
    },
    trustBadge: {
        backgroundColor: colors.primary, // Fondo verde para transmitir seguridad
        flexDirection: 'row',
        alignItems: 'center',
        padding: 18,
        borderRadius: 16,
    },
    trustTextContainer: {
        flex: 1,
        marginLeft: 15,
    },
    trustTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.surface, // Texto blanco
        marginBottom: 4,
    },
    trustDesc: {
        fontSize: 13,
        color: 'rgba(255,255,255,0.85)', // Blanco ligeramente transparente
        lineHeight: 18,
    },
});