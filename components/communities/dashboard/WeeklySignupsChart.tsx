"use client";

import React from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Activity } from "lucide-react";

interface WeeklySignupsChartProps {
  data: Array<{ day: string; signups: number }>;
}

export const WeeklySignupsChart: React.FC<WeeklySignupsChartProps> = ({
  data,
}) => {
  return (
     <div className="p-10 rounded-[3.5rem] bg-white border border-slate-100 shadow-2xl shadow-slate-200/50 relative overflow-hidden group h-full flex flex-col justify-center">
        <div className="absolute top-0 right-0 p-8 opacity-5 scale-150 rotate-12 transition-transform duration-1000 group-hover:scale-[1.7]">
           <Activity className="h-32 w-32 text-indigo-500" />
        </div>
        <div className="h-[350px] w-full relative z-10">
          {data.length === 0 ? (
            <div className="h-full w-full flex items-center justify-center bg-slate-50/50 rounded-3xl border-2 border-dashed border-slate-100">
               <div className="flex flex-col items-center gap-4 text-center px-6">
                  <div className="h-10 w-10 border-4 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin" />
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-relaxed">Aggregating growth metrics from remote nodes...</p>
               </div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={data}
                margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
              >
                <defs>
                   <linearGradient id="colorSignups" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                   </linearGradient>
                </defs>
                <XAxis
                  dataKey="day"
                  fontSize={10}
                  fontWeight={900}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "#94a3b8", textTransform: 'uppercase', letterSpacing: '0.1em' }}
                  dy={15}
                />
                <YAxis
                  fontSize={10}
                  fontWeight={900}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "#94a3b8" }}
                  tickFormatter={(value) => `${value}`}
                />
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <RechartsTooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    border: "none",
                    borderRadius: "16px",
                    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                  }}
                  itemStyle={{ color: "#fff", fontWeight: 900, textTransform: 'uppercase', fontSize: '10px' }}
                  labelStyle={{ display: 'none' }}
                  cursor={{ stroke: '#6366f1', strokeWidth: 2, strokeDasharray: '4 4' }}
                />
                <Area
                  type="monotone"
                  dataKey="signups"
                  stroke="#6366f1"
                  strokeWidth={4}
                  fillOpacity={1}
                  fill="url(#colorSignups)"
                  animationDuration={2000}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
  );
};
