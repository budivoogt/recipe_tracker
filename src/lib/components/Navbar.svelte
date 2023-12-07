<script lang="ts">
    import { enhance } from "$app/forms"
    import { page } from "$app/stores"
    import { Button } from "flowbite-svelte"
    import { writable } from "svelte/store"
    import { user } from "../../stores/authStore"
    import AlertModal from "./AlertModal.svelte"

    // logout modal logic
    const showLogoutAlert = writable<boolean>(false)

    function triggerLogoutAlert () {
        $showLogoutAlert = true
    }

    async function handleLogout () {
        const form = document.querySelector("#logoutForm")
        form.submit()
        console.log("Logout form has been submitted");
        
    }

    // Colour button according to active path
    $: isActive = (path: string) => $page.url.pathname === path ? 'bg-orange-400' : ""
</script>

<nav class="flex flex-wrap gap-2 justify-center my-4">
    <Button size="sm" href="/" class={`shadow ${isActive('/')}`}>Home</Button>
    {#if $user}
    <Button size="sm" href="/randomizer" class={`shadow ${isActive('/randomizer')}`}>Randomizer</Button>
    <Button size="sm" href="/recipes" class={`shadow ${isActive('/recipes')}`}>Browse recipes</Button>
    {/if}
    <Button size="sm" href="/about" class={`shadow ${isActive('/about')}`}>About</Button>
    {#if $user}
    <form method="POST" action="/auth?/logout" use:enhance id="logoutForm">
        <button type="button" class="text-center font-medium focus:ring-4 focus:outline-none inline-flex items-center justify-center px-4 py-2 text-sm text-white bg-primary-700 hover:bg-primary-800 dark:bg-primary-600 dark:hover:bg-primary-700 focus:ring-primary-300 dark:focus:ring-primary-800 rounded-lg shadow" on:click={triggerLogoutAlert}>Logout</button>
    </form>
    {:else if !$user}
    <Button size="sm" class="shadow" href="/auth/login">Login</Button>
    {/if}
</nav>

<AlertModal
    showModal = {$showLogoutAlert}
    title = "You're about to log out"
    message = "Want to proceed?"
    confirmButtonText = "Logout"
    cancelButtonText = "Return"
    confirmHandler = {handleLogout}
    cancelHandler = {() => $showLogoutAlert = false}
    closeHandler = {() => $showLogoutAlert = false}

/>