<script lang="ts">
    import { resetNewRecipe } from "$lib/utils/resetRecipes"
    import type { SupabaseClient } from "@supabase/supabase-js"
    import { Button, Checkbox, Input, Label, Modal, Select, Textarea } from "flowbite-svelte"
    import { addRecipe, newRecipe } from "../../stores/recipeStore"

    export let supabase: SupabaseClient
    export let showAddRecipe: boolean // bool passed from parent component
    
    let mealTypes = [
    { value: 'breakfast', name: 'Breakfast' },
    { value: 'lunch', name: 'Lunch' },
    { value: 'dinner', name: 'Dinner' },
    { value: 'dessert', name: 'Dessert' },
    { value: 'snack', name: 'Snack' },
    { value: 'drink', name: 'Drink' },
    ];

    const handleSubmit = () => {
        addRecipe(supabase, $newRecipe)
        console.log("Form submitted with $newRecipe: ", $newRecipe);
        resetNewRecipe()
        showAddRecipe = false
    };

    // Star rating logic
    const setRating = (num: number) => {
        $newRecipe.rating = num
    }
    
    const handleKeyDown = (event: KeyboardEvent, num: number) => {
        if (event.key === 'Enter' || event.key === ' ') {
            setRating(num)
        }
    }

    // Ingredient logic
    const addIngredient = () => {
        $newRecipe.ingredients?.push({item: "", quantity: "", acquired: false})
        newRecipe.set($newRecipe)
    }

    const removeIngredient = (index: number) => {
        $newRecipe.ingredients?.splice(index, 1)
        newRecipe.set($newRecipe)
    }
</script>

<Modal title="Add recipe" bind:open={showAddRecipe} class="min-w-full" outsideclose>
  <form on:submit|preventDefault={handleSubmit}>
    <div class="grid gap-4 mb-4 sm:grid-cols-2">
      <div>
        <Label for="name" class="mb-2">Name</Label>
        <Input type="text" id="name" placeholder="Recipe name" bind:value={$newRecipe.name} required />
      </div>
      <div>
        <Label for="mealType" class="mb-2">Meal type
          <Select class="mt-2" items={mealTypes} bind:value={$newRecipe.mealType} required />
        </Label>
      </div>
      <div>
          <Label for="cuisine" class="mb-2">Cuisine</Label>
          <Input type="text" id="cuisine" placeholder="Italian, Greek, etc." bind:value={$newRecipe.cuisine} required />
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
                  {$newRecipe.rating >= num ? '⭐' : '☆'}
              </span>
          {/each}
          </div>
      </div>
      <div class="sm:col-span-2">
        <Label for="description" class="mb-2">Description</Label>
        <Textarea id="description" placeholder="A short description of the recipe." rows="2" name="description" bind:value={$newRecipe.description}/>
      </div>
      <div class="sm:col-span-2">
        <Label for="instructions" class="mb-2">Instructions</Label>
        <Textarea id="instructions" placeholder="How do you prepare this recipe?" rows="4" name="instructions" bind:value={$newRecipe.instructions}/>
      </div>
      <div class="sm:col-span-2 gap-2">
          <Label for="ingredients" class="mb-2">Ingredients</Label>
          {#each $newRecipe.ingredients as ingredient, index}
          <div class="flex items-center gap-2 my-2">
              <Input type="text" placeholder="Item" bind:value={ingredient.item} />
              <Input type="text" placeholder="Quantity" bind:value={ingredient.quantity} />
              <Checkbox bind:checked={ingredient.acquired} class="p-2"/>
              <Button on:click={() => removeIngredient(index)} size="xs" color="red">X</Button>
          </div>
          {/each}
          <Button on:click={() => addIngredient()} class="my-4" size="sm">Add ingredient</Button>
      </div>
      <Button type="submit" class="w-52">
        <svg class="mr-1 -ml-1 w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd" /></svg>
        Add new product
      </Button>
    </div>
  </form>
</Modal>