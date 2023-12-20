<script>
  import { persisted } from 'svelte-persisted-store'
  import Editor from './Editor.svelte'
  import Preferences from '$lib/components/Preferences.svelte'

  export let user = { id: 1 }
  export let data

  let preferences

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
  />
{/key}

<Preferences
  bind:this={preferences}
  bind:fontSize={$fontSize}
  bind:lineNumbers={$lineNumbers}
  bind:wordWrap={$wordWrap}
  />

<footer>
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
