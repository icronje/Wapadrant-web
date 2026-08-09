"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Menu, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Container } from "./container";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navLinks = [
  { label: "Tuis", href: "/" },
  { label: "Neem Kennis", href: "/neem-kennis" },
  { label: "Eredienste", href: "/eredienste" },
  { label: "Ontdek Jou Plek", href: "/ontdek-jou-plek" },
  { label: "Dien Met Gawes", href: "/dien-met-gawes" },
  {
    label: "Meer",
    href: "/meer",
    children: [
      { label: "Kontak Ons", href: "/kontak-ons" },
      { label: "Foto Albums", href: "/foto-albums" },
      { label: "Gebeurtenisse", href: "/gebeurtenisse" },
      { label: "Argief", href: "/argief" },
    ],
  },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
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
          <Link href="/" className="flex items-center gap-2 focus:outline-none">
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
            {navLinks.map((link) =>
              link.children ? (
                <DropdownMenu key={link.label}>
                  <DropdownMenuTrigger
                    render={
                      <Button
                        variant="ghost"
                        className="flex items-center gap-1 font-medium text-foreground/90 hover:text-primary"
                      >
                        {link.label}
                        <ChevronDown className="h-4 w-4 opacity-70" />
                      </Button>
                    }
                  />
                  <DropdownMenuContent align="start" className="min-w-[12rem]">
                    {link.children.map((child) => (
                      <DropdownMenuItem key={child.label} render={<Link href={child.href}>{child.label}</Link>} />
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button
                  key={link.label}
                  variant="ghost"
                  render={<Link href={link.href} className="font-medium text-foreground/90 hover:text-primary">{link.label}</Link>}
                />
              )
            )}
          </nav>

          {/* Mobile hamburger */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              className="lg:hidden"
              render={
                <Button variant="ghost" size="icon" aria-label="Maak navigasie oop">
                  <Menu className="h-6 w-6" />
                </Button>
              }
            />
            <SheetContent side="right" className="w-full max-w-xs bg-background p-0">
              <SheetTitle className="sr-only">Navigasie</SheetTitle>
              <div className="flex h-full flex-col">
                <div className="flex h-16 items-center justify-between border-b px-6">
                  <Image
                    src="/wapadrant-logo.jpg"
                    alt="Wapadrant Gemeente"
                    width={140}
                    height={46}
                    className="h-[46px] w-auto object-contain"
                    priority
                  />
                </div>
                <nav className="flex flex-1 flex-col gap-1 overflow-auto p-6">
                  {navLinks.map((link) =>
                    link.children ? (
                      <div key={link.label} className="flex flex-col gap-1 py-2">
                        <span className="px-3 py-2 font-heading font-semibold text-foreground">
                          {link.label}
                        </span>
                        {link.children.map((child) => (
                          <Button
                            key={child.label}
                            variant="ghost"
                            render={
                              <Link
                                href={child.href}
                                className="justify-start pl-6 text-muted-foreground hover:text-primary"
                                onClick={() => setOpen(false)}
                              >
                                {child.label}
                              </Link>
                            }
                          />
                        ))}
                      </div>
                    ) : (
                      <Button
                        key={link.label}
                        variant="ghost"
                        render={
                          <Link
                            href={link.href}
                            className="justify-start text-foreground/90 hover:text-primary"
                            onClick={() => setOpen(false)}
                          >
                            {link.label}
                          </Link>
                        }
                      />
                    )
                  )}
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </Container>
    </header>
  );
}
