import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { EventEditForm } from "./event-edit-form";
import type { Event } from "@/types/events";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function AdminEditEventPage({ params }: Props) {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    redirect("/admin/login");
  }

  const { id } = await params;

  const event = await prisma.event.findUnique({
    where: { id },
    include: {
      ticketTypes: {
        orderBy: { name: "asc" },
      },
      tickets: true,
    },
  });

  if (!event) {
    notFound();
  }

  const serializedEvent: Event = {
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
  };

  const totalSold = event.ticketTypes.reduce((sum, tt) => sum + tt.sold, 0);
  const revenue = event.tickets
    .filter((t) => t.status === "confirmed")
    .reduce((sum, t) => sum + Number(t.totalAmount), 0);

  const ticketTypeSales = event.ticketTypes.map((tt) => {
    const typeTickets = event.tickets.filter(
      (t) => t.ticketTypeId === tt.id && t.status === "confirmed"
    );
    const typeQty = typeTickets.reduce((sum, t) => sum + t.quantity, 0);
    const typeRevenue = typeTickets.reduce((sum, t) => sum + Number(t.totalAmount), 0);
    return {
      id: tt.id,
      name: tt.name,
      quantity: tt.quantity,
      sold: tt.sold,
      price: Number(tt.price),
      ticketQty: typeQty,
      revenue: typeRevenue,
    };
  });

  return (
    <EventEditForm
      event={serializedEvent}
      totalSold={totalSold}
      revenue={revenue}
      ticketTypeSales={ticketTypeSales}
    />
  );
}
