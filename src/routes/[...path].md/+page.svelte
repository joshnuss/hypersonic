<script>
  import { persisted } from 'svelte-persisted-store'
  import Editor from './Editor.svelte'
  import PreferencesDialog from '$lib/components/PreferencesDialog.svelte'
  import CreateDialog from '$lib/components/CreateDialog.svelte'
  import FileDialog from '$lib/components/FileDialog.svelte'

  export let user = { id: 1 }
  export let data

  let preferences
  let create
  let files
  let documents

  const mode = persisted('mode', 'write')
  const vim = persisted('vim', false)
  const fontSize = persisted('fontSize', 20)
  const wordWrap = persisted('wordWrap', 'on')
  const lineNumbers = persisted('lineNumbers', 'off')

  function toggleMode() {
    $mode = $mode == 'write' ? 'read' : 'write'
  }
</script>

<svelte:head>
  <title>{data.path}.md</title>
</svelte:head>

{#key data.path}
  <Editor
    bind:mode={$mode}
    bind:vim={$vim}
    bind:fontSize={$fontSize}
    bind:wordWrap={$wordWrap}
    bind:lineNumbers={$lineNumbers}
    roomName="user-{user.id}"
    path={data.path}
    bind:documents
  />
{/key}

<PreferencesDialog
  bind:this={preferences}
  bind:fontSize={$fontSize}
  bind:lineNumbers={$lineNumbers}
  bind:wordWrap={$wordWrap}
  bind:vimMode={$vim}
  />

<CreateDialog bind:this={create}/>
<FileDialog bind:this={files} bind:documents/>

<footer>
  <button on:click={() => files.toggle()}>
    files
  </button>

  <button on:click={() => create.toggle()}>
    create
  </button>

  <button on:click={() => preferences.toggle()}>
    preferences
  </button>

  <button on:click={toggleMode}>
    {$mode == 'write' ? 'read' : 'write'}
  </button>
</footer>

<style>
  footer {
    position: fixed;
    bottom: 0px;
    right: 0px;
    padding: 5px;
  }
</style>
