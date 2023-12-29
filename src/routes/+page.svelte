<script>
  import { signIn } from '@auth/sveltekit/client'
  import { page } from '$app/stores'
</script>

<h1>Hypersonic</h1>

<p>Multi-player markdown editor & wiki.</p>

{JSON.stringify($page.data)}

<button on:click={() => signIn('github', { callbackUrl: '/dashboard' })}>
  Sign In
</button>
