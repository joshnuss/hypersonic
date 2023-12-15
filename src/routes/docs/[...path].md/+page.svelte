<script>
  import Editor from './Editor.svelte'

  export let user = { id: 1 }
  export let data
</script>

<svelte:head>
  <title>{data.path}.md</title>
</svelte:head>

<Editor roomName="user-{user.id}" path={data.path} />
