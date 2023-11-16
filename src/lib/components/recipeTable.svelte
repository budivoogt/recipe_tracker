<script lang="ts">
	import { capitalizeFirstLetter, showNewRecipe, showRecipeDetails } from "$lib/utils/recipeHelpers"
	import type { SupabaseClient } from "@supabase/supabase-js"
	import { Button, Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell } from "flowbite-svelte"
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

<div class="flex flex-row mx-auto gap-2 mt-6">
  <div class="">
    <Button on:click={() => (showNewRecipe.set(true))} color='green'>Add recipe</Button>
  </div>
  <div class="">
    <Button on:click={() => deleteAllRecipes(supabase)} color='red'>Reset all recipes</Button>
  </div>
</div>

<div class="m-8">
  <Table hoverable shadow>
    <TableHead class=" bg-orange-400 font-bold text-md  shadow">
      <TableHeadCell>Recipe</TableHeadCell>
      <TableHeadCell>Meal Type</TableHeadCell>
      <TableHeadCell>Cuisine</TableHeadCell>
      <TableHeadCell>Rating</TableHeadCell>
        </TableHead>
        <TableBody>
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
      
<NewRecipeModal {supabase} />
<RecipeDetailsModal {supabase} />