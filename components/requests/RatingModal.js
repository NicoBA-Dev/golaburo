import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';

export default function RatingModal({ visible, technicianName, onClose, onSubmit }) {
    const [rating, setRating] = useState(0);
    const [review, setReview] = useState('');

    const handleSubmit = () => {
        onSubmit(rating, review);
        setRating(0);
        setReview('');
    };

    const handleClose = () => {
        setRating(0);
        setReview('');
        onClose();
    };

    return (
        <Modal visible={visible} transparent={true} animationType="slide">
            <View style={styles.overlay}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.keyboardContainer}
                >
                    <View style={styles.sheet}>
                        {/* Indicador de arrastre superior */}
                        <View style={styles.dragIndicator} />

                        <Text style={styles.title}>Calificar Trabajo</Text>
                        <Text style={styles.technicianName}>¿Qué tal te pareció el servicio de <Text style={styles.boldTech}>{technicianName}</Text>?</Text>

                        <View style={styles.starsContainer}>
                            {[1, 2, 3, 4, 5].map((star) => (
                                <TouchableOpacity key={star} onPress={() => setRating(star)} activeOpacity={0.6} style={styles.starButton}>
                                    <Ionicons
                                        name={rating >= star ? "star" : "star-outline"}
                                        size={46}
                                        color={rating >= star ? "#F9A825" : colors.border}
                                    />
                                </TouchableOpacity>
                            ))}
                        </View>

                        <Text style={styles.label}>Escribe una reseña (Opcional)</Text>
                        <TextInput
                            style={styles.textInput}
                            placeholder="Ej. Muy puntual y dejó todo limpio..."
                            placeholderTextColor={colors.placeholder}
                            value={review}
                            onChangeText={setReview}
                            multiline
                            maxLength={200}
                        />
                        <Text style={styles.charCount}>{review.length}/200</Text>

                        <TouchableOpacity
                            style={[styles.primaryButton, rating === 0 && styles.buttonDisabled]}
                            disabled={rating === 0}
                            onPress={handleSubmit}
                        >
                            <Text style={styles.primaryButtonText}>ENVIAR CALIFICACIÓN</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.secondaryButton} onPress={handleClose}>
                            <Text style={styles.secondaryButtonText}>Omitir por ahora</Text>
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.4)', // Fondo un poco más oscuro para que resalte la hoja
        justifyContent: 'flex-end',
    },
    keyboardContainer: { width: '100%' },
    sheet: {
        backgroundColor: colors.surface,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        padding: 24,
        paddingBottom: Platform.OS === 'ios' ? 40 : 24,
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
    },
    dragIndicator: { width: 40, height: 5, borderRadius: 3, backgroundColor: colors.border, alignSelf: 'center', marginBottom: 20 },
    title: { fontSize: 22, fontWeight: '900', color: colors.textMain, textAlign: 'center', marginBottom: 6, letterSpacing: -0.5 },
    technicianName: { fontSize: 15, color: colors.textMuted, textAlign: 'center', marginBottom: 25 },
    boldTech: { fontWeight: 'bold', color: colors.textMain },

    starsContainer: { flexDirection: 'row', justifyContent: 'center', marginBottom: 30, gap: 4 },
    starButton: { padding: 4 },

    label: { fontSize: 14, fontWeight: 'bold', color: colors.textMain, marginBottom: 10, marginLeft: 4 },
    textInput: {
        backgroundColor: colors.background, // Contraste sutil
        borderWidth: 1, borderColor: colors.border, borderRadius: 16,
        padding: 18, height: 110, textAlignVertical: 'top',
        color: colors.textMain, fontSize: 15,
    },
    charCount: { textAlign: 'right', fontSize: 12, fontWeight: '600', color: colors.textMuted, marginTop: 8, marginBottom: 20, marginRight: 4 },

    primaryButton: {
        backgroundColor: colors.primary, height: 56, borderRadius: 16,
        alignItems: 'center', justifyContent: 'center', marginBottom: 12,
        shadowColor: colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4
    },
    buttonDisabled: { backgroundColor: colors.disabledBg, shadowOpacity: 0, elevation: 0 },
    primaryButtonText: { color: colors.surface, fontSize: 15, fontWeight: 'bold', letterSpacing: 0.5 },

    secondaryButton: { height: 50, alignItems: 'center', justifyContent: 'center' },
    secondaryButtonText: { color: colors.textMuted, fontSize: 15, fontWeight: 'bold' }
});