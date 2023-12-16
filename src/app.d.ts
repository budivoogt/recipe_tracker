// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// These types pertain to SvelteKit's APIs.

import { Session, SupabaseClient, type User } from "@supabase/supabase-js"
import { Database } from "./types/supabase"

declare global {
	namespace App {
		interface Locals {
			supabase: SupabaseClient<Database>
			getSession(): Promise<{ session: Session | null; user: User | null }>
			user: User | null
		}
		// interface Error {}
		interface PageData {
			supabase: SupabaseClient<Database>
			session: Session | null
			user: User | null
			recipes: Recipe[] | []
		}
		// interface Platform {}
	}
}

export {}
