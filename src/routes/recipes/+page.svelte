<script lang="ts">
	import RecipeTable from "$lib/components/recipeTable.svelte"
    
    export let data
    let { supabase } = data
    $: ({ supabase } = data)
		
</script>

<h1 class="text-2xl text-center mt-6">Browse recipes</h1>
<RecipeTable {supabase}/>