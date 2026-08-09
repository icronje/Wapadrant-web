import Link from "next/link";
import {
  Sparkles,
  Heart,
  Feather,
  Sun,
  Clock,
  MapPin,
  Play,
  CalendarDays,
  ArrowRight,
} from "lucide-react";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M22 12.07C22 6.5 17.52 2 12 2S2 6.5 2 12.07C2 17.06 5.66 21.2 10.44 22v-7H7.9v-2.93h2.54V9.36c0-3.08 1.74-4.78 4.54-4.78 1.32 0 2.2.1 2.5.14v2.9h-1.7c-1.34 0-1.64.63-1.64 1.56v2.05h3.3l-.46 2.93h-2.84V22C18.34 21.2 22 17.06 22 12.07z" />
    </svg>
  );
}

function YoutubeIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M23.5 6.19a3.02 3.02 0 0 0-2.12-2.14C19.72 3.5 12 3.5 12 3.5s-7.72 0-9.38.55A3.02 3.02 0 0 0 .5 6.19 31.5 31.5 0 0 0 0 12a31.5 31.5 0 0 0 .5 5.81 3.02 3.02 0 0 0 2.12 2.14c1.66.55 9.38.55 9.38.55s7.72 0 9.38-.55a3.02 3.02 0 0 0 2.12-2.14A31.5 31.5 0 0 0 24 12a31.5 31.5 0 0 0-.5-5.81zM9.55 15.5V8.5l6.27 3.5-6.27 3.5z" />
    </svg>
  );
}

const visionCards = [
  {
    title: "Vrygekoop",
    description:
      "Ons kom soos ons is – vol vrae, vrese en hoop. By Wapadrant ontdek ons die vryheid wat Jesus vir ons wen.",
    icon: Feather,
  },
  {
    title: "Volkome Vergewe",
    description:
      "Niks hou ons terug nie. God se genade skoonvee en gee ons 'n nuwe begin, elke dag weer.",
    icon: Heart,
  },
  {
    title: "Nuutgemaak",
    description:
      "Hy maak alles nuut. Ons glo aan groei, verandering en die krag van die Heilige Gees in ons lewens.",
    icon: Sparkles,
  },
  {
    title: "Waardevol",
    description:
      "Elke mens het waarde. Hier tel jy. Hier het jy 'n plek. Hier dra ons saam mekaar se laste.",
    icon: Sun,
  },
];

