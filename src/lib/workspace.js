import LiveblocksProvider from '@liveblocks/yjs'
import { createClient } from '@liveblocks/client'
import * as Y from 'yjs'
import { IndexeddbPersistence } from 'y-indexeddb'
import { titlelize } from '$lib/strings'
import { default as welcomeTemplate } from '$templates/welcome.md?raw'

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

  provider.awareness.on('change', (e) => console.log('awareness:change', e))

  return new Promise((resolve) => {
    provider.on('synced', async () => {
      const documents = rootDoc.getMap('documents')
      const titles = rootDoc.getMap('titles')

      const workspace = {
        documents,
        titles,
        provider,
        persistence,
        leave: () => leave(),

        async createDocument(path) {
          const doc = new Y.Doc()

          documents.set(path, doc)

          if (path == 'welcome.md') {
            await this.update(doc, { path, title: 'Welcome', text: welcomeTemplate })
          } else {
            const withoutExtension = path.replace(/.md$/, '')
            const title = titlelize(withoutExtension)
            const text = `# ${title}`

            await this.update(doc, { path, title, text })
          }

          return doc
        },

        async update(doc, { path, title, text }) {
          doc.getText('title').insert(0, title)
          doc.getText('markdown').insert(0, text)

          titles.set(path, title)
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

                titles.set(path, newTitle)
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
