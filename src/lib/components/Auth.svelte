<script lang="ts">
    import { Button, Modal } from "flowbite-svelte"
    import { handleSignIn, handleSignUp } from "../../stores/authStore"
    
    export let email: string
    export let password: string

    let clickOutsideModal: boolean = false
</script>

    <div class="flex flex-col">
        <h2 class=" text-xl font-bold mx-auto mt-8">Login</h2>
        <form on:submit={() => handleSignUp(email, password)} class="flex flex-col w-1/6 mx-auto my-2">
          <input name="email" bind:value="{email}" placeholder="your@email.com" class="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text shadow-sm placeholder-slate-400
      focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500
      invalid:border-pink-500 invalid:text-pink-600
      focus:invalid:border-pink-500 focus:invalid:ring-pink-5000"/>
          <input type="password" name="password" bind:value="{password}" placeholder="password" class="my-2 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text shadow-sm placeholder-slate-400
      focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500
      invalid:border-pink-500 invalid:text-pink-600
      focus:invalid:border-pink-500 focus:invalid:ring-pink-5000"/>
          <Button>Sign up</Button>
        </form>
        <p class="mx-auto mb-2">Or if you have an account</p>
        <Button on:click={() => handleSignIn(email, password)} class="w-1/6 mx-auto mb-2">Sign in</Button>
    </div>

    <Modal title="Confirm your email" bind:open={clickOutsideModal} autoclose outsideclose>
        <p class="text-base leading-relaxed text-gray-500 dark:text-gray-400">Check your inbox for a verification email to activate your account.</p>
    <svelte:fragment slot="footer">
    <Button on:click={() => alert('Handle "success"')}>I accept</Button>
    <Button color="alternative">Decline</Button>
    </svelte:fragment>
</Modal>