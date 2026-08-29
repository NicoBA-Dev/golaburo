import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity, ActivityIndicator, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../../theme/colors';
import TechnicianCard from '../../../components/services/TechnicianCard';
import { technicianService } from '../../../services/technicianService';

export default function ServiceDetailsScreen({ route, navigation }) {
    const { serviceTitle } = route.params || { serviceTitle: 'Resultados' };

    const [technicians, setTechnicians] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sortByRating, setSortByRating] = useState(true); // Nuevo estado para el filtro

    useEffect(() => {
        const loadTechnicians = async () => {
            try {
                const data = await technicianService.getPublicTechnicians();
                let filteredData = data ? data.filter(tech => tech.category_name === serviceTitle) : [];
                setTechnicians(filteredData);
            } catch (error) {
                console.error("Error cargando técnicos:", error);
            } finally {
                setLoading(false);
            }
        };

        loadTechnicians();
    }, [serviceTitle]);

    // Lógica para ordenar los resultados
    const displayedTechnicians = [...technicians].sort((a, b) => {
        if (sortByRating) {
            return (b.avg_rating || 0) - (a.avg_rating || 0);
        }
        return 0; // Se podría agregar orden por precio o cercanía aquí en el futuro
    });

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="dark-content" backgroundColor={colors.surface} />

            {/* Cabecera Premium */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton} activeOpacity={0.7}>
                    <Ionicons name="arrow-back" size={26} color={colors.textMain} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{serviceTitle}</Text>
                <View style={{ width: 26 }} />
            </View>

            <View style={styles.container}>
                <View style={styles.resultsHeader}>
                    {loading ? (
                        <Text style={styles.resultsText}>Buscando...</Text>
                    ) : (
                        <Text style={styles.resultsText}>
                            <Text style={styles.resultsCount}>{displayedTechnicians.length}</Text> profesionales en tu zona
                        </Text>
                    )}

                    {/* Chips de Filtros Funcionales */}
                    <View style={styles.filtersContainer}>
                        <TouchableOpacity
                            style={[styles.chip, sortByRating && styles.chipActive]}
                            onPress={() => setSortByRating(!sortByRating)}
                            activeOpacity={0.7}
                        >
                            <Ionicons name="star" size={14} color={sortByRating ? colors.surface : colors.textMuted} style={{ marginRight: 4 }} />
                            <Text style={[styles.chipText, sortByRating && styles.chipTextActive]}>Mejor Rating</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Área de Resultados */}
                {loading ? (
                    <View style={styles.centerContent}>
                        <ActivityIndicator size="large" color={colors.primary} />
                        <Text style={styles.loadingText}>Cargando profesionales verificados...</Text>
                    </View>
                ) : displayedTechnicians.length === 0 ? (
                    <View style={styles.centerContent}>
                        <View style={styles.emptyIconCircle}>
                            <Ionicons name="people-outline" size={45} color={colors.primary} />
                        </View>
                        <Text style={styles.emptyTitle}>¡Ups!</Text>
                        <Text style={styles.emptyText}>
                            Aún no hay profesionales registrados en la categoría de {serviceTitle}.
                        </Text>
                    </View>
                ) : (
                    <FlatList
                        data={displayedTechnicians}
                        keyExtractor={(item) => item.id}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.listContent}
                        renderItem={({ item }) => (
                            <View style={styles.cardWrapper}>
                                <TechnicianCard
                                    name={item.full_name}
                                    avatarUrl={item.avatar_url}
                                    rating={item.avg_rating || 5.0}
                                    reviews={item.ratings_count || 0}
                                    description={item.bio || 'Profesional verificado listos para trabajar.'}
                                    zones={item.coverage_zones ? item.coverage_zones.join(', ') : 'Cobertura general'}
                                    price={item.base_rate}
                                    verified={item.is_active}
                                    onProfilePress={() => navigation.navigate('TechnicianProfile', { technician: item })}
                                    onRequestPress={() => navigation.navigate('CreateRequest', { technician: item })}
                                />
                            </View>
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
        paddingHorizontal: 20, paddingVertical: 14,
        backgroundColor: colors.surface,
        borderBottomWidth: 1, borderBottomColor: colors.border,
        elevation: 4, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, shadowOffset: { width: 0, height: 2 },
        zIndex: 10
    },
    backButton: { padding: 5, marginLeft: -5 },
    headerTitle: { fontSize: 20, fontWeight: '900', color: colors.textMain, letterSpacing: -0.5 },

    container: { flex: 1 },
    resultsHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 15, paddingHorizontal: 20 },
    resultsText: { fontSize: 14, color: colors.textMuted, fontWeight: '500' },
    resultsCount: { fontWeight: 'bold', color: colors.textMain },

    filtersContainer: { flexDirection: 'row' },
    chip: {
        flexDirection: 'row', alignItems: 'center',
        backgroundColor: colors.background,
        paddingHorizontal: 12, paddingVertical: 6,
        borderRadius: 20,
        borderWidth: 1, borderColor: colors.border,
    },
    chipActive: { backgroundColor: colors.textMain, borderColor: colors.textMain },
    chipText: { fontSize: 12, color: colors.textMuted, fontWeight: '600' },
    chipTextActive: { color: colors.surface },

    listContent: { paddingBottom: 40, paddingTop: 5 },
    cardWrapper: { paddingHorizontal: 20, marginBottom: 8 },

    centerContent: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 20, paddingHorizontal: 40 },
    loadingText: { marginTop: 15, fontSize: 15, color: colors.textMuted, fontWeight: '500' },

    emptyIconCircle: { width: 90, height: 90, borderRadius: 45, backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
    emptyTitle: { fontSize: 22, fontWeight: '900', color: colors.textMain, marginBottom: 8, letterSpacing: -0.5 },
    emptyText: { fontSize: 15, color: colors.textMuted, textAlign: 'center', lineHeight: 22 }
});