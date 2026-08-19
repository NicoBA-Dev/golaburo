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

    // Función arreglada: ahora sí consulta a Supabase en lugar de devolver null
    async getCurrentSession() {
        const { data, error } = await supabase.auth.getSession();
        if (error) {
            console.error("Error obteniendo sesión:", error);
            return null;
        }
        return data.session;
    },
};