import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TextInput, TouchableOpacity, FlatList, Keyboard, ActivityIndicator, StatusBar, Alert, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../../theme/colors';

import TechnicianCard from '../../../components/services/TechnicianCard';
import { technicianService } from '../../../services/technicianService';
import { categoryService } from '../../../services/categoryService';
import { favoriteService } from '../../../services/favoriteService';
import { storageService } from '../../../services/storageService';

export default function ExploreScreen({ navigation, route }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState('Todos');
    const [isInputFocused, setIsInputFocused] = useState(false);

    const [technicians, setTechnicians] = useState([]);
    const [categories, setCategories] = useState(['Todos']);
    const [favoriteIds, setFavoriteIds] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (route.params?.category) {
            setActiveCategory(route.params.category);
        }
    }, [route.params?.category]);

    useEffect(() => {
        // Pinta el corazón activo al instante con el último dato conocido,
        // mientras Supabase responde (Supabase sigue siendo la fuente de verdad).
        storageService.getCachedFavoriteIds().then(setFavoriteIds);

        const fetchExploreData = async () => {
            setLoading(true);
            try {
                // Consulta concurrente para mayor velocidad
                const [techData, catData, favIds] = await Promise.all([
                    technicianService.getPublicTechnicians(),
                    categoryService.getCategories(),
                    favoriteService.getFavoriteTechnicianIds(),
                ]);

                setTechnicians(techData || []);

                const catNames = catData ? catData.map(c => c.name) : [];
                setCategories(['Todos', ...catNames]);

                setFavoriteIds(favIds);
                storageService.cacheFavoriteIds(favIds);
            } catch (error) {
                console.error("Error al cargar el explorador:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchExploreData();
    }, []);

    const handleToggleFavorite = async (technicianId) => {
        const wasFavorite = favoriteIds.includes(technicianId);

        // Actualización optimista: el corazón responde al instante.
        setFavoriteIds((prev) =>
            wasFavorite ? prev.filter((id) => id !== technicianId) : [...prev, technicianId]
        );

        try {
            if (wasFavorite) {
                await favoriteService.removeFavoriteByTechnician(technicianId);
            } else {
                await favoriteService.addFavorite(technicianId);
            }
            const nextIds = wasFavorite
                ? favoriteIds.filter((id) => id !== technicianId)
                : [...favoriteIds, technicianId];
            storageService.cacheFavoriteIds(nextIds);
        } catch (error) {
            // Revertimos si Supabase rechazó el cambio (sin conexión, RLS, etc.)
            setFavoriteIds((prev) =>
                wasFavorite ? [...prev, technicianId] : prev.filter((id) => id !== technicianId)
            );
            const msg = error.message || 'No se pudo actualizar tus favoritos.';
            if (Platform.OS === 'web') window.alert(msg);
            else Alert.alert('Error', msg);
        }
    };

    const getFilteredData = () => {
        let filtered = technicians;

        // 1. Filtro por categoría
        if (activeCategory !== 'Todos') {
            filtered = filtered.filter(item => item.category_name === activeCategory);
        }

        // 2. Búsqueda de texto enriquecida (Nombre, Bio, Categoría y ZONAS DE COBERTURA)
        if (searchQuery.trim() !== '') {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(item =>
                (item.full_name && item.full_name.toLowerCase().includes(query)) ||
                (item.bio && item.bio.toLowerCase().includes(query)) ||
                (item.category_name && item.category_name.toLowerCase().includes(query)) ||
                (item.coverage_zones && item.coverage_zones.some(zone => zone.toLowerCase().includes(query)))
            );
        }

        // 3. Ordenamos por mejor calificación (avg_rating) de mayor a menor
        filtered.sort((a, b) => (b.avg_rating || 0) - (a.avg_rating || 0));

        return filtered;
    };

    const filteredData = getFilteredData();

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="dark-content" backgroundColor={colors.surface} />

            {/* CABECERA FIJA Y ELEGANTE */}
            <View style={styles.headerWrapper}>
                <View style={styles.headerContainer}>
                    <Text style={styles.headerTitle}>Explorar Servicios</Text>

                    <View style={[styles.searchBox, isInputFocused && styles.searchBoxFocused]}>
                        <Ionicons name="search" size={20} color={isInputFocused ? colors.primary : colors.textMuted} style={styles.searchIcon} />
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Ej. Plomero en Zona Norte..."
                            placeholderTextColor={colors.placeholder}
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            onFocus={() => setIsInputFocused(true)}
                            onBlur={() => setIsInputFocused(false)}
                            returnKeyType="search"
                        />
                        {searchQuery.length > 0 && (
                            <TouchableOpacity onPress={() => { setSearchQuery(''); Keyboard.dismiss(); }} style={styles.clearIconBtn}>
                                <Ionicons name="close-circle" size={20} color={colors.textMuted} />
                            </TouchableOpacity>
                        )}
                    </View>
                </View>

                {/* Filtros Horizontales (Chips) */}
                <View style={styles.chipsContainer}>
                    <FlatList
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        data={categories}
                        keyExtractor={(item) => item}
                        contentContainerStyle={styles.chipsContent}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={[styles.chip, activeCategory === item && styles.chipActive]}
                                onPress={() => {
                                    setActiveCategory(item);
                                    Keyboard.dismiss(); // Oculta el teclado si cambia de categoría
                                }}
                                activeOpacity={0.8}
                            >
                                <Text style={[styles.chipText, activeCategory === item && styles.chipTextActive]}>
                                    {item}
                                </Text>
                            </TouchableOpacity>
                        )}
                    />
                </View>
            </View>

            {/* CUERPO DE LA LISTA */}
            {loading ? (
                <View style={styles.centerContainer}>
                    <ActivityIndicator size="large" color={colors.primary} />
                    <Text style={styles.loadingText}>Buscando a los mejores profesionales...</Text>
                </View>
            ) : (
                <FlatList
                    data={filteredData}
                    keyExtractor={(item) => item.id}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.listContent}
                    keyboardShouldPersistTaps="handled"
                    onScroll={() => Keyboard.dismiss()} // Oculta el teclado al scrollear (Mejora UX)
                    ListHeaderComponent={
                        <Text style={styles.resultsIndicator}>
                            Mostrando {filteredData.length} profesional{filteredData.length !== 1 ? 'es' : ''} verificado{filteredData.length !== 1 ? 's' : ''}
                        </Text>
                    }
                    renderItem={({ item }) => (
                        <View style={styles.cardWrapper}>
                            <View style={styles.categoryBadgeRow}>
                                <Ionicons name="shield-checkmark" size={14} color={colors.primary} style={{ marginRight: 4 }} />
                                <Text style={styles.categoryLabel}>{item.category_name}</Text>
                                {item.years_experience && (
                                    <Text style={styles.experienceLabel}> • {item.years_experience} años exp.</Text>
                                )}
                            </View>
                            <TechnicianCard
                                name={item.full_name}
                                avatarUrl={item.avatar_url}
                                rating={item.avg_rating || 5.0}
                                reviews={item.ratings_count || 0}
                                description={item.bio || 'Especialista profesional en servicios generales.'}
                                zones={item.coverage_zones ? item.coverage_zones.join(', ') : 'Zonas no especificadas'}
                                price={item.base_rate}
                                verified={item.is_active}
                                onProfilePress={() => navigation.navigate('TechnicianProfile', { technician: item })}
                                onRequestPress={() => navigation.navigate('CreateRequest', { technician: item })}
                                isFavorite={favoriteIds.includes(item.id)}
                                onToggleFavorite={() => handleToggleFavorite(item.id)}
                            />
                        </View>
                    )}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <View style={styles.emptyIconCircle}>
                                <Ionicons name="search-outline" size={40} color={colors.primary} />
                            </View>
                            <Text style={styles.emptyTitle}>Sin resultados</Text>
                            <Text style={styles.emptyText}>
                                No encontramos profesionales para "{searchQuery}" en la categoría de {activeCategory}.
                                Intenta con otras palabras o cambia de categoría.
                            </Text>
                        </View>
                    }
                />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: colors.background },

    // Header Fijo
    headerWrapper: {
        backgroundColor: colors.surface,
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
        elevation: 4, // Sombra para Android
        shadowColor: '#000', // Sombra para iOS
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        zIndex: 10,
    },
    headerContainer: { paddingHorizontal: 20, paddingTop: 15 },
    headerTitle: { fontSize: 28, fontWeight: '900', color: colors.textMain, marginBottom: 15, letterSpacing: -0.5 },

    searchBox: {
        flexDirection: 'row', alignItems: 'center',
        backgroundColor: colors.background,
        height: 52, borderRadius: 16, paddingHorizontal: 15, marginBottom: 10,
        borderWidth: 1, borderColor: colors.border,
    },
    searchBoxFocused: {
        borderColor: colors.primary,
        backgroundColor: colors.surface,
        shadowColor: colors.primary, shadowOpacity: 0.1, shadowRadius: 8, shadowOffset: { width: 0, height: 4 }, elevation: 2
    },
    searchIcon: { marginRight: 10 },
    searchInput: { flex: 1, fontSize: 15, color: colors.textMain, fontWeight: '500' },
    clearIconBtn: { padding: 4 },

    chipsContainer: { height: 45, justifyContent: 'center' },
    chipsContent: { paddingHorizontal: 20, gap: 10, alignItems: 'center' },
    chip: {
        paddingHorizontal: 18, paddingVertical: 8, borderRadius: 24,
        backgroundColor: colors.background, borderWidth: 1, borderColor: colors.border,
    },
    chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
    chipText: { fontSize: 13, color: colors.textMuted, fontWeight: '600', letterSpacing: 0.3 },
    chipTextActive: { color: colors.surface, fontWeight: 'bold' },

    listContent: { paddingBottom: 40, paddingTop: 5 },
    resultsIndicator: { fontSize: 13, color: colors.textMuted, fontWeight: '600', marginHorizontal: 20, marginVertical: 12 },

    cardWrapper: { paddingHorizontal: 20, marginBottom: 15 },
    categoryBadgeRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8, marginLeft: 2 },
    categoryLabel: { fontSize: 12, fontWeight: 'bold', color: colors.primary, textTransform: 'uppercase', letterSpacing: 0.5 },
    experienceLabel: { fontSize: 12, fontWeight: '600', color: colors.textMuted },

    centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    loadingText: { marginTop: 15, color: colors.textMuted, fontSize: 15, fontWeight: '500' },

    emptyContainer: { alignItems: 'center', justifyContent: 'center', marginTop: 50, paddingHorizontal: 40 },
    emptyIconCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
    emptyTitle: { fontSize: 20, fontWeight: 'bold', color: colors.textMain, marginBottom: 8 },
    emptyText: { textAlign: 'center', color: colors.textMuted, fontSize: 15, lineHeight: 22 }
});