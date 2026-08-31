import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform, Alert, ActivityIndicator, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../../theme/colors';

import TechnicianMiniProfile from '../../../components/ui/TechnicianMiniProfile';
import CustomTextInput from '../../../components/forms/CustomTextInput';
import { authService } from '../../../services/authService';
import { requestService } from '../../../services/requestService';

export default function CreateRequestScreen({ route, navigation }) {
    const { technician } = route.params || {};
    const [clientId, setClientId] = useState(null);

    const [description, setDescription] = useState('');
    const [date, setDate] = useState('');
    const [timeRange, setTimeRange] = useState('');
    const [zona, setZona] = useState('');
    const [direccionExacta, setDireccionExacta] = useState('');

    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchSession = async () => {
            const session = await authService.getCurrentSession();
            if (session) setClientId(session.user.id);
        };
        fetchSession();
    }, []);

    // Helper para alertas seguras en Web y Móvil
    const showMessage = (title, msg) => {
        if (Platform.OS === 'web') window.alert(`${title}: \n${msg}`);
        else Alert.alert(title, msg);
    };

    const handleSubmit = async () => {
        if (!description.trim() || !zona.trim() || !direccionExacta.trim() || !date.trim() || !timeRange.trim()) {
            showMessage('Campos incompletos', 'Por favor completa todos los datos para que el técnico sepa cómo ayudarte.');
            return;
        }

        if (!clientId || !technician?.id) {
            showMessage('Error de sesión', 'No pudimos identificar tu cuenta o la del técnico.');
            return;
        }

        setIsSubmitting(true);

        try {
            const requestData = {
                client_id: clientId,
                technician_id: technician.id,
                category_id: technician.category_id,
                description: description.trim(),
                suggested_date: date.trim(),
                suggested_time_range: timeRange.trim(),
                zone: zona.trim(),
                address: direccionExacta.trim(),
                status: 'pending'
            };

            await requestService.createRequest(requestData);

            // Redirección con los datos corregidos para el ticket de éxito
            navigation.navigate('RequestSuccess', {
                requestData: {
                    technicianName: technician?.full_name,
                    categoryName: technician?.category_name || 'Servicio Profesional',
                    suggested_date: date.trim(),
                    suggested_time_range: timeRange.trim()
                }
            });

        } catch (error) {
            console.error("Error al crear la solicitud:", error);
            if (error.message) {
                showMessage('No se pudo enviar', error.message);
            } else {
                showMessage('Error', 'Hubo un problema. Verifica el formato de la fecha (AAAA-MM-DD).');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="dark-content" backgroundColor={colors.surface} />
            <KeyboardAvoidingView style={styles.keyboardView} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>

                {/* Cabecera Premium */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton} activeOpacity={0.7}>
                        <Ionicons name="close" size={28} color={colors.textMain} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Solicitar Servicio</Text>
                    <View style={styles.iconButton} />
                </View>

                <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

                    <Text style={styles.sectionLabel}>Profesional Seleccionado</Text>
                    <View style={styles.cardWrapper}>
                        <TechnicianMiniProfile
                            name={technician?.full_name || 'Profesional verificado'}
                            rating={technician?.avg_rating || 5.0}
                            reviews={technician?.ratings_count || 0}
                            verified={technician?.is_active}
                        />
                    </View>

                    <Text style={styles.sectionLabel}>Detalles del Trabajo</Text>
                    <View style={styles.formSection}>
                        <CustomTextInput
                            label="¿Qué necesitas que haga el profesional?"
                            placeholder="Ej. Revisión de instalación, fuga de agua..."
                            value={description}
                            onChangeText={setDescription}
                            multiline={true}
                            maxLength={200}
                        />

                        <View style={styles.row}>
                            <View style={styles.halfWidth}>
                                <CustomTextInput
                                    label="Fecha (A-M-D)"
                                    value={date}
                                    onChangeText={setDate}
                                    placeholder="Ej. 2026-10-15"
                                    iconName="calendar-outline"
                                />
                            </View>
                            <View style={styles.halfWidth}>
                                <CustomTextInput
                                    label="Hora / Rango"
                                    value={timeRange}
                                    onChangeText={setTimeRange}
                                    placeholder="Ej. 14:00 - 16:00"
                                    iconName="time-outline"
                                />
                            </View>
                        </View>

                        <CustomTextInput
                            label="Zona o Barrio"
                            placeholder="Ej. Sarco, Tiquipaya..."
                            value={zona}
                            onChangeText={setZona}
                            iconName="map-outline"
                        />

                        <CustomTextInput
                            label="Dirección exacta"
                            placeholder="Ej. Calle Las Rosas #123"
                            value={direccionExacta}
                            onChangeText={setDireccionExacta}
                            iconName="location-outline"
                        />
                    </View>
                </ScrollView>

                {/* Footer con botón flotante y sello de confianza */}
                <View style={styles.footer}>
                    <View style={styles.trustNoteContainer}>
                        <Ionicons name="shield-checkmark" size={16} color={colors.success} style={{ marginRight: 6 }} />
                        <Text style={styles.trustNoteText}>Solicitar no tiene costo. El pago se acuerda con el técnico.</Text>
                    </View>

                    <TouchableOpacity
                        style={[styles.submitButton, isSubmitting && styles.disabledButton]}
                        onPress={handleSubmit}
                        activeOpacity={0.8}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <ActivityIndicator size="small" color={colors.white} />
                        ) : (
                            <>
                                <Text style={styles.submitButtonText}>ENVIAR SOLICITUD</Text>
                                <Ionicons name="paper-plane" size={18} color={colors.white} style={{ marginLeft: 8 }} />
                            </>
                        )}
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: colors.background },
    keyboardView: { flex: 1 },

    header: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        paddingHorizontal: 15, paddingVertical: 12, backgroundColor: colors.surface,
        borderBottomWidth: 1, borderBottomColor: colors.border,
        elevation: 4, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, shadowOffset: { width: 0, height: 2 },
        zIndex: 10
    },
    iconButton: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
    headerTitle: { fontSize: 18, fontWeight: '900', color: colors.textMain, letterSpacing: -0.3 },

    scroll: { padding: 20, paddingBottom: 40 },

    sectionLabel: { fontSize: 14, fontWeight: 'bold', color: colors.textMuted, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 10, marginLeft: 4 },
    cardWrapper: { marginBottom: 25 },

    formSection: { backgroundColor: colors.surface, padding: 20, borderRadius: 20, borderWidth: 1, borderColor: colors.border, shadowColor: colors.shadow, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.03, shadowRadius: 10, elevation: 2 },
    row: { flexDirection: 'row', justifyContent: 'space-between' },
    halfWidth: { width: '48%' },

    footer: { padding: 20, backgroundColor: colors.surface, borderTopWidth: 1, borderTopColor: colors.border },
    trustNoteContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 15 },
    trustNoteText: { fontSize: 12, color: colors.textMuted, fontWeight: '500' },

    submitButton: { flexDirection: 'row', backgroundColor: colors.primary, height: 56, borderRadius: 16, alignItems: 'center', justifyContent: 'center', shadowColor: colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 },
    disabledButton: { opacity: 0.7, shadowOpacity: 0, elevation: 0 },
    submitButtonText: { color: colors.white, fontSize: 15, fontWeight: 'bold', letterSpacing: 0.5 },
});