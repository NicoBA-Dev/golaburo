import { supabase } from '../config/supabaseConfig';

export const authService = {
    async login(email, password) {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        if (error) throw error;
        return data;
    },

    async register({ email, password, nombre, rubro = null }) {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    nombre,
                    rubro,
                    es_tecnico: Boolean(rubro),
                },
            },
        });
        if (error) throw error;
        return data;
    },

    async logout() {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
    },
    // Agrega esta función dentro del objeto authService en services/authService.js

    async getCurrentSession() {
        return new Promise((resolve) => {
            // Retorna null para enviar directo al Login
            resolve(null);
        });
    },
};