<script lang="ts">
    import { enhance } from "$app/forms"
    import { page } from "$app/stores"
    import { Button } from "flowbite-svelte"
    import { user } from "../../stores/authStore"

    $: isActive = (path: string) => $page.url.pathname === path ? 'bg-orange-400' : ""
</script>

<nav class="flex flex-row justify-center gap-2 my-4">
    <Button size="sm" href="/" class={`shadow ${isActive('/')}`}>Home</Button>
    {#if $user}
    <Button size="sm" href="/browse" class={`shadow ${isActive('/browse')}`}>Browse recipes</Button>
    {/if}
    <Button size="sm" href="/about" class={`shadow ${isActive('/about')}`}>About</Button>
    {#if $user}
    <form method="POST" action="/auth?/logout" use:enhance>
        <button class="text-center font-medium focus:ring-4 focus:outline-none inline-flex items-center justify-center px-4 py-2 text-sm text-white bg-primary-700 hover:bg-primary-800 dark:bg-primary-600 dark:hover:bg-primary-700 focus:ring-primary-300 dark:focus:ring-primary-800 rounded-lg shadow">Logout</button>
    </form>
    {:else if !$user}
    <Button size="sm" class="shadow" href="/auth/login">Login</Button>
    {/if}
</nav>