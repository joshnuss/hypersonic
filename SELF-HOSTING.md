# Self Hosting

Hypersonic can be self hosted **for free**.

## License

- Free usage is limited to one user.
- More than one user requires a paid license.
- It is based on the honor system.

## Overview

Self hosting is easy. It requires only a few things:

- **A Hosting account**: Free and low cost options work well, like [Vercel](https://vercel.com), [Railway](https://railway.app), [Netlify](https://www.netlify.com)
- **A Postgres Database**: There are free options, like [Neon](https://neon.tech), [Vercel](https://vercel.com), [Supabase](https://supabase.com)
- **Liveblocks**: Storage and syncing is done via [Liveblocks](https://liveblocks.io). They have a [free account](https://liveblocks.io/pricing) too.

- **OAuth credentials**: The project uses [Auth.js](https://authjs.dev), and all providers are supported. An easy-to-setup option is GitHub or Google. For a full list of providers, see [list of env vars](https://github.com/joshnuss/auth-env#supported-providers)
- **Sentry** (optional): error tracking is managed with [Sentry](https://sentry.io)
- **Fathom analytics** (optional): for analytics, create a [Fathom](https://usefathom.com) account.

## Setup

To setup using Vercel and Neon:

1. Download or fork the project
2. Create a new hosting project on [Vercel](https://vercel.com/dashboard)
3. Create a free [Neon](https://neon.tech) database
4. Migrate the database `DATABASE_URL=... pnpm prisma db push`
5. Create an OAuth account (ie [Github](https://github.com/settings/applications/new), [Google](https://support.google.com/cloud/answer/6158849?hl=en), etc)
6. Configure [environment variables](/.env.example) in the hosting account
7. **Optional**: Create a [Sentry](https://sentry.io) account
8. **Optional**: Create a [Fathom Analytics](https://usefathom.com) account

## Updates

To deploy updates, sync your fork with `git fetch upstream main` or download the latest version with `git pull` and re-deploy.

It's that simple!
