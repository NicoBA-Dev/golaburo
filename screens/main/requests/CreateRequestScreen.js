import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform, Alert, ActivityIndicator } from 'react-native';
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

    const handleSubmit = async () => {
        if (!description.trim() || !zona.trim() || !direccionExacta.trim() || !date.trim() || !timeRange.trim()) {
            Alert.alert('Campos incompletos', 'Por favor completa todos los datos.');
            return;
        }

        if (!clientId || !technician?.id) {
            Alert.alert('Error de sesión', 'No pudimos identificar tu cuenta o la del técnico.');
            return;
        }

        setIsSubmitting(true);

        try {
            const requestData = {
                client_id: clientId,
                technician_id: technician.id, // CORRECCIÓN CLAVE: Usamos technician.id (ID del perfil técnico)
                category_id: technician.category_id,
                description: description.trim(),
                suggested_date: date.trim(),
                suggested_time_range: timeRange.trim(),
                zone: zona.trim(),
                address: direccionExacta.trim(),
                status: 'pending'
            };

            await requestService.createRequest(requestData);

            Alert.alert('¡Éxito!', 'Tu solicitud fue enviada correctamente al profesional.');
            navigation.navigate('Solicitudes');

        } catch (error) {
            console.error("Error al crear la solicitud:", error);

            // Si la base de datos nos manda un mensaje específico (como el trigger), lo mostramos
            if (error.message) {
                Alert.alert('No se pudo enviar', error.message);
            } else {
                Alert.alert('Error', 'Hubo un problema. Verifica el formato de la fecha (AAAA-MM-DD).');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView style={styles.keyboardView} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>

                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
                        <Ionicons name="close" size={26} color={colors.textMain} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Solicitar Servicio</Text>
                    <View style={styles.iconButton} />
                </View>

                <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

                    <TechnicianMiniProfile
                        name={technician?.full_name || 'Profesional verificado'}
                        rating={technician?.avg_rating || 5.0}
                        reviews={technician?.ratings_count || 0}
                        verified={technician?.is_active}
                    />

                    <View style={styles.formSection}>
                        <CustomTextInput
                            label="¿Qué necesitas que haga el profesional?"
                            placeholder="Ej. Revisión de instalación..."
                            value={description}
                            onChangeText={setDescription}
                            multiline={true}
                            maxLength={200}
                        />

                        <View style={styles.row}>
                            <View style={styles.halfWidth}>
                                <CustomTextInput
                                    label="Fecha (Año-Mes-Día)"
                                    value={date}
                                    onChangeText={setDate}
                                    placeholder="Ej. 2026-10-15"
                                    iconName="calendar-outline"
                                />
                            </View>
                            <View style={styles.halfWidth}>
                                <CustomTextInput
                                    label="Hora o Rango"
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

                <View style={styles.footer}>
                    <TouchableOpacity
                        style={[styles.submitButton, isSubmitting && styles.disabledButton]}
                        onPress={handleSubmit}
                        activeOpacity={0.8}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <ActivityIndicator size="small" color={colors.white} />
                        ) : (
                            <Text style={styles.submitButtonText}>ENVIAR SOLICITUD</Text>
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
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 15, paddingVertical: 12, backgroundColor: colors.surface, borderBottomWidth: 1, borderBottomColor: colors.border },
    iconButton: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
    headerTitle: { fontSize: 17, fontWeight: 'bold', color: colors.textMain },
    scroll: { padding: 20, paddingBottom: 40 },
    formSection: { marginTop: 10 },
    row: { flexDirection: 'row', justifyContent: 'space-between' },
    halfWidth: { width: '48%' },
    footer: { padding: 20, backgroundColor: colors.surface, borderTopWidth: 1, borderTopColor: colors.border },
    submitButton: { flexDirection: 'row', backgroundColor: colors.primary, height: 54, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
    disabledButton: { opacity: 0.7 },
    submitButtonText: { color: colors.white, fontSize: 15, fontWeight: 'bold', letterSpacing: 0.5 },
});