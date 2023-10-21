<script lang="ts">
    import Auth from '$lib/components/Auth.svelte'
    import RecipeList from '$lib/components/RecipeList.svelte'
    import { user } from '../stores/authStore'

    export let data
</script>

<main>
    <div class="flex flex-col text-justify pt-8 items-center">
        <h1 class="text-xl font-bold my-2">Flavour Saver 👩‍🍳</h1>
        <h2 class="max-w-sm my-2">Track your favourite recipes and get randomized suggestions for what to eat.</h2>
    </div>
    <div class="mx-auto mt-4">
        {#if data.session}
        <p>Hello, {data.initialUser?.email}</p>
        {/if}
        {#if $user}
        <p class="text-center">Welcome, {$user.email}</p>
        <Auth/>
        <RecipeList/>
        {:else}
        <Auth/>
        {/if}
    </div>
</main>
    
    
    
