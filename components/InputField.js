import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '../theme/colors';
import { fontSize, fontWeight, lineHeight } from '../theme/typography';

/**
 * Campo de texto con label, manejo de error, estado de foco y,
 * opcionalmente, un botón para mostrar/ocultar la contraseña.
 *
 * Props nuevas respecto a la versión anterior:
 *  - error?: string        -> mensaje de error a mostrar bajo el input
 *  - onBlur?: () => void   -> útil para validar "on blur"
 *  - helperText?: string   -> texto de ayuda cuando no hay error
 *  - maxLength?: number
 *  - autoCapitalize?: string
 */
export default function InputField({
  label,
  value,
  onChangeText,
  onBlur,
  placeholder,
  keyboardType = 'default',
  secureTextEntry = false,
  error,
  helperText,
  maxLength,
  autoCapitalize = 'sentences',
  ...rest
}) {
  const [isFocused, setIsFocused] = useState(false);
  const [isSecureVisible, setIsSecureVisible] = useState(false);

  const showToggle = secureTextEntry;
  const hasError = Boolean(error);

  const borderColor = hasError
    ? colors.error
    : isFocused
      ? colors.primary
      : colors.border;

  return (
    <View style={styles.container}>
      {label ? <Text style={styles.label}>{label}</Text> : null}

      <View
        style={[
          styles.inputWrapper,
          { borderColor },
          isFocused && !hasError ? styles.inputWrapperFocused : null,
          hasError ? styles.inputWrapperError : null,
        ]}
      >
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          onFocus={() => setIsFocused(true)}
          onBlur={() => {
            setIsFocused(false);
            if (onBlur) onBlur();
          }}
          placeholder={placeholder}
          placeholderTextColor={colors.placeholder}
          keyboardType={keyboardType}
          secureTextEntry={showToggle ? !isSecureVisible : false}
          autoCapitalize={autoCapitalize}
          autoCorrect={false}
          maxLength={maxLength}
          {...rest}
        />

        {showToggle ? (
          <TouchableOpacity
            onPress={() => setIsSecureVisible((prev) => !prev)}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            style={styles.toggleBtn}
          >
            <Text style={styles.toggleText}>
              {isSecureVisible ? 'Ocultar' : 'Mostrar'}
            </Text>
          </TouchableOpacity>
        ) : null}
      </View>

      {hasError ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : helperText ? (
        <Text style={styles.helperText}>{helperText}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 14,
  },
  label: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    color: colors.textMain,
    marginBottom: 6,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 12,
    backgroundColor: colors.background,
    paddingHorizontal: 14,
  },
  inputWrapperFocused: {
    backgroundColor: colors.surface,
    shadowColor: colors.primary,
    shadowOpacity: 0.12,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  inputWrapperError: {
    backgroundColor: colors.errorSoft,
  },
  input: {
    flex: 1,
    fontSize: fontSize.base,
    lineHeight: lineHeight.base,
    color: colors.textMain,
    paddingVertical: 13,
  },
  toggleBtn: {
    paddingLeft: 10,
    paddingVertical: 4,
  },
  toggleText: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
    color: colors.primary,
  },
  errorText: {
    fontSize: fontSize.xs,
    color: colors.error,
    marginTop: 6,
    marginLeft: 2,
  },
  helperText: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
    marginTop: 6,
    marginLeft: 2,
  },
});