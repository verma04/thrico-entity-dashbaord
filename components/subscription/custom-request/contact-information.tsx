"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCustomFormStore } from "@/store/custom-form-store";
import { useCreateCustomRequest } from "@/graphql/actions/plan";
import { Phone } from "lucide-react";

interface ContactInformationProps {
  onNext: () => void;
  onPrevious: () => void;
}

export default function ContactInformation({
  onNext,
  onPrevious,
}: ContactInformationProps) {
  const {
    contact,
    setContact,
    teamRequirements,
    features,
    timeLine,
    security,
  } = useCustomFormStore();
  const [isLoading, setIsLoading] = useState(false);
  const [firstName, setFirstName] = useState(contact?.firstName || "");
  const [lastName, setLastName] = useState(contact?.lastName || "");
  const [email, setEmail] = useState(contact?.email || "");
  const [phone, setPhone] = useState(contact?.phone || "");
  const [jobTitle, setJobTitle] = useState(contact?.jobTitle || "");
  const [contactMethod, setContactMethod] = useState(
    contact?.contactMethod || "email"
  );

  const [create] = useCreateCustomRequest({
    onCompleted() {
      onNext();
    },
  });

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      await setContact({
        firstName,
        lastName,
        email,
        phone,
        jobTitle,
        contactMethod,
      });
      await create({
        variables: {
          input: {
            teamRequirements,
            features,
            timeLine,
            security,
            contact: {
              firstName,
              lastName,
              email,
              phone,
              jobTitle,
              contactMethod,
            },
          },
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <Phone className="w-5 h-5 text-blue-600" />
        <h2 className="text-2xl font-bold">Contact Information</h2>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="firstName" className="mb-2 block font-medium">
              First Name
            </Label>
            <Input
              id="firstName"
              placeholder="John"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="lastName" className="mb-2 block font-medium">
              Last Name
            </Label>
            <Input
              id="lastName"
              placeholder="Doe"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="email" className="mb-2 block font-medium">
              Business Email
            </Label>
            <Input
              id="email"
              placeholder="john.doe@acme.com"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="phone" className="mb-2 block font-medium">
              Phone Number
            </Label>
            <Input
              id="phone"
              placeholder="+1 (555) 123-4567"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="jobTitle" className="mb-2 block font-medium">
              Job Title
            </Label>
            <Input
              id="jobTitle"
              placeholder="CTO, IT Director, etc."
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="contactMethod" className="mb-2 block font-medium">
              Preferred Contact Method
            </Label>
            <Select value={contactMethod} onValueChange={setContactMethod}>
              <SelectTrigger id="contactMethod">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="phone">Phone</SelectItem>
                <SelectItem value="video">Video Call</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-center gap-4 pt-6">
          <Button onClick={onPrevious} variant="outline">
            Previous
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? "Submitting..." : "Next"}
          </Button>
        </div>
      </div>
    </Card>
  );
}
