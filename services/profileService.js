import { supabase } from '../config/supabaseConfig';

export const profileService = {
    // 1. Obtener los datos básicos del cliente
    async getProfile(userId) {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();

        if (error) throw error;
        return data;
    },

    // 2. Verificar si el usuario tiene un perfil de técnico activo
    async getTechnicalProfile(userId) {
        const { data, error } = await supabase
            .from('technical_profiles')
            .select('*')
            .eq('profile_id', userId)
            .maybeSingle(); // Usamos maybeSingle porque puede que no sea técnico

        if (error) throw error;
        return data; // Devuelve los datos si es técnico, o null si solo es cliente
    },

    // 3. Actualizar datos básicos (Nombre o Avatar)
    async updateProfile(userId, updates) {
        const { data, error } = await supabase
            .from('profiles')
            .update(updates)
            .eq('id', userId)
            .select()
            .single();

        if (error) throw error;
        return data;
    }
};