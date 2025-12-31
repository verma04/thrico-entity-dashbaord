"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Mail, Phone, MapPin, Send, Headset } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

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
      toast.success(
        "Message sent successfully! We'll get back to you shortly."
      );
      // Reset form if needed, for now just show success
    }, 1500);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto py-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Contact Support</h1>
        <p className="text-muted-foreground">
          Get in touch with your dedicated account manager or send us a message.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-7">
        {/* Contact Form - Main Area */}
        <Card className="md:col-span-4 lg:col-span-5">
          <CardHeader>
            <CardTitle>Send us a message</CardTitle>
            <CardDescription>
              We typically reply within 2 hours during business hours.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-2">
                <label htmlFor="subject" className="text-sm font-medium">
                  Subject
                </label>
                <Input id="subject" placeholder="How can we help?" required />
              </div>

              <div className="grid gap-2">
                <label htmlFor="priority" className="text-sm font-medium">
                  Priority
                </label>
                <Select defaultValue="medium">
                  <SelectTrigger id="priority">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <label htmlFor="message" className="text-sm font-medium">
                  Message
                </label>
                <Textarea
                  id="message"
                  placeholder="Describe your issue or question..."
                  className="min-h-[150px]"
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full sm:w-auto"
                disabled={loading}
              >
                {loading ? (
                  "Sending..."
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Send Message
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Account Manager Sidebar */}
        <div className="space-y-6 md:col-span-3 lg:col-span-2">
          <Card className="bg-primary/5 border-primary/20">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2 text-primary font-semibold mb-1">
                <Headset className="h-4 w-4" />
                Dedicated Support
              </div>
              <CardTitle className="text-lg">Your Account Manager</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center text-center p-4 bg-background rounded-lg border mb-4">
                <Avatar className="h-20 w-20 mb-3 ring-2 ring-primary/10">
                  <AvatarImage src="/placeholder-avatar.jpg" />
                  <AvatarFallback className="text-lg bg-primary/10 text-primary">
                    {manager.initials}
                  </AvatarFallback>
                </Avatar>
                <h3 className="font-semibold text-lg">{manager.name}</h3>
                <p className="text-sm text-muted-foreground">{manager.role}</p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <div className="p-2 rounded-md bg-background border">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-xs text-muted-foreground">Email</p>
                    <a
                      href={`mailto:${manager.email}`}
                      className="font-medium hover:underline truncate block"
                    >
                      {manager.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-sm">
                  <div className="p-2 rounded-md bg-background border">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Phone</p>
                    <a
                      href={`tel:${manager.phone}`}
                      className="font-medium hover:underline"
                    >
                      {manager.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-sm">
                  <div className="p-2 rounded-md bg-background border">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Location</p>
                    <p className="font-medium">{manager.location}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
