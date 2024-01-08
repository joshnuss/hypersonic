<div class="ring"><div></div><div></div><div></div><div></div></div>

<style>
  .ring {
    --size: 120px;
    --half: calc(var(--size) / 2);
    --margin: 12px;

    position: fixed;
    left: calc(50% - var(--half));
    top: calc(50% - var(--half));
    width: var(--size);
    height: var(--size);

    animation: var(--animation-slide-up) forwards;
  }

  .ring div {
    box-sizing: border-box;
    display: block;
    position: absolute;
    width: calc(var(--size) - var(--margin));
    height: calc(var(--size) - var(--margin));
    margin: var(--margin);
    border: var(--margin) solid var(--violet-4);
    border-radius: 50%;
    animation: rotate 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
    border-color: var(--violet-4) transparent transparent transparent;
  }

  .ring div:nth-child(1) {
    animation-delay: -0.45s;
  }

  .ring div:nth-child(2) {
    animation-delay: -0.3s;
  }

  .ring div:nth-child(3) {
    animation-delay: -0.15s;
  }

  @keyframes rotate {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
</style>
