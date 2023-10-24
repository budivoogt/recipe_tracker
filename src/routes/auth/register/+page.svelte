<script lang="ts">
    import { enhance } from "$app/forms"

    let email: string
    let password: string
</script>

<div class="flex flex-col">
    <h2 class=" text-xl font-bold mx-auto my-6">Create account</h2>
    <p class="mb-4 text-center w-1/2 sm:w-1/5 mx-auto">Enter your desired email and password to register.</p>
    <form method="POST" action="/auth?/register" use:enhance class="flex flex-col w-1/2 sm:w-1/5 mx-auto gap-2">
        <input type="email" name="email" bind:value="{email}" placeholder="your@email.com" class="w-full px-3 bg-white border border-slate-300 rounded-md text shadow-sm placeholder-slate-400
    focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500
    invalid:border-pink-500 invalid:text-pink-600
    focus:invalid:border-pink-500 focus:invalid:ring-pink-5000"/>
        <input type="password" name="password" bind:value="{password}" placeholder="password" class="w-full px-3 bg-white border border-slate-300 rounded-md text shadow-sm placeholder-slate-400
    focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500
    invalid:border-pink-500 invalid:text-pink-600
    focus:invalid:border-pink-500 focus:invalid:ring-pink-5000"/>
        <button class="shadow text-white p-1 rounded-lg bg-orange-500 border-none hover:bg-orange-600">Create account</button>
    </form>
</div>