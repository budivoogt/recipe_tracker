<script lang="ts">
    import { deleteImage, getImage, handleFileSelect, uploadImage } from "$lib/utils/imageHelper"
    import { mealTypes, showNewRecipe } from "$lib/utils/recipeHelpers"
    import { resetNewRecipe } from "$lib/utils/resetRecipes"
    import type { SupabaseClient } from "@supabase/supabase-js"
    import { Button, Checkbox, Input, Label, Modal, Range, Select, Textarea } from "flowbite-svelte"
    import { tick } from "svelte"
    import Dropzone from "svelte-file-dropzone/Dropzone.svelte"
    import { writable } from "svelte/store"
    import { v4 as uuidv4 } from "uuid"
    import { addRecipe, newRecipe } from "../../stores/recipeStore"

    export let supabase: SupabaseClient

    // servingSize logic
    let servingSizeValue = writable($newRecipe.servingSize)

    $: if (!$servingSizeValue || $servingSizeValue <= 0) {
      $servingSizeValue = 2
      $newRecipe.servingSize = 2
    }

    function updateServingSize (newValue: number) {
      servingSizeValue.set(newValue)
      $newRecipe.servingSize = newValue
    }

    const handleSubmit = () => {
        addRecipe(supabase, $newRecipe)
        console.log("Form submitted with $newRecipe: ", $newRecipe);
        resetNewRecipe()
        $showNewRecipe = false
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
    let ingredientRefs: HTMLInputElement[] = []

    const addIngredient = async () => {
        $newRecipe.ingredients?.push({item: "", quantity: "", acquired: false, id: uuidv4()})
        newRecipe.set({...$newRecipe})
        await tick()
        if ($newRecipe.ingredients) ingredientRefs[$newRecipe.ingredients.length - 1].focus()
    }

    const removeIngredient = (index: number) => {
        $newRecipe.ingredients?.splice(index, 1)
        newRecipe.set({...$newRecipe})
    }

    // Display image
    let imageUrl: string | null = null
    let imagePath: string | null = null
    let imageLoading: boolean = false

    async function dropzoneFileUploadHandler (e) {
        const { acceptedFile, rejectedFile } = handleFileSelect(e)

        try {
            imageLoading = true
            
            const response = await uploadImage(acceptedFile[0], $newRecipe.name, supabase)
    
            const { publicUrl, path } = await getImage(response?.path, supabase)
            if (publicUrl) imageUrl = publicUrl
            if (path) imagePath = path
    
            $newRecipe.imageUrl = imageUrl
        } catch (error) {
            console.error("File couldn't be uploaded ", error);
        } finally {
            imageLoading= false
        }
    }

    // Delete image

    async function deleteImageHandler () {
        const response = await deleteImage(imagePath, supabase)
          if (response) {
            imageUrl = null
            imagePath = null
          }
    }

    
</script>

<Modal title="Add recipe" bind:open={$showNewRecipe} class="min-w-full" outsideclose>
  <form on:submit|preventDefault={handleSubmit}>
    <div class="grid gap-4 mb-4 sm:grid-cols-2">
      <div class="">
        <Label for="name" class="mb-2">Name</Label>
        <Input type="text" id="name" placeholder="Recipe name" bind:value={$newRecipe.name} required />
      </div>
      <div class=" col-start-1">
        <Label for="mealType" class="mb-2">Meal type
          <Select class="mt-2" items={mealTypes} bind:value={$newRecipe.mealType} required />
        </Label>
      </div>
      <div class=" col-start-1">
          <Label for="cuisine" class="mb-2">Cuisine</Label>
          <Input type="text" id="cuisine" placeholder="Italian, Greek, etc." bind:value={$newRecipe.cuisine} required />
      </div>
      <div class="text-xl cursor-pointer flex flex-col items-center col-start-1">
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
      {#if !imageUrl}
          {#if !imageLoading}
          <Dropzone
            on:drop={dropzoneFileUploadHandler}
            accept="image/*"
            multiple={false}
            containerClasses="col-start-2 row-start-1 row-span-2 my-auto mx-auto items-center"
            maxSize={5 * 1024 * 1024}
          >
            <p class="">
              Drag and drop, or click, to upload an image.
            </p>
          </Dropzone>
          {:else}
          <div class="rounded text-lg col-start-2 row-start-1 row-span-2 my-auto mx-auto items-center">
              Loading...
              <svg stroke="currentColor" fill="none" stroke-width="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg" class="w-1/2 h-1/2 my-4 animate-spin mx-auto">
                  <path opacity="0.2" fill-rule="evenodd" clip-rule="evenodd" d="M12 19C15.866 19 19 15.866 19 12C19 8.13401 15.866 5 12 5C8.13401 5 5 8.13401 5 12C5 15.866 8.13401 19 12 19ZM12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" fill="currentColor">
                  </path>
                  <path d="M2 12C2 6.47715 6.47715 2 12 2V5C8.13401 5 5 8.13401 5 12H2Z" fill="currentColor"></path></svg>
          </div>
          {/if}
      {:else}
      <div class="col-start-2 row-start-1 row-span-4 mt-6 flex flex-col">
          <img src="{imageUrl}" alt="" class="rounded-lg aspect-4/3 object-cover"/>
          <div class="flex flex-row gap-4 mt-2 justify-center">
            <Button on:click={deleteImageHandler} color='red'>
              Delete image
            </Button>
            <Button>
              Edit image
            </Button>
          </div>
      </div>
      {/if}
      <div class="col-span-2">
        <Label for="description" class="mb-2">Description</Label>
        <Textarea id="description" placeholder="A short description of the recipe." rows="2" name="description" bind:value={$newRecipe.description}/>
      </div>
      <div class="col-span-2">
        <Label for="instructions" class="mb-2">Instructions</Label>
        <Textarea id="instructions" placeholder="How do you prepare this recipe?" rows="3" name="instructions" bind:value={$newRecipe.instructions}/>
      </div>
      <div class="col-span-2">
          <Label for="servingSize" class="mb-2">Serving size
            <Range id="servingSize" min="1" max="8" bind:value={$servingSizeValue} on:change={(e) => updateServingSize($servingSizeValue)} class="my-2"/>
            <span class=" font-light italic ">Serves {$servingSizeValue} {$servingSizeValue === 1 ? `person` : `people`}</span>
        </Label>
      </div>
      <div class="col-span-2 gap-2">
          <Label for="ingredients" class="mb-2">Ingredients</Label>
          {#each ingredients as ingredient, index (ingredient.id)}
          <div class="flex items-center gap-2 my-2">
              <input type="text" placeholder="Item" bind:value={ingredient.item} bind:this={ingredientRefs[index]} class="block w-full disabled:cursor-not-allowed disabled:opacity-50 p-2.5 focus:border-primary-500 focus:ring-primary-500 dark:focus:border-primary-500 dark:focus:ring-primary-500 bg-gray-50 text-gray-900 dark:bg-gray-600 dark:text-white dark:placeholder-gray-400 border-gray-300 dark:border-gray-500 text-sm rounded-lg "/>
              <Input type="text" placeholder="Quantity" bind:value={ingredient.quantity} />
              <Checkbox bind:checked={ingredient.acquired} class="p-2"/>
              <Button on:click={() => removeIngredient(index)} size="xs" color="red">X</Button>
          </div>
          {/each}
          <Button on:click={() => addIngredient()} class="mt-2" size="sm">Add ingredient</Button>

      </div>
    </div>
    <div class="flex flex-row mt-4 border-t-2 border-slate-300 pt-4 gap-4">
      <Button type="submit" class="w-min-max" color='green'>
        Save recipe
      </Button>
    </div>
  </form>
</Modal>