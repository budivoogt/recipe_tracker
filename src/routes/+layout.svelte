<script lang="ts">
	import Footer from "$lib/components/Footer.svelte"
	import Navbar from "$lib/components/Navbar.svelte"
	import "../app.css"

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