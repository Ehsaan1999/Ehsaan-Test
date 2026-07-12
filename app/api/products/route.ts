import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET all products
export async function GET() {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ products: data, count: data.length });
}

// POST — create a new product
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, price, description, category } = body;

  if (!name || price === undefined) {
    return NextResponse.json(
      { error: 'name and price are required' },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from('products')
    .insert([{ name, price: parseFloat(price), description, category }])
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ product: data }, { status: 201 });
}
