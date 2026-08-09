import Link from "next/link";
import { Calendar, MapPin, Ticket } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatAfrikaansDateShort, formatZAR } from "@/lib/date-format";
import type { Event } from "@/types/events";

interface EventCardProps {
  event: Event;
  showSoldBadge?: boolean;
}

export function EventCard({ event, showSoldBadge = true }: EventCardProps) {
  const soldCount = event.ticketTypes.reduce((sum, tt) => sum + (tt.sold || 0), 0);
  const hasTickets = event.ticketTypes.length > 0;
  const minPrice = hasTickets
    ? Math.min(...event.ticketTypes.map((tt) => Number(tt.price)))
    : 0;

  return (
    <Card className="group flex h-full flex-col overflow-hidden border-border/60 bg-card transition-shadow hover:shadow-md">
      <div className="relative aspect-[16/10] overflow-hidden bg-muted">
        {event.imageUrl ? (
          <img
            src={event.imageUrl}
            alt={event.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/10 to-muted">
            <Calendar className="h-10 w-10 text-primary/40" />
          </div>
        )}
        {showSoldBadge && soldCount > 0 && (
          <Badge className="absolute right-3 top-3 bg-primary text-primary-foreground shadow-sm">
            <Ticket className="mr-1 h-3 w-3" />
            {soldCount} verkoop
          </Badge>
        )}
      </div>
      <CardHeader className="pb-2">
        <CardTitle className="font-heading text-lg leading-tight">
          {event.title}
        </CardTitle>
        <CardDescription className="flex items-center gap-1.5 text-xs">
          <Calendar className="h-3.5 w-3.5" />
          {formatAfrikaansDateShort(event.date)}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 space-y-3 py-0">
        <p className="line-clamp-2 text-sm text-muted-foreground">
          {event.description || "Kom deel hierdie spesiale geleentheid saam met ons."}
        </p>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <MapPin className="h-3.5 w-3.5" />
          {event.location}
        </div>
        {hasTickets && (
          <div className="text-sm font-medium text-foreground">
            Vanaf {formatZAR(minPrice)}
          </div>
        )}
      </CardContent>
      <CardFooter className="mt-auto pt-4">
        <Link href={`/gebeurtenisse/${event.id}`}><Button className="w-full">Koop Kaartjies</Button></Link>
      </CardFooter>
    </Card>
  );
}
