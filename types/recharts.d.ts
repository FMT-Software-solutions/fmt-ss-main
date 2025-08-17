declare module 'recharts' {
  import { Component } from 'react';
  
  export interface ChartData {
    [key: string]: any;
  }
  
  export interface BaseChartProps {
    data?: ChartData[];
    width?: number | string;
    height?: number | string;
    margin?: {
      top?: number;
      right?: number;
      bottom?: number;
      left?: number;
    };
    [key: string]: any;
  }
  
  export class LineChart extends Component<BaseChartProps> {}
  export class AreaChart extends Component<BaseChartProps> {}
  export class BarChart extends Component<BaseChartProps> {}
  export class PieChart extends Component<BaseChartProps> {}
  export class RadialBarChart extends Component<BaseChartProps> {}
  export class ComposedChart extends Component<BaseChartProps> {}
  
  export class ResponsiveContainer extends Component<any> {}
  export class CartesianGrid extends Component<any> {}
  export class XAxis extends Component<any> {}
  export class YAxis extends Component<any> {}
  export class Tooltip extends Component<any> {}
  export class Legend extends Component<any> {}
  export class Line extends Component<any> {}
  export class Area extends Component<any> {}
  export class Bar extends Component<any> {}
  export class Pie extends Component<any> {}
  export class Cell extends Component<any> {}
  export class RadialBar extends Component<any> {}
}