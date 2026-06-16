"use client";

import {
  Briefcase,
  TrendingUp,
  Users,
  Eye,
  Star,
  CheckCircle,
} from "lucide-react";
import { StatCard } from "@/components/ui/stat-card";
import { useJobStats } from "../../graphql/actions/jobs";
import { useModuleStore } from "@/store/useModuleStore";

const Stats = () => {
  const moduleName = useModuleStore((state) => state.jobModuleName);
  const singularName = useModuleStore((state) => state.jobSingularName);
  const { data } = useJobStats();
  const stats = data?.getJobStats;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 mb-6">
      <StatCard
        title={`Total ${moduleName}`}
        value={stats?.totalJobs || 0}
        icon={Briefcase}
        color="green"
        description={
          <>
            <TrendingUp className="h-3 w-3 mr-1" />+
            {stats?.applicationsLastWeek || 0} this month
          </>
        }
      />

      <StatCard
        title={`Active ${moduleName}`}
        value={stats?.activeJobs || 0}
        icon={CheckCircle}
        color="amber"
        description={
          <>
            <TrendingUp className="h-3 w-3 mr-1" />
            {stats?.totalJobs || 0}% of total {moduleName.toLowerCase()}
          </>
        }
      />

      <StatCard
        title="Total Applications"
        value={stats?.totalApplications || 0}
        icon={Users}
        color="blue"
        description={
          <>
            <TrendingUp className="h-3 w-3 mr-1" />+
            {stats?.applicationsThisWeek || 0} this week
          </>
        }
      />

      <StatCard
        title="Total Views"
        value={stats?.totalViews || 0}
        icon={Eye}
        color="pink"
        description={
          <>
            <TrendingUp className="h-3 w-3 mr-1" />+{stats?.viewsLastWeek || 0}%
            from last week
          </>
        }
      />

      <StatCard
        title="Avg. Applications"
        value={stats?.avgApplications || 0}
        icon={Star}
        color="purple"
        description={
          <>
            <Star className="h-3 w-3 mr-1" />
            per {singularName.toLowerCase()} posting
          </>
        }
      />
    </div>
  );
};

export default Stats;
