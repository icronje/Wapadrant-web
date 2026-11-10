import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Header } from "@/components/layout/header";
import fs from "fs";
import path from "path";

// Test 1: Source code scan — no <a> or <Link> with onClick that calls preventDefault
describe("Issue #11: Links must not cancel native navigation on mobile", () => {
  it("source code must not have preventDefault in onClick handlers on Link or <a> elements", () => {
    const srcDir = path.resolve(__dirname, "../../src");

    function scanDir(dir: string): string[] {
      const results: string[] = [];
      for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          results.push(...scanDir(fullPath));
        } else if (entry.name.endsWith(".tsx")) {
          const content = fs.readFileSync(fullPath, "utf-8");
          // Look for patterns where onClick on a Link or <a> tag calls preventDefault
          // Pattern: onClick={...preventDefault...} near <Link or <a
          const lines = content.split("\n");
          for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            // Check if this line has a Link or <a tag
            if ((line.includes("<Link") || line.includes("<a ")) && !line.includes("admin")) {
              // Look at this line and next 5 lines for onClick with preventDefault
              const context = lines.slice(i, i + 6).join("\n");
              if (context.includes("onClick") && context.includes("preventDefault")) {
                results.push(`${fullPath}:${i + 1}`);
              }
            }
            // Also check: onClick handler that has preventDefault, is it on a Link?
            if (line.includes("onClick") && line.includes("preventDefault")) {
              // Look backwards for <Link or <a
              const prevContext = lines.slice(Math.max(0, i - 5), i + 1).join("\n");
              if (prevContext.includes("<Link") || prevContext.includes("<a ")) {
                results.push(`${fullPath}:${i + 1}`);
              }
            }
          }
        }
      }
      return results;
    }

    const offenders = scanDir(srcDir);
    expect(offenders).toEqual([]);
  });

  it("header nav link onClick handlers must NOT call preventDefault", () => {
    render(<Header />);
    // Open mobile menu
    fireEvent.click(screen.getByLabelText("Maak navigasie oop"));

    // Get all nav links in the mobile menu
    const navLinks = screen.getAllByRole("link");
    expect(navLinks.length).toBeGreaterThan(0);

    // Click each link — none should prevent the click event
    navLinks.forEach(link => {
      const clickResult = fireEvent.click(link);
      expect(clickResult).toBeTruthy(); // click was NOT prevented
    });
  });

  it("header nav link onClick handlers must only close the mobile menu, not block navigation", () => {
    const { container } = render(<Header />);
    fireEvent.click(screen.getByLabelText("Maak navigasie oop"));

    // Verify mobile menu is open
    expect(screen.getByLabelText("Maak navigasie toe")).toBeTruthy();

    // Click the first nav link (Tuis)
    const tuisLink = screen.getAllByRole("link").find(l => l.textContent === "Tuis");
    expect(tuisLink).toBeTruthy();

    // The click should go through (not prevented)
    const clickResult = fireEvent.click(tuisLink!);
    expect(clickResult).toBeTruthy();

    // The href should still be present (navigation not cancelled)
    expect(tuisLink!.getAttribute("href")).toBe("/");
  });

  it("kontak-ons form submit preventDefault must NOT affect link navigation", () => {
    const srcPath = path.resolve(__dirname, "../../src/app/kontak-ons/page.tsx");
    const content = fs.readFileSync(srcPath, "utf-8");

    // The preventDefault should be in a form submit handler, not on a link
    // Check that preventDefault is in handleSubmit or form onSubmit context
    const preventDefaultLines = content.split("\n").filter(l => l.includes("preventDefault"));
    expect(preventDefaultLines.length).toBeGreaterThan(0);

    // Verify it's in a form context, not a link context
    const hasFormSubmit = content.includes("handleSubmit") || content.includes("onSubmit");
    expect(hasFormSubmit).toBe(true);

    // Verify no <Link or <a with preventDefault
    const hasLinkWithPreventDefault = content.match(/<Link[^>]*onClick[^}]*preventDefault/s) ||
                                       content.match(/<a\s[^>]*onClick[^}]*preventDefault/s);
    expect(hasLinkWithPreventDefault).toBeFalsy();
  });

  it("dien-met-gawes form submit preventDefault must NOT affect link navigation", () => {
    const srcPath = path.resolve(__dirname, "../../src/app/dien-met-gawes/page.tsx");
    const content = fs.readFileSync(srcPath, "utf-8");

    const preventDefaultLines = content.split("\n").filter(l => l.includes("preventDefault"));
    expect(preventDefaultLines.length).toBeGreaterThan(0);

    // Verify it's in a form context, not a link context
    const hasFormSubmit = content.includes("handleSubmit") || content.includes("onSubmit");
    expect(hasFormSubmit).toBe(true);

    // Verify no <Link or <a with preventDefault
    const hasLinkWithPreventDefault = content.match(/<Link[^>]*onClick[^}]*preventDefault/s) ||
                                       content.match(/<a\s[^>]*onClick[^}]*preventDefault/s);
    expect(hasLinkWithPreventDefault).toBeFalsy();
  });

  it("photo-lightbox stopPropagation must NOT be on <a> or <Link> elements", () => {
    const srcPath = path.resolve(__dirname, "../../src/app/foto-albums/[id]/photo-lightbox.tsx");
    const content = fs.readFileSync(srcPath, "utf-8");

    // stopPropagation is used on overlay divs to prevent closing when clicking inside
    // Verify it's NOT on <a> or <Link> elements
    const hasLinkWithStopPropagation = content.match(/<Link[^>]*onClick[^}]*stopPropagation/s) ||
                                       content.match(/<a\s[^>]*onClick[^}]*stopPropagation/s);
    expect(hasLinkWithStopPropagation).toBeFalsy();
  });
});
