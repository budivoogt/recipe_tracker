import { getDefaultNewRecipe, newRecipe, recipesStore } from "../../stores/recipeStore"

export const resetNewRecipe = () => {
	newRecipe.set(getDefaultNewRecipe())
}

export const resetRecipes = () => {
	recipesStore.set([])
}

export const resetAllRecipes = () => {
	resetNewRecipe()
	resetRecipes()
	console.log("All recipes reset")
}