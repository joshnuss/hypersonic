<script>
  import { onMount } from 'svelte'
  import { createClient } from '@liveblocks/client'
  import LiveblocksProvider from '@liveblocks/yjs'
  import * as Y from 'yjs'

  import { MonacoBinding } from 'y-monaco'
  import * as monaco from 'monaco-editor'

  let element

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

    const editor = monaco.editor.create(element, {
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
</script>

<div id="editor" bind:this={element}></div>

<style>
  #editor {
    width: 100%;
    height: 100%;
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
