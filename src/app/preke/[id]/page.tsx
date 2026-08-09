import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/layout/container";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatAfrikaansDate } from "@/lib/date-format";
import {
  Mic,
  Calendar,
  BookOpen,
  ArrowLeft,
  Headphones,
  PlayCircle,
} from "lucide-react";
import { RelatedSermons } from "./related-sermons";
import type { Sermon } from "@prisma/client";

interface SermonDetailPageProps {
  params: Promise<{ id: string }>;
}

async function getSermon(id: string): Promise<Sermon | null> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/api/sermons/${id}`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

async function getRelatedSermons(
  series: string,
  excludeId: string
): Promise<Sermon[]> {
  if (!series) return [];
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/api/sermons`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) return [];
    const all: Sermon[] = await res.json();
    return all
      .filter((s) => s.series === series && s.id !== excludeId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 4);
  } catch {
    return [];
  }
}

function extractYouTubeId(url: string): string | null {
  if (!url) return null;
  const regExp =
    /(?:youtube\.com\/(?:[^\/]+\/.*\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = url.match(regExp);
  return match ? match[1] : null;
}

export async function generateMetadata({ params }: SermonDetailPageProps) {
  const { id } = await params;
  const sermon = await getSermon(id);
  return {
    title: sermon
      ? `${sermon.title} | Preek | Wapadrant Gemeente`
      : "Preek | Wapadrant Gemeente",
    description: sermon
      ? `Luister na "${sermon.title}" deur ${sermon.speaker} op ${new Date(
          sermon.date
        ).toLocaleDateString("af-ZA")}.`
      : "Wapadrant Gemeente preek detail.",
  };
}

export default async function SermonDetailPage({
  params,
}: SermonDetailPageProps) {
  const { id } = await params;
  const sermon = await getSermon(id);

  if (!sermon) {
    notFound();
  }

  const related = await getRelatedSermons(sermon.series, sermon.id);
  const youtubeId = extractYouTubeId(sermon.videoUrl);

  return (
    <div className="flex flex-1 flex-col">
      <section className="bg-church-pattern py-12 sm:py-20">
        <Container>
          <Button variant="ghost" className="mb-4 -ml-2">
            <Link href="/preke" className="inline-flex items-center gap-1.5">
              <ArrowLeft className="h-4 w-4" />
              Terug na Preke
            </Link>
          </Button>

          <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
            <div className="space-y-6">
              <h1 className="font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                {sermon.title}
              </h1>

              <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1">
                  <Mic className="h-4 w-4 text-primary" />
                  {sermon.speaker}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1">
                  <Calendar className="h-4 w-4 text-primary" />
                  {formatAfrikaansDate(sermon.date)}
                </span>
                {sermon.series ? (
                  <Badge variant="secondary" className="gap-1">
                    <BookOpen className="h-3 w-3" />
                    {sermon.series}
                  </Badge>
                ) : null}
              </div>

              {youtubeId ? (
                <div className="overflow-hidden rounded-xl bg-black shadow-lg">
                  <div className="relative aspect-video w-full">
                    <iframe
                      src={`https://www.youtube.com/embed/${youtubeId}`}
                      title={sermon.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="absolute inset-0 h-full w-full"
                    />
                  </div>
                </div>
              ) : sermon.videoUrl ? (
                <Card className="border-border/60">
                  <CardContent className="py-8 text-center">
                    <PlayCircle className="mx-auto mb-3 h-10 w-10 text-primary/70" />
                    <p className="text-sm text-muted-foreground">
                      Video beskikbaar op{" "}
                      <a
                        href={sermon.videoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary underline underline-offset-4"
                      >
                        {sermon.videoUrl}
                      </a>
                    </p>
                  </CardContent>
                </Card>
              ) : null}

              {sermon.audioUrl ? (
                <Card className="border-border/60">
                  <CardContent className="space-y-3 py-5">
                    <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                      <Headphones className="h-4 w-4 text-primary" />
                      Klankopname
                    </div>
                    <audio controls className="w-full" src={sermon.audioUrl}>
                      Jou blaaier ondersteun nie klank nie.
                    </audio>
                  </CardContent>
                </Card>
              ) : null}

              {sermon.description ? (
                <Card className="border-border/60">
                  <CardContent className="py-5">
                    <h2 className="mb-3 font-heading text-lg font-semibold">
                      Beskrywing
                    </h2>
                    <p className="prose max-w-none text-foreground/90">
                      {sermon.description}
                    </p>
                  </CardContent>
                </Card>
              ) : null}
            </div>

            <aside className="space-y-6">
              <RelatedSermons currentId={sermon.id} series={sermon.series} sermons={related} />
            </aside>
          </div>
        </Container>
      </section>
    </div>
  );
}
