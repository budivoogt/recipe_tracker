<script lang="ts">
    import { enhance } from "$app/forms"
        
    export let form

    let password: string = ""
    let confirmPassword: string = ""
    let passwordsMatch: boolean = true

    function handleSubmit(event: SubmitEvent) {
        passwordsMatch = password === confirmPassword
        if (!passwordsMatch) {
            event.preventDefault()
            return
        }
    }
</script>

<div class="m-6 flex flex-col mx-auto">
    <h1 class="text-center text-xl my-4 font-bold">Reset password</h1>
    <p class="my-4 text-center">Enter your new password</p>
    <form method="POST" action="/auth?/updatePassword" use:enhance class="flex flex-col gap-4 w-64 mx-auto" on:submit={handleSubmit}>
        <input type="password" name="password" placeholder="your new password" bind:value={password} class="rounded-lg px-3"/>
        <input type="password" name="password" placeholder="your new password" bind:value={confirmPassword} class="rounded-lg px-3"/>
        {#if !passwordsMatch}
        <span>Passwords do not match</span>
        {/if}
        <button class="shadow text-white p-1 rounded-lg bg-orange-500 border-none hover:bg-orange-600" disabled={!passwordsMatch}>Change password</button>
    </form>
    {#if form?.success}
    <span>
    Your password has been changed successfully. Log in with your new password.
    </span>    
    {:else if form?.error}
    <span>Something went wrong.</span>
    {/if}
</div>