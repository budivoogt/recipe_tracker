import { writable } from "svelte/store"

export const mealTypes = [
	{ value: "breakfast", name: "Breakfast" },
	{ value: "lunch", name: "Lunch" },
	{ value: "dinner", name: "Dinner" },
	{ value: "dessert", name: "Dessert" },
	{ value: "snack", name: "Snack" },
	{ value: "drink", name: "Drink" }
]

// Modal display bools
export const showEditRecipe = writable<boolean>(false)
export const showRecipeDetails = writable<boolean>(false)
export const showNewRecipe = writable<boolean>(false)

export function capitalizeFirstLetter(string: string) {
	if (string) {
		return string.charAt(0).toUpperCase() + string.slice(1)
	}
}

export function deepCopyRecipe(recipe: Recipe): Recipe {
	return {
		...recipe,
		ingredients: recipe.ingredients ? recipe.ingredients?.map((i) => ({ ...i })) : null
	}
}
