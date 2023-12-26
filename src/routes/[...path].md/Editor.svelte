<script>
  import { onMount, tick, createEventDispatcher } from 'svelte'
  import LiveblocksProvider from '@liveblocks/yjs'
  import * as Y from 'yjs'
  import { IndexeddbPersistence } from 'y-indexeddb'
  import { MonacoBinding } from 'y-monaco'
  import * as monaco from 'monaco-editor'
  import { initVimMode } from 'monaco-vim'
  import { MonacoMarkdownExtension } from 'monaco-markdown'
  import { marked } from 'marked'

  import { mode, vim, fontSize, wordWrap, lineNumbers, toggleMode } from '$lib/settings'

  export let room
  export let documents
  export let titles
  export let title
  export let path
  export let markdown = ''

  const dispatch = createEventDispatcher()

  let element
  let editor
  let binding
  let provider
  let yTitle
  let yText
  let vimMode

  $: html = marked(markdown)
  $: saveTitle(html)

  function saveTitle(html) {
    const match = html.match(/<h1>([^<]+)<\/h1>/)

    title = match ? match[1] : 'Untitled'

    if (yTitle && yTitle.toString() !== title) {
      yTitle.delete(0, yTitle.toString().length)
      yTitle.insert(0, title)
      titles.set(`${path}.md`, title)
    }
  }

  $: editor?.updateOptions({
    fontSize: $fontSize,
    lineNumbers: $lineNumbers ? 'on' : 'off',
    wordWrap: $wordWrap ? 'on' :'off'
  })

  $: if ($vim && editor) { updateVim(editor) }

  async function loadDocument() {
    const rootDoc = new Y.Doc()
    provider = new LiveblocksProvider(room, rootDoc, { autoloadSubdocs: false })
    const persistence = new IndexeddbPersistence(room, rootDoc)

    return new Promise((resolve) => {
      provider.on('synced', () => {
        documents = rootDoc.getMap('documents')
        titles = rootDoc.getMap('titles')

        // Set up Yjs document, shared text, and Liveblocks Yjs provider
        let yDoc

        if (documents.has(`${path}.md`)) {
          yDoc = documents.get(`${path}.md`)
          yDoc.load()
        } else {
          yDoc = new Y.Doc()
          documents.set(`${path}.md`, yDoc)
          const titleized = titlelize(path)
          yDoc.getText('title').insert(0, titleized)
          yDoc.getText('markdown').insert(0, `# ${titleized}`)
          titles.set(`${path}.md`, titleized)
          $mode = 'write'
        }

        yText = yDoc.getText('markdown')
        yTitle = yDoc.getText('title')

        yText.observe((e) => {
          markdown = e.target.toString()
        })

        provider.awareness.on('update', (e) => console.log('awareness:update', e))

        resolve()
      })
    })
  }

  onMount(async () => {
    await loadDocument()

    if (editor) {
      console.log('editor was already loaded')
      editor.dispose()
    }

    editor = createEditor()
    editor.focus()

    return () => {
      binding?.destroy()
      editor?.dispose()
    }
  })

  $: editor && focus($mode)

  function createEditor() {
    const editor = monaco.editor.create(element, {
      value: '', // MonacoBinding overwrites this value with the content of type
      theme: 'vs-dark',
      language: 'markdown',
      minimap: { enabled: false },
      automaticLayout: true,
      codeLens: false,
      fontSize: $fontSize,
      lineNumbers: $lineNumbers ? 'on' : 'off',
      lineNumbersMinChars: 3,
      wordWrap: $wordWrap ? 'on' :'off',
      quickSuggestions: {
        strings: false,
        comments: false,
        other: false
      }
    })

    addExtensions(editor)
    addActions(editor)
    updateVim(editor)

    binding = new MonacoBinding(yText, editor.getModel(), new Set([editor]), provider.awareness)

    return editor
  }

  function addExtensions(editor) {
    const extension = new MonacoMarkdownExtension()
    extension.activate(editor)
  }

  function addActions(editor) {
    editor.addAction({
      id: 'toggle-read-write',
      label: 'Toggle Read/Write Mode',
      keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyM],
      contextMenuGroupId: 'navigation',
      contextMenuOrder: 1.5,
      run: () => toggleMode()
    })

    editor.addAction({
      id: 'toggle-vim',
      label: 'Toggle Vim',
      keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyV],
      contextMenuGroupId: 'navigation',
      contextMenuOrder: 1.5,
      run: () => toggleVim()
    })

    editor.addAction({
      id: 'open-command-palette',
      label: 'Open command palette',
      keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyK],
      contextMenuGroupId: 'navigation',
      contextMenuOrder: 1.5,
      run: () => dispatch('find')
    })

    editor.addAction({
      id: 'new-file',
      label: 'New file',
      keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyMod.Alt | monaco.KeyCode.KeyN],
      contextMenuGroupId: 'navigation',
      contextMenuOrder: 1.5,
      run: () => dispatch('create')
    })
  }

  async function focus() {
    await tick()
    editor.focus()
  }

  function toggleVim() {
    $vim = !$vim
    updateVim(editor)
  }

  function updateVim(editor) {
    if ($vim) {
      if (!vimMode) vimMode = initVimMode(editor)
    } else {
      vimMode?.dispose()
      vimMode = null
    }
  }

  function titlelize(path) {
    const [first, ...rest] = path.replace(/[-_\/\\]/, ' ')

    return first.toUpperCase() + rest.join('')
  }
</script>

<div id="editor" class:hidden={$mode == 'read'} bind:this={element}></div>

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
