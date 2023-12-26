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

<div {id} bind:this={dialog} popover on:keydown>
  {#if title}
    <h2>{title}</h2>
  {/if}

  <form on:submit|preventDefault={submit}>
    <slot />

    <button>OK</button>
  </form>
</div>

<style>
  @import "open-props/media.min";

  ::backdrop, :global(body:has(.\:popover-open)::before) { 
    z-index: var(--layer-2);
    content: '';
    width: 100%;
    height: 100%;
    position: fixed;
    left: 0;
    top: 0;

    background: #0004;
    backdrop-filter: blur(2px);
    opacity: 0;
    animation: 0.3s fade-in forwards;
  }


  [popover] {
    z-index: var(--layer-4);
    background: var(--background-color);
    --width: 100%;
    width: var(--width);
    position: fixed;
    bottom: 0px;
    top: auto;
    left: calc(50vw - calc(var(--width) / 2));
    padding: var(--size-7);
    color: var(--gray-2);
    border: solid 1px var(--gray-7);
    border-radius: var(--radius-2);
  }

  [popover]:popover-open {
    animation: var(--animation-slide-in-up) forwards;
  }

  :global(.\:popover-open) {
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
    color: var(--gray-2);
    font-weight: normal;
  }

  [popover] :global(dialog) {
    border: solid 1px var(--gray-7);
    padding: 7px;
    background: var(--gray-1);
    color: #222;
    align-self: flex-end;
    min-width: 40%;
  }

  [popover] :global(input) {
    background: var(--gray-11);
    padding: 8px 15px;
    border: solid 1px var(--gray-7);
  }

  [popover] :global(button) {
    border: solid 1px var(--gray-1);
    padding: 7px;
    background: white;
    color: #222;
    align-self: flex-end;
    width: 100%;
  }

  @media (--sm-n-above) {
    [popover] {
      --width: 400px;
      bottom: auto;
      top: 20%;
    }

    [popover] :global(button) {
      width: 40%;
    }
  }
</style>
