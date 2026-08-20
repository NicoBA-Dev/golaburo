import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import TechnicianCard from '../../components/services/TechnicianCard';

// DATOS FALSOS (MOCK) - Adaptados a nuestro mercado
const MOCK_TECHNICIANS = [
    { id: '1', name: 'Juan Pérez', verified: true, rating: 4.8, reviews: 10, description: 'Especialista en instalaciones técnicas y mantenimiento general del hogar.', zones: 'Cercado, Tiquipaya, Quillacollo', price: '80' },
    { id: '2', name: 'Carlos Mamani', verified: true, rating: 4.9, reviews: 25, description: 'Instalaciones residenciales y comerciales. Rapidez y limpieza garantizada.', zones: 'Quillacollo, Sacaba, Vinto', price: '75' },
    { id: '3', name: 'Roberto Rocha', verified: false, rating: 4.6, reviews: 8, description: 'Mantenimiento preventivo y correctivo con más de 5 años de experiencia.', zones: 'Sacaba, Cercado', price: '60' },
];

export default function ServiceDetailsScreen({ route, navigation }) {
    // Recibimos el nombre del servicio desde la pantalla anterior (o ponemos uno por defecto)
    const { serviceTitle } = route.params || { serviceTitle: 'Servicio' };
    const [searchQuery, setSearchQuery] = useState('');

    return (
        <SafeAreaView style={styles.safeArea}>

            {/* Cabecera Superior (Header Customizado) */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={colors.textMain} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{serviceTitle}</Text>
                <View style={styles.headerIcons}>
                    <TouchableOpacity style={styles.iconBtn}><Ionicons name="search" size={22} color={colors.textMain} /></TouchableOpacity>
                    <TouchableOpacity style={styles.iconBtn}><Ionicons name="person-circle-outline" size={26} color={colors.textMain} /></TouchableOpacity>
                </View>
            </View>

            <View style={styles.container}>
                <Text style={styles.resultsText}>{MOCK_TECHNICIANS.length} técnicos disponibles</Text>

                {/* Barra de Búsqueda */}
                <View style={styles.searchContainer}>
                    <Ionicons name="search" size={20} color={colors.textMuted} style={styles.searchIcon} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Buscar técnicos en Cochabamba..."
                        placeholderTextColor={colors.textMuted}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>

                {/* Chips de Filtros */}
                <View style={styles.filtersContainer}>
                    <Text style={styles.filterLabel}>Filtros:</Text>
                    <TouchableOpacity style={styles.chip}>
                        <Text style={styles.chipText}>Rating</Text>
                        <Ionicons name="chevron-down" size={14} color={colors.textMain} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.chip}>
                        <Text style={styles.chipText}>Zona</Text>
                        <Ionicons name="chevron-down" size={14} color={colors.textMain} />
                    </TouchableOpacity>
                </View>

                {/* Lista de Técnicos */}
                <FlatList
                    data={MOCK_TECHNICIANS}
                    keyExtractor={(item) => item.id}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.listContent}
                    renderItem={({ item }) => (
                        <TechnicianCard
                            name={item.name}
                            rating={item.rating}
                            reviews={item.reviews}
                            description={item.description}
                            zones={item.zones}
                            price={item.price}
                            verified={item.verified}
                            onPress={() => console.log(`Ver perfil de ${item.name}`)}
                        />
                    )}
                />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: colors.background },
    header: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        paddingHorizontal: 15, paddingVertical: 12,
        backgroundColor: colors.surface,
        borderBottomWidth: 1, borderBottomColor: colors.border,
    },
    backButton: { padding: 5 },
    headerTitle: { flex: 1, fontSize: 18, fontWeight: 'bold', color: colors.textMain, marginLeft: 10 },
    headerIcons: { flexDirection: 'row', alignItems: 'center' },
    iconBtn: { marginLeft: 15 },
    container: { flex: 1, padding: 15 },
    resultsText: { fontSize: 12, color: colors.textMuted, textAlign: 'right', marginBottom: 10 },
    searchContainer: {
        flexDirection: 'row', alignItems: 'center',
        backgroundColor: colors.surface,
        borderRadius: 12,
        borderWidth: 1, borderColor: colors.border,
        paddingHorizontal: 12, height: 45, marginBottom: 15,
    },
    searchIcon: { marginRight: 8 },
    searchInput: { flex: 1, fontSize: 15, color: colors.textMain },
    filtersContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
    filterLabel: { fontSize: 14, fontWeight: 'bold', color: colors.textMain, marginRight: 10 },
    chip: {
        flexDirection: 'row', alignItems: 'center',
        backgroundColor: colors.surface,
        paddingHorizontal: 12, paddingVertical: 6,
        borderRadius: 20,
        borderWidth: 1, borderColor: colors.border,
        marginRight: 8,
    },
    chipText: { fontSize: 13, color: colors.textMain, marginRight: 4 },
    listContent: { paddingBottom: 30 }
});