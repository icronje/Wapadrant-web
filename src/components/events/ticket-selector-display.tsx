"use client";

import { useState } from "react";
import { TicketSelector, SelectedTicket } from "./ticket-selector";
import type { TicketType } from "@/types/events";

interface TicketSelectorDisplayProps {
  ticketTypes: TicketType[];
}

export function TicketSelectorDisplay({ ticketTypes }: TicketSelectorDisplayProps) {
  const [selected, setSelected] = useState<SelectedTicket[]>([]);

  return (
    <TicketSelector
      ticketTypes={ticketTypes}
      selected={selected}
      onChange={setSelected}
    />
  );
}