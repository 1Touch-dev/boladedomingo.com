# Tech context

## Stack

- Next.js 15.5 App Router, React 19, react-hook-form, TanStack Query, Axios
- Tailwind CSS v4 via `@tailwindcss/postcss`
- Fonts: Newsreader (headlines), Outfit (body)
- Package manager: Yarn Classic. Do not use npm. Do not commit `package-lock.json`.

## Scripts

- `yarn dev`
- `yarn lint`
- `yarn build`
- `yarn precommit` runs lint, then build
- `prepare` runs husky 9.1.7
- `.husky/pre-commit` and `.husky/pre-push` run `yarn precommit`

## Deploy

`amplify.yml` uses Node 20, `yarn install --frozen-lockfile`, then `yarn build`. Artifact is `.next`.

## Constraints

- Portuguese only. Locale `pt-BR`. Time zone `America/Sao_Paulo`.
- Palette: page `#F1EFEA`, asphalt `#231910`, accent `#9A3412`, highlight `#5B4636`.
- No official federation or club tables. No official Brasileirão, Copa do Brasil, or Libertadores table. No named rosters.
- `outputFileTracingRoot` is pinned to this app because the parent CMS folder has its own `node_modules`.
