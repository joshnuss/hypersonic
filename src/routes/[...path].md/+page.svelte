<script>
  import RadialMenu from '$lib/components/RadialMenu.svelte'
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
  let menu

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
  <RadialMenu bind:this={menu} count=4>
    <button style:--index=0 on:click={() => {menu.collapse(); toggleMode()}} title={$mode == 'write' ? 'Preview' : 'Edit'}>
      {#if $mode == 'write'}
        <Icon icon="mdi:file-eye"/>
      {:else}
        <Icon icon="mdi:file-edit"/>
      {/if}
    </button>

    <button style:--index=1 on:click={() => {menu.collapse(); files.toggle()}} title="Search">
      <Icon icon="mdi:search"/>
    </button>

    <button style:--index=2 on:click={() => {menu.collapse(); create.toggle()}} title="New file">
      <Icon icon="mdi:file-plus"/>
    </button>

    <button style:--index=3 on:click={() => {menu.collapse(); preferences.toggle()}} title="Preferences">
      <Icon icon="mdi:settings"/>
    </button>
  </RadialMenu>
</footer>

<style>
  footer {
    position: fixed;
    bottom: 0px;
    right: 0px;
    width: 100vw;
    height: 100px;
    display: flex;
    justify-content: center;
    padding: var(--size-4);
    gap: 0;
  }

  footer button :global(svg) {
    width: 35px;
  }
</style>
