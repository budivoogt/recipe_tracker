<script lang="ts">
	import Auth from "$lib/components/Auth.svelte"
	import type { LayoutServerData } from "../$types.js"

	export let data: LayoutServerData
	$: ({ user } = data)
</script>

<div class="">
	{#if user}
		<div class="my-6 text-center">
			<h1 class="my-4 text-xl font-bold">Welcome</h1>
			<p>You are logged in as {user.email}</p>
		</div>
	{:else}
		<Auth />
	{/if}
</div>
