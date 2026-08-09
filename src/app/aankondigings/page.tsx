import Link from "next/link";
import { Container } from "@/components/layout/container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatAfrikaansDateShort } from "@/lib/date-format";
import { Megaphone, Calendar, ArrowRight } from "lucide-react";
import { AnnouncementFilterClient } from "./announcement-filter-client";
import type { Announcement } from "@prisma/client";

export const metadata = {
  title: "Aankondigings | Wapadrant Gemeente",
  description:
    "Bly op hoogte van die jongste aankondigings, verjaarsdae en nuus by Wapadrant Gemeente.",
};

const typeLabels: Record<string, string> = {
  general: "Algemeen",
  birthday: "Verjaarsdag",
  news: "Nuus",
  gksa: "GKSA",
};

const typeColors: Record<string, string> = {
  general: "bg-blue-100 text-blue-800 hover:bg-blue-100/80",
  birthday: "bg-pink-100 text-pink-800 hover:bg-pink-100/80",
  news: "bg-green-100 text-green-800 hover:bg-green-100/80",
  gksa: "bg-purple-100 text-purple-800 hover:bg-purple-100/80",
};

async function getAnnouncements(): Promise<Announcement[]> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/api/announcements`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export default async function AankondigingsPage() {
  const announcements = await getAnnouncements();

  return (
    <div className="flex flex-1 flex-col">
      <section className="bg-church-pattern py-16 sm:py-24">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="font-heading text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              Aankondigings
            </h1>
            <p className="mt-5 text-lg text-muted-foreground">
              Wat gebeur in ons familie? Bly op hoogte met die jongste nuus en
              geleenthede.
            </p>
          </div>
        </Container>
      </section>

      <section className="flex-1 py-12 sm:py-20">
        <Container>
          <AnnouncementFilterClient
            announcements={announcements}
            emptyState={
              <div className="rounded-xl border border-dashed border-border bg-secondary/40 p-10 text-center">
                <Megaphone className="mx-auto mb-3 h-12 w-12 text-muted-foreground/60" />
                <p className="font-heading text-lg font-semibold text-foreground">
                  Tans geen aankondigings nie.
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Kom loer later weer vir die jongste nuus.
                </p>
              </div>
            }
          >
            {announcements.map((a) => (
              <AnnouncementCard
                key={a.id}
                announcement={a}
                typeLabel={typeLabels[a.type] || a.type}
                typeColor={typeColors[a.type] || typeColors.general}
              />
            ))}
          </AnnouncementFilterClient>
        </Container>
      </section>
    </div>
  );
}

function AnnouncementCard({
  announcement,
  typeLabel,
  typeColor,
}: {
  announcement: Announcement;
  typeLabel: string;
  typeColor: string;
}) {
  return (
    <Card className="flex flex-col border-border/60 bg-card transition-all hover:-translate-y-1 hover:shadow-md">
      <CardHeader className="flex-1">
        <div className="mb-3 flex items-center justify-between">
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Megaphone className="h-5 w-5" />
          </div>
          <Badge variant="outline" className={`${typeColor} border-transparent`}>
            {typeLabel}
          </Badge>
        </div>
        <CardTitle className="font-heading text-lg leading-snug">
          {announcement.title}
        </CardTitle>
        <div className="mt-2 inline-flex items-center gap-1.5 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          {formatAfrikaansDateShort(announcement.publishedAt)}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="line-clamp-4 text-sm text-foreground/80">
          {announcement.content}
        </p>
        <Link
          href={`/aankondigings/${announcement.id}`}
          className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
        >
          Lees meer
          <ArrowRight className="h-4 w-4" />
        </Link>
      </CardContent>
    </Card>
  );
}
