<script>
  import { createSearch } from '$lib/search'
  import { open } from '$lib/navigation'

  export let documents
  export let titles

  let dialog
  let pattern
  let input
  let focusedIndex = 0
  let buttons = []

  let items = []

  $: search = createSearch(items)
  $: results = search.filter(pattern)

  $: {
    const element = buttons[focusedIndex]

    if (element) {
      element.scrollIntoView(false)
    }
  }

  export function toggle() {
    const paths = [...(documents?.keys() || [])]

    items = paths.map((path) => {
      const title = titles?.get(path) || ''

      return {
        path,
        title
      }
    })

    dialog.togglePopover()
    input.focus()
  }

  function keydown(e) {
    if (e.key == 'ArrowUp') {
      e.preventDefault()
      focus(focusedIndex - 1)
      return
    }

    if (e.key == 'ArrowDown') {
      e.preventDefault()
      focus(focusedIndex + 1)
      return
    }

    if (e.key == 'Enter' && e.altKey) {
      e.preventDefault()
      submit(null, true)
      return
    }

    if (!['Enter', 'Alt'].includes(e.key) && e.target == input) {
      focusedIndex = 0
    }
  }

  function focus(index) {
    if (index < 0) {
      if (document.activeElement != input) {
        input.focus()
      }
      focusedIndex = 0
      return
    }

    if (index >= results.length) return

    focusedIndex = index
  }

  function submit(e, newTab = false) {
    if (results.length) {
      const { path } = results[focusedIndex]

      open(`/${path}`, newTab)
    }

    dialog.hidePopover()

    pattern = ''
    focusedIndex = 0
  }
</script>

<div bind:this={dialog} popover>
  <form method="dialog" on:submit={submit}>
    <input
      name="search"
      bind:value={pattern}
      placeholder="search"
      bind:this={input}
      on:keydown={keydown}
    />

    <div class="results">
      {#each results as item, index}
        <button
          value={item.path}
          bind:this={buttons[index]}
          class:focus={index == focusedIndex}
          on:focus={() => focus(index)}
        >
          {item.path}
        </button>
      {:else}
        <button>Nothing found</button>
      {/each}
    </div>
  </form>
</div>

<style>
  ::backdrop {
    background: #0004;
    backdrop-filter: blur(8px);
    opacity: 0;
    animation: 0.3s fade-in forwards;
  }

  [popover] {
    --width: 300px;
    position: fixed;
    top: 20vh;
    left: calc(50vw - calc(var(--width) / 2));
  }

  [popover]:popover-open {
    padding: 0;
    border: solid 1px var(--gray-7);
    color: var(--gray-2);
    border-radius: var(--radius-2);
    min-width: 300px;
    display: flex;
    flex-direction: column;
    gap: var(--size-4);
    animation: 0.2s slide-in-up forwards;
    overflow-x: clip;
    scrollbar-color: var(--gray-1) transparent;
    box-shadow: var(--shdadow-4);
  }

  form {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
  }

  input {
    width: 100%;
    border-radius: 0;
    padding: 8px 1rem;

    &:focus {
      outline: none;
    }
  }

  .results {
    display: flex;
    gap: 0;
    flex-direction: column;
    max-height: 160px;
    overflow-y: auto;

    & button {
      padding: 5px 8px;
      margin: 5px;
      text-align: left;
      border-radius: var(--radius-2);
      border: none;
      justify-content: flex-start;
      background: none;
      color: var(--gray-5);
      font-weight: normal;
      display: flex;
      flex-direction: column;
      gap: 0;
      transition: all 0.1s var(--ease-3);

      &:hover {
        background: var(--gray-7);
      }

      &:focus {
        outline: none;
      }

      &.focus {
        outline: none;
        background: var(--gray-9);
      }
    }

    & h4,
    & p {
      align-self: flex-start;
    }

    & p {
      color: var(--gray-5);
    }

    & h4 {
      font-weight: normal;
      font-size: 1.1rem;
      color: var(--gray-4);
    }
  }

  /* scrollbar stuff */
  /* width */
  ::-webkit-scrollbar {
    width: 4px;
  }

  /* Track */
  ::-webkit-scrollbar-track {
    background: transparent;
  }

  /* Handle */
  ::-webkit-scrollbar-thumb {
    background: var(--gray-4);
    border-radius: 3px;
  }

  /* Handle on hover */
  ::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
</style>
