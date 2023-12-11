<script lang="ts">
	import { Button } from "flowbite-svelte"

	// Make the Supabase data available on the page.
	export let data
</script>

<svelte:head>
	<title>Home</title>
	<meta
		name="description"
		content="Welcome to Flavour Saver, the modern recipe tracker. Save, search and get inspiration for what to eat."
	/>
</svelte:head>

<main>
	{#if data.session}
		<div class="mx-auto mt-4 flex flex-col items-center">
			<span class="text-justify text-lg">Welcome, {data.initialUser?.email}!</span>
		</div>
	{:else}
		<div class="my-4 flex flex-col items-center text-justify">
			<Button href="/auth/login" class="">Login to get started</Button>
		</div>
	{/if}
	<div class="my-6 flex flex-col items-center">
		<h1 class="text-xl font-bold">Flavour Saver 👩‍🍳</h1>
		<span class="mt-4 w-4/5 text-justify text-lg sm:w-2/6"
			>Track your favourite recipes and get randomized suggestions for what to eat. It's the
			end of repetitive meals or lack of inspiration.
		</span>
	</div>
</main>
