# Wize Collective — Holistic Health by Xana Nunes

## Stack
- **Frontend:** Single-page HTML/CSS/JS with Stripe.js
- **Backend:** Vercel serverless function (`/api/create-payment-intent.js`)
- **Payments:** Stripe (test mode → switch to live when ready)
- **Hosting:** Vercel
- **Domain:** wizecollective.pt (to be connected)

## Project Structure
```
wize-collective/
├── index.html                    # Full website (single-page)
├── api/
│   └── create-payment-intent.js  # Stripe PaymentIntent serverless function
├── vercel.json                   # Vercel routing config
├── package.json                  # Node deps (stripe)
├── .env.example                  # Required env vars template
└── README.md
```

## 6 Products Wired to Stripe

| Product                   | Price    | Backend Key                |
|---------------------------|----------|----------------------------|
| Seeds to Bloom            | €890     | `Seeds to Bloom`           |
| Amazónes Retreat          | €1,400   | `Amazónes Retreat`         |
| Flux (monthly)            | €45      | `Flux — April` / May / Jun |
| Wize Days                 | €35      | `Wize Days`                |
| Holistic Coaching Session | €120     | `Holistic Coaching Session` |
| Dynamic Breathwork        | €55      | `Dynamic Breathwork`       |

## Deployment Steps

### 1. Get Stripe Keys
- Go to [stripe.com/dashboard](https://dashboard.stripe.com) → Developers → API keys
- Copy your **Publishable key** (`pk_test_...`) and **Secret key** (`sk_test_...`)

### 2. Update Frontend Key
In `index.html`, find this line and replace with your real publishable key:
```js
const STRIPE_PUBLISHABLE_KEY = 'pk_test_REPLACE_WITH_YOUR_KEY';
```

### 3. Deploy to Vercel
```bash
# Install Vercel CLI (if not already)
npm i -g vercel

# Deploy
cd wize-collective
vercel
```

### 4. Set Environment Variables in Vercel
Go to your Vercel project → Settings → Environment Variables and add:
- `STRIPE_SECRET_KEY` = `sk_test_...`
- `ALLOWED_ORIGIN` = `https://wizecollective.pt` (or `*` for dev)

### 5. Connect Domain
In Vercel → Settings → Domains → Add `wizecollective.pt`

### 6. Go Live
When ready for real payments:
1. Replace `pk_test_...` with `pk_live_...` in `index.html`
2. Replace `sk_test_...` with `sk_live_...` in Vercel env vars
3. Redeploy

## Testing Payments
Use Stripe test cards:
- **Success:** `4242 4242 4242 4242`
- **Decline:** `4000 0000 0000 0002`
- **Auth required:** `4000 0025 0000 3155`
- Any future expiry, any 3-digit CVC, any postal code

## What's Fixed vs. Original
- ✅ Truncated newsletter JS restored
- ✅ Cloudflare email obfuscation removed (real `mailto:` links)
- ✅ `export default` → `module.exports` (Vercel Node compatibility)
- ✅ CORS preflight (`OPTIONS`) handler added
- ✅ All 6 `openModal()` calls match backend `PRICES` keys exactly
- ✅ Calendar section `openModal()` calls also matched
