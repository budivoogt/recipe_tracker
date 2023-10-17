<script>
    import { recipes } from "../../stores/recipeStore"
    import Recipe from "./Recipe.svelte"
</script>

<ul>
    {#each $recipes as recipe(recipe.id)}
        <Recipe {recipe}/>
        <li>{recipe.name}</li>
    {/each}
</ul>