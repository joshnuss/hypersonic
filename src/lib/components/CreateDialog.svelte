<script>
  import Dialog from './Dialog.svelte'
  import { open } from '$lib/navigation'

  let dialog
  let path
  let input

  export function toggle() {
    dialog.toggle()
    input.focus()
  }

  function submit(e, newTab = false) {
    if (!path) return

    path = path.trim()

    if (!path.endsWith('.md')) {
      path += '.md'
    }

    open(`/${path}`, newTab)

    dialog.close()
    path = ''
  }

  function keydown(e) {
    if (e.altKey && e.code == 'Enter') {
      e.preventDefault()

      submit(null, true)
    }
  }
</script>

<Dialog
  id="create-dialog"
  bind:this={dialog}
  title="New file"
  on:submit={submit}
  on:keydown={keydown}
  on:closed
>
  <input bind:value={path} bind:this={input} type="string" placeholder="some/path/file.md" />
</Dialog>
