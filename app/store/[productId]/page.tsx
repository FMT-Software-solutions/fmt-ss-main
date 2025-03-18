import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ProductPageClient from './components/ProductPageClient';
import { getPremiumAppBySlug } from '@/lib/sanity';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ productId: string }>;
}): Promise<Metadata> {
  const { productId } = await params;
  const product = await getPremiumAppBySlug(productId);

  if (!product) {
    return {
      title: 'Product Not Found',
      description: 'The requested product could not be found.',
    };
  }

  return {
    title: `${product.title} | FMT Software Solutions`,
    description: product.shortDescription,
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ productId: string }>;
}) {
  const { productId } = await params;
  const product = await getPremiumAppBySlug(productId);

  if (!product) {
    notFound();
  }

  return <ProductPageClient product={product} />;
}
