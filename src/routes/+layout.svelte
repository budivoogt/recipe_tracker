<script lang="ts">
	import { invalidate } from "$app/navigation"
	import Footer from "$lib/components/Footer.svelte"
	import Navbar from "$lib/components/Navbar.svelte"
	import { onDestroy, onMount } from "svelte"
	import { get } from "svelte/store"
	import "../app.css"
	import { user } from "../stores/authStore"
	import type { PageData } from "./$types"

	export let data: PageData
	
	let { supabase, session } = data
	let unsubscribeFromRecipes: () => void

	$: {
		({ supabase, session } = data)
	}

	onMount(() => {
		console.log("onMount() called with data: ", data);

		// Initiate database sync
		// unsubscribeFromRecipes = syncWithSupabase(supabase)

		// Listen for auth state changes
		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange((event, _session) => {
			if (_session?.expires_at !== session?.expires_at) {
				invalidate('supabase:auth')
				console.log("Supabase Auth invalidated.");
				
			} else if (_session && event === "SIGNED_IN" && _session?.user !== get(user)) {
				user.set(_session.user)
				console.log("Signed in user: ", _session.user.email)
			} else if (event === "SIGNED_OUT" && !_session) {
				user.set(null)
				console.log("Signed out")
			}
	})

		return () => subscription.unsubscribe()
	});

	onDestroy(() => {
		if(unsubscribeFromRecipes) unsubscribeFromRecipes()
	})

	</script>

<svelte:head>
	<title>Flavour Saver</title>
	<meta name="description" content="A recipe tracking application that makes randomized meal suggestions. Never a boring meal again.">
</svelte:head>

<div class="flex flex-col min-h-screen bg-orange-200">
	<Navbar/>
	<slot />
	<div class="mt-auto">
		<Footer/>
	</div>
</div>