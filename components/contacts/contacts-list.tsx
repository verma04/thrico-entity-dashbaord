"use client";

import React, { useState } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DataTable } from "@/components/ui/data-table";
import { safeFormat } from "@/lib/date-utils";
import {
  Mail,
  MessageSquare,
  Calendar,
  User as UserIcon,
  CheckCircle2,
  Clock,
  RotateCcw,
  ShieldCheck,
} from "lucide-react";
import { Contact, useUpdateContactStatus } from "@/graphql/actions/contacts";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const getStatusStyles = (status: string) => {
  switch (status) {
    case "RESOLVED":
      return "bg-emerald-50 text-emerald-600 border-emerald-100 shadow-[0_0_12px_rgba(16,185,129,0.1)]";
    case "IN_PROGRESS":
      return "bg-amber-50 text-amber-600 border-amber-100 shadow-[0_0_12px_rgba(245,158,11,0.1)]";
    case "PENDING":
    default:
      return "bg-slate-50 text-slate-500 border-slate-100 shadow-[0_0_12px_rgba(100,116,139,0.1)]";
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "RESOLVED":
      return <CheckCircle2 className="h-3 w-3" />;
    case "IN_PROGRESS":
      return <RotateCcw className="h-3 w-3 animate-spin-slow" />;
    case "PENDING":
    default:
      return <Clock className="h-3 w-3" />;
  }
};

