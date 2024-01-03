import { SvelteKitAuth } from '@auth/sveltekit'
import { AUTH_SECRET } from '$env/static/private'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { providers } from 'auth-env'
import { db } from '$lib/server/db'

export const handle = SvelteKitAuth({
  adapter: PrismaAdapter(db),
  secret: AUTH_SECRET,
  providers,

  pages: {
    signin: '/signin',
    newUser: '/welcome.md'
  },
  callbacks: {
    async session({ session, user }) {
      session.user.id = user.id

      return session
    }
  }
})
/*
import { sequence } from "@sveltejs/kit/hooks";
import { handleErrorWithSentry, sentryHandle } from "@sentry/sveltekit";
import * as Sentry from '@sentry/sveltekit';
import { PUBLIC_SENTRY_DSN } from '$env/static/public'
import { dev } from '$app/environment'

Sentry.init({
  dsn: PUBLIC_SENTRY_DSN,
  enabled: !dev,
  tracesSampleRate: 1.0
});

// If you have custom handlers, make sure to place them after `sentryHandle()` in the `sequence` function.
export const handle = sequence(sentryHandle());

// If you have a custom error handler, pass it to `handleErrorWithSentry`
export const handleError = handleErrorWithSentry();
*/
