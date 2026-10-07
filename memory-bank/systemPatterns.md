# System patterns

## Layout

`SiteShell` is a sports-news desk: dark utility bar, panel masthead with a solid BD block, asphalt nav, then main, an asphalt newsletter band, and a three-column footer. Home (`HomeView`) keeps the desk sections as a news front: inline score ticker, lead story with a headline rail, stat strip, note cards, upcoming fixtures, and an HTML standings table.

Routes stay unprefixed. `/en`, `/pt`, and `/es` redirect 308 to the same path.

Component props follow the stepnee-admin shape: an `I*Props` interface beside the component, then `const Name = (props: INameProps) => { const { ... } = props }`. No parameter-list destructuring on components.

Component filenames are PascalCase (`SiteShell.tsx`, `HomeView.tsx`). Lib, data, and config files are camelCase. Route folders under `src/app` stay the public slug. Next.js reserved files keep the names the framework requires.

## Data

Seed lives in `src/data/domingo.ts`. `src/data/index.ts` derives tables from signed fixtures.

- Taça de Domingo fixtures build `pracaTable`. Win 3, draw 1. GP is goals for. SG is goal difference.
- Circuito da Tarde fixtures build `tardeTable`.
- Rodada da Copa does not enter the Taça de Domingo table.
- Seleção, mercado, and bastidores have notes and no signed official score.

## Types

Interfaces use an `I` prefix. Enums use an `Enum` suffix. See `memory-bank/api-patterns.md`. No `any`. Arrow functions only.

## Sports client

Editorial notes come from Brazil CMS: `GET {NEXT_PUBLIC_CMS_URL}/ai-articles?targetWebsite={NEXT_PUBLIC_WEBSITE_KEY}`. Defaults are `https://api.football360brazil.com/api` and `boladedomingo.com`. `src/lib/deskArticles.ts` maps the catalog onto `IArticle` and the desk renders that list. `articlesApis` uses the Axios `HttpService` for the same path. `SportsSync` warms the article query only.

Scheduled articles in the future and `publishState=needs_review` stay off the desk. If the catalog is empty or the host fails, pages fall back to `src/data/domingo.ts`.

Fixtures stay on the signed seed until `GET /football/matches?website=` returns rows whose two sides are praças or tardes. Club and federation extracts are dropped. A finished row links to `/resultados/[id]`, the súmula. Rodada da Copa still stays out of the Taça de Domingo table.

## Newsletter

`src/lib/newsletter.ts` posts `{ email, website }` to `{CMS}/subscriptions/subscribe`. `website` is the apex host. The email is trimmed and sent as typed. 201 and 200 show “Inscrição confirmada.” Already subscribed, 404, and 500 use the contract copy and never the raw “website not found” line. `/newsletter/unsubscribe` calls `GET /subscriptions/unsubscribe` once with `cache: "no-store"`.

Footer signup uses React Hook Form (`useForm`, `register`, `isSubmitting`). Client validation still calls `isValidEmail`. Submit still goes through `subscribeNewsletter`.
