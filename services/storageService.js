import AsyncStorage from '@react-native-async-storage/async-storage';

// Claves para el almacenamiento local
const KEYS = {
    NOTIFICATIONS: '@preferencia_notificaciones', // Booleano
    LAST_USER: '@ultimo_usuario_email',           // Texto
    FAVORITE_IDS: '@favoritos_tecnicos_cache',    // Array de technician_id (módulo Favoritos)
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
            await AsyncStorage.removeItem(KEYS.FAVORITE_IDS);
            return true;
        } catch (error) {
            console.error('Error eliminando datos locales', error);
            return false;
        }
    },

    // 4. CACHÉ LOCAL DE FAVORITOS (módulo Favoritos de técnicos)
    // Supabase es la fuente de verdad; esto es solo un espejo de lectura
    // para pintar el corazón activo al instante (sin esperar la red) la
    // próxima vez que el cliente abra Explorar o el perfil de un técnico.
    async cacheFavoriteIds(technicianIds) {
        try {
            await AsyncStorage.setItem(KEYS.FAVORITE_IDS, JSON.stringify(technicianIds));
            return true;
        } catch (error) {
            console.error('Error cacheando favoritos localmente', error);
            return false;
        }
    },

    async getCachedFavoriteIds() {
        try {
            const raw = await AsyncStorage.getItem(KEYS.FAVORITE_IDS);
            return raw ? JSON.parse(raw) : [];
        } catch (error) {
            console.error('Error leyendo caché local de favoritos', error);
            return [];
        }
    },
};