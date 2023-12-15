<script>
  import { onMount } from 'svelte'
  import { createClient } from '@liveblocks/client'
  import LiveblocksProvider from '@liveblocks/yjs'
  import * as Y from 'yjs'
  import Quill from 'quill'
  import { QuillBinding } from 'y-quill'
  import QuillCursors from 'quill-cursors'

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
    const yText = yDoc.getText('quill')
    const yProvider = new LiveblocksProvider(room, yDoc)

    // Attach cursors plugin
    Quill.register('modules/cursors', QuillCursors)

    // Set up Quill editor and modules
    const quill = new Quill(element, {
      placeholder: 'Start collaborating…',
      theme: 'snow',
      modules: {
        cursors: true,
        toolbar: [[{ header: [1, 2, false] }], ['bold', 'italic', 'underline'], ['code-block']],
        history: {
          // Local undo shouldn’t undo changes made by other users
          userOnly: true
        }
      }
    })

    // Attach Yjs to Quill
    const binding = new QuillBinding(yText, quill, yProvider.awareness)

    return () => {
      binding.destroy()
      leave()
    }
  })
</script>

<div bind:this={element}></div>
