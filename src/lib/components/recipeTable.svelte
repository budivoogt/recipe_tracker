<script lang="ts">
	import { resetAllRecipes } from "$lib/utils/resetRecipes"
	import type { SupabaseClient } from "@supabase/supabase-js"
	import { Button, Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell } from "flowbite-svelte"
	import { Section } from 'flowbite-svelte-blocks'
	import { writable } from "svelte/store"
	import { recipesStore } from '../../stores/recipeStore'
	import NewRecipeModal from "./NewRecipeModal.svelte"
  
  export let supabase: SupabaseClient
  const addRecipeModal = writable<boolean>(false)

</script>

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
                <TableBodyRow>
                    <TableBodyCell>{recipe.name}</TableBodyCell>
                    <TableBodyCell>{recipe.mealType}</TableBodyCell>
                    <TableBodyCell>{recipe.cuisine}</TableBodyCell>
                    <TableBodyCell>{recipe.rating || ""}</TableBodyCell>
                </TableBodyRow>
            {/each}
        </TableBody>
    </Table>
</div>

<Section classSection="h-96">
  <div class="flex justify-center m-5">
    <Button on:click={() => (addRecipeModal.set(true))}>Add recipe</Button>
  </div>
  <div class="flex justify-center m-5">
    <Button on:click={resetAllRecipes}>Reset all stores</Button>
  </div>
</Section>

<NewRecipeModal {supabase} bind:addRecipeModal={$addRecipeModal} />