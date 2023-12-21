<script>
  import { createEventDispatcher } from 'svelte'

  export let id
  export let title = null

  let dialog

  const dispatch = createEventDispatcher()

  export function toggle() {
    dialog.togglePopover()
  }
  export function open() {
    dialog.showPopover()
  }
  export function close() {
    dialog.hidePopover()
  }

  function submit() {
    close()

    dispatch('submit')
  }
</script>

<div {id} bind:this={dialog} popover>
  {#if title}
    <h2>{title}</h2>
  {/if}

  <form on:submit|preventDefault={submit}>
    <slot />

    <button>OK</button>
  </form>
</div>

<style>
  ::backdrop {
    background: #0004;
    backdrop-filter: blur(2px);
    opacity: 0;
    animation: 0.3s fade-in forwards;
  }

  [popover] {
    --width: 400px;
    width: var(--width);
    position: fixed;
    top: 20%;
    left: calc(50vw - calc(var(--width)/2))
  }

  [popover]:popover-open {
    padding: var(--size-7);
    color: var(--gray-2);
    border-radius: var(--radius-2);
    animation: var(--animation-slide-in-up) forwards;
  }

  form {
    display: flex;
    flex-direction: column;
    gap: var(--size-4);
    justify-content: flex-end;
  }

  h2 {
    margin: 0 0 1rem 0;
    font-size: 1.2rem;
    color: var(--gray-4);
    font-weight: normal;
  }
</style>
