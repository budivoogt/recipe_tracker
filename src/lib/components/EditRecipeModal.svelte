<script lang="ts">
    import { deepCopyRecipe, mealTypes, showEditRecipe } from "$lib/utils/recipeHelpers"
    import type { SupabaseClient } from "@supabase/supabase-js"
    import { Button, Checkbox, Input, Label, Modal, Range, Select, Textarea } from "flowbite-svelte"
    import { writable } from "svelte/store"
    import { recipesStore, selectedRecipe, selectedRecipeForEditing, updateRecipe } from "../../stores/recipeStore"

    export let supabase: SupabaseClient
    $: supabase = supabase

    const handleSubmit = () => {
        editFormSubmitted = true
        $selectedRecipeForEditing.ingredients = $ingredients
        updateRecipe(supabase, $selectedRecipeForEditing)
        // trigger reactivity on the parent RecipeDetailsModal component
        $selectedRecipe = $selectedRecipeForEditing
        console.log("Form submitted with updated recipe: ", $selectedRecipeForEditing)
        $showEditRecipe = false
    };

    // Star rating logic
    $: rating = $selectedRecipeForEditing.rating || 0

    const setRating = (num: number) => {
        $selectedRecipeForEditing.rating = num
    }
    
    const handleKeyDown = (event: KeyboardEvent, num: number) => {
        if (event.key === 'Enter' || event.key === ' ') {
            setRating(num)
        }
    }
    
    // Ingredient logic
    const ingredients = writable<Ingredient[]>([])

    const addIngredient = () => {
        const newIngredient = {item: "", quantity: "", acquired: false}
        $ingredients.push(newIngredient)
        $ingredients = $ingredients.map((i) => ({...i}))
        console.log("Ingredient added. Ingredients now: ", $ingredients);
      }
      
      const removeIngredient = (index: number) => {
        let deletedIngredient = $ingredients.splice(index, (index + 1))
        $ingredients.splice(index, 1)
        $ingredients = $ingredients.map((i) => ({...i}))
        console.log("Ingredient removed: ", deletedIngredient);
    }

    // Discard & exit logic
    function discardHandler () {
        let originalRecipe: Recipe = $recipesStore.find(r => r.id === $selectedRecipeForEditing.id)
        $selectedRecipeForEditing = deepCopyRecipe(originalRecipe)
        $ingredients = $selectedRecipeForEditing.ingredients?.map((i) => ({...i}))
        showEditRecipe.set(false)
        console.log("$ingredients reset to: ", $ingredients);
        console.log("selectedRecipeForEditing reset to: ", $selectedRecipeForEditing);
    }
    let editFormSubmitted: boolean = false

    $: if (!$showEditRecipe) {
      if (!editFormSubmitted) {
        discardHandler()
      } 
      editFormSubmitted = false
    }
</script>

<Modal title="Edit recipe" bind:open={$showEditRecipe} class="min-w-full" outsideclose>
  <form on:submit|preventDefault={handleSubmit}>
    <div class="grid gap-4 mb-4 sm:grid-cols-2">
      <div>
        <Label for="name" class="mb-2">Name</Label>
        <Input type="text" id="name" placeholder="Recipe name" bind:value={$selectedRecipeForEditing.name} required />
      </div>
      <div>
        <Label for="mealType" class="mb-2">Meal type
          <Select class="mt-2" items={mealTypes} bind:value={$selectedRecipeForEditing.mealType} required />
        </Label>
      </div>
      <div>
          <Label for="cuisine" class="mb-2">Cuisine</Label>
          <Input type="text" id="cuisine" placeholder="Italian, Greek, etc." bind:value={$selectedRecipeForEditing.cuisine} required />
      </div>
      <div class="text-xl cursor-pointer flex flex-col items-center">
          <span class="text-sm font-medium block text-gray-900 dark:text-gray-300 mb-3">Rating</span>
          <div class="">
          {#each [1, 2, 3, 4, 5] as num}
              <span 
              tabindex="0"
              on:click={() => setRating(num)} 
              on:keydown={(e) => handleKeyDown(e, num)}
              aria-label={`Rate ${num} out of 5`}
              role="button">
                  {rating >= num ? '⭐' : '☆'}
              </span>
          {/each}
          </div>
      </div>
      <div class="sm:col-span-2">
        <Label for="description" class="mb-2">Description</Label>
        <Textarea id="description" placeholder="A short description of the recipe." rows="2" name="description" bind:value={$selectedRecipeForEditing.description}/>
      </div>
      <div class="sm:col-span-2">
        <Label for="instructions" class="mb-2">Instructions</Label>
        <Textarea id="instructions" placeholder="How do you prepare this recipe?" rows="4" name="instructions" bind:value={$selectedRecipeForEditing.instructions}/>
      </div>
      <div class="sm:col-span-2">
          <Label for="servingSize" class="mb-2">Serving size
            <Range id="servingSize" min="1" max="8" bind:value={$selectedRecipeForEditing.servingSize} class="my-2"/>
            <span class=" font-light italic ">Serves {$selectedRecipeForEditing.servingSize} {$selectedRecipeForEditing.servingSize === 1 ? `person` : `people`}</span>
        </Label>
      </div>
      <div class="sm:col-span-2 gap-2">
          <Label for="ingredients" class="mb-2">Ingredients</Label>
          {#each $ingredients as ingredient, index}
          <div class="flex items-center gap-2 mt-2">
              <Input type="text" placeholder="Item" bind:value={ingredient.item}/>
              <Input type="text" placeholder="Quantity" bind:value={ingredient.quantity} />
              <Checkbox bind:checked={ingredient.acquired} class="p-2"/>
              <Button on:click={() => removeIngredient(index)} size="xs" color="red">X</Button>
          </div>
          {/each}
          <Button on:click={() => addIngredient()} class="mt-3" size="sm">Add ingredient</Button>
      </div>
    </div>
    <div class="flex flex-row mt-4 border-t-2 border-slate-300 pt-4 gap-4">
      <Button type="submit" class="w-26" color='green'>
        Save changes
      </Button>
      <Button type="button" class="w-26" color='red' on:click={() => showEditRecipe.set(false)}>
        Discard changes
      </Button>
    </div>
  </form>
</Modal>