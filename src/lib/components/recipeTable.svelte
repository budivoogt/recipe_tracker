<script lang="ts">
	import { capitalizeFirstLetter, showNewRecipe, showRecipeDetails } from "$lib/utils/recipeHelpers"
	import type { SupabaseClient } from "@supabase/supabase-js"
	import { Button, Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell, TableSearch } from "flowbite-svelte"
	import { writable } from "svelte/store"
	import { deleteAllRecipes, recipesStore, selectedRecipe } from '../../stores/recipeStore'
	import AlertModal from "./AlertModal.svelte"
	import NewRecipeModal from "./NewRecipeModal.svelte"
	import RecipeDetailsModal from "./RecipeDetailsModal.svelte"
  
  export let supabase: SupabaseClient
  $: supabase = supabase
  
  function handleRecipeClick(recipe: Recipe) {
    $selectedRecipe = recipe
    $showRecipeDetails = true
  }

  // delete recipes logic
  let showDeleteRecipesConfirmation: boolean = false

  function deleteRecipesHandler(){
      deleteAllRecipes(supabase)
      $filteredItems = []
      showDeleteRecipesConfirmation = false
  }

  // $: $recipesStore = $recipesStore

  // Search logic
  let searchTerm: string = ''
  let filteredItems = writable<Recipe[]>([])
  $: $filteredItems = $recipesStore.filter((r) => r.name.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1);

</script>

<div class="mx-auto mt-6 md:w-3/4 px-4 w-11/12">
  <div class="shadow-lg relative overflow-hidden bg-white rounded-t-md">
    <div class="flex flex-col md:flex-row items-center justify-between m-4 md:mx-4">
      <TableSearch placeholder="Search by name" bind:inputValue={searchTerm} searchClass="w-full md:w-1/2 relative" innerDivClass='relative sm:rounded-lg overflow-hidden' divClass='relative overflow-x-auto m-2 md:mx-2'/>
    <div class="flex flex-col md:flex-row items-stretch md:items-center justify-end gap-2 my-2 md:mx-2">
        <Button on:click={() => (showNewRecipe.set(true))} color='green'>✚ Add recipe</Button>
        <Button>🔍 Filter</Button>
        <Button on:click={() => showDeleteRecipesConfirmation = true} color='red'>☠️ Delete recipes</Button>
    </div>
  </div>
  <Table hoverable shadow divClass='overflow-x-auto'>
    <TableHead class=" bg-orange-400 font-bold text-md">
      <TableHeadCell>Recipe name</TableHeadCell>
      <TableHeadCell>Meal Type</TableHeadCell>
      <TableHeadCell>Cuisine</TableHeadCell>
      <TableHeadCell>Rating</TableHeadCell>
        </TableHead>
        <TableBody tableBodyClass=''>
          <!-- {#each $recipesStore as recipe} -->
          {#each $filteredItems as recipe}
            <TableBodyRow on:click={() => {handleRecipeClick(recipe)}}>
                <TableBodyCell>{recipe.name}</TableBodyCell>
                <TableBodyCell>{capitalizeFirstLetter(recipe.mealType)}</TableBodyCell>
                <TableBodyCell>{recipe.cuisine}</TableBodyCell>
                <TableBodyCell>
                  {#each [1, 2, 3, 4, 5] as num}
                    {#if recipe.rating}
                      {recipe.rating >= num ? '⭐' : '☆'}
                    {:else}
                    <!-- Intentionally empty -->
                    {/if}
                  {/each}
                </TableBodyCell>
            </TableBodyRow>
          {/each}
        </TableBody>
  </Table>
  </div>
</div>
      
<NewRecipeModal {supabase} />
<RecipeDetailsModal {supabase} />
<AlertModal
    showModal = {showDeleteRecipesConfirmation}
    title = "You're about to delete all recipes"
    message = "Are you sure you want to proceed? This is irreversible."
    confirmButtonText = "Yes 💣"
    cancelButtonText = "No"
    confirmHandler = {deleteRecipesHandler}
    cancelHandler = {() => showDeleteRecipesConfirmation = false}
    closeHandler = {() => showDeleteRecipesConfirmation = false}
/>