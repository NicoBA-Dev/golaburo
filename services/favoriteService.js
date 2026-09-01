import { supabase } from '../config/supabaseConfig';

// Trae nombre/foto/categoría/rating de cada favorito desde la vista pública
// "technicians_public" en vez de unir contra profiles directamente: profiles
// tiene RLS restrictivo (solo tu propio perfil, o el de la contraparte de una
// service_request activa) y "marcar como favorito" no cuenta como ese vínculo,
// así que un join directo devolvía null en nombre/avatar.
async function attachTechnicianData(favorites) {
    if (!favorites || favorites.length === 0) return [];

    const technicianIds = [...new Set(favorites.map((f) => f.technician_id))];
    const { data: techs, error } = await supabase
        .from('technicians_public')
        .select('*')
        .in('id', technicianIds);

    if (error) throw error;

    const techMap = new Map((techs || []).map((t) => [t.id, t]));
    return favorites.map((f) => ({ ...f, technician: techMap.get(f.technician_id) || null }));
}

export const favoriteService = {
    // CREATE — guarda un técnico como favorito, con nota personal opcional
    async addFavorite(technicianId, note = null) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Debes iniciar sesión para guardar favoritos.');

        const { data, error } = await supabase
            .from('favorites')
            .insert([{ client_id: user.id, technician_id: technicianId, note }])
            .select('id, note, created_at, technician_id')
            .single();

        if (error) throw error;

        const [enriched] = await attachTechnicianData([data]);
        return enriched;
    },

    // READ — lista completa de favoritos del cliente autenticado
    async getMyFavorites() {
        const { data, error } = await supabase
            .from('favorites')
            .select('id, note, created_at, technician_id')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return attachTechnicianData(data);
    },

    // READ (liviano) — solo los IDs de técnicos favoritos, para pintar
    // el corazón activo en Explorar/Perfil sin traer todo el detalle.
    async getFavoriteTechnicianIds() {
        const { data, error } = await supabase
            .from('favorites')
            .select('technician_id');

        if (error) throw error;
        return (data || []).map((row) => row.technician_id);
    },

    // UPDATE — edita la nota personal de un favorito ya guardado
    async updateNote(favoriteId, note) {
        const { data, error } = await supabase
            .from('favorites')
            .update({ note })
            .eq('id', favoriteId)
            .select('id, note, created_at, technician_id')
            .single();

        if (error) throw error;

        const [enriched] = await attachTechnicianData([data]);
        return enriched;
    },

    // DELETE — quita un favorito por su propio id (usado en la lista)
    async removeFavorite(favoriteId) {
        const { error } = await supabase
            .from('favorites')
            .delete()
            .eq('id', favoriteId);

        if (error) throw error;
    },

    // DELETE — quita un favorito por technician_id (usado en el corazón
    // de Explorar/Perfil del técnico, donde no se tiene el favorite.id a mano)
    async removeFavoriteByTechnician(technicianId) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Debes iniciar sesión.');

        const { error } = await supabase
            .from('favorites')
            .delete()
            .eq('client_id', user.id)
            .eq('technician_id', technicianId);

        if (error) throw error;
    },
};
