import Stripe from 'stripe';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getServerSession } from '@/lib/auth/serverSession';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
console.log('🔍 [invoices.ts] const stripeSecretKey = process.env.STRIPE_SECRET_KEY;');
if (!stripeSecretKey) {
  throw new Error('Missing STRIPE_SECRET_KEY environment variable');
}

const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2025-05-28.basil', // Use the only allowed Stripe API version
});

export async function POST(req: Request) {
  // Secure session and role validation
  const session = await getServerSession();
  console.log('🔍 [invoices.ts] const session = await getServerSession();');
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  // Explicit admin role check
  const userRole = session.user.user_metadata?.role;
  console.log('🔍 [invoices.ts] const userRole = session.user.user_metadata?.role;');
  if (userRole !== 'admin') {
    return NextResponse.json({ error: 'Forbidden: Admins only' }, { status: 403 });
  }

  try {
    const schema = z.object({
      customerId: z.string().min(1),
      orderId: z.string().min(1),
      amount: z.number().positive(),
      currency: z.string().length(3),
    });

    const body = await req.json();
    console.log('🔍 [invoices.ts] const body = await req.json();');
    const { customerId, orderId, amount, currency } = schema.parse(body);
    console.log('🔍 [invoices.ts] const { customerId, orderId, amount, currency } = schema.parse(body);');

    await stripe.invoiceItems.create({
      customer: customerId,
      amount,
      currency,
      description: `Invoice for Order ID: ${orderId}`,
    });

    const invoice = await stripe.invoices.create({
      customer: customerId,
      auto_advance: true,
    });

    return NextResponse.json({ invoiceId: invoice.id });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors.map(e => e.message).join(', ') }, { status: 400 });
      console.log('🔍 [invoices.ts] return NextResponse.json({ error: error.errors.map(e => e.message).join(', ') }, { status: 400 });');
    }
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(
      { error: 'An unknown error occurred' },
      { status: 500 }
    );
  }
}
