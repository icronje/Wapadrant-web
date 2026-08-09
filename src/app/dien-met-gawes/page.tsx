"use client";

import { useState } from "react";
import { Container } from "@/components/layout/container";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  Heart,
  HandHeart,
  Users,
  Baby,
  Sparkles,
  Send,
  HandHelping,
} from "lucide-react";

const ministries = [
  {
    title: "Uitreikbediening",
    description:
      "Romeine 15:2 leer ons dat elkeen van ons die naaste moet dink tot goed, tot geloofopbou. Ons familie reik met ander programme uit om diegene rondom ons te dien.",
    icon: HandHeart,
  },
  {
    title: "Diakonie",
    description:
      "Ons diakens bevorder meegevoel binne die familie en spoor ons aan om liefde teenoor mekaar te bewys. Dis ’n diens wat na die behoeftiges, weduwees, eensames, siekes en bejaardes omsien.",
    icon: HandHelping,
  },
  {
    title: "Projekte",
    description:
      "Daar is verskeie ander geleenthede om met jou gawes te dien. Van tuinwerk tot administrasie, van musiek tot gasvryheid – ons het plek vir jou hande en hart.",
    icon: Sparkles,
  },
  {
    title: "Jeug- en Gesinsbediening",
    description:
      "Ons lei ons kinders na geestelike volwassenheid deur ouderdoms-trekkerrelevante onderrig, kamp, uitstappies en gesinsondersteuning.",
    icon: Baby,
  },
];

export default function DienMetGawesPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [request, setRequest] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          message: request,
          subject: "Gebedsversoek",
          type: "prayer",
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(
          data.error || "Kon nie gebedsversoek indien nie. Probeer weer."
        );
      }

      toast.success("Jou gebedsversoek is ontvang. Ons bid saam met jou.");
      setName("");
      setEmail("");
      setRequest("");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Iets het verkeerd geloop."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-1 flex-col">
      {/* Hero */}
      <section className="bg-church-pattern py-16 sm:py-24">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="font-heading text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              Dien Met Gawes
            </h1>
            <p className="mt-5 text-lg text-muted-foreground">
              In ons familie gaan dit oor VERHOUDINGS – veral GROEI in
              verhoudings. Deur die Here se genade bedien ons mekaar, en God
              verander lewens. Ons groei in ons verhouding met God, mekaar en
              die wêreld.
            </p>
          </div>
        </Container>
      </section>

      <section className="flex-1 py-12 sm:py-20">
        <Container className="space-y-16">
          {/* Ministry cards */}
          <div className="grid gap-6 md:grid-cols-2">
            {ministries.map((ministry) => {
              const Icon = ministry.icon;
              return (
                <Card
                  key={ministry.title}
                  className="border-border/60 bg-card transition-all hover:-translate-y-1 hover:shadow-lg"
                >
                  <CardHeader>
                    <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Icon className="h-5 w-5" />
                    </div>
                    <CardTitle className="font-heading text-lg">
                      {ministry.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {ministry.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Prayer requests */}
          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="border-border/60 bg-card">
              <CardHeader>
                <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Heart className="h-5 w-5" />
                </div>
                <CardTitle>Gebedsversoeke</CardTitle>
                <CardDescription>Ons bid saam met jou</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Voel jy eensaam, moedeloos of magteloos? Jy hoef nie alleen te
                  staan nie. Ons bid elke Sondag om 08:00 in die Kapél.
                </p>
                <p className="text-sm text-muted-foreground">
                  Kontak{" "}
                  <span className="font-semibold text-foreground">Magda Prinsloo</span>{" "}
                  by{" "}
                  <a
                    href="tel:0824145688"
                    className="text-primary underline-offset-2 hover:underline"
                  >
                    082 414 5688
                  </a>
                  .
                </p>
              </CardContent>
            </Card>

            <Card className="border-border/60 bg-card">
              <CardHeader>
                <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Heart className="h-5 w-5" />
                </div>
                <CardTitle>Gebedsversoek vorm</CardTitle>
                <CardDescription>
                  Deel jou versoek vertroulik met ons
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="prayer-name">Naam</Label>
                    <Input
                      id="prayer-name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Jou naam"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="prayer-email">E-pos</Label>
                    <Input
                      id="prayer-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="jou@email.com"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="prayer-request">Versoek</Label>
                    <Textarea
                      id="prayer-request"
                      value={request}
                      onChange={(e) => setRequest(e.target.value)}
                      placeholder="Waaroor kan ons saam met jou bid?"
                      required
                      minLength={5}
                      rows={4}
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full sm:w-auto"
                    disabled={loading}
                    render={
                      <span className="gap-2">
                        <Send className="h-4 w-4" />
                        {loading ? "Stuur..." : "Stuur gebedsversoek"}
                      </span>
                    }
                  />
                </form>
              </CardContent>
            </Card>
          </div>

          {/* CTA */}
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="py-8">
              <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
                <div className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Users className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <p className="font-heading text-lg font-semibold text-foreground">
                    Wil jy deel word van ’n bedieningspan?
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Kontak ons gerus by die kerkkantoor of vul die vorm in – ons
                    sal jou help om die regte plek te vind.
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
