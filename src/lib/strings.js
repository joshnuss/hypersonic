export function titlelize(path) {
  const [first, ...rest] = path.replace(/[-_\/\\]/, ' ')

  return first.toUpperCase() + rest.join('')
}
