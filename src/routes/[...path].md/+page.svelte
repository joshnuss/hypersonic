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
  let titles
  let keyboardOpen = false

  const mode = persisted('mode', 'write')
  const vim = persisted('vim', false)
  const fontSize = persisted('fontSize', 20)
  const wordWrap = persisted('wordWrap', 'on')
  const lineNumbers = persisted('lineNumbers', 'off')

  function toggleMode() {
    $mode = $mode == 'write' ? 'read' : 'write'
  }

  function resize(e) {
    keyboardOpen = Math.round(window.visualViewport.height) != window.innerHeight
  }
</script>

<svelte:window on:resize={resize}/>

<svelte:head>
  <title>{data.path}.md</title>
</svelte:head>

<header>
  <nav>
    <button class="mode" on:click={toggleMode} title={$mode == 'write' ? 'Preview' : 'Edit'}>
      {#if $mode == 'write'}
        <Icon icon="mdi:file-eye" />
      {:else}
        <Icon icon="mdi:file-edit" />
      {/if}
    </button>

    <button on:click={() => preferences.toggle()} title="Preferences">
      <Icon icon="mdi:settings" />
    </button>
  </nav>
</header>

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
    bind:titles
    on:find={() => files.toggle()}
    on:create={() => create.toggle()}
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
<FileDialog bind:this={files} bind:documents bind:titles />

<footer class:keyboardOpen>
  <nav>
    <button on:click={() => create.toggle()} title="New file CTRL+SHIFT+N">
      <Icon icon="mdi:plus" />
    </button>

    <button class="search" on:click={() => files.toggle()} title="Search CTRL+K">
      <Icon icon="mdi:search" />
    </button>
  </nav>
</footer>

<style>
  footer, header {
    position: fixed;
    right: 20px;
    z-index: var(--layer-2);
  }

  footer nav, header nav {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--size-1);
  }

  header {
    top: 10px;
  }

  footer {
    bottom: 20px;

    &.keyboardOpen {
      display: none;
    }
  }

  nav button {
    background: #000b;
    color: var(--gray-4);
    border-radius: 50%;
    display: flex;
    width: 50px;
    aspect-ratio: 1 / 1;
    align-items: center;
    justify-content: center;
    transition: 0.2s all var(--ease-3);
    backdrop-filter: blur(1px);

    &:hover {
      scale: 1.05;
      color: var(--gray-1);
      box-shadow: var(--shadow-3);
      background: var(--indigo-4);
    }
  }

  button.search {
    color: var(--indigo-4);

    &:hover {
      color: var(--indigo-6);
      background: var(--gray-2);
    }
  }

  button.mode {
    color: var(--gray-1);
  }

  button.search, button.mode {
    width: 55px;
  }

  nav button :global(svg) {
    width: 80%;
  }
</style>
