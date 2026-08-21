import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../../theme/colors';

// Componentes
import TechnicianMiniProfile from '../../../components/ui/TechnicianMiniProfile';
import CustomTextInput from '../../../components/forms/CustomTextInput';

export default function CreateRequestScreen({ route, navigation }) {
    // En el futuro, estos datos llegarán por el route.params
    const mockTechnician = { name: 'Juan Pérez', verified: true, rating: 4.8, reviews: 118 };

    // Estados del formulario
    const [description, setDescription] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [address, setAddress] = useState('Sarco, Calle Las Rosas 9123'); // Precargado de ejemplo

    const handleSubmit = () => {
        // Activamos la navegación al ticket de éxito
        navigation.navigate('RequestSuccess');
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView
                style={styles.keyboardView}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                {/* Cabecera */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Ionicons name="close" size={28} color={colors.textMain} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Nueva Solicitud</Text>
                    <View style={{ width: 28 }} /> {/* Espaciador para centrar título */}
                </View>

                <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

                    {/* Perfil Resumido */}
                    <TechnicianMiniProfile
                        name={mockTechnician.name}
                        rating={mockTechnician.rating}
                        reviews={mockTechnician.reviews}
                        verified={mockTechnician.verified}
                        onChatPress={() => console.log('Abrir chat')}
                    />

                    {/* Formulario */}
                    <CustomTextInput
                        label="Categoría del servicio"
                        value="Electricidad"
                        isSelect={true}
                        iconName="chevron-down"
                        onPress={() => console.log('Abrir selector de categoría')}
                    />

                    <CustomTextInput
                        label="Tipo de servicio específico"
                        value="Instalación de artefactos"
                        isSelect={true}
                        iconName="chevron-down"
                        onPress={() => console.log('Abrir selector de tipo')}
                    />

                    <CustomTextInput
                        label="Describe el problema"
                        placeholder="Ej. Requiero conectar la ducha eléctrica..."
                        value={description}
                        onChangeText={setDescription}
                        multiline={true}
                        maxLength={200}
                    />

                    {/* Fila de Fecha y Hora (2 columnas) */}
                    <View style={styles.row}>
                        <View style={styles.halfWidth}>
                            <CustomTextInput
                                label="Fecha sugerida"
                                placeholder="DD/MM/AAAA"
                                value={date}
                                onChangeText={setDate}
                                iconName="calendar-outline"
                                isSelect={true} // Fingimos que abre un calendario
                                onPress={() => console.log('Abrir calendario')}
                            />
                        </View>
                        <View style={styles.halfWidth}>
                            <CustomTextInput
                                label="Hora sugerida"
                                placeholder="00:00 - 00:00"
                                value={time}
                                onChangeText={setTime}
                                iconName="time-outline"
                                isSelect={true} // Fingimos que abre un selector de hora
                                onPress={() => console.log('Abrir reloj')}
                            />
                        </View>
                    </View>

                    <CustomTextInput
                        label="Zona y Dirección en Cochabamba"
                        placeholder="Ingresa tu dirección exacta"
                        value={address}
                        onChangeText={setAddress}
                        iconName="location-outline"
                    />

                </ScrollView>

                {/* Botón Flotante Inferior */}
                <View style={styles.footer}>
                    <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} activeOpacity={0.8}>
                        <Text style={styles.submitButtonText}>ENVIAR SOLICITUD DE TRABAJO</Text>
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
        paddingHorizontal: 15, paddingVertical: 15,
        backgroundColor: colors.surface,
        borderBottomWidth: 1, borderBottomColor: colors.border,
    },
    backButton: { padding: 5, marginLeft: -5 },
    headerTitle: { fontSize: 18, fontWeight: 'bold', color: colors.textMain },
    scroll: { padding: 20, paddingBottom: 40 },
    row: { flexDirection: 'row', justifyContent: 'space-between' },
    halfWidth: { width: '48%' },
    footer: {
        padding: 20,
        backgroundColor: colors.surface,
        borderTopWidth: 1,
        borderTopColor: colors.border,
    },
    submitButton: {
        backgroundColor: colors.primary, // Usamos tu verde principal
        height: 55,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        // Sombra de color para darle un estilo "glow" premium
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    submitButtonText: {
        color: colors.white,
        fontSize: 15,
        fontWeight: 'bold',
        letterSpacing: 0.5,
    },
});