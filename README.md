# FridgeChef AI

AI-powered recipe generator that identifies groceries via barcode and creates personalized recipes.

## Setup Instructions

### 1. Supabase
1. Create a new Supabase project
2. Run `supabase/schema.sql` in the SQL Editor
3. Deploy edge functions: `supabase functions deploy process-barcode`, `supabase functions deploy generate-recipe`, `supabase functions deploy convert-credits`
4. Add environment variables to Edge Functions: `OPENAI_API_KEY`, `SUPABASE_SERVICE_ROLE_KEY`

### 2. Stripe
1. Create products/prices for Standard ($2.99), Pro ($9.99), Chef ($18.99)
2. Add price IDs to `.env.local`
3. Set up webhook endpoint: `/api/stripe/webhook`

### 3. Environment Variables
Copy `.env.local` and fill in all values:
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anon key
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key
- `STRIPE_SECRET_KEY` - Stripe secret key
- `STRIPE_WEBHOOK_SECRET` - Stripe webhook secret
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Stripe publishable key
- `OPENAI_API_KEY` - OpenAI API key
- `STRIPE_STANDARD_PRICE_ID` - Stripe Standard price ID
- `STRIPE_PRO_PRICE_ID` - Stripe Pro price ID
- `STRIPE_CHEF_PRICE_ID` - Stripe Chef price ID

### 4. Install & Run
```bash
npm install
npm run dev
```

## Project Structure
- `/app` - Next.js App Router pages
- `/components` - Reusable UI components
- `/lib` - Utilities, config, types
- `/supabase/functions` - Supabase Edge Functions
