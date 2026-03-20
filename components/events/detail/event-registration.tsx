"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ClipboardList,
  Plus,
  Trash2,
  GripVertical,
  Mail,
  Users,
  Settings2,
} from "lucide-react";
import {
  useEventRegistrationSettings,
  useUpsertEventRegistrationSettings,
  useEventRegistrationFields,
  useAddEventRegistrationField,
  useUpdateEventRegistrationField,
  useDeleteEventRegistrationField,
  EventRegistrationFieldInput,
} from "@/graphql/actions/events";
import { toast } from "sonner";

interface RegistrationField {
  id: string;
  label: string;
  type: "text" | "email" | "phone" | "select" | "textarea" | "checkbox";
  required: boolean;
  placeholder?: string;
  options?: string[];
  isNew?: boolean; // Used to track unsaved new fields
}

const defaultFields: RegistrationField[] = [
  {
    id: "1",
    label: "Full Name",
    type: "text",
    required: true,
    placeholder: "Enter your full name",
  },
  {
    id: "2",
    label: "Email Address",
    type: "email",
    required: true,
    placeholder: "Enter your email",
  },
  {
    id: "3",
    label: "Phone Number",
    type: "phone",
    required: false,
    placeholder: "Enter your phone number",
  },
  {
    id: "4",
    label: "Company / Organization",
    type: "text",
    required: false,
    placeholder: "Your company name",
  },
  {
    id: "5",
    label: "Dietary Requirements",
    type: "select",
    required: false,
    options: ["None", "Vegetarian", "Vegan", "Halal", "Kosher", "Gluten-free"],
  },
  {
    id: "6",
    label: "How did you hear about us?",
    type: "select",
    required: false,
    options: [
      "Social Media",
      "Email Newsletter",
      "Friend/Colleague",
      "Search Engine",
      "Other",
    ],
  },
];

