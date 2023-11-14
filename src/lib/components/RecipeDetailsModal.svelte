<script lang="ts">
	import type { SupabaseClient } from "@supabase/supabase-js"
	import { Button, Checkbox, Modal } from "flowbite-svelte"
	import { deleteRecipe, updateRecipe } from "../../stores/recipeStore"

    export let showRecipeDetails: boolean
    export let supabase: SupabaseClient
    export let selectedRecipe: Recipe
    
    function updateHandler () {
        if(selectedRecipe) {
            updateRecipe(supabase, selectedRecipe)
        } else {
            console.log("selectedRecipe is null")
        }
    }

    async function deleteHandler () {
        if (selectedRecipe) {
            await deleteRecipe(supabase, selectedRecipe)
            showRecipeDetails = false
        } else {
            console.log("selectedRecipe is null");
        }
    }
</script>

<Modal bind:open={showRecipeDetails} class="min-w-full" outsideclose>
    <div class="border-b-2 border-slate-300 pb-2">
        <h1 class="text-xl font-bold text-gray-700">{selectedRecipe?.name}</h1>
    </div>
    <dl class="grid grid-cols-3 gap-4 text-gray-700">
        <dt class="font-semibold mt-4">Meal type</dt>
        <dd class="row-start-2">{selectedRecipe?.mealType}</dd>
        <dt class="font-semibold mt-4">Cuisine</dt>
        <dd class="row-start-2">{selectedRecipe?.cuisine}</dd>
        <dt class="font-semibold mt-4">Rating</dt>
        <dd class="row-start-2">{selectedRecipe?.rating || "None"}</dd>
    </dl>
    <dl class="grid grid-cols-1 gap-4 text-gray-700 ">
        <!-- Discover how to make these dd fields rich text -->
        <dt class="font-semibold mt-4 border-t-2 border-slate-300 pt-4">Description</dt>
        <dd class="">{selectedRecipe?.description}</dd>
        <dt class="font-semibold mt-4">Instructions</dt>
        <dd class="">{selectedRecipe?.instructions}</dd>
    </dl>
    <div class="">
        <h1 class="font-semibold text-gray-700 mt-4 border-t-2 border-slate-300 pt-4">Ingredients</h1>
    </div>
    <dl class="grid grid-cols-3 gap-4 text-gray-700">
        <dt class="font-semibold">Item</dt>
        <dt class="font-semibold">Quantity</dt>
        <dt class="font-semibold">Acquired</dt>
        {#each selectedRecipe?.ingredients as ingredient}
            <dd class="">{ingredient.item}</dd>
            <dd class="">{ingredient.quantity}</dd>
            <Checkbox bind:checked={ingredient.acquired} on:change={updateHandler}/>
        {/each}
    </dl>
    <dl class="my-4 border-t-2 border-slate-300 pt-4" >
        <Button color='red' 
        on:click={deleteHandler}
        >Delete recipe</Button>
    </dl>
    
</Modal>