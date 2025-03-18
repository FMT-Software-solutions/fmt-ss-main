import Link from 'next/link';

// Footer links data - defined outside component
const footerLinks = {
  products: [
    { href: '/projects', label: 'Public Projects' },
    { href: '/store', label: 'Premium Apps' },
    { href: '/free-apps', label: 'Free Apps' },
  ],
  training: [
    { href: '/training', label: 'Training Programs' },
    { href: '/training/archive', label: 'Events' },
  ],
  company: [
    { href: '/about', label: 'About Us' },
    { href: '/contact', label: 'Contact' },
  ],
};

export function Footer() {
  // Current year calculation is done during render
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t bg-background">
      <div className="container py-10">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4">
          <div>
            <div className="flex items-center space-x-2">
              <Link href="/" className="flex items-end space-x-2">
                <img
                  src={`/fmt-logo.png`}
                  alt="FMT Logo"
                  className="h-8 w-auto dark:hidden"
                />
                <img
                  src="/fmt-logo-white.png"
                  alt="FMT Logo"
                  className="hidden h-8 w-auto dark:block"
                />
                <span className="font-bold">Software Solutions</span>
              </Link>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              Building innovative software solutions that address real
              challenges and accelerate growth.
            </p>
          </div>

          <FooterLinkSection title="Solutions" links={footerLinks.products} />
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
