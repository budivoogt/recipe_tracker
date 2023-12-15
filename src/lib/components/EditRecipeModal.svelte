<script lang="ts">
	import { deleteImage, getImage, handleFileSelect, uploadImage } from "$lib/utils/imageHelper"
	import { deepCopyRecipe, mealTypes, showEditRecipe } from "$lib/utils/recipeHelpers"
	import type { SupabaseClient } from "@supabase/supabase-js"
	import { Button, Checkbox, Input, Label, Modal, Range, Select, Textarea } from "flowbite-svelte"
	import { getContext, tick } from "svelte"
	import Dropzone from "svelte-file-dropzone/Dropzone.svelte"
	import type { Writable } from "svelte/store"
	import { writable } from "svelte/store"
	import { v4 as uuidv4 } from "uuid"
	import {
		recipesStore,
		selectedRecipe,
		selectedRecipeForEditing,
		updateRecipe
	} from "../../stores/recipeStore"
	import AlertModal from "./AlertModal.svelte"

	const supabase: Writable<SupabaseClient> = getContext("supabase")

	const handleSubmit = () => {
		$selectedRecipeForEditing.ingredients = $ingredients
		updateRecipe($supabase, $selectedRecipeForEditing)
		// trigger reactivity on the parent RecipeDetailsModal component
		$selectedRecipe = $selectedRecipeForEditing
		// console.log("Form submitted with updated recipe: ", $selectedRecipeForEditing)
		$showEditRecipe = false
	}

	// Star rating logic
	$: rating = $selectedRecipeForEditing.rating || 0

	const setRating = (num: number) => {
		$selectedRecipeForEditing.rating = num
	}

	const handleKeyDown = (event: KeyboardEvent, num: number) => {
		if (event.key === "Enter" || event.key === " ") {
			setRating(num)
		}
	}

	// Ingredient logic
	$: ingredients = writable($selectedRecipeForEditing.ingredients || [])
	let ingredientRefs: HTMLInputElement[] = []

	const addIngredient = async () => {
		const newIngredient = { item: "", quantity: "", acquired: false, id: uuidv4() }
		$ingredients.push(newIngredient)
		$ingredients = $ingredients.map((i) => ({ ...i }))
		await tick()
		ingredientRefs[$ingredients.length - 1].focus()
	}

	const removeIngredient = (index: number) => {
		$ingredients.splice(index, 1)
		$ingredients = $ingredients.map((i) => ({ ...i }))
	}

	// Discard & exit logic
	let showDiscardAlert: boolean = false

	function discardButtonHandler() {
		showDiscardAlert = true
		$showEditRecipe = false
	}

	function discardConfirmHandler() {
		let originalRecipe: Recipe = $recipesStore.find(
			(r) => r.id === $selectedRecipeForEditing.id
		) as Recipe
		$selectedRecipeForEditing = deepCopyRecipe(originalRecipe)
		$ingredients = ($selectedRecipeForEditing.ingredients || []).map((i) => ({ ...i }))
		$showEditRecipe = false
		showDiscardAlert = false
	}

	function discardCancelHandler() {
		showDiscardAlert = false
		$showEditRecipe = true
	}

	// Display image
	let imageUrl: string | null = null
	let imagePath: string | null = null
	let imageLoading: boolean = false

	async function dropzoneFileUploadHandler(e: Event) {
		const { acceptedFile, rejectedFile } = handleFileSelect(e)

		try {
			imageLoading = true

			const response = await uploadImage(
				acceptedFile[0],
				$selectedRecipeForEditing.name,
				$supabase
			)

			const { publicUrl, path } = await getImage(response?.path, $supabase)
			if (publicUrl) imageUrl = publicUrl
			if (path) imagePath = path

			$selectedRecipeForEditing.imageUrl = imageUrl
		} catch (error) {
			console.error("File couldn't be uploaded ", error)
		} finally {
			imageLoading = false
		}
	}

	// Delete image
	async function deleteImageHandler() {
		const response = await deleteImage(imagePath, $supabase)
		if (response) {
			$selectedRecipeForEditing.imageUrl = null
			imageUrl = null
			imagePath = null
		}
	}
</script>

