import { Container } from "@/components/layout/container";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Compass, Users, Map, HelpCircle, Church } from "lucide-react";

export const metadata = {
  title: "Ontdek Jou Plek | Wapadrant Gemeente",
  description:
    "Herontdek jou doel en waarde in ons familie. Ontdek jou gawes, talente en plek by Wapadrant Gemeente.",
};

const questions = [
  "Watter kroone wag in die hemel – goud of strooi?",
  "Die son wat stilstaan in Josua 10 – hoe verstaan ons dit?",
  "Waar kom doop vandaan en wat beteken dit?",
  "Wat beteken dit om beeldraers van God te wees?",
  "Hoe verander God ons van binne?",
  "Hoekom verskil Bybelvertalings van mekaar?",
  "Kan ons met God onderhandel?",
  "Hoe gebruik ons God se naam reg?",
];

export default function OntdekJouPlekPage() {
  return (
    <div className="flex flex-1 flex-col">
      {/* Hero */}
      <section className="bg-church-pattern py-16 sm:py-24">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="font-heading text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              Ontdek Jou Plek
            </h1>
            <p className="mt-5 text-lg text-muted-foreground">
              Herontdek opnuut jou doel en waarde in ons familie. Ons is
              elkeen uniek gemaak met spesifieke gawes en talente. God se stem
              hoor ons die beste op die plek waar ons ons gawes en talente aan
              Hom kan wend.
            </p>
          </div>
        </Container>
      </section>

      <section className="flex-1 py-12 sm:py-20">
        <Container className="space-y-16">
          {/* Toerusting / Q&A */}
          <div>
            <div className="mb-8 flex items-center gap-3">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <HelpCircle className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-heading text-2xl font-bold text-foreground">
                  Toerusting
                </h2>
                <p className="text-sm text-muted-foreground">
                  Vrae wat ons help om ons geloof te laat groei
                </p>
              </div>
            </div>

            <Card className="border-border/60 bg-card">
              <CardHeader>
                <CardTitle className="font-heading text-lg">
                  Gereelde vrae wat ons geloof verdiep
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="grid gap-3 sm:grid-cols-2">
                  {questions.map((question, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-3 rounded-lg border border-border/60 bg-secondary/40 p-3 text-sm text-foreground"
                    >
                      <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                        {index + 1}
                      </span>
                      {question}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Cards row */}
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="border-border/60 bg-card">
              <CardHeader>
                <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Compass className="h-5 w-5" />
                </div>
                <CardTitle>Stadboueropleiding</CardTitle>
                <CardDescription>Jou toeruitingspad</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Stadboueropleiding is ’n praktiese kursus wat jou help om jou
                  plek in die gemeente te verstaan, jou gawes te ontwikkel en
                  om te sien waar jy kan dien.
                </p>
                <div className="mt-4 rounded-lg border border-dashed border-border bg-secondary/40 p-4 text-center text-sm text-muted-foreground">
                  Besonderhede oor die volgende kursus volg binnekort.
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/60 bg-card">
              <CardHeader>
                <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Users className="h-5 w-5" />
                </div>
                <CardTitle>Kleingroepe</CardTitle>
                <CardDescription>Saam groei in geloof</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Ons kleingroepe is die hart van ons gemeente. Dis waar ons
                  mekaar leer ken, saam bid, saam bybellees en saam deur die
                  lewe stap.
                </p>
                <div className="mt-4 rounded-lg border border-dashed border-border bg-secondary/40 p-4 text-center text-sm text-muted-foreground">
                  ’n Lys van beskikbare groepe word binnekort bygevoeg.
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/60 bg-card">
              <CardHeader>
                <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Map className="h-5 w-5" />
                </div>
                <CardTitle>Geestelike Paaie</CardTitle>
                <CardDescription>Stap saam op God se pad</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Elkeen van ons is op ’n reis. Hier deel ons hulpmiddels,
                  bybelstudies en getuienisse wat ons nader aan God en mekaar
                  bring.
                </p>
                <div className="mt-4 rounded-lg border border-dashed border-border bg-secondary/40 p-4 text-center text-sm text-muted-foreground">
                  Materiaal word binnekort beskikbaar gestel.
                </div>
              </CardContent>
            </Card>
          </div>

          {/* CTA */}
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="py-8">
              <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
                <div className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Church className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <p className="font-heading text-lg font-semibold text-foreground">
                    Is jy nog op soek na jou plek?
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Praat met ons leierspan of dien met jou gawes. Ons help jou
                    graag om te sien waar jy pas.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Container>
      </section>
    </div>
  );
}
