import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';

import HomeHeader from '../../components/home/HomeHeader';
import CategoryCard from '../../components/home/CategoryCard';
import { categoryService } from '../../services/categoryService';
import { profileService } from '../../services/profileService';
import { authService } from '../../services/authService';

// Diccionario para adaptar los íconos genéricos de la BD a Ionicons 
// y rellenar las descripciones nulas con textos atractivos.
const CATEGORY_META = {
    'Plomería': { icon: 'water-outline', desc: 'Fugas, grifería, tuberías' },
    'Electricidad': { icon: 'flash-outline', desc: 'Cortocircuitos, cableado' },
    'Cerrajería': { icon: 'key-outline', desc: 'Aperturas, chapas, llaves' },
    'Pintura': { icon: 'color-palette-outline', desc: 'Interiores, exteriores' },
    'Reparación de electrodomésticos': { icon: 'construct-outline', desc: 'Lavadoras, refrigeradores' }
};

export default function HomeScreen({ navigation }) {
    const [categories, setCategories] = useState([]);
    const [userName, setUserName] = useState('Usuario');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadHomeData = async () => {
            try {
                // 1. Cargar nombre del usuario para el HomeHeader
                const session = await authService.getCurrentSession();
                if (session) {
                    const profile = await profileService.getProfile(session.user.id);
                    if (profile?.full_name) {
                        setUserName(profile.full_name);
                    }
                }

                // 2. Cargar categorías de Supabase
                const data = await categoryService.getCategories();

                // Mostrar estrictamente las primeras 4 categorías
                setCategories(data ? data.slice(0, 4) : []);
            } catch (error) {
                console.error("Error cargando el Home:", error);
            } finally {
                setLoading(false);
            }
        };

        const unsubscribe = navigation?.addListener('focus', loadHomeData);
        return unsubscribe;
    }, [navigation]);

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

                <HomeHeader userName={userName} />

                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>¿Qué servicio necesitas?</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Buscar', { screen: 'Explore' })}>
                        <Text style={styles.seeAllText}>Ver todos</Text>
                    </TouchableOpacity>
                </View>

                {loading ? (
                    <ActivityIndicator size="large" color={colors.primary} style={styles.loader} />
                ) : (
                    <View style={styles.gridContainer}>
                        {categories.map((cat) => {
                            const meta = CATEGORY_META[cat.name] || { icon: 'build-outline', desc: 'Servicio garantizado' };
                            return (
                                <CategoryCard
                                    key={cat.id}
                                    title={cat.name}
                                    description={meta.desc}
                                    iconName={meta.icon}
                                    onPress={() => navigation.navigate('Buscar', { screen: 'Explore', params: { category: cat.name } })}
                                />
                            );
                        })}
                    </View>
                )}

                <TouchableOpacity style={styles.specialBanner} activeOpacity={0.8}>
                    <View style={styles.specialIconBg}>
                        <Ionicons name="hardware-chip-outline" size={32} color={colors.primary} />
                    </View>
                    <View style={styles.bannerTextContainer}>
                        <Text style={styles.bannerTitle}>Reparación de equipos</Text>
                        <Text style={styles.bannerDesc}>Lavadoras, cocinas y microondas en Sarco, Tiquipaya y Cercado.</Text>
                    </View>
                </TouchableOpacity>

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
    safeArea: { flex: 1, backgroundColor: colors.background },
    scroll: { padding: 20, paddingBottom: 40 },
    sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, marginTop: 10 },
    sectionTitle: { fontSize: 20, fontWeight: 'bold', color: colors.textMain },
    seeAllText: { fontSize: 14, fontWeight: '600', color: colors.primary },
    loader: { marginVertical: 40 },
    gridContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 10 },
    specialBanner: { backgroundColor: colors.surface, flexDirection: 'row', alignItems: 'center', padding: 18, borderRadius: 20, borderWidth: 1, borderColor: colors.border, marginBottom: 20, shadowColor: colors.shadow, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
    specialIconBg: { backgroundColor: colors.primarySoft, padding: 12, borderRadius: 14, marginRight: 15 },
    bannerTextContainer: { flex: 1 },
    bannerTitle: { fontSize: 16, fontWeight: 'bold', color: colors.textMain, marginBottom: 4 },
    bannerDesc: { fontSize: 13, color: colors.textMuted, lineHeight: 18 },
    trustBadge: { backgroundColor: colors.primary, flexDirection: 'row', alignItems: 'center', padding: 18, borderRadius: 20 },
    trustTextContainer: { flex: 1, marginLeft: 15 },
    trustTitle: { fontSize: 16, fontWeight: 'bold', color: colors.surface, marginBottom: 4 },
    trustDesc: { fontSize: 13, color: 'rgba(255,255,255,0.85)', lineHeight: 18 },
});