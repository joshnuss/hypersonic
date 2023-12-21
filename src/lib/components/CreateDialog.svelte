<script>
  import Dialog from './Dialog.svelte'
  import { goto } from '$app/navigation'

  let dialog
  let path
  let input

  export function toggle() {
    dialog.toggle()
    input.focus()
  }

  function submit() {
    if (!path) return

    if (!path.endsWith('.md')) {
      path += '.md'
    }

    goto('/' + path)

    path = ''
  }
</script>

<Dialog id="create-dialog" bind:this={dialog} title="Create" on:submit={submit}>
  <input bind:value={path} bind:this={input} type="string" placeholder="some/path/file.md" />
</Dialog>
