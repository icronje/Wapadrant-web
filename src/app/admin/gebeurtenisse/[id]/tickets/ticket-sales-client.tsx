"use client";

import Link from "next/link";
import { Download, ArrowLeft, Ticket, DollarSign, Users, Calendar, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { formatAfrikaansDate, formatZAR } from "@/lib/date-format";
import type { EventWithTickets } from "@/types/events";

interface TicketSalesClientProps {
  event: EventWithTickets;
  totalSold: number;
  totalCapacity: number;
  revenue: number;
  statusColors: Record<string, string>;
  statusLabels: Record<string, string>;
}

function formatDateTime(iso: string): string {
  return formatAfrikaansDate(iso);
}

function generateCSV(
  event: EventWithTickets,
  statusLabels: Record<string, string>
): string {
  const headers = [
    "Naam",
    "E-pos",
    "Telefoon",
    "Kaartjie Tipe",
    "Hoeveelheid",
    "Totaal",
    "Status",
    "Datum",
  ];
  const rows = event.tickets.map((t) => [
    `"${t.buyerName.replace(/"/g, '""')}"`,
    `"${t.buyerEmail.replace(/"/g, '""')}"`,
    `"${(t.buyerPhone || "").replace(/"/g, '""')}"`,
    `"${t.ticketType.name.replace(/"/g, '""')}"`,
    t.quantity,
    formatZAR(t.totalAmount),
    statusLabels[t.status] || t.status,
    new Date(t.createdAt).toLocaleString("af-ZA"),
  ]);
  return [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");
}

export function TicketSalesClient({
  event,
  totalSold,
  totalCapacity,
  revenue,
  statusColors,
  statusLabels,
}: TicketSalesClientProps) {
  function downloadCSV() {
    const csv = generateCSV(event, statusLabels);
    const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${event.title.replace(/\s+/g, "_")}_kaartjie_verkope.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  const remaining = totalCapacity - totalSold;

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link href="/admin/gebeurtenisse">
          <Button variant="ghost" size="sm" className="mb-2">
            <ArrowLeft className="mr-1 h-4 w-4" />Terug
          </Button>
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">{event.title}</h1>
          <p className="mt-1 flex items-center gap-2 text-sm text-gray-500">
            <Calendar className="h-4 w-4" />
            {formatDateTime(event.date)}
          </p>
        </div>
        <Button onClick={downloadCSV}>
          <Download className="mr-2 h-4 w-4" />
          Voer uit CSV
        </Button>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Kaartjies verkoop</CardTitle>
            <Ticket className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{totalSold}</p>
            <p className="text-xs text-muted-foreground">
              van {totalCapacity} beskikbaar
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Inkomste</CardTitle>
            <DollarSign className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{formatZAR(revenue)}</p>
            <p className="text-xs text-muted-foreground">
              bevestigde verkope
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Oorblywende kaartjies</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{remaining}</p>
            <p className="text-xs text-muted-foreground">
              oor die {event.ticketTypes.length} tipes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Kaartjie tipes</CardTitle>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{event.ticketTypes.length}</p>
            <p className="text-xs text-muted-foreground">
              beskikbaar vir hierdie geleentheid
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Kaartjie verkope</CardTitle>          <CardDescription>
            {event.tickets.length} transaksies vir hierdie geleentheid.
          </CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          {event.tickets.length === 0 ? (
            <div className="py-8 text-center text-gray-500">
              Nog geen kaartjies verkoop nie.
            </div>
          ) : (
            <table className="w-full min-w-[48rem] text-sm">
              <thead className="border-b">
                <tr className="text-left text-gray-500">
                  <th className="pb-3 font-medium">Koper</th>
                  <th className="pb-3 font-medium">E-pos</th>
                  <th className="pb-3 font-medium">Telefoon</th>
                  <th className="pb-3 font-medium">Tipe</th>
                  <th className="pb-3 font-medium">Hoeveelheid</th>
                  <th className="pb-3 font-medium">Totaal</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium">Datum</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {event.tickets.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-muted/40">
                    <td className="py-3 font-medium">{ticket.buyerName}</td>
                    <td className="py-3">{ticket.buyerEmail}</td>
                    <td className="py-3">{ticket.buyerPhone || "—"}</td>
                    <td className="py-3">{ticket.ticketType.name}</td>
                    <td className="py-3">{ticket.quantity}</td>
                    <td className="py-3">{formatZAR(ticket.totalAmount)}</td>
                    <td className="py-3">
                      <Badge className={statusColors[ticket.status] || "bg-gray-100 text-gray-800"}>
                        {statusLabels[ticket.status] || ticket.status}
                      </Badge>
                    </td>
                    <td className="py-3 text-muted-foreground">
                      {new Date(ticket.createdAt).toLocaleString("af-ZA")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
