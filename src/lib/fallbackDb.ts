import fs from 'fs';
import path from 'path';

export interface FallbackProduct {
  id: string;
  name: string;
  slug: string;
  category_slug: string;
  price: string;
  stock_quantity: number;
  is_in_stock: boolean;
  rating: number;
  review_count: number;
  abv: string;
  volume: string;
  country: string;
  region: string;
  image_url: string;
  short_description?: string;
  description?: string;
  featured: boolean;
  sort_order?: number;
}

export interface FallbackCategory {
  id: number;
  name: string;
  slug: string;
  sort_order: number;
  is_active: boolean;
  description?: string;
  product_count?: number;
}

export const FALLBACK_CATEGORIES: FallbackCategory[] = [
  { id: 1, name: 'Fine Wines & Rosé', slug: 'wine', sort_order: 1, is_active: true, description: 'Curated selection of reds, whites, and rosés from top wine regions' },
  { id: 2, name: 'Champagne & Sparkling', slug: 'champagne', sort_order: 2, is_active: true, description: 'Grand Cru cuvées, Prosecco, and sparkling wines' },
  { id: 3, name: 'Whiskies & Bourbon', slug: 'whiskey', sort_order: 3, is_active: true, description: 'Single malts, bourbon, rye, and rare Japanese whiskies' },
  { id: 4, name: 'Tequila & Agave Spirits', slug: 'tequila', sort_order: 4, is_active: true, description: 'Artisanal blanco, reposado, añejo, and mezcal' },
  { id: 5, name: 'Vodka & Spirits', slug: 'vodka', sort_order: 5, is_active: true, description: 'Premium distilled vodkas and craft botanical gins' },
  { id: 6, name: 'Craft & Domestic Beer', slug: 'beer', sort_order: 6, is_active: true, description: 'Chilled local craft packs, IPAs, lagers, and ciders' },
  { id: 7, name: 'Gins & Botanicals', slug: 'gins', sort_order: 7, is_active: true, description: 'Artisanal dry gins and botanicals' },
  { id: 8, name: 'Rums & Cane Spirits', slug: 'rums', sort_order: 8, is_active: true, description: 'Aged Caribbean rums and spiced cane spirits' },
];

function parseCSV(text: string): string[][] {
  const lines: string[][] = [];
  let row: string[] = [''];
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    const next = text[i + 1];
    if (c === '"') {
      if (inQuotes && next === '"') {
        row[row.length - 1] += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (c === ',' && !inQuotes) {
      row.push('');
    } else if ((c === '\r' || c === '\n') && !inQuotes) {
      if (c === '\r' && next === '\n') i++;
      lines.push(row);
      row = [''];
    } else {
      row[row.length - 1] += c;
    }
  }
  if (row.length > 1 || row[0] !== '') lines.push(row);
  return lines;
}

let cachedProducts: FallbackProduct[] | null = null;

export function getFallbackProducts(): FallbackProduct[] {
  if (cachedProducts) return cachedProducts;

  try {
    const csvPath = path.resolve(process.cwd(), 'products.csv');
    if (!fs.existsSync(csvPath)) return [];
    const content = fs.readFileSync(csvPath, 'utf8');
    const rows = parseCSV(content);
    const products: FallbackProduct[] = [];

    for (let i = 1; i < rows.length; i++) {
      const r = rows[i];
      if (!r[1]) continue;
      const name = r[1].trim();
      const cat = (r[2] || 'Wine').trim().toLowerCase();
      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const price = (22 + ((i * 7) % 65)) + 0.99;

      products.push({
        id: String(r[0] || i).replace(/^\uFEFF/, ''),
        name,
        slug,
        category_slug: cat,
        price: price.toFixed(2),
        stock_quantity: 15,
        is_in_stock: true,
        rating: +(4.4 + ((i % 6) * 0.1)).toFixed(1),
        review_count: 8 + ((i * 3) % 45),
        abv: cat === 'beer' ? '5.0%' : cat === 'wine' ? '13.5%' : '40.0%',
        volume: cat === 'beer' ? '6x355ml' : '750ml',
        country: cat === 'beer' ? 'Canada' : 'France',
        region: cat === 'beer' ? 'Alberta' : 'Bordeaux',
        image_url: r[7] ? r[7].trim() : '/placeholder-bottle.svg',
        short_description: r[4] ? r[4].trim() : '',
        description: r[5] ? r[5].trim() : '',
        featured: i <= 24,
      });
    }

    cachedProducts = products;
    return products;
  } catch (err) {
    console.warn('Could not read fallback products.csv:', err);
    return [];
  }
}

export function handleFallbackQuery<T = any>(text: string, params: any[] = []): T[] {
  const q = text.toLowerCase();
  const products = getFallbackProducts();

  // 0. Admin & Sensitive queries - NEVER mock credentials or user data
  if (q.includes('admin_users') || q.includes('orders')) {
    return [] as unknown as T[];
  }

  // 1. Categories query
  if (q.includes('from public.categories') || q.includes('from categories')) {
    const counts: Record<string, number> = {};
    for (const p of products) {
      counts[p.category_slug] = (counts[p.category_slug] || 0) + 1;
    }
    const result = FALLBACK_CATEGORIES.map(c => ({
      ...c,
      product_count: counts[c.slug] || 0,
    }));
    return result as unknown as T[];
  }

  // 2. Count query
  if (q.includes('select count(*)')) {
    let list = products;
    if (params.length > 0 && typeof params[0] === 'string') {
      const catParam = params[0].toLowerCase();
      list = products.filter(p => p.category_slug === catParam);
    }
    return [{ count: list.length }] as unknown as T[];
  }

  // 3. Single Product Lookup (by slug or id)
  if (q.includes('where p.slug =') || q.includes('where p.slug ilike') || q.includes('where p.id =')) {
    const slugOrId = String(params[0] || '').toLowerCase().replace(/%/g, '').replace(/-+$/, '');
    const found = products.find(p =>
      p.slug === slugOrId ||
      p.slug.includes(slugOrId) ||
      slugOrId.includes(p.slug) ||
      p.id === slugOrId
    );
    if (found) {
      const cat = FALLBACK_CATEGORIES.find(c => c.slug === found.category_slug);
      return [{ ...found, category_name: cat ? cat.name : 'Wine' }] as unknown as T[];
    }
    return [] as unknown as T[];
  }

  // 4. Products query (Featured / Shop catalog / Related)
  let list = [...products];

  // Category filter in params
  if (params && params.length > 0) {
    const cat = String(params[0]).toLowerCase();
    if (cat && cat !== 'all') {
      const filtered = list.filter(p => p.category_slug === cat);
      if (filtered.length > 0) {
        list = filtered;
      }
    }
  }

  // Check category filter in SQL query
  for (const c of FALLBACK_CATEGORIES) {
    if (q.includes(`category_slug = '${c.slug}'`)) {
      list = list.filter(p => p.category_slug === c.slug);
      break;
    }
  }

  // Check Limit
  const limitMatch = q.match(/limit\s+(\d+)/);
  const offsetMatch = q.match(/offset\s+(\d+)/);
  const offset = offsetMatch ? parseInt(offsetMatch[1], 10) : 0;
  const limit = limitMatch ? parseInt(limitMatch[1], 10) : 50;

  return list.slice(offset, offset + limit) as unknown as T[];
}
