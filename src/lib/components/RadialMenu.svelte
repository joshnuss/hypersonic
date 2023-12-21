<script>
  export let count

  let open = false

  export function collapse() {
    open = false
  }

  function toggle() {
    open = !open
  }
</script>

<div class="radial-menu" class:open style="--count: {count}">
  <div class="submenu">
    <slot />
  </div>

  <button class="main" on:click={toggle}>
    <img src="/logo.svg" alt="logo" />
  </button>
</div>

<style>
  .submenu :global(button) {
    --slice: calc(180deg / calc(var(--count) - 1));
    --rotation: calc(var(--slice) * var(--index));
    --delay: calc(var(--index) * 80ms);

    position: absolute;
    z-index: var(--layer-1);
    opacity: 0;
    transform-origin: 15px, 15px;
    transform: scale(0.4);
    transition:
      all 0.2s var(--delay) var(--ease-elastic-2),
      background-color 0.3s var(--ease-2);
    border: solid 1px var(--gray-2);
    background: white;

    & :global(svg) {
      transform: rotate(calc(var(--index) * calc(calc(180deg - var(--slice)) - 1)));
    }

    &:hover {
      background-color: var(--gray-1);
      border-color: var(--gray-3);
    }
  }

  .open :global(button) {
    opacity: 1;
    transform: rotate(var(--rotation)) translate(-85px, 0px);
  }

  .radial-menu :global(button) {
    border-radius: var(--radius-4);
    border-color: none;
    aspect-ratio: var(--ratio-square);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: var(--font-size-4);
    width: 60px;
    background: var(--gray-8);
    color: var(--gray-2);
    box-shadow: var(--shadow-2);
    border: none;
  }

  button.main {
    position: absolute;
    z-index: var(--layer-2);
    background: var(--gray-8);
    color: white;
    box-shadow: none;
    transition: all 0.2s var(--ease-squish-5);

    &:hover {
      background: var(--gray-4);
      box-shadow: var(--shadow-5);
    }
  }
</style>
