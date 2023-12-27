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
  @import "open-props/media.min";

  #preview {
    height: 100%;
    display: none;
    margin: 1rem;

    &.visible {
      display: block;
    }

    @media (--sm-n-above) {
      margin: 2rem 3rem;
    }

    @media (--md-n-above) {
      margin: 3rem 5rem;
    }

    @media (--lg-n-above) {
      margin: 4rem 6rem;
    }
  }
</style>
