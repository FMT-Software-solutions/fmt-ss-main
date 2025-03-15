import { products } from '../products';
import ProductPageClient from './components/ProductPageClient';

export function generateStaticParams() {
  return products.map((product) => ({
    productId: product.id,
  }));
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ productId: string }> & { productId: string };
}) {
  // Resolve the promise
  const resolvedParams = await params;
  const productId = resolvedParams.productId;

  const product = products.find((p) => p.id === productId);

  if (!product) {
    return null;
  }

  return <ProductPageClient product={product} />;
}
