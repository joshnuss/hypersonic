<script>
  import { onMount, tick, createEventDispatcher } from 'svelte'
  import { MonacoBinding } from 'y-monaco'
  import * as monaco from 'monaco-editor'
  import { initVimMode } from 'monaco-vim'
  import { MonacoMarkdownExtension } from 'monaco-markdown'

  import { mode, vim, fontSize, wordWrap, lineNumbers, toggleMode } from '$lib/settings'

  export let provider
  export let yText

  const dispatch = createEventDispatcher()

  let element
  let editor
  let binding
  let vimMode

  $: editor?.updateOptions({
    fontSize: $fontSize,
    lineNumbers: $lineNumbers ? 'on' : 'off',
    wordWrap: $wordWrap ? 'on' :'off'
  })

  $: if ($vim && editor) { updateVim(editor) }

  onMount(async () => {
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
