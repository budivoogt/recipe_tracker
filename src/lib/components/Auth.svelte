<script lang="ts">
    import { enhance } from "$app/forms"
    import { Button, Modal } from "flowbite-svelte"
    
    let email: string
    let password: string

    let clickOutsideModal: boolean = false
</script>

    <div class="flex flex-col mt-6">
        <h2 class=" text-xl font-bold mx-auto mb-4">Login</h2>
        <p class="mb-4 text-center w-1/2 sm:w-1/5 mx-auto">Login below or create an account to get started.</p>
        <form method="POST" action="/auth?/login" use:enhance class="flex flex-col w-1/2 sm:w-1/5 mx-auto gap-2">
          <input type="email" name="email" bind:value="{email}" placeholder="your@email.com" class="w-full px-3 bg-white border border-slate-300 rounded-md text shadow-sm placeholder-slate-400
      focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500
      invalid:border-pink-500 invalid:text-pink-600
      focus:invalid:border-pink-500 focus:invalid:ring-pink-5000"/>
          <input type="password" name="password" bind:value="{password}" placeholder="password" class="w-full px-3 bg-white border border-slate-300 rounded-md text shadow-sm placeholder-slate-400
      focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500
      invalid:border-pink-500 invalid:text-pink-600
      focus:invalid:border-pink-500 focus:invalid:ring-pink-5000"/>
          <button class="shadow text-white p-1 rounded-lg bg-orange-500 border-none hover:bg-orange-600">Login</button>
            <div class="flex flex-col sm:flex-row  gap-2">
                <a href="/auth/register" class="w-full sm:w-1/2">
                    <button class="shadow py-1 w-full text-center text-white rounded-lg bg-orange-400 border-none hover:bg-orange-500">Create account</button>
                </a>
                <a href="/auth/reset" class="w-full sm:w-1/2">
                    <button class="shadow py-1 w-full text-center text-white rounded-lg bg-orange-400 border-none hover:bg-orange-500">Reset password</button>
                </a>
            </div>
        </form>
    </div>

    <Modal title="Confirm your email" bind:open={clickOutsideModal} autoclose outsideclose>
        <p class="text-base leading-relaxed text-gray-500 dark:text-gray-400">Check your inbox for a verification email to activate your account.</p>
    <svelte:fragment slot="footer">
    <Button on:click={() => alert('Handle "success"')}>I accept</Button>
    <Button color="alternative">Decline</Button>
    </svelte:fragment>
</Modal>