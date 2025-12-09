// utils/dashboardUtils.ts
import {
  KPIData,
  ModuleActivityData,
  UserGrowthData,
} from "../types/dashboard";

/**
 * Format large numbers with appropriate suffixes (K, M, B)
 */
export const formatNumber = (num: number): string => {
  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(1) + "B";
  }
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K";
  }
  return num.toString();
};

/**
 * Calculate percentage change between two values
 */
export const calculatePercentageChange = (
  current: number,
  previous: number
): number => {
  if (previous === 0) return 0;
  return ((current - previous) / previous) * 100;
};

/**
 * Get trend direction based on percentage change
 */
export const getTrendDirection = (change: number): "up" | "down" | "stable" => {
  if (change > 0.5) return "up";
  if (change < -0.5) return "down";
  return "stable";
};

/**
 * Format time ago string
 */
export const formatTimeAgo = (date: Date): string => {
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInMinutes < 1) return "Just now";
  if (diffInMinutes < 60)
    return `${diffInMinutes} minute${diffInMinutes > 1 ? "s" : ""} ago`;
  if (diffInHours < 24)
    return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
  return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
};

/**
 * Generate color palette for charts
 */
export const getChartColors = (count: number): string[] => {
  const baseColors = [
    "#1890ff",
    "#52c41a",
    "#faad14",
    "#f759ab",
    "#13c2c2",
    "#eb2f96",
    "#722ed1",
    "#fa541c",
    "#2f54eb",
    "#389e0d",
    "#d4b106",
    "#c41d7f",
    "#08979c",
    "#d4380d",
    "#531dab",
    "#cf1322",
  ];

  return baseColors.slice(0, count);
};

/**
 * Calculate engagement score based on multiple metrics
 */
export const calculateEngagementScore = (
  sessions: number,
  duration: number,
  interactions: number,
  retention: number
): number => {
  // Weighted scoring algorithm
  const sessionWeight = 0.25;
  const durationWeight = 0.3;
  const interactionWeight = 0.25;
  const retentionWeight = 0.2;

  // Normalize values (assuming max values for normalization)
  const normalizedSessions = Math.min(sessions / 100, 1);
  const normalizedDuration = Math.min(duration / 300, 1); // 5 minutes max
  const normalizedInteractions = Math.min(interactions / 50, 1);
  const normalizedRetention = retention / 100;

  const score =
    (normalizedSessions * sessionWeight +
      normalizedDuration * durationWeight +
      normalizedInteractions * interactionWeight +
      normalizedRetention * retentionWeight) *
    100;

  return Math.round(score);
};

/**
 * Get performance status based on metric values
 */
export const getPerformanceStatus = (
  value: number,
  target: number
): {
  status: "excellent" | "good" | "fair" | "poor";
  color: string;
} => {
  const percentage = (value / target) * 100;

  if (percentage >= 95) return { status: "excellent", color: "#52c41a" };
  if (percentage >= 80) return { status: "good", color: "#1890ff" };
  if (percentage >= 60) return { status: "fair", color: "#faad14" };
  return { status: "poor", color: "#ff4d4f" };
};

/**
 * Generate mock data for development/testing
 */
export const generateMockData = {
  userGrowth: (months: number): UserGrowthData[] => {
    const data: UserGrowthData[] = [];
    const baseUsers = 8000;

    for (let i = 0; i < months; i++) {
      const month = new Date();
      month.setMonth(month.getMonth() - (months - i - 1));

      data.push({
        month: month.toLocaleDateString("en-US", { month: "short" }),
        users: baseUsers + i * 500 + Math.floor(Math.random() * 300),
        newUsers: 800 + Math.floor(Math.random() * 400),
        activeUsers: baseUsers + i * 400 + Math.floor(Math.random() * 200),
      });
    }

    return data;
  },

  moduleActivity: (modules: string[]): ModuleActivityData[] => {
    return modules.map((module) => ({
      module,
      users: Math.floor(Math.random() * 3000) + 500,
      engagement: Math.floor(Math.random() * 30) + 70,
      growth: (Math.random() - 0.3) * 30, // Can be negative
    }));
  },

  kpiData: (): KPIData[] => {
    const kpis = [
      { title: "Total Users", baseValue: 12000, target: 15000 },
      { title: "Active Users", baseValue: 8500, target: 10000 },
      { title: "Engagement Rate", baseValue: 85, target: 90, suffix: "%" },
      { title: "Response Time", baseValue: 240, target: 200, suffix: "ms" },
    ];

    return kpis.map((kpi, index) => {
      const variance = (Math.random() - 0.5) * 0.2;
      const value = Math.floor(kpi.baseValue * (1 + variance));
      const change = (Math.random() - 0.3) * 20;

      return {
        title: kpi.title,
        value,
        prefix: null, // Will be set in component
        suffix: kpi.suffix,
        change,
        trend: change > 0 ? "up" : "down",
        color: change > 0 ? "#52c41a" : "#ff4d4f",
        desc: `${Math.abs(change).toFixed(1)}% vs last month`,
        target: kpi.target,
        progress: (value / kpi.target) * 100,
      };
    });
  },
};

/**
 * Export data to CSV format
 */
export const exportToCSV = (data: any[], filename: string) => {
  if (data.length === 0) return;

  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(","),
    ...data.map((row) =>
      headers
        .map((header) => {
          const value = row[header];
          return typeof value === "string" && value.includes(",")
            ? `"${value}"`
            : value;
        })
        .join(",")
    ),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.setAttribute("href", url);
  link.setAttribute("download", `${filename}.csv`);
  link.style.visibility = "hidden";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Debounce function for search and filter operations
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};
