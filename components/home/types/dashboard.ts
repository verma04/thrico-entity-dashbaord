// types/dashboard.ts
export interface KPIData {
  title: string;
  value: number;
  prefix: React.ReactNode;
  suffix?: string;
  change: number;
  trend: "up" | "down";
  color: string;
  desc: string;
  target: number;
  progress: number;
}

export interface UserGrowthData {
  month: string;
  users: number;
  newUsers: number;
  activeUsers: number;
}

export interface ModuleActivityData {
  module: string;
  users: number;
  engagement: number;
  growth: number;
}

export interface RecentActivity {
  id: number;
  user: string;
  action: string;
  module: string;
  time: string;
  avatar: string;
}

export interface ChartConfig {
  data: any[];
  xField: string;
  yField: string;
  [key: string]: any;
}

export interface DashboardFilters {
  dateRange: [any, any] | null;
  selectedPeriod: string;
  moduleFilter?: string[];
}

export interface DashboardState {
  loading: boolean;
  filters: DashboardFilters;
  lastUpdated: Date;
}

export interface MetricTrend {
  value: number;
  change: number;
  direction: "up" | "down" | "stable";
  period: string;
}

export interface ModulePerformance {
  module: string;
  activeUsers: number;
  totalSessions: number;
  avgSessionDuration: number;
  bounceRate: number;
  conversionRate: number;
  revenue?: number;
  satisfaction: number;
  retention: {
    day1: number;
    day7: number;
    day30: number;
  };
  topFeatures: string[];
  issues: string[];
}

export interface UserSegment {
  segment: string;
  count: number;
  percentage: number;
  growth: number;
  avgEngagement: number;
  revenue?: number;
}

export interface AlertData {
  id: string;
  type: "warning" | "error" | "info" | "success";
  title: string;
  message: string;
  timestamp: Date;
  resolved: boolean;
  priority: "high" | "medium" | "low";
}
