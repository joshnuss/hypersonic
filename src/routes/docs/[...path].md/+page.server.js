export const ssr = false

export function load({ params }) {
  const path = params.path

  return { path }
}
