<script>
  import { page } from '$app/stores'
  import { signIn } from '@auth/sveltekit/client'
  import Icon from '@iconify/svelte'

  const providers = [
    {
      icon: 'mdi-github',
      key: 'github',
      label: 'GitHub',
      color: 'white',
      background: '#333'
    },
    {
      icon: 'mdi-google',
      key: 'google',
      label: 'Google',
      color: 'var(--blue-8)',
      background: 'white'
    }
  ]

  function click(provider) {
    const callbackUrl = $page.url.searchParams.get('callbackUrl') || '/dashboard'

    signIn(provider.key, { callbackUrl })
  }
</script>

<main>
  {#each providers as provider}
    <button
      style:background={provider.background}
      style:color={provider.color}
      on:click={() => click(provider)}>

      <Icon icon={provider.icon}/>
      <span>Sign in with {provider.label}</span>

    </button>
  {/each}
</main>

<style>
  @import "open-props/media.min";

  main {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: var(--size-6);

    --button-width: 100%;
    --font-size: var(--font-size-3);
    --padding: var(--size-2);

    gap: calc(var(--padding) * 1.5);

    @media (--sm-n-above) {
      --button-width: 250px;
      --font-size: var(--font-size-2);
    }

    @media (--md-n-above) {
      --button-width: 300px;
      --font-size: var(--font-size-3);
      --padding: var(--size-2);
    }

    @media (--lg-n-above) {
      --button-width: 330px;
      --font-size: var(--font-size-3);
      --padding: var(--size-2);
    }
  }

  button {
    font-size: var(--font-size);
    padding: var(--padding) calc(var(--padding) * 2);
    color: var(--gray-1);
    display: flex;
    gap: var(--size-2);
    align-items: center;
    justify-content: center;
    width: var(--button-width);
  }

</style>
