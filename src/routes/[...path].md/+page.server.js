import { redirect } from '@sveltejs/kit'

export const ssr = false

export async function load({ url, params, locals }) {
  const path = params.path
  const session = await locals.getSession()

  if (!session?.user) {
    throw redirect(303, `/auth/signin?callbackUrl=${url}`)
  }

  return { path }
}
