"use client";

import React from "react";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
  Cell,
} from "recharts";
import { BarChart3 } from "lucide-react";

interface TopActiveCommunitiesChartProps {
  data: Array<{ name: string; members: number }>;
}

export const TopActiveCommunitiesChart: React.FC<
  TopActiveCommunitiesChartProps
> = ({ data }) => {
  return (
    <div className="p-10 rounded-[3.5rem] bg-white border border-slate-100 shadow-2xl shadow-slate-200/50 flex flex-col items-center justify-center relative overflow-hidden group h-full">
        <div className="absolute top-0 right-0 p-8 opacity-5 scale-150 rotate-12 transition-transform duration-1000 group-hover:scale-[1.7]">
           <BarChart3 className="h-32 w-32 text-indigo-500" />
        </div>
        
        <div className="h-[400px] w-full relative z-10">
          {data.length === 0 ? (
             <div className="h-full w-full flex items-center justify-center bg-slate-50/50 rounded-3xl border-2 border-dashed border-slate-100">
                <div className="flex flex-col items-center gap-4 text-center px-6">
                   <div className="h-10 w-10 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin" />
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-relaxed">Mapping top active nodes...</p>
                </div>
             </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data.slice(0, 5)}
                layout="vertical"
                margin={{ top: 0, right: 30, left: 10, bottom: 5 }}
                barGap={8}
              >
                <XAxis type="number" hide />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={140}
                  fontSize={10}
                  fontWeight={900}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "#94a3b8", textTransform: 'uppercase', letterSpacing: '0.1em' }}
                />
                <RechartsTooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    border: "none",
                    borderRadius: "16px",
                    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
                  }}
                  itemStyle={{ color: "#fff", fontWeight: 900, textTransform: 'uppercase', fontSize: '10px' }}
                  labelStyle={{ display: 'none' }}
                  cursor={{ fill: '#f8fafc' }}
                />
                <Bar
                  dataKey="members"
                  radius={[0, 20, 20, 0]}
                  barSize={32}
                  animationDuration={1500}
                >
                   {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === 0 ? '#6366f1' : index === 1 ? '#8b5cf6' : index === 2 ? '#c084fc' : '#e2e8f0'} />
                   ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="w-full mt-10 space-y-4 relative z-10 px-4">
           {data.slice(0, 3).map((item, idx) => (
             <div key={item.name} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100 group/item hover:bg-white hover:shadow-lg transition-all duration-300">
                <div className="flex items-center gap-3">
                   <div className="h-8 w-8 rounded-xl bg-slate-900 flex items-center justify-center text-white text-[10px] font-black group-hover:scale-110 transition-transform">
                      #{idx + 1}
                   </div>
                   <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest truncate max-w-[120px]">{item.name}</span>
                </div>
                <div className="flex items-center gap-3">
                   <span className="text-xs font-black text-slate-900 tabular-nums">{item.members}</span>
                   <div className={cn("h-1.5 w-1.5 rounded-full", idx === 0 ? "bg-indigo-500 animate-pulse" : "bg-slate-300")} />
                </div>
             </div>
           ))}
        </div>
      </div>
  );
};

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}
