<script>
  import { signIn, signOut } from '@auth/sveltekit/client'
  import { page } from '$app/stores'
  import { user } from '$lib/user'
</script>

<h1>Hypersonic</h1>

<p>Multi-player markdown editor & wiki.</p>

{JSON.stringify($page.data)}

<p>
  {#if $user}
    {#if $user.image}
      <span style="background-image: url('{$user.image}')" class="avatar" />
    {/if}
    <span class="signedInText">
      <small>Signed in as</small>
      <br />
      <strong>{$user.name}</strong>
    </span>
    <button on:click={() => signOut()} class="button">Sign out</button>
  {:else}
    <span class="notSignedInText">You are not signed in</span>
    <button on:click={() => signIn('github', { callbackUrl: '/dashboard' })}>
      Sign In with GitHub
    </button>
  {/if}
</p>
