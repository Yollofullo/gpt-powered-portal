import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const supabase = createServerComponentClient({ cookies });
  console.log('🔍 [fulfillment.ts] const supabase = createServerComponentClient({ cookies });');
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();
  console.log('🔍 [fulfillment.ts] } = await supabase.auth.getSession();');

  if (sessionError || !session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (session.user.user_metadata.role !== 'operator') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { data: orders, error } = await supabase
    .from('orders')
    .select('*')
    .neq('status', 'Fulfilled');

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(orders);
}

export async function PATCH(req: Request) {
  const supabase = createServerComponentClient({ cookies });
  console.log('🔍 [fulfillment.ts] const supabase = createServerComponentClient({ cookies });');
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();
  console.log('🔍 [fulfillment.ts] } = await supabase.auth.getSession();');

  if (sessionError || !session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (session.user.user_metadata.role !== 'operator') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { id } = await req.json();
  console.log('🔍 [fulfillment.ts] const { id } = await req.json();');

  const { error } = await supabase
    .from('orders')
    .update({ status: 'Fulfilled' })
    .eq('id', id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
