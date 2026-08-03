"use client";

import { Offer } from "@/graphql/actions/offers";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Tag, ExternalLink, Users, Eye } from "lucide-react";
import { format } from "date-fns";
import { OfferActions } from "./offer-actions";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { UserProfileHoverCard } from "@/components/shared/user-profile-hover-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";

interface OfferCardProps {
  offer: Offer;
  onEdit: (offer: Offer) => void;
  refetch: (variables?: any) => Promise<any>;
}

export function OfferCard({ offer, onEdit, refetch }: OfferCardProps) {
  const router = useRouter();
  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-emerald-50 text-emerald-600 border-emerald-200";
      case "INACTIVE":
        return "bg-amber-50 text-amber-600 border-amber-200";
      case "EXPIRED":
        return "bg-rose-50 text-rose-600 border-rose-200";
      default:
        return "bg-slate-50 text-slate-500 border-slate-200";
    }
  };

  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="h-full"
    >
      <Card className="overflow-hidden rounded-3xl border-slate-200/60 bg-white shadow-lg shadow-slate-200/40 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500 group flex flex-col h-full">
        <div className="relative h-44 w-full overflow-hidden bg-slate-100 shrink-0">
          {offer.image ? (
            <img
              src={`${process.env.NEXT_PUBLIC_CDN_URL}/${offer.image}`}
              alt={offer.title}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-indigo-50 to-indigo-100/50">
              <Tag className="h-16 w-16 text-indigo-200" />
            </div>
          )}
          
          <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <div className="absolute right-3 top-3 z-20">
            <div className="bg-white/90 backdrop-blur-md rounded-xl shadow-sm border border-white/20 p-0.5">
              <OfferActions offer={offer} onEdit={onEdit} refetch={refetch} />
            </div>
          </div>

          <div className="absolute bottom-3 left-3 z-20 flex gap-2">
            <Badge variant="secondary" className="font-bold bg-white/90 backdrop-blur-md text-foreground shadow-sm">
              {offer.discount}
            </Badge>
          </div>
        </div>

        <CardHeader className="p-5 pb-2">
          <div className="flex justify-between items-start mb-2">
            <Badge
              variant="outline"
              className="gap-1.5 font-semibold text-[10px] uppercase border-transparent bg-slate-100 text-slate-600"
            >
              <div
                className="h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: offer.category?.color || "#cbd5e1" }}
              />
              {offer.category?.name || "Uncategorized"}
            </Badge>
          </div>
          
          <div className="space-y-1.5">
            <h3 className="font-black text-lg text-slate-900 tracking-tight leading-snug group-hover:text-indigo-600 transition-colors line-clamp-2">
              {offer.title}
            </h3>
          </div>
        </CardHeader>

        <CardContent className="p-5 pt-2 flex-grow flex flex-col">
          <p className="text-sm text-slate-500 font-medium line-clamp-2 min-h-[40px] leading-relaxed mb-4">
            {offer.description || "No description provided."}
          </p>

          {!offer.creator ? (
            <div className="mt-auto">
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
            <div className="mt-auto">
              <UserProfileHoverCard user={offer.creator}>
                 <div className="flex items-center gap-2 cursor-pointer group/user w-fit">
                    <Avatar className="h-6 w-6 rounded-full border border-slate-200">
                       <AvatarImage
                          src={
                            offer.creator.avatar
                              ? offer.creator.avatar.startsWith("http")
                                ? offer.creator.avatar
                                : `${process.env.NEXT_PUBLIC_CDN_URL}/${offer.creator.avatar}`
                              : ""
                          }
                          alt={`${offer.creator.firstName} ${offer.creator.lastName}`}
                       />
                       <AvatarFallback className="text-[10px] bg-slate-100 text-slate-600 font-bold">
                          {offer.creator.firstName?.charAt(0)}
                          {offer.creator.lastName?.charAt(0)}
                       </AvatarFallback>
                    </Avatar>
                    <span className="text-[11px] font-bold text-slate-600 group-hover/user:text-indigo-600 transition-colors uppercase tracking-wider">
                       {offer.creator.firstName} {offer.creator.lastName}
                    </span>
                 </div>
              </UserProfileHoverCard>
            </div>
          )}

          <div className="mt-5 grid grid-cols-2 gap-4">
             <div className="bg-slate-50 rounded-2xl p-3 border border-slate-100 group-hover:bg-indigo-50/50 group-hover:border-indigo-100 transition-colors">
                <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">
                   <Users className="h-3 w-3" /> Claims
                </div>
                <p className="text-sm font-black text-slate-800">{offer.claimsCount || 0}</p>
             </div>
             <div className="bg-slate-50 rounded-2xl p-3 border border-slate-100 group-hover:bg-purple-50/50 group-hover:border-purple-100 transition-colors">
                <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">
                   <Eye className="h-3 w-3" /> Views
                </div>
                <p className="text-sm font-black text-slate-800">{offer.viewsCount || 0}</p>
             </div>
          </div>
          
          <div className="mt-4 flex items-center justify-between text-[10px] font-black uppercase tracking-tighter text-slate-400 px-1">
             <div className="flex items-center gap-1.5">
                <Calendar className="h-3 w-3" /> 
                {format(new Date(offer.validityStart), "MMM d, yyyy")} - {format(new Date(offer.validityEnd), "MMM d, yyyy")}
             </div>
          </div>
        </CardContent>

        <CardFooter className="flex items-center justify-between border-t border-slate-50 p-5 py-4 bg-slate-50/30">
          <div className="scale-90 origin-left">
            <span
              className={cn(
                "inline-flex items-center px-2 py-0.5 rounded-md border text-[10px] uppercase tracking-wide font-bold",
                getStatusColor(offer.status)
              )}
            >
              {offer.status}
            </span>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 rounded-lg text-xs font-bold text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50"
            onClick={() => router.push(`/offers/${offer.id}`)}
          >
             View Details <ExternalLink className="ml-1.5 h-3.5 w-3.5 stroke-[3px]" />
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
