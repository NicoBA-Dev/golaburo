import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../../theme/colors';

export default function TechnicianProfileScreen({ route, navigation }) {
    // Recibimos el objeto completo del técnico desde el buscador o listado
    const { technician } = route.params || {};

    return (
        <SafeAreaView style={styles.safeArea}>
            {/* Cabecera */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={colors.textMain} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Perfil del Profesional</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>

                {/* Tarjeta Superior: Avatar e Identidad */}
                <View style={styles.profileHeader}>
                    <View style={styles.avatarCircle}>
                        <Ionicons name="person" size={50} color={colors.primary} />
                    </View>
                    <Text style={styles.name}>{technician?.full_name || 'Nombre no disponible'}</Text>

                    <View style={styles.badge}>
                        <Text style={styles.badgeText}>{technician?.category_name || 'Servicios Generales'}</Text>
                    </View>

                    <View style={styles.statsRow}>
                        <Ionicons name="star" size={18} color="#F9A825" />
                        <Text style={styles.ratingText}>{technician?.avg_rating || '5.0'}</Text>
                        <Text style={styles.reviewsText}>({technician?.ratings_count || 0} reseñas)</Text>
                    </View>
                </View>

                {/* Sección: Sobre mí (Bio) */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Sobre mí</Text>
                    <Text style={styles.description}>
                        {technician?.bio || 'Este profesional aún no ha escrito una descripción detallada, pero es un técnico verificado por la plataforma.'}
                    </Text>
                </View>

                {/* Sección: Detalles de cobertura y precio */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Detalles del Servicio</Text>

                    <View style={styles.detailRow}>
                        <View style={styles.detailIcon}>
                            <Ionicons name="location-outline" size={20} color={colors.primary} />
                        </View>
                        <View style={styles.detailTextContainer}>
                            <Text style={styles.detailSubtitle}>Zonas de cobertura</Text>
                            <Text style={styles.detailText}>
                                {technician?.coverage_zones ? technician.coverage_zones.join(', ') : 'Cochabamba y alrededores'}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.detailRow}>
                        <View style={styles.detailIcon}>
                            <Ionicons name="cash-outline" size={20} color={colors.primary} />
                        </View>
                        <View style={styles.detailTextContainer}>
                            <Text style={styles.detailSubtitle}>Tarifa base aproximada</Text>
                            <Text style={styles.detailText}>
                                {technician?.base_rate ? `Bs. ${technician.base_rate}` : 'A convenir con el cliente'}
                            </Text>
                        </View>
                    </View>
                </View>
            </ScrollView>

            {/* Footer Fijo con el Botón Principal */}
            <View style={styles.footer}>
                <TouchableOpacity
                    style={styles.requestButton}
                    activeOpacity={0.8}
                    onPress={() => navigation.navigate('CreateRequest', { technician })}
                >
                    <Text style={styles.requestButtonText}>SOLICITAR SERVICIO</Text>
                    <Ionicons name="arrow-forward" size={20} color={colors.white} style={{ marginLeft: 8 }} />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: colors.background },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 15, paddingVertical: 12, backgroundColor: colors.surface, borderBottomWidth: 1, borderBottomColor: colors.border },
    backButton: { padding: 5 },
    headerTitle: { fontSize: 18, fontWeight: 'bold', color: colors.textMain },
    scrollContainer: { padding: 20, paddingBottom: 40 },

    // Perfil Cabecera
    profileHeader: { alignItems: 'center', marginBottom: 30, backgroundColor: colors.surface, padding: 20, borderRadius: 16, borderWidth: 1, borderColor: colors.border, elevation: 2, shadowColor: colors.shadow, shadowOpacity: 0.05, shadowRadius: 8, shadowOffset: { width: 0, height: 4 } },
    avatarCircle: { width: 90, height: 90, borderRadius: 45, backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
    name: { fontSize: 24, fontWeight: 'bold', color: colors.textMain, marginBottom: 8, textAlign: 'center' },
    badge: { backgroundColor: colors.primarySoft, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, marginBottom: 12 },
    badgeText: { color: colors.primary, fontWeight: 'bold', fontSize: 13, textTransform: 'uppercase' },
    statsRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.background, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 12 },
    ratingText: { fontSize: 15, fontWeight: 'bold', color: colors.textMain, marginLeft: 6, marginRight: 6 },
    reviewsText: { fontSize: 14, color: colors.textMuted },

    // Secciones
    section: { marginBottom: 25 },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', color: colors.textMain, marginBottom: 12 },
    description: { fontSize: 15, color: colors.textMuted, lineHeight: 24 },

    // Filas de detalle
    detailRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 16, backgroundColor: colors.surface, padding: 14, borderRadius: 12, borderWidth: 1, borderColor: colors.border },
    detailIcon: { backgroundColor: colors.background, padding: 8, borderRadius: 10, marginRight: 12 },
    detailTextContainer: { flex: 1 },
    detailSubtitle: { fontSize: 13, color: colors.textMuted, marginBottom: 2 },
    detailText: { fontSize: 15, color: colors.textMain, fontWeight: '500', lineHeight: 20 },

    // Footer Flotante
    footer: { padding: 20, backgroundColor: colors.surface, borderTopWidth: 1, borderTopColor: colors.border },
    requestButton: { flexDirection: 'row', backgroundColor: colors.primary, height: 55, borderRadius: 12, alignItems: 'center', justifyContent: 'center', elevation: 4, shadowColor: colors.primary, shadowOpacity: 0.3, shadowRadius: 8, shadowOffset: { width: 0, height: 4 } },
    requestButtonText: { color: colors.white, fontWeight: 'bold', fontSize: 16, letterSpacing: 0.5 }
});