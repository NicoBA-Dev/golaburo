import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../../theme/colors';
import TechnicianCard from '../../../components/services/TechnicianCard';

// DATOS FALSOS (MOCK) - Optimizados para el mercado local
const MOCK_TECHNICIANS = [
    { id: '1', name: 'Juan Pérez', verified: true, rating: 4.8, reviews: 10, description: 'Especialista en instalaciones técnicas y mantenimiento general del hogar.', zones: 'Cercado, Tiquipaya', price: '80' },
    { id: '2', name: 'Carlos Mamani', verified: true, rating: 4.9, reviews: 25, description: 'Instalaciones residenciales y comerciales. Rapidez y limpieza garantizada.', zones: 'Quillacollo, Sacaba', price: '75' },
    { id: '3', name: 'Roberto Rocha', verified: false, rating: 4.6, reviews: 8, description: 'Mantenimiento preventivo y correctivo con más de 5 años de experiencia.', zones: 'Sacaba, Cercado', price: '60' },
];

export default function ServiceDetailsScreen({ route, navigation }) {
    const { serviceTitle } = route.params || { serviceTitle: 'Resultados' };

    return (
        <SafeAreaView style={styles.safeArea}>

            {/* Cabecera Limpia */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton} activeOpacity={0.7}>
                    <Ionicons name="arrow-back" size={24} color={colors.textMain} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{serviceTitle}</Text>
                <TouchableOpacity style={styles.iconBtn}>
                    <Ionicons name="options-outline" size={24} color={colors.textMain} />
                </TouchableOpacity>
            </View>

            <View style={styles.container}>
                <View style={styles.resultsHeader}>
                    <Text style={styles.resultsText}>{MOCK_TECHNICIANS.length} técnicos en tu zona</Text>

                    {/* Chips de Filtros Compactos */}
                    <View style={styles.filtersContainer}>
                        <TouchableOpacity style={styles.chip} activeOpacity={0.7}>
                            <Text style={styles.chipText}>Rating</Text>
                            <Ionicons name="chevron-down" size={14} color={colors.textMain} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.chip} activeOpacity={0.7}>
                            <Text style={styles.chipText}>Zona</Text>
                            <Ionicons name="chevron-down" size={14} color={colors.textMain} />
                        </TouchableOpacity>
                    </View>
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
                            // Acción 1: Ver Perfil
                            onProfilePress={() => {
                                console.log(`Ir al perfil de ${item.name}`);
                                // navigation.navigate('TechnicianProfile', { technician: item });
                            }}
                            // Acción 2: Botón de Solicitar (Va al nuevo formulario)
                            onRequestPress={() => {
                                navigation.navigate('CreateRequest', { technician: item });
                            }}
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
    backButton: { padding: 5, marginRight: 10 },
    headerTitle: { flex: 1, fontSize: 18, fontWeight: 'bold', color: colors.textMain },
    iconBtn: { padding: 5 },
    container: { flex: 1, paddingHorizontal: 15 },
    resultsHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 15 },
    resultsText: { fontSize: 13, color: colors.textMuted, fontWeight: '500' },
    filtersContainer: { flexDirection: 'row' },
    chip: {
        flexDirection: 'row', alignItems: 'center',
        backgroundColor: colors.surface,
        paddingHorizontal: 10, paddingVertical: 5,
        borderRadius: 16,
        borderWidth: 1, borderColor: colors.border,
        marginLeft: 8,
    },
    chipText: { fontSize: 12, color: colors.textMain, marginRight: 4, fontWeight: '500' },
    listContent: { paddingBottom: 20 }
});