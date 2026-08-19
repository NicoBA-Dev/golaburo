import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, View } from 'react-native';
import { colors } from '../theme/colors';
import { fontSize, fontWeight } from '../theme/typography';

/**
 * Botón principal con soporte de loading y disabled.
 *
 * Props nuevas:
 *  - loading?: boolean   -> muestra spinner y bloquea el toque
 *  - disabled?: boolean  -> baja opacidad y bloquea el toque
 *  - variant?: 'primary' | 'secondary' | 'outline'
 */
export default function PrimaryButton({
  title,
  onPress,
  style,
  loading = false,
  disabled = false,
  variant = 'primary',
}) {
  const isDisabled = disabled || loading;

  const variantStyle =
    variant === 'secondary'
      ? styles.secondary
      : variant === 'outline'
        ? styles.outline
        : styles.primary;

  const textVariantStyle =
    variant === 'outline' ? styles.outlineText : styles.text;

  return (
    <TouchableOpacity
      style={[
        styles.base,
        variantStyle,
        isDisabled ? styles.disabled : null,
        style,
      ]}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.8}
    >
      {loading ? (
        <View style={styles.loadingRow}>
          <ActivityIndicator
            size="small"
            color={variant === 'outline' ? colors.primary : colors.white}
          />
          <Text style={[textVariantStyle, styles.loadingLabel]}>{title}</Text>
        </View>
      ) : (
        <Text style={textVariantStyle}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primary: {
    backgroundColor: colors.primary,
    shadowColor: colors.primary,
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  secondary: {
    backgroundColor: colors.secondary,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  disabled: {
    opacity: 0.55,
    shadowOpacity: 0,
    elevation: 0,
  },
  text: {
    color: colors.white,
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
  },
  outlineText: {
    color: colors.primary,
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  loadingLabel: {
    marginLeft: 8,
  },
});