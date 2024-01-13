import { redirect } from '@sveltejs/kit'

export async function load({ locals }) {
  const session = await locals.getSession()
  if (session) {
    throw redirect(302, `/open`)
  }
  return {}
}
