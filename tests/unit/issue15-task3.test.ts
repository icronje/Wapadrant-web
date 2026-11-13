import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { join } from "path";

const headerPath = join(__dirname, "../../src/components/layout/header.tsx");
const source = readFileSync(headerPath, "utf-8");

describe("Issue #15 Task 3: Add Webwerf menu option pointing to gkwapadrant.co.za", () => {
  it("navLinks must contain 'Webwerf' as a label", () => {
    expect(source).toContain('"Webwerf"');
  });

  it("Webwerf link must point to https://gkwapadrant.co.za", () => {
    expect(source).toContain("https://gkwapadrant.co.za");
  });

  it("Webwerf must be in the main navLinks array", () => {
    const navLinksMatch = source.match(/const navLinks(?:: NavLink\[\])? = \[([\s\S]*?)\];/);
    expect(navLinksMatch).not.toBeNull();
    if (navLinksMatch) {
      expect(navLinksMatch[1]).toContain("Webwerf");
      expect(navLinksMatch[1]).toContain("https://gkwapadrant.co.za");
    }
  });

  it("Webwerf must NOT be disabled (it's an active external link)", () => {
    const navLinksMatch = source.match(/const navLinks(?:: NavLink\[\])? = \[([\s\S]*?)\];/);
    expect(navLinksMatch).not.toBeNull();
    if (navLinksMatch) {
      const navLinksContent = navLinksMatch[1];
      const entries = navLinksContent.split("},\n").filter((e) => e.trim().length > 0);
      for (const entry of entries) {
        if (entry.includes("Webwerf")) {
          expect(entry).not.toContain("disabled: true");
        }
      }
    }
  });
});
