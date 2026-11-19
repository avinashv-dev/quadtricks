import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight, Check, ChevronLeft, ChevronRight, ImageIcon, Code2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { findProject, projects, projectSlug, type Project } from "@/lib/content";

export const Route = createFileRoute("/projects/$slug")({
  beforeLoad: ({ params }) => {
    if (!findProject(params.slug)) throw notFound();
  },
  head: ({ params }) => {
    const project = findProject(params.slug);
    const title = project ? `${project.title} — Project by Quadtricks` : "Project not found — Quadtricks";
    const description = project?.text ?? "Explore projects by Quadtricks.";
    const image = project?.images[0];
    return { meta: [
      { title }, { name: "description", content: description },
      { property: "og:title", content: title }, { property: "og:description", content: description },
      { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
      ...(image?.startsWith("https://") ? [{ property: "og:image", content: image }, { name: "twitter:image", content: image }] : []),
    ] };
  },
  component: ProjectPage,
  notFoundComponent: ProjectNotFound,
});

function useWhiteDocumentTheme() {
  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("case-light");
    return () => root.classList.remove("case-light");
  }, []);
}

function ProjectNotFound() {
  useWhiteDocumentTheme();
  return <div className="case-light min-h-screen bg-background px-5 pb-24 pt-40 text-center"><h1 className="font-display text-2xl">Project not found</h1><Button asChild variant="outline" className="mt-6"><Link to="/" hash="work">Back to projects</Link></Button></div>;
}

