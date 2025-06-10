import type { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  // Use the Stripe API version that matches your installed Stripe SDK typings
  apiVersion: '2025-05-28.basil',
});

export const config = {
  api: {
    bodyParser: false, // Stripe requires the raw body
  },
};

function buffer(req: NextApiRequest): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Uint8Array[] = [];
    req.on('data', (chunk) => chunks.push(chunk));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  const sig = req.headers['stripe-signature'] as string;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET as string;

  let event: Stripe.Event;
  let buf: Buffer;
  try {
    buf = await buffer(req);
    event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed.', err);
    return res.status(400).send(`Webhook Error: ${(err as Error).message}`);
  }

  // Use a per-request Supabase client for secure updates
  const supabase = createServerComponentClient({ cookies });

  // Only handle known, expected event types
  switch (event.type) {
    case 'payment_intent.succeeded': {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      if (paymentIntent.metadata?.order_id) {
        await supabase
          .from('orders')
          .update({ payment_status: 'succeeded' })
          .eq('id', paymentIntent.metadata.order_id);
      }
      break;
    }
    case 'invoice.paid': {
      const invoice = event.data.object as Stripe.Invoice;
      if (invoice.metadata?.order_id) {
        await supabase
          .from('orders')
          .update({ payment_status: 'paid' })
          .eq('id', invoice.metadata.order_id);
      }
      break;
    }
    // Add more cases for other expected event types as needed
    default:
      // Ignore unhandled event types
      break;
  }

  res.status(200).json({ received: true });
}
