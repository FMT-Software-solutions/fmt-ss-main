import { Button } from '@/components/ui/button';
import { LucideIcon } from 'lucide-react';

interface AdminHeaderProps {
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
    icon?: LucideIcon;
    variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  };
  breadcrumbs?: Array<{
    label: string;
    href?: string;
  }>;
}

export function AdminHeader({
  title,
  description,
  action,
  breadcrumbs,
}: AdminHeaderProps) {
  return (
    <div className="mb-6">
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="mb-2 text-sm text-muted-foreground">
          {breadcrumbs.map((crumb, index) => (
            <span key={index}>
              {crumb.href ? (
                <a href={crumb.href} className="hover:text-foreground">
                  {crumb.label}
                </a>
              ) : (
                <span>{crumb.label}</span>
              )}
              {index < breadcrumbs.length - 1 && <span className="mx-2">/</span>}
            </span>
          ))}
        </nav>
      )}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
          {description && (
            <p className="text-muted-foreground mt-2">{description}</p>
          )}
        </div>
        {action && (
          <Button
            onClick={action.onClick}
            variant={action.variant || 'default'}
            className="shrink-0"
          >
            {action.icon && <action.icon className="mr-2 h-4 w-4" />}
            {action.label}
          </Button>
        )}
      </div>
    </div>
  );
}