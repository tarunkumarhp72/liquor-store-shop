import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getAdminSession } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const session = await getAdminSession(req);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const products = await query(`
      SELECT p.*, c.name as category_name
      FROM public.products p
      LEFT JOIN public.categories c ON p.category_slug = c.slug
      ORDER BY p.updated_at DESC;
    `);
    return NextResponse.json({ products });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getAdminSession(req);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const {
      name,
      category_slug,
      price,
      stock_quantity,
      is_in_stock,
      rating,
      abv,
      volume,
      country,
      region,
      image_url,
      short_description,
      full_description,
      featured,
    } = body;

    if (!name || !category_slug || price === undefined) {
      return NextResponse.json({ error: 'Name, Category, and Price are required' }, { status: 400 });
    }

    // Generate unique slug
    const cleanName = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const slug = `${cleanName}-${Date.now().toString().slice(-6)}`;

    // Get category_id
    const catRows = await query<any>(`SELECT id FROM public.categories WHERE slug = $1 LIMIT 1;`, [category_slug]);
    const category_id = catRows[0]?.id || null;

    const rows = await query<any>(`
      INSERT INTO public.products (
        name, slug, category_slug, category_id, price, stock_quantity,
        is_in_stock, rating, abv, volume, country, region,
        image_url, short_description, full_description, featured, updated_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6,
        $7, $8, $9, $10, $11, $12,
        $13, $14, $15, $16, NOW()
      )
      RETURNING *;
    `, [
      name,
      slug,
      category_slug,
      category_id,
      parseFloat(price),
      parseInt(stock_quantity || 10, 10),
      is_in_stock !== false,
      parseFloat(rating || 4.8),
      abv || '13.5%',
      volume || '750 ml',
      country || 'Imported',
      region || '',
      image_url || '/placeholder-bottle.svg',
      short_description || '',
      full_description || '',
      featured === true,
    ]);

    return NextResponse.json({ success: true, product: rows[0] });
  } catch (err: any) {
    console.error('Error inserting product:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const session = await getAdminSession(req);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const {
      id,
      name,
      category_slug,
      price,
      stock_quantity,
      is_in_stock,
      rating,
      abv,
      volume,
      country,
      region,
      image_url,
      short_description,
      featured,
    } = body;

    if (!id) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    // Get category_id if category_slug is provided
    let category_id: string | null = null;
    if (category_slug) {
      const catRows = await query<any>(`SELECT id FROM public.categories WHERE slug = $1 LIMIT 1;`, [category_slug]);
      category_id = catRows[0]?.id || null;
    }

    const rows = await query<any>(`
      UPDATE public.products
      SET name = COALESCE($1, name),
          category_slug = COALESCE($2, category_slug),
          category_id = COALESCE($3, category_id),
          price = COALESCE($4, price),
          stock_quantity = COALESCE($5, stock_quantity),
          is_in_stock = COALESCE($6, is_in_stock),
          rating = COALESCE($7, rating),
          abv = COALESCE($8, abv),
          volume = COALESCE($9, volume),
          country = COALESCE($10, country),
          region = COALESCE($11, region),
          image_url = COALESCE($12, image_url),
          short_description = COALESCE($13, short_description),
          featured = COALESCE($14, featured),
          updated_at = NOW()
      WHERE id = $15
      RETURNING *;
    `, [
      name ?? null,
      category_slug ?? null,
      category_id,
      price !== undefined ? parseFloat(price) : null,
      stock_quantity !== undefined ? parseInt(stock_quantity, 10) : null,
      is_in_stock !== undefined ? Boolean(is_in_stock) : null,
      rating !== undefined ? parseFloat(rating) : null,
      abv ?? null,
      volume ?? null,
      country ?? null,
      region ?? null,
      image_url ?? null,
      short_description ?? null,
      featured !== undefined ? Boolean(featured) : null,
      id,
    ]);

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, product: rows[0] });
  } catch (err: any) {
    console.error('Error updating product:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const session = await getAdminSession(req);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

    await query(`DELETE FROM public.products WHERE id = $1;`, [id]);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
