<script lang="ts">
	import { page } from "$app/stores"
	import {
		capitalizeFirstLetter,
		deepCopyRecipe,
		showEditRecipe,
		showRecipeDetails
	} from "$lib/utils/recipeHelpers"
	import type { SupabaseClient } from "@supabase/supabase-js"
	import { Button, Checkbox, Modal } from "flowbite-svelte"
	import { writable } from "svelte/store"
	import {
		deleteRecipe,
		selectedRecipe,
		selectedRecipeForEditing,
		updateRecipe
	} from "../../stores/recipeStore"
	import AlertModal from "./AlertModal.svelte"
	import EditRecipeModal from "./EditRecipeModal.svelte"

	const supabase: SupabaseClient = $page.data.supabase

	function editRecipeHandler() {
		if ($selectedRecipe) $selectedRecipeForEditing = deepCopyRecipe($selectedRecipe)
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
		if ($selectedRecipe?.ingredients && $selectedRecipe.ingredients[index].item.trim() !== "") {
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

	// Image loading -- NEED TO FINISH THIS
	// let imageLoaded = false
	// function handleImageLoad() {
	// 	imageLoaded = true
	// }
</script>

{#if $selectedRecipe}
	<Modal bind:open={$showRecipeDetails} class="min-h-full w-4/5 min-w-full md:w-3/4" outsideclose>
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
				<div class="col-start-2 row-span-3 row-start-1 mx-auto my-auto">
					<img
						src={$selectedRecipe.imageUrl}
						alt=""
						class="aspect-4/3 rounded-lg object-cover"
					/>
				</div>
			{/if}
		</dl>
		<dl class="grid grid-cols-1 text-gray-700">
			<!-- Discover how to make these dd fields rich text -->
			<dt class="border-t-2 border-slate-300 pt-4 font-semibold">Description</dt>
			<dd class="">{$selectedRecipe?.description}</dd>
			<dt class="mt-4 font-semibold">Instructions</dt>
			<dd class="">{$selectedRecipe?.instructions}</dd>
			<dt class="mt-4 font-semibold">Serving size</dt>
			<dd>
				<span class=""
					>Serves {$selectedRecipe.servingSize}
					{$selectedRecipe.servingSize === 1 ? `person` : `people`}</span
				>
			</dd>
			<div class="">
				<h1 class="mt-4 border-t-2 border-slate-300 pt-4 font-semibold text-gray-700">
					Ingredients
				</h1>
			</div>
			<dl class="grid grid-cols-3 gap-4 text-gray-700">
				{#if firstIngredientEmpty(0)}
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
			<div class="mt-4 flex flex-row gap-4 border-t-2 border-slate-300 pt-4">
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
