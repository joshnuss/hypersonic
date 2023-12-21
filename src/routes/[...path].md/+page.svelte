<script>
  import Icon from '@iconify/svelte'
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

<CreateDialog bind:this={create} />
<FileDialog bind:this={files} bind:documents />

<footer>
  <button on:click={() => files.toggle()} title="Search">
    <Icon icon="mdi:search"/>
  </button>

  <button on:click={() => create.toggle()} title="New file">
    <Icon icon="mdi:file-plus"/>
  </button>

  <button on:click={() => preferences.toggle()} title="Preferences">
    <Icon icon="mdi:settings"/>
  </button>

  <button on:click={toggleMode} title={$mode == 'write' ? 'Preview' : 'Edit'}>
    {#if $mode == 'write'}
      <Icon icon="mdi:file-eye"/>
    {:else}
      <Icon icon="mdi:file-edit"/>
    {/if}
  </button>
</footer>

<style>
  footer {
    position: fixed;
    bottom: 0px;
    right: 0px;
    padding: var(--size-4);
    display: flex;
    gap: 0;

    & button {
      aspect-ratio: 1;
      width: 35px;
      display: flex;
      align-items: center;
      background: none;
    }
  }

  footer :global(svg) {
    width: 35px;
  }
</style>