const serviceTimes = [
  {
    title: "Kontemporêre Erediens",
    time: "08:30",
    note: "Moderne aanbidding vir die hele gesin",
  },
  {
    title: "Jeuggroepe",
    time: "09:30",
    note: "Van peuters tot hoërskool – elke ouderdom het 'n plek",
  },
  {
    title: "Klassieke Erediens",
    time: "10:00",
    note: "Tradisionele aanbidding met diep wortels",
  },
];

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden bg-church-pattern py-24 sm:py-32">
        <Container className="relative z-10">
          <div className="mx-auto max-w-3xl text-center">
            <Badge
              variant="outline"
              className="mb-6 border-primary/30 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary"
            >
              Almal welkom by familie God vat jou soos jy is
            </Badge>
            <h1 className="font-heading text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl md:text-6xl">
              Ons maak impak vir ons{" "}
              <span className="text-primary">Koning</span>
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
              Ons is 'n gemeente wat saam droom, saam bid en saam werk om liefde lewendig te maak.
              Kom maak deel van die Wapadrant-gesin.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/kontak-ons">
                <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2">
                    Ek wil inskakel
                    <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/eredienste"><Button variant="outline"
                size="lg"
                className="border-primary/30 text-primary hover:bg-primary/5">Sien ons eredienste</Button></Link>
            </div>
          </div>
        </Container>

        {/* Decorative soft shapes */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-primary/[0.04] blur-3xl" />
          <div className="absolute -left-24 bottom-0 h-80 w-80 rounded-full bg-accent-gold/[0.05] blur-3xl" />
        </div>
      </section>

      {/* Vision cards */}
      <section className="py-16 sm:py-24">
        <Container>
          <div className="mb-12 text-center">
            <h2 className="font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Wat ons saam glo
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              Ons vier die genade wat ons vrykoop, vergewe, nuut maak en waarde gee.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {visionCards.map((card) => {
              const Icon = card.icon;
              return (
                <Card
                  key={card.title}
                  className="group border-border/60 bg-card transition-all hover:-translate-y-1 hover:shadow-lg"
                >
                  <CardHeader className="pb-3">
                    <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                      <Icon className="h-6 w-6" />
                    </div>
                    <CardTitle className="font-heading text-xl">{card.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {card.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </Container>
      </section>

      {/* Service times */}
      <section className="bg-secondary/40 py-16 sm:py-24">
        <Container>
          <div className="mb-12 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <h2 className="font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Kom aanbid saam met ons
              </h2>
              <p className="mt-4 text-muted-foreground">
                Ons bymekaar elke Sondag in Olympus, Pretoria.
              </p>
            </div>
            <div className="flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-3 text-sm text-muted-foreground shadow-sm">
              <MapPin className="h-4 w-4 text-primary" />
              Sunriseweg 3, Olympus, Pretoria
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {serviceTimes.map((service) => (
              <Card
                key={service.title}
                className="relative overflow-hidden border-border/60 bg-card text-center"
              >
                <div className="absolute left-0 top-0 h-1 w-full bg-primary" />
                <CardHeader className="pb-2">
                  <CardTitle className="font-heading text-lg">{service.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-center gap-2 font-heading text-4xl font-bold text-primary">
                    <Clock className="h-7 w-7" />
                    {service.time}
                  </div>
                  <p className="text-sm text-muted-foreground">{service.note}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* Latest sermon + events */}
      <section className="py-16 sm:py-24">
        <Container>
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Latest sermon */}
            <Card className="border-border/60 bg-card">
              <CardHeader>
                <div className="flex items-center gap-2 text-primary">
                  <Play className="h-5 w-5" />
                  <span className="text-sm font-semibold uppercase tracking-wider">
                    Kyk saam na Sondag se preek
                  </span>
                </div>
                <CardTitle className="font-heading text-2xl">Ons jongste boodskap</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative aspect-video overflow-hidden rounded-xl bg-muted">
                  <iframe
                    className="absolute inset-0 h-full w-full rounded-xl"
                    src="https://www.youtube.com/embed/UCb3hrnMcAH836mloVeZC2g?rel=0"
                    title="Wapadrant Gemeente YouTube"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  Het jy Sondag gemis? Of wil jy net weer luister? Hier is ons nuutste boodskap.
                </p>
                <div className="flex flex-wrap gap-3">
                  <a
                    href="https://www.facebook.com/gkwapadrant"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
                  >
                    <FacebookIcon className="h-4 w-4 text-[#1877F2]" />
                    Facebook
                  </a>
                  <a
                    href="https://www.youtube.com/channel/UCb3hrnMcAH836mloVeZC2g"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
                  >
                    <YoutubeIcon className="h-4 w-4 text-red-600" />
                    YouTube
                  </a>
                </div>
              </CardContent>
            </Card>

            {/* Upcoming events */}
            <Card className="border-border/60 bg-card">
              <CardHeader>
                <div className="flex items-center gap-2 text-primary">
                  <CalendarDays className="h-5 w-5" />
                  <span className="text-sm font-semibold uppercase tracking-wider">
                    Komende Gebeurtenisse
                  </span>
                </div>
                <CardTitle className="font-heading text-2xl">Wat kom volgende?</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex h-full min-h-[12rem] flex-col items-center justify-center rounded-xl border border-dashed border-border bg-secondary/40 p-6 text-center">
                  <CalendarDays className="mb-3 h-10 w-10 text-muted-foreground/60" />
                  <p className="font-medium text-foreground">Geen gebeurtenisse binnekort nie.</p>
                  <p className="mt-1 text-sm text-muted-foreground">Kom binnekort terug vir opdaterings!</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </Container>
      </section>

      {/* Final CTA */}
      <section className="bg-primary py-16 text-primary-foreground">
        <Container className="text-center">
          <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
            Ons wag vir jou
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg opacity-90">
            Of jy al jare in die kerk is of net nuuskierig – hier is plek vir jou.
            Kom ervaar die warmte van die Wapadrant-gemeenskap.
          </p>
          <Button
            size="lg"
            variant="secondary"
            ><Link href="/kontak-ons" className="gap-2">
                Kom ons gesels
                <ArrowRight className="h-4 w-4" />
              </Link></Button>
        </Container>
      </section>
    </div>
  );
}
