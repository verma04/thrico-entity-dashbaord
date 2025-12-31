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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Trash2, AlertTriangle } from "lucide-react";

function EventSettings() {
  const [language, setLanguage] = useState("en");
  const [timezone, setTimezone] = useState("pst");
  const [retention, setRetention] = useState("1year");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Settings</h2>
      </div>

      <Card className="border-none shadow-sm ring-1 ring-border/50">
        <CardHeader className="bg-muted/30">
          <CardTitle>Advanced Settings</CardTitle>
          <CardDescription>
            Manage advanced configuration and danger zone actions
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="danger-zone">
              <AccordionTrigger className="text-destructive hover:text-destructive/80">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  Danger Zone
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <Alert variant="destructive" className="mb-4">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <strong className="font-semibold">Delete Event</strong>
                    <p className="mt-1 text-sm">
                      Once you delete an event, there is no going back. This
                      action cannot be undone.
                    </p>
                  </AlertDescription>
                </Alert>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" className="gap-2">
                      <Trash2 className="h-4 w-4" />
                      Delete Event
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you absolutely sure?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete your event and remove all associated data from
                        our servers.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        onClick={() => {
                          console.log("Event deleted");
                        }}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Confirm Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}

export default EventSettings;
