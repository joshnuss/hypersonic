<script>
  import { signIn } from '@auth/sveltekit/client'
  import { page } from '$app/stores'
</script>

<section class="hero">
  <div class="logo">
    <img src="/logo.svg" alt="Logo"/>

    <div class="titles">
      <h1>Hypersonic</h1>
      <p>Multi-player markdown editor & wiki.</p>
      <button on:click={() => signIn('github', { callbackUrl: '/open'})}>
        Sign in with GitHub
      </button>
    </div>
  </div>
</section>

<style>
  .hero {
    margin: 4rem 0;
    padding: 1rem;
    display: flex;
    flex-direction: column;
  }

  .logo {
    align-self: center;
    display: flex;
    align-items: center;
    gap: 2rem;

    & img {
      align-self: flex-start;
    }
  }

  .titles {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 0;
  }

  h1 {
    font-size: 5rem;
    color: var(--violet-5);
    margin: 2rem 0 0;
  }

  p {
    font-size: var(--font-size-4);
  }

  button {
    margin-top: 1rem;
    align-self: flex-start;
    font-size: 1rem;
    font-weight: normal;
    padding: 0.75rem 1.5rem;
    color: var(--gray-1);
    background: var(--violet-5);
    border-radius: var(--radius-2);
    border: solid 1px var(--voilet-4);
    transition: 0.3s all var(--ease-elastic-1);

    &:hover {
      box-shadow: 0 5px 25px rgba(145, 92, 182, .4);
    }
  }
</style>
