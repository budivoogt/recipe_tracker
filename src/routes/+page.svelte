<script lang="ts">
    import Auth from '$lib/components/Auth.svelte'
    import RecipeList from '$lib/components/RecipeList.svelte'

    export let data
</script>

<main>
    <div class="flex flex-col text-justify pt-8 items-center">
        <h1 class="text-xl font-bold my-2">Flavour Saver 👩‍🍳</h1>
        <h2 class="my-2 w-1/2 sm:w-2/6 text-justify">Track your favourite recipes and get randomized suggestions for what to eat.</h2>
    </div>
    <div class="mx-auto mt-4">
        {#if data.session}
        <p class="text-center text-lg">Hello, {data.initialUser?.email}</p>
        <RecipeList/>
        {:else}
        <Auth/>
        {/if}
    </div>
</main>
    
    
    
