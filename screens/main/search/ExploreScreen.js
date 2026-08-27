import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TextInput, TouchableOpacity, FlatList, Keyboard, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../../theme/colors';

import TechnicianCard from '../../../components/services/TechnicianCard';
import { technicianService } from '../../../services/technicianService';
import { categoryService } from '../../../services/categoryService';

export default function ExploreScreen({ navigation, route }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState('Todos');
    const [isInputFocused, setIsInputFocused] = useState(false);

    // Estados para la data real de Supabase
    const [technicians, setTechnicians] = useState([]);
    const [categories, setCategories] = useState(['Todos']);
    const [loading, setLoading] = useState(true);

    // Capturar si pasamos una categoría desde el HomeScreen
    useEffect(() => {
        if (route.params?.category) {
            setActiveCategory(route.params.category);
        }
    }, [route.params?.category]);

    // Carga de datos iniciales en paralelo
    useEffect(() => {
        const fetchExploreData = async () => {
            setLoading(true);
            try {
                const [techData, catData] = await Promise.all([
                    technicianService.getPublicTechnicians(),
                    categoryService.getCategories()
                ]);

                setTechnicians(techData || []);

                const catNames = catData ? catData.map(c => c.name) : [];
                setCategories(['Todos', ...catNames]);
            } catch (error) {
                console.error("Error al cargar el explorador:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchExploreData();
    }, []);

    // Filtrado en tiempo real por categoría y texto escrito
    const getFilteredData = () => {
        let filtered = technicians;

        if (activeCategory !== 'Todos') {
            filtered = filtered.filter(item => item.category_name === activeCategory);
        }

        if (searchQuery.trim() !== '') {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(item =>
                (item.full_name && item.full_name.toLowerCase().includes(query)) ||
                (item.bio && item.bio.toLowerCase().includes(query)) ||
                (item.category_name && item.category_name.toLowerCase().includes(query))
            );
        }

        return filtered;
    };

    const filteredData = getFilteredData();

    // Cabecera superior que incluye el título, buscador y filtros horizontales
    const renderHeader = () => (
        <View style={styles.headerWrapper}>
            <View style={styles.headerContainer}>
                <Text style={styles.headerTitle}>Explorar Servicios</Text>

                <View style={[styles.searchBox, isInputFocused && styles.searchBoxFocused]}>
                    <Ionicons name="search" size={20} color={isInputFocused ? colors.primary : colors.textMuted} style={styles.searchIcon} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Busca plomeros, electricistas..."
                        placeholderTextColor={colors.placeholder}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        onFocus={() => setIsInputFocused(true)}
                        onBlur={() => setIsInputFocused(false)}
                        returnKeyType="search"
                    />
                    {searchQuery.length > 0 ? (
                        <TouchableOpacity onPress={() => { setSearchQuery(''); Keyboard.dismiss(); }} style={styles.clearIconBtn}>
                            <Ionicons name="close-circle" size={18} color={colors.textMuted} />
                        </TouchableOpacity>
                    ) : null}
                </View>
            </View>

            {/* Chips de Categorías Dinámicas */}
            <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                data={categories}
                keyExtractor={(item) => item}
                contentContainerStyle={styles.chipsContent}
                style={styles.chipsScroll}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={[styles.chip, activeCategory === item && styles.chipActive]}
                        onPress={() => setActiveCategory(item)}
                        activeOpacity={0.7}
                    >
                        <Text style={[styles.chipText, activeCategory === item && styles.chipTextActive]}>
                            {item}
                        </Text>
                    </TouchableOpacity>
                )}
            />
        </View>
    );

    return (
        <SafeAreaView style={styles.safeArea}>
            {loading ? (
                <View style={styles.centerContainer}>
                    <ActivityIndicator size="large" color={colors.primary} />
                    <Text style={styles.loadingText}>Buscando profesionales...</Text>
                </View>
            ) : (
                <FlatList
                    data={filteredData}
                    keyExtractor={(item) => item.id}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.listContent}
                    ListHeaderComponent={renderHeader}
                    stickyHeaderIndices={[0]}
                    keyboardShouldPersistTaps="handled"
                    renderItem={({ item }) => (
                        <View style={styles.cardWrapper}>
                            <View style={styles.categoryBadgeRow}>
                                <Text style={styles.categoryLabel}>{item.category_name}</Text>
                            </View>
                            <TechnicianCard
                                name={item.full_name}
                                rating={item.avg_rating || 5.0}
                                reviews={item.ratings_count || 0}
                                description={item.bio || 'Especialista profesional en servicios generales.'}
                                zones={item.coverage_zones ? item.coverage_zones.join(', ') : 'Cochabamba y al rededores'}
                                price={item.base_rate}
                                verified={item.is_active}
                                onProfilePress={() => navigation.navigate('TechnicianProfile', { technician: item })}
                                onRequestPress={() => navigation.navigate('CreateRequest', { technician: item })}
                            />
                        </View>
                    )}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <View style={styles.emptyIconCircle}>
                                <Ionicons name="search-outline" size={36} color={colors.primary} />
                            </View>
                            <Text style={styles.emptyTitle}>Sin resultados</Text>
                            <Text style={styles.emptyText}>No encontramos profesionales para "{searchQuery}" en {activeCategory}.</Text>
                        </View>
                    }
                />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: colors.background },

    // Header wrapper para mantenerlo flotante/adherente de forma limpia
    headerWrapper: {
        backgroundColor: colors.background,
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    headerContainer: { paddingHorizontal: 20, paddingTop: 14 },
    headerTitle: { fontSize: 26, fontWeight: 'bold', color: colors.textMain, marginBottom: 14 },

    // Barra de búsqueda moderna
    searchBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.surface,
        height: 50,
        borderRadius: 14,
        paddingHorizontal: 14,
        marginBottom: 14,
        borderWidth: 1,
        borderColor: colors.border,
        elevation: 2,
        shadowColor: colors.shadow,
        shadowOpacity: 0.04,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 3 }
    },
    searchBoxFocused: { borderColor: colors.primary, shadowOpacity: 0.08 },
    searchIcon: { marginRight: 10 },
    searchInput: { flex: 1, fontSize: 14, color: colors.textMain, fontWeight: '500' },
    clearIconBtn: { padding: 4 },

    // Chips horizontales estilo píldora
    chipsScroll: { maxHeight: 42, marginTop: 4 },
    chipsContent: { paddingHorizontal: 20, gap: 8, alignItems: 'center' },
    chip: {
        paddingHorizontal: 16,
        paddingVertical: 7,
        borderRadius: 20,
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border
    },
    chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
    chipText: { fontSize: 13, color: colors.textMuted, fontWeight: '600' },
    chipTextActive: { color: colors.surface },

    // Contenido de la lista
    listContent: { paddingBottom: 40, paddingTop: 10 },
    cardWrapper: { paddingHorizontal: 20, marginBottom: 4 },
    categoryBadgeRow: { flexDirection: 'row', marginBottom: 6, marginLeft: 4 },
    categoryLabel: { fontSize: 11, fontWeight: 'bold', color: colors.primary, textTransform: 'uppercase', letterSpacing: 0.8 },

    // Estado Vacío y Carga
    centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    loadingText: { marginTop: 12, color: colors.textMuted, fontSize: 14, fontWeight: '500' },
    emptyContainer: { alignItems: 'center', justifyContent: 'center', marginTop: 60, paddingHorizontal: 40 },
    emptyIconCircle: { width: 70, height: 70, borderRadius: 35, backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
    emptyTitle: { fontSize: 18, fontWeight: 'bold', color: colors.textMain, marginBottom: 6 },
    emptyText: { textAlign: 'center', color: colors.textMuted, fontSize: 14, lineHeight: 20 }
});