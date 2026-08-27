import { supabase } from '../config/supabaseConfig';

export const requestService = {
    // 1. Cliente crea una nueva solicitud
    async createRequest(requestData) {
        const { data, error } = await supabase
            .from('service_requests')
            .insert([requestData])
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    // 2. Obtener historial de solicitudes del cliente (Con datos cruzados)
    async getClientRequests(clientId) {
        const { data, error } = await supabase
            .from('service_requests')
            .select(`
                *,
                categories ( name, icon ),
                technical_profiles (
                    avg_rating,
                    profiles ( full_name, avatar_url )
                )
            `)
            .eq('client_id', clientId)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data;
    },

    // 3. Cambiar estado (El técnico acepta/rechaza, o el cliente completa/cancela)
    async updateRequestStatus(requestId, newStatus) {
        const { data, error } = await supabase
            .from('service_requests')
            .update({ status: newStatus })
            .eq('id', requestId)
            .select()
            .single();

        if (error) throw error;
        return data;
    }
};