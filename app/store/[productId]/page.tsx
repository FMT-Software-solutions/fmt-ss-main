import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { products } from '../products';
import ProductPageClient from './components/ProductPageClient';
import { IPremiumApp } from '@/types/premium-app';

export async function generateStaticParams() {
  return products.map((product) => ({
    productId: product.id,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: { productId: string };
}): Promise<Metadata> {
  const product = products.find((p) => p.id === params.productId);

  if (!product) {
    return {
      title: 'Product Not Found',
      description: 'The requested product could not be found.',
    };
  }

  return {
    title: product.title,
    description: product.shortDescription,
  };
}

export default async function ProductPage({
  params,
}: {
  params: { productId: string };
}) {
  const product = products.find((p) => p.id === params.productId);

  if (!product) {
    notFound();
  }

  // Transform the product to match the expected format for the client component
  const transformedProduct: IPremiumApp = {
    ...product,
  };

  return <ProductPageClient product={transformedProduct} />;
}
