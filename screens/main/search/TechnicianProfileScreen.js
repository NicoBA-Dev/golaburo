import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, ActivityIndicator, Image, Alert, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../../theme/colors';
import { supabase } from '../../../config/supabaseConfig';
import { favoriteService } from '../../../services/favoriteService';

export default function TechnicianProfileScreen({ route, navigation }) {
    // Recibimos los datos del técnico desde la pantalla de resultados
    const { technician } = route.params;

    const [reviews, setReviews] = useState([]);
    const [loadingReviews, setLoadingReviews] = useState(true);
    const [isFavorite, setIsFavorite] = useState(false);
    const [favoriteBusy, setFavoriteBusy] = useState(false);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                // Consultamos la vista "reviews_public" de tu base de datos
                const { data, error } = await supabase
                    .from('reviews_public')
                    .select('*')
                    .eq('technician_id', technician.id)
                    .order('created_at', { ascending: false });

                if (error) throw error;
                setReviews(data || []);
            } catch (error) {
                console.error("Error cargando reseñas:", error);
            } finally {
                setLoadingReviews(false);
            }
        };

        const fetchFavoriteStatus = async () => {
            try {
                const favIds = await favoriteService.getFavoriteTechnicianIds();
                setIsFavorite(favIds.includes(technician.id));
            } catch (error) {
                console.error("Error consultando favoritos:", error);
            }
        };

        fetchReviews();
        fetchFavoriteStatus();
    }, [technician.id]);

    const handleToggleFavorite = async () => {
        if (favoriteBusy) return;
        const wasFavorite = isFavorite;

        setFavoriteBusy(true);
        setIsFavorite(!wasFavorite); // optimista

        try {
            if (wasFavorite) {
                await favoriteService.removeFavoriteByTechnician(technician.id);
            } else {
                await favoriteService.addFavorite(technician.id);
            }
        } catch (error) {
            setIsFavorite(wasFavorite); // revertimos si falló
            const msg = error.message || 'No se pudo actualizar tus favoritos.';
            if (Platform.OS === 'web') window.alert(msg);
            else Alert.alert('Error', msg);
        } finally {
            setFavoriteBusy(false);
        }
    };

    // Función para renderizar estrellas según el puntaje
    const renderStars = (rating) => {
        return (
            <View style={{ flexDirection: 'row' }}>
                {[1, 2, 3, 4, 5].map((star) => (
                    <Ionicons
                        key={star}
                        name={star <= rating ? "star" : "star-outline"}
                        size={14}
                        color="#F9A825"
                    />
                ))}
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={colors.textMain} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Perfil del Profesional</Text>
                <TouchableOpacity
                    onPress={handleToggleFavorite}
                    disabled={favoriteBusy}
                    style={styles.favoriteHeaderBtn}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                    <Ionicons
                        name={isFavorite ? 'heart' : 'heart-outline'}
                        size={24}
                        color={isFavorite ? colors.secondary : colors.textMain}
                    />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>

                {/* --- CABECERA DEL TÉCNICO --- */}
                <View style={styles.profileHeader}>
                    <View style={styles.avatarContainer}>
                        {technician.avatar_url ? (
                            <Image source={{ uri: technician.avatar_url }} style={styles.avatarImage} />
                        ) : (
                            <Ionicons name="person" size={40} color={colors.primarySoft} />
                        )}
                    </View>
                    <Text style={styles.name}>{technician.full_name}</Text>
                    <Text style={styles.category}>{technician.category_name}</Text>

                    <View style={styles.ratingBadge}>
                        <Ionicons name="star" size={16} color="#F9A825" />
                        <Text style={styles.ratingText}>
                            {technician.avg_rating} ({technician.ratings_count} reseñas)
                        </Text>
                    </View>
                </View>

                {/* --- INFORMACIÓN GENERAL --- */}
                <View style={styles.cardSection}>
                    <Text style={styles.sectionTitle}>Sobre mí</Text>
                    <Text style={styles.bioText}>{technician.bio || 'Sin descripción disponible.'}</Text>

                    <View style={styles.infoRow}>
                        <Ionicons name="map-outline" size={20} color={colors.primary} />
                        <Text style={styles.infoText}>
                            Cobertura: {technician.coverage_zones ? technician.coverage_zones.join(', ') : 'No especificada'}
                        </Text>
                    </View>

                    <View style={styles.infoRow}>
                        <Ionicons name="cash-outline" size={20} color={colors.success} />
                        <Text style={styles.infoText}>Tarifa base: Bs. {technician.base_rate}</Text>
                    </View>
                </View>

                {/* --- SECCIÓN DE RESEÑAS PÚBLICAS --- */}
                <Text style={styles.sectionTitleMain}>Reseñas de Clientes</Text>

                {loadingReviews ? (
                    <ActivityIndicator size="small" color={colors.primary} style={{ marginTop: 20 }} />
                ) : reviews.length === 0 ? (
                    <Text style={styles.emptyReviews}>Este profesional aún no tiene reseñas.</Text>
                ) : (
                    reviews.map((review) => (
                        <View key={review.id} style={styles.reviewCard}>
                            <View style={styles.reviewHeader}>
                                <View style={styles.reviewClientInfo}>
                                    <View style={styles.reviewAvatar}>
                                        {review.client_avatar ? (
                                            <Image source={{ uri: review.client_avatar }} style={styles.avatarImage} />
                                        ) : (
                                            <Ionicons name="person" size={16} color={colors.textMuted} />
                                        )}
                                    </View>
                                    <Text style={styles.reviewClientName}>{review.client_name}</Text>
                                </View>
                                {renderStars(review.rating)}
                            </View>
                            {review.comment ? (
                                <Text style={styles.reviewComment}>{review.comment}</Text>
                            ) : null}
                            <Text style={styles.reviewDate}>
                                {new Date(review.created_at).toLocaleDateString('es-ES')}
                            </Text>
                        </View>
                    ))
                )}
            </ScrollView>

            {/* --- FOOTER FLOTANTE --- */}
            <View style={styles.footer}>
                <TouchableOpacity
                    style={styles.requestButton}
                    activeOpacity={0.8}
                    onPress={() => navigation.navigate('CreateRequest', { technician })}
                >
                    <Text style={styles.requestButtonText}>SOLICITAR SERVICIO</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: colors.background },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 15, backgroundColor: colors.surface, borderBottomWidth: 1, borderBottomColor: colors.border },
    backButton: { padding: 5, marginLeft: -5 },
    headerTitle: { fontSize: 18, fontWeight: 'bold', color: colors.textMain },
    favoriteHeaderBtn: { padding: 5, marginRight: -5 },
    scrollContainer: { padding: 20, paddingBottom: 100 },

    profileHeader: { alignItems: 'center', marginBottom: 25 },
    avatarContainer: { width: 90, height: 90, borderRadius: 45, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: colors.primary, overflow: 'hidden', marginBottom: 12 },
    avatarImage: { width: '100%', height: '100%' },
    name: { fontSize: 22, fontWeight: '900', color: colors.textMain, marginBottom: 4 },
    category: { fontSize: 15, color: colors.textMuted, marginBottom: 10 },
    ratingBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.primarySoft, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
    ratingText: { fontSize: 14, fontWeight: 'bold', color: colors.primary, marginLeft: 6 },

    cardSection: { backgroundColor: colors.surface, borderRadius: 16, padding: 20, marginBottom: 25, borderWidth: 1, borderColor: colors.border },
    sectionTitle: { fontSize: 16, fontWeight: 'bold', color: colors.textMain, marginBottom: 10 },
    bioText: { fontSize: 14, color: colors.textMuted, lineHeight: 22, marginBottom: 15 },
    infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
    infoText: { fontSize: 14, color: colors.textMain, marginLeft: 10, fontWeight: '500' },

    sectionTitleMain: { fontSize: 18, fontWeight: 'bold', color: colors.textMain, marginBottom: 15 },
    emptyReviews: { fontSize: 14, color: colors.textMuted, textAlign: 'center', fontStyle: 'italic', marginTop: 10 },

    reviewCard: { backgroundColor: colors.surface, padding: 15, borderRadius: 12, marginBottom: 12, borderWidth: 1, borderColor: colors.border },
    reviewHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
    reviewClientInfo: { flexDirection: 'row', alignItems: 'center' },
    reviewAvatar: { width: 28, height: 28, borderRadius: 14, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center', marginRight: 8, overflow: 'hidden' },
    reviewClientName: { fontSize: 14, fontWeight: 'bold', color: colors.textMain },
    reviewComment: { fontSize: 14, color: colors.textMuted, lineHeight: 20, marginBottom: 8 },
    reviewDate: { fontSize: 12, color: colors.disabledText, textAlign: 'right' },

    footer: { position: 'absolute', bottom: 0, width: '100%', padding: 20, backgroundColor: colors.surface, borderTopWidth: 1, borderTopColor: colors.border },
    requestButton: { backgroundColor: colors.primary, height: 55, borderRadius: 12, alignItems: 'center', justifyContent: 'center', shadowColor: colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 },
    requestButtonText: { color: colors.white, fontSize: 15, fontWeight: 'bold', letterSpacing: 0.5 }
});