<script lang="ts">
    import { Button, Modal } from "flowbite-svelte"

    export let showModal: boolean = false
    export let title = "You're about to delete this recipe"
    export let message = "Are you sure you want to proceed? This is irreversible."
    export let confirmButtonText = "Yes 💣"
    export let cancelButtonText = "No"
    export let confirmHandler = () => {}
    export let cancelHandler = () => {}
    export let closeHandler = () => {}

</script>

<Modal bind:open={showModal} on:close={closeHandler} class="w-26" outsideclose>
  <div class="flex flex-col gap-4 text-black">
    <span class=" text-xl font-bold">{title}</span>
    <span>{message}</span>
    <div class="flex flex-row gap-4 mx-auto">
      <Button on:click={confirmHandler} color='red'>{confirmButtonText}</Button>
      <Button on:click={cancelHandler}>{cancelButtonText}</Button>
    </div>
  </div>
</Modal>