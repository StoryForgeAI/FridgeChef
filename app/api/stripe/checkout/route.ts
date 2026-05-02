import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY } from '@/lib/config';

export async function POST(req: NextRequest) {
  const { priceId, userId, email } = await req.json();

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      metadata: { user_id: userId },
      customer_email: email,
      success_url: `${req.headers.get('origin')}/profile?success=true`,
      cancel_url: `${req.headers.get('origin')}/profile?canceled=true`
    });

    return NextResponse.json({ url: session.url });
  } catch {
    return NextResponse.json({ error: 'Checkout failed' }, { status: 500 });
  }
}
