import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';

export default function RatingModal({ visible, technicianName, onClose, onSubmit }) {
    const [rating, setRating] = useState(0);
    const [review, setReview] = useState('');

    const handleSubmit = () => {
        onSubmit(rating, review);
        // Limpiamos los estados después de enviar
        setRating(0);
        setReview('');
    };

    return (
        <Modal visible={visible} transparent={true} animationType="fade">
            <View style={styles.overlay}>
                {/* KeyboardAvoidingView evita que el teclado tape el modal */}
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.keyboardContainer}
                >
                    <View style={styles.sheet}>
                        <Text style={styles.title}>Calificar Trabajo</Text>
                        <Text style={styles.technicianName}>{technicianName}</Text>

                        <Text style={styles.label}>Tu Calificación</Text>
                        <View style={styles.starsContainer}>
                            {[1, 2, 3, 4, 5].map((star) => (
                                <TouchableOpacity key={star} onPress={() => setRating(star)} activeOpacity={0.7}>
                                    <Ionicons
                                        name={rating >= star ? "star" : "star-outline"}
                                        size={40}
                                        color={rating >= star ? "#F9A825" : colors.border}
                                        style={styles.starIcon}
                                    />
                                </TouchableOpacity>
                            ))}
                        </View>

                        <Text style={styles.label}>Tu Reseña (opcional)</Text>
                        <TextInput
                            style={styles.textInput}
                            placeholder="Escribe aquí tu opinión sobre el trabajo..."
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

                        <TouchableOpacity style={styles.secondaryButton} onPress={onClose}>
                            <Text style={styles.secondaryButtonText}>OMITIR POR AHORA</Text>
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
        backgroundColor: colors.overlay, // Fondo oscuro translúcido
        justifyContent: 'flex-end',
    },
    keyboardContainer: {
        width: '100%',
    },
    sheet: {
        backgroundColor: colors.surface,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 24,
        paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    },
    title: { fontSize: 22, fontWeight: '900', color: colors.textMain, textAlign: 'center', marginBottom: 4 },
    technicianName: { fontSize: 16, color: colors.textMuted, textAlign: 'center', marginBottom: 24 },
    label: { fontSize: 14, fontWeight: 'bold', color: colors.textMain, marginBottom: 12 },
    starsContainer: { flexDirection: 'row', justifyContent: 'center', marginBottom: 24 },
    starIcon: { marginHorizontal: 4 },
    textInput: {
        backgroundColor: colors.background,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 12,
        padding: 15,
        height: 100,
        textAlignVertical: 'top',
        color: colors.textMain,
    },
    charCount: { textAlign: 'right', fontSize: 12, color: colors.textMuted, marginTop: 6, marginBottom: 20 },
    primaryButton: {
        backgroundColor: colors.primary,
        height: 55,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },
    buttonDisabled: { backgroundColor: colors.disabledBg },
    primaryButtonText: { color: colors.surface, fontSize: 14, fontWeight: 'bold' },
    secondaryButton: {
        height: 55,
        alignItems: 'center',
        justifyContent: 'center',
    },
    secondaryButtonText: { color: colors.textMuted, fontSize: 14, fontWeight: '600' }
});