export default function EventRegistration({ eventId }: { eventId: string }) {
  // Settings Data & Mutations
  const { data: settingsData, loading: loadingSettings } =
    useEventRegistrationSettings(eventId);
  const settings = settingsData?.getEventRegistrationSettings;

  const [upsertSettings, { loading: savingSettings }] =
    useUpsertEventRegistrationSettings({
      onCompleted: () => {
        toast.success("Registration settings saved successfully");
      },
      onError: (error) => toast.error(error.message),
    });

  // Fields Data & Mutations
  const {
    data: fieldsData,
    loading: loadingFields,
    refetch: refetchFields,
  } = useEventRegistrationFields(eventId);

  const [addField] = useAddEventRegistrationField({
    onError: (error) => toast.error(error.message),
  });

  const [updateField] = useUpdateEventRegistrationField({
    onError: (error) => toast.error(error.message),
  });

  const [deleteField] = useDeleteEventRegistrationField({
    onCompleted: () => {
      toast.success("Field deleted from form");
      refetchFields();
    },
    onError: (error) => toast.error(error.message),
  });

  // Local state initialized carefully from Apollo data avoiding infinite loops
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(true);
  const [enableWaitlist, setEnableWaitlist] = useState(true);
  const [requireApproval, setRequireApproval] = useState(false);
  const [confirmationSubject, setConfirmationSubject] = useState(
    "Your Registration is Confirmed! 🎉",
  );
  const [confirmationBody, setConfirmationBody] = useState(
    "Thank you for registering for our event. We're excited to have you join us! You'll receive more details as the event approaches.",
  );

  const [fields, setFields] = useState<RegistrationField[]>([]);

  // Sync state when data loads
  useEffect(() => {
    if (settings) {
      setIsRegistrationOpen(settings.isRegistrationOpen);
      setEnableWaitlist(settings.enableWaitlist);
      setRequireApproval(settings.requireApproval);
      if (settings.confirmationSubject)
        setConfirmationSubject(settings.confirmationSubject);
      if (settings.confirmationBody)
        setConfirmationBody(settings.confirmationBody);
    } else {
      // Use defaults if no settings found (e.g. fresh event)
      setIsRegistrationOpen(true);
      setEnableWaitlist(true);
      setRequireApproval(false);
    }
  }, [settings]);

  useEffect(() => {
    if (fieldsData?.getEventRegistrationFields) {
      setFields(
        // @ts-ignore mapping generic strings back to tight union definition
        fieldsData.getEventRegistrationFields.map((f) => ({
          ...f,
          isNew: false,
        })),
      );
    }
  }, [fieldsData]);

  const handleSaveAll = async () => {
    // 1. Save Settings
    await upsertSettings({
      variables: {
        input: {
          eventId,
          isRegistrationOpen,
          enableWaitlist,
          requireApproval,
          confirmationSubject,
          confirmationBody,
        },
      },
    });

    // 2. Save Fields (Iterate and run mutations based on status)
    const fieldPromises = fields.map((field, index) => {
      const input: EventRegistrationFieldInput = {
        eventId,
        label: field.label,
        type: field.type,
        required: field.required,
        placeholder: field.placeholder || "",
        options: field.options || [],
        displayOrder: index,
      };

      if (field.isNew) {
        return addField({ variables: { input } });
      } else {
        return updateField({ variables: { fieldId: field.id, input } });
      }
    });

    try {
      await Promise.all(fieldPromises);
      refetchFields();
      toast.success("Registration form updated successfully");
    } catch (e) {
      // Errors handled by individual onError callbacks
    }
  };

  const handleRemoveField = (id: string, isNew?: boolean) => {
    if (isNew) {
      setFields(fields.filter((f) => f.id !== id));
    } else {
      if (
        confirm(
          "Are you sure you want to delete this field from the registration form?",
        )
      ) {
        deleteField({ variables: { fieldId: id } });
      }
    }
  };

  const handleAddField = () => {
    setFields([
      ...fields,
      {
        id: `temp-${Date.now()}`,
        label: "New Field",
        type: "text",
        required: false,
        placeholder: "",
        isNew: true, // Flag to indicate it hasn't been saved to DB yet
      },
    ]);
  };

  const handleFieldChange = (
    id: string,
    key: keyof RegistrationField,
    value: any,
  ) => {
    setFields(fields.map((f) => (f.id === id ? { ...f, [key]: value } : f)));
  };

  if (loadingSettings || loadingFields) {
    return (
      <div className="flex justify-center py-20">
        <div className="h-6 w-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Registration</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Customize your registration form, settings, and confirmation emails
          </p>
        </div>
        <Button
          className="gap-2"
          onClick={handleSaveAll}
          disabled={savingSettings}
        >
          {savingSettings ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      {/* Registration Status */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-none shadow-sm ring-1 ring-border/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`h-10 w-10 shrink-0 rounded-xl flex items-center justify-center ${
                    isRegistrationOpen ? "bg-emerald-500/10" : "bg-red-500/10"
                  }`}
                >
                  <div
                    className={`h-3 w-3 rounded-full ${isRegistrationOpen ? "bg-emerald-500" : "bg-red-500"}`}
                  />
                </div>
                <div>
                  <p className="font-medium text-sm">Registration</p>
                  <p className="text-xs text-muted-foreground">
                    {isRegistrationOpen ? "Open" : "Closed"}
                  </p>
                </div>
              </div>
              <Switch
                checked={isRegistrationOpen}
                onCheckedChange={setIsRegistrationOpen}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm ring-1 ring-border/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-cyan-500/10 flex items-center justify-center">
                  <Users className="h-5 w-5 text-cyan-600" />
                </div>
                <div>
                  <p className="font-medium text-sm">Waitlist</p>
                  <p className="text-xs text-muted-foreground">
                    {enableWaitlist ? "Enabled" : "Disabled"}
                  </p>
                </div>
              </div>
              <Switch
                checked={enableWaitlist}
                onCheckedChange={setEnableWaitlist}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm ring-1 ring-border/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                  <Settings2 className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <p className="font-medium text-sm">Approval Required</p>
                  <p className="text-xs text-muted-foreground">
                    {requireApproval ? "Manual review" : "Auto-accept"}
                  </p>
                </div>
              </div>
              <Switch
                checked={requireApproval}
                onCheckedChange={setRequireApproval}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Registration Form Builder */}
      <Card className="border-none shadow-sm ring-1 ring-border/50">
        <CardHeader className="bg-muted/30">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <ClipboardList className="h-5 w-5 text-violet-500" />
                Registration Form Fields
              </CardTitle>
              <CardDescription>
                Customize what information to collect from attendees
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={handleAddField}
            >
              <Plus className="h-4 w-4" />
              Add Field
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-6 space-y-3">
          {fields.map((field) => (
            <div
              key={field.id}
              className="flex items-start gap-3 p-4 rounded-xl border bg-card hover:bg-muted/30 transition-colors group"
            >
              <div className="mt-1 cursor-grab text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                <GripVertical className="h-5 w-5" />
              </div>

              <div className="flex-1 grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div className="sm:col-span-2 space-y-1">
                  <Label className="text-xs text-muted-foreground">
                    Field Label
                  </Label>
                  <Input
                    value={field.label}
                    onChange={(e) =>
                      handleFieldChange(field.id, "label", e.target.value)
                    }
                    placeholder="Field label"
                    className="h-9"
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Type</Label>
                  <Select
                    value={field.type}
                    onValueChange={(v) =>
                      handleFieldChange(field.id, "type", v)
                    }
                  >
                    <SelectTrigger className="h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="text">Text</SelectItem>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="phone">Phone</SelectItem>
                      <SelectItem value="select">Dropdown</SelectItem>
                      <SelectItem value="textarea">Long Text</SelectItem>
                      <SelectItem value="checkbox">Checkbox</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-end gap-3">
                  <div className="flex items-center gap-2">
                    <Switch
                      id={`req-${field.id}`}
                      checked={field.required}
                      onCheckedChange={(v) =>
                        handleFieldChange(field.id, "required", v)
                      }
                    />
                    <Label
                      htmlFor={`req-${field.id}`}
                      className="text-xs text-muted-foreground"
                    >
                      Required
                    </Label>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-9 w-9 p-0 text-destructive hover:text-destructive"
                    onClick={() => handleRemoveField(field.id, field.isNew)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}

          {fields.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <ClipboardList className="h-10 w-10 mx-auto mb-3 opacity-50" />
              <p className="text-sm">No registration fields configured</p>
              <Button
                variant="outline"
                size="sm"
                className="mt-3 gap-2"
                onClick={handleAddField}
              >
                <Plus className="h-4 w-4" />
                Add Your First Field
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Confirmation Email */}
      <Card className="border-none shadow-sm ring-1 ring-border/50">
        <CardHeader className="bg-muted/30">
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-cyan-500" />
            Confirmation Email
          </CardTitle>
          <CardDescription>
            Customize the email sent to attendees after registration
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <div className="space-y-2">
            <Label>Email Subject</Label>
            <Input
              value={confirmationSubject}
              onChange={(e) => setConfirmationSubject(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Email Body</Label>
            <Textarea
              value={confirmationBody}
              onChange={(e) => setConfirmationBody(e.target.value)}
              rows={5}
            />
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Badge variant="outline" className="text-[10px]">
              {"{{attendee_name}}"}
            </Badge>
            <Badge variant="outline" className="text-[10px]">
              {"{{event_title}}"}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
