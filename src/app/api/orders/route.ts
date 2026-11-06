import { NextRequest, NextResponse } from 'next/server';
import pool, { query } from '@/lib/db';
import { checkRateLimit, getClientIp } from '@/lib/rateLimit';

interface CartItemInput {
  id?: string;
  productId?: string;
  name?: string;
  quantity?: number;
}

export async function POST(req: NextRequest) {
  try {
    const clientIp = getClientIp(req);

    // 1. Rate Limiting: Max 10 order attempts per 10 minutes per IP
    const rateCheck = checkRateLimit(`orders:${clientIp}`, 10, 10 * 60 * 1000);
    if (!rateCheck.success) {
      return NextResponse.json(
        { error: 'Too many order requests. Please wait a few minutes before submitting another order.' },
        { status: 429 }
      );
    }

    const body = await req.json();
    const {
      customer_name,
      customer_email,
      customer_phone,
      fulfillment_type,
      delivery_address,
      items,
      age_verified,
    } = body;

    // 2. Strict Input Field Validation
    if (!customer_name || typeof customer_name !== 'string' || customer_name.trim().length < 2 || customer_name.trim().length > 100) {
      return NextResponse.json({ error: 'Please enter a valid full name (2-100 characters)' }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!customer_email || typeof customer_email !== 'string' || !emailRegex.test(customer_email.trim())) {
      return NextResponse.json({ error: 'Please provide a valid email address' }, { status: 400 });
    }

    const phoneRegex = /^[\d\s\(\)\-\+\.]{7,25}$/;
    if (!customer_phone || typeof customer_phone !== 'string' || !phoneRegex.test(customer_phone.trim())) {
      return NextResponse.json({ error: 'Please provide a valid phone number' }, { status: 400 });
    }

    const validFulfillment = ['pickup', 'delivery'];
    if (!fulfillment_type || !validFulfillment.includes(fulfillment_type)) {
      return NextResponse.json({ error: 'Invalid fulfillment method selected' }, { status: 400 });
    }

    if (fulfillment_type === 'delivery') {
      if (!delivery_address || typeof delivery_address !== 'string' || delivery_address.trim().length < 5) {
        return NextResponse.json({ error: 'Please provide a valid delivery address' }, { status: 400 });
      }
    }

    // 3. Strict Legal Age Verification Gate
    if (age_verified !== true) {
      return NextResponse.json({ error: 'Legal adult age confirmation (18+ / legal drinking age) is strictly required to purchase alcohol' }, { status: 400 });
    }

    // 4. Cart Items Validation
    if (!Array.isArray(items) || items.length === 0 || items.length > 50) {
      return NextResponse.json({ error: 'Order must contain between 1 and 50 items' }, { status: 400 });
    }

    // Sanitize item list and collect IDs
    const itemMap = new Map<string, number>();
    for (const it of items as CartItemInput[]) {
      const pid = String(it.id || it.productId || '').trim();
      const qty = parseInt(String(it.quantity || 1), 10);

      if (!pid) {
        return NextResponse.json({ error: 'Invalid product item format' }, { status: 400 });
      }
      if (isNaN(qty) || qty < 1 || qty > 50) {
        return NextResponse.json({ error: 'Item quantity must be between 1 and 50' }, { status: 400 });
      }

      itemMap.set(pid, (itemMap.get(pid) || 0) + qty);
    }

    const productIds = Array.from(itemMap.keys());

    // 5. Query Real Database Prices & Stock (Server-Side Price Authority)
    const dbProducts = await query(
      `SELECT id, name, slug, price, is_in_stock, stock_quantity, image_url 
       FROM public.products 
       WHERE id = ANY($1::uuid[]);`,
      [productIds]
    );

    if (dbProducts.length !== productIds.length) {
      return NextResponse.json({ error: 'One or more selected products are no longer available in the catalog' }, { status: 400 });
    }

    // 6. Recalculate Subtotal, Verify Stock, and Build Verified Items Payload
    let serverSubtotal = 0;
    const verifiedOrderItems: any[] = [];
    const dbProductMap = new Map<string, any>();
    for (const p of dbProducts) {
      dbProductMap.set(p.id, p);
    }

    for (const [pid, qty] of itemMap.entries()) {
      const dbProd = dbProductMap.get(pid);
      if (!dbProd) {
        return NextResponse.json({ error: `Product not found: ${pid}` }, { status: 400 });
      }

      if (!dbProd.is_in_stock || dbProd.stock_quantity < qty) {
        return NextResponse.json({
          error: `Insufficient stock for "${dbProd.name}". Available units: ${dbProd.stock_quantity}`,
        }, { status: 400 });
      }

      const verifiedPrice = parseFloat(dbProd.price);
      const lineTotal = verifiedPrice * qty;
      serverSubtotal += lineTotal;

      verifiedOrderItems.push({
        id: dbProd.id,
        name: dbProd.name,
        slug: dbProd.slug,
        price: verifiedPrice,
        quantity: qty,
        image_url: dbProd.image_url,
        line_total: parseFloat(lineTotal.toFixed(2)),
      });
    }

    // 7. Calculate Final Total (Standard 5% Tax included in calculation)
    const taxAmount = parseFloat((serverSubtotal * 0.05).toFixed(2));
    const verifiedTotalAmount = parseFloat((serverSubtotal + taxAmount).toFixed(2));

    // 8. Atomic Database Transaction: Deduct Stock & Insert Verified Order
    if (!pool) {
      return NextResponse.json({
        success: true,
        orderId: 'DEMO-' + Math.floor(100000 + Math.random() * 900000),
        status: 'pending',
        message: 'Order received (demo mode)',
        total: verifiedTotalAmount,
      });
    }

    const client = await pool.connect();
    let orderRow: any;

    try {
      await client.query('BEGIN');

      // Deduct inventory
      for (const [pid, qty] of itemMap.entries()) {
        await client.query(
          `UPDATE public.products
           SET stock_quantity = GREATEST(0, stock_quantity - $1),
               is_in_stock = (stock_quantity - $1 > 0),
               updated_at = NOW()
           WHERE id = $2;`,
          [qty, pid]
        );
      }

      // Generate unique secure order number (e.g. MH2-829143)
      const orderNumber = `MH2-${Math.floor(100000 + Math.random() * 900000)}`;

      const insertRes = await client.query(
        `INSERT INTO public.orders (
          order_number, customer_name, customer_email, customer_phone,
          fulfillment_type, delivery_address, items, total_amount, status, age_verified
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'pending', true)
        RETURNING id, order_number, total_amount, created_at;`,
        [
          orderNumber,
          customer_name.trim(),
          customer_email.toLowerCase().trim(),
          customer_phone.trim(),
          fulfillment_type,
          delivery_address?.trim() || null,
          JSON.stringify(verifiedOrderItems),
          verifiedTotalAmount, // Server-calculated verified price!
        ]
      );

      orderRow = insertRes.rows[0];
      await client.query('COMMIT');
    } catch (txErr) {
      await client.query('ROLLBACK');
      throw txErr;
    } finally {
      client.release();
    }

    return NextResponse.json({
      success: true,
      order_id: orderRow.id,
      order_number: orderRow.order_number,
      total_amount: orderRow.total_amount,
      message: 'Order placed successfully and verified against catalog inventory',
    });
  } catch (err: any) {
    console.error('Order creation error:', err);
    return NextResponse.json({ error: err.message || 'Internal server error processing order' }, { status: 500 });
  }
}
