"use client";

import React from "react";
import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
} from "recharts";
import { ShieldCheck } from "lucide-react";

interface CommunitiesStatusChartProps {
  data: Array<{ name: string; value: number }>;
  totalCount: number;
  colors: string[];
}

export const CommunitiesStatusChart: React.FC<CommunitiesStatusChartProps> = ({
  data,
  totalCount,
  colors,
}) => {
  return (
    <div className="p-10 rounded-[3.5rem] bg-white border border-slate-100 shadow-2xl shadow-slate-200/50 flex flex-col items-center justify-center relative overflow-hidden group h-full transition-all duration-700 hover:shadow-indigo-500/5">
        <div className="h-[280px] w-full relative z-10 flex items-center justify-center">
          {data.length === 0 ? (
            <div className="h-full w-full rounded-full border-8 border-dashed border-slate-100 animate-[spin_10s_linear_infinite]" />
          ) : (
            <>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={75}
                    outerRadius={105}
                    paddingAngle={12}
                    dataKey="value"
                    stroke="none"
                    animationDuration={1500}
                    animationBegin={200}
                  >
                    {data.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={colors[index % colors.length]}
                        cornerRadius={14}
                        className="outline-none"
                      />
                    ))}
                  </Pie>
                  <RechartsTooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "none",
                      borderRadius: "16px",
                      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
                    }}
                    itemStyle={{ color: "#0f172a", fontWeight: 900, fontSize: '10px', textTransform: 'uppercase' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              
              {/* Center Content */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none transition-transform duration-500 group-hover:scale-110">
                <div className="text-center bg-white/10 backdrop-blur-md rounded-full p-6 border border-white/20">
                  <span className="text-4xl font-black text-slate-900 tracking-tighter block leading-none">
                    {totalCount}
                  </span>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-2">
                    Total
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
        
        <div className="w-full mt-12 grid grid-cols-2 gap-3 relative z-10">
           {data.slice(0, 4).map((item, idx) => (
             <div key={item.name} className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100 group/item hover:bg-white hover:shadow-lg transition-all duration-300">
                <div className="h-2.5 w-2.5 rounded-full shadow-[0_0_8px_rgba(0,0,0,0.1)] transition-transform group-hover/item:scale-150" style={{ backgroundColor: colors[idx % colors.length] }} />
                <div className="flex flex-col">
                   <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{item.name}</span>
                   <span className="text-xs font-black text-slate-900">{item.value}</span>
                </div>
             </div>
           ))}
        </div>
      </div>
  );
};
