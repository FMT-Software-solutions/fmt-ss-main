import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ProductPageClient from './components/ProductPageClient';
import { getPremiumAppBySlug } from '@/lib/sanity';
import { urlForImage } from '@/sanity/lib/image';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ productId: string }>;
}): Promise<Metadata> {
  const { productId } = await params;
  const product = await getPremiumAppBySlug(productId);

  if (!product) {
    return {
      title: 'Product Not Found | FMT Software Solutions',
      description: 'The requested product could not be found. Browse our collection of premium software solutions.',
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  // Generate optimized image URL for social sharing
  const imageUrl = product.mainImage 
    ? urlForImage(product.mainImage)?.width(1200).height(630).url()
    : 'https://fmtsoftware.com/images/fmt-bg.png';

  // Format price for display
  const price = product.promotion?.hasPromotion && product.promotion?.isActive 
    ? product.promotion.discountPrice 
    : product.price;

  // Generate keywords from product data
  const keywords = [
    product.title,
    'FMT Software Solutions',
    'premium software',
    'Ghana software',
    ...(product.tags || []),
    ...(product.sectors || []),
    'software development',
    'business software'
  ];

  const productUrl = `https://fmtsoftware.com/store/${productId}`;

  return {
    title: `${product.title} | FMT Software Solutions`,
    description: product.shortDescription || `Premium ${product.title} software solution by FMT Software Solutions. Professional software for modern businesses in Ghana and beyond.`,
    keywords: keywords.filter(Boolean),
    authors: [{ name: 'FMT Software Solutions' }],
    creator: 'FMT Software Solutions',
    publisher: 'FMT Software Solutions',
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL('https://fmtsoftware.com'),
    alternates: {
      canonical: productUrl,
    },
    openGraph: {
      title: `${product.title} | FMT Software Solutions`,
      description: product.shortDescription || `Premium ${product.title} software solution by FMT Software Solutions.`,
      url: productUrl,
      siteName: 'FMT Software Solutions',
      images: [
        {
          url: imageUrl || 'https://fmtsoftware.com/images/fmt-bg.png',
          width: 1200,
          height: 630,
          alt: `${product.title} - Premium Software by FMT Software Solutions`,
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${product.title} | FMT Software Solutions`,
      description: product.shortDescription || `Premium ${product.title} software solution by FMT Software Solutions.`,
      images: [imageUrl || 'https://fmtsoftware.com/images/fmt-bg.png'],
      creator: '@fmtsoftware',
      site: '@fmtsoftware',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    verification: {
      google: 'your-google-verification-code',
    },
    other: {
      'product:price:amount': price?.toString() || '0',
      'product:price:currency': 'USD',
      'product:availability': 'in stock',
      'product:condition': 'new',
      'product:retailer': 'FMT Software Solutions',
    },
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

  // Generate optimized image URL for structured data
  const imageUrl = product.mainImage 
    ? urlForImage(product.mainImage)?.width(800).height(600).url()
    : 'https://fmtsoftware.com/images/fmt-bg.png';

  // Format price for structured data
  const price = product.promotion?.hasPromotion && product.promotion?.isActive 
    ? product.promotion.discountPrice 
    : product.price;

  // Generate structured data for the product
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: product.title,
    description: product.shortDescription || `Premium ${product.title} software solution by FMT Software Solutions.`,
    image: imageUrl,
    url: `https://fmtsoftware.com/store/${productId}`,
    author: {
      '@type': 'Organization',
      name: 'FMT Software Solutions',
      url: 'https://fmtsoftware.com',
      logo: 'https://fmtsoftware.com/fmt-logo.png',
    },
    publisher: {
      '@type': 'Organization',
      name: 'FMT Software Solutions',
      url: 'https://fmtsoftware.com',
      logo: 'https://fmtsoftware.com/fmt-logo.png',
    },
    offers: {
      '@type': 'Offer',
      price: price || 0,
      priceCurrency: 'GHS',
      availability: 'https://schema.org/InStock',
      seller: {
        '@type': 'Organization',
        name: 'FMT Software Solutions',
      },
    },
    applicationCategory: 'BusinessApplication',
    operatingSystem: [
      ...(product.platforms?.desktop?.windows?.available ? ['Windows'] : []),
      ...(product.platforms?.desktop?.macos?.available ? ['macOS'] : []),
      ...(product.platforms?.desktop?.linux?.available ? ['Linux'] : []),
      ...(product.platforms?.mobile?.android?.available ? ['Android'] : []),
      ...(product.platforms?.mobile?.ios?.available ? ['iOS'] : []),
      ...(product.platforms?.web?.available ? ['Web Browser'] : []),
    ],
    keywords: [
      product.title,
      'software',
      'business application',
      ...(product.tags || []),
      ...(product.sectors || []),
    ].join(', '),
    datePublished: product.publishedAt,
    inLanguage: 'en-US',
    isAccessibleForFree: false,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
      <ProductPageClient product={product} />
    </>
  );
}
