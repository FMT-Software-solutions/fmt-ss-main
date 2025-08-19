import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Toaster } from '@/components/ui/sonner';
import { Navigation } from '../components/navigation';
import { Footer } from '../components/footer';
import { PlatformConfigWrapper } from '@/components/providers/PlatformConfigWrapper';
import { platformConfigServer } from '@/services/config/platformConfigServer';
import { CartProvider } from './store/components/CartProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'FMT Software Solutions - Software & Training',
  description:
    'Premium software solutions, free tools, and expert training for modern businesses',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Load platform config server-side for better performance
  const platformConfig = await platformConfigServer.getPlatformConfig();

  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className={inter.className} suppressHydrationWarning>
        <PlatformConfigWrapper initialConfig={platformConfig}>
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
            </CartProvider>
          </ThemeProvider>
        </PlatformConfigWrapper>
      </body>
    </html>
  );
}
