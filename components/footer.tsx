import Link from 'next/link';
import { Code2 } from 'lucide-react';

export default function Footer() {
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
          <div>
            <h3 className="text-lg font-semibold">Products</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link
                  href="/store"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Software Store
                </Link>
              </li>
              <li>
                <Link
                  href="/free-apps"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Free Apps
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold">Training</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link
                  href="/training"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Workshops
                </Link>
              </li>
              <li>
                <Link
                  href="/training/archive"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Training Archive
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold">Company</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link
                  href="/about"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-10 border-t pt-8">
          <p className="text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} FMT Software Solutions. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
