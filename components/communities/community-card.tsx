"use client";

import { communityEntity } from "./ts-types";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Users, MessageSquare, Eye as EyeIcon, ArrowUpRight, Share2 } from "lucide-react";
import moment from "moment";
import Actions from "./Actions";
import { getStatusTag, getVerificationTag } from "../discussion-forum/utils";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { UserProfileHoverCard } from "@/components/shared/user-profile-hover-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface CommunityCardProps {
  record: communityEntity;
}

export default function CommunityCard({ record }: CommunityCardProps) {
  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <Card className="overflow-hidden rounded-3xl border-slate-200/60 bg-white shadow-lg shadow-slate-200/40 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500 group">
        <div className="relative h-44 w-full overflow-hidden bg-slate-100">
          {record.cover ? (
            <img
              src={`https://cdn.thrico.network/${record.cover}`}
              alt={record.title}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-indigo-50 to-indigo-100/50">
              <span className="text-5xl font-black text-indigo-200 tracking-tighter">
                {record.title.substring(0, 2).toUpperCase()}
              </span>
            </div>
          )}
          
          <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <div className="absolute right-3 top-3 z-20">
            <div className="bg-white/90 backdrop-blur-md rounded-xl shadow-sm border border-white/20">
              <Actions {...record} />
            </div>
          </div>

          <div className="absolute bottom-3 left-3 z-20 flex gap-2">
            <div className="bg-white/90 backdrop-blur-md rounded-lg px-2 py-0.5 text-[9px] font-black uppercase text-slate-800 shadow-sm">
               {record.communityType || "Public Group"}
            </div>
          </div>
        </div>

        <CardHeader className="p-5 pb-2">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-black text-lg text-slate-900 tracking-tight leading-none group-hover:text-indigo-600 transition-colors">
                {record.title}
              </h3>
              {getVerificationTag(record.verification?.isVerified || false)}
            </div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest line-clamp-1">
              {record.tagline || "Visionary Community Ecosystem"}
            </p>
          </div>
        </CardHeader>

        <CardContent className="p-5 pt-0">
          <p className="text-sm text-slate-500 font-medium line-clamp-2 min-h-[40px] leading-relaxed">
            {record.description || "Inspiration, collaboration, and shared growth within our vibrant network."}
          </p>

          {!record.creator ? (
            <div className="mt-3">
               <div className="flex items-center gap-2 w-fit">
                  <Avatar className="h-6 w-6 rounded-full border border-indigo-100">
                     <AvatarFallback className="text-[10px] bg-indigo-50 text-indigo-600 font-black">
                        EN
                     </AvatarFallback>
                  </Avatar>
                  <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider">
                     Entity
                  </span>
               </div>
            </div>
          ) : (
            <div className="mt-3">
              <UserProfileHoverCard user={record.creator}>
                 <div className="flex items-center gap-2 cursor-pointer group w-fit">
                    <Avatar className="h-6 w-6 rounded-full border border-slate-200">
                       <AvatarImage
                          src={
                            record.creator.avatar
                              ? record.creator.avatar.startsWith("http")
                                ? record.creator.avatar
                                : `https://cdn.thrico.network/${record.creator.avatar}`
                              : ""
                          }
                          alt={`${record.creator.firstName} ${record.creator.lastName}`}
                       />
                       <AvatarFallback className="text-[10px] bg-slate-100 text-slate-600 font-bold">
                          {record.creator.firstName?.charAt(0)}
                          {record.creator.lastName?.charAt(0)}
                       </AvatarFallback>
                    </Avatar>
                    <span className="text-[11px] font-bold text-slate-600 group-hover:text-indigo-600 transition-colors uppercase tracking-wider">
                       {record.creator.firstName} {record.creator.lastName}
                    </span>
                 </div>
              </UserProfileHoverCard>
            </div>
          )}

          <div className="mt-5 grid grid-cols-2 gap-4">
             <div className="bg-slate-50 rounded-2xl p-3 border border-slate-100 group-hover:bg-indigo-50/50 group-hover:border-indigo-100 transition-colors">
                <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">
                   <Users className="h-3 w-3" /> Growth
                </div>
                <p className="text-sm font-black text-slate-800">{record.numberOfUser || 0} Members</p>
             </div>
             <div className="bg-slate-50 rounded-2xl p-3 border border-slate-100 group-hover:bg-purple-50/50 group-hover:border-purple-100 transition-colors">
                <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">
                   <MessageSquare className="h-3 w-3" /> Velocity
                </div>
                <p className="text-sm font-black text-slate-800">{record.numberOfPost || 0} Posts</p>
             </div>
          </div>
          
          <div className="mt-4 flex items-center justify-between text-[10px] font-black uppercase tracking-tighter text-slate-400 px-1">
             <div className="flex items-center gap-1.5">
                <Calendar className="h-3 w-3" /> Created {moment(record.createdAt).format("MMM YYYY")}
             </div>
             <div className="flex items-center gap-1.5">
                <EyeIcon className="h-3 w-3" /> {record.numberOfViews || 0} Views
             </div>
          </div>
        </CardContent>

        <CardFooter className="flex items-center justify-between border-t border-slate-50 p-5 py-4 bg-slate-50/30">
          <div className="scale-90 origin-left">
            {getStatusTag(record.status as any)}
          </div>
          <Button variant="ghost" size="sm" className="h-8 rounded-lg text-xs font-bold text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50">
             Open Space <ArrowUpRight className="ml-1.5 h-3.5 w-3.5 stroke-[3px]" />
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
