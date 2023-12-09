<script lang="ts">
    import RecipeTable from '$lib/components/RecipeTable.svelte'

    export let data
    let { supabase } = data
    $: ({ supabase } = data)
		
</script>

<RecipeTable {supabase}/>