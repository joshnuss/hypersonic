<script>
  export let title = null

  let dialog

  export function toggle() {
    dialog.open ? close() : open()
  }
  export function open() {
    dialog.showModal()
  }
  export function close() {
    dialog.close()
  }
</script>

<dialog bind:this={dialog}>
  {#if title}
    <h2>{title}</h2>
  {/if}

  <form method="dialog" on:submit>
    <slot />

    <button>OK</button>
  </form>
</dialog>

<style>
  ::backdrop {
    background: #0004;
    backdrop-filter: blur(2px);
    opacity: 0;
    animation: 0.3s fade-in forwards;
  }

  dialog[open] {
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
