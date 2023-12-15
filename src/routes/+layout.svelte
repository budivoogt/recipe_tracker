<script lang="ts">
	import { invalidate } from "$app/navigation"
	import Footer from "$lib/components/Footer.svelte"
	import Navbar from "$lib/components/Navbar.svelte"
	import type { Session } from "@supabase/supabase-js"
	import { onMount, setContext } from "svelte"
	import { get } from "svelte/store"
	import "../app.css"
	import { supabaseStore, user } from "../stores/authStore"
	import type { PageData } from "./$types"

	export let data: PageData
	let session: Session | null

	$: {
		if (data) {
			;({ supabase: $supabaseStore, session } = data)
			setContext("supabase", supabaseStore)
		}
	}

	onMount(() => {
		const {
			data: { subscription }
		} = data.supabase.auth.onAuthStateChange((event, _session) => {
			if (_session?.expires_at !== session?.expires_at) {
				invalidate("supabase:auth")
				console.log("Supabase Auth invalidated.")
			} else if (_session && event === "SIGNED_IN" && _session?.user !== get(user)) {
				user.set(_session.user)
				console.log("Signed in user: ", _session.user.email)
			} else if (event === "SIGNED_OUT" && !_session) {
				user.set(null)
				console.log("Signed out")
			}
		})

		return () => subscription.unsubscribe()
	})
</script>

<svelte:head>
	<title>Flavour Saver</title>
	<meta
		name="description"
		content="A recipe tracking application that makes randomized meal suggestions. Never a boring meal again."
	/>
</svelte:head>

<div class="flex min-h-screen flex-col bg-orange-200">
	<Navbar />
	<slot />
	<div>
		<Footer />
	</div>
</div>
