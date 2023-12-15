<script>
  import { persisted } from 'svelte-persisted-store'
  import Editor from './Editor.svelte'

  export let user = { id: 1 }
  export let data

  const mode = persisted('mode', 'read')
</script>

<svelte:head>
  <title>{data.path}.md</title>
</svelte:head>

{#key data.path}
  <Editor
    bind:mode={$mode}
    roomName="user-{user.id}"
    path={data.path}
  />
{/key}
