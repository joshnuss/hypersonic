import { persisted } from 'svelte-persisted-store'

export const mode = persisted('mode', 'write')
export const vim = persisted('vim', false)
export const fontSize = persisted('fontSize', 20)
export const wordWrap = persisted('wordWrap', 'on')
export const lineNumbers = persisted('lineNumbers', 'off')
export const lastPage = persisted('lastPage', {})
