<script lang="ts">
    import { enhance } from '$app/forms'
    
    export let form
</script>

<div class="mt-6 flex flex-col mx-auto">
    <h1 class="text-center text-xl mb-4 font-bold">Reset password</h1>
    <p class="my-4 text-center">Enter your email to reset your password.</p>
    <form method="POST" action="/auth?/reset" use:enhance class="flex flex-col gap-4 w-64 mx-auto">
        <input type="email" name="email" placeholder="your@email.com" value="{form?.email ?? ''}" class="rounded-lg px-3"/>
        <button class="shadow text-white p-1 rounded-lg bg-orange-500 border-none hover:bg-orange-600">Reset password</button>
    </form>
</div>