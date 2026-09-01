import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Alert, ActivityIndicator, Platform, KeyboardAvoidingView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../../theme/colors';
import CustomTextInput from '../../../components/forms/CustomTextInput';
import { claimService } from '../../../services/claimService';
import { authService } from '../../../services/authService';

const REASONS = ['Trabajo Incompleto', 'Falla Recurrente', 'Daño Material', 'Mal Trato', 'Otro'];

export default function CreateClaimScreen({ route, navigation }) {
    const { requestData } = route.params;
    const [reason, setReason] = useState('');
    const [description, setDescription] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [clientId, setClientId] = useState(null);

    // PERSISTENCIA LOCAL: Cargar borrador al entrar
    useEffect(() => {
        const init = async () => {
            const session = await authService.getCurrentSession();
            if (session) setClientId(session.user.id);

            const draft = await claimService.getDraft();
            if (draft) setDescription(draft);
        };
        init();
    }, []);

    // PERSISTENCIA LOCAL: Guardar borrador en cada cambio
    const handleDescriptionChange = (text) => {
        setDescription(text);
        claimService.saveDraft(text);
    };

    const showMessage = (title, msg) => {
        if (Platform.OS === 'web') window.alert(`${title}: \n${msg}`);
        else Alert.alert(title, msg);
    };

    const handleSubmit = async () => {
        // VALIDACIONES (Requisito PDF)
        if (!reason) return showMessage('Formulario incompleto', 'Selecciona un motivo para tu reclamo.');
        if (description.trim().length < 20) return showMessage('Detalle insuficiente', 'Describe el problema con al menos 20 caracteres.');

        setIsSubmitting(true);
        try {
            await claimService.createClaim({
                service_request_id: requestData.id,
                client_id: clientId,
                technician_id: requestData.technician_id,
                reason: reason,
                description: description.trim(),
                status: 'pending'
            });

            // MANEJO DE ÉXITO Y LIMPIEZA DE CACHÉ
            await claimService.clearDraft();
            showMessage('Operación exitosa', 'Tu reclamo ha sido registrado. El equipo lo revisará pronto.');
            navigation.navigate('ClaimsList');

        } catch (error) {
            // MANEJO DE ERRORES (Requisito PDF)
            console.error(error);
            showMessage('Error de comunicación', 'No pudimos registrar tu reclamo. Verifica tu conexión.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color={colors.textMain} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Solicitar Garantía</Text>
                    <View style={{ width: 24 }} />
                </View>

                <ScrollView contentContainerStyle={styles.container}>
                    <View style={styles.infoCard}>
                        <Ionicons name="information-circle" size={24} color={colors.primary} />
                        <Text style={styles.infoText}>Estás abriendo un reporte para el servicio de <Text style={{ fontWeight: 'bold' }}>{requestData.categories?.name}</Text>.</Text>
                    </View>

                    <Text style={styles.label}>Motivo del reclamo</Text>
                    <View style={styles.chipsContainer}>
                        {REASONS.map(r => (
                            <TouchableOpacity
                                key={r}
                                style={[styles.chip, reason === r && styles.chipActive]}
                                onPress={() => setReason(r)}
                            >
                                <Text style={[styles.chipText, reason === r && styles.chipTextActive]}>{r}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <Text style={styles.label}>Describe el problema al detalle</Text>
                    <CustomTextInput
                        placeholder="Ej. El técnico arregló la fuga, pero al día siguiente volvió a gotear..."
                        value={description}
                        onChangeText={handleDescriptionChange}
                        multiline={true}
                        maxLength={300}
                    />
                    <Text style={styles.draftNote}>Borrador guardado localmente.</Text>
                </ScrollView>

                <View style={styles.footer}>
                    <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit} disabled={isSubmitting}>
                        {isSubmitting ? <ActivityIndicator color="#FFF" /> : <Text style={styles.submitBtnText}>ENVIAR RECLAMO</Text>}
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: colors.background },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 15, backgroundColor: colors.surface, borderBottomWidth: 1, borderBottomColor: colors.border },
    backButton: { padding: 5, marginLeft: -5 },
    headerTitle: { fontSize: 18, fontWeight: 'bold', color: colors.textMain },
    container: { padding: 20 },
    infoCard: { flexDirection: 'row', backgroundColor: colors.primarySoft, padding: 15, borderRadius: 12, alignItems: 'center', marginBottom: 20 },
    infoText: { marginLeft: 10, color: colors.textMain, flex: 1, fontSize: 13 },
    label: { fontSize: 14, fontWeight: 'bold', color: colors.textMuted, marginBottom: 10, marginTop: 10 },
    chipsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 20 },
    chip: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface },
    chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
    chipText: { color: colors.textMuted, fontWeight: '600' },
    chipTextActive: { color: colors.surface },
    draftNote: { fontSize: 11, color: colors.success, textAlign: 'right', marginTop: 5 },
    footer: { padding: 20, backgroundColor: colors.surface, borderTopWidth: 1, borderTopColor: colors.border },
    submitBtn: { backgroundColor: colors.error, height: 55, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
    submitBtnText: { color: '#FFF', fontWeight: 'bold', fontSize: 15 }
});