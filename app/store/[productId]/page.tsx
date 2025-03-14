import { products } from '../products';
import ProductPageClient from './product-page-client';

export function generateStaticParams() {
  return products.map((product) => ({
    productId: product.id,
  }));
}

export default function ProductPage({ params }: { params: { productId: string } }) {
  const product = products.find(p => p.id === params.productId);
  
  if (!product) {
    return null;
  }

  return <ProductPageClient product={product} />;
}