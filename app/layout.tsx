import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Toaster } from '@/components/ui/sonner';
import { Navigation } from '../components/navigation';
import { Footer } from '../components/footer';
import { PlatformConfigWrapper } from '@/components/providers/PlatformConfigWrapper';
import { CartProvider } from './store/components/CartProvider';
import WhatsAppWidget from '@/components/WhatsAppWidget';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: 'FMT Software Solutions - Premium Software solutions',
    template: '%s | FMT Software Solutions'
  },
  description:
    'Premium software solutions, for modern businesses. Web, desktop, and mobile applications.',
  keywords: [
    'software solutions',
    'web applications',
    'desktop applications', 
    'mobile applications',
    'software training',
    'Ghana software',
    'business software',
    'custom software development'
  ],
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
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://fmtsoftware.com',
    title: 'FMT Software Solutions - Premium Software & Training',
    description: 'Premium software solutions, free tools, and expert training for modern businesses. Web, desktop, and mobile applications built in Ghana.',
    siteName: 'FMT Software Solutions',
    images: [
      {
        url: '/fmt-logo.png',
        width: 1200,
        height: 630,
        alt: 'FMT Software Solutions Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FMT Software Solutions - Premium Software & Training',
    description: 'Premium software solutions, free tools, and expert training for modern businesses.',
    images: ['/fmt-logo.png'],
    creator: '@fmt_software',
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
    yandex: 'your-yandex-verification-code',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className={inter.className} suppressHydrationWarning>
        <PlatformConfigWrapper initialConfig={null}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <CartProvider>
              <Navigation />
              <main>{children}</main>
              <Footer />
              <Toaster />
              <WhatsAppWidget />
            </CartProvider>
          </ThemeProvider>
        </PlatformConfigWrapper>
      </body>
    </html>
  );
}
