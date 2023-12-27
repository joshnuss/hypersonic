<script>
  import { tick } from 'svelte'
  import { mode } from '$lib/settings'

  export let text
  export let html

  $: html, wireTasklists()

  async function wireTasklists() {
    // make sure html is rendered
    await tick()

    const checkboxes = [...document.querySelectorAll('#preview input[type="checkbox"]')]

    checkboxes.forEach((node) => {
      const listItem = node.parentElement
      const offset = listItem.dataset.offset

      if (node.changeHandler) return

      node.changeHandler = true
      node.disabled = false

      node.addEventListener('change', () => {
        if (node.checked) {
          text.applyDelta([{ retain: offset }, { delete: 5 }, { insert: '- [x]' }])
        } else {
          text.applyDelta([{ retain: offset }, { delete: 5 }, { insert: '- [ ]' }])
        }
      })
    })
  }
</script>

<div id="preview" class:visible={$mode == 'read'}>
  {@html html}
</div>

<style>
  @import 'open-props/media.min';

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

  #preview :global(ul:has(input[type='checkbox'])) {
    padding: 0;
    list-style: none;
  }

  #preview :global(li:has(input:checked)) {
    text-decoration: line-through;
    color: var(--gray-7);
  }
</style>
