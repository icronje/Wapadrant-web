"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TicketSelector, SelectedTicket } from "./ticket-selector";
import { formatZAR } from "@/lib/date-format";
import type { Event, Ticket } from "@/types/events";

interface TicketCheckoutProps {
  event: Event;
  children: React.ReactNode;
}

export function TicketCheckout({ event, children }: TicketCheckoutProps) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<SelectedTicket[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [confirmedTicket, setConfirmedTicket] = useState<Ticket | null>(null);

  const totalAmount = selected.reduce(
    (sum, s) => {
      const type = event.ticketTypes.find((tt) => tt.id === s.ticketTypeId);
      return sum + s.quantity * Number(type?.price || 0);
    },
    0
  );

  function isValidEmail(value: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Vul asseblief u volle naam in.");
      return;
    }
    if (!email.trim() || !isValidEmail(email)) {
      setError("Vul asseblief 'n geldige e-pos adres in.");
      return;
    }
    if (selected.length === 0 || totalAmount <= 0) {
      setError("Kies asseblief ten minste een kaartjie.");
      return;
    }

    setIsLoading(true);

    try {
      // Purchase each selected ticket type individually (API expects single ticketTypeId)
      let lastTicket: Ticket | null = null;
      for (const item of selected) {
        const response = await fetch(`/api/events/${event.id}/tickets`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ticketTypeId: item.ticketTypeId,
            buyerName: name,
            buyerEmail: email,
            buyerPhone: phone,
            quantity: item.quantity,
          }),
        });

        if (!response.ok) {
          const data = await response.json().catch(() => ({}));
          throw new Error(data.error || "Kon nie kaartjie koop nie");
        }

        lastTicket = await response.json();
      }

      setConfirmedTicket(lastTicket);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Onbekende fout. Probeer weer.");
    } finally {
      setIsLoading(false);
    }
  }

  function handleClose() {
    setOpen(false);
    setTimeout(() => {
      setConfirmedTicket(null);
      setSelected([]);
      setName("");
      setEmail("");
      setPhone("");
      setError("");
    }, 200);
  }

  if (confirmedTicket) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger>{children}</DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Bevestiging</DialogTitle>
            <DialogDescription>
              U kaartjie vir {event.title} is suksesvol bespreek.
            </DialogDescription>
          </DialogHeader>
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
            <p className="text-sm text-muted-foreground">
              Kaartjie verwysing nommer:
            </p>
            <p className="mt-1 font-mono text-lg font-semibold text-primary">
              #{confirmedTicket.id.slice(-8).toUpperCase()}
            </p>
            <p className="mt-3 text-sm">
              'n Bevestiging is gestuur na {confirmedTicket.buyerEmail}.
            </p>
          </div>
          <DialogFooter>
            <Button onClick={handleClose}>Goeie</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Kaartjies Koop — {event.title}</DialogTitle>
            <DialogDescription>
              Vul u besonderhede in en kies u kaartjies.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-5 py-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Volle naam *</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Byvoorbeeld: Jan van Wyk"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">E-pos *</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="jan@voorbeeld.com"
                  required
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="phone">Telefoon</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Byvoorbeeld: 082 123 4567"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Kaartjie opsies</Label>
              <TicketSelector
                ticketTypes={event.ticketTypes}
                selected={selected}
                onChange={setSelected}
              />
            </div>

            {error && (
              <p className="text-sm font-medium text-destructive">{error}</p>
            )}
          </div>
          <DialogFooter className="flex items-center justify-between">
            <div className="text-sm font-medium">
              Totaal: {formatZAR(totalAmount)}
            </div>
            <Button type="submit" disabled={isLoading || totalAmount <= 0}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verwerk...
                </>
              ) : (
                `Bevestig Koop — ${formatZAR(totalAmount)}`
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
