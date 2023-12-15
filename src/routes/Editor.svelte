<script>
  import { onMount, tick } from 'svelte'
  import { createClient } from '@liveblocks/client'
  import LiveblocksProvider from '@liveblocks/yjs'
  import * as Y from 'yjs'
  import { IndexeddbPersistence } from 'y-indexeddb'
  import { MonacoBinding } from 'y-monaco'
  import * as monaco from 'monaco-editor'
  import { initVimMode } from 'monaco-vim'
  import { MonacoMarkdownExtension } from 'monaco-markdown'
  import { marked } from 'marked'

  let element
  let editor
  let mode = 'editor'
  let markdown = ''

  // Set up Liveblocks client
  const client = createClient({
    authEndpoint: '/api/liveblocks-auth'
  })

  onMount(() => {
    // Enter a multiplayer room
    const { room, leave } = client.enterRoom('my-room', {
      initialPresence: {}
    })

    // Set up Yjs document, shared text, and Liveblocks Yjs provider
    const yDoc = new Y.Doc()
    const yText = yDoc.getText('text')
    const provider = new LiveblocksProvider(room, yDoc)

    const persistence = new IndexeddbPersistence(room, yDoc)

    yText.observe((e) => {
      markdown = e.target.toString()
    })

    editor = monaco.editor.create(element, {
      value: '', // MonacoBinding overwrites this value with the content of type
      theme: 'vs-dark',
      language: 'markdown',
      minimap: { enabled: false },
      automaticLayout: true,
      fontSize: 24,
      scrollbar: {
        vertical: 'auto',
        horizontal: 'auto'
      }
    })

    const vimMode = initVimMode(editor)

    const extension = new MonacoMarkdownExtension()
    extension.activate(editor)

    editor.addAction({
      // An unique identifier of the contributed action.
      id: 'toggle-markdown-preview',

      // A label of the action that will be presented to the user.
      label: 'Toggle Markdown Preview',

      // An optional array of keybindings for the action.
      keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyM],

      contextMenuGroupId: 'navigation',
      contextMenuOrder: 1.5,

      // Method that will be executed when the action is triggered.
      // @param editor The editor instance is passed in as a convenience
      run: () => {
        toggleMode()
      }
    })

    editor.focus()

    // Attach Yjs to Monaco editor
    const binding = new MonacoBinding(
      yText,
      editor.getModel(),
      new Set([editor]),
      provider.awareness
    )

    return () => {
      binding.destroy()
      leave()
    }
  })

  async function toggleMode() {
    mode = mode == 'editor' ? 'preview' : 'editor'
    await tick()
    editor.focus()
  }

  function keydown(e) {
    if (e.ctrlKey && e.code == 'KeyM') {
      e.preventDefault()
      toggleMode()
    }
  }
</script>

<svelte:window on:keydown={keydown} />

<div id="preview" class:preview={mode == 'preview'}>
  {@html marked(markdown)}
</div>

<div id="editor" class:preview={mode == 'preview'} bind:this={element}></div>

<style>
  #editor {
    width: 100%;
    height: 100%;

    &.preview {
      display: none;
    }
  }

  #preview {
    display: none;
    padding: 3rem;

    &.preview {
      display: block;
    }
  }

  #preview :global(h1) {
    margin: 2rem 0;
  }

  #preview :global(h2) {
    margin: 1.5rem 0;
  }

  #preview :global(p) {
    margin: 1rem 0;
  }

  :global(.yRemoteSelection) {
    background-color: rgb(250, 129, 0, 0.5);
  }

  :global(.yRemoteSelectionHead) {
    position: absolute;
    border-left: orange solid 2px;
    border-top: orange solid 2px;
    border-bottom: orange solid 2px;
    height: 100%;
    box-sizing: border-box;
  }

  :global(.yRemoteSelectionHead::after) {
    position: absolute;
    content: ' ';
    border: 3px solid orange;
    border-radius: 4px;
    left: -4px;
    top: -5px;
  }
</style>
