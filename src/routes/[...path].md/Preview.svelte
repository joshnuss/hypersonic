<script>
  import { mode } from '$lib/settings'
  import { marked } from 'marked'

  export let markdown

  $: html = marked(markdown)
</script>

<div id="preview" class:visible={$mode == 'read'}>
  {@html html}
</div>
