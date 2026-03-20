"use client"
import { Globe2 } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { getThricoDomain } from "@/graphql/actions/domain"
import DomainChange from "./domain-change"

export const ThricoDomain = () => {
  const { data, loading } = getThricoDomain()

  if (loading) {
    return <Skeleton className="h-24 rounded-xl border border-slate-200/80 bg-white" />
  }

  const domain = data?.getThricoDomain?.domain

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-slate-200/80 bg-white shadow-sm transition-all duration-200 hover:border-slate-300">
      <div className="flex items-center gap-4">
        <div className="h-10 w-10 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
          <Globe2 className="h-5 w-5 text-blue-600" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <p className="text-[14px] font-semibold text-slate-900 leading-none tracking-tight">
              https://{domain}.thrico.community
            </p>
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-[10px] font-semibold text-slate-500 uppercase tracking-widest">
              Primary System Edge
            </span>
          </div>
          <p className="text-[12px] text-slate-500 mt-1.5">Default subdomain provided by Thrico</p>
        </div>
      </div>
      <div>
        <DomainChange />
      </div>
    </div>
  )
}
