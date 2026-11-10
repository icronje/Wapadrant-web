import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TicketCheckout } from "@/components/events/ticket-checkout";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
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
  isPublished: true,
  ticketTypes: [
    { id: "tt1", name: "Adults", price: 250, quantity: 100, sold: 0, eventId: "e1" },
  ],
};

// Token-based check: splits className into tokens and checks for direct pointer-events-none
// Excludes disabled:, data-disabled:, and [&...]: prefixed tokens (those target specific states/children)
function hasDirectPointerEventsNone(cls: string): boolean {
  const tokens = cls.split(/\s+/);
  return tokens.some(token => {
    if (token === "pointer-events-none") return true;
    // Skip disabled: and data-disabled: prefixed (only apply in specific states)
    if (token.startsWith("disabled:") || token.startsWith("data-disabled:")) return false;
    // Skip [&...]: prefixed (CSS selector targeting children)
    if (token.startsWith("[&")) return false;
    return token.includes("pointer-events-none");
  });
}

describe("Issue #11: Mobile touch screen verification", () => {

  describe("Hamburger menu — touch verification", () => {
    it("should open when touched via userEvent.pointer (simulates real mobile touch)", async () => {
      const user = userEvent.setup();
      render(<Header />);
      const hamburger = screen.getByLabelText("Maak navigasie oop");
      
      await user.pointer([
        { keys: "[TouchA>]", target: hamburger },
        { keys: "[/TouchA]" },
      ]);
      
      await waitFor(() => {
        expect(screen.getByLabelText("Maak navigasie toe")).toBeTruthy();
      });
    });

    it("hamburger button must have touch-manipulation to remove 300ms delay", () => {
      const { container } = render(<Header />);
      const hamburger = container.querySelector('button[aria-label="Maak navigasie oop"]');
      expect(hamburger).toBeTruthy();
      const cls = typeof hamburger!.className === "string" ? hamburger!.className : (hamburger! as SVGElement).className?.baseVal || "";
      expect(cls).toContain("touch-manipulation");
    });

    it("hamburger button must NOT have pointer-events-none (when not disabled)", () => {
      const { container } = render(<Header />);
      const hamburger = container.querySelector('button[aria-label="Maak navigasie oop"]');
      expect(hamburger).toBeTruthy();
      const cls = typeof hamburger!.className === "string" ? hamburger!.className : (hamburger! as SVGElement).className?.baseVal || "";
      expect(hasDirectPointerEventsNone(cls)).toBe(false);
    });
  });

  describe("Bespreek nou button — touch verification", () => {
    it("should open dialog when touched via userEvent.pointer (simulates real mobile touch)", async () => {
      const user = userEvent.setup();
      render(
        <TicketCheckout event={mockEvent}>
          <Button size="lg">Bespreek nou</Button>
        </TicketCheckout>
      );
      
      const btn = screen.getByText("Bespreek nou");
      
      await user.pointer([
        { keys: "[TouchA>]", target: btn },
        { keys: "[/TouchA]" },
      ]);
      
      await waitFor(() => {
        expect(screen.getByText(/Kaartjies Bespreek/)).toBeTruthy();
      });
    });

    it("should open dialog on fireEvent touchStart + click", () => {
      render(
        <TicketCheckout event={mockEvent}>
          <Button size="lg">Bespreek nou</Button>
        </TicketCheckout>
      );
      
      const btn = screen.getByText("Bespreek nou");
      fireEvent.touchStart(btn);
      fireEvent.click(btn);
      
      expect(screen.getByText(/Kaartjies Bespreek/)).toBeTruthy();
    });

    it("Bespreek nou button must NOT have pointer-events-none on itself (excluding child/disabled selectors)", () => {
      render(
        <TicketCheckout event={mockEvent}>
          <Button size="lg">Bespreek nou</Button>
        </TicketCheckout>
      );
      
      const btn = screen.getByText("Bespreek nou");
      const cls = typeof btn.className === "string" ? btn.className : (btn as SVGElement).className?.baseVal || "";
      expect(hasDirectPointerEventsNone(cls)).toBe(false);
    });

    it("Bespreek nou button must have touch-manipulation for mobile responsiveness", () => {
      render(
        <TicketCheckout event={mockEvent}>
          <Button size="lg">Bespreek nou</Button>
        </TicketCheckout>
      );
      
      const btn = screen.getByText("Bespreek nou");
      const cls = typeof btn.className === "string" ? btn.className : (btn as SVGElement).className?.baseVal || "";
      expect(cls).toContain("touch-manipulation");
    });

    it("hamburger button must NOT have select-none blocking touch", () => {
      const { container } = render(<Header />);
      const hamburger = container.querySelector('button[aria-label="Maak navigasie oop"]');
      expect(hamburger).toBeTruthy();
      const cls = typeof hamburger!.className === "string" ? hamburger!.className : (hamburger! as SVGElement).className?.baseVal || "";
      expect(cls).not.toContain("select-none");
    });
  });

  describe("No overlay elements blocking touch on mobile", () => {
    it("no fixed/absolute element with pointer-events should cover the hamburger area", () => {
      const { container } = render(<Header />);
      
      const fixedElements = container.querySelectorAll('[class*="fixed"]');
      fixedElements.forEach(el => {
        const cls = typeof el.className === "string" ? el.className : "";
        if (!cls.includes("z-[100]") && !cls.includes("pointer-events-none")) {
          if (cls.includes("inset-0")) {
            expect(cls).toContain("pointer-events-none");
          }
        }
      });
    });

    it("no overlay should block the Bespreek nou button area", () => {
      const { container } = render(
        <TicketCheckout event={mockEvent}>
          <Button size="lg">Bespreek nou</Button>
        </TicketCheckout>
      );
      
      const fixedElements = container.querySelectorAll('[class*="fixed"]');
      fixedElements.forEach(el => {
        const cls = typeof el.className === "string" ? el.className : "";
        if (cls.includes("inset-0") && !cls.includes("pointer-events-none")) {
          expect(cls).toContain("z-50");
        }
      });
    });
  });
});
