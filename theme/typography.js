// theme/typography.js
//
// Sistema tipográfico centralizado. Por defecto usa la fuente del sistema
// (San Francisco en iOS / Roboto en Android) con pesos bien definidos,
// que ya se ve profesional sin dependencias extra.
//
// Si quieres subir un escalón más el diseño, esta app funciona muy bien
// con "Poppins" (títulos, look moderno y amigable) + "Inter" (texto,
// máxima legibilidad). Para activarlo con Expo:
//
//   npx expo install expo-font @expo-google-fonts/poppins @expo-google-fonts/inter
//
//   // En App.js
//   import { useFonts, Poppins_600SemiBold, Poppins_700Bold } from '@expo-google-fonts/poppins';
//   import { Inter_400Regular, Inter_500Medium, Inter_600SemiBold } from '@expo-google-fonts/inter';
//
// Y luego cambia `fontFamily.display` / `fontFamily.body` abajo por
// 'Poppins_700Bold' / 'Inter_400Regular', etc.

export const fontFamily = {
    display: undefined, // usa el sistema por defecto (bold vía fontWeight)
    body: undefined,
};

export const fontWeight = {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
};

export const fontSize = {
    xs: 11,
    sm: 13,
    base: 15,
    md: 16,
    lg: 18,
    xl: 22,
    '2xl': 26,
    '3xl': 30,
};

export const lineHeight = {
    xs: 15,
    sm: 18,
    base: 21,
    md: 22,
    lg: 26,
    xl: 28,
    '2xl': 32,
    '3xl': 36,
};

export const letterSpacing = {
    tight: -0.3,
    normal: 0,
    wide: 0.2,
};

export const typography = { fontFamily, fontWeight, fontSize, lineHeight, letterSpacing };

export default typography;