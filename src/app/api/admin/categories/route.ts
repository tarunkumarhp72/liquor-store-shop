import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getAdminSession } from '@/lib/auth';

export async function GET() {
  try {
    const categories = await query(`
      SELECT c.*, COUNT(p.id)::int as product_count
      FROM public.categories c
      LEFT JOIN public.products p ON c.slug = p.category_slug
      GROUP BY c.id
      ORDER BY c.sort_order ASC, c.name ASC;
    `);
    return NextResponse.json({ categories });
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
    const { name, slug, description, tone_class, is_active } = await req.json();

    if (!name) {
      return NextResponse.json({ error: 'Category name is required' }, { status: 400 });
    }

    const cleanSlug = (slug || name)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    const rows = await query<any>(`
      INSERT INTO public.categories (name, slug, description, tone_class, is_active, sort_order)
      VALUES ($1, $2, $3, $4, $5, (SELECT COALESCE(MAX(sort_order), 0) + 1 FROM public.categories))
      ON CONFLICT (slug) DO UPDATE
      SET name = EXCLUDED.name, description = EXCLUDED.description, tone_class = EXCLUDED.tone_class, is_active = EXCLUDED.is_active
      RETURNING *;
    `, [name, cleanSlug, description || '', tone_class || 'tone-wine', is_active !== false]);

    return NextResponse.json({ success: true, category: rows[0] });
  } catch (err: any) {
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
    const { id, name, slug, description, tone_class, is_active } = body;

    if (!id) {
      return NextResponse.json({ error: 'Category ID is required' }, { status: 400 });
    }

    // Quick toggle case: if only is_active is being updated
    if (name === undefined && is_active !== undefined) {
      const rows = await query<any>(`
        UPDATE public.categories
        SET is_active = $1
        WHERE id = $2
        RETURNING *;
      `, [Boolean(is_active), id]);
      return NextResponse.json({ success: true, category: rows[0] });
    }

    if (!name) {
      return NextResponse.json({ error: 'Category Name is required' }, { status: 400 });
    }

    const cleanSlug = (slug || name)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    const rows = await query<any>(`
      UPDATE public.categories
      SET name = $1,
          slug = $2,
          description = $3,
          tone_class = $4,
          is_active = COALESCE($5, is_active)
      WHERE id = $6
      RETURNING *;
    `, [
      name,
      cleanSlug,
      description || '',
      tone_class || 'tone-wine',
      is_active !== undefined ? Boolean(is_active) : null,
      id
    ]);

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, category: rows[0] });
  } catch (err: any) {
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
    if (!id) return NextResponse.json({ error: 'Category ID required' }, { status: 400 });

    await query(`DELETE FROM public.categories WHERE id = $1;`, [id]);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
