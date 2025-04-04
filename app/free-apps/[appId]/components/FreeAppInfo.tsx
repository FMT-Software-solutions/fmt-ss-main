'use client';

import { Button } from '@/components/ui/button';
import { Download, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { IFreeApp } from '@/types/free-app';
import { Badge } from '@/components/ui/badge';
import { PortableText } from '@portabletext/react';

interface FreeAppInfoProps {
  app: IFreeApp;
}

export default function FreeAppInfo({ app }: FreeAppInfoProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-4xl font-bold">{app.title}</h1>
        <Badge className="bg-green-500">Free</Badge>
      </div>

      <p className="text-xl text-muted-foreground mb-6">
        {app.shortDescription}
      </p>

      {app.category && (
        <div className="mb-4">
          <span className="text-sm text-muted-foreground">Category: </span>
          <Badge variant="outline">{app.category}</Badge>
        </div>
      )}

      <div className="flex flex-wrap gap-4 mb-8">
        {app.downloadUrl && (
          <Button asChild className="flex items-center">
            <Link
              href={app.downloadUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Download className="mr-2 h-5 w-5" />
              Download
            </Link>
          </Button>
        )}
        {app.webAppUrl && (
          <Button variant="outline" asChild className="flex items-center">
            <Link
              href={app.webAppUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink className="mr-2 h-5 w-5" />
              Open Web App
            </Link>
          </Button>
        )}
      </div>

      {app.description && (
        <div className="mt-6">
          <h2 className="text-2xl font-semibold mb-4">About</h2>
          <PortableText value={app.description} />
        </div>
      )}
    </div>
  );
}
