import Link from "next/link";
import { Container } from "@/components/layout/container";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Mic,
  FileText,
  Camera,
  ArrowRight,
  BookOpen,
  Images,
  Megaphone,
} from "lucide-react";

export const metadata = {
  title: "Argief | Wapadrant Gemeente",
  description:
    "Blaai deur ons argief van preke, nuusbriewe, foto’s en belangrike dokumente uit Wapadrant se geskiedenis.",
};

const archiveSections = [
  {
    title: "Preke",
    description:
      "Herbeluister vorige preke uit ons eredienste. Soek volgens titel, spreker of reeks.",
    icon: Mic,
    href: "/preke",
    cta: "Gaan na Preke",
  },
  {
    title: "Nuusbriewe",
    description:
      "Laai Wapadrant se e-Nuus en vorige nuusbriewe af. Bly deel van ons familie se verhaal.",
    icon: FileText,
    href: "/nuusbriewe",
    cta: "Gaan na Nuusbriewe",
  },
  {
    title: "Foto Albums",
    description:
      "Blaai deur foto’s van geleenthede, dienste en ons gemeenskap saam.",
    icon: Camera,
    href: "/foto-albums",
    cta: "Gaan na Foto Albums",
  },
];

const historicalLinks = [
  "Openbare getuienis",
  "Kerkraadverklarings",
  "Gespreksforum 1 (2016) – Vroue in amp",
  "Gespreksforum 2 (2017) – Eenheid en diversiteit",
  "Gespreksforum 3 (2018) – Toekoms van GKSA",
  "Blitsgids",
];

export default function ArgiefPage() {
  return (
    <div className="flex flex-1 flex-col">
      <section className="bg-church-pattern py-16 sm:py-24">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="font-heading text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              Argief
            </h1>
            <p className="mt-5 text-lg text-muted-foreground">
              Blaai deur ons geskiedenis – preke, nuusbriewe, foto’s en
              belangrike dokumente wat ons familie se verhaal vertel.
            </p>
          </div>
        </Container>
      </section>

      <section className="flex-1 py-12 sm:py-20">
        <Container>
          <div className="grid gap-6 md:grid-cols-3">
            {archiveSections.map((section) => (
              <Link key={section.title} href={section.href} className="group block">
                <Card className="flex h-full flex-col border-border/60 bg-card transition-all hover:-translate-y-1 hover:shadow-lg">
                  <CardHeader className="flex-1">
                    <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                      <section.icon className="h-6 w-6" />
                    </div>
                    <CardTitle className="font-heading text-xl">
                      {section.title}
                    </CardTitle>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {section.description}
                    </p>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <span className="inline-flex items-center gap-1 text-sm font-medium text-primary group-hover:underline">
                      {section.cta}
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          <div className="mt-12 rounded-2xl border border-border/60 bg-card p-6 sm:p-8">
            <div className="mb-6 flex items-center gap-3">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <BookOpen className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-heading text-xl font-semibold">
                  Historiese dokumente
                </h2>
                <p className="text-sm text-muted-foreground">
                  Ons werk deur ouer dokumente om dit hier beskikbaar te maak.
                </p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {historicalLinks.map((item) => (
                <Card
                  key={item}
                  className="border-border/60 bg-secondary/40 transition-all hover:-translate-y-0.5 hover:shadow-sm"
                >
                  <CardHeader className="flex flex-row items-center gap-3 p-4">
                    <Megaphone className="h-4 w-4 text-muted-foreground" />
                    <CardTitle className="font-heading text-sm font-medium">
                      {item}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="px-4 pb-4">
                    <div className="rounded-lg border border-dashed border-border bg-background p-3 text-center text-xs text-muted-foreground">
                      Beskikbaar binnekort.
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="mt-8 rounded-xl border border-dashed border-border bg-secondary/40 p-6 text-center">
              <Images className="mx-auto mb-3 h-10 w-10 text-muted-foreground/60" />
              <p className="font-heading text-base font-semibold text-foreground">
                Argief word tans opgedateer.
              </p>
              <p className="mt-2 max-w-xl mx-auto text-sm text-muted-foreground">
                Ons werk deur ons historiese dokumente om dit hier beskikbaar
                te maak. Kom loer later weer.
              </p>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
