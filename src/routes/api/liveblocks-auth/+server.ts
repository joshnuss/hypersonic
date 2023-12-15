import { Liveblocks } from '@liveblocks/node'
import { SECRET_LIVEBLOCKS_KEY } from '$env/static/private'

const liveblocks = new Liveblocks({
  secret: SECRET_LIVEBLOCKS_KEY
})

export async function POST({ request }) {
  // Get the current user from your database
  const user = { id: '1', info: { name: 'Josh' } } //__getUserFromDB__(request)

  // Start an auth session inside your endpoint
  const session = liveblocks.prepareSession(
    user.id,
    { userInfo: user.info } // Optional
  )

  // Implement your own security, and give the user access to the room
  const { room } = await request.json()
  // if (room && __shouldUserHaveAccess__(user, room)) {
  //   session.allow(room, session.FULL_ACCESS)
  // }
  session.allow(room, session.FULL_ACCESS)

  console.log({ room, user })

  // Authorize the user and return the result
  const { status, body } = await session.authorize()
  return new Response(body, { status })
}
