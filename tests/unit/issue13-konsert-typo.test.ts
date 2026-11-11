import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";

describe("Issue #13: Fix typo — konser → konsert", () => {
  it("source code must NOT contain 'helene-bester-konser-2026' (missing 't')", () => {
    const srcDir = path.resolve(__dirname, "../../src");
    
    function scanDir(dir: string): string[] {
      const results: string[] = [];
      for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          results.push(...scanDir(fullPath));
        } else if (entry.name.endsWith(".tsx") || entry.name.endsWith(".ts")) {
          const content = fs.readFileSync(fullPath, "utf-8");
          if (content.includes("helene-bester-konser-2026")) {
            results.push(fullPath);
          }
        }
      }
      return results;
    }

    const offenders = scanDir(srcDir);
    expect(offenders).toEqual([]);
  });

  it("source code must contain 'helene-bester-konsert-2026' (with 't')", () => {
    const pagePath = path.resolve(__dirname, "../../src/app/gebeurtenisse/[id]/page.tsx");
    const content = fs.readFileSync(pagePath, "utf-8");
    expect(content).toContain("helene-bester-konsert-2026");
  });
});
