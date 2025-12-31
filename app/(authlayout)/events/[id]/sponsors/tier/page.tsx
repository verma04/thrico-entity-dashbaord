"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Plus, Building } from "lucide-react";

function EventSponsorship() {
  const [tiers] = useState([
    {
      id: "1",
      name: "Platinum",
      price: "$10,000",
      benefits: [
        "Logo on main stage",
        "10 VIP tickets",
        "Booth space",
        "Speaking slot",
        "Logo on website",
      ],
      limit: 3,
      sponsors: [
        { id: "1", name: "TechCorp", logo: "/placeholder.svg" },
        { id: "2", name: "InnovateCo", logo: "/placeholder.svg" },
      ],
    },
    {
      id: "2",
      name: "Gold",
      price: "$5,000",
      benefits: [
        "Logo on website",
        "5 VIP tickets",
        "Booth space",
        "Logo on promotional materials",
      ],
      limit: 5,
      sponsors: [
        { id: "3", name: "WebTech", logo: "/placeholder.svg" },
        { id: "4", name: "ProductHQ", logo: "/placeholder.svg" },
        { id: "5", name: "DevTools Inc", logo: "/placeholder.svg" },
      ],
    },
    {
      id: "3",
      name: "Silver",
      price: "$2,500",
      benefits: [
        "Logo on website",
        "2 VIP tickets",
        "Logo on promotional materials",
      ],
      limit: 10,
      sponsors: [
        { id: "6", name: "StartupX", logo: "/placeholder.svg" },
        { id: "7", name: "CodeLabs", logo: "/placeholder.svg" },
      ],
    },
  ]);

  return (
    <div className="space-y-6">
      {tiers.map((tier) => (
        <Card
          key={tier.id}
          className="border-none shadow-sm ring-1 ring-border/50"
        >
          <CardHeader className="bg-muted/30">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>
                  {tier.name} Tier - {tier.price}
                </CardTitle>
                <CardDescription className="mt-1">
                  Premium sponsorship package with exclusive benefits
                </CardDescription>
              </div>
              <Badge variant="secondary">
                {tier.sponsors.length}/{tier.limit} Filled
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            <div>
              <h4 className="font-semibold mb-3">Benefits:</h4>
              <ul className="space-y-2">
                {tier.benefits.map((benefit, index) => (
                  <li key={index} className="text-sm flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-3">Current Sponsors:</h4>
              <div className="flex flex-wrap gap-6">
                {tier.sponsors.map((sponsor) => (
                  <div
                    key={sponsor.id}
                    className="flex flex-col items-center gap-2"
                  >
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={sponsor.logo} alt={sponsor.name} />
                      <AvatarFallback>
                        <Building className="h-6 w-6" />
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">{sponsor.name}</span>
                  </div>
                ))}

                {tier.sponsors.length < tier.limit && (
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-16 w-16 rounded-full"
                  >
                    <Plus className="h-6 w-6" />
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default EventSponsorship;
