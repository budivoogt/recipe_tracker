<script>
	import Footer from "$lib/components/Footer.svelte"
	import Navbar from "$lib/components/Navbar.svelte"
	import "../app.css"
</script>
<div class="flex flex-col min-h-screen bg-orange-200">
	<Navbar/>
	<slot />
	<div class="mt-auto">
		<Footer/>
	</div>
</div>