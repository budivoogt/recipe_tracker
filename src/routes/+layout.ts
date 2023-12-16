import { PUBLIC_SUPABASE_ANON_KEY, PUBLIC_SUPABASE_URL } from "$env/static/public"
import { createBrowserClient, isBrowser, parse } from "@supabase/ssr"
import { recipesStore } from "../stores/recipeStore.js"
import type { Database } from "../types/supabase.js"
import type { LayoutLoad } from "./$types.js"

export const load: LayoutLoad = async ({ fetch, data, depends }) => {
	depends("supabase:auth")

	recipesStore.set(data.initialRecipes)

	const supabase = createBrowserClient<Database>(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
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

	const {
		data: { session }
	} = await supabase.auth.getSession()

	return { supabase, session }
}
