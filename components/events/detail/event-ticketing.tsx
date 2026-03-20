"use client";

import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Plus,
  Ticket,
  Pencil,
  Trash2,
  Tag,
  DollarSign,
  Users,
  Percent,
  Clock,
  Copy,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import {
  useEventTickets,
  useAddEventTicket,
  useUpdateEventTicket,
  useDeleteEventTicket,
  useEventPromoCodes,
  useAddEventPromoCode,
  useUpdateEventPromoCode,
  useDeleteEventPromoCode,
  EventTicket,
  EventTicketInput,
  EventPromoCode,
  EventPromoCodeInput,
} from "@/graphql/actions/events";
import { toast } from "sonner";

const ticketSchema = Yup.object().shape({
  name: Yup.string().required("Ticket name is required"),
  type: Yup.string().required("Ticket type is required"),
  price: Yup.number().min(0, "Price must be positive"),
  quantity: Yup.number()
    .required("Quantity is required")
    .min(1, "Must have at least 1"),
  maxPerOrder: Yup.number()
    .required("Max per order is required")
    .min(1, "Must be at least 1"),
});

function AddTicketModal({
  eventId,
  ticket,
  onSuccess,
}: {
  eventId: string;
  ticket?: EventTicket;
  onSuccess?: () => void;
}) {
  const [open, setOpen] = useState(false);

  const [addTicket, { loading: adding }] = useAddEventTicket({
    onCompleted: () => {
      toast.success("Ticket added successfully");
      setOpen(false);
      formik.resetForm();
      if (onSuccess) onSuccess();
    },
    onError: (error) => toast.error(error.message),
  });

  const [updateTicket, { loading: updating }] = useUpdateEventTicket({
    onCompleted: () => {
      toast.success("Ticket updated successfully");
      setOpen(false);
      if (onSuccess) onSuccess();
    },
    onError: (error) => toast.error(error.message),
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: ticket?.name || "",
      type: ticket?.type || "paid",
      price: ticket?.price || 0,
      quantity: ticket?.quantity || 100,
      description: ticket?.description || "",
      earlyBirdPrice: ticket?.earlyBirdPrice || undefined,
      earlyBirdDeadline: ticket?.earlyBirdDeadline || "",
      maxPerOrder: ticket?.maxPerOrder || 10,
      isVisible: ticket ? ticket.isVisible : true,
    },
    validationSchema: ticketSchema,
    onSubmit: (values) => {
      const input: EventTicketInput = {
        eventId,
        name: values.name,
        type: values.type,
        price: Number(values.price),
        quantity: Number(values.quantity),
        description: values.description,
        earlyBirdPrice: values.earlyBirdPrice
          ? Number(values.earlyBirdPrice)
          : undefined,
        earlyBirdDeadline: values.earlyBirdDeadline,
        maxPerOrder: Number(values.maxPerOrder),
        isVisible: values.isVisible,
      };

      if (ticket) {
        updateTicket({ variables: { ticketId: ticket.id, input } });
      } else {
        addTicket({ variables: { input } });
      }
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {ticket ? (
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <Pencil className="h-3.5 w-3.5" />
          </Button>
        ) : (
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add Ticket Type
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Create Ticket Type</DialogTitle>
          <DialogDescription>
            Define a new ticket type for this event
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>
                Ticket Name <span className="text-destructive">*</span>
              </Label>
              <Input
                name="name"
                placeholder="e.g., General Admission"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.name && formik.errors.name && (
                <p className="text-xs text-destructive">{formik.errors.name}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Type</Label>
              <Select
                value={formik.values.type}
                onValueChange={(v) => formik.setFieldValue("type", v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="free">Free</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="donation">Donation</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {formik.values.type !== "free" && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Price ($)</Label>
                <Input
                  name="price"
                  type="number"
                  step="0.01"
                  value={formik.values.price}
                  onChange={formik.handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label>Early Bird Price ($)</Label>
                <Input
                  name="earlyBirdPrice"
                  type="number"
                  step="0.01"
                  placeholder="Optional"
                  value={formik.values.earlyBirdPrice ?? ""}
                  onChange={formik.handleChange}
                />
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>
                Quantity <span className="text-destructive">*</span>
              </Label>
              <Input
                name="quantity"
                type="number"
                value={formik.values.quantity}
                onChange={formik.handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label>Max Per Order</Label>
              <Input
                name="maxPerOrder"
                type="number"
                value={formik.values.maxPerOrder}
                onChange={formik.handleChange}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              name="description"
              placeholder="What's included with this ticket?"
              rows={2}
              value={formik.values.description}
              onChange={formik.handleChange}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="ticket-visible" className="text-sm">
              Visible to attendees
            </Label>
            <Switch
              id="ticket-visible"
              checked={formik.values.isVisible}
              onCheckedChange={(v) => formik.setFieldValue("isVisible", v)}
            />
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              type="button"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={adding || updating}>
              {adding || updating
                ? "Saving..."
                : ticket
                  ? "Update Ticket"
                  : "Create Ticket"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function EventTicketing({ eventId }: { eventId: string }) {
  const {
    data: ticketsData,
    loading: loadingTickets,
    refetch: refetchTickets,
  } = useEventTickets(eventId);
  const {
    data: promoData,
    loading: loadingPromos,
    refetch: refetchPromos,
  } = useEventPromoCodes(eventId);

  const tickets: EventTicket[] = ticketsData?.getEventTickets || [];
  const promoCodes: EventPromoCode[] = promoData?.getEventPromoCodes || [];

  const [deleteTicket] = useDeleteEventTicket({
    onCompleted: () => {
      toast.success("Ticket deleted successfully");
      refetchTickets();
    },
    onError: (error) => toast.error(error.message),
  });

  const [deletePromoCode] = useDeleteEventPromoCode({
    onCompleted: () => {
      toast.success("Promo code deleted successfully");
      refetchPromos();
    },
    onError: (error) => toast.error(error.message),
  });

  const totalCapacity = tickets.reduce((sum, t) => sum + t.quantity, 0);
  const totalSold = tickets.reduce((sum, t) => sum + t.sold, 0);
  const totalRevenue = tickets.reduce((sum, t) => sum + t.sold * t.price, 0);

  if (loadingTickets || loadingPromos) {
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
          <h2 className="text-2xl font-bold">Ticketing</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Manage ticket types, pricing, and promotional codes
          </p>
        </div>
        <AddTicketModal eventId={eventId} onSuccess={refetchTickets} />
      </div>

      {/* Summary KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="border-none shadow-sm ring-1 ring-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-violet-500/10 flex items-center justify-center">
                <Ticket className="h-5 w-5 text-violet-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Ticket Types</p>
                <p className="text-2xl font-bold">{tickets.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm ring-1 ring-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                <Users className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tickets Sold</p>
                <p className="text-2xl font-bold">
                  {totalSold}{" "}
                  <span className="text-sm font-normal text-muted-foreground">
                    / {totalCapacity}
                  </span>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm ring-1 ring-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-cyan-500/10 flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-cyan-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold">
                  ${totalRevenue.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm ring-1 ring-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                <Tag className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Promo Codes</p>
                <p className="text-2xl font-bold">{promoCodes.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Ticket Types */}
      <Card className="border-none shadow-sm ring-1 ring-border/50">
        <CardHeader className="bg-muted/30">
          <CardTitle className="flex items-center gap-2">
            <Ticket className="h-5 w-5 text-violet-500" />
            Ticket Types
          </CardTitle>
          <CardDescription>
            Manage the different ticket tiers for your event
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ticket</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Sold / Capacity</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tickets.map((ticket) => {
                const soldPercent =
                  ticket.quantity > 0
                    ? (ticket.sold / ticket.quantity) * 100
                    : 0;
                return (
                  <TableRow key={ticket.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{ticket.name}</p>
                        <p className="text-xs text-muted-foreground line-clamp-1">
                          {ticket.description}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          ticket.type === "free"
                            ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                            : ticket.type === "donation"
                              ? "bg-amber-500/10 text-amber-600 border-amber-500/20"
                              : "bg-violet-500/10 text-violet-600 border-violet-500/20"
                        }
                      >
                        {ticket.type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-semibold">
                          {ticket.type === "free"
                            ? "Free"
                            : `$${ticket.price.toFixed(2)}`}
                        </p>
                        {ticket.earlyBirdPrice && (
                          <p className="text-xs text-emerald-600">
                            Early Bird: ${ticket.earlyBirdPrice.toFixed(2)}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1.5 min-w-[120px]">
                        <div className="flex justify-between text-xs">
                          <span>
                            {ticket.sold} / {ticket.quantity}
                          </span>
                          <span className="text-muted-foreground">
                            {soldPercent.toFixed(0)}%
                          </span>
                        </div>
                        <Progress value={soldPercent} className="h-2" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          ticket.isVisible
                            ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                            : "bg-gray-500/10 text-gray-600 border-gray-500/20"
                        }
                      >
                        {ticket.isVisible ? "Visible" : "Hidden"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <AddTicketModal
                          eventId={eventId}
                          ticket={ticket}
                          onSuccess={refetchTickets}
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                        >
                          <Copy className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                          onClick={() => {
                            if (
                              confirm(
                                "Are you sure you want to delete this ticket?",
                              )
                            ) {
                              deleteTicket({
                                variables: { ticketId: ticket.id },
                              });
                            }
                          }}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Promo Codes */}
      <Card className="border-none shadow-sm ring-1 ring-border/50">
        <CardHeader className="bg-muted/30">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Percent className="h-5 w-5 text-amber-500" />
                Promotional Codes
              </CardTitle>
              <CardDescription>
                Discount codes for ticket purchases
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" className="gap-2">
              <Plus className="h-4 w-4" />
              Add Code
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Discount</TableHead>
                <TableHead>Usage</TableHead>
                <TableHead>Expires</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {promoCodes.map((promo) => (
                <TableRow key={promo.id}>
                  <TableCell>
                    <code className="bg-muted px-2 py-1 rounded text-sm font-mono font-bold">
                      {promo.code}
                    </code>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className="bg-amber-500/10 text-amber-600 border-amber-500/20"
                    >
                      {promo.discountType === "percentage"
                        ? `${promo.discountValue}% off`
                        : `$${promo.discountValue} off`}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <span className="text-sm">
                        {promo.used} / {promo.usageLimit}
                      </span>
                      <Progress
                        value={(promo.used / promo.usageLimit) * 100}
                        className="h-1.5 w-20"
                      />
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">
                    {new Date(promo.expiryDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                        onClick={() => {
                          if (
                            confirm(
                              "Are you sure you want to delete this promo code?",
                            )
                          ) {
                            deletePromoCode({
                              variables: { promoCodeId: promo.id },
                            });
                          }
                        }}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
