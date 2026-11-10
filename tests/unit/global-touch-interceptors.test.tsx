import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";

describe("Issue #11: No global touch event interceptors that cancel navigation", () => {
  it("source code must not contain document/window addEventListener for touchstart, touchend, or touchmove", () => {
    const srcDir = path.resolve(__dirname, "../../src");

    function scanDir(dir: string): string[] {
      const results: string[] = [];
      for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          results.push(...scanDir(fullPath));
        } else if (entry.name.endsWith(".tsx") || entry.name.endsWith(".ts")) {
          const content = fs.readFileSync(fullPath, "utf-8");
          // Match: document.addEventListener("touch... or window.addEventListener("touch...
          const touchRegex = /(?:document|window)\.addEventListener\s*\(\s*["\x27]touch(?:start|end|move|cancel)/i;
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

  it("source code must not contain document/window addEventListener for pointerdown that calls preventDefault", () => {
    const srcDir = path.resolve(__dirname, "../../src");

    function scanDir(dir: string): string[] {
      const results: string[] = [];
      for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          results.push(...scanDir(fullPath));
        } else if (entry.name.endsWith(".tsx") || entry.name.endsWith(".ts")) {
          const content = fs.readFileSync(fullPath, "utf-8");
          // Match: document/window addEventListener("pointerdown" ... preventDefault
          const pointerRegex = /(?:document|window)\.addEventListener\s*\(\s*["\x27]pointerdown/i;
          if (pointerRegex.test(content) && content.includes("preventDefault")) {
            results.push(fullPath);
          }
        }
      }
      return results;
    }

    const offenders = scanDir(srcDir);
    expect(offenders).toEqual([]);
  });

  it("all addEventListener calls must be for non-touch events (keydown, scroll only)", () => {
    const srcDir = path.resolve(__dirname, "../../src");

    const allowedEvents = ["keydown", "scroll", "resize", "click"];
    const offenders: string[] = [];

    function scanDir(dir: string) {
      for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          scanDir(fullPath);
        } else if (entry.name.endsWith(".tsx") || entry.name.endsWith(".ts")) {
          const content = fs.readFileSync(fullPath, "utf-8");
          // Find all addEventListener calls
          const regex = /(?:document|window)\.addEventListener\s*\(\s*["\x27]([^"\x27]+)["\x27]/gi;
          let match;
          while ((match = regex.exec(content)) !== null) {
            const eventName = match[1].toLowerCase();
            if (!allowedEvents.includes(eventName)) {
              offenders.push(`${fullPath}: ${eventName}`);
            }
          }
        }
      }
    }

    scanDir(srcDir);
    expect(offenders).toEqual([]);
  });

  it("header scroll listener must be passive (not blocking touch scrolling)", () => {
    const srcPath = path.resolve(__dirname, "../../src/components/layout/header.tsx");
    const content = fs.readFileSync(srcPath, "utf-8");

    // The scroll listener should have { passive: true }
    expect(content).toContain("addEventListener");
    expect(content).toContain("passive: true");
  });

  it("photo-lightbox keydown listener must not affect touch/navigation", () => {
    const srcPath = path.resolve(__dirname, "../../src/app/foto-albums/[id]/photo-lightbox.tsx");
    const content = fs.readFileSync(srcPath, "utf-8");

    // The only addEventListener should be for keydown
    expect(content).toContain('addEventListener("keydown"');

    // Must NOT have touch event listeners
    const touchRegex = /addEventListener\s*\(\s*["\x27]touch/i;
    expect(touchRegex.test(content)).toBe(false);
  });
});
