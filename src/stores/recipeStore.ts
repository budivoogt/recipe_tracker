import type { SupabaseClient } from "@supabase/supabase-js"
import { writable } from "svelte/store"

export const recipesStore = writable<Recipe[]>([])
// let currentRecipes: Recipe[] = []

// // This is called in +layout.svelte so via onMount so will be called upon each page load.
// export const syncWithSupabase = (supabaseClient: SupabaseClient) => {
// 	const unsubscribe = recipesStore.subscribe(async (recipes) => {
// 		try {
// 			// Compare currentRecipes with recipes store to see which are new.
// 			if (JSON.stringify(recipes) !== JSON.stringify(currentRecipes)) {
// 				const newRecipes = recipes.filter(
// 					(r) => !currentRecipes.some((cr) => r.id === cr.id)
// 				)
// 				if (newRecipes.length > 0) console.log("newRecipes: ", newRecipes)

// 				const updatedRecipes = recipes.filter((r) =>
// 					currentRecipes.some(
// 						(cr) => r.id === cr.id && JSON.stringify(r) !== JSON.stringify(cr)
// 					)
// 				)
// 				if (updatedRecipes.length > 0) console.log("updatedRecipes: ", updatedRecipes)

// 				const deletedRecipes = currentRecipes.filter(
// 					(r) => !recipes.some((cr) => r.id === cr.id)
// 				)
// 				if (deletedRecipes.length > 0) console.log("deletedRecipes: ", deletedRecipes)

// 				for (const newRecipe of newRecipes) {
// 					const serializedRecipe = {
// 						...newRecipe,
// 						ingredients: JSON.stringify(newRecipe.ingredients)
// 					}
// 					const response = await supabaseClient
// 						.from("recipes")
// 						.insert(serializedRecipe)
// 						.select()
// 					console.log("SB response upon inserting recipe: ", response)
// 					const { data, error } = response
// 					if (error) throw error
// 					if (data) {
// 						console.log("Data inserted to Supabase: ", data)
// 						console.log("New serializedRecipe: ", serializedRecipe)
// 						const insertedRecipe = data[0]
// 						// Update the recipe in the store with the id from Supabase by checking whether they are identical.
// 						recipesStore.update((cr) => {
// 							return cr.map((r) => (r === newRecipe ? insertedRecipe : r))
// 						})
// 					}
// 				}

// 				for (const updatedRecipe of updatedRecipes) {
// 					const serializedRecipe = {
// 						...updatedRecipe,
// 						ingredients: JSON.stringify(updatedRecipe.ingredients)
// 					}
// 					const { data, error } = await supabaseClient
// 						.from("recipes")
// 						.upsert(serializedRecipe)
// 						.match({
// 							id: updatedRecipe.id
// 						})
// 						.select()
// 					if (error) throw error
// 					if (data) {
// 						console.log("Data inserted to Supabase: ", data)
// 						console.log("Updated serializedRecipe: ", serializedRecipe)
// 						const insertedRecipe = data[0]
// 						// Update the recipe in the store with the id from Supabase by checking whether they are identical.
// 						recipesStore.update((cr) => {
// 							return cr.map((r) => (r === updatedRecipe ? insertedRecipe : r))
// 						})
// 					}
// 				}

// 				for (const deletedRecipe of deletedRecipes) {
// 					const { error } = await supabaseClient.from("recipes").delete().match({
// 						id: deletedRecipe.id
// 					})
// 					if (error) throw error
// 					console.log("deletedRecipe: ", deletedRecipe)
// 				}
// 				currentRecipes = [...recipes]
// 				console.log("currentRecipes updated: ", currentRecipes)
// 			}
// 		} catch (error) {
// 			console.error("Supabase sync error: ", error)
// 		}
// 	})

// 	return () => unsubscribe()
// }

function serializeRecipe(recipe: Recipe) {
	return {
		...recipe,
		ingredients: JSON.stringify(recipe.ingredients)
	}
}

export async function addRecipe(supabaseClient: SupabaseClient, newRecipe: Recipe) {
	const response = await supabaseClient
		.from("recipes")
		.insert(serializeRecipe(newRecipe))
		.select()
	console.log("SB response upon inserting recipe: ", response)
	const { data, error } = response
	if (error) {
		console.error("Error adding recipe: ", error)
		throw error
	}
	if (data) {
		const insertedRecipe = data[0]
		recipesStore.update((cr) => [...cr, insertedRecipe])
		console.log("New recipe inserted: ", insertedRecipe)
	}
}

export async function updateRecipe(supabaseClient: SupabaseClient, updatedRecipe: Recipe) {
	const response = await supabaseClient
		.from("recipes")
		.upsert(serializeRecipe(updatedRecipe))
		.match({
			id: updatedRecipe.id
		})
		.select()
	console.log("SB response upon updating recipe: ", response)
	const { data, error } = response
	if (error) {
		console.error("Error updating recipe: ", error)
		throw error
	}
	if (data) {
		const updatedRecipe = data[0]
		recipesStore.update((cr) => [...cr, updatedRecipe])
		console.log("Recipe updated: ", updatedRecipe)
	}
}

export async function deleteRecipe(supabaseClient: SupabaseClient, deletedRecipe: Recipe) {
	const { error } = await supabaseClient.from("recipes").delete().match({
		id: deletedRecipe.id
	})
	if (error) {
		console.error("Error deleting recipe: ", error)
		throw error
	}
	console.log("Recipe deleted: ", deletedRecipe)
}
