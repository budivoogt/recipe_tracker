<script lang="ts">
	import { capitalizeFirstLetter, showNewRecipe, showRecipeDetails } from "$lib/utils/recipeHelpers"
	import type { SupabaseClient } from "@supabase/supabase-js"
	import { Button, Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell, TableSearch } from "flowbite-svelte"
	import { deleteAllRecipes, recipesStore, selectedRecipe } from '../../stores/recipeStore'
	import NewRecipeModal from "./NewRecipeModal.svelte"
	import Recipe from "./Recipe.svelte"
	import RecipeDetailsModal from "./RecipeDetailsModal.svelte"
  
  export let supabase: SupabaseClient
  $: supabase = supabase
  
  function handleRecipeClick(recipe: Recipe) {
    selectedRecipe.set(recipe)
    showRecipeDetails.set(true)
  }
</script>

<div class="mx-auto m-6 md:w-3/4 w-4/5">
  <div class="shadow-lg relative overflow-hidden bg-white rounded-t-md">
    <div class="flex flex-col md:flex-row items-center justify-between m-4 md:mx-4">
      <TableSearch placeholder="Search" searchClass="w-full md:w-1/2 relative" innerDivClass='relative sm:rounded-lg overflow-hidden' divClass='relative overflow-x-auto m-2 md:mx-2'/>
    <div class="flex flex-col md:flex-row items-stretch md:items-center justify-end gap-2 my-2 md:mx-2">
        <Button on:click={() => (showNewRecipe.set(true))} color='green'>✚ Add recipe</Button>
        <Button>🔍 Filter</Button>
        <Button on:click={() => deleteAllRecipes(supabase)} color='red'>☠️ Reset recipes</Button>
    </div>
  </div>
  <Table hoverable shadow divClass=''>
    <TableHead class=" bg-orange-400 font-bold text-md">
      <TableHeadCell>Recipe</TableHeadCell>
      <TableHeadCell>Meal Type</TableHeadCell>
      <TableHeadCell>Cuisine</TableHeadCell>
      <TableHeadCell>Rating</TableHeadCell>
        </TableHead>
        <TableBody tableBodyClass=''>
          {#each $recipesStore as recipe}
            <TableBodyRow on:click={() => {handleRecipeClick(recipe)}}>
                <TableBodyCell>{recipe.name}</TableBodyCell>
                <TableBodyCell>{capitalizeFirstLetter(recipe.mealType)}</TableBodyCell>
                <TableBodyCell>{recipe.cuisine}</TableBodyCell>
                <TableBodyCell>{recipe.rating || ""}</TableBodyCell>
            </TableBodyRow>
          {/each}
        </TableBody>
  </Table>
  </div>
</div>
      
<NewRecipeModal {supabase} />
<RecipeDetailsModal {supabase} />