import Fuse from 'fuse.js'

export function createSearch(list) {
  const fuse = new Fuse(list, {
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
      if (!pattern) return list

      return fuse.search(pattern).map((result) => result.item)
    }
  }
}
