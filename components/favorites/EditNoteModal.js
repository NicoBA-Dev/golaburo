import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { colors } from '../../theme/colors';

const MAX_LENGTH = 140;

export default function EditNoteModal({ visible, technicianName, initialNote, saving, onClose, onSave }) {
    const [note, setNote] = useState(initialNote || '');

    useEffect(() => {
        if (visible) setNote(initialNote || '');
    }, [visible, initialNote]);

    return (
        <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
            <View style={styles.overlay}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.keyboardContainer}
                >
                    <View style={styles.sheet}>
                        <View style={styles.dragIndicator} />

                        <Text style={styles.title}>Nota personal</Text>
                        <Text style={styles.subtitle}>
                            Para recordar por qué guardaste a <Text style={styles.boldTech}>{technicianName}</Text>
                        </Text>

                        <TextInput
                            style={styles.textInput}
                            placeholder="Ej. Muy puntual, arregla bien las fugas..."
                            placeholderTextColor={colors.placeholder}
                            value={note}
                            onChangeText={(text) => setNote(text.slice(0, MAX_LENGTH))}
                            multiline
                            maxLength={MAX_LENGTH}
                            autoFocus
                        />
                        <Text style={styles.charCount}>{note.length}/{MAX_LENGTH}</Text>

                        <TouchableOpacity
                            style={[styles.primaryButton, saving && styles.buttonDisabled]}
                            disabled={saving}
                            onPress={() => onSave(note.trim())}
                        >
                            <Text style={styles.primaryButtonText}>
                                {saving ? 'GUARDANDO...' : 'GUARDAR NOTA'}
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.secondaryButton} onPress={onClose} disabled={saving}>
                            <Text style={styles.secondaryButtonText}>Cancelar</Text>
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.4)', justifyContent: 'flex-end' },
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
    subtitle: { fontSize: 15, color: colors.textMuted, textAlign: 'center', marginBottom: 20 },
    boldTech: { fontWeight: 'bold', color: colors.textMain },

    textInput: {
        backgroundColor: colors.background,
        borderWidth: 1, borderColor: colors.border, borderRadius: 16,
        padding: 18, height: 110, textAlignVertical: 'top',
        color: colors.textMain, fontSize: 15,
    },
    charCount: { textAlign: 'right', fontSize: 12, fontWeight: '600', color: colors.textMuted, marginTop: 8, marginBottom: 20, marginRight: 4 },

    primaryButton: {
        backgroundColor: colors.primary, height: 56, borderRadius: 16,
        alignItems: 'center', justifyContent: 'center', marginBottom: 12,
        shadowColor: colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4,
    },
    buttonDisabled: { backgroundColor: colors.disabledBg, shadowOpacity: 0, elevation: 0 },
    primaryButtonText: { color: colors.surface, fontSize: 15, fontWeight: 'bold', letterSpacing: 0.5 },

    secondaryButton: { height: 50, alignItems: 'center', justifyContent: 'center' },
    secondaryButtonText: { color: colors.textMuted, fontSize: 15, fontWeight: 'bold' },
});
