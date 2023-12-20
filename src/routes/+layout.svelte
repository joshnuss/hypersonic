<script>
  import '../app.css'
  import { dev } from '$app/environment'
  import { PUBLIC_FATHOM_SITE_CODE } from '$env/static/public'
</script>

{#if !dev && PUBLIC_FATHOM_SITE_CODE}
  <script src="https://cdn.usefathom.com/script.js" data-site={PUBLIC_FATHOM_SITE_CODE} defer></script>
{/if}

<slot />
