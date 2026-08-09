import { Container } from "@/components/layout/container";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CalendarDays, PartyPopper } from "lucide-react";

export const metadata = {
  title: "Gebeurtenisse | Wapadrant Gemeente",
  description:
    "Bly op hoogte van komende gebeurtenisse en byeenkomste by Wapadrant Gemeente.",
};

export default function GebeurtenissePage() {
  return (
    <div className="flex flex-1 flex-col">
      {/* Hero */}
      <section className="bg-church-pattern py-16 sm:py-24">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="font-heading text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              Gebeurtenisse
            </h1>
            <p className="mt-5 text-lg text-muted-foreground">
              Komende geleenthede en byeenkomste by ons familie. Bly ingelig,
              bly betrokke.
            </p>
          </div>
        </Container>
      </section>

      <section className="flex-1 py-12 sm:py-20">
        <Container>
          <Card className="mx-auto max-w-2xl border-border/60 bg-card">
            <CardHeader>
              <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <PartyPopper className="h-5 w-5" />
              </div>
              <CardTitle>Komende gebeurtenisse</CardTitle>
              <CardDescription>Kyk wat volgende aan die beurt is</CardDescription>
            </CardHeader>
            <CardContent className="py-8">
              <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-secondary/40 p-8 text-center">
                <CalendarDays className="mb-3 h-12 w-12 text-muted-foreground/60" />
                <p className="font-heading text-lg font-semibold text-foreground">
                  Geen gebeurtenisse binnekort nie.
                </p>
                <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                  Kom binnekort terug – ons laai volop detail op soos ons
                  familie se kalender gevul word.
                </p>
              </div>
            </CardContent>
          </Card>
        </Container>
      </section>
    </div>
  );
}
