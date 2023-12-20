<script>
  import { persisted } from 'svelte-persisted-store'
  import Editor from './Editor.svelte'

  export let user = { id: 1 }
  export let data

  const mode = persisted('mode', 'write')
  const vim = persisted('vim', false)

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
    roomName="user-{user.id}"
    path={data.path}
  />
{/key}

<footer>
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
