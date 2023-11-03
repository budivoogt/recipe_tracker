import type { SupabaseClient } from "@supabase/supabase-js"
import { get, writable } from "svelte/store"

export const recipesStore = writable<Recipe[]>([])
let currentRecipes: Recipe[] = []

// This is called in +layout.svelte so via onMount so will be called upon each page load.
export const syncWithSupabase = (supabaseClient: SupabaseClient) => {
	const unsubscribe = recipesStore.subscribe(async (recipes) => {
		console.log("Supabase sync running...")

		try {
			// Compare currentRecipes with recipes store to see which are new.
			if (JSON.stringify(recipes) !== JSON.stringify(currentRecipes)) {
				const newRecipes = recipes.filter(
					(r) => !currentRecipes.some((cr) => r.id === cr.id)
				)
				if (newRecipes.length > 0) console.log("newRecipes: ", newRecipes)

				const updatedRecipes = recipes.filter((r) =>
					currentRecipes.some(
						(cr) => r.id === cr.id && JSON.stringify(r) !== JSON.stringify(cr)
					)
				)
				if (updatedRecipes.length > 0) console.log("updatedRecipes: ", updatedRecipes)

				const deletedRecipes = currentRecipes.filter(
					(r) => !recipes.some((cr) => r.id === cr.id)
				)
				if (deletedRecipes.length > 0) console.log("deletedRecipes: ", deletedRecipes)

				for (const newRecipe of newRecipes) {
					const serializedRecipe = {
						...newRecipe,
						ingredients: JSON.stringify(newRecipe.ingredients)
					}
					const { data, error } = await supabaseClient
						.from("recipes")
						.insert(serializedRecipe)
					if (error) throw error
					if (data) {
						console.log("Data inserted to Supabase: ", data)
						console.log("New serializedRecipe: ", serializedRecipe)
						const insertedRecipe = data[0]
						// Update the recipe in the store with the id from Supabase by checking whether they are identical.
						recipesStore.update((cr) => {
							return cr.map((r) => (r === newRecipe ? insertedRecipe : r))
						})
					}
				}

				for (const updatedRecipe of updatedRecipes) {
					const serializedRecipe = {
						...updatedRecipe,
						ingredients: JSON.stringify(updatedRecipe.ingredients)
					}
					const { data, error } = await supabaseClient
						.from("recipes")
						.upsert(serializedRecipe)
						.match({
							id: updatedRecipe.id
						})
					if (error) throw error
					if (data) {
						console.log("Data inserted to Supabase: ", data)
						console.log("Updated serializedRecipe: ", serializedRecipe)
						const insertedRecipe = data[0]
						// Update the recipe in the store with the id from Supabase by checking whether they are identical.
						recipesStore.update((cr) => {
							return cr.map((r) => (r === updatedRecipe ? insertedRecipe : r))
						})
					}
				}

				for (const deletedRecipe of deletedRecipes) {
					const { error } = await supabaseClient.from("recipes").delete().match({
						id: deletedRecipe.id
					})
					if (error) throw error
					console.log("deletedRecipe: ", deletedRecipe)
				}
				currentRecipes = get(recipesStore)
			}
		} catch (error) {
			console.error("Supabase sync error: ", error)
		}
	})

	return () => unsubscribe()
}
