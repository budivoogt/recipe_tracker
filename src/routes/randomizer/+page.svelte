<script lang="ts">
	import { generateRandomRecipes, mealTypes, showRecipeDetails } from "$lib/utils/recipeHelpers.js"
	import { Button, Label, Select } from "flowbite-svelte"
	import RecipeDetailsModal from "../../lib/components/RecipeDetailsModal.svelte"
	import { selectedRecipe } from "../../stores/recipeStore.js"

	    
    export let data
    let { supabase } = data
    $: ({ supabase } = data)

    let mealTypeChoice: string
    let generatedRecipes: Recipe[] | null
    let generatorPressed: boolean = false

    function handleSubmit () {
        generatedRecipes = generateRandomRecipes(mealTypeChoice)
        generatorPressed = true
    }

    function handleRecipeClick(recipe: Recipe) {
        $selectedRecipe = recipe
        $showRecipeDetails = true
        console.log("handleRecipeClick clicked with recipe: ", recipe);
        
  }
		
</script>

<h1 class="text-2xl text-center mt-6">Get meal inspiration 🎲</h1>

<div class="mt-6 text-center w-1/4 mx-auto">
    <span>
        Not sure what to eat? Our randomizer will suggest 2 recipes, preferably from unique cuisines. Start below.
    </span>
</div>

<div class="mt-6 w-1/4 flex flex-col justify-center mx-auto">
    <form on:submit|preventDefault={handleSubmit}>
        <div>
            <Label for="mealType" class="mb-2 text-lg flex flex-col items-center ">Meal type
                <Select class="mt-2 hover:bg-slate-200 border-slate-400" items={mealTypes} bind:value={mealTypeChoice} required />
            </Label>
      </div>
      <div class="mt-4 flex justify-center">
        <Button type="submit">Generate! 🎲🍜</Button>
      </div>
    </form>
</div>

<div class="mt-6 gap-4 flex flex-col items-center">
    {#if generatorPressed}
        {#if generatedRecipes}
        <div class="text-lg">
            Your suggestions:
        </div>
        {#each generatedRecipes as recipe}
            <div class="w-1/4 bg-white border-2 border-slate-400 rounded hover:bg-slate-200">
                <button on:click={() => {handleRecipeClick(recipe)}} class="text-md p-1 font-normal w-full justify-normal">
                    {recipe.name}
                </button>
            </div>
        {/each}
        {:else}
        <div class="text-lg">
            There are no recipes for that meal type.
        </div>
        {/if}
    {/if}
</div>

<RecipeDetailsModal {supabase} />