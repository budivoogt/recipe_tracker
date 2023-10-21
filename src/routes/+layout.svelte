<script lang="ts">
	import { invalidate } from "$app/navigation"
	import Footer from "$lib/components/Footer.svelte"
	import Navbar from "$lib/components/Navbar.svelte"
	import { onMount } from "svelte"
	import "../app.css"
	import { user } from "../stores/authStore"

	export let data

	let { supabase, session, initialUser } = data
	$: {
		({ supabase, session, initialUser } = data)
		console.log("supabase: ", supabase, "session: ", session, "initialUser: ", initialUser)
	}

	onMount(() => {
		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange((event, _session) => {
			if (_session?.expires_at !== session?.expires_at) {
				invalidate('supabase:auth')
			} else if (event === "SIGNED_IN" && _session) {
				user.set(_session.user)
				console.log("Signed in user: ", _session.user.email)
			} else if (event === "SIGNED_OUT" && !_session) {
				user.set(null)
				console.log("Signed out")
			}				
	})

		return () => subscription.unsubscribe()
	});
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