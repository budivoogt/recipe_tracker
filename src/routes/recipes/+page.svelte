<script lang="ts">
    import RecipeTable from '$lib/components/RecipeTable.svelte'
    import { setContext } from 'svelte';

    export let data

    setContext("supabase", data)
		
</script>

<RecipeTable/>