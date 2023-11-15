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
