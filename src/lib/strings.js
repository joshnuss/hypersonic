export function titlelize(path) {
  const [first, ...rest] = path.replace(/[-_\/\\]/g, ' ')

  return first.toUpperCase() + rest.join('')
}
