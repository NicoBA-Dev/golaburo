import { supabase } from '../config/supabaseConfig';

export const categoryService = {
    // Trae todas las categorías ordenadas alfabéticamente
    async getCategories() {
        const { data, error } = await supabase
            .from('categories')
            .select('*')
            .order('name');

        if (error) throw error;
        return data;
    }
};