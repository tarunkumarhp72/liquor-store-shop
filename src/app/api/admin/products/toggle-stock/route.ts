import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getAdminSession } from '@/lib/auth';

export async function POST(req: NextRequest) {
  const session = await getAdminSession(req);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id, is_in_stock, stock_quantity, rating, price } = await req.json();

    if (!id) {
      return NextResponse.json({ error: 'Product ID required' }, { status: 400 });
    }

    const updates: string[] = ['updated_at = NOW()'];
    const params: any[] = [];
    let pIdx = 1;

    if (is_in_stock !== undefined) {
      updates.push(`is_in_stock = $${pIdx++}`);
      params.push(Boolean(is_in_stock));
    }
    if (stock_quantity !== undefined) {
      updates.push(`stock_quantity = $${pIdx++}`);
      params.push(parseInt(stock_quantity, 10));
    }
    if (rating !== undefined) {
      updates.push(`rating = $${pIdx++}`);
      params.push(parseFloat(rating));
    }
    if (price !== undefined) {
      updates.push(`price = $${pIdx++}`);
      params.push(parseFloat(price));
    }

    params.push(id);
    const sql = `
      UPDATE public.products
      SET ${updates.join(', ')}
      WHERE id = $${pIdx}
      RETURNING id, name, is_in_stock, stock_quantity, rating, price, updated_at;
    `;

    const rows = await query(sql, params);
    if (rows.length === 0) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, product: rows[0] });
  } catch (err: any) {
    console.error('Update product status error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
