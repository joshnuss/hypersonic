import { goto } from '$app/navigation'

export function open(path, newTab = false) {
  if (newTab) {
    const location = window.location
    const base = new URL(location.protocol + '//' + location.host)
    const url = new URL(path, base)
    window.open(url, '_blank')
  }
  else {
    console.log({path})
    goto(path)
  }
}
