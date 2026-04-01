"use client";

import { useState } from "react";
import {
  Download,
  Calendar,
  LayoutGrid,
  Users,
  MessageSquare,
  User,
  TrendingUp,
  TrendingDown,
  Activity,
  Zap,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  Search,
  ArrowRight,
  MessageCircle,
  Hash,
  BarChart3,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
} from "recharts";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

// Sample data for charts
const weeklySignupsData = [
  { day: "Mon", signups: 120 },
  { day: "Tue", signups: 132 },
  { day: "Wed", signups: 101 },
  { day: "Thu", signups: 134 },
  { day: "Fri", signups: 190 },
  { day: "Sat", signups: 230 },
  { day: "Sun", signups: 210 },
];

const membersByInterestData = [
  { name: "Technology", value: 35 },
  { name: "Arts", value: 25 },
  { name: "Finance", value: 15 },
  { name: "Health", value: 15 },
  { name: "Other", value: 10 },
];

const communityPerformanceData = [
  {
    key: "1",
    name: "Photography Enthusiasts",
    slug: "photography-enthusiasts",
    members: 12500,
    activePercentage: 78,
    lastActivity: "2 hours ago",
    icon: "📸",
  },
  {
    key: "2",
    name: "Tech Innovators",
    slug: "tech-innovators",
    members: 9800,
    activePercentage: 82,
    lastActivity: "1 hour ago",
    icon: "💻",
  },
  {
    key: "3",
    name: "Fitness & Health",
    slug: "fitness-health",
    members: 8700,
    activePercentage: 65,
    lastActivity: "3 hours ago",
    icon: "💪",
  },
  {
    key: "4",
    name: "Book Lovers",
    slug: "book-lovers",
    members: 7600,
    activePercentage: 58,
    lastActivity: "5 hours ago",
    icon: "📚",
  },
  {
    key: "5",
    name: "Travel Adventures",
    slug: "travel-adventures",
    members: 6500,
    activePercentage: 72,
    lastActivity: "4 hours ago",
    icon: "✈️",
  },
  {
    key: "6",
    name: "Cooking Masters",
    slug: "cooking-masters",
    members: 5400,
    activePercentage: 67,
    lastActivity: "6 hours ago",
    icon: "🍳",
  },
  {
    key: "7",
    name: "Gaming Community",
    slug: "gaming-community",
    members: 11200,
    activePercentage: 88,
    lastActivity: "30 minutes ago",
    icon: "🎮",
  },
];

// Helper function to get color based on activity percentage
function getActivityColor(percentage: number) {
  if (percentage >= 80) return "#10b981";
  if (percentage >= 60) return "#3b82f6";
  if (percentage >= 40) return "#f59e0b";
  return "#ef4444";
}

// Colors for pie chart
const COLORS = [
  "#6366f1",
  "#c084fc",
  "#fbbf24",
  "#2dd4bf",
  "#f472b6",
];

