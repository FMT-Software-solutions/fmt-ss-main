"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, ShoppingCart } from "lucide-react";
import Image from "next/image";
import type { Product } from './products';

export default function ProductPageClient({ product }: { product: Product }) {
  return (
    <div className="min-h-screen py-10">
      <div className="container max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <div className="aspect-video relative rounded-lg overflow-hidden mb-6">
                <Image
                  src={product.image}
                  alt={product.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex flex-wrap gap-2 mb-6">
                {product.tags.map(tag => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <h1 className="text-4xl font-bold mb-4">{product.title}</h1>
              <p className="text-xl text-muted-foreground mb-6">
                {product.description}
              </p>
              <div className="flex items-center gap-4 mb-8">
                <span className="text-3xl font-bold">${product.price}</span>
                <Button size="lg" className="flex-1">
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Buy Now
                </Button>
              </div>
            </div>
          </div>

          <div className="grid gap-8 md:grid-cols-2 mt-12">
            <Card>
              <CardHeader>
                <CardTitle>Features</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <Check className="mr-2 h-5 w-5 text-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>System Requirements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Operating System</h3>
                    <ul className="list-disc list-inside text-muted-foreground">
                      {product.requirements.os.map((os, index) => (
                        <li key={index}>{os}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Hardware</h3>
                    <ul className="space-y-2 text-muted-foreground">
                      <li>Processor: {product.requirements.processor}</li>
                      <li>Memory: {product.requirements.memory}</li>
                      <li>Storage: {product.requirements.storage}</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
    </div>
  );
}