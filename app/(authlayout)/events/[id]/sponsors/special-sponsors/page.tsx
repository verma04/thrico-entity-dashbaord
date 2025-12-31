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
import { Plus, Building } from "lucide-react";

function SpecialSponsors() {
  const [specialSponsors] = useState([
    {
      id: "1",
      type: "Title Sponsor",
      name: "MegaTech Industries",
      logo: "/placeholder.svg",
      benefits: [
        "Exclusive branding as 'Title Sponsor'",
        "Prime logo placement",
        "VIP dinner with speakers",
      ],
    },
    {
      id: "2",
      type: "Co-powered by",
      name: "InnovateNow",
      logo: "/placeholder.svg",
      benefits: [
        "Secondary branding",
        "Special mention in opening keynote",
        "VIP access",
      ],
    },
  ]);

  return (
    <div className="space-y-6">
      {specialSponsors.map((sponsor) => (
        <Card
          key={sponsor.id}
          className="border-none shadow-sm ring-1 ring-border/50"
        >
          <CardHeader className="bg-muted/30">
            <CardTitle>{sponsor.type}</CardTitle>
            <CardDescription>Exclusive sponsorship package</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="flex items-start gap-6">
              <Avatar className="h-20 w-20">
                <AvatarImage src={sponsor.logo} alt={sponsor.name} />
                <AvatarFallback>
                  <Building className="h-8 w-8" />
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-3">{sponsor.name}</h3>
                <div>
                  <h4 className="font-medium text-sm mb-2">Benefits:</h4>
                  <ul className="space-y-1.5">
                    {sponsor.benefits.map((benefit, index) => (
                      <li
                        key={index}
                        className="text-sm flex items-center gap-2"
                      >
                        <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
      <Button className="w-full gap-2">
        <Plus className="h-4 w-4" />
        Add Special Sponsor
      </Button>
    </div>
  );
}

export default SpecialSponsors;