export function ContactsList({ contacts }: { contacts: Contact[] }) {
  const columns: ColumnDef<Contact>[] = [
    {
      accessorKey: "user.user.firstName",
      header: "Sender",
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 border border-border/50 shadow-sm">
            <AvatarImage
              src={`https://cdn.thrico.network/${row.original.user?.user?.avatar}`}
              alt={row.original.user?.user?.firstName}
            />
            <AvatarFallback className="bg-indigo-50 text-indigo-600 text-xs font-bold font-mono tracking-tighter italic">
              {row.original.user?.user?.firstName?.[0]}
              {row.original.user?.user?.lastName?.[0]}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-0.5">
            <p className="font-extrabold text-slate-900 leading-tight tracking-tight text-sm uppercase italic">
              {row.original.user?.user?.firstName}{" "}
              {row.original.user?.user?.lastName}
            </p>
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 leading-tight mt-0.5 uppercase tracking-widest italic">
              <UserIcon className="h-3 w-3 text-emerald-500" />
              <span>{row.original.user?.id || "N/A"}</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Protocol Status",
      cell: ({ row }) => (
        <Badge
          variant="outline"
          className={cn(
            "h-6 px-2.5 rounded-lg font-black text-[9px] uppercase tracking-widest border-2 gap-1.5 italic",
            getStatusStyles(row.original.status),
          )}
        >
          {getStatusIcon(row.original.status)}
          {row.original.status?.replace("_", " ")}
        </Badge>
      ),
    },
    {
      accessorKey: "subject",
      header: "Inquiry Subject",
      cell: ({ row }) => (
        <div className="flex flex-col gap-1 max-w-[300px]">
          <p className="font-black text-slate-800 leading-snug tracking-tight text-sm line-clamp-1 uppercase italic">
            {row.original.subject || "No Subject"}
          </p>
          <p className="text-[10px] font-bold text-slate-400 line-clamp-1 italic">
            {row.original.message}
          </p>
        </div>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Timestamp",
      cell: ({ row }) => (
        <div className="flex items-center gap-2 text-xs font-bold text-slate-500 whitespace-nowrap italic uppercase">
          <Calendar className="h-3.5 w-3.5 text-indigo-400" />
          {safeFormat(row.original.createdAt, "MMM d, HH:mm", "-")}
        </div>
      ),
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => <ContactAction contact={row.original} />,
    },
  ];

  return (
    <div className="space-y-4">
      <DataTable
        columns={columns}
        data={contacts || []}
        rowClassName="hover:bg-indigo-50/30 transition-all duration-300 border-b border-slate-100/50"
      />
    </div>
  );
}

function ContactAction({ contact }: { contact: Contact }) {
  const [open, setOpen] = useState(false);
  const [updateStatus, { loading }] = useUpdateContactStatus({
    onCompleted: () => {
      toast.success("Identity log synchronized successfully");
      setOpen(false);
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to sync protocol status");
    },
  });

  const handleStatusChange = async (newStatus: string) => {
    await updateStatus({
      variables: {
        id: contact.id,
        status: newStatus,
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-9 px-4 rounded-xl border-slate-200 font-black text-[10px] uppercase tracking-widest hover:bg-indigo-50 hover:text-indigo-600 transition-all gap-2 group italic shadow-sm"
        >
          <MessageSquare className="h-3.5 w-3.5 transition-transform group-hover:scale-110" />
          Protocol View
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl rounded-[32px] border-slate-100 shadow-2xl p-0 overflow-hidden bg-white italic">
        <div className="bg-slate-50 border-b border-slate-200/50 p-8">
          <DialogHeader className="p-0">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse shadow-[0_0_8px_rgba(99,102,241,0.5)]" />
                <span className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.25em]">
                  Inquiry Transmission
                </span>
              </div>
              <Badge
                variant="outline"
                className={cn(
                  "h-6 px-3 rounded-lg font-black text-[9px] uppercase tracking-[0.15em] border-2 gap-2 italic",
                  getStatusStyles(contact.status),
                )}
              >
                {getStatusIcon(contact.status)}
                {contact.status}
              </Badge>
            </div>
            <DialogTitle className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic leading-none max-w-[90%]">
              {contact.subject || "Unspecified Subject"}
            </DialogTitle>
          </DialogHeader>
        </div>

        <div className="p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Originator Node
              </span>
              <div className="flex items-center gap-4 bg-slate-50/50 p-4 rounded-3xl border border-slate-100 italic">
                <Avatar className="h-12 w-12 border-2 border-white shadow-md">
                  <AvatarImage
                    src={`https://cdn.thrico.network/${contact.user?.user?.avatar}`}
                  />
                  <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-black text-lg italic">
                    {contact.user?.user?.firstName?.[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-black text-base text-slate-900 uppercase leading-none mb-1.5 tracking-tight">
                    {contact.user?.user?.firstName}{" "}
                    {contact.user?.user?.lastName}
                  </p>
                  <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    <Mail className="h-3 w-3 text-blue-500" />
                    {contact.user?.user?.email}
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-right block">
                Temporal Index
              </span>
              <div className="bg-slate-50/50 p-4 rounded-3xl border border-slate-100 italic text-right block w-full">
                <p className="font-black text-base text-slate-900 uppercase leading-none mb-1.5 tracking-tight">
                  {safeFormat(contact.createdAt, "MMMM d, yyyy", "-")}
                </p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em]">
                  {safeFormat(contact.createdAt, "HH:mm:ss 'UTC'", "-")}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Message Payload
            </span>
            <div className="bg-slate-50 border border-slate-100 rounded-[32px] p-8 relative overflow-hidden italic shadow-inner group">
              <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                <MessageSquare className="h-16 w-16 text-indigo-500 -rotate-12" />
              </div>
              <p className="text-slate-800 leading-relaxed font-bold text-lg whitespace-pre-wrap relative z-10 selection:bg-indigo-100/50 tracking-tight">
                {contact.message}
              </p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-6 border-t border-slate-100 italic">
            <div className="flex items-center gap-4 w-full md:w-auto">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">
                Override Status
              </span>
              <Select
                value={contact.status}
                onValueChange={handleStatusChange}
                disabled={loading}
              >
                <SelectTrigger className="h-11 rounded-2xl border-slate-200 bg-white font-black text-[10px] uppercase tracking-widest min-w-[180px] shadow-sm focus:ring-4 focus:ring-indigo-500/5">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(contact.status)}
                    <SelectValue />
                  </div>
                </SelectTrigger>
                <SelectContent className="rounded-2xl border-slate-100 shadow-2xl p-2 italic">
                  <SelectItem
                    value="PENDING"
                    className="rounded-xl font-black text-[10px] uppercase tracking-widest py-3 gap-2"
                  >
                    <div className="flex items-center gap-2">
                      <Clock className="h-3.5 w-3.5 text-slate-400" />
                      Pending Node
                    </div>
                  </SelectItem>
                  <SelectItem
                    value="IN_PROGRESS"
                    className="rounded-xl font-black text-[10px] uppercase tracking-widest py-3 gap-2"
                  >
                    <div className="flex items-center gap-2">
                      <RotateCcw className="h-3.5 w-3.5 text-amber-500" />
                      Processing Log
                    </div>
                  </SelectItem>
                  <SelectItem
                    value="RESOLVED"
                    className="rounded-xl font-black text-[10px] uppercase tracking-widest py-3 gap-2"
                  >
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                      Resolved Protocol
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              <Button
                variant="ghost"
                className="rounded-2xl font-black h-12 px-6 text-[10px] uppercase tracking-widest text-slate-400 hover:text-slate-600 hover:bg-slate-50 flex-1 md:flex-none"
              >
                Discard Log
              </Button>
              <Button className="rounded-2xl bg-slate-900 hover:bg-black h-12 px-8 font-black text-[10px] uppercase tracking-widest shadow-xl shadow-slate-200 transition-all hover:scale-[1.02] active:scale-[0.98] gap-2.5 flex-1 md:flex-none">
                <ShieldCheck className="h-4 w-4 text-indigo-400" />
                Initialize Response
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
