<script>
  import { onMount } from 'svelte'
  import { getRecent } from '$lib/mru'

  let recent

  onMount(() => {
    recent = getRecent()
  })
</script>

<h1>Dashboard</h1>


{#if recent}
  <h2>Recent</h2>

  <ul>
    {#each recent as path}
      <li>
        <a href={path}>{path}</a>
      </li>
    {/each}
  </ul>
{/if}
