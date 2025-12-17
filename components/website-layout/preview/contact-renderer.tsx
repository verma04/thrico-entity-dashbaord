import { ModuleData } from "@/store/useWebsiteBuilderStore";
import { cn } from "@/lib/utils";
import { DynamicIcon } from "./DynamicIcon";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface ContactRendererProps {
  module: ModuleData;
  previewDevice?: "desktop" | "tablet" | "mobile";
}

export const ContactRenderer = ({ module, previewDevice = "desktop" }: ContactRendererProps) => {
  const { layout, content } = module;
  const isMobile = previewDevice === "mobile";

  return (
    <div className="py-16 px-4 sm:px-6 md:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* 1. SIMPLE CONTACT */}
        {layout === "simple-contact" && (
          <div className={cn("grid gap-12 items-start", !isMobile && "md:grid-cols-2")}>
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl font-bold">{content.title || "Get in Touch"}</h1>
                <p className="text-xl text-muted-foreground">{content.subtitle || "We'd love to hear from you."}</p>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <DynamicIcon name="Mail" className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Email Us</h3>
                    <p className="text-muted-foreground">{content.email || "hello@example.com"}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <DynamicIcon name="Phone" className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Call Us</h3>
                    <p className="text-muted-foreground">{content.phone || "+1 (555) 123-4567"}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-card border rounded-xl p-8 shadow-sm">
              <form className="space-y-4">
                <div className={cn("grid gap-4", !isMobile && "sm:grid-cols-2")}>
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First name</Label>
                    <Input id="firstName" placeholder="John" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last name</Label>
                    <Input id="lastName" placeholder="Doe" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="john@example.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea id="message" placeholder="How can we help you?" className="min-h-[120px]" />
                </div>
                <Button className="w-full">Send Message</Button>
              </form>
            </div>
          </div>
        )}

        {/* 2. SUPPORT FOCUSED */}
        {layout === "support-focused" && (
          <div className="space-y-16">
            <div className="text-center max-w-3xl mx-auto space-y-4">
              <h1 className="text-4xl font-bold">{content.title || "Support Center"}</h1>
              <p className="text-xl text-muted-foreground">{content.subtitle || "We're here to help. Search widely asked questions or submit a ticket."}</p>
            </div>

            <div className={cn("grid gap-8", !isMobile && "lg:grid-cols-3")}>
              {/* Ticket Form */}
              <div className={cn("bg-card border rounded-xl p-8", !isMobile && "lg:col-span-2")}>
                <h2 className="text-2xl font-bold mb-6">Submit a Ticket</h2>
                <form className="space-y-6">
                  <div className={cn("grid gap-6", !isMobile && "sm:grid-cols-2")}>
                    <div className="space-y-2">
                      <Label>Name</Label>
                      <Input placeholder="Your name" />
                    </div>
                    <div className="space-y-2">
                      <Label>Email</Label>
                      <Input type="email" placeholder="Your email" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Issue Category</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="technical">Technical Issue</SelectItem>
                        <SelectItem value="billing">Billing & Account</SelectItem>
                        <SelectItem value="feature">Feature Request</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea placeholder="Describe the issue..." className="min-h-[150px]" />
                  </div>
                  <Button size="lg">Submit Ticket</Button>
                </form>
              </div>

              {/* Support Info Sidebar */}
              <div className="space-y-6">
                <div className="bg-primary/5 rounded-xl p-6 space-y-4">
                  <h3 className="font-bold text-lg flex items-center gap-2">
                    <DynamicIcon name="Clock" className="h-5 w-5 text-primary" />
                    Response Time
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {content.responseTime || "We typically respond to all tickets within 24 hours during business days."}
                  </p>
                </div>

                <div className="bg-muted/30 rounded-xl p-6 space-y-4">
                  <h3 className="font-bold text-lg">Support Hours</h3>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex justify-between">
                      <span>Mon - Fri</span>
                      <span>9 AM - 6 PM EST</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Weekend</span>
                      <span>Closed</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* FAQs */}
            <div className="max-w-3xl mx-auto pt-8">
              <h2 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h2>
              <Accordion type="single" collapsible className="w-full">
                {(content.faqs || [
                  { question: "How do I reset my password?", answer: "Go to settings and click reset password." },
                  { question: "Can I upgrade my plan?", answer: "Yes, you can upgrade at any time from the billing page." },
                  { question: "Where can I find my invoices?", answer: "All invoices are sent to your email and stored in billing history." }
                ]).map((faq: any, i: number) => (
                  <AccordionItem key={i} value={`item-${i}`}>
                    <AccordionTrigger>{faq.question}</AccordionTrigger>
                    <AccordionContent>{faq.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        )}

        {/* 3. SALES & INQUIRY */}
        {layout === "sales-inquiry" && (
          <div className={cn("grid gap-16 items-center", !isMobile && "lg:grid-cols-2")}>
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                  For Enterprise
                </div>
                <h1 className="text-4xl md:text-5xl font-bold">{content.title || "Let's Talk Business"}</h1>
                <p className="text-xl text-muted-foreground">{content.subtitle || "Scale your team with our enterprise solutions."}</p>
              </div>

              <div className={cn("grid gap-6", !isMobile && "sm:grid-cols-2")}>
                {[
                  { icon: "Shield", title: "Enterprise Grade", desc: "Advanced security & control" },
                  { icon: "Zap", title: "High Performance", desc: "Optimized for speed" },
                  { icon: "Users", title: "Dedicated Support", desc: "24/7 priority assistance" },
                  { icon: "Globe", title: "Custom Deployment", desc: "On-premise options" },
                ].map((item, i) => (
                  <div key={i} className="flex gap-3">
                    <DynamicIcon name={item.icon} className="h-6 w-6 text-primary shrink-0" />
                    <div>
                      <h3 className="font-semibold">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-card border rounded-2xl p-8 shadow-lg">
              <form className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>First Name</Label>
                    <Input placeholder="John" />
                  </div>
                  <div className="space-y-2">
                    <Label>Last Name</Label>
                    <Input placeholder="Doe" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Work Email</Label>
                  <Input type="email" placeholder="john@company.com" />
                </div>

                <div className="space-y-2">
                  <Label>Company Name</Label>
                  <Input placeholder="Acme Inc." />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Company Size</Label>
                    <Select>
                      <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1-10">1-10</SelectItem>
                        <SelectItem value="11-50">11-50</SelectItem>
                        <SelectItem value="51-200">51-200</SelectItem>
                        <SelectItem value="201+">201+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Budget Range</Label>
                    <Select>
                      <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="<5k">&lt;$5k</SelectItem>
                        <SelectItem value="5k-20k">$5k-$20k</SelectItem>
                        <SelectItem value="20k+">$20k+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Help needed with</Label>
                  <Textarea placeholder="Tell us about your needs..." />
                </div>

                <Button className="w-full" size="lg">Request Demo</Button>
                <p className="text-xs text-center text-muted-foreground">
                  By submitting, you agree to our terms and privacy policy.
                </p>
              </form>
            </div>
          </div>
        )}

        {/* 4. COMMUNITY REACH */}
        {layout === "community-reach" && (
          <div className="space-y-16">
            <div className="text-center max-w-3xl mx-auto space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold">{content.title || "Join the Conversation"}</h1>
              <p className="text-xl text-muted-foreground">{content.subtitle || "Connect with us and the community across all platforms."}</p>
            </div>

            <div className={cn("grid gap-6", !isMobile && "md:grid-cols-2 lg:grid-cols-4")}>
              {(content.socialLinks || [
                { platform: "Discord", icon: "MessageSquare", url: "#", label: "Join Server", color: "bg-indigo-500/10 text-indigo-600" },
                { platform: "Twitter/X", icon: "Twitter", url: "#", label: "Follow Us", color: "bg-blue-500/10 text-blue-600" },
                { platform: "LinkedIn", icon: "Linkedin", url: "#", label: "Connect", color: "bg-cyan-500/10 text-cyan-700" },
                { platform: "YouTube", icon: "Youtube", url: "#", label: "Subscribe", color: "bg-red-500/10 text-red-600" }
              ]).map((link: any, i: number) => (
                <a key={i} href={link.url} className="group bg-card border hover:border-primary/50 transition-all rounded-xl p-6 text-center space-y-4 hover:shadow-md">
                  <div className={cn("w-14 h-14 rounded-full mx-auto flex items-center justify-center transition-transform group-hover:scale-110", link.color || "bg-primary/10 text-primary")}>
                    <DynamicIcon name={link.icon} className="h-7 w-7" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{link.platform}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{link.label}</p>
                  </div>
                </a>
              ))}
            </div>

            <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl p-8 md:p-12 text-center max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-4">Subscribe to our Newsletter</h2>
              <p className="text-muted-foreground mb-8 max-w-xl mx-auto">Get the latest updates, community stories, and exclusive content delivered straight to your inbox.</p>
              <form className="max-w-md mx-auto flex gap-2">
                <Input placeholder="Enter your email" className="bg-background" />
                <Button>Subscribe</Button>
              </form>
              <p className="text-xs text-muted-foreground mt-4">No spam, unsubscribe anytime.</p>
            </div>
          </div>
        )}

        {/* 5. LOCATION & OFFICE */}
        {layout === "location-office" && (
          <div className="space-y-12">
            <div className="text-center space-y-4">
              <h1 className="text-4xl font-bold">{content.title || "Visit Our Office"}</h1>
              <p className="text-xl text-muted-foreground">{content.subtitle || "Main Headquarters and Regional Hubs"}</p>
            </div>

            <div className={cn("grid gap-8 lg:gap-12", !isMobile && "md:grid-cols-2")}>
              <div className="space-y-8">
                <div className="bg-card border rounded-xl p-6 space-y-6">
                  <div>
                    <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                      <DynamicIcon name="MapPin" className="h-5 w-5 text-primary" />
                      Headquarters
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {content.address || "123 Innovation Drive\nTech Valley, CA 94025\nUnited States"}
                    </p>
                  </div>

                  <div>
                    <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                       <DynamicIcon name="Phone" className="h-5 w-5 text-primary" />
                       Contact Info
                    </h3>
                    <div className="space-y-1 text-muted-foreground">
                      <p>{content.email || "office@example.com"}</p>
                      <p>{content.phone || "+1 (555) 987-6543"}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                      <DynamicIcon name="Clock" className="h-5 w-5 text-primary" />
                      Office Hours
                    </h3>
                    <div className="space-y-1 text-muted-foreground">
                      <p>Mon - Fri: 9:00 AM - 6:00 PM</p>
                      <p>Sat - Sun: Closed</p>
                    </div>
                  </div>
                  
                  <Button variant="outline" className="w-full">
                    <DynamicIcon name="Navigation" className="mr-2 h-4 w-4" />
                    Get Directions
                  </Button>
                </div>
              </div>

              {/* Map Placeholder */}
              <div className="bg-muted/20 border rounded-xl h-[400px] flex items-center justify-center relative overflow-hidden">
                {content.mapUrl ? (
                   <iframe 
                     src={content.mapUrl} 
                     width="100%" 
                     height="100%" 
                     style={{border:0}} 
                     allowFullScreen 
                     loading="lazy" 
                     referrerPolicy="no-referrer-when-downgrade"
                   ></iframe>
                ) : (
                  <div className="text-center text-muted-foreground space-y-2">
                    <DynamicIcon name="Map" className="h-12 w-12 mx-auto opacity-50" />
                    <p>Map View</p>
                    <span className="text-xs opacity-70">(Add embed URL in settings)</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
