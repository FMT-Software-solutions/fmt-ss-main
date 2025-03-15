'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Menu } from 'lucide-react';
import type { NavigationLink } from '@/types/navigation';

interface MobileMenuProps {
  navigationLinks: NavigationLink[];
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MobileMenu({
  navigationLinks,
  isOpen,
  onOpenChange,
}: MobileMenuProps) {
  const pathname = usePathname();

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>
        <nav className="mt-6 flex flex-col space-y-4">
          {navigationLinks.map(({ href, icon: Icon, label }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground',
                pathname === href && 'bg-accent'
              )}
              onClick={() => onOpenChange(false)}
            >
              <Icon className="mr-2 h-4 w-4" />
              {label}
            </Link>
          ))}
          <Link
            href="/contact"
            className="flex items-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
            onClick={() => onOpenChange(false)}
          >
            Contact Us
          </Link>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
