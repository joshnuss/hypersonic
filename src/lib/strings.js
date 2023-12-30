export function titlelize(path) {
  const parts = path.split('/')
  const name = parts.pop()
  const [first, ...rest] = name.replace(/[-_\/\\]/g, ' ')

  return first.toUpperCase() + rest.join('')
}
