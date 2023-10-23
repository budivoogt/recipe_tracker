<script lang="ts">
    import { enhance } from "$app/forms"
    import { user } from "../../../stores/authStore.js"
    
    export let form
</script>

<div class="m-6 flex flex-col mx-auto">
    {#if $user}
    <h1 class="text-center text-xl my-4 font-bold">Welcome</h1>
    <p>You are logged in as {$user.email}</p>
    {:else}
    <h1 class="text-center text-xl my-4 font-bold">Login</h1>
    <p class="my-4 text-center">Login below or create an account.</p>
    <form method="POST" action="/auth?/login" use:enhance class="flex flex-col gap-2 w-64 mx-auto">
        <input type="email" name="email" placeholder="your@email.com" value="{form?.email ?? ''}" class="rounded-lg shadow px-3"/>
        <input type="password" name="password" placeholder="password" class="rounded-lg shadow px-3"/>
        <button class="shadow text-white p-1 rounded-lg bg-orange-500 border-none hover:bg-orange-600">Login</button>
        <a href="/auth/register" class="flex flex-col grow">
            <button class="shadow text-white p-1 rounded-lg bg-orange-400 border-none hover:bg-orange-500">Create account</button>
        </a>
    </form>
    {/if}
</div>
<!-- {#if success === false}
<span>Login failed.</span>
{/if} -->