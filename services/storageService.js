import AsyncStorage from '@react-native-async-storage/async-storage';

// Claves para el almacenamiento local
const KEYS = {
    NOTIFICATIONS: '@preferencia_notificaciones', // Booleano
    LAST_USER: '@ultimo_usuario_email',           // Texto
};

export const storageService = {
    // 1. GUARDAR DATOS (Texto y Booleano)
    async saveLocalPreferences(email, notificationsEnabled) {
        try {
            await AsyncStorage.setItem(KEYS.LAST_USER, email);

            // AsyncStorage solo guarda Strings, así que convertimos el booleano
            await AsyncStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify(notificationsEnabled));
            return true;
        } catch (error) {
            console.error('Error guardando en almacenamiento local', error);
            return false;
        }
    },

    // 2. RECUPERAR DATOS (Al iniciar la app)
    async getLocalPreferences() {
        try {
            const email = await AsyncStorage.getItem(KEYS.LAST_USER);
            const notifsString = await AsyncStorage.getItem(KEYS.NOTIFICATIONS);

            return {
                email: email || null,
                notificationsEnabled: notifsString ? JSON.parse(notifsString) : false, // False por defecto
            };
        } catch (error) {
            console.error('Error leyendo almacenamiento local', error);
            return { email: null, notificationsEnabled: false };
        }
    },

    // 3. ELIMINAR DATOS (Requisito del PDF)
    async clearLocalPreferences() {
        try {
            await AsyncStorage.removeItem(KEYS.LAST_USER);
            await AsyncStorage.removeItem(KEYS.NOTIFICATIONS);
            return true;
        } catch (error) {
            console.error('Error eliminando datos locales', error);
            return false;
        }
    }
};