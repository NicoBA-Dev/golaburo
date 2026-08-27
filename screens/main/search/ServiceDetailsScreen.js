import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../../theme/colors';
import TechnicianCard from '../../../components/services/TechnicianCard';
import { technicianService } from '../../../services/technicianService'; // <-- Servicio Real

export default function ServiceDetailsScreen({ route, navigation }) {
    // Capturamos la categoría que el usuario seleccionó (ej. "Plomería")
    const { serviceTitle } = route.params || { serviceTitle: 'Resultados' };

    const [technicians, setTechnicians] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadTechnicians = async () => {
            try {
                // Traemos todos los técnicos públicos
                const data = await technicianService.getPublicTechnicians();

                // Filtramos localmente para mostrar solo los de la categoría seleccionada
                const filteredData = data ? data.filter(tech => tech.category_name === serviceTitle) : [];
                setTechnicians(filteredData);

            } catch (error) {
                console.error("Error cargando técnicos:", error);
            } finally {
                setLoading(false);
            }
        };

        loadTechnicians();
    }, [serviceTitle]);

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
                    {loading ? (
                        <Text style={styles.resultsText}>Buscando técnicos...</Text>
                    ) : (
                        <Text style={styles.resultsText}>{technicians.length} técnicos en tu zona</Text>
                    )}

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

                {/* Área de Resultados */}
                {loading ? (
                    <View style={styles.centerContent}>
                        <ActivityIndicator size="large" color={colors.primary} />
                        <Text style={styles.loadingText}>Cargando profesionales verificados...</Text>
                    </View>
                ) : technicians.length === 0 ? (
                    <View style={styles.centerContent}>
                        <Ionicons name="search-outline" size={60} color={colors.border} />
                        <Text style={styles.emptyTitle}>¡Ups!</Text>
                        <Text style={styles.emptyText}>Aún no hay profesionales registrados en la categoría de {serviceTitle}.</Text>
                    </View>
                ) : (
                    <FlatList
                        data={technicians}
                        keyExtractor={(item) => item.id}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.listContent}
                        renderItem={({ item }) => (
                            <TechnicianCard
                                // Mapeamos exacto desde la base de datos a los props de tu tarjeta
                                name={item.full_name}
                                rating={item.avg_rating || 5.0} // Si no tiene reseñas, arranca en 5.0
                                reviews={item.ratings_count || 0}
                                description={item.bio || 'Profesional verificado en ' + item.category_name}
                                zones={item.coverage_zones ? item.coverage_zones.join(', ') : 'Todo Cochabamba'}
                                price={item.base_rate}
                                verified={true} // Asumimos true porque están en la vista pública

                                // Acción 1: Ver Perfil Técnico (Fase 3 del plan)
                                onProfilePress={() => {
                                    navigation.navigate('TechnicianProfile', { technician: item });
                                }}

                                // Acción 2: Botón de Solicitar (Fase 3 del plan)
                                onRequestPress={() => {
                                    navigation.navigate('CreateRequest', { technician: item });
                                }}
                            />
                        )}
                    />
                )}
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
        elevation: 2, shadowColor: colors.shadow, shadowOpacity: 0.05, shadowRadius: 4, shadowOffset: { width: 0, height: 2 }
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
    listContent: { paddingBottom: 20 },
    centerContent: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 40, paddingHorizontal: 20 },
    loadingText: { marginTop: 15, fontSize: 15, color: colors.textMuted, fontWeight: '500' },
    emptyTitle: { fontSize: 20, fontWeight: 'bold', color: colors.textMain, marginTop: 15, marginBottom: 5 },
    emptyText: { fontSize: 14, color: colors.textMuted, textAlign: 'center', lineHeight: 20 }
});