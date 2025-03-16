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
  params: Promise<{ productId: string }>;
}) {
  // Resolve the promise
  const { productId } = await params;

  const product = products.find((p) => p.id === productId);

  if (!product) {
    return null;
  }

  // Transform the product to match the expected format for the client component
  const transformedProduct = {
    ...product,
    // Ensure platforms is an array even if it's not defined
    platforms: product.platforms || [],
    // Ensure downloadUrl and webAppUrl are defined
    downloadUrl: product.downloadUrl || null,
    webAppUrl: product.webAppUrl || null,
  };

  return <ProductPageClient product={transformedProduct} />;
}
