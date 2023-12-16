<script lang="ts">
	import { enhance } from "$app/forms"
	import { page } from "$app/stores"
	import { Button } from "flowbite-svelte"
	import { writable } from "svelte/store"
	import AlertModal from "./AlertModal.svelte"

	// logout modal logic
	const showLogoutAlert = writable<boolean>(false)

	function triggerLogoutAlert() {
		$showLogoutAlert = true
	}

	async function handleLogout() {
		const form = document.querySelector("#logoutForm") as HTMLFormElement
		form.submit()
	}

	// Colour button according to active path
	$: isActive = (path: string) => ($page.url.pathname === path ? "bg-orange-400" : "")
</script>

<nav class="my-4 flex flex-wrap justify-center gap-2">
	<Button size="sm" href="/" class={`shadow ${isActive("/")}`}>Home</Button>
	{#if $page.data.session?.user}
		<Button size="sm" href="/randomizer" class={`shadow ${isActive("/randomizer")}`}
			>Randomizer</Button
		>
		<Button size="sm" href="/recipes" class={`shadow ${isActive("/recipes")}`}
			>Browse recipes</Button
		>
		<Button size="sm" href="/about" class={`shadow ${isActive("/about")}`}>About</Button>
		<form method="POST" action="/auth?/logout" use:enhance id="logoutForm">
			<button
				type="button"
				class="inline-flex items-center justify-center rounded-lg bg-primary-700 px-4 py-2 text-center text-sm font-medium text-white shadow hover:bg-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
				on:click={triggerLogoutAlert}>Logout</button
			>
		</form>
	{:else}
		<Button size="sm" class="shadow" href="/auth/login">Login</Button>
	{/if}
</nav>

<AlertModal
	showModal={$showLogoutAlert}
	title="You're about to log out"
	message="Want to proceed?"
	confirmButtonText="Logout"
	cancelButtonText="Return"
	confirmHandler={handleLogout}
	cancelHandler={() => ($showLogoutAlert = false)}
	closeHandler={() => ($showLogoutAlert = false)}
/>
