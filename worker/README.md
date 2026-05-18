# Telegram bridge — Cloudflare Worker

Receives the recorded verification video from the browser and forwards it to a
Telegram chat via Bot API. Cloudflare Workers accept request bodies up to
**100 MB on the free plan**, so the browser can upload at full quality
(1280×720 @ ~4 Mbps) without the Vercel function body cap getting in the way.

## Deploy

```sh
npm install
npx wrangler login              # opens browser, signs you in to Cloudflare
npx wrangler secret put TELEGRAM_BOT_TOKEN
npx wrangler secret put TELEGRAM_CHAT_ID
npx wrangler deploy
```

After `deploy` finishes, copy the public URL it prints (looks like
`https://liveness-telegram-bridge.<your-subdomain>.workers.dev`) and put it in
`public/index.html`:

```html
<meta name="liveness-api" content="https://liveness-telegram-bridge.<your-subdomain>.workers.dev/">
```

## Lock it down (recommended)

Edit `wrangler.toml` so only your Vercel domain can POST to the Worker, then
redeploy:

```toml
[vars]
ALLOWED_ORIGIN = "https://your-project.vercel.app"
```

You can pass several comma-separated origins if you have a custom domain too.

## Local development

```sh
npx wrangler dev                # http://localhost:8787
```

Point `<meta name="liveness-api">` at `http://localhost:8787` while developing
locally. Secrets configured with `wrangler secret put` are available in
`wrangler dev` automatically.
