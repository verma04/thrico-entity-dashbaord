"use client";
import { Separator } from "@/components/ui/separator";
import { SlackIntegrationCard } from "@/components/settings/integrations/slack-integration-card";
import { ZoomIntegrationCard } from "@/components/settings/integrations/zoom-integration-card";
import { GoogleMeetIntegrationCard } from "@/components/settings/integrations/google-meet-integration-card";
import { IntegrationCard } from "@/components/settings/integrations/integration-card";
import { Users, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useState } from "react";

const IntegrationsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");

  // Mocked state for other integrations
  const useMockIntegration = (name: string) => {
    const [isConnecting, setIsConnecting] = useState(false);
    const [isConnected, setIsConnected] = useState(false);

    const handleConnect = () => {
      setIsConnecting(true);
      setTimeout(() => {
        setIsConnecting(false);
        setIsConnected(true);
        toast.success(`Successfully connected to ${name}`);
      }, 1500);
    };

    const handleDisconnect = () => {
      setIsConnected(false);
      toast.info(`Disconnected from ${name}`);
    };

    return { isConnecting, isConnected, handleConnect, handleDisconnect };
  };

  const zoom = useMockIntegration("Zoom");
  const meet = useMockIntegration("Google Meet");
  const teams = useMockIntegration("Microsoft Teams");

  const allIntegrations = [
    {
      id: "slack",
      name: "Slack",
      component: <SlackIntegrationCard />,
    },
    // {
    //   id: "zoom",
    //   name: "Zoom",
    //   component: <ZoomIntegrationCard />,
    // },
    {
      id: "meet",
      name: "Google Meet",
      component: <GoogleMeetIntegrationCard />,
    },
    // {
    //   id: "teams",
    //   name: "Microsoft Teams",
    //   component: (
    //     <IntegrationCard
    //       title="Microsoft Teams"
    //       description="Team Collaboration"
    //       icon={Users}
    //       iconBgColor="bg-[#6264A7]"
    //       {...teams}
    //     >
    //       <div className="pt-4 border-t animate-in fade-in slide-in-from-top-2 duration-300">
    //         <p className="text-sm text-muted-foreground leading-relaxed">
    //           Microsoft Teams is connected. You can sync chats and meetings.
    //         </p>
    //       </div>
    //     </IntegrationCard>
    //   ),
    // },
  ];

  const filteredIntegrations = allIntegrations.filter((integration) =>
    integration.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="text-2xl font-semibold tracking-tight">
            Integrations
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Connect your favorite tools to enhance your workflow.
          </p>
        </div>
        <div className="relative w-full md:w-72">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search integrations..."
            className="pl-9 bg-background"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <Separator />

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search integrations..."
          className="pl-9 bg-background border-muted-foreground/20"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="bg-card border rounded-xl shadow-sm overflow-hidden">
        {/* Table Header */}
        <div className="flex items-center justify-between px-6 py-3 border-b bg-muted/30">
          <div className="text-[11px] font-bold text-muted-foreground tracking-wider uppercase">
            Application
          </div>
          <div className="text-[11px] font-bold text-muted-foreground tracking-wider uppercase w-[100px] text-right sm:text-center">
            Action
          </div>
        </div>

        {/* List */}
        <div className="divide-y divide-border/40 p-6">
          {filteredIntegrations.map((integration) => (
            <div key={integration.id} className="mb-6">
              {integration.component}
            </div>
          ))}
        </div>

        {filteredIntegrations.length === 0 && (
          <div className="p-8 text-center text-muted-foreground">
            No integrations found matching "{searchQuery}"
          </div>
        )}
      </div>
    </div>
  );
};

export default IntegrationsPage;
