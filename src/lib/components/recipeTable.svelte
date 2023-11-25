<script lang="ts">
	import { capitalizeFirstLetter, deepCopyRecipes, mealTypes, showNewRecipe, showRecipeDetails } from "$lib/utils/recipeHelpers"
	import type { SupabaseClient } from "@supabase/supabase-js"
	import { Button, Dropdown, DropdownItem, Radio, Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell, TableSearch } from "flowbite-svelte"
	import { ChevronSortSolid } from "flowbite-svelte-icons"
	import { derived, writable } from "svelte/store"
	import { deleteAllRecipes, recipesStore, selectedRecipe } from '../../stores/recipeStore'
	import AlertModal from "./AlertModal.svelte"
	import NewRecipeModal from "./NewRecipeModal.svelte"
	import RecipeDetailsModal from "./RecipeDetailsModal.svelte"
  
  export let supabase: SupabaseClient
  $: supabase = supabase
  
  // Sorting logic
  const sortKey = writable<string>("name")
  const sortDirection = writable<number>(1)

  function sortTable (key: string) {
    if ($sortKey === key) {
      sortDirection.update(value => -value)
    } else {
      $sortKey = key
      $sortDirection = 1
    }
  }

  const sortedRecipes: Recipe[] = derived([recipesStore, sortKey, sortDirection], ([$recipesStore, $sortKey, $sortDirection]) => {
      const recipes = deepCopyRecipes($recipesStore)
      return recipes.sort((a, b) => {
        if (a[$sortKey] < b[$sortKey]) {
          return -1 * $sortDirection
        }
        if (a[$sortKey] > b[$sortKey]) {
          return 1 * $sortDirection
        }
        return 0
      })
  })

  function handleRecipeClick(recipe: Recipe) {
    $selectedRecipe = recipe
    $showRecipeDetails = true
  }

  // delete recipes logic
  let showDeleteRecipesConfirmation: boolean = false

  function deleteRecipesHandler(){
      deleteAllRecipes(supabase)
      $searchedItems = []
      showDeleteRecipesConfirmation = false
  }

  // Filter logic
  let filterOptions = {
    id: "All",
    name: "Name",
    mealType: "MealType",
    cuisine: "Cuisine",
    rating: "Rating",
  }

  let filterBy = "id"

  let ratingOptions = [1, 2, 3, 4, 5]

  let filterMealType = "All"
  let filterCuisine = "All"
  let filterRating = "All"
  let filteredItems = writable<Recipe[]>([])
  
  const uniqueCuisines = derived(recipesStore, $recipesStore => {
    const cuisines = new Set($recipesStore.map(r => r.cuisine)) // Sets are unique JS variables that only store uniques. This removes duplicates.
    return Array.from(cuisines) // Turn Set into array again.
  })

  const uniqueMealTypes = derived(recipesStore, $recipesStore => {
    const mealTypeValues = new Set($recipesStore.map(r => r.mealType))
    return Array.from(mealTypeValues).map(type => {
      const mealTypeObject = mealTypes.find(mt => mt.value === type)
      return mealTypeObject ? mealTypeObject.name : type
    })
  })

  $: $filteredItems = $sortedRecipes.filter(r => {
    return (filterMealType === "All" || r.mealType === filterMealType) &&
    (filterCuisine === "All" || r.cuisine === filterCuisine) &&
    (filterRating === "All" || r.rating >= filterRating)
  })

  // Search logic
  let searchTerm: string = ''
  let searchedItems = writable<Recipe[]>([])

  // $: $searchedItems = $sortedRecipes.filter((r) => r.name.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1);
  $: $searchedItems = $filteredItems.filter((r) => r.name.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1);

</script>

