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
        Free Beta Access
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
    padding: 1rem;
    color: var(--gray-2);
    background: var(--violet-5);
    border-radius: var(--radius-2);
  }
</style>
