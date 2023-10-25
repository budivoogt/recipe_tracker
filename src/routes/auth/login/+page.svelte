<script lang="ts">
    import Auth from "$lib/components/Auth.svelte"
    import { user } from "../../../stores/authStore.js"
    
</script>

<div class="">
    {#if $user}
    <div class="text-center my-6">
        <h1 class="text-xl my-4 font-bold">Welcome</h1>
        <p>You are logged in as {$user.email}</p>
    </div>
    {:else}
    <Auth/>
    {/if}
    </div>