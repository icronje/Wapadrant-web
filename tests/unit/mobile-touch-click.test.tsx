import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { TicketCheckout } from "@/components/events/ticket-checkout";
import { Header } from "@/components/layout/header";
import type { Event } from "@/types/events";

vi.mock("next-auth/react", () => ({
  SessionProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));
vi.mock("next/image", () => ({
  default: ({ src, alt, className }: { src: string; alt: string; className?: string }) => (
    <img src={src} alt={alt} className={className} />
  ),
}));
vi.mock("next/link", () => ({
  default: ({ href, children, onClick, className }: { href: string; children: React.ReactNode; onClick?: Function; className?: string }) => (
    <a href={href} onClick={onClick as any} className={className}>{children}</a>
  ),
}));

const mockEvent: Event = {
  id: "helene-bester-konser-2026",
  title: "Kers & Fees met Helene Bester",
  description: "Spesiale konsert",
  date: "2026-12-12T19:00:00.000Z",
  endDate: null,
  location: "Wapadrant Gemeente",
  imageUrl: "/images/helene-bester-3.jpeg",
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
  ticketTypes: [
    { id: "tt1", name: "Adults", price: 250, quantity: 100, sold: 0, eventId: "e1" },
  ],
};

describe("Issue #11: Mobile touch/click event handling", () => {

  describe("Header hamburger menu", () => {
    it("should open mobile menu on click event", () => {
      render(<Header />);
      const hamburger = screen.getByLabelText("Maak navigasie oop");
      fireEvent.click(hamburger);
      expect(screen.getByLabelText("Maak navigasie toe")).toBeTruthy();
    });

    it("hamburger button MUST have touch-manipulation class for mobile responsiveness", () => {
      const { container } = render(<Header />);
      const hamburger = container.querySelector('button[aria-label="Maak navigasie oop"]');
      expect(hamburger).toBeTruthy();
      const cls = typeof hamburger!.className === "string" ? hamburger!.className : (hamburger! as SVGElement).className?.baseVal || "";
      expect(cls).toContain("touch-manipulation");
    });

    it("mobile nav links MUST have touch-manipulation class", () => {
      const { container } = render(<Header />);
      fireEvent.click(screen.getByLabelText("Maak navigasie oop"));
      const navLinks = container.querySelectorAll("nav a[href]");
      expect(navLinks.length).toBeGreaterThan(0);
      navLinks.forEach(link => {
        const cls = typeof link.className === "string" ? link.className : (link as SVGElement).className?.baseVal || "";
        expect(cls).toContain("touch-manipulation");
      });
    });
  });

  describe("TicketCheckout Bespreek nou button", () => {
    it("should open dialog on click event", () => {
      render(
        <TicketCheckout event={mockEvent}>
          <button>Bespreek nou</button>
        </TicketCheckout>
      );
      fireEvent.click(screen.getByText("Bespreek nou"));
      expect(screen.getByText(/Kaartjies Bespreek/)).toBeTruthy();
    });

    it("should open dialog on touchstart + synthesized click (mobile pattern)", () => {
      render(
        <TicketCheckout event={mockEvent}>
          <button>Bespreek nou</button>
        </TicketCheckout>
      );
      const btn = screen.getByText("Bespreek nou");
      fireEvent.touchStart(btn);
      fireEvent.click(btn);
      expect(screen.getByText(/Kaartjies Bespreek/)).toBeTruthy();
    });
  });

  describe("No preventDefault blocking native navigation on mobile", () => {
    it("header nav links should not call preventDefault on click", () => {
      render(<Header />);
      fireEvent.click(screen.getByLabelText("Maak navigasie oop"));
      const navLinks = screen.getAllByRole("link");
      const tuisLink = navLinks.find(l => l.textContent === "Tuis");
      expect(tuisLink).toBeTruthy();
      const clickResult = fireEvent.click(tuisLink!);
      expect(clickResult).toBeTruthy();
    });
  });

  describe("No global touch event interceptors", () => {
    it("source code must not contain addEventListener for touch events on document or window", () => {
      const fs = require("fs");
      const path = require("path");
      const srcDir = path.resolve(__dirname, "../../src");

      function scanDir(dir: string): string[] {
        const results: string[] = [];
        for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
          const fullPath = path.join(dir, entry.name);
          if (entry.isDirectory()) {
            results.push(...scanDir(fullPath));
          } else if (entry.name.endsWith(".ts") || entry.name.endsWith(".tsx")) {
            const content = fs.readFileSync(fullPath, "utf-8");
            const touchRegex = /(?:document|window)\.addEventListener\s*\(\s*["\x27]touch/i;
            if (touchRegex.test(content)) {
              results.push(fullPath);
            }
          }
        }
        return results;
      }

      const offenders = scanDir(srcDir);
      expect(offenders).toEqual([]);
    });
  });
});
