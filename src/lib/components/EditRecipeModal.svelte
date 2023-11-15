<script lang="ts">
    import type { SupabaseClient } from "@supabase/supabase-js";
    import { Modal, Label, Input, Range, Textarea, Button, Select, Checkbox } from "flowbite-svelte";
    import { mealTypes } from "$lib/utils/recipeModals";
    import { writable } from "svelte/store";
    import { selectedRecipe } from "../../stores/recipeStore";
    import { showEditRecipe } from "$lib/utils/recipeModals";

    export let supabase: SupabaseClient

    $: localSelectedRecipe = $selectedRecipe

    // servingSize logic
    const servingSizeValue = writable(selectedRecipe.servingSize || 2)

    function updateServingSize (newValue: number) {
      servingSizeValue.set(newValue)
      $newRecipe.servingSize = newValue
    }

    const handleSubmit = () => {
        addRecipe(supabase, $newRecipe)
        console.log("Form submitted with $newRecipe: ", $newRecipe);
        resetNewRecipe()
        showAddRecipe = false
    };

    // Star rating logic
    $: rating = $newRecipe.rating || 0

    const setRating = (num: number) => {
        $newRecipe.rating = num
    }
    
    const handleKeyDown = (event: KeyboardEvent, num: number) => {
        if (event.key === 'Enter' || event.key === ' ') {
            setRating(num)
        }
    }

    // Ingredient logic
    $: ingredients = $newRecipe.ingredients || []

    const addIngredient = () => {
        $newRecipe.ingredients?.push({item: "", quantity: "", acquired: false})
        newRecipe.set($newRecipe)
    }

    const removeIngredient = (index: number) => {
        $newRecipe.ingredients?.splice(index, 1)
        newRecipe.set($newRecipe)
    }
</script>

<Modal title="Add recipe" bind:open={$showEditRecipe} class="min-w-full" outsideclose>
  <form on:submit|preventDefault={handleSubmit}>
    <div class="grid gap-4 mb-4 sm:grid-cols-2">
      <div>
        <Label for="name" class="mb-2">Name</Label>
        <Input type="text" id="name" placeholder="Recipe name" bind:value={selectedRecipe.name} required />
      </div>
      <div>
        <Label for="mealType" class="mb-2">Meal type
          <Select class="mt-2" items={mealTypes} bind:value={selectedRecipe.mealType} required />
        </Label>
      </div>
      <div>
          <Label for="cuisine" class="mb-2">Cuisine</Label>
          <Input type="text" id="cuisine" placeholder="Italian, Greek, etc." bind:value={selectedRecipe.cuisine} required />
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
        <Textarea id="description" placeholder="A short description of the recipe." rows="2" name="description" bind:value={selectedRecipe.description}/>
      </div>
      <div class="sm:col-span-2">
        <Label for="instructions" class="mb-2">Instructions</Label>
        <Textarea id="instructions" placeholder="How do you prepare this recipe?" rows="4" name="instructions" bind:value={selectedRecipe.instructions}/>
      </div>
      <div class="sm:col-span-2">
          <Label for="servingSize" class="mb-2">Serving size
            <Range id="servingSize" min="1" max="8" bind:value={$servingSizeValue} on:change={(e) => updateServingSize($servingSizeValue)} class="my-2"/>
            <span class=" font-light italic ">Serves {$servingSizeValue} {$servingSizeValue === 1 ? `person` : `people`}</span>
        </Label>
      </div>
      <div class="sm:col-span-2 gap-2">
          <Label for="ingredients" class="mb-2">Ingredients</Label>
          {#each ingredients as ingredient, index}
          <div class="flex items-center gap-2 my-2">
              <Input type="text" placeholder="Item" bind:value={ingredient.item} />
              <Input type="text" placeholder="Quantity" bind:value={ingredient.quantity} />
              <Checkbox bind:checked={ingredient.acquired} class="p-2"/>
              <Button on:click={() => removeIngredient(index)} size="xs" color="red">X</Button>
          </div>
          {/each}
          <Button on:click={() => addIngredient()} class="my-4" size="sm" color='green'>Add ingredient</Button>
      </div>
      <Button type="submit" class="w-52">
        Save recipe
      </Button>
    </div>
  </form>
</Modal>