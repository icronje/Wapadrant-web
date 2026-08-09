import { Container } from "@/components/layout/container";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Archive, FileText } from "lucide-react";

export const metadata = {
  title: "Argief | Wapadrant Gemeente",
  description:
    "Geselsbriewe, nuusbriewe, getuienisse, kerkraadverklarings en meer uit Wapadrant se argief.",
};

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
              &apos;n Versameling vorige geselsbriewe, nuusbriewe, getuienisse en
              belangrike verklarings.
            </p>
          </div>
        </Container>
      </section>

      <section className="flex-1 py-12 sm:py-20">
        <Container>
          <div className="grid gap-6 md:grid-cols-2">
            {[
              "Geselsbrief / Nuusbriewe",
              "Openbare getuienis",
              "Kerkraadverklarings",
              "Gespreksforum 1 (2016) – Vroue in amp",
              "Gespreksforum 2 (2017) – Eenheid en diversiteit",
              "Gespreksforum 3 (2018) – Toekoms van GKSA",
              "Blitsgids",
            ].map((item) => (
              <Card
                key={item}
                className="border-border/60 bg-card transition-all hover:-translate-y-1 hover:shadow-lg"
              >
                <CardHeader>
                  <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <FileText className="h-5 w-5" />
                  </div>
                  <CardTitle className="font-heading text-base">{item}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="rounded-lg border border-dashed border-border bg-secondary/40 p-4 text-center text-sm text-muted-foreground">
                    Beskikbaar binnekort.
                  </div>
                </CardContent>
              </Card>
            ))}

            <Card className="border-border/60 bg-card md:col-span-2">
              <CardContent className="py-10">
                <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-secondary/40 p-8 text-center">
                  <Archive className="mb-3 h-12 w-12 text-muted-foreground/60" />
                  <p className="font-heading text-lg font-semibold text-foreground">
                    Argief word tans opgedateer.
                  </p>
                  <p className="mt-2 max-w-md text-sm text-muted-foreground">
                    Ons werk deur ons historiese dokumente om dit hier beskikbaar
                    te maak. Kom loer later weer.
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
