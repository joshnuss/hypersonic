import { derived } from 'svelte/store'
import { page } from '$app/stores'

export const user = derived(page, $page => $page.data.session?.user)
