import { Container } from "@/components/layout/container";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Camera, Images } from "lucide-react";

export const metadata = {
  title: "Foto Albums | Wapadrant Gemeente",
  description:
    "Blaai deur foto’s van geleenthede, dienste en gemeenskap by Wapadrant Gemeente.",
};

export default function FotoAlbumsPage() {
  return (
    <div className="flex flex-1 flex-col">
      <section className="bg-church-pattern py-16 sm:py-24">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="font-heading text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              Foto Albums
            </h1>
            <p className="mt-5 text-lg text-muted-foreground">
              Foto’s wat herinneringe van ons familie vasvang.
            </p>
          </div>
        </Container>
      </section>

      <section className="flex-1 py-12 sm:py-20">
        <Container>
          <Card className="mx-auto max-w-2xl border-border/60 bg-card">
            <CardHeader>
              <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Camera className="h-5 w-5" />
              </div>
              <CardTitle>Albums op pad</CardTitle>
              <CardDescription>
                Ons is besig om foto’s bymekaar te maak
              </CardDescription>
            </CardHeader>
            <CardContent className="py-8">
              <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-secondary/40 p-8 text-center">
                <Images className="mb-3 h-12 w-12 text-muted-foreground/60" />
                <p className="font-heading text-lg font-semibold text-foreground">
                  Tans geen albums om te vertoon nie.
                </p>
                <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                  Kom binnekort terug – daar is altyd iets om te vier in ons
                  familie.
                </p>
              </div>
            </CardContent>
          </Card>
        </Container>
      </section>
    </div>
  );
}
