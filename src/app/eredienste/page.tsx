import Link from "next/link";
import { Container } from "@/components/layout/container";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Clock,
  Music,
  Users,
  Video,
  Headphones,
  Baby,
  GraduationCap,
  CalendarDays,
} from "lucide-react";

export const metadata = {
  title: "Eredienste | Wapadrant Gemeente",
  description:
    "Kom aanbid saam met ons Sondae in Olympus. Kontemporêre en klassieke eredienste, jeuggroepe en lewendige uitsending.",
};

const services = [
  {
    title: "Kontemporêre Erediens",
    time: "08:30",
    note: "Klawerbord en orkes – aanbidding vir die hele gesin",
    icon: Music,
  },
  {
    title: "Klassieke Erediens",
    time: "10:00",
    note: "Kerktorrel – tradisionele aanbidding met diep wortels",
    icon: Clock,
  },
];

const youthGroups = [
  {
    title: "Kleuterkerk",
    ages: "3 – 6 jariges",
    time: "Tydens die 08:30 erediens",
    icon: Baby,
  },
  {
    title: "Laerskoolkleingroepe",
    ages: "Gr 1 – 6",
    time: "09:30 – 10:30",
    icon: GraduationCap,
  },
  {
    title: "Hoërskoolkleingroepe",
    ages: "Gr 7 – 12",
    time: "09:30 – 10:30",
    icon: Users,
  },
];

export default function EredienstePage() {
  return (
    <div className="flex flex-1 flex-col">
      {/* Hero */}
      <section className="bg-church-pattern py-16 sm:py-24">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="font-heading text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              Eredienste
            </h1>
            <p className="mt-5 text-lg text-muted-foreground">
              Ons familie kom Sondae bymekaar om te hoor wat ons Pa vir ons wil
              sê, om mekaar te dien, ons gawes te deel, voor teëspoed te staan
              en saam te bid.
            </p>
          </div>
        </Container>
      </section>

      <section className="flex-1 py-12 sm:py-20">
        <Container className="space-y-16">
          {/* Service times */}
          <div>
            <div className="mb-8 flex items-center gap-3">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-heading text-2xl font-bold text-foreground">
                  Eredienstye
                </h2>
                <p className="text-sm text-muted-foreground">
                  Kom aanbid saam met ons elke Sondag
                </p>
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((service) => {
                const Icon = service.icon;
                return (
                  <Card key={service.title} className="border-border/60 bg-card">
                    <CardHeader>
                      <CardTitle className="font-heading text-lg">
                        {service.title}
                      </CardTitle>
                      <CardDescription>{service.note}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-2 font-heading text-4xl font-bold text-primary">
                        <Icon className="h-6 w-6" />
                        {service.time}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}

              <Card className="border-border/60 bg-card">
                <CardHeader>
                  <CardTitle className="font-heading text-lg">
                    Spesiale eredienste
                  </CardTitle>
                  <CardDescription>Skoolvakansies en spesiale dae</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 font-heading text-4xl font-bold text-primary">
                    <CalendarDays className="h-6 w-6" />
                    08:30
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground">
                    Gedurende skoolvakansies bied ons ’n enkele gesinsdiens om
                    08:30 aan.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Youth groups */}
          <div>
            <div className="mb-8 flex items-center gap-3">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-heading text-2xl font-bold text-foreground">
                  Jeuggroepe
                </h2>
                <p className="text-sm text-muted-foreground">
                  Sondae gedurende skoolkwartale
                </p>
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {youthGroups.map((group) => {
                const Icon = group.icon;
                return (
                  <Card key={group.title} className="border-border/60 bg-card">
                    <CardHeader>
                      <div className="mb-2 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Icon className="h-5 w-5" />
                      </div>
                      <CardTitle className="font-heading text-lg">
                        {group.title}
                      </CardTitle>
                      <CardDescription>{group.ages}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm font-medium text-foreground">
                        {group.time}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <Card className="mt-6 border-border/60 bg-card">
              <CardContent className="py-5">
                <p className="text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">
                    Jeugwerker:
                  </span>{" "}
                  Errol Mears |{" "}
                  <a
                    href="tel:0129916429"
                    className="text-primary underline-offset-2 hover:underline"
                  >
                    012 991 6429
                  </a>
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Livestream */}
          <div>
            <div className="mb-8 flex items-center gap-3">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Video className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-heading text-2xl font-bold text-foreground">
                  Livestream
                </h2>
                <p className="text-sm text-muted-foreground">
                  Kan jy nie by die erediens wees nie? Kyk saam van die huis af.
                </p>
              </div>
            </div>

            <Card className="border-border/60 bg-card">
              <CardHeader>
                <CardTitle className="font-heading text-lg">
                  08:30 Erediens word regstreeks uitgesaai
                </CardTitle>
                <CardDescription>
                  Beskikbaar op Facebook en daarna op YouTube
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-3">
                  <Button
                    variant="outline"
                    ><Link href="https://www.facebook.com/pg/Wapadrant-Gemeente-314127775289345/videos/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="gap-2"
                      >
                        <Video className="h-4 w-4" />
                        Kyk op Facebook
                      </Link></Button>
                  <Button
                    variant="outline"
                    ><Link href="https://www.youtube.com/channel/UCb3hrnMcAH83-6mloVeZC2g"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="gap-2"
                      >
                        <Headphones className="h-4 w-4" />
                        Luister op YouTube
                      </Link></Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sermon archive placeholder */}
          <div>
            <div className="mb-8 flex items-center gap-3">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Headphones className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-heading text-2xl font-bold text-foreground">
                  Preekargief
                </h2>
                <p className="text-sm text-muted-foreground">
                  Video- en klankopnames van vorige boodskappe
                </p>
              </div>
            </div>

            <Card className="border-border/60 bg-card">
              <CardContent className="py-10">
                <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-secondary/40 p-8 text-center">
                  <Headphones className="mb-3 h-10 w-10 text-muted-foreground/60" />
                  <p className="font-medium text-foreground">
                    Preekargief kom binnekort hier.
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Tot dan kan jy ons jongste boodskappe op YouTube vind.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </Container>
      </section>
    </div>
  );
}