<div class="mx-auto mt-6 md:w-3/4 px-4 w-11/12">
  <div class="shadow-lg relative bg-white rounded-t-md pt-1">
    <div class="flex flex-col md:flex-row items-center justify-between m-4 md:mx-4">
      <TableSearch placeholder="Search by name" bind:inputValue={searchTerm} searchClass="w-full md:w-1/2 relative" innerDivClass='relative sm:rounded-lg' divClass='relative overflow-x-auto m-2 md:mx-2'/>
    <div class="flex flex-col md:flex-row items-stretch md:items-center justify-end gap-2 my-2 md:mx-2 overflow-visible">
        <Button on:click={() => (showNewRecipe.set(true))} color='green'>✚ Add recipe</Button>
        <Button>🔍 Filter: {filterOptions[filterBy]}</Button>
        <Dropdown class="m-4 w-fit">
            <DropdownItem>
                Meal Type
            </DropdownItem>
            <Dropdown placement="right-start">
                <DropdownItem>
                    <Radio bind:group={filterMealType} value="All">All</Radio>
                </DropdownItem>
                {#each $uniqueMealTypes as uniqueMealType}
                <DropdownItem>
                  <Radio bind:group={filterMealType} value={mealTypes.find(mt => mt.name === uniqueMealType)?.value}>{uniqueMealType}</Radio>
                </DropdownItem>
                {/each}
            </Dropdown>
            <DropdownItem>
                Cuisine
            </DropdownItem>
            <Dropdown placement="right-start">
                <DropdownItem>
                    <Radio bind:group={filterCuisine} value="All">All</Radio>
                </DropdownItem>
                {#each $uniqueCuisines as uniqueCuisine}
                <DropdownItem>
                    <Radio bind:group={filterCuisine} value={uniqueCuisine}>{uniqueCuisine}</Radio>
                </DropdownItem>
                {/each}
            </Dropdown>
            <DropdownItem>
                Rating
            </DropdownItem>
            <Dropdown placement="right-start">
              <!-- GOTTA FIX HOW THE STARS APPEAR -->
                {#each ratingOptions as rating, index}
                <DropdownItem>
                  <Radio bind:group={filterRating} value={rating}>{rating >= (index - 1) ? '⭐' : '☆'} +</Radio>
                </DropdownItem>
                {/each}
            </Dropdown>
        </Dropdown>
        <Button on:click={() => showDeleteRecipesConfirmation = true} color='red'>☠️ Delete recipes</Button>
    </div>
  </div>
  <Table hoverable shadow divClass='overflow-x-auto'>
    <TableHead class=" bg-orange-400 font-bold text-md">
      <TableHeadCell class="hover:bg-orange-500 hover:cursor-pointer flex-row" on:click={() => sortTable("name")}>Recipe name <ChevronSortSolid size='xs' class="flex flex-row my-auto ml-1"/></TableHeadCell>
      <TableHeadCell class="hover:bg-orange-500 hover:cursor-pointer" on:click={() => sortTable("mealType")}>Meal Type <ChevronSortSolid size='xs' class="flex flex-row my-auto ml-1"/></TableHeadCell>
      <TableHeadCell class="hover:bg-orange-500 hover:cursor-pointer " on:click={() => sortTable("cuisine")}>Cuisine <ChevronSortSolid size='xs' class="flex flex-row my-auto ml-1"/></TableHeadCell>
      <TableHeadCell class="hover:bg-orange-500 hover:cursor-pointer " on:click={() => sortTable("rating")}>Rating <ChevronSortSolid size='xs' class="flex flex-row my-auto ml-1"/></TableHeadCell>
        </TableHead>
        <TableBody tableBodyClass=''>
          {#each $searchedItems as recipe}
            <TableBodyRow on:click={() => {handleRecipeClick(recipe)}}>
                <TableBodyCell>{recipe.name}</TableBodyCell>
                <TableBodyCell>{capitalizeFirstLetter(recipe.mealType)}</TableBodyCell>
                <TableBodyCell>{recipe.cuisine}</TableBodyCell>
                <TableBodyCell>
                  {#each ratingOptions as num}
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