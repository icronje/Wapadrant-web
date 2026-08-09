import { Container } from "@/components/layout/container";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Megaphone,
  Newspaper,
  CalendarDays,
  Users,
  Cake,
  ShieldCheck,
  Briefcase,
} from "lucide-react";

export const metadata = {
  title: "Neem Kennis | Wapadrant Gemeente",
  description:
    "Bly op hoogte met Wapadrant se kennisgewings, nuusbriewe, kalender, lidmaatnetwerk en verjaarsdae.",
};

export default function NeemKennisPage() {
  return (
    <div className="flex flex-1 flex-col">
      {/* Hero */}
      <section className="bg-church-pattern py-16 sm:py-24">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="font-heading text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              Neem Kennis
            </h1>
            <p className="mt-5 text-lg text-muted-foreground">
              Ons kennisgewingbord help jou om betrokke te bly by wat in ons
              familie gebeur. Kom kuier gereeld hier.
            </p>
          </div>
        </Container>
      </section>

      {/* Content cards */}
      <section className="flex-1 py-12 sm:py-20">
        <Container>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            <Card className="border-border/60 bg-card">
              <CardHeader>
                <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Newspaper className="h-5 w-5" />
                </div>
                <CardTitle>Wapadrant e-Nuus</CardTitle>
                <CardDescription>Ons nuusbrief, op een plek</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Hier sal ons nuutste e-Nuus verskyn sodra dit beskikbaar is.
                  Lees gerus terug oor wat in ons gemeente aan die gang is.
                </p>
                <div className="mt-4 rounded-lg border border-dashed border-border bg-secondary/40 p-4 text-center text-sm text-muted-foreground">
                  Nuusbriewe word binnekort hier gelaai.
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/60 bg-card">
              <CardHeader>
                <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Megaphone className="h-5 w-5" />
                </div>
                <CardTitle>Aankondigings</CardTitle>
                <CardDescription>Spesiale mededelings</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Kerklike aankondigings, uitnodigings en belangrike dinge om te
                  onthou sal hier verskyn.
                </p>
                <div className="mt-4 rounded-lg border border-dashed border-border bg-secondary/40 p-4 text-center text-sm text-muted-foreground">
                  Tans geen nuwe aankondigings.
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/60 bg-card">
              <CardHeader>
                <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <CalendarDays className="h-5 w-5" />
                </div>
                <CardTitle>Kalender 2026</CardTitle>
                <CardDescription>Ons jaar se kalender</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Dop altyd die kalender dop sodat jy nooit ’n familie-byeenkoms
                  hoef te misloop nie. Sondag eredienste, spesiale dienste en
                  gemeenskapsgeleenthede word hier gelys.
                </p>
                <div className="mt-4 rounded-lg border border-dashed border-border bg-secondary/40 p-4 text-center text-sm text-muted-foreground">
                  Die volledige 2026-kalender word binnekort hier beskikbaar.
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/60 bg-card">
              <CardHeader>
                <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Users className="h-5 w-5" />
                </div>
                <CardTitle>Lidmaat Netwerk</CardTitle>
                <CardDescription>Ondersteun mekaar</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Het jy gewonder watter produkte en dienste deur ander lidmate
                  gelewer word? Hier verskyn inligting van ons lidmate se
                  ondernemings en geleenthede. Ons moet mekaar ondersteun.
                </p>
                <div className="mt-4 rounded-lg border border-dashed border-border bg-secondary/40 p-4 text-center text-sm text-muted-foreground">
                  Besonderhede word binnekort gepubliseer.
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/60 bg-card">
              <CardHeader>
                <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Briefcase className="h-5 w-5" />
                </div>
                <CardTitle>Op Tuisfront</CardTitle>
                <CardDescription>Deurlopende aksies en projekte</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Bly ingelig oor die projekte wat ons as gemeente aanpak. Van
                  terrein-onderhoud tot liefdadigheid – ons werk saam.
                </p>
                <div className="mt-4 rounded-lg border border-dashed border-border bg-secondary/40 p-4 text-center text-sm text-muted-foreground">
                  Terugvoer oor tans lopende projekte volg binnekort.
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/60 bg-card">
              <CardHeader>
                <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Cake className="h-5 w-5" />
                </div>
                <CardTitle>Verjaarsdae</CardTitle>
                <CardDescription>Vier saam met ons</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Ons familie se verjaarsdae word hier bymekaargemaak sodat ons
                  mekaar kan herinner en saam vier.
                </p>
                <div className="mt-4 rounded-lg border border-dashed border-border bg-secondary/40 p-4 text-center text-sm text-muted-foreground">
                  Die verjaarsdagkalender word binnekort beskikbaar.
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/60 bg-card md:col-span-2 xl:col-span-3">
              <CardHeader>
                <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <CardTitle>POPI-Toestemming</CardTitle>
                <CardDescription>
                  Ons neem jou privaatheid ernstig op
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Wapadrant Gemeente onderneem om lidmate se persoonlike
                  inligting omsigtig en vertroulik te stoor, te verwerk en te
                  hanteer. Ons voldoen aan die hantering van GKSA-Wes-Pretoria
                  inligting volgens die POPI-wetgewing van die Republiek van
                  Suid-Afrika.
                </p>
              </CardContent>
            </Card>
          </div>
        </Container>
      </section>
    </div>
  );
}
