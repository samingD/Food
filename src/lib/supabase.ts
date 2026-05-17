import { createClient } from "@supabase/supabase-js";

// AI Studio injects user secrets as environment variables.
// If the user hasn't added them in the Secrets menu, these will fall back to undefined.
const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL || "";
const supabaseAnonKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY || "";

// Create and export the Supabase client so it can be used anywhere in the React app
export const supabase = (supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : ({} as any);
