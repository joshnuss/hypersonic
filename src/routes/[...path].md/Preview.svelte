<script>
  import { mode } from '$lib/settings'
  import { marked } from 'marked'

  export let markdown

  $: html = marked(markdown)
</script>

<div id="preview" class:visible={$mode == 'read'}>
  {@html html}
</div>

<style>
  #preview {
    height: 100%;
    display: none;
    margin: 0 3rem;
    padding: 2rem 0;

    &.visible {
      display: block;
    }
  }
</style>
