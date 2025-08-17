import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: LucideIcon;
  trend?: {
    value: number;
    label: string;
    isPositive: boolean;
  };
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple' | 'gray';
  className?: string;
}

const colorClasses = {
  blue: 'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950',
  green: 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950',
  yellow: 'border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950',
  red: 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950',
  purple: 'border-purple-200 bg-purple-50 dark:border-purple-800 dark:bg-purple-950',
  gray: 'border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-950',
};

const iconColorClasses = {
  blue: 'text-blue-600 dark:text-blue-400',
  green: 'text-green-600 dark:text-green-400',
  yellow: 'text-yellow-600 dark:text-yellow-400',
  red: 'text-red-600 dark:text-red-400',
  purple: 'text-purple-600 dark:text-purple-400',
  gray: 'text-gray-600 dark:text-gray-400',
};

export function StatsCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  color = 'gray',
  className,
}: StatsCardProps) {
  return (
    <Card className={cn(colorClasses[color], className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {Icon && (
          <div className={cn('rounded-lg p-2', `bg-${color}-100 dark:bg-${color}-900`)}>
            <Icon className={cn('h-4 w-4', iconColorClasses[color])} />
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
        {trend && (
          <div className="mt-2 flex items-center text-xs">
            <span
              className={cn(
                'font-medium',
                trend.isPositive
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-red-600 dark:text-red-400'
              )}
            >
              {trend.isPositive ? '↗' : '↘'} {trend.isPositive ? '+' : ''}{trend.value}%
            </span>
            <span className="ml-1 text-muted-foreground">{trend.label}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}