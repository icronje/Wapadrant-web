import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";

describe("Issue #13: Event detail graphic — clipped rounded corners", () => {
  it("image container must use overflow-hidden (not overflow-scroll) to clip to rounded corners", () => {
    const pagePath = path.resolve(__dirname, "../../src/app/gebeurtenisse/[id]/page.tsx");
    const content = fs.readFileSync(pagePath, "utf-8");
    
    // Find the image container div
    const containerMatch = content.match(/<div className="([^"]*rounded-2xl[^"]*)">/);
    expect(containerMatch).toBeTruthy();
    
    const containerClass = containerMatch![1];
    expect(containerClass).toContain("overflow-hidden");
    expect(containerClass).not.toContain("overflow-scroll");
  });

  it("image container must have rounded-2xl for rounded corners", () => {
    const pagePath = path.resolve(__dirname, "../../src/app/gebeurtenisse/[id]/page.tsx");
    const content = fs.readFileSync(pagePath, "utf-8");
    
    const containerMatch = content.match(/<div className="([^"]*rounded-2xl[^"]*)">/);
    expect(containerMatch).toBeTruthy();
  });
});
