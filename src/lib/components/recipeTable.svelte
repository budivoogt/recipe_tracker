<script lang="ts">
	import type { SupabaseClient } from "@supabase/supabase-js"
	import { Button, Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell } from "flowbite-svelte"
	import { writable } from "svelte/store"
	import { recipesStore } from '../../stores/recipeStore'
	import NewRecipeModal from "./NewRecipeModal.svelte"
	import RecipeDetailsModal from "./RecipeDetailsModal.svelte"
  
  export let supabase: SupabaseClient
  const showAddRecipe = writable<boolean>(false)
  const showRecipeDetails = writable<boolean>(false)
  const selectedRecipe = writable<Recipe | null> (null)

  function handleRecipeClick(recipe: Recipe) {
    selectedRecipe.set(recipe)
    showRecipeDetails.set(true)
  }

</script>

<div class="flex flex-row mx-auto gap-2 mt-6">
  <div class="">
    <Button on:click={() => (showAddRecipe.set(true))} color='green'>Add recipe</Button>
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
                <TableBodyCell>{recipe.mealType}</TableBodyCell>
                <TableBodyCell>{recipe.cuisine}</TableBodyCell>
                <TableBodyCell>{recipe.rating || ""}</TableBodyCell>
            </TableBodyRow>
            {/each}
        </TableBody>
  </Table>
</div>
      
<NewRecipeModal {supabase} bind:showAddRecipe={$showAddRecipe} />
<!-- Not sure whether this is the right place to add this modal -->
<RecipeDetailsModal {supabase} bind:showRecipeDetails={$showRecipeDetails} bind:selectedRecipe={$selectedRecipe}/>