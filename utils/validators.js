// utils/validators.js
//
// Validaciones reutilizables para formularios de autenticación.
// Cada función devuelve `null` si es válido, o un string con el
// mensaje de error a mostrar si no lo es.

export function validateEmail(value) {
    const v = (value || '').trim();
    if (!v) return 'El correo es obligatorio.';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!emailRegex.test(v)) return 'Ingresa un correo válido.';
    return null;
}

export function validatePassword(value, { minLength = 8 } = {}) {
    const v = value || '';
    if (!v) return 'La contraseña es obligatoria.';
    if (v.length < minLength) return `Debe tener al menos ${minLength} caracteres.`;
    if (!/[a-zA-Z]/.test(v) || !/[0-9]/.test(v)) {
        return 'Combina letras y números.';
    }
    return null;
}

export function validateLoginPassword(value) {
    // En login solo pedimos que no esté vacía (no reglas de fuerza).
    if (!value) return 'La contraseña es obligatoria.';
    return null;
}

export function validateConfirmPassword(password, confirmPassword) {
    if (!confirmPassword) return 'Confirma tu contraseña.';
    if (password !== confirmPassword) return 'Las contraseñas no coinciden.';
    return null;
}

export function validateName(value) {
    const v = (value || '').trim();
    if (!v) return 'El nombre es obligatorio.';
    if (v.length < 3) return 'Ingresa al menos 3 caracteres.';
    if (!/^[A-Za-zÀ-ÿ\s]+$/.test(v)) return 'El nombre solo puede tener letras.';
    return null;
}

// Valida el número LOCAL boliviano (8 dígitos, sin +591) porque el
// prefijo se muestra fijo en el input y el usuario solo escribe el
// resto. Úsala junto con `formatBolivianPhoneInput` en el onChangeText.
export function validatePhone(value) {
    const v = (value || '').replace(/\s+/g, '');
    if (!v) return 'El teléfono es obligatorio.';
    if (v.length < 8) return 'Debe tener 8 dígitos.';
    // Bolivia: celulares empiezan en 6 (Entel/Viva) o 7 (Tigo)
    const phoneRegex = /^[67]\d{7}$/;
    if (!phoneRegex.test(v)) return 'Ingresa un número boliviano válido (ej. 700 00000).';
    return null;
}

// Limpia lo que el usuario escribe en el campo de teléfono: solo
// dígitos y máximo 8 caracteres (para que sea imposible ingresar un
// número que no sea boliviano, ya que el prefijo +591 va fijo).
export function formatBolivianPhoneInput(value) {
    return (value || '').replace(/\D/g, '').slice(0, 8);
}

// Fuerza de contraseña simple para feedback visual (0-3)
export function getPasswordStrength(value) {
    const v = value || '';
    if (!v) return 0;
    let score = 0;
    if (v.length >= 8) score += 1;
    if (/[A-Z]/.test(v) && /[a-z]/.test(v)) score += 1;
    if (/[0-9]/.test(v) && /[^A-Za-z0-9]/.test(v)) score += 1;
    return score; // 0 = muy débil, 3 = fuerte
}