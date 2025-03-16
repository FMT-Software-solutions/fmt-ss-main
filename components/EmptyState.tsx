import { ReactNode } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  children?: ReactNode;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  children,
}: EmptyStateProps) {
  return (
    <Card className="w-full border-dashed">
      <CardHeader className="flex flex-col items-center justify-center text-center space-y-2">
        {Icon && <Icon className="h-12 w-12 text-muted-foreground/50" />}
        <CardTitle>{title}</CardTitle>
        <CardDescription className="text-center">{description}</CardDescription>
      </CardHeader>
      {children && (
        <CardContent className="flex items-center justify-center">
          {children}
        </CardContent>
      )}
    </Card>
  );
}
