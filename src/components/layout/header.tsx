"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Container } from "./container";

const navLinks = [
  { label: "Tuis", href: "/" },
  { label: "Neem Kennis", href: "/neem-kennis" },
  { label: "Eredienste", href: "/eredienste" },
  { label: "Ontdek Jou Plek", href: "/ontdek-jou-plek" },
  { label: "Dien Met Gawes", href: "/dien-met-gawes" },
];

const meerLinks = [
  { label: "Kontak Ons", href: "/kontak-ons" },
  { label: "Foto Albums", href: "/foto-albums" },
  { label: "Gebeurtenisse", href: "/gebeurtenisse" },
  { label: "Argief", href: "/argief" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [meerOpen, setMeerOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll when mobile menu open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 w-full transition-all duration-300",
          scrolled
            ? "border-b border-border/60 bg-background/80 backdrop-blur-md shadow-sm"
            : "bg-background"
        )}
      >
        <Container>
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 shrink-0 focus:outline-none">
              <Image
                src="/wapadrant-logo.jpg"
                alt="Wapadrant Gemeente"
                width={180}
                height={60}
                className="h-[60px] w-auto object-contain"
                priority
              />
            </Link>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="px-3 py-2 text-sm font-medium text-foreground/90 hover:text-primary transition-colors"
                >
                  {link.label}
                </Link>
              ))}

              {/* Meer dropdown */}
              <div className="relative">
                <button
                  onClick={() => setMeerOpen(!meerOpen)}
                  className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-foreground/90 hover:text-primary transition-colors"
                >
                  Meer
                  <ChevronDown className={cn("h-4 w-4 transition-transform", meerOpen && "rotate-180")} />
                </button>
                {meerOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setMeerOpen(false)}
                    />
                    <div className="absolute right-0 top-full z-50 mt-1 min-w-[12rem] rounded-lg border bg-popover shadow-md py-1">
                      {meerLinks.map((child) => (
                        <Link
                          key={child.label}
                          href={child.href}
                          onClick={() => setMeerOpen(false)}
                          className="block px-4 py-2 text-sm text-foreground/90 hover:bg-accent hover:text-primary transition-colors"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </nav>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 -mr-2 text-foreground hover:text-primary transition-colors"
              aria-label="Maak navigasie oop"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </Container>
      </header>

      {/* Mobile menu overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          {/* Panel */}
          <div className="absolute right-0 top-0 h-full w-[280px] max-w-[85vw] bg-background shadow-xl flex flex-col">
            {/* Header */}
            <div className="flex h-16 items-center justify-between border-b px-4">
              <Image
                src="/wapadrant-logo.jpg"
                alt="Wapadrant Gemeente"
                width={120}
                height={40}
                className="h-[40px] w-auto object-contain"
              />
              <button
                onClick={() => setMobileOpen(false)}
                className="p-2 -mr-2 text-foreground hover:text-primary transition-colors"
                aria-label="Maak navigasie toe"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            {/* Nav links */}
            <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-4">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="px-4 py-3 text-base font-medium text-foreground/90 hover:bg-accent hover:text-primary rounded-md transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              <div className="my-2 border-t" />
              <div className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Meer
              </div>
              {meerLinks.map((child) => (
                <Link
                  key={child.label}
                  href={child.href}
                  onClick={() => setMobileOpen(false)}
                  className="px-4 py-3 text-base text-muted-foreground hover:bg-accent hover:text-primary rounded-md transition-colors"
                >
                  {child.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
