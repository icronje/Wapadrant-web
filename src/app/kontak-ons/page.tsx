"use client";

import { useState } from "react";
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  Phone,
  MapPin,
  Clock,
  Mail,
  MessageSquare,
  Send,
  Printer,
  Smartphone,
} from "lucide-react";

export default function KontakOnsPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
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
          message,
          subject: "Kontak vorm",
          type: "general",
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || "Kon nie boodskap stuur nie. Probeer weer.");
      }

      toast.success("Dankie! Ons het jou boodskap ontvang en sal binnekort terugkom.");
      setName("");
      setEmail("");
      setMessage("");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Iets het verkeerd geloop.");
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
              Kontak Ons
            </h1>
            <p className="mt-5 text-lg text-muted-foreground">
              Ons wil graag van jou hoor. Skakel, WhatsApp of stuur vir ons ’n boodskap.
            </p>
          </div>
        </Container>
      </section>

      <section className="flex-1 py-12 sm:py-20">
        <Container className="space-y-16">
          {/* Contact details + form */}
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Contact details card */}
            <Card className="border-border/60 bg-card">
              <CardHeader>
                <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Phone className="h-5 w-5" />
                </div>
                <CardTitle>Kerkkantoor</CardTitle>
                <CardDescription>Ons is hier om te help</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start gap-3">
                    <Phone className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <div>
                      <span className="block font-medium text-foreground">Tel</span>
                      <a
                        href="tel:0129911395"
                        className="text-primary underline-offset-2 hover:underline"
                      >
                        012 991-1395
                      </a>
                      <span className="mx-1 text-muted-foreground">/</span>
                      <a
                        href="tel:0129915623"
                        className="text-primary underline-offset-2 hover:underline"
                      >
                        012 991-5623
                      </a>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Smartphone className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <div>
                      <span className="block font-medium text-foreground">WhatsApp</span>
                      <a
                        href="https://wa.me/27641810694"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary underline-offset-2 hover:underline"
                      >
                        064 181 0694
                      </a>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Printer className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <div>
                      <span className="block font-medium text-foreground">Faks</span>
                      <span className="text-muted-foreground">086 524 0495</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Mail className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <div>
                      <span className="block font-medium text-foreground">E-pos</span>
                      <a
                        href="mailto:kantoor@gkwapadrant.co.za"
                        className="text-primary underline-offset-2 hover:underline"
                      >
                        kantoor@gkwapadrant.co.za
                      </a>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <div>
                      <span className="block font-medium text-foreground">Posadres</span>
                      <span className="text-muted-foreground">
                        Posbus 1181, Garsfontein, 0042
                      </span>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Clock className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <div>
                      <span className="block font-medium text-foreground">Kantoorure</span>
                      <span className="text-muted-foreground">
                        Maandag tot Vrydag 08:00 – 15:00
                      </span>
                    </div>
                  </li>
                </ul>

                <div className="rounded-lg border border-dashed border-border bg-secondary/40 p-4 text-sm text-muted-foreground">
                  Skakel-inligting word binnekort voltooi sodat jy direk met ons
                  personeel kan verbinding maak.
                </div>
              </CardContent>
            </Card>

            {/* Contact form */}
            <Card className="border-border/60 bg-card">
              <CardHeader>
                <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <MessageSquare className="h-5 w-5" />
                </div>
                <CardTitle>Stuur vir ons ’n boodskap</CardTitle>
                <CardDescription>Ons antwoord so gou moontlik</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="contact-name">Naam</Label>
                    <Input
                      id="contact-name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Jou naam"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contact-email">E-pos</Label>
                    <Input
                      id="contact-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="jou@email.com"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contact-message">Boodskap</Label>
                    <Textarea
                      id="contact-message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Waaroor wil jy met ons gesels?"
                      required
                      minLength={5}
                      rows={4}
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full sm:w-auto"
                    disabled={loading}>
                    <span className="gap-2">
                      
                        <Send className="h-4 w-4" />
                        {loading ? "Stuur..." : "Stuur boodskap"}
                      
                    </span>
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Address + map */}
          <div className="grid gap-8 lg:grid-cols-2">
            <Card className="border-border/60 bg-card">
              <CardHeader>
                <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <MapPin className="h-5 w-5" />
                </div>
                <CardTitle>Sunriseweg 3, Olympus</CardTitle>
                <CardDescription>
                  GPS: 25° 48' 10" S, 28° 19' 34" E
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Ons kerkgebou en terrein is in Olympus, Pretoria. Jy is altyd
                  welkom om ons te kom besoek.
                </p>
                <p className="text-sm text-muted-foreground">
                  Fasiliteitsbesonderhede en foto&apos;s van ons terrein sal binnekort
                  hier bygevoeg word.
                </p>
                <Button
                  variant="outline"><Link href="https://maps.google.com/?q=Sunrise+Road+3,+Olympus,+Pretoria"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="gap-2"
                    >
                      <MapPin className="h-4 w-4" />
                      Kry aanwysings
                    </Link></Button>
              </CardContent>
            </Card>

            <Card className="overflow-hidden border-border/60 bg-card p-0">
              <div className="relative aspect-[4/3] w-full bg-muted lg:aspect-auto lg:h-full lg:min-h-[18rem]">
                <iframe
                  src="https://www.google.com/maps?q=Sunrise+Road+3,+Olympus,+Pretoria,+South+Africa&output=embed"
                  className="absolute inset-0 h-full w-full border-0"
                  title="Wapadrant Gemeente Kaart"
                  loading="lazy"
                  allowFullScreen
                />
              </div>
            </Card>
          </div>
        </Container>
      </section>
    </div>
  );
}
