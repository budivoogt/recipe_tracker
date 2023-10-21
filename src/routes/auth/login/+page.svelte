<script lang="ts">
    import { enhance } from "$app/forms";
    export let form
</script>

<form method="post" use:enhance>
    <input type="email" name="email" value="{form?.email ?? ''}" />
    <input type="password" name="password" />
    <button>Login</button>
</form>