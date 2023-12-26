<script>
  import { onMount } from 'svelte'
  import { createClient } from '@liveblocks/client'
  import { mode, lastPage, toggleMode} from '$lib/settings'
  import Icon from '@iconify/svelte'
  import Editor from './Editor.svelte'
  import Preview from './Preview.svelte'
  import PreferencesDialog from '$lib/components/PreferencesDialog.svelte'
  import CreateDialog from '$lib/components/CreateDialog.svelte'
  import FileDialog from '$lib/components/FileDialog.svelte'

  const client = createClient({
    authEndpoint: '/api/liveblocks-auth'
  })

  export let data

  $: ({ session: { user }, path } = data)

  let title
  let preferences
  let create
  let files
  let documents
  let titles
  let keyboardOpen = false
  let markdown = ''
  let room

  $: if (user && path) {
    $lastPage[user.id] = `/${path}.md`
  }

  onMount(() => {
    const roomName = `user:${user.id}`
    const result = client.enterRoom(roomName, {
      initialPresence: {}
    })

    room = result.room

    return () => result.leave()
  })

  function resize(e) {
    keyboardOpen =
      Math.round(e.target.visualViewport.height) != e.target.document.documentElement.clientHeight
  }

  function keydown(e) {
    if (e.ctrlKey && e.code == 'KeyM') {
      e.preventDefault()
      toggleMode()
    }

    if (e.ctrlKey && e.code == 'KeyK') {
      e.preventDefault()
      files.toggle()
    }

    if (e.ctrlKey && e.altKey && e.code == 'KeyN') {
      e.preventDefault()
      create.toggle()
    }
  }
</script>

<svelte:head>
  <title>{title ? title : `${path}.md`}</title>
</svelte:head>

<svelte:window on:resize={resize} on:keydown={keydown}/>

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

{#key path}
  {#if room}
    <Editor
      {room}
      {path}
      bind:title
      bind:documents
      bind:titles
      bind:markdown
      on:find={() => files.toggle()}
      on:create={() => create.toggle()}
    />

    <Preview {markdown}/>
  {:else}
    <p>Loading...</p>
  {/if}
{/key}

<PreferencesDialog bind:this={preferences}/>
<CreateDialog bind:this={create} />
<FileDialog bind:this={files} bind:documents bind:titles />

<footer class:keyboardOpen>
  <nav>
    <button on:click={() => preferences.toggle()} title="Preferences">
      <Icon icon="mdi:settings" />
    </button>

    <button on:click={() => create.toggle()} title="New file CTRL+ALT+N">
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
