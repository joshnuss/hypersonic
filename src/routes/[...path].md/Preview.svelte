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

      node.disabled = false

      node.addEventListener('change', () => {
        handleChange(node, offset)
      })

      node.addEventListener('click', (e) => {
        e.stopPropagation()
      })

      listItem.addEventListener('click', (e) => {
        e.stopPropagation()
        node.checked = !node.checked

        handleChange(node, offset)
      })
    })
  }

  function handleChange(node, offset) {
    if (node.checked) {
      text.applyDelta([{ retain: offset }, { delete: 5 }, { insert: '- [x]' }])
    } else {
      text.applyDelta([{ retain: offset }, { delete: 5 }, { insert: '- [ ]' }])
    }
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

  #preview :global(ul:has(input[type='checkbox']) ul) {
    padding: 0 10px;
  }

  #preview :global(li:has(> input:checked)) {
    text-decoration: line-through;
    color: var(--gray-6);
  }

  #preview :global(kbd) {
    margin: 0px 0.1em;
    padding: 0.1em 0.6em;
    border-radius: var(--radius-2);
    border: 1px solid var(--gray-5);
    color: var(--gray-8);
    line-height: 1.4;
    font-family: 'Noto Sans Mono';
    font-size: 13px;
    display: inline-block;
    box-shadow: var(--shadow-2), inset 0px 0px 0px 1px var(--gray-4);
    background: var(--gray-4);
    text-shadow: 0 1px 0 var(--gray-2);
  }
</style>
