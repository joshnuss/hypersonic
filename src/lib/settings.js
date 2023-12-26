import { persisted } from 'svelte-persisted-store'

export const mode = persisted('mode', 'write')
export const vim = persisted('vim', false)
export const fontSize = persisted('fontSize', 20)
export const wordWrap = persisted('wordWrap', true)
export const lineNumbers = persisted('lineNumbers', false)
export const lastPage = persisted('lastPage', {})

export function toggleMode() {
  mode.update(($mode) => $mode == 'write' ? 'read' : 'write')
}
