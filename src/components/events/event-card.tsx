import Link from "next/link";
import { Calendar, MapPin, Ticket } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatAfrikaansDateShort, formatZAR } from "@/lib/date-format";
import type { Event } from "@/types/events";

const PLACEHOLDER_SVG = "data:image/svg+xml,%3Csvg width='600' height='400' viewBox='0 0 600 400' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='600' height='400' fill='%23e8f0e8'/%3E%3Ccircle cx='300' cy='160' r='50' fill='%234a7c4a' opacity='0.3'/%3E%3Cpath d='M250 280 L300 200 L350 280 Z' fill='%234a7c4a' opacity='0.3'/%3E%3Crect x='200' y='290' width='200' height='8' rx='4' fill='%234a7c4a' opacity='0.2'/%3E%3Crect x='230' y='310' width='140' height='6' rx='3' fill='%234a7c4a' opacity='0.15'/%3E%3Ctext x='300' y='370' font-family='Arial' font-size='16' fill='%234a7c4a' opacity='0.4' text-anchor='middle'%3EWapadrant Gemeente%3C/text%3E%3C/svg%3E";

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

  const imageSrc = event.imageUrl && event.imageUrl !== "/images/placeholder-event.svg"
    ? event.imageUrl
    : PLACEHOLDER_SVG;

  return (
    <Card className="group flex h-full flex-col overflow-hidden border-border/60 bg-card transition-shadow hover:shadow-md">
      <div className="relative aspect-[16/10] overflow-hidden bg-muted">
        <img
          src={imageSrc}
          alt={event.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
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