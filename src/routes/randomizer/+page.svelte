<script lang="ts">
	import {
		generateRandomRecipes,
		mealTypes,
		showRecipeDetails
	} from "$lib/utils/recipeHelpers.js"
	import { Button, Label, Select } from "flowbite-svelte"
	import RecipeDetailsModal from "../../lib/components/RecipeDetailsModal.svelte"
	import { selectedRecipe } from "../../stores/recipeStore.js"

	export let data
	let { supabase } = data
	$: ({ supabase } = data)

	let mealTypeChoice: string
	let generatedRecipes: Recipe[] | null
	let generatorPressed: boolean = false

	function handleSubmit() {
		generatedRecipes = generateRandomRecipes(mealTypeChoice)
		generatorPressed = true
	}

	function handleRecipeClick(recipe: Recipe) {
		$selectedRecipe = recipe
		$showRecipeDetails = true
		console.log("handleRecipeClick clicked with recipe: ", recipe)
	}
</script>

<div class="flex flex-col w-4/5 sm:w-2/6 mx-auto justify-items-center">
	<h1 class="text-2xl text-center mt-6">Get meal inspiration 🎲</h1>
	<span class="mt-6 text-justify text-lg">
		Not sure what to eat? Our randomizer will suggest 2 recipes, preferably from unique
		cuisines. Start below.
	</span>
	<form on:submit|preventDefault={handleSubmit} class="mt-12 w-2/3 mx-auto">
		<Label for="mealType" class="text-xl flex flex-col items-center"
			>Meal type
			<Select
				class="hover:bg-slate-200 border-slate-400 mt-4"
				items={mealTypes}
				bind:value={mealTypeChoice}
				required
			/>
		</Label>
		<div class="mt-2 flex">
			<Button type="submit" class="w-full">Generate! 🎲🍜</Button>
		</div>
	</form>
	<div class="my-8 flex flex-col items-center rounded-lg gap-2">
		{#if generatorPressed}
			{#if generatedRecipes}
				<div class="text-lg my-4">And the suggested meals are:</div>
				{#each generatedRecipes as recipe}
					<div
						class=" bg-white border-2 border-slate-400 rounded hover:bg-slate-200 sm:w-1/2 w-2/3"
					>
						<button
							on:click={() => {
								handleRecipeClick(recipe)
							}}
							class="text-md p-2 font-normal w-full"
						>
							{recipe.name}
						</button>
					</div>
				{/each}
			{:else}
				<div class="text-lg">There are no recipes for that meal type.</div>
			{/if}
		{/if}
	</div>
</div>

<RecipeDetailsModal />
