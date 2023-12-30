import { getRecent } from '$lib/usage.js'
import Fuse from 'fuse.js'

export function createSearch(list) {
  const sorted = sort(list)
  const fuse = new Fuse(sorted, {
    // isCaseSensitive: false,
    // includeScore: false,
    // shouldSort: true,
    // includeMatches: false,
    // findAllMatches: false,
    // minMatchCharLength: 1,
    // location: 0,
    // threshold: 0.6,
    // distance: 100,
    // useExtendedSearch: false,
    // ignoreLocation: false,
    // ignoreFieldNorm: false,
    // fieldNormWeight: 1,
    keys: ['title', 'path']
  })

  return {
    filter(pattern) {
      if (!pattern) return sorted

      return fuse.search(pattern).map((result) => result.item)
    }
  }
}

function sort(list) {
  if (list.length == 0) return []

  const recentPaths = getRecent()
  const recentFiles = new Array(recentPaths.length)
  const rest = []

  list.forEach((file) => {
    const index = recentPaths.indexOf(file.path)

    if (index > -1) {
      recentFiles[index] = file
    } else {
      rest.push(file)
    }
  })

  return [
    ...recentFiles,
    ...rest
  ]
}
