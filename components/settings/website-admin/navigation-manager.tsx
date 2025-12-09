"use client";

import { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";

import { Form } from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";

import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

import {
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  SaveIcon,
  Home,
  Calendar,
  Users,
  ShoppingCart,
  Book,
  MessageCircle,
  Settings,
  Star,
  Bell,
  Info,
} from "lucide-react";

import {
  useGetNavigationMenus,
  useSaveNavigationMenus,
} from "@/graphql/website/website-quiries";

// ------------------------------------------------
// TYPES
// ------------------------------------------------

interface NavigationItem {
  id?: string;
  key: string;
  label: string;
  icon?: string;
  href?: string;
}

interface NavigationConfig {
  items: NavigationItem[];
}

// ------------------------------------------------
// ICON MAP
// ------------------------------------------------

const iconMap = {
  home: Home,
  calendar: Calendar,
  users: Users,
  "shopping-cart": ShoppingCart,
  book: Book,
  "message-circle": MessageCircle,
  settings: Settings,
  star: Star,
  bell: Bell,
  info: Info,
};

// ------------------------------------------------
// COMPONENT
// ------------------------------------------------

export default function NavigationManager() {
  const { toast } = useToast();

  const form = useForm<NavigationConfig>({
    defaultValues: { items: [] },
  });

  const { fields, append, remove, move } = useFieldArray({
    control: form.control,
    name: "items",
    keyName: "formId",
  });

  const { data, loading } = useGetNavigationMenus();

  useEffect(() => {
    if (data?.getNavigationMenus) {
      const withIds = data.getNavigationMenus.map((item: NavigationItem) => ({
        id: crypto.randomUUID(),
        ...item,
      }));
      form.reset({ items: withIds });
    }
  }, [data]);

  const onSubmit = form.handleSubmit(async (values) => {
    localStorage.setItem("navigation-config", JSON.stringify(values));
    toast({
      title: "Navigation Saved",
      description: "Your navigation menu has been updated successfully.",
    });
  });

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Navigation Manager</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-96 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-6">
        {/* ------------------------------------------------ */}
        {/* PREVIEW */}
        {/* ------------------------------------------------ */}
        <Card>
          <CardHeader>
            <CardTitle>Navigation Preview</CardTitle>
            <CardDescription>Live preview of your menu</CardDescription>
          </CardHeader>

          <CardContent>
            <nav className="flex gap-6 rounded-md bg-muted p-4">
              {fields.map((item) => {
                const Icon = item.icon
                  ? iconMap[item.icon as keyof typeof iconMap]
                  : null;

                return (
                  <a
                    key={item.id}
                    href={item.href || "#"}
                    className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary"
                  >
                    {Icon && <Icon className="h-4 w-4" />}
                    {item.label}
                  </a>
                );
              })}
            </nav>
          </CardContent>
        </Card>

        {/* ------------------------------------------------ */}
        {/* MENU EDITOR */}
        {/* ------------------------------------------------ */}
        <Card>
          <CardHeader>
            <CardTitle>Menu Items</CardTitle>
            <CardDescription>Customize your navigation menu</CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {fields.map((field, index) => (
              <div key={field.id} className="rounded-lg border p-4 space-y-3">
                <div className="flex justify-between">
                  <h4 className="font-medium">Menu Item {index + 1}</h4>

                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      disabled={index === 0}
                      onClick={() => move(index, index - 1)}
                    >
                      <ChevronUp className="h-4 w-4" />
                    </Button>

                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      disabled={index === fields.length - 1}
                      onClick={() => move(index, index + 1)}
                    >
                      <ChevronDown className="h-4 w-4" />
                    </Button>

                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => remove(index)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  {/* KEY */}
                  <FormField
                    control={form.control}
                    name={`items.${index}.key`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Key</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="e.g., home" />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  {/* LABEL */}
                  <FormField
                    control={form.control}
                    name={`items.${index}.label`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Label</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="e.g., Home" />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  {/* ICON */}
                  <FormField
                    control={form.control}
                    name={`items.${index}.icon`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Icon</FormLabel>

                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Choose icon" />
                            </SelectTrigger>
                          </FormControl>

                          <SelectContent>
                            {Object.entries(iconMap).map(([key, Icon]) => (
                              <SelectItem key={key} value={key}>
                                <div className="flex items-center gap-2">
                                  <Icon className="h-4 w-4" />
                                  {key}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />

                  {/* URL */}
                  <FormField
                    control={form.control}
                    name={`items.${index}.href`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>URL</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="/about" />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              onClick={() =>
                append({
                  id: crypto.randomUUID(),
                  key: "",
                  label: "",
                  icon: "",
                  href: "",
                })
              }
              className="w-full gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Menu Item
            </Button>
          </CardContent>
        </Card>

        {/* ------------------------------------------------ */}
        {/* SAVE BUTTON */}
        {/* ------------------------------------------------ */}
        <div className="flex justify-end">
          <Button type="submit" size="lg" className="gap-2">
            <SaveIcon className="h-4 w-4" />
            Save Navigation
          </Button>
        </div>
      </form>
    </Form>
  );
}
