import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TextInput, TouchableOpacity, FlatList, Keyboard } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../../theme/colors';

// Importamos nuestra tarjeta de técnico
import TechnicianCard from '../../../components/services/TechnicianCard';

// 1. FILTROS RÁPIDOS (Ahora funcionan como las categorías)
const QUICK_FILTERS = ['Todos', 'Plomería', 'Electricidad', 'Limpieza', 'Cerrajería', 'Pintura', 'Albañilería'];

// 2. MOCK DATA GLOBAL (Todos los técnicos de todas las áreas mezclados)
const MOCK_ALL_SERVICES = [
    { id: '1', name: 'Juan Pérez', category: 'Plomería', verified: true, rating: 4.8, reviews: 118, description: 'Especialista en instalaciones de agua, reparación de tuberías y grifería.', zones: 'Cercado, Tiquipaya', price: '80' },
    { id: '2', name: 'Carlos Mamani', category: 'Electricidad', verified: true, rating: 4.9, reviews: 45, description: 'Solución a cortocircuitos y armado de tableros eléctricos. Servicio garantizado.', zones: 'Quillacollo, Sacaba', price: '75' },
    { id: '3', name: 'Ana Morales', category: 'Limpieza', verified: false, rating: 4.7, reviews: 30, description: 'Limpieza profunda de departamentos y casas post-construcción.', zones: 'Cercado, Norte', price: '120' },
    { id: '4', name: 'Roberto Rocha', category: 'Pintura', verified: true, rating: 4.6, reviews: 12, description: 'Pintura de interiores y exteriores. Acabados de primera y texturados.', zones: 'Sacaba, Cercado', price: '150' },
    { id: '5', name: 'Luis Choque', category: 'Cerrajería', verified: true, rating: 5.0, reviews: 89, description: 'Apertura de puertas y autos sin daños. Copia de llaves y urgencias 24/7.', zones: 'Todo Cochabamba', price: '50' },
    { id: '6', name: 'Miguel Ángel', category: 'Albañilería', verified: false, rating: 4.5, reviews: 22, description: 'Muros, lozas, revoques y arreglos generales para el hogar.', zones: 'Zona Sur, Cercado', price: '100' },
];

export default function ExploreScreen({ navigation }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState('Todos');
    const [isInputFocused, setIsInputFocused] = useState(false);

    // Lógica de filtrado en tiempo real
    const getFilteredData = () => {
        let filtered = MOCK_ALL_SERVICES;

        // 1. Filtrar por categoría (los chips superiores)
        if (activeCategory !== 'Todos') {
            filtered = filtered.filter(item => item.category === activeCategory);
        }

        // 2. Filtrar por texto (lo que el usuario escribe)
        if (searchQuery.trim() !== '') {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(item =>
                item.name.toLowerCase().includes(query) ||
                item.description.toLowerCase().includes(query) ||
                item.category.toLowerCase().includes(query)
            );
        }

        return filtered;
    };

    const filteredData = getFilteredData();

    // Renderiza los chips superiores
    const renderHeader = () => (
        <View style={styles.headerWrapper}>
            <View style={styles.headerContainer}>
                <Text style={styles.headerTitle}>Explorar Servicios</Text>

                <View style={[styles.searchBox, isInputFocused && styles.searchBoxFocused]}>
                    <Ionicons name="search" size={22} color={isInputFocused ? colors.primary : colors.textMuted} style={styles.searchIcon} />
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
                        <TouchableOpacity onPress={() => { setSearchQuery(''); Keyboard.dismiss(); }}>
                            <Ionicons name="close-circle" size={20} color={colors.textMuted} />
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity style={styles.filterIconButton}>
                            <Ionicons name="options" size={20} color={colors.primary} />
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            {/* FlatList horizontal para los chips de filtro */}
            <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                data={QUICK_FILTERS}
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
            <FlatList
                data={filteredData}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listContent}
                ListHeaderComponent={renderHeader}
                stickyHeaderIndices={[0]} // Hace que la barra de búsqueda y filtros se queden pegados arriba
                keyboardShouldPersistTaps="handled"
                renderItem={({ item }) => (
                    <View style={styles.cardWrapper}>
                        {/* Pequeña etiqueta superior para saber qué oficio es */}
                        <Text style={styles.categoryLabel}>{item.category}</Text>
                        <TechnicianCard
                            name={item.name}
                            rating={item.rating}
                            reviews={item.reviews}
                            description={item.description}
                            zones={item.zones}
                            price={item.price}
                            verified={item.verified}
                            onProfilePress={() => navigation.navigate('TechnicianProfile', { technician: item })}
                            onRequestPress={() => navigation.navigate('CreateRequest', { technician: item })}
                        />
                    </View>
                )}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Ionicons name="search-outline" size={48} color={colors.border} />
                        <Text style={styles.emptyText}>No encontramos servicios para "{searchQuery}" en {activeCategory}.</Text>
                    </View>
                }
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: colors.background },

    // Header adherente
    headerWrapper: { backgroundColor: colors.background, paddingBottom: 10 },
    headerContainer: { paddingHorizontal: 20, paddingTop: 10 },
    headerTitle: { fontSize: 30, fontWeight: 'bold', color: colors.textMain, marginBottom: 15 },
    searchBox: {
        flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface,
        height: 55, borderRadius: 12, paddingHorizontal: 15, marginBottom: 15,
        borderWidth: 1, borderColor: colors.border,
        elevation: 2, shadowColor: colors.shadow, shadowOpacity: 0.05, shadowRadius: 8, shadowOffset: { width: 0, height: 4 }
    },
    searchBoxFocused: { borderColor: colors.primary, shadowOpacity: 0.1 },
    searchIcon: { marginRight: 10 },
    searchInput: { flex: 1, fontSize: 15, color: colors.textMain, fontWeight: '500' },
    filterIconButton: { padding: 4, backgroundColor: colors.primarySoft, borderRadius: 8 },

    // Chips
    chipsScroll: { maxHeight: 45 },
    chipsContent: { paddingHorizontal: 20, gap: 10, alignItems: 'center' },
    chip: {
        paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20,
        backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
        marginRight: 8,
    },
    chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
    chipText: { fontSize: 13, color: colors.textMuted, fontWeight: '600' },
    chipTextActive: { color: colors.surface },

    // Feed de resultados
    listContent: { paddingBottom: 40 },
    cardWrapper: { paddingHorizontal: 20, marginBottom: 5 },
    categoryLabel: { fontSize: 12, fontWeight: 'bold', color: colors.primary, marginBottom: 6, marginLeft: 4, textTransform: 'uppercase', letterSpacing: 0.5 },

    emptyContainer: { alignItems: 'center', justifyContent: 'center', marginTop: 50, paddingHorizontal: 40 },
    emptyText: { textAlign: 'center', color: colors.textMuted, marginTop: 15, fontSize: 15, lineHeight: 22 }
});