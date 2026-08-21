import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    TouchableOpacity,
    ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import InputField from '../../components/InputField';

// Datos de prueba en memoria (Simulación JSON)
const INITIAL_HISTORIAL = [
    {
        id: '101',
        servicio: 'Mantenimiento de Calefón',
        cliente: 'Carlos Mendoza',
        fecha: '10/08/2026',
        monto: 'Bs. 150',
        estado: 'Completado',
        rating: 5,
        comentario: 'Excelente trabajo, puntual y muy profesional.',
    },
    {
        id: '102',
        servicio: 'Cambio de llaves de paso',
        cliente: 'Ana Patricia V.',
        fecha: '05/08/2026',
        monto: 'Bs. 90',
        estado: 'Completado',
        rating: 4,
        comentario: 'Buen servicio, resolvió el problema rápido.',
    },
    {
        id: '103',
        servicio: 'Instalación de lavadora',
        cliente: 'Roberto S.',
        fecha: '28/07/2026',
        monto: 'Bs. 120',
        estado: 'Cancelado',
        rating: null,
        comentario: 'El cliente canceló la solicitud por motivos personales.',
    },
];

export default function TecnicoHistorialScreen({ navigation }) {
    const [historial] = useState(INITIAL_HISTORIAL);
    const [filter, setFilter] = useState('Todos'); // 'Todos' | 'Completado' | 'Cancelado'
    const [search, setSearch] = useState('');

    const filteredHistorial = historial.filter((item) => {
        const matchesFilter = filter === 'Todos' || item.estado === filter;
        const matchesSearch =
            item.servicio.toLowerCase().includes(search.toLowerCase()) ||
            item.cliente.toLowerCase().includes(search.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    return (
        <SafeAreaView style={styles.safeArea}>
            {/* TopBar Superior */}
            <View style={styles.topBar}>
                <TouchableOpacity
                    onPress={() => navigation?.navigate('TecnicoSolicitudesScreen')}
                    style={styles.backBtn}
                >
                    <Ionicons name="chevron-back" size={24} color={colors.textMain} />
                </TouchableOpacity>
                <Text style={styles.topBarTitle}>Historial de Trabajos</Text>
                <TouchableOpacity onPress={() => navigation?.navigate('PerfilTecnicoStack')}>
                    <Ionicons name="person-circle-outline" size={28} color={colors.primary} />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
                {/* Buscador */}
                <InputField
                    placeholder="Buscar por trabajo o cliente..."
                    value={search}
                    onChangeText={setSearch}
                />

                {/* Filtros por Estado */}
                <View style={styles.filterRow}>
                    {['Todos', 'Completado', 'Cancelado'].map((status) => (
                        <TouchableOpacity
                            key={status}
                            style={[
                                styles.filterChip,
                                filter === status && styles.filterChipActive,
                            ]}
                            onPress={() => setFilter(status)}
                        >
                            <Text
                                style={[
                                    styles.filterText,
                                    filter === status && styles.filterTextActive,
                                ]}
                            >
                                {status}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Lista de Trabajos */}
                {filteredHistorial.map((item) => {
                    const isCompleted = item.estado === 'Completado';

                    return (
                        <View key={item.id} style={styles.card}>
                            <View style={styles.cardHeader}>
                                <Text style={styles.serviceTitle}>{item.servicio}</Text>
                                <Text
                                    style={[
                                        styles.statusBadge,
                                        isCompleted ? styles.badgeSuccess : styles.badgeDanger,
                                    ]}
                                >
                                    {item.estado}
                                </Text>
                            </View>

                            <Text style={styles.infoText}>
                                <Text style={styles.boldText}>Cliente: </Text>
                                {item.cliente}
                            </Text>

                            <View style={styles.detailRow}>
                                <Text style={styles.infoText}>
                                    <Text style={styles.boldText}>Fecha: </Text>
                                    {item.fecha}
                                </Text>
                                <Text style={styles.montoText}>{item.monto}</Text>
                            </View>

                            {/* Valoración e Impresiones del cliente */}
                            {isCompleted && item.rating && (
                                <View style={styles.reviewBox}>
                                    <View style={styles.starsRow}>
                                        {[...Array(5)].map((_, i) => (
                                            <Ionicons
                                                key={i}
                                                name={i < item.rating ? 'star' : 'star-outline'}
                                                size={16}
                                                color={colors.warning}
                                            />
                                        ))}
                                    </View>
                                    <Text style={styles.comentarioText}>"{item.comentario}"</Text>
                                </View>
                            )}

                            {!isCompleted && (
                                <Text style={styles.cancelNotice}>{item.comentario}</Text>
                            )}
                        </View>
                    );
                })}

                {filteredHistorial.length === 0 && (
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>No se encontraron registros.</Text>
                    </View>
                )}
            </ScrollView>

            {/* Barra de Navegación del Técnico */}
      // Dentro del bloque de la barra inferior de TecnicoHistorialScreen.js:
            <View style={styles.bottomNav}>
                <TouchableOpacity
                    style={styles.navTab}
                    onPress={() => navigation?.navigate('TecnicoSolicitudesScreen')}
                >
                    <Text style={styles.navTabText}>SOLICITUDES</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.navTab, styles.navTabActive]}>
                    <Text style={[styles.navTabText, styles.navTabTextActive]}>HISTORIAL</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.navTab}
                    onPress={() => navigation?.navigate('PerfilTecnicoStack')}
                >
                    <Text style={styles.navTabText}>PERFIL TÉCNICO</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: colors.background, // #F7F7F7
    },
    topBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
        backgroundColor: colors.surface, // #FFFFFF
    },
    backBtn: {
        padding: 4,
    },
    topBarTitle: {
        fontSize: typography.fontSize.lg,
        fontWeight: typography.fontWeight.bold,
        color: colors.primary,
    },
    container: {
        padding: 16,
        paddingBottom: 80,
    },
    filterRow: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 16,
    },
    filterChip: {
        paddingVertical: 6,
        paddingHorizontal: 14,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.surface,
    },
    filterChipActive: {
        backgroundColor: colors.primarySoft,
        borderColor: colors.primary,
    },
    filterText: {
        fontSize: typography.fontSize.xs,
        fontWeight: typography.fontWeight.semibold,
        color: colors.textMuted,
    },
    filterTextActive: {
        color: colors.primary,
        fontWeight: typography.fontWeight.bold,
    },
    card: {
        backgroundColor: colors.surface,
        borderWidth: 1.5,
        borderColor: colors.border,
        borderRadius: 16,
        padding: 16,
        marginBottom: 14,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    serviceTitle: {
        fontSize: typography.fontSize.md,
        fontWeight: typography.fontWeight.bold,
        color: colors.textMain,
        flex: 1,
    },
    statusBadge: {
        fontSize: typography.fontSize.xs,
        fontWeight: typography.fontWeight.bold,
        paddingVertical: 3,
        paddingHorizontal: 8,
        borderRadius: 8,
        overflow: 'hidden',
    },
    badgeSuccess: {
        backgroundColor: colors.successSoft,
        color: colors.success,
    },
    badgeDanger: {
        backgroundColor: colors.errorSoft,
        color: colors.error,
    },
    infoText: {
        fontSize: typography.fontSize.sm,
        color: colors.textMain,
        marginBottom: 4,
    },
    boldText: {
        fontWeight: typography.fontWeight.bold,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    montoText: {
        fontSize: typography.fontSize.md,
        fontWeight: typography.fontWeight.bold,
        color: colors.primary,
    },
    reviewBox: {
        backgroundColor: colors.background,
        borderRadius: 8,
        padding: 10,
        marginTop: 4,
    },
    starsRow: {
        flexDirection: 'row',
        gap: 2,
        marginBottom: 4,
    },
    comentarioText: {
        fontSize: typography.fontSize.xs,
        color: colors.textMuted,
        fontStyle: 'italic',
    },
    cancelNotice: {
        fontSize: typography.fontSize.xs,
        color: colors.error,
        marginTop: 4,
        fontStyle: 'italic',
    },
    emptyContainer: {
        alignItems: 'center',
        marginTop: 40,
    },
    emptyText: {
        fontSize: typography.fontSize.md,
        color: colors.textMuted,
    },

    /* Barra de Navegación del Técnico */
    bottomNav: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: colors.surface,
        borderTopWidth: 1,
        borderTopColor: colors.border,
        paddingVertical: 10,
        paddingHorizontal: 8,
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
    },
    navTab: {
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 20,
        paddingVertical: 6,
        paddingHorizontal: 14,
        backgroundColor: colors.surface,
    },
    navTabActive: {
        backgroundColor: colors.primarySoft,
        borderColor: colors.primary,
    },
    navTabText: {
        fontSize: typography.fontSize.xs,
        fontWeight: typography.fontWeight.bold,
        color: colors.textMuted,
    },
    navTabTextActive: {
        color: colors.primary,
    },
});