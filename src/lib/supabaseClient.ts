import { createClient } from "@supabase/supabase-js"
import type { Database } from "../types/supabase"

const supabaseUrl = import.meta.env.VITE_PUBLIC_SUPABASE_URL

const supabaseAnonKey = import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY

export const supabaseClient = createClient<Database>(supabaseUrl, supabaseAnonKey)
