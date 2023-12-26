import LiveblocksProvider from '@liveblocks/yjs'
import { createClient } from '@liveblocks/client'
import * as Y from 'yjs'
import { IndexeddbPersistence } from 'y-indexeddb'
import { titlelize } from '$lib/strings'

const client = createClient({
  authEndpoint: '/api/liveblocks-auth'
})

export function getWorkspace(user) {
  const roomName = `user:${user.id}`
  const { room, leave } = client.enterRoom(roomName, {
    initialPresence: {}
  })

  const rootDoc = new Y.Doc()
  const provider = new LiveblocksProvider(room, rootDoc, { autoloadSubdocs: false })
  const persistence = new IndexeddbPersistence(room, rootDoc)

  provider.awareness.on('update', (e) => console.log('awareness:update', e))

  return new Promise((resolve) => {
    provider.on('synced', async () => {
      const documents = rootDoc.getMap('documents')
      const titles = rootDoc.getMap('titles')

      const workspace = {
        room,
        rootDoc,
        documents,
        titles,
        provider,
        persistence,
        leave: () => leave(),

        async createDocument(path) {
          const doc = new Y.Doc()

          documents.set(path, doc)

          const withoutExtension = path.replace(/.md$/, '')
          const title = titlelize(withoutExtension)

          doc.getText('title').insert(0, title)
          doc.getText('markdown').insert(0, `# ${title}`)

          titles.set(path, title)

          return doc
        },

        async loadDocument(path) {
          let doc
          let existing

          if (documents.has(path)) {
            doc = documents.get(path)
            doc.load()
            existing = true
          } else {
            doc = await this.createDocument(path)
            existing = false
          }

          return {
            doc: {
              title: doc.getText('title'),
              text: doc.getText('markdown'),
              updateTitle(newTitle) {
                if (this.title.toString() == newTitle) {
                  return
                }

                this.title.delete(0, this.title.toString().length)
                this.title.insert(0, newTitle)

                titles.set(`${path}.md`, newTitle)
              }
            },
            existing
          }
        }
      }

      resolve(workspace)
    })
  })
}
