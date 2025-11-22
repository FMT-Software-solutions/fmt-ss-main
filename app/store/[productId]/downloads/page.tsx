import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPremiumAppWithDownloadsBySlug } from '@/lib/sanity';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Globe, Monitor, Smartphone, Apple, Download } from 'lucide-react';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ productId: string }>;
}): Promise<Metadata> {
  const { productId } = await params;
  return {
    title: `Downloads | ${productId}`,
    description: 'Download this product for your preferred platform.',
  };
}

export default async function DownloadsPage({
  params,
}: {
  params: Promise<{ productId: string }>;
}) {
  const { productId } = await params;
  const product = await getPremiumAppWithDownloadsBySlug(productId);

  if (!product) {
    notFound();
  }

  const platforms = product.platforms || {};

  const hasAnyDownload = Boolean(
    (platforms.web?.available && platforms.web?.webAppUrl) ||
      (platforms.desktop?.windows?.available &&
        platforms.desktop?.windows?.downloadUrl) ||
      (platforms.desktop?.macos?.available &&
        platforms.desktop?.macos?.downloadUrl) ||
      (platforms.desktop?.linux?.available &&
        platforms.desktop?.linux?.downloadUrl) ||
      (platforms.mobile?.android?.available &&
        (platforms.mobile?.android?.playStoreUrl ||
          platforms.mobile?.android?.apkUrl)) ||
      (platforms.mobile?.ios?.available && platforms.mobile?.ios?.appStoreUrl)
  );

  if (!hasAnyDownload) {
    return (
      <div className="container py-10">
        <h1 className="text-2xl font-semibold mb-4">No Downloads Available</h1>
        <p className="text-muted-foreground mb-6">
          This product does not have any downloadable platforms at the moment.
        </p>
        <Link href={`/store/${product.slug.current}`}>
          <Button variant="secondary">Back to Product</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-10 min-h-[calc(100vh-160px)]">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Download {product.title}</h1>
        <Link href={`/store/${product.slug.current}`}>
          <Button variant="secondary">Back to Product</Button>
        </Link>
      </div>

      <p className="text-muted-foreground mb-6">{product.shortDescription}</p>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Web */}
        {platforms.web?.available && platforms.web?.webAppUrl && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" /> Web
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Link
                href={platforms.web.webAppUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button className="w-full" variant="default">
                  Open Web App
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {/* Desktop */}
        {platforms.desktop?.windows?.available &&
          platforms.desktop?.windows?.downloadUrl && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Monitor className="h-5 w-5" /> Windows
                </CardTitle>
              </CardHeader>
              <CardContent>
                <a
                  href={platforms.desktop.windows.downloadUrl!}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button className="w-full">
                    <Download className="h-4 w-4 mr-2" /> Download for Windows
                  </Button>
                </a>
              </CardContent>
            </Card>
          )}

        {platforms.desktop?.macos?.available &&
          platforms.desktop?.macos?.downloadUrl && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Apple className="h-5 w-5" /> macOS
                </CardTitle>
              </CardHeader>
              <CardContent>
                <a
                  href={platforms.desktop.macos.downloadUrl!}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button className="w-full">
                    <Download className="h-4 w-4 mr-2" /> Download for macOS
                  </Button>
                </a>
              </CardContent>
            </Card>
          )}

        {platforms.desktop?.linux?.available &&
          platforms.desktop?.linux?.downloadUrl && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Monitor className="h-5 w-5" /> Linux
                </CardTitle>
              </CardHeader>
              <CardContent>
                <a
                  href={platforms.desktop.linux.downloadUrl!}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button className="w-full">
                    <Download className="h-4 w-4 mr-2" /> Download for Linux
                  </Button>
                </a>
              </CardContent>
            </Card>
          )}

        {/* Mobile */}
        {platforms.mobile?.android?.available &&
          (platforms.mobile?.android?.playStoreUrl ||
            platforms.mobile?.android?.apkUrl) && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Smartphone className="h-5 w-5" /> Android
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {platforms.mobile.android.playStoreUrl && (
                  <a
                    href={platforms.mobile.android.playStoreUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button className="w-full">Get it on Google Play</Button>
                  </a>
                )}
                {platforms.mobile.android.apkUrl && (
                  <a
                    href={platforms.mobile.android.apkUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button className="w-full" variant="secondary">
                      <Download className="h-4 w-4 mr-2" /> Download APK
                    </Button>
                  </a>
                )}
              </CardContent>
            </Card>
          )}

        {platforms.mobile?.ios?.available &&
          platforms.mobile?.ios?.appStoreUrl && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Apple className="h-5 w-5" /> iOS
                </CardTitle>
              </CardHeader>
              <CardContent>
                <a
                  href={platforms.mobile.ios.appStoreUrl!}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button className="w-full">Download on the App Store</Button>
                </a>
              </CardContent>
            </Card>
          )}
      </div>
    </div>
  );
}
