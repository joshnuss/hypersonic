<script>
  import Icon from '@iconify/svelte'
  import { persisted } from 'svelte-persisted-store'
  import Editor from './Editor.svelte'
  import PreferencesDialog from '$lib/components/PreferencesDialog.svelte'
  import CreateDialog from '$lib/components/CreateDialog.svelte'
  import FileDialog from '$lib/components/FileDialog.svelte'

  export let data

  $: ({ user } = data.session)

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
    keyboardOpen =
      Math.round(e.target.visualViewport.height) != e.target.document.documentElement.clientHeight
  }
</script>

<svelte:window on:resize={resize} />

<svelte:head>
  <title>{data.path}.md</title>
</svelte:head>

<header>
  <nav>
    <button class="mode" on:click={toggleMode} title={$mode == 'write' ? 'View' : 'Edit'}>
      {#if $mode == 'write'}
        <Icon icon="ant-design:read-outline" />
      {:else}
        <Icon icon="mdi:progress-pencil" />
      {/if}
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
    roomName="user:{user.id}"
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
    <button on:click={() => preferences.toggle()} title="Preferences">
      <Icon icon="mdi:settings" />
    </button>

    <button on:click={() => create.toggle()} title="New file CTRL+SHIFT+N">
      <Icon icon="mdi:plus" />
    </button>

    <button class="search" on:click={() => files.toggle()} title="Search CTRL+K">
      <Icon icon="mdi:search" />
    </button>
  </nav>
</footer>

<style>
  footer,
  header {
    position: fixed;
    right: 15px;
    z-index: var(--layer-2);
  }

  footer nav,
  header nav {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  header {
    top: 5px;
  }

  footer {
    bottom: 12px;

    &.keyboardOpen {
      display: none;
    }
  }

  nav button {
    background: var(--background-color);
    color: var(--gray-5);
    border-radius: 50%;
    display: flex;
    width: 40px;
    aspect-ratio: 1 / 1;
    align-items: center;
    justify-content: center;
    transition: 0.2s all var(--ease-3);
    backdrop-filter: blur(1px);

    &:hover {
      scale: 1.1;
      color: var(--indigo-3);
      box-shadow: var(--shadow-3);
    }
  }

  button.search {
    color: var(--indigo-4);

    &:hover {
      color: var(--indigo-6);
    }
  }

  nav button :global(svg) {
    width: 100%;
  }
</style>
