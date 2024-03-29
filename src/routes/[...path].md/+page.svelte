<script>
  import { onMount } from 'svelte'
  import { vim, mode, toggleMode } from '$lib/settings'
  import { trackOpened } from '$lib/usage'
  import { getWorkspace } from '$lib/workspace'
  import Icon from '@iconify/svelte'
  import Editor from './Editor.svelte'
  import Preview from './Preview.svelte'
  import PreferencesDialog from '$lib/components/PreferencesDialog.svelte'
  import CreateDialog from '$lib/components/CreateDialog.svelte'
  import FileDialog from '$lib/components/FileDialog.svelte'
  import Loader from '$lib/components/Loader.svelte'
  import { convertMarkdown } from '$lib/markdown'

  export let data

  $: ({
    session: { user },
    path
  } = data)

  let workspace
  let doc
  let title
  let markdown = ''
  let editor

  let dialogs = {}

  $: fullPath = `${path}.md`
  $: if (user) trackOpened(fullPath)
  $: html = convertMarkdown(markdown, fullPath)
  $: saveTitle(html)
  $: if (workspace) loadPath(fullPath)
  $: if ($mode == 'write') focus()

  onMount(async () => {
    workspace = await getWorkspace(user)

    workspace.provider.awareness.setLocalStateField('user', {
      name: user.name,
      color: 'pink',
      colorLight: 'red'
    })

    return () => {
      workspace.leave()
      doc.text.unobserve(updateMarkdown)
    }
  })

  async function loadPath(path) {
    const result = await workspace.loadDocument(path)

    console.log('load', path)

    if (!result.existing) {
      $mode = 'write'
    }

    if (doc) {
      doc.text.unobserve(updateMarkdown)
    }

    doc = result.doc
    doc.text.observe(updateMarkdown)
    markdown = doc.text.toString()

    focus()
  }

  function updateMarkdown(e) {
    markdown = e.target.toString()
  }

  function keydown(e) {
    if (e.ctrlKey && e.code == 'KeyM') {
      e.preventDefault()
      toggleMode()

      if ($mode == 'write') {
        focus()
      }
    }

    if (e.ctrlKey && e.code == 'KeyK') {
      e.preventDefault()
      dialogs.files.toggle()
    }

    if (e.ctrlKey && e.altKey && e.code == 'KeyN') {
      e.preventDefault()
      dialogs.create.toggle()
    }

    if (e.ctrlKey && e.altKey && e.code == 'KeyV') {
      e.preventDefault()
      $vim = !$vim
    }
  }

  function saveTitle(html) {
    const match = html.match(/<h1>([^<]+)<\/h1>/)
    title = match ? match[1] : 'Untitled'

    doc?.updateTitle(title)
  }

  function focus() {
    setTimeout(() => editor?.focus(), 0)
  }
</script>

<svelte:head>
  <title>{title ? title : fullPath}</title>
</svelte:head>

<svelte:window on:keydown={keydown} on:focus={focus} />

<header>
  <nav>
    <button class="mode" on:click={toggleMode} title="{$mode == 'write' ? 'View' : 'Edit'} CTRL+M">
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
    <Editor {doc} provider={workspace.provider} bind:this={editor} />

    <Preview {html} text={doc.text} />
  {:else}
    <Loader/>
  {/if}
{/key}

<PreferencesDialog bind:this={dialogs.preferences} on:closed={focus} />
<CreateDialog bind:this={dialogs.create} on:closed={focus} />
<FileDialog bind:this={dialogs.files} bind:workspace on:closed={focus} />

<footer>
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
    right: 5px;
    z-index: var(--layer-2);
  }

  footer nav,
  header nav {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 5px;
  }

  header {
    top: 5px;
  }

  footer {
    bottom: 12px;
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
