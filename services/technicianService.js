import { supabase } from '../config/supabaseConfig';

export const technicianService = {
    // Obtener la lista pública de técnicos (Buscador y Home)
    async getPublicTechnicians() {
        const { data, error } = await supabase
            .from('technicians_public')
            .select('*');

        if (error) throw error;
        return data;
    },

    // Formulario para "Convertirse en Técnico"
    async registerTechnician(profileId, categoryId, bio, zones, baseRate, experience) {
        const { data, error } = await supabase
            .from('technical_profiles')
            .insert([{
                profile_id: profileId,
                category_id: categoryId,
                bio: bio,
                coverage_zones: zones,
                base_rate: baseRate,
                years_experience: experience
            }])
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    // Obtener el teléfono del técnico (RPC: Función de base de datos)
    async getTechnicianPhone(technicianId) {
        const { data, error } = await supabase.rpc('get_technician_phone', {
            p_technician_id: technicianId
        });

        if (error) throw error;
        return data; // Devuelve el teléfono, o null si el usuario no tiene permiso
    }
};