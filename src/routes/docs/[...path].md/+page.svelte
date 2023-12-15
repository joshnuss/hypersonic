<script>
  import { persisted } from 'svelte-persisted-store'
  import Editor from './Editor.svelte'

  export let user = { id: 1 }
  export let data

  const mode = persisted('mode', 'read')
  const vim = persisted('vim', false)
</script>

<svelte:head>
  <title>{data.path}.md</title>
</svelte:head>

{#key data.path}
  <Editor
    bind:mode={$mode}
    bind:vim={$vim}
    roomName="user-{user.id}"
    path={data.path}
  />
{/key}
