import Link from "next/link";
import { Container } from "@/components/layout/container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatAfrikaansDateShort } from "@/lib/date-format";
import { Mic, Calendar, BookOpen, PlayCircle } from "lucide-react";
import { SermonArchiveClient } from "./sermon-archive-client";
import type { Sermon } from "@prisma/client";

export const metadata = {
  title: "Preke Argief | Wapadrant Gemeente",
  description:
    "Blaai deur vorige preke van Wapadrant Gemeente. Luister na klank of kyk video’s van ons eredienste.",
};

async function getSermons(): Promise<Sermon[]> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/api/sermons`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export default async function PrekePage() {
  const sermons = await getSermons();

  const allSeries = Array.from(
    new Set(sermons.map((s) => s.series).filter(Boolean))
  ).sort((a, b) => (a as string).localeCompare(b as string, "af"));

  return (
    <div className="flex flex-1 flex-col">
      <section className="bg-church-pattern py-16 sm:py-24">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="font-heading text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              Preke Argief
            </h1>
            <p className="mt-5 text-lg text-muted-foreground">
              Ons familie kom Sondae bymekaar om te hoor wat ons Pa vir ons wil
              sê. Vind hier vorige preke terug.
            </p>
          </div>
        </Container>
      </section>

      <section className="flex-1 py-12 sm:py-20">
        <Container>
          <SermonArchiveClient
            sermons={sermons}
            series={allSeries as string[]}
            emptyState={
              <div className="rounded-xl border border-dashed border-border bg-secondary/40 p-10 text-center">
                <Mic className="mx-auto mb-3 h-12 w-12 text-muted-foreground/60" />
                <p className="font-heading text-lg font-semibold text-foreground">
                  Tans geen preke om te vertoon nie.
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Kom binnekort terug – ons voeg gedurig preke by.
                </p>
              </div>
            }
          >
            {sermons.map((sermon) => (
              <SermonCard key={sermon.id} sermon={sermon} />
            ))}
          </SermonArchiveClient>
        </Container>
      </section>
    </div>
  );
}

function SermonCard({ sermon }: { sermon: Sermon }) {
  return (
    <Card className="group flex flex-col overflow-hidden border-border/60 bg-card transition-all hover:-translate-y-1 hover:shadow-lg">
      <CardHeader className="flex-1">
        <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <PlayCircle className="h-5 w-5" />
        </div>
        <CardTitle className="font-heading text-lg leading-snug">
          {sermon.title}
        </CardTitle>
        <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <Mic className="h-4 w-4" />
            {sermon.speaker}
          </span>
          <span className="inline-flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            {formatAfrikaansDateShort(sermon.date)}
          </span>
        </div>
        {sermon.series ? (
          <Badge variant="secondary" className="mt-3 w-fit gap-1">
            <BookOpen className="h-3 w-3" />
            {sermon.series}
          </Badge>
        ) : null}
      </CardHeader>
      <CardContent>
        <Link href={`/preke/${sermon.id}`}><Button className="w-full">Luister / Kyk</Button></Link>
      </CardContent>
    </Card>
  );
}
