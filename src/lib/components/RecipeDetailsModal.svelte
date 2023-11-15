<script lang="ts">
	import { showRecipeDetails } from "$lib/utils/recipeModals"
	import type { SupabaseClient } from "@supabase/supabase-js"
	import { Button, Checkbox, Modal } from "flowbite-svelte"
	import { deleteRecipe, selectedRecipe, updateRecipe } from "../../stores/recipeStore"

    export let supabase: SupabaseClient

    $: localSelectedRecipe = $selectedRecipe
    
    function updateHandler () {
        if(localSelectedRecipe) {
            updateRecipe(supabase, localSelectedRecipe)
        } else {
            console.log("selectedRecipe is null")
        }
    }

    async function deleteHandler () {
        if (localSelectedRecipe) {
            await deleteRecipe(supabase, localSelectedRecipe)
            showRecipeDetails.set(false)
        } else {
            console.log("selectedRecipe is null");
        }
    }
</script>

<Modal bind:open={$showRecipeDetails} class="min-w-full" outsideclose>
    <div class="border-b-2 border-slate-300 pb-2">
        <h1 class="text-xl font-bold text-gray-700">{localSelectedRecipe?.name}</h1>
    </div>
    <dl class="grid grid-cols-3 gap-4 text-gray-700">
        <dt class="font-semibold mt-4">Meal type</dt>
        <dd class="row-start-2">{localSelectedRecipe?.mealType}</dd>
        <dt class="font-semibold mt-4">Cuisine</dt>
        <dd class="row-start-2">{localSelectedRecipe?.cuisine}</dd>
        <dt class="font-semibold mt-4">Rating</dt>
        <dd class="row-start-2">{localSelectedRecipe?.rating || "None"}</dd>
    </dl>
    <dl class="grid grid-cols-1 gap-4 text-gray-700 ">
        <!-- Discover how to make these dd fields rich text -->
        <dt class="font-semibold mt-4 border-t-2 border-slate-300 pt-4">Description</dt>
        <dd class="">{localSelectedRecipe?.description}</dd>
        <dt class="font-semibold mt-4">Instructions</dt>
        <dd class="">{localSelectedRecipe?.instructions}</dd>
    </dl>
    <div class="">
        <h1 class="font-semibold text-gray-700 mt-4 border-t-2 border-slate-300 pt-4">Ingredients</h1>
    </div>
    <dl class="grid grid-cols-3 gap-4 text-gray-700">
        <dt class="font-semibold">Item</dt>
        <dt class="font-semibold">Quantity</dt>
        <dt class="font-semibold">Acquired</dt>
        {#each localSelectedRecipe?.ingredients as ingredient}
            <dd class="">{ingredient.item}</dd>
            <dd class="">{ingredient.quantity}</dd>
            <Checkbox bind:checked={ingredient.acquired} on:change={updateHandler}/>
        {/each}
    </dl>
    <div class="flex flex-row my-4 border-t-2 border-slate-300 pt-4 gap-4" >
        <Button color='green' 
        >Edit recipe</Button>
        <Button color='red' 
        on:click={deleteHandler}
        >Delete recipe</Button>
    </div>
    
</Modal>
<!-- <EditRecipeModal {supabase} /> -->