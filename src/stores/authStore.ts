import type { SupabaseClient, User } from "@supabase/supabase-js"
import { writable } from "svelte/store"

export const user = writable<User | null>()

export const supabaseStore = writable<SupabaseClient>()
