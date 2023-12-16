<script lang="ts">
	import { invalidate } from "$app/navigation"
	import Footer from "$lib/components/Footer.svelte"
	import Navbar from "$lib/components/Navbar.svelte"
	import { onMount } from "svelte"
	import "../app.css"
	import type { LayoutData, LayoutServerData } from "./$types"

	type CombinedData = LayoutData & LayoutServerData

	export let data: CombinedData

	onMount(() => {
		const {
			data: { subscription }
		} = data.supabase.auth.onAuthStateChange((event, _session) => {
			if (_session?.expires_at !== data.session?.expires_at) {
				invalidate("supabase:auth")
				console.log("Supabase Auth invalidated.", event, _session)
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
