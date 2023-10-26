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

		console.log("data: ", data, "Error: ", error)

		if (error) throw error

		initialRecipes = data || []
		console.log("Loaded initialRecipes from server: ", initialRecipes)
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
