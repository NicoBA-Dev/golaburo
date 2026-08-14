// Las credenciales viven en .env (no se sube al repo)
// Copia .env.example como .env y llena los valores
export const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL;
export const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;