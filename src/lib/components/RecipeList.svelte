<script>
    import { recipesStore } from "../../stores/recipeStore"
    import Recipe from "./Recipe.svelte"
</script>

<ul>
    {#each $recipesStore as recipe(recipe.id)}
        <Recipe {recipe}/>
        <li>{recipe.name}</li>
    {/each}
</ul>