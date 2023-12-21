<script>
  import '../app.css'
  import { onMount } from 'svelte'
  import { dev, browser } from '$app/environment'
  import { page } from '$app/stores'
  import { PUBLIC_FATHOM_SITE_CODE } from '$env/static/public'
  import * as Fathom from 'fathom-client'

  export let analyticsEnabled = !dev && PUBLIC_FATHOM_SITE_CODE

  onMount(() => {
    if (analyticsEnabled) {
      Fathom.load(PUBLIC_FATHOM_SITE_CODE)
    }
  })

  $: $page.url.pathname, browser && Fathom.trackPageview()
</script>

{#if analyticsEnabled}
  <script
    src="https://cdn.usefathom.com/script.js"
    data-site={PUBLIC_FATHOM_SITE_CODE}
    defer
  ></script>
{/if}

<slot />
