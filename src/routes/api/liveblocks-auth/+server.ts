import { Liveblocks } from '@liveblocks/node'
import { SECRET_LIVEBLOCKS_KEY } from '$env/static/private'
import { error } from '@sveltejs/kit'

const liveblocks = new Liveblocks({
  secret: SECRET_LIVEBLOCKS_KEY
})

export async function POST({ request, locals }) {
  const { user } = await locals.getSession()

  if (!user) {
    throw error(401)
  }

  const session = liveblocks.prepareSession(user.id, user)

  // Implement your own security, and give the user access to the room
  const { room } = await request.json()

  if (room && room.startsWith('user:') && room.split(':')[1] == user.id.toString()) {
    session.allow(room, session.FULL_ACCESS)
  }

  // Authorize the user and return the result
  const { status, body } = await session.authorize()
  return new Response(body, { status })
}
