import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://fmtsoftware.com'
  
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/api/',
          '/studio/',
          '/_next/',
          '/newsletter/debug/',
          '/newsletter/test/',
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/admin/',
          '/api/',
          '/studio/',
          '/_next/',
          '/newsletter/debug/',
          '/newsletter/test/',
        ],
      },
    ],
    sitemap: 'https://fmtsoftware.com/sitemap.xml',
    host: baseUrl,
  }
}