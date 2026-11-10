import { NextRequest, NextResponse } from 'next/server';
import { getProductsData, ShopSearchParams } from '@/lib/products';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const params: ShopSearchParams = {
      category: searchParams.get('category') || undefined,
      search: searchParams.get('search') || undefined,
      sort: searchParams.get('sort') || undefined,
      in_stock: searchParams.get('in_stock') || undefined,
      price_range: searchParams.get('price_range') || undefined,
      page: searchParams.get('page') || '1',
      limit: searchParams.get('limit') || '16',
    };

    const data = await getProductsData(params);

    return NextResponse.json(data);
  } catch (err) {
    console.error('API /api/products error:', err);
    return NextResponse.json(
      { error: 'Failed to fetch products', products: [], totalCount: 0, hasMore: false },
      { status: 500 }
    );
  }
}
