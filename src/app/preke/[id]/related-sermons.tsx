"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mic, Calendar } from "lucide-react";
import { formatAfrikaansDateShort } from "@/lib/date-format";
import type { Sermon } from "@prisma/client";

interface RelatedSermonsProps {
  series?: string | null;
  currentId: string;
  sermons: Sermon[];
}

export function RelatedSermons({ series, sermons }: RelatedSermonsProps) {
  if (!series) {
    return (
      <Card className="border-border/60">
        <CardHeader>
          <CardTitle className="font-heading text-base">Meer Preke</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Hierdie preek maak nie deel van ‘n reeks nie.
        </CardContent>
      </Card>
    );
  }

  if (sermons.length === 0) {
    return null;
  }

  return (
    <Card className="border-border/60">
      <CardHeader>
        <CardTitle className="font-heading text-base">Meer uit “{series}”</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {sermons.map((item) => {
          const sermon = item;
          return (
            <Link
              key={sermon.id}
              href={`/preke/${sermon.id}`}
              className="group block rounded-lg border border-border/60 bg-secondary/40 p-3 transition-colors hover:bg-accent"
            >
              <p className="font-medium text-foreground group-hover:text-primary">
                {sermon.title}
              </p>
              <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <Mic className="h-3 w-3" />
                  {sermon.speaker}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {formatAfrikaansDateShort(sermon.date)}
                </span>
              </div>
            </Link>
          );
        })}
        <Link href="/preke"><Button variant="outline" className="w-full">Sien alle preke</Button></Link>
      </CardContent>
    </Card>
  );
}
