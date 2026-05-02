import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { supabaseAdmin } from '@/lib/supabase';
import { STRIPE_TIERS } from '@/lib/types';
import { STRIPE_WEBHOOK_SECRET } from '@/lib/config';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature');

  if (!signature) return NextResponse.json({ error: 'No signature' }, { status: 400 });

  try {
    const event = stripe.webhooks.constructEvent(body, signature, STRIPE_WEBHOOK_SECRET);

    if (event.type === 'customer.subscription.created' || event.type === 'customer.subscription.updated') {
      const sub = event.data.object as any;
      const priceId = sub.items.data[0].price.id;
      const tier = priceId === process.env.STRIPE_STANDARD_PRICE_ID ? 'standard' : priceId === process.env.STRIPE_PRO_PRICE_ID ? 'pro' : 'chef';
      const config = STRIPE_TIERS[tier];

      await supabaseAdmin.from('profiles').update({
        tier,
        credits: config.credits,
        tss_credits: config.tss_credits
      }).eq('id', sub.metadata.user_id);
    }

    if (event.type === 'customer.subscription.deleted') {
      const sub = event.data.object as any;
      await supabaseAdmin.from('profiles').update({ tier: 'free', credits: 0, tss_credits: 0 }).eq('id', sub.metadata.user_id);
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    return NextResponse.json({ error: 'Webhook error' }, { status: 400 });
  }
}
