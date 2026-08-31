import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, ActivityIndicator, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';

import HomeHeader from '../../components/home/HomeHeader';
import CategoryCard from '../../components/home/CategoryCard';
import { categoryService } from '../../services/categoryService';
import { profileService } from '../../services/profileService';
import { authService } from '../../services/authService';

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
    const [avatarUrl, setAvatarUrl] = useState(null); // <-- Nuevo estado para la foto
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadHomeData = async () => {
            try {
                const session = await authService.getCurrentSession();
                if (session) {
                    const profile = await profileService.getProfile(session.user.id);
                    if (profile) {
                        if (profile.full_name) {
                            const primerNombre = profile.full_name.split(' ')[0];
                            setUserName(primerNombre);
                        }
                        // Cargamos la foto desde Supabase
                        if (profile.avatar_url) {
                            setAvatarUrl(profile.avatar_url);
                        }
                    }
                }

                const data = await categoryService.getCategories();
                setCategories(data ? data.slice(0, 4) : []);
            } catch (error) {
                console.error("Error cargando el Home:", error);
            } finally {
                setLoading(false);
            }
        };

        // Esto recarga la foto automáticamente si el usuario la cambia y vuelve al inicio
        const unsubscribe = navigation?.addListener('focus', loadHomeData);
        return unsubscribe;
    }, [navigation]);

    const goToSearch = (categoryName = 'Todos') => {
        navigation.navigate('Buscar', {
            screen: 'Explore',
            params: { category: categoryName }
        });
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
            <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

                {/* Pasamos la foto y la función de navegación al Header */}
                <HomeHeader
                    userName={userName}
                    avatarUrl={avatarUrl}
                    onProfilePress={() => navigation.navigate('Perfil')}
                />

                <TouchableOpacity style={styles.fakeSearchBox} activeOpacity={0.9} onPress={() => goToSearch()}>
                    <Ionicons name="search" size={22} color={colors.textMuted} style={styles.searchIcon} />
                    <Text style={styles.fakeSearchText}>¿Qué necesitas reparar hoy?</Text>
                </TouchableOpacity>

                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Servicios Destacados</Text>
                    <TouchableOpacity onPress={() => goToSearch()}>
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
                                    onPress={() => goToSearch(cat.name)}
                                />
                            );
                        })}
                    </View>
                )}

                <TouchableOpacity style={styles.specialBanner} activeOpacity={0.8} onPress={() => goToSearch('Reparación de electrodomésticos')}>
                    <View style={styles.specialIconBg}>
                        <Ionicons name="hardware-chip-outline" size={32} color={colors.primary} />
                    </View>
                    <View style={styles.bannerTextContainer}>
                        <Text style={styles.bannerTitle}>Reparación de equipos</Text>
                        <Text style={styles.bannerDesc}>Lavadoras, cocinas y microondas. Técnicos disponibles ahora.</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
                </TouchableOpacity>

                <View style={styles.trustBadge}>
                    <View style={styles.trustIconContainer}>
                        <Ionicons name="shield-checkmark" size={32} color={colors.primary} />
                    </View>
                    <View style={styles.trustTextContainer}>
                        <Text style={styles.trustTitle}>Profesionales Verificados</Text>
                        <Text style={styles.trustDesc}>Revisamos identidad, antecedentes y experiencia en Bolivia.</Text>
                    </View>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: colors.background },
    scroll: { padding: 20, paddingBottom: 40 },
    fakeSearchBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, height: 54, borderRadius: 16, paddingHorizontal: 15, marginTop: 15, marginBottom: 25, borderWidth: 1, borderColor: colors.border, elevation: 4, shadowColor: colors.shadow, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10 },
    searchIcon: { marginRight: 12 },
    fakeSearchText: { fontSize: 15, color: colors.textMuted, fontWeight: '500' },
    sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 },
    sectionTitle: { fontSize: 20, fontWeight: '900', color: colors.textMain, letterSpacing: -0.5 },
    seeAllText: { fontSize: 14, fontWeight: 'bold', color: colors.primary },
    loader: { marginVertical: 40 },
    gridContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 15 },
    specialBanner: { backgroundColor: colors.surface, flexDirection: 'row', alignItems: 'center', padding: 18, borderRadius: 20, borderWidth: 1, borderColor: colors.border, marginBottom: 20, elevation: 3, shadowColor: colors.shadow, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.04, shadowRadius: 8 },
    specialIconBg: { backgroundColor: colors.primarySoft, padding: 12, borderRadius: 16, marginRight: 15 },
    bannerTextContainer: { flex: 1, paddingRight: 10 },
    bannerTitle: { fontSize: 16, fontWeight: 'bold', color: colors.textMain, marginBottom: 4 },
    bannerDesc: { fontSize: 13, color: colors.textMuted, lineHeight: 18 },
    trustBadge: { backgroundColor: colors.surface, flexDirection: 'row', alignItems: 'center', padding: 20, borderRadius: 20, borderWidth: 1, borderColor: colors.border },
    trustIconContainer: { backgroundColor: colors.primarySoft, width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center' },
    trustTextContainer: { flex: 1, marginLeft: 15 },
    trustTitle: { fontSize: 15, fontWeight: 'bold', color: colors.textMain, marginBottom: 4 },
    trustDesc: { fontSize: 13, color: colors.textMuted, lineHeight: 18 },
});