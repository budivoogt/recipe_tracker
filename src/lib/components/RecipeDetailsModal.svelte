<script lang="ts">
	import { showEditRecipe, showRecipeDetails } from "$lib/utils/recipeModals"
	import type { SupabaseClient } from "@supabase/supabase-js"
	import { Button, Checkbox, Modal, Range } from "flowbite-svelte"
	import { deleteRecipe, selectedRecipe, selectedRecipeForEditing, updateRecipe, recipesStore } from "../../stores/recipeStore"
	import EditRecipeModal from "./EditRecipeModal.svelte"
    import { capitalizeFirstLetter } from "$lib/utils/recipeModals"

    export let supabase: SupabaseClient

    function editRecipeHandler() {
        selectedRecipeForEditing.set({...$selectedRecipe})
        console.log("selectedRecipeForEditing set as: ", $selectedRecipe);
        showEditRecipe.set(true)
    }
    
    function updateHandler () {
        if($selectedRecipe) {
            updateRecipe(supabase, $selectedRecipe)
        } else {
            console.log("selectedRecipe is null")
        }
    }

    async function deleteHandler () {
        if ($selectedRecipe) {
            await deleteRecipe(supabase, $selectedRecipe)
            showRecipeDetails.set(false)
        } else {
            console.log("selectedRecipe is null");
        }
    }
</script>

<Modal bind:open={$showRecipeDetails} class="min-w-full" outsideclose>
    <div class="border-b-2 border-slate-300 pb-2">
        <h1 class="text-xl font-bold text-gray-700">{$selectedRecipe?.name}</h1>
    </div>
    <dl class="grid grid-cols-3 gap-4 text-gray-700">
        <dt class="font-semibold mt-4">Meal type</dt>
        <dd class="row-start-2">{capitalizeFirstLetter($selectedRecipe?.mealType)}</dd>
        <dt class="font-semibold mt-4">Cuisine</dt>
        <dd class="row-start-2">{$selectedRecipe?.cuisine}</dd>
        <dt class="font-semibold mt-4">Rating</dt>
        <dd class="row-start-2">{$selectedRecipe?.rating || "None"}</dd>
    </dl>
    <dl class="grid grid-cols-1 gap-4 text-gray-700 ">
        <!-- Discover how to make these dd fields rich text -->
        <dt class="font-semibold mt-4 border-t-2 border-slate-300 pt-4">Description</dt>
        <dd class="">{$selectedRecipe?.description}</dd>
        <dt class="font-semibold mt-4">Instructions</dt>
        <dd class="">{$selectedRecipe?.instructions}</dd>
        <dt class="font-semibold mt-4">Serving size</dt>
        <dd>
        <span class="">Serves {$selectedRecipe.servingSize} {$selectedRecipe.servingSize === 1 ? `person` : `people`}</span>
        </dd>
    <div class="">
        <h1 class="font-semibold text-gray-700 mt-4 border-t-2 border-slate-300 pt-4">Ingredients</h1>
    </div>
    <dl class="grid grid-cols-3 gap-4 text-gray-700">
        {#if $selectedRecipe.ingredients[0].item.trim() !== ''}
            <dt class="font-semibold">Item</dt>
            <dt class="font-semibold">Quantity</dt>
            <dt class="font-semibold">Acquired</dt>
        {/if}
        {#each $selectedRecipe.ingredients as ingredient, index}
            {#if ingredient.item.trim() !== ''}
                <dd class="">{ingredient.item}</dd>
                <dd class="">{ingredient.quantity}</dd>
                <Checkbox bind:checked={ingredient.acquired} on:change={updateHandler}/>
            {:else}
                <dd class="">No ingredients added yet.</dd>
            {/if}
        {/each}
    </dl>
    <div class="flex flex-row mt-4 border-t-2 border-slate-300 pt-4 gap-4" >
        <Button color='green'
        on:click={editRecipeHandler} 
        >Edit recipe</Button>
        <Button color='red' 
        on:click={deleteHandler}
        >Delete recipe</Button>
    </div>    
</Modal>

{#if $selectedRecipeForEditing}
<EditRecipeModal {supabase}/>
{/if}