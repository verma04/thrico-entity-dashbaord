// hooks/useDashboard.ts
import { useState, useEffect, useCallback, useMemo } from "react";
import {
  KPIData,
  ModuleActivityData,
  UserGrowthData,
  RecentActivity,
  DashboardFilters,
} from "../types/dashboard";
import {
  generateMockData,
  calculatePercentageChange,
  getTrendDirection,
} from "../utils/dashboardUtils";

export interface UseDashboardReturn {
  // Data
  kpiData: KPIData[];
  userGrowthData: UserGrowthData[];
  moduleActivityData: ModuleActivityData[];
  recentActivities: RecentActivity[];

  // State
  loading: boolean;
  error: string | null;
  filters: DashboardFilters;
  lastUpdated: Date | null;

  // Actions
  refreshData: () => Promise<void>;
  updateFilters: (newFilters: Partial<DashboardFilters>) => void;
  exportData: (type: "csv" | "json") => void;
}

// Mock API delay simulation
const API_DELAY = 1000;

const mockApiCall = <T>(data: T): Promise<T> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), API_DELAY);
  });
};

export const useDashboard = (): UseDashboardReturn => {
  const [kpiData, setKpiData] = useState<KPIData[]>([]);
  const [userGrowthData, setUserGrowthData] = useState<UserGrowthData[]>([]);
  const [moduleActivityData, setModuleActivityData] = useState<
    ModuleActivityData[]
  >([]);
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>(
    []
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const [filters, setFilters] = useState<DashboardFilters>({
    dateRange: null,
    selectedPeriod: "30d",
    moduleFilter: undefined,
  });

  // Generate mock KPI data with proper icons and formatting
  const generateKPIData = useCallback((): KPIData[] => {
    const baseKPIs = [
      {
        title: "Total Users",
        value: 12547,
        change: 12.5,
        target: 15000,
        color: "#52c41a",
      },
      {
        title: "Active Users (30d)",
        value: 8942,
        change: -2.3,
        target: 10000,
        color: "#ff4d4f",
      },
      {
        title: "User Engagement",
        value: 86.4,
        suffix: "%",
        change: 15.2,
        target: 90,
        color: "#1890ff",
      },
      {
        title: "Avg Response Time",
        value: 245,
        suffix: "ms",
        change: -8.1,
        target: 200,
        color: "#52c41a",
      },
    ];

    return baseKPIs.map((kpi) => ({
      ...kpi,
      prefix: null, // Will be set in component
      trend: kpi.change > 0 ? ("up" as const) : ("down" as const),
      desc: `${Math.abs(kpi.change)}% vs last month`,
      progress: (kpi.value / kpi.target) * 100,
    }));
  }, []);

  // Generate mock recent activities
  const generateRecentActivities = useCallback((): RecentActivity[] => {
    const activities = [
      {
        user: "Sarah Chen",
        action: "Created new community",
        module: "Communities",
        time: "2 minutes ago",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
      },
      {
        user: "Mike Johnson",
        action: "Published mentorship session",
        module: "Mentorship",
        time: "5 minutes ago",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike",
      },
      {
        user: "Alex Kumar",
        action: "Posted job opportunity",
        module: "Jobs",
        time: "12 minutes ago",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
      },
      {
        user: "Lisa Wang",
        action: "Started forum discussion",
        module: "Forum",
        time: "25 minutes ago",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa",
      },
      {
        user: "David Park",
        action: "Shared success story",
        module: "Feed",
        time: "1 hour ago",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
      },
    ];

    return activities.map((activity, index) => ({
      id: index + 1,
      ...activity,
    }));
  }, []);

  // Fetch dashboard data
  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Simulate API calls
      const [kpis, growth, modules, activities] = await Promise.all([
        mockApiCall(generateKPIData()),
        mockApiCall(generateMockData.userGrowth(6)),
        mockApiCall(
          generateMockData.moduleActivity([
            "Feed",
            "Communities",
            "Forum",
            "Mentorship",
            "Events",
            "Jobs",
            "Offers",
            "Listings",
          ])
        ),
        mockApiCall(generateRecentActivities()),
      ]);

      setKpiData(kpis);
      setUserGrowthData(growth);
      setModuleActivityData(modules);
      setRecentActivities(activities);
      setLastUpdated(new Date());
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch dashboard data"
      );
    } finally {
      setLoading(false);
    }
  }, [generateKPIData, generateRecentActivities]);

  // Refresh data
  const refreshData = useCallback(async () => {
    await fetchDashboardData();
  }, [fetchDashboardData]);

  // Update filters
  const updateFilters = useCallback((newFilters: Partial<DashboardFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  }, []);

  // Export data
  const exportData = useCallback(
    (type: "csv" | "json") => {
      const data = {
        kpiData,
        userGrowthData,
        moduleActivityData,
        recentActivities,
        filters,
        lastUpdated,
      };

      if (type === "json") {
        const dataStr = JSON.stringify(data, null, 2);
        const dataBlob = new Blob([dataStr], { type: "application/json" });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `dashboard-data-${new Date().toISOString().split("T")[0]}.json`;
        link.click();
        URL.revokeObjectURL(url);
      } else {
        // For CSV, we'll export KPI data as an example
        const csvContent = [
          "Title,Value,Change,Target,Progress",
          ...kpiData.map(
            (kpi) =>
              `${kpi.title},${kpi.value},${kpi.change},${kpi.target},${kpi.progress.toFixed(1)}%`
          ),
        ].join("\n");

        const blob = new Blob([csvContent], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `dashboard-kpis-${new Date().toISOString().split("T")[0]}.csv`;
        link.click();
        URL.revokeObjectURL(url);
      }
    },
    [
      kpiData,
      userGrowthData,
      moduleActivityData,
      recentActivities,
      filters,
      lastUpdated,
    ]
  );

  // Filtered data based on current filters
  const filteredData = useMemo(() => {
    let filteredModules = moduleActivityData;

    if (filters.moduleFilter && filters.moduleFilter.length > 0) {
      filteredModules = moduleActivityData.filter((module) =>
        filters.moduleFilter!.includes(module.module)
      );
    }

    // Apply date range filtering (simplified for demo)
    let filteredGrowthData = userGrowthData;
    if (filters.dateRange) {
      // Implementation would filter based on actual dates
      // For demo, we'll just return the data as is
    }

    return {
      modules: filteredModules,
      growth: filteredGrowthData,
    };
  }, [moduleActivityData, userGrowthData, filters]);

  // Initial data fetch
  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Auto-refresh every 5 minutes
  useEffect(() => {
    const interval = setInterval(
      () => {
        refreshData();
      },
      5 * 60 * 1000
    ); // 5 minutes

    return () => clearInterval(interval);
  }, [refreshData]);

  return {
    // Data
    kpiData,
    userGrowthData: filteredData.growth,
    moduleActivityData: filteredData.modules,
    recentActivities,

    // State
    loading,
    error,
    filters,
    lastUpdated,

    // Actions
    refreshData,
    updateFilters,
    exportData,
  };
};
