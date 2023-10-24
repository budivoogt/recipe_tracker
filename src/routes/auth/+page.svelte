<!-- // src/routes/auth/+page.svelte -->
<script lang="ts">
  
  export let data

  let { supabase, session } = data
  $: {
    ({ supabase, session } = data)
  }

  let email: string
  let password: string

</script>