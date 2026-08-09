import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { TicketSalesClient } from "./ticket-sales-client";
import type { EventWithTickets } from "@/types/events";

interface Props {
  params: Promise<{ id: string }>;
}

const statusColors: Record<string, string> = {
  confirmed: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
  refunded: "bg-orange-100 text-orange-800",
};

const statusLabels: Record<string, string> = {
  confirmed: "Bevestig",
  cancelled: "Gekanselleer",
  refunded: "Terugbetaal",
};

export default async function AdminTicketSalesPage({ params }: Props) {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    redirect("/admin/login");
  }

  const { id } = await params;

  const event = await prisma.event.findUnique({
    where: { id },
    include: {
      ticketTypes: true,
      tickets: {
        orderBy: { createdAt: "desc" },
        include: { ticketType: true },
      },
    },
  });

  if (!event) {
    notFound();
  }

  const serializedEvent: EventWithTickets = {
    id: event.id,
    title: event.title,
    description: event.description,
    date: event.date.toISOString(),
    endDate: event.endDate ? event.endDate.toISOString() : null,
    location: event.location,
    imageUrl: event.imageUrl,
    isPublished: event.isPublished,
    createdAt: event.createdAt.toISOString(),
    updatedAt: event.updatedAt.toISOString(),
    ticketTypes: event.ticketTypes.map((tt) => ({
      ...tt,
      price: Number(tt.price),
    })),
    tickets: event.tickets.map((t) => ({
      ...t,
      totalAmount: Number(t.totalAmount),
      createdAt: t.createdAt.toISOString(),
      status: t.status as "confirmed" | "cancelled" | "refunded",
      ticketType: {
        ...t.ticketType,
        price: Number(t.ticketType.price),
      },
    })),
  };

  const totalSold = event.ticketTypes.reduce((sum, tt) => sum + tt.sold, 0);
  const totalCapacity = event.ticketTypes.reduce((sum, tt) => sum + tt.quantity, 0);
  const revenue = event.tickets
    .filter((t) => t.status === "confirmed")
    .reduce((sum, t) => sum + Number(t.totalAmount), 0);

  return (
    <TicketSalesClient
      event={serializedEvent}
      totalSold={totalSold}
      totalCapacity={totalCapacity}
      revenue={revenue}
      statusColors={statusColors}
      statusLabels={statusLabels}
    />
  );
}
