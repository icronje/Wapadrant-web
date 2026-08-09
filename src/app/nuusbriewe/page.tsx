import Link from "next/link";
import { Container } from "@/components/layout/container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatAfrikaansDateShort } from "@/lib/date-format";
import { FileText, Calendar, Download, Mail } from "lucide-react";
import type { Newsletter } from "@prisma/client";

export const metadata = {
  title: "Nuusbriewe | Wapadrant Gemeente",
  description:
    "Laai Wapadrant Gemeente se nuusbriewe en e-Nuus af. Bly op hoogte van wat in ons familie gebeur.",
};

interface NewsletterWithDate extends Newsletter {
  createdAt: string;
}

async function getNewsletters(): Promise<NewsletterWithDate[]> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/api/newsletters`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) return [];
    const data: NewsletterWithDate[] = await res.json();
    return Array.isArray(data)
      ? data.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
      : [];
  } catch {
    return [];
  }
}

export default async function NuusbriewePage() {
  const newsletters = await getNewsletters();

  return (
    <div className="flex flex-1 flex-col">
      <section className="bg-church-pattern py-16 sm:py-24">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="font-heading text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              Nuusbriewe
            </h1>
            <p className="mt-5 text-lg text-muted-foreground">
              Ons e-Nuus en vorige nuusbriewe – lees gerus en bly deel van ons
              familie.
            </p>
          </div>
        </Container>
      </section>

      <section className="flex-1 py-12 sm:py-20">
        <Container>
          <div className="mb-8 flex flex-col gap-4 rounded-xl border border-border/60 bg-card p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Mail className="h-5 w-5" />
              </div>
              <div>
                <p className="font-heading font-semibold text-foreground">
                  Teken in vir Wapadrant e-Nuus
                </p>
                <p className="text-sm text-muted-foreground">
                  Stuur ‘n e-pos na{" "}
                  <a
                    href="mailto:kantoor@gkwapadrant.co.za?subject=Wapadrant%20e-Nuus%20inskrywing"
                    className="text-primary underline underline-offset-4"
                  >
                    kantoor@gkwapadrant.co.za
                  </a>
                </p>
              </div>
            </div>
            <Button variant="outline" >
              <Link href="/kontak-ons">Kontak ons</Link>
            </Button>
          </div>

          {newsletters.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border bg-secondary/40 p-10 text-center">
              <FileText className="mx-auto mb-3 h-12 w-12 text-muted-foreground/60" />
              <p className="font-heading text-lg font-semibold text-foreground">
                Tans geen nuusbriewe om te vertoon nie.
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                Kom loer later weer vir die jongste e-Nuus.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {newsletters.map((newsletter) => (
                <Card
                  key={newsletter.id}
                  className="flex flex-col border-border/60 bg-card transition-all hover:-translate-y-1 hover:shadow-md"
                >
                  <CardHeader className="flex-1">
                    <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <FileText className="h-5 w-5" />
                    </div>
                    <CardTitle className="font-heading text-lg leading-snug">
                      {newsletter.title}
                    </CardTitle>
                    <div className="mt-2 inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      {formatAfrikaansDateShort(newsletter.createdAt)}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full" >
                      <a
                        href={newsletter.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2"
                      >
                        <Download className="h-4 w-4" />
                        Laai af
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </Container>
      </section>
    </div>
  );
}
