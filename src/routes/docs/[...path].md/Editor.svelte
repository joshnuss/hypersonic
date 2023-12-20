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
  import { baseUrl } from 'marked-base-url'

  marked.use(baseUrl('/docs/'))

  export let mode = 'edit'
  export let roomName
  export let path
  export let vim = false

  let element
  let editor
  let binding
  let yTitle
  let documents
  let markdown = ''
  let vimMode

  $: html = marked(markdown)
  $: {
    const match = html.match(/<h1>([^<]+)<\/h1>/)

    if (match) {
      const title = match[1]

      if (yTitle && yTitle.toString() !== title) {
        yTitle.delete(0, yTitle.toString().length)
        yTitle.insert(0, title)
      }
    }
  }

  // Set up Liveblocks client
  const client = createClient({
    authEndpoint: '/api/liveblocks-auth'
  })

  onMount(() => {
    // Enter a multiplayer room
    const { room, leave } = client.enterRoom(roomName, {
      initialPresence: {}
    })

    const rootDoc = new Y.Doc()
    const provider = new LiveblocksProvider(room, rootDoc, { autoloadSubdocs: false })
    const persistence = new IndexeddbPersistence(room, rootDoc)

    provider.on('synced', () => {
      documents = rootDoc.getMap('documents')

      // Set up Yjs document, shared text, and Liveblocks Yjs provider
      let yDoc

      if (documents.has(`${path}.md`)) {
        yDoc = documents.get(`${path}.md`)
        yDoc.load()
      } else {
        yDoc =  new Y.Doc()
        documents.set(`${path}.md`, yDoc)
      }

      const yText = yDoc.getText('markdown')
      yTitle = yDoc.getText('title')

      yText.observe((e) => {
        markdown = e.target.toString()
      })

      provider.awareness.on('update', (e) => console.log(e))

      editor = monaco.editor.create(element, {
        value: '', // MonacoBinding overwrites this value with the content of type
        theme: 'vs-dark',
        language: 'markdown',
        minimap: { enabled: false },
        automaticLayout: true,
        fontSize: 24,
        wordWrap: 'on'
      })

      const extension = new MonacoMarkdownExtension()
      extension.activate(editor)

      updateVim()

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

      editor.addAction({
        // An unique identifier of the contributed action.
        id: 'toggle-vim',

        // A label of the action that will be presented to the user.
        label: 'Toggle Vim',

        // An optional array of keybindings for the action.
        keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyV],

        contextMenuGroupId: 'navigation',
        contextMenuOrder: 1.5,

        // Method that will be executed when the action is triggered.
        // @param editor The editor instance is passed in as a convenience
        run: () => toggleVim()
      })

      editor.addAction({
        // An unique identifier of the contributed action.
        id: 'open-command-palette',

        // A label of the action that will be presented to the user.
        label: 'Open command palette',

        // An optional array of keybindings for the action.
        keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyP],

        contextMenuGroupId: 'navigation',
        contextMenuOrder: 1.5,

        // Method that will be executed when the action is triggered.
        // @param editor The editor instance is passed in as a convenience
        run: () => {
          [...documents.entries()].forEach(([key]) => console.log(key))
        }
      })

      // Attach Yjs to Monaco editor
      binding = new MonacoBinding(
        yText,
        editor.getModel(),
        new Set([editor]),
        provider.awareness
      )

      editor.focus()
    })

    return () => {
      binding?.destroy()
      leave()
    }
  })

  async function toggleMode() {
    mode = mode == 'edit' ? 'read' : 'edit'
    await tick()
    editor.focus()
  }

  function toggleVim() {
    vim = !vim
    updateVim()
  }

  function updateVim() {
    if (vim) {
      vimMode = initVimMode(editor)
    } else {
      vimMode?.dispose()
    }
  }

  function keydown(e) {
    if (e.ctrlKey && e.code == 'KeyM') {
      e.preventDefault()
      toggleMode()
    }
  }
</script>

<svelte:window on:keydown={keydown} />

<div id="preview" class:visible={mode == 'read'}>
  {@html html}
</div>

<div id="editor" class:hidden={mode == 'read'} bind:this={element}></div>

<style>
  #editor {
    width: 100%;
    height: 100%;

    &.hidden {
      display: none;
    }
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
