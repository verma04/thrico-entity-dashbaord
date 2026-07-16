import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { HelpCircle, ExternalLink, BookOpen, ChevronRight } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface DNSProviderGuideProps {
  domainName: string;
}

export const DNSProviderGuide = ({ domainName }: DNSProviderGuideProps) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <HelpCircle className="h-4 w-4" />
          Setup Guide
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[500px] sm:w-[540px]">
        <SheetHeader className=" space-y-0">
          <div className="flex flex-col gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2.5 rounded-xl bg-primary/10 ring-1 ring-primary/20">
                  <BookOpen className="h-5 w-5 text-primary" />
                </div>
                <SheetTitle className="text-2xl font-bold tracking-tight">
                  DNS Guide
                </SheetTitle>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground ml-1">
                <span>Domains</span>
                <ChevronRight className="h-3 w-3" />
                <span>{domainName}</span>
                <ChevronRight className="h-3 w-3" />
                <span>DNS Configuration</span>
              </div>
            </div>
            <SheetDescription>
              Step-by-step instructions to add DNS records for major providers.
            </SheetDescription>
          </div>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-50px)] p-5 ">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="namecheap">
              <AccordionTrigger>Namecheap</AccordionTrigger>
              <AccordionContent className="space-y-3 text-sm">
                <p>
                  1. Log in to your{" "}
                  <a
                    href="https://www.namecheap.com/"
                    target="_blank"
                    rel="noreferrer"
                    className="text-primary underline inline-flex items-center gap-1"
                  >
                    Namecheap account <ExternalLink className="h-3 w-3" />
                  </a>
                  .
                </p>
                <p>
                  2. Select <strong>Domain List</strong> from the left sidebar.
                </p>
                <p>
                  3. Click the <strong>Manage</strong> button next to{" "}
                  <strong>{domainName}</strong>.
                </p>
                <p>
                  4. Navigate to the <strong>Advanced DNS</strong> tab.
                </p>
                <p>
                  5. Click <strong>Add New Record</strong>.
                </p>
                <p>
                  6. Select the record type (CNAME, TXT, or A) as shown in the
                  dashboard.
                </p>
                <p>
                  7. Copy the <strong>Host/Name</strong> and{" "}
                  <strong>Value/Target</strong> from the dashboard and paste
                  them into Namecheap.
                </p>
                <p>8. Click the checkmark to save.</p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="hostinger">
              <AccordionTrigger>Hostinger</AccordionTrigger>
              <AccordionContent className="space-y-3 text-sm">
                <p>
                  1. Log in to your{" "}
                  <a
                    href="https://hpanel.hostinger.com/"
                    target="_blank"
                    rel="noreferrer"
                    className="text-primary underline inline-flex items-center gap-1"
                  >
                    Hostinger account <ExternalLink className="h-3 w-3" />
                  </a>
                  .
                </p>
                <p>
                  2. Go to <strong>Domains</strong> and select{" "}
                  <strong>{domainName}</strong>.
                </p>
                <p>
                  3. Select <strong>DNS / Nameservers</strong>.
                </p>
                <p>
                  4. Scroll down to the <strong>Manage DNS records</strong>{" "}
                  section.
                </p>
                <p>
                  5. Select the <strong>Type</strong> (CNAME, TXT, A) matching
                  the record in the dashboard.
                </p>
                <p>
                  6. Enter the <strong>Name</strong> (@ for root) and{" "}
                  <strong>Points to</strong> (Value) details.
                </p>
                <p>
                  7. Click <strong>Add Record</strong>.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="godaddy">
              <AccordionTrigger>GoDaddy</AccordionTrigger>
              <AccordionContent className="space-y-3 text-sm">
                <p>
                  1. Log in to your{" "}
                  <a
                    href="https://dcc.godaddy.com/domains"
                    target="_blank"
                    rel="noreferrer"
                    className="text-primary underline inline-flex items-center gap-1"
                  >
                    GoDaddy Portfolio <ExternalLink className="h-3 w-3" />
                  </a>
                  .
                </p>
                <p>
                  2. Select the domain <strong>{domainName}</strong> to access
                  the Domain Settings page.
                </p>
                <p>
                  3. Select <strong>DNS</strong> to view your records.
                </p>
                <p>
                  4. Click <strong>Add New Record</strong>.
                </p>
                <p>
                  5. Select the <strong>Type</strong> from the dropdown.
                </p>
                <p>
                  6. Enter the <strong>Name</strong> and <strong>Value</strong>{" "}
                  details from the dashboard.
                </p>
                <p>
                  7. Click <strong>Save</strong>.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="cloudflare">
              <AccordionTrigger>Cloudflare</AccordionTrigger>
              <AccordionContent className="space-y-3 text-sm">
                <p>
                  1. Log in to the{" "}
                  <a
                    href="https://dash.cloudflare.com/"
                    target="_blank"
                    rel="noreferrer"
                    className="text-primary underline inline-flex items-center gap-1"
                  >
                    Cloudflare dashboard <ExternalLink className="h-3 w-3" />
                  </a>
                  .
                </p>
                <p>
                  2. Select your account and the domain{" "}
                  <strong>{domainName}</strong>.
                </p>
                <p>
                  3. Go to <strong>DNS</strong> {">"} <strong>Records</strong>.
                </p>
                <p>
                  4. Click <strong>Add record</strong>.
                </p>
                <p>
                  5. Select the <strong>Type</strong>.
                </p>
                <p>
                  6. Enter the <strong>Name</strong> and <strong>Target</strong>
                  .
                </p>
                <p className="text-muted-foreground italic">
                  Note: Ensure "Proxy status" is set to{" "}
                  <strong>DNS Only</strong> (Grey cloud) for verification
                  records.
                </p>
                <p>
                  7. Click <strong>Save</strong>.
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};
