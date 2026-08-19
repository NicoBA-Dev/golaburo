// theme/colors.js
//
// Paleta base sin cambios (se usan EXACTAMENTE los colores originales).
// Se añaden variantes derivadas (con opacidad) para estados de UI:
// focus, disabled, overlays, sombras, etc. Ninguna es un color nuevo,
// son transformaciones alpha de la misma paleta.

const withOpacity = (hex, opacity) => {
  const parsed = hex.replace('#', '');
  const bigint = parseInt(parsed, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

const base = {
  // Marca principal
  primary: '#2E7D32',
  secondary: '#ED7D31',

  // Fondos y contenedores
  background: '#F7F7F7',
  surface: '#FFFFFF',

  // Textos
  textMain: '#1A1A1A',
  textMuted: '#6B6B6B',

  // Interfaz y estados
  border: '#E0E0E0',
  success: '#2E7D32',
  error: '#C62828',
  warning: '#F9A825',
};

export const colors = {
  ...base,

  // Variantes de marca (mismo hue, distinta intensidad) — útiles para
  // estados pressed / focus sin salirnos de la identidad visual.
  primarySoft: withOpacity(base.primary, 0.1),   // fondo de foco, chips, badges
  primaryBorder: withOpacity(base.primary, 0.4), // borde de input enfocado
  secondarySoft: withOpacity(base.secondary, 0.12),

  // Estados de error, éxito y advertencia con opacidad para fondos suaves
  errorSoft: withOpacity(base.error, 0.08),
  errorBorder: withOpacity(base.error, 0.5),
  successSoft: withOpacity(base.success, 0.08),
  warningSoft: withOpacity(base.warning, 0.12),

  // Utilidad
  placeholder: '#9C9C9C',       // gris intermedio para placeholders (deriva de textMuted)
  disabled: withOpacity('#1A1A1A', 0.28),
  disabledBg: '#EDEDED',
  overlay: withOpacity('#000000', 0.45), // fondos de modal / loaders
  shadow: '#000000',
  white: '#FFFFFF',
  black: '#000000',
};

export default colors;