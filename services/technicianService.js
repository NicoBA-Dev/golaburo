import { supabase } from '../config/supabaseConfig';

export const technicianService = {
  // 1. Obtener lista pública de técnicos desde la vista technicians_public (RF-13)
  async getPublicTechnicians() {
    const { data, error } = await supabase
      .from('technicians_public')
      .select('*')
      .order('avg_rating', { ascending: false });

    if (error) throw error;
    return data;
  },

  // 2. Obtener categorías activas (RF-10)
  async getCategories() {
    const { data, error } = await supabase
      .from('categories')
      .select('id, name, icon')
      .order('name');
    if (error) throw error;
    return data;
  },

  // 3. Registrar o Convertirse en Técnico (RF-08)
  async registerTechnician({ categoryId, yearsExperience, bio, baseRate, coverageZones }) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Usuario no autenticado.');

    const payload = {
      profile_id: user.id,
      category_id: categoryId,
      years_experience: parseInt(yearsExperience, 10) || 1,
      bio: bio || '',
      base_rate: parseFloat(baseRate) || 0,
      coverage_zones: coverageZones || ['Cercado'],
      is_active: true,
    };

    const { data, error } = await supabase
      .from('technical_profiles')
      .upsert(payload, { onConflict: 'profile_id' })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // 4. Obtener Perfil de Técnico del usuario autenticado
  async getTechnicianProfile() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('technical_profiles')
      .select(`
        *,
        categories ( id, name ),
        profiles:profile_id ( full_name, phone, avatar_url )
      `)
      .eq('profile_id', user.id)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  // 5. Obtener Solicitudes Pendientes para el Técnico (RF-18)
  async getPendingRequests() {
    const techProfile = await this.getTechnicianProfile();
    if (!techProfile) return [];

    const { data, error } = await supabase
      .from('service_requests')
      .select(`
        *,
        client:client_id ( full_name, phone, avatar_url ),
        category:category_id ( name )
      `)
      .eq('technician_id', techProfile.id)
      .eq('status', 'pending')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  // 6. Obtener Historial de Trabajos del Técnico (RF-21)
  async getRequestsHistory() {
    const techProfile = await this.getTechnicianProfile();
    if (!techProfile) return [];

    const { data, error } = await supabase
      .from('service_requests')
      .select(`
        *,
        client:client_id ( full_name, phone, avatar_url ),
        category:category_id ( name ),
        reviews ( rating, comment )
      `)
      .eq('technician_id', techProfile.id)
      .in('status', ['accepted', 'completed', 'rejected'])
      .order('updated_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  // 7. Cambiar Estado de la Solicitud (RF-20)
  async updateRequestStatus(requestId, newStatus) {
    const { data, error } = await supabase
      .from('service_requests')
      .update({ status: newStatus })
      .eq('id', requestId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};