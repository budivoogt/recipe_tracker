<!-- // src/routes/auth/+page.svelte -->
<script lang="ts">
  import { handleSignIn, handleSignOut, handleSignUp } from '../../stores/authStore.js'
  
  export let data
  let { supabase } = data
  $: {
      ({ supabase } = data)
      console.log("Auth supabase", supabase)
  }

  let email: string
  let password: string

//   const handleSignUp = async () => {
//     await supabase.auth.signUp({
//       email,
//       password,
//       options: {
//         emailRedirectTo: `${location.origin}/auth/callback`,
//       },
//     })
//   }

//   const handleSignIn = async () => {
//     await supabase.auth.signInWithPassword({
//       email,
//       password,
//     })
//   }

//   const handleSignOut = async () => {
//     await supabase.auth.signOut()
//     console.log("signed out"); 
//   }
</script>

<form on:submit="{() => handleSignUp (email, password, supabase)}">
  <input name="email" bind:value="{email}" />
  <input type="password" name="password" bind:value="{password}" />
  <button>Sign up</button>
</form>

<button on:click="{() => handleSignIn (email, password, supabase)}">Sign in</button>
<button on:click="{() => handleSignOut (supabase)}">Sign out</button>