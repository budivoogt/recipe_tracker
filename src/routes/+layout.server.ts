import type { LayoutServerLoad } from "./$types"

export const load: LayoutServerLoad = async ({ locals }) => {
	const { supabase, getSession } = locals
	const { session, user } = await getSession()

	let initialRecipes: Recipe[] = []

	try {
		const { data, error } = await supabase
			.from("recipes")
			.select("*")
			.order("id", { ascending: true })

		if (error) throw error

		initialRecipes = data || []
	} catch (err) {
		console.error(err)
	}

	// This is the data that will be available to the client as pageData, pulled via hooks.server.ts.
	return {
		session,
		user,
		initialRecipes
	}
}
