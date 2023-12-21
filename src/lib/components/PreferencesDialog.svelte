<script>
  import Dialog from './Dialog.svelte'

  let dialog

  export let fontSize
  export let wordWrap
  export let lineNumbers
  export let vimMode

  export function toggle() {
    dialog.toggle()
  }
</script>

<Dialog bind:this={dialog} title="Preferences">
  <label>
    <span>Font size</span>
    <input bind:value={fontSize} type="number" min="10" max="30" />
  </label>

  <label>
    <input bind:checked={wordWrap} type="checkbox" />
    <span>Wrap</span>
  </label>

  <label>
    <input bind:checked={lineNumbers} type="checkbox" />
    <span>Line Numbers</span>
  </label>

  <label>
    <input bind:checked={vimMode} type="checkbox" />
    <span>Vim mode</span>
  </label>
</Dialog>
