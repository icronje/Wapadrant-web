import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { join } from "path";

const headerPath = join(__dirname, "../../src/components/layout/header.tsx");
const source = readFileSync(headerPath, "utf-8");

describe("Issue #15 Task 1: Change Tuis menu to Bespreek Helene Kaartjie", () => {
  it("navLinks must NOT contain 'Tuis' as a label", () => {
    expect(source).not.toContain('"Tuis"');
  });

  it("navLinks must contain 'Bespreek Helene Kaartjie' as a label", () => {
    expect(source).toContain('"Bespreek Helene Kaartjie"');
  });

  it("Bespreek Helene Kaartjie link must point to gebeurtenisse/helene-bester-konsert-2026", () => {
    expect(source).toContain(
      'gebeurtenisse/helene-bester-konsert-2026'
    );
  });

  it("Bespreek Helene Kaartjie must be in the main navLinks array (not meerLinks)", () => {
    // Extract the navLinks array content
    const navLinksMatch = source.match(
      /const navLinks(?:: NavLink\[\])? = \[([\s\S]*?)\];/
    );
    expect(navLinksMatch).not.toBeNull();
    if (navLinksMatch) {
      expect(navLinksMatch[1]).toContain("Bespreek Helene Kaartjie");
    }
  });
});
