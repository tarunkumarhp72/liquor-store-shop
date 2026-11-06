import { redirect } from 'next/navigation';

interface ProductRedirectProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ProductRedirectPage({ params }: ProductRedirectProps) {
  const resolvedParams = await params;
  const slug = resolvedParams?.slug || '';
  redirect(`/shop/${slug}`);
}

