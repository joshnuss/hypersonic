import { get } from 'svelte/store'
import { persisted } from 'svelte-persisted-store'
import { user } from '$lib/user'

const MAX = 5

export const usage = persisted('usage', {})

export function trackOpened(path) {
  const userId = get(user).id
  const key = `user:${userId}`
  const $usage = get(usage)

  usage.update(() => {
    let list = $usage[key] || []

    list = [path, ...list.filter((x) => x != path)]

    if (list.length > MAX) {
      list = list.slice(0, MAX)
    }

    return {
      ...$usage,
      [key]: list
    }
  })
}

export function getRecent() {
  const userId = get(user).id
  const key = `user:${userId}`
  const $usage = get(usage)[key]

  return $usage || []
}
