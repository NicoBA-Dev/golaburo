import React, { useState, useCallback } from 'react';
import {
    View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity,
    Image, ActivityIndicator, RefreshControl, Alert, Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';

import { colors } from '../../../theme/colors';
import { favoriteService } from '../../../services/favoriteService';
import { storageService } from '../../../services/storageService';
import EditNoteModal from '../../../components/favorites/EditNoteModal';

const confirm = (message, onConfirm) => {
    if (Platform.OS === 'web') {
        if (window.confirm(message)) onConfirm();
    } else {
        Alert.alert('Confirmar', message, [
            { text: 'Cancelar', style: 'cancel' },
            { text: 'Quitar', style: 'destructive', onPress: onConfirm },
        ]);
    }
};

const notify = (message) => {
    if (Platform.OS === 'web') window.alert(message);
    else Alert.alert('Aviso', message);
};

export default function FavoritesScreen({ navigation }) {
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState(null);
    const [editingFavorite, setEditingFavorite] = useState(null);
    const [savingNote, setSavingNote] = useState(false);
    const [removingId, setRemovingId] = useState(null);

    const loadFavorites = useCallback(async ({ isRefresh = false } = {}) => {
        isRefresh ? setRefreshing(true) : setLoading(true);
        setError(null);
        try {
            const data = await favoriteService.getMyFavorites();
            setFavorites(data || []);
            storageService.cacheFavoriteIds((data || []).map((f) => f.technician_id));
        } catch (err) {
            console.error('Error cargando favoritos:', err);
            setError(err.message || 'No pudimos cargar tus favoritos. Verifica tu conexión.');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useFocusEffect(
        useCallback(() => {
            loadFavorites();
        }, [loadFavorites])
    );

    const handleRemove = (favorite) => {
        const name = favorite.technician?.full_name || 'este técnico';
        confirm(`¿Quitar a ${name} de tus favoritos?`, async () => {
            setRemovingId(favorite.id);
            try {
                await favoriteService.removeFavorite(favorite.id);
                setFavorites((prev) => {
                    const next = prev.filter((f) => f.id !== favorite.id);
                    storageService.cacheFavoriteIds(next.map((f) => f.technician_id));
                    return next;
                });
            } catch (err) {
                notify(err.message || 'No se pudo quitar el favorito. Intenta de nuevo.');
            } finally {
                setRemovingId(null);
            }
        });
    };

    const handleSaveNote = async (note) => {
        if (!editingFavorite) return;
        setSavingNote(true);
        try {
            const updated = await favoriteService.updateNote(editingFavorite.id, note || null);
            setFavorites((prev) => prev.map((f) => (f.id === updated.id ? updated : f)));
            setEditingFavorite(null);
        } catch (err) {
            notify(err.message || 'No se pudo guardar la nota. Intenta de nuevo.');
        } finally {
            setSavingNote(false);
        }
    };

    const goToTechnicianProfile = (favorite) => {
        if (!favorite.technician) {
            notify('Este técnico ya no está disponible.');
            return;
        }
        // La pantalla de perfil de técnico vive en el stack de "Buscar";
        // navegamos entre tabs para reutilizarla en vez de duplicarla.
        navigation.navigate('Buscar', {
            screen: 'TechnicianProfile',
            params: { technician: favorite.technician },
        });
    };

    const renderItem = ({ item }) => {
        const tech = item.technician;
        const name = tech?.full_name || 'Técnico no disponible';
        const category = tech?.category_name || 'Sin categoría';
        const isRemoving = removingId === item.id;

        return (
            <View style={styles.card}>
                <TouchableOpacity style={styles.cardBody} activeOpacity={0.7} onPress={() => goToTechnicianProfile(item)}>
                    <View style={styles.avatarContainer}>
                        {tech?.avatar_url ? (
                            <Image source={{ uri: tech.avatar_url }} style={styles.avatarImage} />
                        ) : (
                            <Ionicons name="person" size={26} color={colors.primarySoft} />
                        )}
                    </View>

                    <View style={styles.infoContainer}>
                        <Text style={styles.name} numberOfLines={1}>{name}</Text>
                        <Text style={styles.category} numberOfLines={1}>{category}</Text>

                        {tech ? (
                            <View style={styles.ratingRow}>
                                <Ionicons name="star" size={13} color="#F9A825" />
                                <Text style={styles.ratingText}>
                                    {tech.avg_rating ?? 0} ({tech.ratings_count ?? 0} reseñas)
                                </Text>
                                {!tech.is_active && (
                                    <Text style={styles.inactiveTag}>No disponible</Text>
                                )}
                            </View>
                        ) : null}

                        <Text style={styles.noteText} numberOfLines={2}>
                            {item.note ? `"${item.note}"` : 'Sin nota — toca "Editar nota" para agregar una.'}
                        </Text>
                    </View>
                </TouchableOpacity>

                <View style={styles.actionsRow}>
                    <TouchableOpacity
                        style={styles.actionBtn}
                        activeOpacity={0.7}
                        onPress={() => setEditingFavorite(item)}
                    >
                        <Ionicons name="create-outline" size={18} color={colors.textMain} />
                        <Text style={styles.actionBtnText}>Editar nota</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.actionBtn}
                        activeOpacity={0.7}
                        onPress={() => handleRemove(item)}
                        disabled={isRemoving}
                    >
                        {isRemoving ? (
                            <ActivityIndicator size="small" color={colors.error} />
                        ) : (
                            <>
                                <Ionicons name="heart-dislike-outline" size={18} color={colors.error} />
                                <Text style={[styles.actionBtnText, { color: colors.error }]}>Quitar</Text>
                            </>
                        )}
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={colors.textMain} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Mis Favoritos</Text>
                <View style={{ width: 24 }} />
            </View>

            {loading ? (
                <View style={styles.centerContent}>
                    <ActivityIndicator size="large" color={colors.primary} />
                    <Text style={styles.loadingText}>Cargando tus técnicos favoritos...</Text>
                </View>
            ) : error ? (
                <View style={styles.centerContent}>
                    <Ionicons name="cloud-offline-outline" size={48} color={colors.error} />
                    <Text style={styles.errorTitle}>No se pudo cargar</Text>
                    <Text style={styles.errorText}>{error}</Text>
                    <TouchableOpacity style={styles.retryBtn} onPress={() => loadFavorites()}>
                        <Text style={styles.retryBtnText}>Reintentar</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <FlatList
                    data={favorites}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={() => loadFavorites({ isRefresh: true })} colors={[colors.primary]} />
                    }
                    renderItem={renderItem}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <View style={styles.emptyIconCircle}>
                                <Ionicons name="heart-outline" size={40} color={colors.primary} />
                            </View>
                            <Text style={styles.emptyTitle}>Todavía no tienes favoritos</Text>
                            <Text style={styles.emptyText}>
                                Toca el ícono de corazón en el perfil de un técnico o en la lista de Explorar para guardarlo aquí.
                            </Text>
                            <TouchableOpacity
                                style={styles.exploreBtn}
                                onPress={() => navigation.navigate('Buscar', { screen: 'Explore' })}
                            >
                                <Text style={styles.exploreBtnText}>Explorar técnicos</Text>
                            </TouchableOpacity>
                        </View>
                    }
                />
            )}

            <EditNoteModal
                visible={!!editingFavorite}
                technicianName={editingFavorite?.technician?.full_name || 'este técnico'}
                initialNote={editingFavorite?.note}
                saving={savingNote}
                onClose={() => setEditingFavorite(null)}
                onSave={handleSaveNote}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: colors.background },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 15, backgroundColor: colors.surface, borderBottomWidth: 1, borderBottomColor: colors.border },
    backButton: { padding: 5, marginLeft: -5 },
    headerTitle: { fontSize: 18, fontWeight: 'bold', color: colors.textMain },

    listContent: { padding: 20, paddingBottom: 40, flexGrow: 1 },

    card: { backgroundColor: colors.surface, borderRadius: 18, marginBottom: 14, borderWidth: 1, borderColor: colors.border, overflow: 'hidden' },
    cardBody: { flexDirection: 'row', padding: 16 },
    avatarContainer: { width: 52, height: 52, borderRadius: 26, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center', marginRight: 14, borderWidth: 1, borderColor: colors.border, overflow: 'hidden' },
    avatarImage: { width: '100%', height: '100%' },
    infoContainer: { flex: 1 },
    name: { fontSize: 16, fontWeight: '900', color: colors.textMain, marginBottom: 2 },
    category: { fontSize: 13, color: colors.textMuted, fontWeight: '600', marginBottom: 4 },
    ratingRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
    ratingText: { fontSize: 12, color: colors.textMain, fontWeight: '600', marginLeft: 4 },
    inactiveTag: { fontSize: 11, color: colors.error, fontWeight: 'bold', marginLeft: 8 },
    noteText: { fontSize: 13, color: colors.textMuted, fontStyle: 'italic', lineHeight: 18 },

    actionsRow: { flexDirection: 'row', borderTopWidth: 1, borderTopColor: colors.border },
    actionBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 13, gap: 6 },

    actionBtnText: { fontSize: 13, fontWeight: 'bold', color: colors.textMain },

    centerContent: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 40 },
    loadingText: { marginTop: 15, color: colors.textMuted, fontSize: 15, fontWeight: '500' },

    errorTitle: { fontSize: 18, fontWeight: 'bold', color: colors.textMain, marginTop: 14, marginBottom: 6 },
    errorText: { fontSize: 14, color: colors.textMuted, textAlign: 'center', marginBottom: 20 },
    retryBtn: { backgroundColor: colors.primary, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12 },
    retryBtnText: { color: colors.white, fontWeight: 'bold', fontSize: 14 },

    emptyContainer: { alignItems: 'center', justifyContent: 'center', flexGrow: 1, paddingHorizontal: 30, paddingTop: 60 },
    emptyIconCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
    emptyTitle: { fontSize: 19, fontWeight: 'bold', color: colors.textMain, marginBottom: 8, textAlign: 'center' },
    emptyText: { textAlign: 'center', color: colors.textMuted, fontSize: 14, lineHeight: 21, marginBottom: 24 },
    exploreBtn: { backgroundColor: colors.primary, paddingHorizontal: 26, paddingVertical: 14, borderRadius: 14 },
    exploreBtnText: { color: colors.white, fontWeight: 'bold', fontSize: 14 },
});
