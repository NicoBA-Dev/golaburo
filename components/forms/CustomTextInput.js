import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';

export default function CustomTextInput({
    label, iconName, isSelect, placeholder, value, onChangeText,
    multiline, maxLength, onPress
}) {
    const [isFocused, setIsFocused] = useState(false);

    const InputContainer = isSelect ? TouchableOpacity : View;

    return (
        <View style={styles.container}>
            <Text style={styles.label}>{label}</Text>
            <InputContainer
                style={[
                    styles.inputWrapper,
                    isFocused && styles.inputFocused,
                    multiline && styles.inputWrapperMultiline
                ]}
                onPress={isSelect ? onPress : undefined}
                activeOpacity={isSelect ? 0.7 : 1}
            >
                <TextInput
                    style={[styles.input, multiline && styles.inputMultiline]}
                    placeholder={placeholder}
                    placeholderTextColor={colors.textMuted}
                    value={value}
                    onChangeText={onChangeText}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    multiline={multiline}
                    maxLength={maxLength}
                    editable={!isSelect} // Si es un selector, bloqueamos la escritura
                    pointerEvents={isSelect ? 'none' : 'auto'}
                />

                {/* Ícono a la derecha (calendario, reloj, mapa o flecha) */}
                {iconName && (
                    <Ionicons name={iconName} size={20} color={colors.textMuted} style={styles.icon} />
                )}
            </InputContainer>

            {/* Contador de caracteres para descripciones */}
            {maxLength && (
                <Text style={styles.charCount}>
                    {value ? value.length : 0}/{maxLength}
                </Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.textMain,
        marginBottom: 8,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 12,
        paddingHorizontal: 15,
        minHeight: 50,
    },
    inputFocused: {
        borderColor: colors.primary, // Se pinta verde al escribir
        backgroundColor: colors.background,
    },
    inputWrapperMultiline: {
        alignItems: 'flex-start',
        paddingVertical: 12,
    },
    input: {
        flex: 1,
        fontSize: 15,
        color: colors.textMain,
    },
    inputMultiline: {
        minHeight: 80,
        textAlignVertical: 'top',
    },
    icon: {
        marginLeft: 10,
    },
    charCount: {
        fontSize: 12,
        color: colors.textMuted,
        textAlign: 'right',
        marginTop: 4,
    },
});