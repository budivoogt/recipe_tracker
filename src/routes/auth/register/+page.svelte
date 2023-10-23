<script lang="ts">
    import { enhance } from "$app/forms"
    export let form
</script>

<div class="m-6 flex flex-col mx-auto">
    <h1 class="text-center text-xl my-4 font-bold">Create account</h1>
    <form method="post" use:enhance class="flex flex-col gap-4">
        <input type="email" name="email" placeholder="your@email.com" value="{form?.email ?? ''}"/>
        <input type="password" name="password" placeholder="password" />
        <button class="shadow text-white p-1 rounded-lg bg-orange-500 border-none hover:bg-orange-600">Login</button>
    </form>

</div>
