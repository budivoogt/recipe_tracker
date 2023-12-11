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

<svelte:head>
	<title>Randomizer</title>
	<meta name="description" content="Generate random recipe suggestions to never be without inspiration for what to eat" />
</svelte:head>

<div class="mx-auto flex w-4/5 flex-col justify-items-center sm:w-2/6">
	<h1 class="mt-6 text-center text-2xl">Get meal inspiration 🎲</h1>
	<span class="mt-6 text-justify text-lg">
		Not sure what to eat? Our randomizer will suggest 2 recipes, preferably from unique
		cuisines. Start below.
	</span>
	<form on:submit|preventDefault={handleSubmit} class="mx-auto mt-12 w-2/3">
		<Label for="mealType" class="flex flex-col items-center text-xl"
			>Meal type
			<Select
				class="mt-4 border-slate-400 hover:bg-slate-200"
				items={mealTypes}
				bind:value={mealTypeChoice}
				required
			/>
		</Label>
		<div class="mt-2 flex">
			<Button type="submit" class="w-full">Generate! 🎲🍜</Button>
		</div>
	</form>
	<div class="my-8 flex flex-col items-center gap-2 rounded-lg">
		{#if generatorPressed}
			{#if generatedRecipes}
				<div class="my-4 text-lg">And the suggested meals are:</div>
				{#each generatedRecipes as recipe}
					<div
						class=" w-2/3 rounded border-2 border-slate-400 bg-white hover:bg-slate-200 sm:w-1/2"
					>
						<button
							on:click={() => {
								handleRecipeClick(recipe)
							}}
							class="text-md w-full p-2 font-normal"
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
