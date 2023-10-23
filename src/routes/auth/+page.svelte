<!-- // src/routes/auth/+page.svelte -->
<script lang="ts">
  import { handleSignIn, handleSignOut, handleSignUp } from '../../stores/authStore.js'
  
  export let data

  let { supabase, session } = data
  $: {
    ({ supabase, session } = data)
  }

  let email: string
  let password: string

</script>

<form on:submit="{() => handleSignUp (email, password, supabase)}">
  <input name="email" bind:value="{email}" />
  <input type="password" name="password" bind:value="{password}" />
  <button>Sign up</button>
</form>

<button on:click="{() => handleSignIn (email, password, supabase)}">Sign in</button>
<button on:click="{() => handleSignOut (supabase)}">Sign out</button>