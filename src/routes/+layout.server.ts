import type { LayoutServerLoad } from "./$types"

export const load: LayoutServerLoad = async ({ locals }) => {
	const { supabase, getSession } = locals
	const { session, user } = await getSession()

	let initialRecipes: Recipe[] = []
	let deserializedRecipes: Recipe[] = []

	try {
		const { data, error } = await supabase
			.from("recipes")
			.select("*")
			.order("id", { ascending: true })

		console.log("Reading 'recipes' Supabase db; data: ", data, "Error: ", error)

		// Supabase returns the ingredients as a stringified JSON array, so we need to parse it.
		if (data) {
			deserializedRecipes = data.map((recipe) => ({
				...recipe,
				ingredients: JSON.parse(recipe.ingredients)
			}))
		}

		if (error) throw error

		initialRecipes = deserializedRecipes || []
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
