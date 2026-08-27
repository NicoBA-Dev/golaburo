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

    async register({ email, password, full_name, phone }) {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name, // Exactamente como lo espera el trigger de Supabase
                    phone,     // Exactamente como lo espera el trigger de Supabase
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

    async getCurrentSession() {
        const { data, error } = await supabase.auth.getSession();
        if (error) {
            console.error("Error obteniendo sesión:", error);
            return null;
        }
        return data.session;
    },
};