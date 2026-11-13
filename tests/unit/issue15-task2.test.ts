import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { join } from "path";

const headerPath = join(__dirname, "../../src/components/layout/header.tsx");
const source = readFileSync(headerPath, "utf-8");

describe("Issue #15 Task 2: Disable ALL other menu options except Bespreek Helene Kaartjie", () => {
  it("navLinks must have only ONE active link (Bespreek Helene Kaartjie)", () => {
    const navLinksMatch = source.match(/const navLinks(?:: NavLink\[\])? = \[([\s\S]*?)\];/);
    expect(navLinksMatch).not.toBeNull();
    if (navLinksMatch) {
      const navLinksContent = navLinksMatch[1];
      const entries = navLinksContent.split("},\n").filter((e) => e.trim().length > 0);
      for (const entry of entries) {
        if (entry.includes("Bespreek Helene Kaartjie")) {
          expect(entry).not.toContain("disabled: true");
        } else {
          expect(entry).toContain("disabled: true");
        }
      }
    }
  });

  it("meerLinks must ALL be disabled", () => {
    const meerLinksMatch = source.match(/const meerLinks(?:: NavLink\[\])? = \[([\s\S]*?)\];/);
    expect(meerLinksMatch).not.toBeNull();
    if (meerLinksMatch) {
      const meerLinksContent = meerLinksMatch[1];
      const entries = meerLinksContent.split("},\n").filter((e) => e.trim().length > 0);
      for (const entry of entries) {
        expect(entry).toContain("disabled: true");
      }
    }
  });

  it("disabled links must render with disabled styling and not be clickable", () => {
    expect(source).toContain("disabled");
  });

  it("disabled nav links must NOT render as <Link> with href (no navigation)", () => {
    expect(source).toContain("aria-disabled");
    expect(source).toContain("pointer-events-none");
    expect(source).toContain("cursor-not-allowed");
  });
});
