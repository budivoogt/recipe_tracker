import { get, writable } from "svelte/store"
import { recipesStore } from "../../stores/recipeStore"

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
		ingredients: recipe.ingredients ? recipe.ingredients?.map((i) => ({ ...i })) : null,
		servingSize: recipe.servingSize ? recipe.servingSize : 2
	}
}
export function deepCopyRecipes(recipes: Recipe[]): Recipe[] {
	return recipes.map((recipe) => deepCopyRecipe(recipe))
}

export function generateRandomRecipes(mealType: string) {
	const filteredRecipes = get(recipesStore).filter((r) => r.mealType === mealType)

	// Shuffle recipes
	filteredRecipes.sort(() => 0.5 - Math.random())

	const selectedRecipes: Recipe[] = []
	const selectedCuisines = new Set()

	for (const recipe of filteredRecipes) {
		if (selectedRecipes.length >= 2) break

		// Keep adding recipes as long as they are from distinct cuisines
		if (selectedRecipes.length === 0 || !selectedCuisines.has(recipe.cuisine)) {
			selectedRecipes.push(recipe)
			selectedCuisines.add(recipe.cuisine)
		}
	}

	if (selectedRecipes.length === 1 && filteredRecipes.length > 1) {
		let additionalRecipe: Recipe

		do {
			additionalRecipe = filteredRecipes[Math.floor(Math.random() * filteredRecipes.length)]
		} while (
			selectedRecipes[0].id === additionalRecipe.id ||
			selectedCuisines.has(additionalRecipe.cuisine)
		)

		selectedRecipes.push(additionalRecipe)
	}

	return selectedRecipes
}
