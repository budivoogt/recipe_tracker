<script lang="ts">
    import RecipeList from '$lib/components/RecipeList.svelte'
    import { Button } from 'flowbite-svelte'

    export let data
</script>

<main>
    <div class="flex flex-col text-justify items-center my-6">
        <h1 class="text-xl font-bold">Flavour Saver 👩‍🍳</h1>
        <span class="mt-4 w-1/2 sm:w-2/6 text-justify text-lg">With Flavour Saver, you can track your favourite recipes and get randomized suggestions for what to eat. It's the end of repetitive meals or lack of inspiration. </span>
    </div>
    {#if data.session}
    <div class="mx-auto mt-4 flex flex-col items-center">
        <span class="text-lg text-justify italic">Welcome, {data.initialUser?.email}!</span>
    </div>
    <RecipeList/>
    {:else}
    <div class="flex flex-col text-justify my-4 items-center">
        <Button href="/auth/login" class="">Login to get started</Button>
    </div>
    {/if}
</main>
    
    
    
