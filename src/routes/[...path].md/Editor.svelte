<script>
  import { onMount  } from 'svelte'
  import { keymap } from '@codemirror/view'
  import { markdown } from "@codemirror/lang-markdown"
  import { basicDarkTheme } from 'cm6-theme-basic-dark'
  import { lineNumbers as lineNumbersExtension } from "@codemirror/view"
  import { vim as vimExtension } from '@replit/codemirror-vim'
  import { setup } from '$lib/codemirror'
  import { yCollab, yUndoManagerKeymap } from 'y-codemirror.next'
  import { vim, fontSize, wordWrap, lineNumbers } from '$lib/settings'
  import { EditorView } from 'codemirror'
  import { EditorState } from '@codemirror/state'

  export let provider
  export let doc

  let loaded = false
  let value = ''
  let element
  let view

  $: extensions = [
    keymap.of([
      ...yUndoManagerKeymap
    ]),
    setup,
    markdown(),
    ...($wordWrap ? [EditorView.lineWrapping] : []),
    ...($vim ? [vimExtension()] : []),
    ...($lineNumbers ? [lineNumbersExtension()] : []),
    yCollab(doc.text, provider.awareness),
    basicDarkTheme
  ]

  onMount(async () => {
    const state = EditorState.create({
      doc: doc.text.toString(),
      extensions
    })

    element = document.querySelector('#editor')
    view = new EditorView({ state, parent: element })
  })

  $: element && element.focus()
  $: view && update(extensions)

  function update() {
    const state = EditorState.create({
      doc: doc.text.toString(),
      extensions
    })

    view.setState(state)
  }
</script>

<div id="editor" style:--editor-font-size='{$fontSize}px'/>

<style>
  #editor {
    width: 100%;
    height: 100%;

    &.hidden {
      display: none;
    }
  }

	:global(.cm-content), :global(.cm-gutter) {
		font-family: 'Noto Sans Mono';
		font-size: var(--editor-font-size);
	}
</style>
