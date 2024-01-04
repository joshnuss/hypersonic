<script>
  import { goto } from '$app/navigation'
  import { onMount } from 'svelte'
  import { getRecent } from '$lib/usage'
  import Loader from '$lib/components/Loader.svelte'

  onMount(() => {
    const paths = getRecent()

    if (paths.length > 0) {
      goto(paths[0])
    } else {
      goto('/welcome.md')
    }
  })
</script>

<Loader/>
