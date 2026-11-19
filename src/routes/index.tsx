import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, Clapperboard, Cloud, Code2, Globe2, LayoutPanelTop, Palette, PenTool, ShieldCheck, Smartphone, Users } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Reveal, Scene3D } from "@/components/site";
import { contact, process, projects, projectSlug, reasons, services, type Project } from "@/lib/content";

const whyIcons = [Users, PenTool, Globe2, ShieldCheck];
const serviceIcons = [LayoutPanelTop, Code2, Smartphone, Palette, Clapperboard, Cloud];

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Quadtricks — Software, Web & Mobile App Development" },
      { name: "description", content: "Quadtricks is a team of IT professionals building custom software, web and mobile applications for startups and businesses." },
      { property: "og:title", content: "Quadtricks — Software, Web & Mobile App Development" },
      { property: "og:description", content: "Custom software, web and mobile apps engineered to scale." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function SectionHead({ n, label, title, right = false }: { n: string; label: string; title: string; right?: boolean }) {
  return (
    <Reveal className={right ? "md:ml-auto md:max-w-xl md:text-right" : "max-w-xl"}>
      <p className="label"><span className="text-primary">[{n}]</span> {label}</p>
      <h2 className="font-display text-chrome mt-4 text-[2rem] font-semibold leading-[1.05] min-[400px]:text-4xl md:text-6xl">{title}</h2>
    </Reveal>
  );
}

function ServicesSection() {
  const reducedMotion = useReducedMotion();

  return (
    <section id="services" className="scroll-mt-24 px-4 py-20 sm:px-5 md:py-28">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[minmax(0,0.78fr)_minmax(0,1.22fr)] lg:gap-14">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <p className="label"><span className="text-primary">[01]</span> Capabilities</p>
          <h2 className="font-display text-chrome mt-5 max-w-md text-4xl font-semibold leading-[0.98] tracking-[-0.045em] sm:text-5xl md:text-6xl">Built to take ideas <span className="text-primary">further.</span></h2>
          <p className="mt-6 max-w-sm text-base leading-relaxed text-muted-foreground">From first interface to reliable launch, we bring design, engineering and the systems behind it into one focused team.</p>
          <a href="#contact" className="btn-glass mt-8 inline-flex min-h-11">Start a conversation <ArrowUpRight className="size-4" aria-hidden="true" /></a>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
          {services.map((service, index) => {
            const Icon = serviceIcons[index] ?? Code2;
            return (
              <motion.article
                key={service.title}
                initial={reducedMotion ? false : { opacity: 0, y: 22 }}
                whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
                whileHover={reducedMotion ? undefined : { y: -4 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.42, delay: (index % 2) * 0.07, ease: [0.22, 1, 0.36, 1] }}
                className="group relative min-h-48 overflow-hidden rounded-2xl border border-border bg-background/82 p-4 shadow-[0_18px_48px_-36px_color-mix(in_oklch,var(--foreground)_70%,transparent)] transition-colors duration-300 hover:border-primary/55 focus-within:border-primary/70 sm:p-5"
              >
                <span aria-hidden="true" className="absolute -right-8 -top-8 size-28 rounded-full bg-primary/[0.07] blur-2xl transition-opacity duration-500 group-hover:bg-primary/[0.16]" />
                <div className="relative flex items-center justify-between gap-4">
                  <span className="font-mono text-xs tracking-[0.16em] text-primary">0{index + 1}</span>
                  <span className="grid size-10 place-items-center rounded-xl border border-border bg-muted/35 text-foreground transition-colors duration-300 group-hover:border-primary/40 group-hover:bg-primary/10 group-hover:text-primary"><Icon className="size-4" aria-hidden="true" /></span>
                </div>
                <div className="relative mt-6">
                  <h3 className="font-display max-w-[17ch] text-lg font-semibold leading-[1.1] tracking-[-0.025em] sm:text-xl">{service.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{service.text}</p>
                </div>
                <span aria-hidden="true" className="absolute inset-x-6 bottom-0 h-px origin-left scale-x-0 bg-primary transition-transform duration-500 group-hover:scale-x-100 sm:inset-x-7" />
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Index() {
  return (
    <>
      <Scene3D />

      {/* Hero */}
      <section id="top" className="relative flex min-h-[100svh] items-end px-4 sm:px-5 pb-16 pt-32 md:items-center md:pb-0">
        <div className="mx-auto w-full max-w-7xl">
          <p className="label fade-up !tracking-[0.15em] sm:!tracking-[0.25em]"><span className="mr-2 inline-block h-2 w-2 animate-pulse rounded-full bg-primary" />Software · Web · Mobile · AI</p>
          <h1 className="font-display fade-up mt-6 max-w-3xl text-[2.4rem] font-extrabold leading-[0.95] min-[400px]:text-5xl sm:text-7xl xl:text-8xl" style={{ animationDelay: "120ms" }}>
            <span className="text-chrome">Engineering</span><br />
            the <span className="text-primary">future</span>.
          </h1>
          <p className="fade-up mt-8 max-w-md text-lg text-muted-foreground" style={{ animationDelay: "240ms" }}>
            Quadtricks is a team of IT professionals crafting next-generation software, web platforms and mobile apps.
          </p>
          <div className="fade-up mt-10 flex flex-wrap gap-3" style={{ animationDelay: "360ms" }}>
            <a href="#contact" className="btn-glow max-sm:!px-5">Start a project →</a>
            <a href="#services" className="btn-glass max-sm:!px-5">Explore</a>
          </div>
          <div className="fade-up mt-16 hidden items-center gap-3 md:flex" style={{ animationDelay: "600ms" }}>
            <span className="relative h-10 w-[1px] overflow-hidden bg-border"><span className="absolute inset-0 bg-primary" style={{ animation: "scan 1.6s linear infinite" }} /></span>
            <span className="label">Scroll to explore</span>
          </div>
        </div>
      </section>

      <ServicesSection />

      {/* Work */}
      <section id="work" className="scroll-mt-24 px-4 sm:px-5 py-20 md:py-28">
        <div className="mx-auto max-w-7xl">
          <div>
            <SectionHead n="02" label="Selected work" title="Built for what's next" />
          </div>
          <div className="mt-10 grid max-w-6xl min-w-0 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((p, i) => (
              <Reveal key={p.title} delay={(i % 3) * 70} className="h-full">
                <ProjectCard p={p} i={i} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section id="process" className="scroll-mt-24 px-4 sm:px-5 py-20 md:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <Reveal>
              <p className="label"><span className="text-primary">[03]</span> Process</p>
              <h2 className="font-display text-chrome mt-4 text-[2rem] font-semibold min-[400px]:text-4xl md:text-6xl">From signal to launch</h2>
            </Reveal>
          </div>
          <p className="mx-auto mt-6 max-w-xl text-center text-muted-foreground">From the first conversation to a year after launch, you always know what happens next.</p>
          <div className="mt-6 text-center"><a href="#contact" className="btn-glass">Start with discovery →</a></div>
          <div className="mt-16 md:mt-[20vh] grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {process.map((p, i) => (
              <Reveal key={p.step} delay={i * 100}>
                <div className="glass relative h-full overflow-hidden rounded-2xl p-6">
                  <span className="font-display absolute -right-2 -top-4 text-8xl font-extrabold text-foreground/5">{i + 1}</span>
                  <p className="label text-primary">Phase 0{i + 1}</p>
                  <h3 className="font-display mt-6 text-2xl font-semibold">{p.step}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{p.text}</p>
                  <ul className="mt-5 space-y-1.5 text-sm">
                    {p.items.map((it) => <li key={it} className="flex gap-2"><span className="text-primary">›</span>{it}</li>)}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Why */}
      <section id="why" className="scroll-mt-24 px-4 py-16 sm:px-5 md:py-20">
        <div className="mx-auto max-w-7xl">
          <Reveal className="max-w-2xl">
            <p className="label"><span className="text-primary">[04]</span> Why Quadtricks</p>
            <h2 className="font-display mt-4 text-3xl font-semibold leading-[1.02] tracking-[-0.04em] sm:text-4xl md:text-5xl">
              <span className="text-chrome">Senior minds.</span> <span className="text-primary">Startup speed.</span>
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">A focused team for ambitious digital products, with clear ownership from first brief to post-launch support.</p>
          </Reveal>
          <div className="relative mt-8">
            <span aria-hidden className="absolute -top-2.5 left-1/2 hidden -translate-x-1/2 font-mono text-xl text-primary/60 lg:block">+</span>
            <span aria-hidden className="absolute -bottom-2.5 left-1/2 hidden -translate-x-1/2 font-mono text-xl text-primary/60 lg:block">+</span>
            <span aria-hidden className="absolute -left-2.5 top-1/2 hidden -translate-y-1/2 font-mono text-xl text-primary/60 lg:block">+</span>
            <span aria-hidden className="absolute -right-2.5 top-1/2 hidden -translate-y-1/2 font-mono text-xl text-primary/60 lg:block">+</span>
            <ol className="overflow-hidden rounded-2xl border border-border bg-border [&>li]:min-h-0 [&>li]:rounded-none [&>li]:border-0 [&>li]:border-b [&>li]:border-border [&>li]:p-5 [&>li:last-child]:border-b-0 sm:[&>li>div]:grid sm:[&>li>div]:grid-cols-[auto_minmax(12rem,0.8fr)_minmax(0,1.45fr)] sm:[&>li>div]:items-center sm:[&>li>div]:gap-6 sm:[&>li>div>h3]:mt-0 sm:[&>li>div>p]:mt-0">
              {reasons.map((r, i) => {
                const Icon = whyIcons[i % whyIcons.length] ?? Users;
                return (
                  <li key={r.title} className="group relative min-h-52 overflow-hidden rounded-2xl border border-border bg-background/80 p-5 backdrop-blur-sm transition-colors duration-300 hover:border-primary/50 hover:bg-primary/[0.04]">
                    <Reveal delay={i * 80}>
                      <span aria-hidden className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-primary transition-transform duration-500 group-hover:scale-x-100" />
                      <div className="flex items-start justify-between gap-4">
                        <span className="grid size-10 shrink-0 place-items-center rounded-xl border border-primary/25 bg-primary/10 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
                          <Icon className="size-4" aria-hidden />
                        </span>
                        <span className="font-mono text-xs tracking-[0.16em] text-muted-foreground transition-colors duration-300 group-hover:text-primary">0{i + 1}</span>
                      </div>
                      <h3 className="font-display mt-6 text-base font-semibold leading-tight tracking-[-0.02em]">{r.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{r.text}</p>
                    </Reveal>
                  </li>
                );
              })}
            </ol>
          </div>
          <Reveal delay={200} className="mt-6">
            <a href="#contact" className="btn-glow">Talk to the team →</a>
          </Reveal>
        </div>
      </section>

      <ContactSection />
    </>
  );
}

function ContactSection() {
  const [sent, setSent] = useState(false);
  return (
    <section id="contact" className="scroll-mt-24 px-4 sm:px-5 pb-28 pt-24 md:pt-[30vh]">
      <div className="mx-auto max-w-5xl">
        <Reveal className="text-center">
          <p className="label"><span className="text-primary">[05]</span> Contact</p>
          <h2 className="font-display mt-4 text-[2.6rem] font-extrabold leading-[0.95] min-[400px]:text-5xl md:text-7xl">
            <span className="text-chrome">Let's build</span><br /><span className="text-primary">tomorrow</span>.
          </h2>
        </Reveal>
        <Reveal delay={120}>
          <div className="glass mt-14 grid gap-8 rounded-3xl p-5 sm:p-6 md:grid-cols-[1fr_1.5fr] md:p-10">
            <div className="space-y-6">
              <p className="text-muted-foreground">Tell us about your project. We reply within one working day, wherever you are.</p>
              {[["Email", contact.email], ["WhatsApp / Phone", contact.whatsapp[0]], ["WhatsApp / Phone", contact.whatsapp[1]], ["Studio", `${contact.location} · ${contact.serving}`]].map(([k, v], i) => (
                <div key={i}>
                  <p className="label">{k}</p>
                  <p className="font-display mt-1 break-words">{v}</p>
                </div>
              ))}
            </div>
            <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} className="grid gap-4">
              {sent ? (
                <div className="py-12 text-center">
                  <p className="font-display text-3xl font-bold text-primary">Transmission received.</p>
                  <p className="mt-3 text-muted-foreground">We'll be in touch within one business day.</p>
                </div>
              ) : (
                <>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <input required placeholder="Your name" className="field" />
                    <input required type="email" placeholder="Email" className="field" />
                  </div>
                  <input placeholder="Company (optional)" className="field" />
                  <Select name="service">
                    <SelectTrigger className="field h-auto text-base text-left data-[placeholder]:text-muted-foreground"><SelectValue placeholder="What do you need?" /></SelectTrigger>
                    <SelectContent className="rounded-xl border-border bg-popover/95 p-1 backdrop-blur-xl">
                      {[...services.map((x) => x.title), "Not sure yet"].map((t) => <SelectItem key={t} value={t} className="cursor-pointer rounded-lg py-2.5 text-sm focus:bg-primary/15 focus:text-foreground">{t}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <textarea required rows={4} placeholder="Tell us about your project — goals, timeline, links, anything useful" className="field" />
                  <button className="btn-glow w-fit">Send enquiry →</button>
                </>
              )}
            </form>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function ProjectPreview({ p }: { p: Project }) {
  const [failed, setFailed] = useState(false);
  const source = p.coverImage ?? p.images[0];

  if (!source || failed) {
    return (
      <div className="grid h-full place-items-center bg-[radial-gradient(circle_at_70%_20%,color-mix(in_oklch,var(--primary)_18%,transparent),transparent_36%),linear-gradient(135deg,var(--muted)_0%,transparent_72%)] p-5 text-center">
        <div>
          <span className="mx-auto grid size-10 place-items-center rounded-full border border-primary/25 bg-primary/10 text-primary"><Globe2 className="size-4" aria-hidden="true" /></span>
          <p className="mt-3 font-display text-sm font-semibold text-foreground">Visual preview pending</p>
          <p className="mt-1 text-xs text-muted-foreground">Project imagery coming soon</p>
        </div>
      </div>
    );
  }

  return (
    <img src={source} alt={`${p.title} project preview`} loading="lazy" decoding="async" onError={() => setFailed(true)}
      className="h-full w-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.035] motion-reduce:transform-none motion-reduce:transition-none" />
  );
}

function ProjectCard({ p, i }: { p: Project; i: number }) {
  const reducedMotion = useReducedMotion();
  const webProject = p.device === "web";

  return (
    <motion.article
      initial={reducedMotion ? false : { opacity: 0, y: 28 }}
      whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: 0.48, delay: Math.min(i, 5) * 0.055, ease: [0.22, 1, 0.36, 1] }}
      whileHover={reducedMotion ? undefined : { y: -4 }}
      className={`group relative flex h-full flex-col overflow-hidden rounded-2xl border bg-transparent shadow-[0_18px_44px_-30px_color-mix(in_oklch,var(--foreground)_60%,transparent)] transition-colors duration-300 focus-within:border-primary/80 ${i === 0 ? "border-primary/65" : "border-border hover:border-primary/55"}`}
    >
      <div className="relative h-36 overflow-hidden border-b border-border bg-muted/25 sm:h-40">
        <ProjectPreview p={p} />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/35 via-transparent to-background/5" />
        {webProject && <div aria-hidden className="pointer-events-none absolute left-3 top-3 flex items-center gap-1 rounded-full border border-border/70 bg-background/80 px-2 py-1 backdrop-blur-sm">{[0, 1, 2].map((d) => <span key={d} className="size-1 rounded-full bg-muted-foreground/70" />)}</div>}
        {!webProject && <div aria-hidden className="pointer-events-none absolute left-3 top-3 rounded-full border border-border/70 bg-background/80 px-2 py-1 font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground backdrop-blur-sm">Mobile</div>}
      </div>
      <div className="flex min-w-0 flex-1 flex-col bg-background/80 p-4 backdrop-blur-sm">
        <div className="mb-2 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.11em] text-muted-foreground">
          <span className="text-primary">0{i + 1}</span>
          <span className="h-px w-5 bg-border" />
          <span className="truncate">{p.type}</span>
        </div>
        <h3 className="font-display break-words text-base font-semibold leading-tight tracking-[-0.02em] sm:text-lg">{p.title}</h3>
        <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-muted-foreground">{p.text}</p>
        <Button asChild variant="link" className="mt-auto h-10 justify-between px-0 pt-3 text-xs font-semibold text-primary hover:text-foreground"><Link to="/projects/$slug" params={{ slug: projectSlug(p) }} aria-label={`View ${p.title} project`}>View case study<ArrowUpRight className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 motion-reduce:transform-none" /><span className="absolute inset-0" aria-hidden /></Link></Button>
      </div>
    </motion.article>
  );
}
