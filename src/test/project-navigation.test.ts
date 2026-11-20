import { describe, expect, it } from "vitest";
import { findProject, projects, projectSlug } from "../lib/content";

describe("project navigation", () => {
  it("resolves each project's unique card destination", () => {
    expect(new Set(projects.map(projectSlug)).size).toBe(projects.length);
    for (const project of projects) expect(findProject(projectSlug(project))).toBe(project);
    expect(projectSlug({ title: "Noor Al Rida" })).toBe("noor-al-rida");
  });
  it("does not resolve an unknown project", () => {
    expect(findProject("not-a-project")).toBeUndefined();
  });
});
