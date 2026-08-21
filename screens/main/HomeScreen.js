import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';

// 1. NUEVAS CATEGORÍAS RÁPIDAS (Scroll Horizontal)
const QUICK_CATEGORIES = [
    { title: 'Albañilería', icon: 'hammer-outline' },
    { title: 'Mudanzas', icon: 'cube-outline' },
    { title: 'Jardinería', icon: 'leaf-outline' },
    { title: 'Pintura', icon: 'color-palette-outline' },
];

// 2. SERVICIOS POPULARES (Tarjetas Renovadas)
const POPULAR_SERVICES = [
    { id: '1', title: 'Plomería', desc: 'Fugas y tuberías', icon: 'water-outline' },
    { id: '2', title: 'Electricidad', desc: 'Cortocircuitos y tableros', icon: 'flash-outline' },
    { id: '3', title: 'Cerrajería', desc: 'Aperturas 24/7', icon: 'key-outline' },
    { id: '4', title: 'Limpieza', desc: 'Casas y oficinas', icon: 'sparkles-outline' },
];

export default function HomeScreen({ navigation }) {
    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

                {/* HERO SECTION: Sin logo, fondo difuminado y buscador integrado */}
                <View style={styles.heroContainer}>
                    <View style={styles.heroBlurEffect}>
                        <View style={styles.heroHeader}>
                            <View>
                                <Text style={styles.greeting}>Hola, Daniel 👋</Text>
                                <Text style={styles.locationText}>
                                    <Ionicons name="location" size={14} color={colors.primary} /> Cochabamba, Bolivia
                                </Text>
                            </View>
                            <TouchableOpacity style={styles.profileBtn} onPress={() => navigation.navigate('Perfil')}>
                                <Ionicons name="person" size={20} color={colors.surface} />
                            </TouchableOpacity>
                        </View>

                        {/* Barra de búsqueda falsa que salta al buscador real */}
                        <TouchableOpacity
                            style={styles.searchBarFake}
                            activeOpacity={0.9}
                            onPress={() => navigation.navigate('Buscar', { screen: 'Explore' })}
                        >
                            <Ionicons name="search" size={20} color={colors.textMuted} />
                            <Text style={styles.searchText}>¿Qué necesitas reparar hoy?</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* CARRUSEL RÁPIDO */}
                <Text style={styles.sectionTitle}>Nuevos Servicios</Text>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.horizontalScroll}
                    contentContainerStyle={styles.horizontalContent}
                >
                    {QUICK_CATEGORIES.map((cat, index) => (
                        <TouchableOpacity
                            key={index}
                            style={styles.quickCategory}
                            activeOpacity={0.7}
                            onPress={() => navigation.navigate('Buscar', { screen: 'ServiceDetails', params: { serviceTitle: cat.title } })}
                        >
                            <View style={styles.quickIconBg}>
                                <Ionicons name={cat.icon} size={24} color={colors.primary} />
                            </View>
                            <Text style={styles.quickCategoryText}>{cat.title}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                {/* SERVICIOS POPULARES (Grid Elegante) */}
                <Text style={styles.sectionTitle}>Servicios Populares</Text>
                <View style={styles.gridContainer}>
                    {POPULAR_SERVICES.map((item) => (
                        <TouchableOpacity
                            key={item.id}
                            style={styles.popularCard}
                            activeOpacity={0.7}
                            onPress={() => navigation.navigate('Buscar', { screen: 'ServiceDetails', params: { serviceTitle: item.title } })}
                        >
                            <View style={styles.popularIconWrapper}>
                                <Ionicons name={item.icon} size={24} color={colors.primary} />
                            </View>
                            <Text style={styles.popularTitle}>{item.title}</Text>
                            <Text style={styles.popularDesc}>{item.desc}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* BANNER DE EMERGENCIA (Llamado a la acción) */}
                <TouchableOpacity
                    style={styles.emergencyBanner}
                    activeOpacity={0.8}
                    onPress={() => navigation.navigate('Buscar', { screen: 'ServiceDetails', params: { serviceTitle: 'Urgencias' } })}
                >
                    <View style={styles.emergencyContent}>
                        <Text style={styles.emergencyTitle}>¿Emergencia 24/7?</Text>
                        <Text style={styles.emergencyDesc}>Técnicos listos para reparaciones urgentes en tu zona.</Text>
                    </View>
                    <View style={styles.emergencyIconBg}>
                        <Ionicons name="alert" size={32} color={colors.surface} />
                    </View>
                </TouchableOpacity>

                {/* BADGE DE CONFIANZA REDISEÑADO */}
                <View style={styles.trustBadge}>
                    <View style={styles.trustIconContainer}>
                        <Ionicons name="shield-checkmark" size={28} color={colors.primary} />
                    </View>
                    <View style={styles.trustTextContainer}>
                        <Text style={styles.trustTitle}>100% Verificados</Text>
                        <Text style={styles.trustDesc}>Identidad y antecedentes revisados para tu seguridad.</Text>
                    </View>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: colors.background },
    scroll: { paddingBottom: 40 },

    // Hero Section (Efecto Difuminado)
    heroContainer: {
        backgroundColor: colors.primarySoft,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        marginBottom: 25,
        overflow: 'hidden',
    },
    heroBlurEffect: {
        padding: 20,
        paddingTop: 40,
        paddingBottom: 30,
        backgroundColor: 'rgba(255, 255, 255, 0.3)', // Simula el desenfoque
    },
    heroHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 25 },
    greeting: { fontSize: 24, fontWeight: '900', color: colors.textMain, marginBottom: 4 },
    locationText: { fontSize: 14, color: colors.primary, fontWeight: '600' },
    profileBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', shadowColor: colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 },

    // Buscador Falso en el Home
    searchBarFake: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, height: 55, borderRadius: 16, paddingHorizontal: 15, shadowColor: colors.shadow, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 3 },
    searchText: { fontSize: 15, color: colors.placeholder, marginLeft: 10, fontWeight: '500' },

    sectionTitle: { fontSize: 18, fontWeight: 'bold', color: colors.textMain, marginBottom: 15, paddingHorizontal: 20 },

    // Carrusel Rápido
    horizontalScroll: { marginBottom: 30 },
    horizontalContent: { paddingHorizontal: 20, gap: 15 },
    quickCategory: { alignItems: 'center', width: 75 },
    quickIconBg: { width: 60, height: 60, borderRadius: 20, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center', marginBottom: 8, shadowColor: colors.shadow, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 5, elevation: 2, borderWidth: 1, borderColor: colors.border },
    quickCategoryText: { fontSize: 12, color: colors.textMain, fontWeight: '600', textAlign: 'center' },

    // Grid Populares
    gridContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', paddingHorizontal: 20, marginBottom: 15 },
    popularCard: { width: '47%', backgroundColor: colors.surface, borderRadius: 16, padding: 16, marginBottom: 15, borderWidth: 1, borderColor: colors.border, shadowColor: colors.shadow, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 8, elevation: 2 },
    popularIconWrapper: { width: 40, height: 40, borderRadius: 12, backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
    popularTitle: { fontSize: 15, fontWeight: 'bold', color: colors.textMain, marginBottom: 4 },
    popularDesc: { fontSize: 12, color: colors.textMuted, lineHeight: 16 },

    // Banners Inferiores
    emergencyBanner: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.textMain, marginHorizontal: 20, padding: 20, borderRadius: 20, marginBottom: 15, shadowColor: colors.shadow, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 10, elevation: 5 },
    emergencyContent: { flex: 1, marginRight: 15 },
    emergencyTitle: { fontSize: 18, fontWeight: 'bold', color: colors.surface, marginBottom: 6 },
    emergencyDesc: { fontSize: 13, color: 'rgba(255,255,255,0.7)', lineHeight: 18 },
    emergencyIconBg: { width: 50, height: 50, borderRadius: 25, backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center' },

    trustBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, marginHorizontal: 20, padding: 15, borderRadius: 16, borderWidth: 1, borderColor: colors.border },
    trustIconContainer: { width: 48, height: 48, borderRadius: 24, backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center', marginRight: 15 },
    trustTextContainer: { flex: 1 },
    trustTitle: { fontSize: 15, fontWeight: 'bold', color: colors.textMain, marginBottom: 2 },
    trustDesc: { fontSize: 12, color: colors.textMuted, lineHeight: 16 },
});