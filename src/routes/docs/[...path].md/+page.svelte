<script>
  import Editor from './Editor.svelte'

  export let user = { id: 1 }
  export let data

  let mode = 'edit'
</script>

<svelte:head>
  <title>{data.path}.md</title>
</svelte:head>

{#key data.path}
  <Editor
    bind:mode
    roomName="user-{user.id}"
    path={data.path}
  />
{/key}
