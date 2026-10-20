import { test, expect } from "@playwright/test";
import { readFileSync } from "node:fs";

test("heavy or AI-tell dependencies are gone", () => {
  const pkg = JSON.parse(readFileSync("package.json", "utf8"));
  const all = { ...pkg.dependencies, ...pkg.devDependencies };
  for (const name of ["three", "@react-three/fiber", "@react-three/drei", "@types/three", "motion", "lucide-react"]) {
    expect(all[name], name).toBeUndefined();
  }
});
