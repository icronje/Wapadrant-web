import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/layout/container";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatAfrikaansDate } from "@/lib/date-format";
import { Megaphone, Calendar, ArrowLeft } from "lucide-react";
import type { Announcement } from "@prisma/client";

interface AnnouncementDetailPageProps {
  params: Promise<{ id: string }>;
}

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

async function getAnnouncement(id: string): Promise<Announcement | null> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/api/announcements/${id}`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: AnnouncementDetailPageProps) {
  const { id } = await params;
  const announcement = await getAnnouncement(id);
  return {
    title: announcement
      ? `${announcement.title} | Aankondiging | Wapadrant Gemeente`
      : "Aankondiging | Wapadrant Gemeente",
    description: announcement
      ? `${announcement.content.slice(0, 150).replace(/\s+/g, " ")}...`
      : "Wapadrant Gemeente aankondiging detail.",
  };
}

export default async function AnnouncementDetailPage({
  params,
}: AnnouncementDetailPageProps) {
  const { id } = await params;
  const announcement = await getAnnouncement(id);

  if (!announcement) {
    notFound();
  }

  return (
    <div className="flex flex-1 flex-col">
      <section className="bg-church-pattern py-12 sm:py-20">
        <Container className="max-w-3xl">
          <Button variant="ghost" className="mb-4 -ml-2">
            <Link href="/aankondigings" className="inline-flex items-center gap-1.5">
              <ArrowLeft className="h-4 w-4" />
              Terug na Aankondigings
            </Link>
          </Button>

          <Card className="border-border/60">
            <CardContent className="space-y-6 py-8">
              <div className="flex flex-wrap items-center gap-3">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Megaphone className="h-5 w-5" />
                </div>
                <Badge
                  variant="outline"
                  className={`${
                    typeColors[announcement.type] || typeColors.general
                  } border-transparent`}
                >
                  {typeLabels[announcement.type] || announcement.type}
                </Badge>
              </div>

              <h1 className="font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                {announcement.title}
              </h1>

              <div className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                {formatAfrikaansDate(announcement.publishedAt)}
              </div>

              <div className="prose max-w-none text-foreground/90">
                {announcement.content.split("\n").map((paragraph, idx) => (
                  <p key={idx} className="mb-4 last:mb-0">
                    {paragraph}
                  </p>
                ))}
              </div>

              {announcement.expiresAt ? (
                <p className="text-sm text-muted-foreground">
                  Verval: {formatAfrikaansDate(announcement.expiresAt)}
                </p>
              ) : null}
            </CardContent>
          </Card>
        </Container>
      </section>
    </div>
  );
}
