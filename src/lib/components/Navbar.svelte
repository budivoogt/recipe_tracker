<script lang="ts">
    import { page } from "$app/stores"
    import { Button } from "flowbite-svelte"
    import handleSignOut from "./Auth.svelte"

    $: isActive = (path: string) => $page.url.pathname === path ? 'bg-orange-400' : ""

</script>

<nav class="flex flex-row justify-center gap-2 mt-4">
    <Button size="sm" href="/" class={`shadow ${isActive('/')}`}>Home</Button>
    <Button size="sm" href="/browse" class={`shadow ${isActive('/browse')}`}>Browse recipes</Button>
    <Button size="sm" href="/about" class={`shadow ${isActive('/about')}`}>About</Button>
    <!-- Make this conditional based on whether a user's logged in or not.-->
    <Button size="sm" class="shadow" on:click="{handleSignOut}">Logout</Button>
</nav>