<Modal title="Edit recipe" bind:open={$showEditRecipe} class="min-h-full w-4/5 min-w-full md:w-3/4">
	<form on:submit|preventDefault={handleSubmit}>
		<div class="grid grid-cols-2 gap-x-4 gap-y-2">
			<div class="col-start-1">
				<Label for="name" class="mb-2">Name</Label>
				<Input
					type="text"
					id="name"
					placeholder="Recipe name"
					bind:value={$selectedRecipeForEditing.name}
					required
				/>
			</div>
			<div class="col-start-1">
				<Label for="mealType" class="mb-2"
					>Meal type
					<Select
						class="mt-2"
						items={mealTypes}
						bind:value={$selectedRecipeForEditing.mealType}
						required
					/>
				</Label>
			</div>
			<div class="col-start-1">
				<Label for="cuisine" class="mb-2">Cuisine</Label>
				<Input
					type="text"
					id="cuisine"
					placeholder="Italian, Greek, etc."
					bind:value={$selectedRecipeForEditing.cuisine}
					required
				/>
			</div>
			<div class="col-start-1 flex cursor-pointer flex-col items-center text-xl">
				<span class="mb-2 block text-sm font-medium text-gray-900 dark:text-gray-300"
					>Rating</span
				>
				<div class="">
					{#each [1, 2, 3, 4, 5] as num}
						<span
							tabindex="0"
							on:click={() => setRating(num)}
							on:keydown={(e) => handleKeyDown(e, num)}
							aria-label={`Rate ${num} out of 5`}
							role="button"
						>
							{rating >= num ? "⭐" : "☆"}
						</span>
					{/each}
				</div>
			</div>
			{#if !$selectedRecipeForEditing.imageUrl}
				{#if !imageLoading}
					<div class="col-start-2 row-span-2 row-start-1 my-auto mt-6 flex h-full">
						<Dropzone
							on:drop={dropzoneFileUploadHandler}
							accept="image/*"
							multiple={false}
							containerClasses="my-auto mx-auto items-center"
							maxSize={5 * 1024 * 1024}
						>
							<p class="">Drag and drop, or click, to upload an image.</p>
						</Dropzone>
					</div>
				{:else}
					<div
						class="col-start-2 row-span-2 row-start-1 mx-auto my-auto items-center rounded text-lg"
					>
						Loading...
						<svg
							stroke="currentColor"
							fill="none"
							stroke-width="0"
							viewBox="0 0 24 24"
							height="1em"
							width="1em"
							xmlns="http://www.w3.org/2000/svg"
							class="mx-auto my-4 h-1/2 w-1/2 animate-spin"
						>
							<path
								opacity="0.2"
								fill-rule="evenodd"
								clip-rule="evenodd"
								d="M12 19C15.866 19 19 15.866 19 12C19 8.13401 15.866 5 12 5C8.13401 5 5 8.13401 5 12C5 15.866 8.13401 19 12 19ZM12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
								fill="currentColor"
							>
							</path>
							<path
								d="M2 12C2 6.47715 6.47715 2 12 2V5C8.13401 5 5 8.13401 5 12H2Z"
								fill="currentColor"
							></path></svg
						>
					</div>
				{/if}
			{:else}
				<div class="col-start-2 row-span-4 row-start-1 mt-6 flex flex-col">
					<img
						src={$selectedRecipeForEditing.imageUrl}
						alt=""
						class="aspect-4/3 rounded-lg object-cover"
					/>
					<div class="mt-2 flex flex-row justify-center gap-4">
						<Button on:click={deleteImageHandler} color="red">Delete image</Button>
					</div>
				</div>
			{/if}
			<div class="col-span-2">
				<Label for="description" class="mb-2">Description</Label>
				<Textarea
					id="description"
					placeholder="A short description of the recipe."
					rows="1"
					name="description"
					bind:value={$selectedRecipeForEditing.description}
				/>
			</div>
			<div class="col-span-2">
				<Label for="instructions" class="mb-2">Instructions</Label>
				<Textarea
					id="instructions"
					placeholder="How do you prepare this recipe?"
					rows="3"
					name="instructions"
					bind:value={$selectedRecipeForEditing.instructions}
				/>
			</div>
			<div class="col-span-2">
				<Label for="servingSize" class="mb-2"
					>Serving size
					<Range
						id="servingSize"
						min="1"
						max="8"
						bind:value={$selectedRecipeForEditing.servingSize}
						class="my-2"
					/>
					<span class=" font-light italic"
						>Serves {$selectedRecipeForEditing.servingSize}
						{$selectedRecipeForEditing.servingSize === 1 ? `person` : `people`}</span
					>
				</Label>
			</div>
			<div class="col-span-2 gap-2">
				<Label for="ingredients" class="mb-2">Ingredients</Label>
				{#each $ingredients as ingredient, index (ingredient.id)}
					<div class="mt-2 flex items-center gap-2">
						<input
							type="text"
							placeholder="Item"
							bind:value={ingredient.item}
							bind:this={ingredientRefs[index]}
							class="block w-full rounded-lg border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-500 dark:bg-gray-600 dark:text-white dark:placeholder-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
						/>
						<Input
							type="text"
							placeholder="Quantity"
							bind:value={ingredient.quantity}
						/>
						<Checkbox bind:checked={ingredient.acquired} class="p-2" />
						<Button on:click={() => removeIngredient(index)} size="xs" color="red"
							>X</Button
						>
					</div>
				{/each}
				<Button on:click={() => addIngredient()} class="mt-3" size="sm"
					>Add ingredient</Button
				>
			</div>
		</div>
		<div class="mt-4 flex flex-row gap-4 border-t-2 border-slate-300 pt-4">
			<Button type="submit" class="w-26" color="green">Save changes</Button>
			<Button type="button" class="w-26" color="red" on:click={discardButtonHandler}>
				Discard changes
			</Button>
		</div>
	</form>
</Modal>

<AlertModal
	showModal={showDiscardAlert}
	title="Discard changes"
	message="Are you sure you want to discard all unsaved changes?"
	confirmButtonText="Discard 💣"
	cancelButtonText="Return"
	confirmHandler={discardConfirmHandler}
	cancelHandler={discardCancelHandler}
/>
