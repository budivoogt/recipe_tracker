<script lang="ts">
	import { generateRandomRecipes, mealTypes } from "$lib/utils/recipeHelpers.js"
	import { Button, Label, Select } from "flowbite-svelte"

	    
    export let data
    let { supabase } = data
    $: ({ supabase } = data)

    let mealTypeChoice: string
    let generatedRecipes: Recipe[]

    function handleSubmit () {
        generatedRecipes = generateRandomRecipes(mealTypeChoice)
        console.log("Form submitted. Generated recipes are: ", generatedRecipes);
    }


		
</script>

<h1 class="text-2xl text-center mt-6">Get meal inspiration 🎲</h1>

<div class="mt-6 text-center w-1/4 mx-auto">
    <span>
        Not sure what to eat? Our randomizer will suggest 2 recipes, preferably from unique cuisines. Start below 👇🏽
    </span>
</div>

<div class="mt-6 w-1/4 mx-auto">
    <form on:submit|preventDefault={handleSubmit}>
        <div>
            <Label for="mealType" class="mb-2">Meal type
                <Select class="mt-2" items={mealTypes} bind:value={mealTypeChoice} required />
            </Label>
      </div>
      <div class="justify-center">
        <Button type="submit">Generate! 🎲🍜</Button>
      </div>
    </form>
</div>

{#if generatedRecipes}
<div class="mt-6 gap-4">
    {#each generatedRecipes as recipe}
        <div class="bg-white w-1/4 rounded mx-auto">
            {recipe.name}
        </div>
    {/each}
</div>
{/if}