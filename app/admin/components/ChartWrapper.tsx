'use client';

import React from 'react';
import * as Recharts from 'recharts';

// Chart data interfaces
interface ChartData {
  [key: string]: any;
}

interface ChartProps {
  data?: ChartData[];
  [key: string]: any;
}

// Type-safe wrapper components that bypass TypeScript checking
export const SafeLineChart = React.forwardRef<any, ChartProps>((props, ref) => {
  const Component = (Recharts as any).LineChart;
  return React.createElement(Component, { ...props, ref });
});
SafeLineChart.displayName = 'SafeLineChart';

export const SafeAreaChart = React.forwardRef<any, ChartProps>((props, ref) => {
  const Component = (Recharts as any).AreaChart;
  return React.createElement(Component, { ...props, ref });
});
SafeAreaChart.displayName = 'SafeAreaChart';

export const SafeBarChart = React.forwardRef<any, ChartProps>((props, ref) => {
  const Component = (Recharts as any).BarChart;
  return React.createElement(Component, { ...props, ref });
});
SafeBarChart.displayName = 'SafeBarChart';

export const SafePieChart = React.forwardRef<any, ChartProps>((props, ref) => {
  const Component = (Recharts as any).PieChart;
  return React.createElement(Component, { ...props, ref });
});
SafePieChart.displayName = 'SafePieChart';

export const SafeRadialBarChart = React.forwardRef<any, ChartProps>((props, ref) => {
  const Component = (Recharts as any).RadialBarChart;
  return React.createElement(Component, { ...props, ref });
});
SafeRadialBarChart.displayName = 'SafeRadialBarChart';

// Re-export other components that don't have issues
export {
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Line,
  Area,
  Bar,
  Pie,
  Cell,
  RadialBar,
} from 'recharts';