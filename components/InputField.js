import React, { forwardRef, useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '../theme/colors';
import { fontSize, fontWeight, lineHeight } from '../theme/typography';

/**
 * Campo de texto con label, manejo de error, estado de foco,
 * navegación entre campos por teclado (vía ref) y, opcionalmente,
 * un botón para mostrar/ocultar la contraseña o un prefijo fijo
 * (ej. "+591" para teléfonos).
 *
 * Props:
 *  - error?: string        -> mensaje de error a mostrar bajo el input
 *  - onBlur?: () => void   -> útil para validar "on blur"
 *  - helperText?: string   -> texto de ayuda cuando no hay error
 *  - prefix?: string       -> texto fijo no editable antes del input (ej. "+591")
 *  - maxLength?: number
 *  - autoCapitalize?: string
 *  - ref                   -> forwardeado al TextInput, para .focus() desde el padre
 */
const InputField = forwardRef(function InputField(
  {
    label,
    value,
    onChangeText,
    onBlur,
    placeholder,
    keyboardType = 'default',
    secureTextEntry = false,
    error,
    helperText,
    prefix,
    maxLength,
    autoCapitalize = 'sentences',
    ...rest
  },
  ref
) {
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
        {prefix ? (
          <View style={styles.prefixBox}>
            <Text style={styles.prefixText}>{prefix}</Text>
            <View style={styles.prefixDivider} />
          </View>
        ) : null}

        <TextInput
          ref={ref}
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
});

export default InputField;

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
  prefixBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  prefixText: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold,
    color: colors.textMain,
  },
  prefixDivider: {
    width: 1,
    height: 18,
    backgroundColor: colors.border,
    marginLeft: 10,
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