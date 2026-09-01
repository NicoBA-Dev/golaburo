import { supabase } from '../config/supabaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DRAFT_KEY = '@go_laburo_claim_draft';

export const claimService = {
    async createClaim(claimData) {
        const { data, error } = await supabase.from('service_claims').insert([claimData]).select();
        if (error) throw error;
        return data;
    },

    async getClientClaims(clientId) {
        const { data, error } = await supabase
            .from('service_claims')
            .select(`
                id, reason, description, status, created_at,
                service_requests ( suggested_date, categories ( name ) ),
                technical_profiles!service_claims_technician_id_fkey ( profiles ( full_name ) )
            `)
            .eq('client_id', clientId)
            .order('created_at', { ascending: false });
        if (error) throw error;
        return data;
    },

    async updateClaimDescription(claimId, newDescription) {
        const { data, error } = await supabase.from('service_claims').update({ description: newDescription }).eq('id', claimId).eq('status', 'pending');
        if (error) throw error;
        return data;
    },

    async cancelClaim(claimId) {
        const { data, error } = await supabase.from('service_claims').update({ status: 'cancelled' }).eq('id', claimId);
        if (error) throw error;
        return data;
    },

    // Persistencia Local
    async saveDraft(text) { try { await AsyncStorage.setItem(DRAFT_KEY, text); } catch (e) { } },
    async getDraft() { try { return await AsyncStorage.getItem(DRAFT_KEY); } catch (e) { return null; } },
    async clearDraft() { try { await AsyncStorage.removeItem(DRAFT_KEY); } catch (e) { } },

    // ==========================================
    // 6. LADO DEL TÉCNICO: Leer reclamos recibidos
    // ==========================================
    async getTechnicianClaims(techId) {
        const { data, error } = await supabase
            .from('service_claims')
            .select(`
                id, reason, description, status, created_at,
                client:profiles!service_claims_client_id_fkey ( full_name, phone ),
                service_requests ( categories ( name ) )
            `)
            .eq('technician_id', techId)
            .order('created_at', { ascending: false });

        console.log("Reclamos cargados con éxito:", data);
        if (error) throw error;
        return data || [];
    },

    async markAsResolved(claimId) {
        const { data, error } = await supabase.from('service_claims').update({ status: 'resolved' }).eq('id', claimId);
        if (error) throw error;
        return data;
    }
};