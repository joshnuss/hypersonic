<script>
  import { onMount } from 'svelte'
  import { mode, lastPage, toggleMode} from '$lib/settings'
  import { getWorkspace } from '$lib/workspace'
  import Icon from '@iconify/svelte'
  import Editor from './Editor.svelte'
  import Preview from './Preview.svelte'
  import PreferencesDialog from '$lib/components/PreferencesDialog.svelte'
  import CreateDialog from '$lib/components/CreateDialog.svelte'
  import FileDialog from '$lib/components/FileDialog.svelte'
  import { marked } from 'marked'

  export let data

  $: ({ session: { user }, path } = data)

  let workspace
  let doc
  let title
  let markdown = ''

  let dialogs = {}
  let keyboardOpen = false

  $: if (user && path) {
    $lastPage[user.id] = `/${path}.md`
  }

  $: fullPath = `${path}.md`
  $: html = marked(markdown)
  $: saveTitle(html)

  onMount(async () => {
    workspace = await getWorkspace(user)

    return () => {
      workspace.leave()
      doc.text.unobserve(updateMarkdown)
    }
  })

  async function loadPath(path) {
    const result = await workspace.loadDocument(path)

    if (!result.existing) $mode = 'write'

    if (doc) {
      doc.text.unobserve(updateMarkdown)
    }

    doc = result.doc

    doc.text.observe(updateMarkdown)
  }

  function updateMarkdown(e) {
    markdown = e.target.toString()
  }

  $: if(workspace) loadPath(fullPath)

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
      dialogs.files.toggle()
    }

    if (e.ctrlKey && e.altKey && e.code == 'KeyN') {
      e.preventDefault()
      dialogs.create.toggle()
    }
  }

  function saveTitle(html) {
    const match = html.match(/<h1>([^<]+)<\/h1>/)
    title = match ? match[1] : 'Untitled'

    doc?.updateTitle(title)
  }
</script>

<svelte:head>
  <title>{title ? title : fullPath}</title>
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

{#key [path, doc?.text]}
  {#if doc?.text}
    <Editor
      yText={doc.text}
      provider={workspace.provider}
      on:find={() => dialogs.files.toggle()}
      on:create={() => dialogs.create.toggle()}
    />

    <Preview {markdown}/>
  {:else}
    <p>Loading...</p>
  {/if}
{/key}

<PreferencesDialog bind:this={dialogs.preferences}/>
<CreateDialog bind:this={dialogs.create} />
<FileDialog bind:this={dialogs.files} bind:workspace />

<footer class:keyboardOpen>
  <nav>
    <button on:click={() => dialogs.preferences.toggle()} title="Preferences">
      <Icon icon="mdi:settings" />
    </button>

    <button on:click={() => dialogs.create.toggle()} title="New file CTRL+ALT+N">
      <Icon icon="mdi:plus" />
    </button>

    <button class="search" on:click={() => dialogs.files.toggle()} title="Search CTRL+K">
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
