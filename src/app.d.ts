// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces

import { Session, SupabaseClient, type User } from "@supabase/supabase-js"
import { Database } from "./types/supabase"

declare global {
	namespace App {
		interface Locals {
			supabase: SupabaseClient<Database>
			getSession(): Promise<{ session: Session | null, initialUser: User | null }>
		}
		// interface Error {}
		interface PageData {
			session: Session | null
			initialUser: User | null
		}
		// interface Platform {}
	}
}

export {}
