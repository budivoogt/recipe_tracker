<script lang="ts">
	import { Button, Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell } from "flowbite-svelte"
	import { recipes } from '../../stores/recipeStore'

    $: console.log("recipeTable.svelte recipes: ", $recipes)
</script>

<h1 class="text-2xl text-center mt-6">Browse recipes</h1>
<Button class="w-1/6 mx-auto mt-6">Add recipe</Button>
<div class="m-8">
    <Table color="red" hoverable shadow>
        <TableHead>
            <TableHeadCell>Recipe</TableHeadCell>
            <TableHeadCell>Meal Type</TableHeadCell>
            <TableHeadCell>Cuisine</TableHeadCell>
            <TableHeadCell>Rating</TableHeadCell>
        </TableHead>
        <TableBody>
            {#each $recipes as recipe}
                <TableBodyRow>
                    <TableBodyCell>{recipe.name}</TableBodyCell>
                    <TableBodyCell>{recipe.mealType}</TableBodyCell>
                    <TableBodyCell>{recipe.cuisine}</TableBodyCell>
                    <TableBodyCell>{recipe.rating}</TableBodyCell>
                </TableBodyRow>
            {/each}
        </TableBody>
    </Table>
</div>