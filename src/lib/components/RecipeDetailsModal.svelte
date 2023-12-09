<script lang="ts">
	import { deepCopyRecipe, showEditRecipe, showRecipeDetails } from "$lib/utils/recipeHelpers"
	import { SupabaseClient } from "@supabase/supabase-js"
	import { Button, Checkbox, Modal, Range } from "flowbite-svelte"
	import {
		deleteRecipe,
		selectedRecipe,
		selectedRecipeForEditing,
		updateRecipe,
		recipesStore
	} from "../../stores/recipeStore"
	import EditRecipeModal from "./EditRecipeModal.svelte"
	import { capitalizeFirstLetter } from "$lib/utils/recipeHelpers"
	import AlertModal from "./AlertModal.svelte"
	import { writable } from "svelte/store"
	import { getContext } from "svelte"

	$: supabase = getContext("supabase")

	function editRecipeHandler() {
		$selectedRecipeForEditing = deepCopyRecipe($selectedRecipe)
		console.log("selectedRecipeForEditing set as: ", $selectedRecipe)
		$showEditRecipe = true
		$showRecipeDetails = false
	}

	function updateHandler() {
		if ($selectedRecipe) {
			updateRecipe(supabase, $selectedRecipe)
		} else {
			console.log("selectedRecipe is null")
		}
	}

	async function deleteHandler() {
		if ($selectedRecipe) {
			await deleteRecipe(supabase, $selectedRecipe)
			$showRecipeDetails = false
			$selectedRecipe = null
			$showDeleteRecipeConfirmation = false
		} else {
			console.log("selectedRecipe is null")
		}
	}

	function firstIngredientEmpty(index: number): boolean {
		if ($selectedRecipe.ingredients[index].item.trim() !== "") {
			return true
		} else {
			return false
		}
	}

	// Del recipe modal
	export const showDeleteRecipeConfirmation = writable<boolean>(false)

	function closeAndCancelHandler() {
		$showDeleteRecipeConfirmation = false
		$showRecipeDetails = true
	}

	// Image loading
	let imageLoaded = false
	function handleImageLoad() {
		imageLoaded = true
	}
</script>

{#if $selectedRecipe}
	<Modal bind:open={$showRecipeDetails} class="w-4/5 md:w-3/4 min-w-full min-h-full" outsideclose>
		<div class="border-b-2 border-slate-300 pb-2">
			<h1 class="text-xl font-bold text-gray-700">{$selectedRecipe?.name}</h1>
		</div>
		<dl class="grid grid-cols-2 text-gray-700">
			<div class="col-start-1 grid-flow-col">
				<dt class="font-semibold">Meal type</dt>
				<dd class="row-start-2">{capitalizeFirstLetter($selectedRecipe?.mealType)}</dd>
				<dt class="font-semibold">Cuisine</dt>
				<dd class="row-start-2">{$selectedRecipe?.cuisine}</dd>
				<dt class="font-semibold">Rating</dt>
				<dd class="row-start-2">
					{#if $selectedRecipe.rating}
						{#each [1, 2, 3, 4, 5] as num}
							{$selectedRecipe.rating >= num ? "⭐" : "☆"}
						{/each}
					{:else}
						Not rated
					{/if}
				</dd>
			</div>
			{#if $selectedRecipe.imageUrl}
				<div class="col-start-2 row-start-1 row-span-3 mx-auto my-auto">
					<img
						src={$selectedRecipe.imageUrl}
						alt=""
						class="rounded-lg aspect-4/3 object-cover"
					/>
				</div>
			{/if}
		</dl>
		<dl class="grid grid-cols-1 text-gray-700">
			<!-- Discover how to make these dd fields rich text -->
			<dt class="font-semibold border-t-2 border-slate-300 pt-4">Description</dt>
			<dd class="">{$selectedRecipe?.description}</dd>
			<dt class="font-semibold mt-4">Instructions</dt>
			<dd class="">{$selectedRecipe?.instructions}</dd>
			<dt class="font-semibold mt-4">Serving size</dt>
			<dd>
				<span class=""
					>Serves {$selectedRecipe.servingSize}
					{$selectedRecipe.servingSize === 1 ? `person` : `people`}</span
				>
			</dd>
			<div class="">
				<h1 class="font-semibold text-gray-700 mt-4 border-t-2 border-slate-300 pt-4">
					Ingredients
				</h1>
			</div>
			<dl class="grid grid-cols-3 gap-4 text-gray-700">
				{#if firstIngredientEmpty}
					<dt class="font-semibold">Item</dt>
					<dt class="font-semibold">Quantity</dt>
					<dt class="font-semibold">Acquired</dt>
				{/if}
				{#each $selectedRecipe.ingredients as ingredient, index (ingredient.id)}
					{#if ingredient.item.trim() !== ""}
						<dd class="">{ingredient.item}</dd>
						<dd class="">{ingredient.quantity}</dd>
						<Checkbox bind:checked={ingredient.acquired} on:change={updateHandler} />
					{:else if firstIngredientEmpty(index)}
						<dd class="">No ingredients added yet.</dd>
					{/if}
				{/each}
			</dl>
			<div class="flex flex-row mt-4 border-t-2 border-slate-300 pt-4 gap-4">
				<Button on:click={editRecipeHandler}>Edit recipe</Button>
				<Button
					color="red"
					on:click={() => {
						$showDeleteRecipeConfirmation = true
						$showRecipeDetails = false
					}}>Delete recipe</Button
				>
			</div>
		</dl></Modal
	>
{/if}

{#if $selectedRecipeForEditing}
	<EditRecipeModal />
{/if}

<AlertModal
	showModal={$showDeleteRecipeConfirmation}
	title="You're about to delete this recipe"
	message="Are you sure you want to proceed? This is irreversible."
	confirmButtonText="Delete 💣"
	cancelButtonText="Return"
	confirmHandler={deleteHandler}
	cancelHandler={closeAndCancelHandler}
	closeHandler={closeAndCancelHandler}
/>
