"use client";

import { discussionForm } from "../ts-types";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, ThumbsUp, ThumbsDown, MessageSquare, ArrowUpRight } from "lucide-react";
import moment from "moment";
import Actions from "./forum-actions";
import { getStatusTag, getVerificationTag } from "../utils";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { UserProfileHoverCard } from "@/components/shared/user-profile-hover-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ForumCardProps {
  record: discussionForm;
}

export default function ForumCard({ record }: ForumCardProps) {
  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <Card className="overflow-hidden rounded-3xl border-slate-200/60 bg-white shadow-lg shadow-slate-200/40 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500 group flex flex-col h-full">
        
        <CardHeader className="p-5 pb-2">
          <div className="flex justify-between items-start mb-2">
            <div className="bg-indigo-50/50 border border-indigo-100 rounded-lg px-2 py-1 text-[10px] font-black uppercase text-indigo-600 tracking-wider">
               {record.category?.name || "General"}
            </div>
            <div className="scale-90 origin-right">
              {getVerificationTag(record.verification?.isVerified || false)}
            </div>
          </div>
          
          <div className="space-y-1.5">
            <h3 className="font-black text-lg text-slate-900 tracking-tight leading-snug group-hover:text-indigo-600 transition-colors line-clamp-2">
              {record.title}
            </h3>
          </div>
        </CardHeader>

        <CardContent className="p-5 pt-2 flex-grow">
          <div 
            className="text-sm text-slate-500 font-medium line-clamp-3 min-h-[60px] leading-relaxed mb-4"
            dangerouslySetInnerHTML={{ __html: record.content || "" }}
          />

          {!record.user ? (
            <div className="mt-auto">
               <div className="flex items-center gap-2 w-fit">
                  <Avatar className="h-6 w-6 rounded-full border border-indigo-100">
                     <AvatarFallback className="text-[10px] bg-indigo-50 text-indigo-600 font-black">
                        EN
                     </AvatarFallback>
                  </Avatar>
                  <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider">
                     Anonymous
                  </span>
               </div>
            </div>
          ) : (
            <div className="mt-auto">
              <UserProfileHoverCard user={record.user}>
                 <div className="flex items-center gap-2 cursor-pointer group/user w-fit">
                    <Avatar className="h-6 w-6 rounded-full border border-slate-200">
                       <AvatarImage
                          src={
                            record.user.avatar
                              ? record.user.avatar.startsWith("http")
                                ? record.user.avatar
                                : `https://cdn.thrico.network/${record.user.avatar}`
                              : ""
                          }
                          alt={`${record.user.firstName} ${record.user.lastName}`}
                       />
                       <AvatarFallback className="text-[10px] bg-slate-100 text-slate-600 font-bold">
                          {record.user.firstName?.charAt(0)}
                          {record.user.lastName?.charAt(0)}
                       </AvatarFallback>
                    </Avatar>
                    <span className="text-[11px] font-bold text-slate-600 group-hover/user:text-indigo-600 transition-colors uppercase tracking-wider">
                       {record.user.firstName} {record.user.lastName}
                    </span>
                 </div>
              </UserProfileHoverCard>
            </div>
          )}

          <div className="mt-5 grid grid-cols-2 gap-4">
             <div className="bg-emerald-50/50 rounded-2xl p-3 border border-emerald-100/50 group-hover:bg-emerald-50 group-hover:border-emerald-100 transition-colors">
                <div className="flex items-center gap-1.5 text-[10px] font-black text-emerald-600/70 uppercase tracking-wider mb-1">
                   <ThumbsUp className="h-3 w-3" /> Upvotes
                </div>
                <p className="text-sm font-black text-emerald-700">{record.upVotes || 0}</p>
             </div>
             <div className="bg-rose-50/50 rounded-2xl p-3 border border-rose-100/50 group-hover:bg-rose-50 group-hover:border-rose-100 transition-colors">
                <div className="flex items-center gap-1.5 text-[10px] font-black text-rose-600/70 uppercase tracking-wider mb-1">
                   <ThumbsDown className="h-3 w-3" /> Downvotes
                </div>
                <p className="text-sm font-black text-rose-700">{record.downVotes || 0}</p>
             </div>
          </div>
          
          <div className="mt-4 flex items-center justify-between text-[10px] font-black uppercase tracking-tighter text-slate-400 px-1">
             <div className="flex items-center gap-1.5">
                <Calendar className="h-3 w-3" /> {moment(record.createdAt).format("MMM D, YYYY")}
             </div>
             <div className="flex items-center gap-1.5 text-indigo-400/80">
                <MessageSquare className="h-3 w-3" /> Discussion
             </div>
          </div>
        </CardContent>

        <CardFooter className="flex items-center justify-between border-t border-slate-50 p-5 py-4 bg-slate-50/30">
          <div className="flex items-center gap-2">
            <div className="scale-90 origin-left">
              {getStatusTag(record.status as any)}
            </div>
            <Actions {...record} />
          </div>
          <Button variant="ghost" size="sm" className="h-8 rounded-lg text-xs font-bold text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50">
             View Post <ArrowUpRight className="ml-1.5 h-3.5 w-3.5 stroke-[3px]" />
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
