import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { TicketCheckout } from "@/components/events/ticket-checkout";
import { formatAfrikaansDate, formatZAR } from "@/lib/date-format";
import {
  CalendarDays,
  MapPin,
  ArrowLeft,
  Ticket,
  CheckCircle2,
} from "lucide-react";
import type { Event } from "@/types/events";

interface Props {
  params: Promise<{ id: string }>;
}

const API_BASE = process.env.API_BASE_URL ?? "http://localhost:3101";

async function getEvent(id: string): Promise<Event | null> {
  try {
    const res = await fetch(`${API_BASE}/api/events/${id}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

async function getEventIds(): Promise<{ id: string }[]> {
  try {
    const res = await fetch(`${API_BASE}/api/events`, { cache: "no-store" });
    if (!res.ok) return [];
    const events: Event[] = await res.json();
    return events.map((event) => ({ id: event.id }));
  } catch {
    return [];
  }
}

export async function generateStaticParams() {
  const ids = await getEventIds();
  return ids;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const event = await getEvent(id);
  return {
    title: event ? `${event.title} | Wapadrant Gemeente` : "Gebeurtenis | Wapadrant Gemeente",
    description: event?.description || "Kom deel hierdie spesiale geleentheid saam met ons.",
  };
}

export default async function EventDetailPage({ params }: Props) {
  const { id } = await params;
  const event = await getEvent(id);

  if (!event) {
    notFound();
  }

  const isPast = new Date(event.date) < new Date();
  const soldOut = event.ticketTypes.every(
    (tt) => tt.quantity - (tt.sold || 0) <= 0
  );
  const hasTickets = event.ticketTypes.length > 0;
  const minPrice = hasTickets
    ? Math.min(...event.ticketTypes.map((tt) => Number(tt.price)))
    : 0;

  return (
    <div className="flex flex-1 flex-col">
      <section className="bg-church-pattern py-12 sm:py-16">
        <Container>
          <Button variant="ghost" className="mb-4" render={<Link href="/gebeurtenisse"><ArrowLeft className="mr-2 h-4 w-4" />Terug na gebeurtenisse</Link>} />
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="overflow-hidden rounded-2xl bg-muted ring-1 ring-foreground/10">
              {event.imageUrl ? (
                <img
                  src={event.imageUrl}
                  alt={event.title}
                  className="h-64 w-full object-cover sm:h-80 lg:h-96"
                />
              ) : (
                <div className="flex h-64 w-full items-center justify-center bg-gradient-to-br from-primary/20 to-muted sm:h-80 lg:h-96">
                  <CalendarDays className="h-16 w-16 text-primary/40" />
                </div>
              )}
            </div>

            <div className="flex flex-col justify-center">
              <div className="mb-3 flex flex-wrap gap-2">
                {isPast && <Badge variant="secondary">Verby</Badge>}
                {soldOut && hasTickets && (
                  <Badge variant="destructive">Uitverkoop</Badge>
                )}
              </div>
              <h1 className="font-heading text-3xl font-bold text-foreground sm:text-4xl">
                {event.title}
              </h1>
              <p className="mt-4 flex items-center gap-2 text-muted-foreground">
                <CalendarDays className="h-5 w-5 text-primary" />
                {formatAfrikaansDate(event.date)}
              </p>
              <p className="mt-2 flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-5 w-5 text-primary" />
                {event.location}
              </p>
              {hasTickets && !isPast && (
                <p className="mt-4 text-2xl font-semibold text-primary">
                  Vanaf {formatZAR(minPrice)}
                </p>
              )}
              {isPast ? (
                <div className="mt-6 inline-flex items-center gap-2 rounded-lg bg-muted px-4 py-3 text-sm text-muted-foreground">
                  <CalendarDays className="h-4 w-4" />
                  Hierdie gebeurtenis het reeds plaasgevind.
                </div>
              ) : hasTickets && !soldOut ? (
                <div className="mt-6">
                  <TicketCheckout event={event}>
                    <Button size="lg">
                      <Ticket className="mr-2 h-5 w-5" />
                      Koop Kaartjies
                    </Button>
                  </TicketCheckout>
                </div>
              ) : hasTickets && soldOut ? (
                <div className="mt-6 inline-flex items-center gap-2 rounded-lg bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive">
                  Uitverkoop — geen kaartjies meer beskikbaar nie.
                </div>
              ) : null}
            </div>
          </div>
        </Container>
      </section>

      <section className="flex-1 py-12 sm:py-16">
        <Container>
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Oor hierdie geleentheid</CardTitle>
                  <CardDescription>
                    Al die besonderhede wat u moet weet.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {event.description ? (
                    <div className="prose max-w-none text-foreground">
                      {event.description.split("\n").map((paragraph, idx) => (
                        <p key={idx} className="mb-4">{paragraph}</p>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">
                      Geen verdere besonderhede beskikbaar nie.
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              {hasTickets && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Ticket className="h-5 w-5 text-primary" />
                      Kaartjie tipes
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {event.ticketTypes.map((tt) => {
                      const available = tt.quantity - (tt.sold || 0);
                      return (
                        <div
                          key={tt.id}
                          className="flex items-center justify-between rounded-lg border border-border bg-muted/40 p-3"
                        >
                          <div>
                            <p className="font-medium">{tt.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {available} van {tt.quantity} oor
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">{formatZAR(tt.price)}</p>
                          </div>
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    Ligging
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{event.location}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CalendarDays className="h-5 w-5 text-primary" />
                    Datum en tyd
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{formatAfrikaansDate(event.date)}</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
