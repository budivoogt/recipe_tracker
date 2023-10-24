<script lang="ts">
    import Auth from '$lib/components/Auth.svelte'
    import RecipeList from '$lib/components/RecipeList.svelte'

    export let data
</script>

<main>
    <div class="flex flex-col text-justify pt-8 items-center">
        <h1 class="text-xl font-bold my-2">Flavour Saver 👩‍🍳</h1>
    </div>
    <div class="mx-auto mt-4 flex flex-col items-center">
        {#if data.session}
        <span class="text-lg text-justify italic">Welcome, {data.initialUser?.email}!</span>
        <RecipeList/>
        {:else}
        <Auth/>
        {/if}
    </div>
    <div class="flex flex-col text-justify my-4 items-center">
        <span class="my-2 w-1/2 sm:w-2/6 text-justify text-lg">With Flavour Saver, you can track your favourite recipes and get randomized suggestions for what to eat. It's the end of repetitive meals or lack of inspiration.</span>
    </div>
</main>
    
    
    
