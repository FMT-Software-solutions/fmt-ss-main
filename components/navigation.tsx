'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ModeToggle } from '@/components/mode-toggle';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '@/components/ui/navigation-menu';
import { Code2, BookOpen, Download, GraduationCap } from 'lucide-react';
import { MobileMenu } from '@/components/mobile-menu';
import type { NavigationLink } from '@/types/navigation';

// Navigation links data - extracted to avoid recreating
const navigationLinks: NavigationLink[] = [
  { href: '/store', icon: BookOpen, label: 'Store' },
  { href: '/free-apps', icon: Download, label: 'Free Apps' },
  { href: '/training', icon: GraduationCap, label: 'Training' },
];

export default function Navigation() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <Code2 className="h-6 w-6" />
          <span className="font-bold">FMT Software Solutions</span>
        </Link>

        {/* Desktop Navigation */}
        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList>
            {navigationLinks.map(({ href, icon: Icon, label }) => (
              <NavigationMenuItem key={href}>
                <Link href={href} legacyBehavior passHref>
                  <NavigationMenuLink
                    className={cn(
                      'group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50',
                      pathname === href && 'bg-accent'
                    )}
                  >
                    <Icon className="mr-2 h-4 w-4" />
                    {label}
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        <div className="flex items-center space-x-4">
          <ModeToggle />
          <Button asChild variant="default" className="hidden md:inline-flex">
            <Link href="/contact">Contact Us</Link>
          </Button>

          {/* Mobile Menu */}
          <MobileMenu
            navigationLinks={navigationLinks}
            isOpen={isOpen}
            onOpenChange={setIsOpen}
          />
        </div>
      </div>
    </header>
  );
}
