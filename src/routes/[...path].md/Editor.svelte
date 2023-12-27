<script>
  import { onMount, tick } from 'svelte'
  import { mode } from '$lib/settings'
  import { keymap } from '@codemirror/view'
  import { markdown } from '@codemirror/lang-markdown'
  import { lineNumbers as lineNumbersExtension } from '@codemirror/view'
  import { vim as vimExtension } from '@replit/codemirror-vim'
  import { setup } from '$lib/codemirror/setup'
  import { theme } from '$lib/codemirror/theme'
  import { yCollab, yUndoManagerKeymap } from 'y-codemirror.next'
  import { vim, fontSize, wordWrap, lineNumbers } from '$lib/settings'
  import { EditorView } from 'codemirror'
  import { EditorState } from '@codemirror/state'

  export let provider
  export let doc

  let element
  let view

  $: extensions = [
    keymap.of([...yUndoManagerKeymap]),
    setup,
    markdown(),
    ...($wordWrap ? [EditorView.lineWrapping] : []),
    ...($vim ? [vimExtension()] : []),
    ...($lineNumbers ? [lineNumbersExtension()] : []),
    yCollab(doc.text, provider.awareness),
    theme
  ]

  onMount(async () => {
    const state = EditorState.create({
      doc: doc.text.toString(),
      extensions
    })

    element = document.querySelector('#editor')
    view = new EditorView({ state, parent: element })
  })

  $: if (element) {
    tick().then(() => {
      element.focus()
    })
  }

  $: view && update(extensions)

  function update() {
    const state = EditorState.create({
      doc: doc.text.toString(),
      extensions
    })

    view.setState(state)
  }
</script>

<div id="editor" class:hidden={$mode !== 'write'} style:--editor-font-size="{$fontSize}px" />

<style>
  #editor {
    width: 100%;
    height: 100%;

    &.hidden {
      display: none;
    }
  }

  :global(.cm-content),
  :global(.cm-gutter) {
    font-family: 'Noto Sans Mono';
    font-size: var(--editor-font-size);
  }

  :global(.cm-gutterElement) {
    min-width: 3ch !important;
    padding-right: 10px !important;
  }

  :global(.cm-ySelectionInfo) {
    border-radius: 3px 3px 3px 0;
    padding: 2px 7px !important;
    color: var(--gray-8);
    font-family: Inter;
  }

  :global(.cm-activeLine),
  :global(.cm-activeLineGutter) {
    box-shadow:
      0px -1px var(--gray-9),
      0px 1px var(--gray-9);
  }
</style>
