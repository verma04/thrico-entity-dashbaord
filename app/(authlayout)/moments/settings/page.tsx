"use client";

import React from "react";
import { Settings, Shield, Globe, Video, Bell, Save } from "lucide-react";
import { SettingsHeader } from "@/components/settings/settings-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

export default function MomentsSettingsPage() {
  return (
    <div className="p-8 space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <SettingsHeader
          title="Moments Settings"
          description="Global configuration for video community and moderation."
          breadcrumb="Core Settings"
          icon={Settings}
        />
        <Button className="bg-primary hover:scale-105 active:scale-95 transition-all font-black uppercase tracking-widest text-[10px] px-8 h-12 shadow-xl shadow-primary/20 rounded-xl gap-2">
          <Save className="h-4 w-4" />
          Save Preferences
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Community & Visibility</h3>
              <div className="space-y-4">
                  {[
                      { icon: Globe, label: "Allow Public Moments", desc: "Enable community-wide video discoverability", defaultChecked: true },
                      { icon: Video, label: "Enable Short Uploads", desc: "Allow community members to draft moments", defaultChecked: true },
                      { icon: Bell, label: "New Upload Notifications", desc: "Get alerted when new community moments arrive", defaultChecked: false }
                  ].map((s, i) => (
                      <Card key={i} className="rounded-3xl border-none bg-muted/20 p-6 flex flex-row items-center justify-between group hover:bg-muted/30 transition-colors">
                          <div className="flex flex-row items-center gap-4">
                              <div className="w-10 h-10 rounded-2xl bg-background flex items-center justify-center border border-muted/50 transition-transform group-hover:scale-110">
                                  <s.icon className="h-5 w-5 text-primary" />
                              </div>
                              <div className="flex flex-col">
                                  <p className="font-bold text-sm tracking-tight">{s.label}</p>
                                  <p className="text-[10px] font-medium text-muted-foreground">{s.desc}</p>
                              </div>
                          </div>
                          <Switch defaultChecked={s.defaultChecked} className="data-[state=checked]:bg-primary" />
                      </Card>
                  ))}
              </div>
          </div>

          <div className="space-y-6">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Moderation & Safety</h3>
              <div className="space-y-4">
                  {[
                      { icon: Shield, label: "AI Auto-Moderation", desc: "Leverage vision AI to screen for sensitive content", defaultChecked: true },
                      { icon: Video, label: "Enable Moderated Feed", desc: "Approve community moments before they go live", defaultChecked: true }
                  ].map((s, i) => (
                      <Card key={i} className="rounded-3xl border-none bg-muted/20 p-6 flex flex-row items-center justify-between group hover:bg-muted/30 transition-colors">
                          <div className="flex flex-row items-center gap-4">
                              <div className="w-10 h-10 rounded-2xl bg-background flex items-center justify-center border border-muted/50 transition-transform group-hover:scale-110">
                                  <s.icon className="h-5 w-5 text-primary" />
                              </div>
                              <div className="flex flex-col">
                                  <p className="font-bold text-sm tracking-tight">{s.label}</p>
                                  <p className="text-[10px] font-medium text-muted-foreground">{s.desc}</p>
                              </div>
                          </div>
                          <Switch defaultChecked={s.defaultChecked} className="data-[state=checked]:bg-primary" />
                      </Card>
                  ))}
              </div>
          </div>
      </div>

      <div className="p-10 bg-destructive/5 rounded-[40px] border border-destructive/20 mt-12">
           <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                    <h3 className="text-destructive font-black uppercase tracking-widest text-xs">Purge Community Data</h3>
                    <p className="text-[10px] text-muted-foreground font-medium mt-1">Erase the entire community video matrix and associated metadata. Irreversible.</p>
                </div>
                <Button variant="destructive" className="rounded-xl px-10 h-11 font-black uppercase tracking-widest text-[9px] shadow-xl shadow-destructive/10">
                    Purge All Moments
                </Button>
           </div>
      </div>
    </div>
  );
}
