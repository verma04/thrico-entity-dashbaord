"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Mail, Phone, MapPin, Send, Headset, Loader2, Info } from "lucide-react";
import { toast } from "sonner";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";

export default function ContactPage() {
  const [loading, setLoading] = useState(false);

  // Mock Manager Data
  const manager = {
    name: "Sarah Jenkins",
    role: "Senior Account Manager",
    email: "sarah.j@thrico.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    initials: "SJ",
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      toast.success("Message sent successfully! We'll get back to you shortly.");
    }, 1500);
  };

  return (
    <EcosystemWrapper>
      <EcosystemHeader
        title="Contact Support"
        description="Get in touch with your dedicated account manager or send us a priority message."
        breadcrumb="Help & Support"
        icon={Headset}
        badgeText="Priority Routing"
        showLiveIndicator={false}
      />

      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* Contact Form - Main Area */}
        <div className="flex-1 w-full rounded-xl border border-slate-200/80 bg-white shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/50">
            <h2 className="text-[14px] font-semibold text-slate-900 leading-none tracking-tight">
              Submit a Request
            </h2>
            <p className="text-[11px] text-slate-500 mt-1">
              We typically reply within 2 hours during business hours.
            </p>
          </div>
          
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label htmlFor="subject" className="text-[12px] font-semibold text-slate-700">
                    Subject Line
                  </label>
                  <Input 
                    id="subject" 
                    placeholder="Briefly describe your issue..." 
                    required 
                    className="h-9 text-[13px] border-slate-200 shadow-sm"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="priority" className="text-[12px] font-semibold text-slate-700">
                    Routing Priority
                  </label>
                  <Select defaultValue="medium">
                    <SelectTrigger id="priority" className="h-9 text-[13px] border-slate-200 shadow-sm">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low" className="text-[13px]">Low Sensitivity</SelectItem>
                      <SelectItem value="medium" className="text-[13px]">Standard Support</SelectItem>
                      <SelectItem value="high" className="text-[13px] font-medium text-amber-700">High Priority</SelectItem>
                      <SelectItem value="urgent" className="text-[13px] font-semibold text-red-600">Urgent Escalation</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="text-[12px] font-semibold text-slate-700">
                  Message Details
                </label>
                <Textarea
                  id="message"
                  placeholder="Provide any relevant context, links, or steps to reproduce..."
                  className="min-h-[160px] resize-y text-[13px] border-slate-200 shadow-sm py-3"
                  required
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                   <Info className="h-3.5 w-3.5" />
                   Secure transmission
                </div>
                <Button
                  type="submit"
                  disabled={loading}
                  className="h-9 px-6 text-[12px] font-semibold bg-slate-900 hover:bg-black text-white shadow-sm gap-2 transition-all"
                >
                  {loading ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Send className="h-3.5 w-3.5" />
                  )}
                  {loading ? "Transmitting..." : "Send Message"}
                </Button>
              </div>
            </form>
          </div>
        </div>

        {/* Account Manager Sidebar */}
        <div className="w-full lg:w-[320px] shrink-0 sticky top-6">
          <div className="rounded-xl border border-emerald-200/60 bg-emerald-50/30 shadow-sm overflow-hidden flex flex-col">
            <div className="px-5 py-4 border-b border-emerald-100/50 flex items-center gap-2">
               <div className="h-6 w-6 rounded-md bg-emerald-100 text-emerald-600 flex items-center justify-center">
                  <Headset className="h-3.5 w-3.5" />
               </div>
               <h3 className="text-[13px] font-semibold text-emerald-900 tracking-tight">Dedicated Support</h3>
            </div>
            
            <div className="p-5">
              <div className="flex flex-col items-center text-center pb-5 mb-5 border-b border-emerald-100/60">
                <Avatar className="h-16 w-16 mb-3 border-2 border-white shadow-sm">
                  <AvatarImage src="/placeholder-avatar.jpg" />
                  <AvatarFallback className="text-[16px] font-medium bg-emerald-100 text-emerald-700">
                    {manager.initials}
                  </AvatarFallback>
                </Avatar>
                <h3 className="text-[14px] font-bold text-slate-900">{manager.name}</h3>
                <p className="text-[11px] font-medium text-emerald-700 mt-0.5 tracking-tight uppercase">{manager.role}</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-white border border-emerald-100 flex items-center justify-center shrink-0">
                    <Mail className="h-4 w-4 text-emerald-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest leading-none mb-1">Email</p>
                    <a
                      href={`mailto:${manager.email}`}
                      className="text-[12px] font-medium text-slate-700 hover:text-emerald-700 truncate block transition-colors"
                    >
                      {manager.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-white border border-emerald-100 flex items-center justify-center shrink-0">
                    <Phone className="h-4 w-4 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest leading-none mb-1">Direct Line</p>
                    <a
                      href={`tel:${manager.phone}`}
                      className="text-[12px] font-medium text-slate-700 hover:text-emerald-700 transition-colors"
                    >
                      {manager.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-white border border-emerald-100 flex items-center justify-center shrink-0">
                    <MapPin className="h-4 w-4 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest leading-none mb-1">Timezone</p>
                    <p className="text-[12px] font-medium text-slate-700">{manager.location}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </EcosystemWrapper>
  );
}
