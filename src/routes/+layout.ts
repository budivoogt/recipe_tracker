import { PUBLIC_SUPABASE_ANON_KEY, PUBLIC_SUPABASE_URL } from "$env/static/public"
import { createBrowserClient, isBrowser, parse } from "@supabase/ssr"
import type { User } from "@supabase/supabase-js"
import { user } from "../stores/authStore.js"
import { recipesStore } from "../stores/recipeStore.js"

export const load = async ({ fetch, data, depends }) => {
	recipesStore.set(data.initialRecipes)
	if (data.initialRecipes.length > 0)
		console.log("Loaded initialRecipes from client: ", data.initialRecipes)

	depends("supabase:auth")

	const supabase = createBrowserClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
		global: {
			fetch
		},
		cookies: {
			get(key) {
				if (!isBrowser()) {
					return JSON.stringify(data.session)
				}

				const cookie = parse(document.cookie)
				return cookie[key]
			}
		}
	})

	// const supabase = createSupabaseLoadClient<Database>({
	// 	supabaseUrl: PUBLIC_SUPABASE_URL,
	// 	supabaseKey: PUBLIC_SUPABASE_ANON_KEY,
	// 	event: { fetch },
	// 	serverSession: data.session
	// })

	const {
		data: { session }
	} = await supabase.auth.getSession()

	const initialUser: User | null = session?.user ?? null
	user.set(initialUser)

	return { supabase, session, initialUser }
}
