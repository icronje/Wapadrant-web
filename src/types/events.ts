export interface TicketType {
  id: string;
  eventId: string;
  name: string;
  price: number;
  quantity: number;
  sold: number;
}

export interface Ticket {
  id: string;
  eventId: string;
  ticketTypeId: string;
  buyerName: string;
  buyerEmail: string;
  buyerPhone: string | null;
  quantity: number;
  totalAmount: number;
  status: "confirmed" | "cancelled" | "refunded";
  createdAt: string;
  ticketType: TicketType;
}

export interface Event {
  id: string;
  title: string;
  description: string | null;
  date: string;
  endDate: string | null;
  location: string;
  imageUrl: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  ticketTypes: TicketType[];
}

export interface EventWithTickets extends Event {
  tickets: Ticket[];
}