function ProjectPage() {
  const { slug } = Route.useParams();
  const project = findProject(slug);
  useWhiteDocumentTheme();
  if (!project) return null;
  const next = projects[(projects.indexOf(project) + 1) % projects.length];
  const liveUrl = project.siteUrl?.startsWith("https://") ? project.siteUrl : undefined;
  const meta = [["Project type", project.type], ["Industry", project.industry ?? "Details pending"], ["Platform", project.platform ?? "Details pending"], ["Location", project.location ?? "Details pending"]];
  return (
    <div id="top" className="case-light min-h-screen bg-background">
      <section className="band-glow relative overflow-hidden bg-band-ink pb-10 pt-28 text-band-ink-foreground sm:pb-14 sm:pt-32">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 sm:px-6 lg:grid-cols-[1.25fr_0.75fr] lg:items-end">
          <div className="min-w-0">
            <Link to="/" hash="work" className="mb-6 flex w-fit items-center gap-2 text-sm text-band-ink-foreground/70 hover:text-band-ink-foreground"><ArrowLeft className="size-4" />All projects</Link>
            <p className="mb-3 inline-flex rounded-full border border-band-ink-foreground/20 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.14em] text-primary-glow">{project.type}</p>
            <div className="flex items-center gap-4">
              {project.icon && <img src={project.icon} alt="" className="size-14 shrink-0 rounded-xl bg-band-ink-foreground object-contain p-1 sm:size-16" />}
              <h1 className="font-display min-w-0 break-words text-4xl font-semibold leading-[0.95] tracking-[-0.04em] sm:text-5xl">{project.title}</h1>
            </div>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-band-ink-foreground/75 sm:text-lg">{project.text}</p>
            <div className="mt-6">
              {liveUrl ? <Button asChild size="lg" className="group relative overflow-hidden rounded-full shadow-lg shadow-primary/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/50 active:translate-y-0 active:scale-95"><a href={liveUrl} target="_blank" rel="noopener noreferrer"><span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full" aria-hidden />View site<ArrowUpRight className="transition-transform duration-300 group-hover:rotate-45 group-hover:scale-110" /></a></Button> : <><Button disabled size="lg" className="rounded-full">View site<ArrowUpRight /></Button><p className="mt-2 text-xs text-band-ink-foreground/60">Live project link not provided yet.</p></>}
            </div>
          </div>
          <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-band-ink-foreground/15 bg-band-ink-foreground/15 backdrop-blur">
            {meta.map(([label, value]) => <div key={label} className="min-w-0 bg-band-ink/85 p-4"><dt className="font-mono text-[10px] uppercase tracking-[0.1em] text-band-ink-foreground/55">{label}</dt><dd className="mt-1.5 break-words text-sm font-semibold">{value}</dd></div>)}
          </dl>
        </div>
      </section>

      <section aria-labelledby="overview-title" className="py-12 sm:py-16">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 sm:px-6 md:grid-cols-[1.5fr_1fr] md:gap-12">
          <div className="min-w-0"><SectionLabel n="01" text="Overview" /><h2 id="overview-title" className="font-display text-3xl font-semibold sm:text-4xl">Project Overview</h2><p className="mt-5 text-base leading-loose text-muted-foreground sm:text-lg">{project.overview ?? project.text}</p></div>
          <aside className="self-start rounded-2xl bg-band-peach p-6 shadow-sm"><span className="grid size-10 place-items-center rounded-xl bg-primary text-primary-foreground"><Check className="size-5" /></span><h3 className="mt-4 font-semibold">What we delivered</h3><p className="mt-2 text-sm leading-relaxed text-muted-foreground">{project.contribution ?? "The detailed scope of Quadtricks’ work is awaiting confirmation."}</p></aside>
        </div>
      </section>

      <section aria-labelledby="goals-title" className="border-y border-border bg-muted/25 py-12 sm:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <SectionLabel n="02" text="Goals" /><h2 id="goals-title" className="font-display text-3xl font-semibold sm:text-4xl">Client Goals</h2>
          {project.clientSuggestions && <p className="mt-5 max-w-4xl leading-relaxed text-muted-foreground">{project.clientSuggestions}</p>}
          <ul className="mt-8 grid gap-4 md:grid-cols-2">
            {(project.clientGoals?.length ? project.clientGoals : ["Client goals and requirements are awaiting confirmation."]).map((goal, i) => <li key={goal} className="flex items-start gap-4 rounded-2xl bg-background p-5 shadow-sm transition-transform hover:-translate-y-0.5"><span className="font-display text-3xl font-semibold text-primary/30">{String(i + 1).padStart(2, "0")}</span><span className="pt-1 text-sm leading-relaxed sm:text-base">{goal}</span></li>)}
          </ul>
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6"><SectionLabel n="03" text="Process" />
          <div className="mt-2 grid gap-5 md:grid-cols-2">
            <DetailSection title="Our Approach & Strategy" text={project.approach} points={project.strategyPoints} pending="Project-specific strategy and development decisions are awaiting confirmation." />
            <DetailSection title="Design & User Experience" text={project.designUx} points={project.designPoints} pending="Verified design decisions and user-experience details have not been provided yet." />
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-muted/20 py-12 sm:py-16"><div className="mx-auto max-w-6xl px-4 sm:px-6"><SectionLabel n="04" text="Showcase" /><ProjectGallery key={slug} project={project} /></div></section>

      <section aria-labelledby="technology-title" className="band-glow bg-band-ink py-12 text-band-ink-foreground sm:py-16">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 sm:px-6 md:grid-cols-[1fr_1.2fr] md:gap-12">
          <div><p className="mb-3 font-mono text-xs uppercase text-primary-glow">05 — Stack</p><h2 id="technology-title" className="font-display text-3xl font-semibold sm:text-4xl">Development Technology</h2><p className="mt-4 leading-relaxed text-band-ink-foreground/70">{project.technologies?.length ? "Technologies used in this project." : "The verified technology stack has not been provided yet."}</p></div>
          {project.technologies?.length ? <ul className="flex flex-wrap content-start gap-3">{project.technologies.map((tech) => <li key={tech} className="flex items-center gap-3 rounded-xl border border-band-ink-foreground/15 bg-band-ink-foreground/5 px-4 py-3 text-sm font-medium"><Code2 aria-hidden className="size-5 text-primary-glow" />{tech}</li>)}</ul> : <div className="flex items-center gap-3 self-center rounded-xl border border-dashed border-band-ink-foreground/25 p-5 text-sm text-band-ink-foreground/70"><Code2 aria-hidden className="size-6 text-primary-glow" />Technology details pending</div>}
        </div>
      </section>

      {next && <section className="py-8 sm:py-10"><div className="mx-auto flex max-w-6xl flex-col justify-between gap-6 rounded-2xl border border-band-ink-foreground/10 bg-band-ink px-6 py-7 text-band-ink-foreground sm:flex-row sm:items-center sm:px-8 mx-4 sm:mx-6 lg:mx-auto">
        <div><p className="text-sm text-band-ink-foreground/65">Have a similar idea?</p><Link to="/" hash="contact" className="font-display mt-1 inline-flex items-center gap-2 text-xl font-semibold">Discuss your project<ArrowUpRight /></Link></div>
        <Link to="/projects/$slug" params={{ slug: projectSlug(next) }} className="inline-flex max-w-full items-center gap-3 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground">Next: {next.title}<ArrowRight className="size-4 shrink-0" /></Link>
      </div></section>}
    </div>
  );
}

function SectionLabel({ n, text }: { n: string; text: string }) {
  return <p className="mb-3 font-mono text-xs uppercase text-primary">{n} — {text}</p>;
}

function DetailSection({ title, text, points, pending }: { title: string; text: string | undefined; points: string[] | undefined; pending: string }) {
  return <section className="min-w-0 rounded-2xl border border-border bg-background p-5 sm:p-6"><h2 className="font-display text-xl font-semibold tracking-[-0.02em] sm:text-2xl">{title}</h2>{(text || !points?.length) && <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">{text ?? pending}</p>}{Boolean(points?.length) && <ul className="mt-5 space-y-3">{points?.map((point) => <li key={point} className="flex gap-3 text-sm leading-relaxed sm:text-base"><span className="grid size-6 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground"><Check aria-hidden className="size-4" /></span>{point}</li>)}</ul>}</section>;
}

function ProjectGallery({ project }: { project: Project }) {
  const [selected, setSelected] = useState(0);
  const galleryImages = project.coverImage ? [project.coverImage] : project.images;
  const image = galleryImages[selected];
  const companion = project.coverImage ? undefined : galleryImages[(selected + 1) % galleryImages.length];
  return (
    <section aria-labelledby="highlights-title">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-4"><h2 id="highlights-title" className="font-display text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">Design Highlights</h2>{image && galleryImages.length > 2 && <div className="flex items-center gap-2"><span className="mr-2 font-mono text-xs text-muted-foreground">{selected + 1} / {galleryImages.length}</span><Button size="icon" variant="outline" aria-label="Previous screenshot" onClick={() => setSelected((selected + galleryImages.length - 1) % galleryImages.length)}><ChevronLeft /></Button><Button size="icon" variant="outline" aria-label="Next screenshot" onClick={() => setSelected((selected + 1) % galleryImages.length)}><ChevronRight /></Button></div>}</div>
      {image ? <div className={`grid gap-5 ${companion && project.images.length > 1 ? "md:grid-cols-2" : ""}`}>{[image, ...(companion && project.images.length > 1 ? [companion] : [])].map((src, index) => <div key={`${src}-${index}`} className="relative aspect-[4/3] min-w-0 overflow-hidden rounded-2xl border border-border bg-background shadow-sm"><img src={src} alt={`${project.title} screenshot ${(selected + index) % project.images.length + 1}`} className={`absolute inset-0 h-full w-full object-contain ${project.device === "mobile" ? "p-4 sm:p-6" : ""}`} loading="lazy" decoding="async" /></div>)}</div> : <div className="grid min-h-60 place-items-center rounded-lg border border-dashed border-border bg-muted/40 px-6 text-center text-muted-foreground"><div><ImageIcon className="mx-auto mb-4 size-8 text-primary" /><p>Screenshots coming soon</p></div></div>}
      {galleryImages.length > 2 && <div className="mt-4 flex gap-2 overflow-x-auto py-1">{galleryImages.map((src, index) => <Button key={src} variant="outline" aria-label={`Show screenshot ${index + 1}`} aria-pressed={selected === index} onClick={() => setSelected(index)} className={`h-14 w-20 shrink-0 overflow-hidden p-1 ${selected === index ? "border-primary" : ""}`}><img src={src} alt="" className="h-full w-full object-cover object-top" loading="lazy" /></Button>)}</div>}
    </section>
  );
}
