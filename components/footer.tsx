import Link from 'next/link';
import { Code2 } from 'lucide-react';

// Footer links data - defined outside component
const footerLinks = {
  products: [
    { href: '/store', label: 'Software Store' },
    { href: '/free-apps', label: 'Free Apps' },
  ],
  training: [
    { href: '/training', label: 'Workshops' },
    { href: '/training/archive', label: 'Training Archive' },
  ],
  company: [
    { href: '/about', label: 'About Us' },
    { href: '/contact', label: 'Contact' },
  ],
};

export default function Footer() {
  // Current year calculation is done during render
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t bg-background">
      <div className="container py-10">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4">
          <div>
            <div className="flex items-center space-x-2">
              <Code2 className="h-6 w-6" />
              <span className="font-bold">FMT Software Solutions</span>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              Empowering businesses with premium software solutions and expert
              training.
            </p>
          </div>

          <FooterLinkSection title="Products" links={footerLinks.products} />
          <FooterLinkSection title="Training" links={footerLinks.training} />
          <FooterLinkSection title="Company" links={footerLinks.company} />
        </div>

        <div className="mt-10 border-t pt-8">
          <p className="text-center text-sm text-muted-foreground">
            © {currentYear} FMT Software Solutions. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

// Extracted component for footer link sections
function FooterLinkSection({
  title,
  links,
}: {
  title: string;
  links: Array<{ href: string; label: string }>;
}) {
  return (
    <div>
      <h3 className="text-lg font-semibold">{title}</h3>
      <ul className="mt-4 space-y-2">
        {links.map(({ href, label }) => (
          <li key={href}>
            <Link
              href={href}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
