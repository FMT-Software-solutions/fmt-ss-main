'use client';

import { Card, CardContent } from '@/components/ui/card';
import { IPremiumApp } from '@/types/premium-app';
import { PortableText } from '@portabletext/react';


interface ProductDescriptionProps {
  product: IPremiumApp;
}

export default function ProductDescription({
  product,
}: ProductDescriptionProps) {
  return (
    <Card className="mb-12 shadow-lg overflow-hidden bg-card">
      <CardContent className="p-8">
       
          
          
          {/* Description Section */}
          <div className="p-8 pt-0">
            <h2 className="text-2xl font-bold mb-6">About {product.title}</h2>
            {product.description && (
              <div className="prose dark:prose-invert max-w-none">
                <PortableText 
                  value={product.description}
                  components={{
                    block: {
                      normal: ({children}) => <p className="mb-4 text-base leading-relaxed">{children}</p>,
                      h1: ({children}) => <h1 className="text-3xl font-bold mb-6 mt-8">{children}</h1>,
                      h2: ({children}) => <h2 className="text-2xl font-semibold mb-4 mt-6">{children}</h2>,
                      h3: ({children}) => <h3 className="text-xl font-semibold mb-3 mt-5">{children}</h3>,
                      h4: ({children}) => <h4 className="text-lg font-semibold mb-2 mt-4">{children}</h4>,
                      blockquote: ({children}) => (
                        <blockquote className="border-l-4 border-primary pl-4 italic my-4 text-muted-foreground">
                          {children}
                        </blockquote>
                      ),
                    },
                    list: {
                      bullet: ({children}) => <ul className="list-disc list-inside mb-4 space-y-2">{children}</ul>,
                      number: ({children}) => <ol className="list-decimal list-inside mb-4 space-y-2">{children}</ol>,
                    },
                    listItem: {
                      bullet: ({children}) => <li className="text-base">{children}</li>,
                      number: ({children}) => <li className="text-base">{children}</li>,
                    },
                    marks: {
                      strong: ({children}) => <strong className="font-semibold">{children}</strong>,
                      em: ({children}) => <em className="italic">{children}</em>,
                      code: ({children}) => (
                        <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">{children}</code>
                      ),
                      link: ({children, value}) => (
                        <a 
                          href={value?.href} 
                          className="text-primary hover:underline" 
                          target="_blank" 
                          rel="noopener noreferrer"
                        >
                          {children}
                        </a>
                      ),
                    },
                  }}
                />
              </div>
            )}
          </div>
       
      </CardContent>
    </Card>
  );
}
