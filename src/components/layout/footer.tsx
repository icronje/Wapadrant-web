import Link from "next/link";
import { MapPin, Clock } from "lucide-react";
import { Container } from "./container";
import { Separator } from "@/components/ui/separator";

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

const quickLinks = [
  { label: "Tuis", href: "/" },
  { label: "Kontak Ons", href: "/kontak-ons" },
  { label: "Foto Albums", href: "/foto-albums" },
  { label: "Argief", href: "/argief" },
];

const socialLinks = [
  {
    label: "Facebook",
    href: "https://www.facebook.com/gkwapadrant",
    icon: FacebookIcon,
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com/channel/UCb3hrnMcAH836mloVeZC2g",
    icon: YoutubeIcon,
  },
];

export function Footer() {
  return (
    <footer className="w-full border-t bg-secondary/40">
      <Container>
        <div className="grid gap-10 py-12 md:grid-cols-3">
          {/* Brand & contact */}
          <div className="space-y-4">
            <Link href="/" className="inline-block">
              <span className="font-heading text-2xl font-bold tracking-tight text-primary">
                WAPADRANT
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Saam op God se pad. 'n Warm gemeenskap waar elkeen welkom is om te groei,
              te dien en liefde te deel.
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span>Sunriseweg 3, Olympus, Pretoria</span>
              </li>
              <li className="flex items-start gap-2">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <div className="flex flex-col">
                  <span>Kontemporêre Erediens: 08:30</span>
                  <span>Jeuggroepe: 09:30</span>
                  <span>Klassieke Erediens: 10:00</span>
                </div>
              </li>
            </ul>
          </div>

          {/* Quick links */}
          <div className="space-y-4">
            <h3 className="font-heading text-sm font-semibold uppercase tracking-wider text-foreground">
              Vinnige skakels
            </h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Socials */}
          <div className="space-y-4">
            <h3 className="font-heading text-sm font-semibold uppercase tracking-wider text-foreground">
              Volg ons
            </h3>
            <p className="text-sm text-muted-foreground">
              Bly op hoogte van wat by Wapadrant aan die gang is.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                    aria-label={social.label}
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        <Separator />

        <div className="flex flex-col items-center justify-between gap-2 py-6 text-center sm:flex-row sm:text-left">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Wapadrant Gemeente. Alle regte voorbehou.
          </p>
          <p className="text-xs text-muted-foreground">
            Ons maak impak vir ons Koning.
          </p>
        </div>
      </Container>
    </footer>
  );
}
