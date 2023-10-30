import type { SupabaseClient } from "@supabase/supabase-js"
import { writable } from "svelte/store"

export const recipes = writable<Recipe[]>([])

export const syncWithSupabase = (supabaseClient: SupabaseClient) => {
	let currentRecipes: Recipe[] = []

	const unsubscribe = recipes.subscribe(async ($recipes) => {
		if (JSON.stringify($recipes) !== JSON.stringify(currentRecipes)) {
			const newRecipes = $recipes.filter((r) => !currentRecipes.some((cr) => r.id === cr.id))
			if (newRecipes) console.log("newRecipes: ", newRecipes)

			const deletedRecipes = currentRecipes.filter(
				(r) => !$recipes.some((cr) => r.id === cr.id)
			)
			if (deletedRecipes) console.log("deletedRecipes: ", deletedRecipes)

			const updatedRecipes = $recipes.filter((r) =>
				currentRecipes.some(
					(cr) => r.id === cr.id && JSON.stringify(r) !== JSON.stringify(cr)
				)
			)
			if (updatedRecipes) console.log("updatedRecipes: ", updatedRecipes)

			for (const newRecipe of newRecipes) {
				const serializedRecipe = {
					...newRecipe,
					ingredients: JSON.stringify(newRecipe.ingredients)
				}
				await supabaseClient.from("recipes").insert(serializedRecipe)
			}

			for (const deletedRecipe of deletedRecipes) {
				await supabaseClient.from("recipes").delete().match({
					id: deletedRecipe.id
				})
			}

			for (const updatedRecipe of updatedRecipes) {
				await supabaseClient.from("recipes").upsert(updatedRecipe).match({
					id: updatedRecipe.id
				})
			}

			currentRecipes = $recipes
		}
	})

	return () => unsubscribe()
}
