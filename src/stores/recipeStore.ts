import type { SupabaseClient } from "@supabase/supabase-js"
import { writable } from "svelte/store"

export const recipesStore = writable<Recipe[]>([])

const defaultNewRecipe: Recipe = {
	name: "",
	mealType: "",
	cuisine: "",
	description: "",
	instructions: "",
	servingSize: null,
	ingredients: [{ item: "", quantity: "", acquired: false }],
	rating: null,
	order: null
}

export const newRecipe = writable<Recipe>(defaultNewRecipe)

export function getDefaultNewRecipe() {
	return {
		name: "",
		mealType: "",
		cuisine: "",
		description: "",
		instructions: "",
		servingSize: null,
		ingredients: [{ item: "", quantity: "", acquired: false }],
		rating: null,
		order: null
	}
}

function serializeRecipe(recipe: Recipe): Recipe | null {
	try {
		return {
			...recipe,
			ingredients: JSON.stringify(recipe.ingredients)
		}
	} catch (error) {
		console.error("Error serializing recipe: ", error)
		return null
	}
}

function deserializeRecipe(recipe: Recipe): Recipe | null {
	try {
		return {
			...recipe,
			ingredients: JSON.parse(recipe.ingredients)
		}
	} catch (error) {
		console.error("Error deserializing recipe: ", error)
		return null
	}
}

function updateRecipeHelper(recipe: Recipe) {
	recipesStore.update((cr) => {
		const index = cr.findIndex((r) => r.id === recipe.id)
		if (index === -1) {
			cr = [...cr, recipe]
		} else {
			cr[index] = recipe
		}
		return cr
	})
}

function deleteRecipeHelper(recipe: Recipe) {
	try {
		recipesStore.update((cr) => {
			return cr.filter((r) => r.id !== recipe.id)
		})
		console.log("Recipe deleted: ", recipe)
		return
	} catch (error) {
		console.log("Failed to delete recipe", error)
		return null
	}
}

export async function addRecipe(supabaseClient: SupabaseClient, newRecipe: Recipe) {
	const response = await supabaseClient
		.from("recipes")
		.insert(serializeRecipe(newRecipe))
		.select()
	const { data, error } = response
	if (error) {
		console.error("Error adding recipe: ", error)
		throw error
	}
	if (data) {
		const returnedRecipe = deserializeRecipe(data[0])
		if (returnedRecipe) updateRecipeHelper(returnedRecipe)
		console.log("New recipe inserted: ", returnedRecipe)
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
	const { data, error } = response
	if (error) {
		console.error("Error updating recipe: ", error)
		throw error
	}
	if (data) {
		const returnedRecipe = deserializeRecipe(data[0])
		if (returnedRecipe) updateRecipeHelper(returnedRecipe)
		console.log("Recipe updated: ", returnedRecipe)
	}
}

export async function deleteRecipe(supabaseClient: SupabaseClient, deletedRecipe: Recipe) {
	const { data, error } = await supabaseClient
		.from("recipes")
		.delete()
		.match({
			id: deletedRecipe.id
		})
		.select()
	if (error) {
		console.error("Error deleting recipe: ", error)
		throw error
	}
	if (data) {
		deleteRecipeHelper(deletedRecipe)
	}
}
