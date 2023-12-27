import { get } from 'svelte/store'
import { persisted } from 'svelte-persisted-store'
import { user } from '$lib/user'

const MAX = 5

export const mru = persisted('mru', {})

export function trackOpened(path) {
  const userId = get(user).id
  const key = `user:${userId}`
  const $mru = get(mru)

  mru.update(() => {
    let list = $mru[key] || []

    list = [path, ...list.filter(x => x != path)]

    if (list.length > MAX) {
      list = list.slice(0, MAX)
    }

    return {
      ...$mru,
      [key]: list
    }
  })
}

export function getRecent() {
  const userId = get(user).id
  const key = `user:${userId}`
  const $mru = get(mru)[key]

  return $mru || []
}
