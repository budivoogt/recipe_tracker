<script lang="ts">
    import { Button } from 'flowbite-svelte'

    // Make the Supabase client available on the page.
    export let data
    let { supabase } = data
    $: ({ supabase } = data)
</script>

<main>
    {#if data.session}
    <div class="mx-auto mt-4 flex flex-col items-center">
        <span class="text-lg text-justify">Welcome, {data.initialUser?.email}!</span>
    </div>
    {:else}
    <div class="flex flex-col text-justify my-4 items-center">
        <Button href="/auth/login" class="">Login to get started</Button>
    </div>
    {/if}
    <div class="flex flex-col items-center my-6">
        <h1 class="text-xl font-bold">Flavour Saver 👩‍🍳</h1>
        <span class="mt-4 w-4/5 sm:w-2/6 text-justify text-lg">Track your favourite recipes and get randomized suggestions for what to eat. It's the end of repetitive meals or lack of inspiration. </span>
    </div>
</main>
    
    
    