export default function DiscussionForum() {
  const [dateRange, setDateRange] = useState<string>("7days");

  return (
    <EcosystemWrapper anonymized-1="discussion-forums">
      <EcosystemHeader
        title="Forum Overview"
        badgeText="Community Hub"
        description="Manage and view all discussions and engagement across your forums."
        icon={MessageCircle}
      />

      <EcosystemActionBar shadow="none">
        <div className="flex items-center justify-between w-full">
           <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                 <div className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                 <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                    Forums: Active
                 </span>
              </div>
              <div className="h-4 w-px bg-slate-200" />
              <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest italic">
                 <Globe className="h-3.5 w-3.5 text-indigo-500" />
                 <span>System: Online</span>
              </div>
           </div>

           <div className="flex items-center gap-3">
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger className="h-10 w-[180px] rounded-xl border-slate-200 font-bold text-slate-600 bg-white">
                  <Calendar className="h-4 w-4 mr-2 text-indigo-500" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-2xl border-slate-100 shadow-2xl">
                  <SelectItem value="today" className="font-bold uppercase text-[10px]">Today</SelectItem>
                  <SelectItem value="7days" className="font-bold uppercase text-[10px]">Last 7 Days</SelectItem>
                  <SelectItem value="30days" className="font-bold uppercase text-[10px]">Last 30 Days</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" className="h-10 px-4 rounded-xl border-slate-200 font-bold text-slate-600 gap-2 hover:bg-slate-50 transition-all">
                <Download className="h-4 w-4 text-emerald-500" />
                Export Data
              </Button>
           </div>
        </div>
      </EcosystemActionBar>

      <EcosystemContainer className="space-y-12 p-8 lg:p-12">
        {/* Metric Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
           {[
             { label: "Total Forums", value: "128", trend: "+3 new", icon: LayoutGrid, color: "text-emerald-500", bg: "bg-emerald-500/10" },
             { label: "Total Threads", value: "542", trend: "18% up", icon: Hash, color: "text-amber-500", bg: "bg-amber-500/10" },
             { label: "Total Posts", value: "3,200", trend: "+24% up", icon: MessageSquare, color: "text-blue-500", bg: "bg-blue-500/10" },
             { label: "Active Members", value: "1,240", trend: "Steady", icon: Users, color: "text-indigo-500", bg: "bg-indigo-500/10" }
           ].map((stat, i) => (
             <div key={i} className="p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-xl shadow-slate-200/50 group hover:shadow-2xl hover:translate-y-[-4px] transition-all duration-500 relative overflow-hidden">
                <div className={cn("inline-flex p-4 rounded-2xl mb-6 transition-all duration-500 group-hover:scale-110", stat.bg)}>
                   <stat.icon className={cn("h-6 w-6", stat.color)} />
                </div>
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</h4>
                <div className="flex items-baseline gap-3">
                   <span className="text-3xl font-black text-slate-900">{stat.value}</span>
                   <span className={cn("text-[9px] font-black uppercase tracking-tighter opacity-70", stat.color)}>
                      {stat.trend}
                   </span>
                </div>
             </div>
           ))}
        </div>

        {/* Analytic Array */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
           <div className="lg:col-span-8 space-y-8">
              <div className="flex items-center gap-3 px-1">
                 <div className="h-10 w-10 rounded-xl bg-slate-900 flex items-center justify-center text-white">
                    <Activity className="h-5 w-5" />
                 </div>
                 <div>
                    <h3 className="text-xl font-black text-slate-900 tracking-tight italic uppercase">Posting Activity</h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] leading-none mt-1">New threads and posts over time</p>
                 </div>
              </div>
              <div className="p-10 rounded-[3rem] bg-white border border-slate-100 shadow-xl shadow-slate-200/50">
                 <div className="h-[350px] w-full">
                   <ResponsiveContainer width="100%" height="100%">
                     <AreaChart
                       data={weeklySignupsData}
                       margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                     >
                       <defs>
                         <linearGradient id="colorThreads" x1="0" y1="0" x2="0" y2="1">
                           <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15}/>
                           <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                         </linearGradient>
                       </defs>
                       <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                       <XAxis 
                         dataKey="day" 
                         axisLine={false} 
                         tickLine={false} 
                         tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }}
                       />
                       <YAxis 
                         axisLine={false} 
                         tickLine={false} 
                         tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }}
                       />
                       <RechartsTooltip
                         contentStyle={{
                           backgroundColor: "#0f172a",
                           border: "none",
                           borderRadius: "16px",
                           boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                         }}
                         itemStyle={{ color: "#fff", fontWeight: 900, textTransform: "uppercase", fontSize: "10px" }}
                         labelStyle={{ display: "none" }}
                       />
                       <Area
                         type="monotone"
                         dataKey="signups"
                         stroke="#6366f1"
                         strokeWidth={4}
                         fillOpacity={1}
                         fill="url(#colorThreads)"
                       />
                     </AreaChart>
                   </ResponsiveContainer>
                 </div>
              </div>
           </div>

           <div className="lg:col-span-4 space-y-8">
              <div className="flex items-center gap-3 px-1">
                 <div className="h-10 w-10 rounded-xl bg-slate-900 flex items-center justify-center text-white">
                    <BarChart3 className="h-5 w-5" />
                 </div>
                 <div>
                    <h3 className="text-xl font-black text-slate-900 tracking-tight italic uppercase">Popular Topics</h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] leading-none mt-1">Engagement by category</p>
                 </div>
              </div>
              <div className="p-10 rounded-[3rem] bg-white border border-slate-100 shadow-xl shadow-slate-200/50 flex items-center justify-center">
                 <div className="h-[350px] w-full">
                   <ResponsiveContainer width="100%" height="100%">
                     <PieChart>
                       <Pie
                         data={membersByInterestData}
                         cx="50%"
                         cy="50%"
                         innerRadius={60}
                         outerRadius={100}
                         paddingAngle={8}
                         dataKey="value"
                         stroke="none"
                       >
                         {membersByInterestData.map((entry, index) => (
                           <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} cornerRadius={8} />
                         ))}
                       </Pie>
                       <RechartsTooltip
                         contentStyle={{
                           backgroundColor: "#fff",
                           border: "1px solid #f1f5f9",
                           borderRadius: "16px",
                           boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                         }}
                         itemStyle={{ color: "#0f172a", fontWeight: 900, fontSize: "10px", textTransform: "uppercase" }}
                       />
                       <Legend 
                         verticalAlign="bottom" 
                         height={36} 
                         formatter={(value) => <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{value}</span>}
                       />
                     </PieChart>
                   </ResponsiveContainer>
                 </div>
              </div>
           </div>
        </div>

        {/* Performance Matrix Table */}
        <div className="space-y-8">
           <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-3">
                 <div className="h-12 w-12 rounded-[1.5rem] bg-slate-900 flex items-center justify-center text-white shadow-xl shadow-slate-200">
                    <Zap className="h-6 w-6" />
                 </div>
                 <div>
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight italic uppercase">Forum Performance</h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] leading-none mt-1">Key metrics for each forum</p>
                 </div>
              </div>
              <Button variant="outline" className="h-12 px-8 rounded-2xl border-slate-200 font-black text-slate-600 gap-3 hover:bg-slate-50 transition-all uppercase text-[10px] tracking-widest">
                 View All
                 <ArrowRight className="h-4 w-4" />
              </Button>
           </div>

           <div className="rounded-[2.5rem] border border-slate-100 bg-white shadow-xl shadow-slate-200/50 overflow-hidden">
             <div className="divide-y divide-slate-50">
               {communityPerformanceData.map((forum) => (
                 <div
                   key={forum.key}
                   className="flex items-center justify-between p-8 group hover:bg-slate-50/80 transition-all duration-300"
                 >
                   <div className="flex items-center gap-8 flex-1">
                      <div className="h-16 w-16 bg-white rounded-2xl flex items-center justify-center text-3xl shadow-lg border border-slate-50 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                         {forum.icon}
                      </div>
                      <div className="space-y-1">
                         <h4 className="text-lg font-black text-slate-900 tracking-tight italic uppercase group-hover:text-indigo-600 transition-colors">
                           {forum.name}
                         </h4>
                         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                           Identifier: {forum.slug}
                         </p>
                      </div>
                   </div>
                   
                   <div className="flex items-center gap-16">
                     <div className="text-right space-y-1">
                       <p className="text-xl font-black text-slate-900">
                         {forum.members.toLocaleString()}
                       </p>
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Members</p>
                     </div>

                     <div className="w-48 space-y-3">
                       <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Activity</span>
                          <span className="text-[10px] font-black text-slate-900 leading-none">{forum.activePercentage}%</span>
                       </div>
                       <div className="h-2 bg-slate-100 rounded-full overflow-hidden p-0.5">
                         <div
                           className="h-full rounded-full transition-all duration-1000 group-hover:animate-pulse"
                           style={{
                             width: `${forum.activePercentage}%`,
                             backgroundColor: getActivityColor(forum.activePercentage),
                             boxShadow: `0 0 10px ${getActivityColor(forum.activePercentage)}40`
                           }}
                         />
                       </div>
                     </div>

                     <div className="text-right w-32 space-y-1">
                       <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic leading-none">Last Post</p>
                       <p className="text-sm font-bold text-slate-400">
                         {forum.lastActivity}
                       </p>
                     </div>
                   </div>
                 </div>
               ))}
             </div>
           </div>
        </div>
      </EcosystemContainer>
    </EcosystemWrapper>
  );
}
