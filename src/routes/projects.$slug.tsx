import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, ArrowUpRight, Atom, Check, ChevronLeft, ChevronRight, Code2, ImageIcon, Layers, Pause, Play, Volume2, VolumeX, Wind, Zap } from "lucide-react";
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
        </div>
      </section>

      <section aria-labelledby="goals-title" className="border-y border-border bg-muted/25 py-12 sm:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <SectionLabel n="02" text="Goals" /><h2 id="goals-title" className="font-display text-3xl font-semibold sm:text-4xl">Client Goals</h2>
          {project.clientSuggestions && <p className="mt-5 max-w-4xl leading-relaxed text-muted-foreground">{project.clientSuggestions}</p>}
          <ul className="mt-8 grid gap-3 md:grid-cols-2">
            {(project.clientGoals?.length ? project.clientGoals : ["Client goals and requirements are awaiting confirmation."]).map((goal, i) => <GoalCard key={goal} goal={goal} index={i} />)}
          </ul>
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6"><SectionLabel n="03" text="Process" />
          <div className="mt-2 grid gap-4 md:grid-cols-2">
            <DetailSection title="Our Approach & Strategy" text={project.approach} points={project.strategyPoints} pending="Project-specific strategy and development decisions are awaiting confirmation." />
            <DetailSection title="Design & User Experience" text={project.designUx} points={project.designPoints} pending="Verified design decisions and user-experience details have not been provided yet." />
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-muted/20 py-12 sm:py-16"><div className="mx-auto max-w-6xl px-4 sm:px-6"><SectionLabel n="04" text="Showcase" /><ProjectGallery key={slug} project={project} /></div></section>

      <section aria-labelledby="technology-title" className="tech-band overflow-hidden py-7 text-band-ink-foreground sm:py-9">
        <div className="mx-auto grid max-w-6xl gap-5 px-4 sm:px-6 md:grid-cols-[0.9fr_1.4fr] md:items-center md:gap-8">
          <div><p className="mb-2 font-mono text-[11px] uppercase text-primary-glow">05 — Stack</p><h2 id="technology-title" className="font-display text-2xl font-semibold sm:text-3xl">Development & Technology</h2><p className="mt-2 max-w-md text-sm leading-relaxed text-band-ink-foreground/70 sm:text-base">{project.technologies?.length ? "A modern frontend stack for responsive, interactive web applications." : "The verified technology stack has not been provided yet."}</p></div>
          {project.technologies?.length ? <TechnologyList technologies={project.technologies} /> : <div className="flex items-center gap-3 self-center rounded-xl border border-dashed border-band-ink-foreground/25 p-5 text-sm text-band-ink-foreground/70"><Code2 aria-hidden className="size-6 text-primary-glow" />Technology details pending</div>}
        </div>
      </section>

      {next && <section className="py-8 sm:py-10"><div className="mx-4 flex max-w-6xl flex-col justify-between gap-5 rounded-2xl border border-band-ink-foreground/10 bg-band-ink px-5 py-5 text-band-ink-foreground sm:mx-6 sm:flex-row sm:items-center sm:gap-6 sm:px-8 sm:py-7 lg:mx-auto">
        <div><p className="font-mono text-[10px] uppercase tracking-[0.14em] text-band-ink-foreground/55">Have a similar idea?</p><Link to="/" hash="contact" className="font-display mt-1.5 inline-flex items-center gap-2 rounded-md text-lg font-semibold outline-none transition-colors hover:text-primary-glow focus-visible:ring-2 focus-visible:ring-primary-glow sm:text-xl">Discuss your project<ArrowUpRight className="size-4" /></Link></div>
        <Link to="/projects/$slug" params={{ slug: projectSlug(next) }} className="group flex min-h-12 w-full max-w-full items-center justify-between gap-4 rounded-xl border border-band-ink-foreground/15 bg-band-ink-foreground/[0.06] px-4 py-2.5 text-left outline-none transition-colors hover:border-primary-glow/60 hover:bg-band-ink-foreground/[0.1] focus-visible:ring-2 focus-visible:ring-primary-glow sm:w-auto sm:min-w-52"><span><span className="block font-mono text-[10px] uppercase tracking-[0.13em] text-band-ink-foreground/55">Next project</span><span className="mt-0.5 block text-sm font-semibold">{next.title}</span></span><ArrowRight className="size-4 shrink-0 text-primary-glow transition-transform group-hover:translate-x-0.5" /></Link>
      </div></section>}
    </div>
  );
}

function SectionLabel({ n, text }: { n: string; text: string }) {
  return <p className="mb-3 font-mono text-xs uppercase text-primary">{n} — {text}</p>;
}

function GoalCard({ goal, index }: { goal: string; index: number }) {
  const reduceMotion = useReducedMotion();
  return <motion.li initial={reduceMotion ? false : { opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: reduceMotion ? 0 : 0.32, delay: reduceMotion ? 0 : (index % 2) * 0.06, ease: "easeOut" }} className="min-w-0"><motion.div whileHover={reduceMotion ? undefined : { y: -2 }} className="flex min-h-[4.25rem] items-center gap-3 rounded-2xl border border-border bg-muted/45 p-2.5 pr-4 shadow-sm"><span className={`grid size-10 shrink-0 place-items-center rounded-full text-primary-foreground ${index % 2 ? "bg-band-ink" : "bg-primary"}`}><ArrowRight aria-hidden className="size-5" /></span><span className="text-sm font-medium leading-snug sm:text-base">{goal}</span></motion.div></motion.li>;
}

function ScrollReveal({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  const reduceMotion = useReducedMotion();
  return <motion.div initial={reduceMotion ? false : { opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: reduceMotion ? 0 : 0.45, delay: reduceMotion ? 0 : delay, ease: "easeOut" }}>{children}</motion.div>;
}

function DetailSection({ title, text, points, pending }: { title: string; text: string | undefined; points: string[] | undefined; pending: string }) {
  return <ScrollReveal><section className="min-w-0 rounded-2xl border border-border bg-muted/45 p-4 shadow-sm sm:p-5"><h2 className="font-display text-lg font-semibold tracking-[-0.02em] sm:text-xl">{title}</h2>{(text || !points?.length) && <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">{text ?? pending}</p>}{Boolean(points?.length) && <ul className="mt-4 divide-y divide-border/80 border-y border-border/80">{points?.map((point, index) => <motion.li key={point} initial={false} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.3, delay: index * 0.05 }} className="flex gap-2.5 py-3 text-base leading-relaxed sm:text-sm"><MinimalCheck />{point}</motion.li>)}</ul>}</section></ScrollReveal>;
}

function MinimalCheck() {
  return <span aria-hidden className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full border border-primary/25 bg-primary/10 text-primary">
    <Check className="size-3.5" strokeWidth={2.25} />
  </span>;
}

function TechnologyList({ technologies }: { technologies: string[] }) {
  const reduceMotion = useReducedMotion();
  const logoLoop = reduceMotion ? technologies : [...technologies, ...technologies];
  return <div className="overflow-hidden py-3 [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]"><motion.ul animate={reduceMotion ? { x: 0 } : { x: ["0%", "-50%"] }} transition={reduceMotion ? { duration: 0 } : { duration: 18, ease: "linear", repeat: Infinity }} className="flex w-max items-center gap-7 px-4 sm:gap-10">{logoLoop.map((technology, index) => <motion.li key={`${technology}-${index}`} aria-label={technology} animate={reduceMotion ? undefined : { y: [0, -4, 0], rotateX: [0, 7, 0] }} whileHover={reduceMotion ? undefined : { scale: 1.14, rotateY: 12, rotateX: -8, z: 18 }} transition={{ duration: 2.6, delay: index * 0.12, repeat: reduceMotion ? 0 : Infinity, ease: "easeInOut" }} style={{ transformPerspective: 700, transformStyle: "preserve-3d" }} className="grid size-12 place-items-center sm:size-14"><TechnologyMark technology={technology} /></motion.li>)}</motion.ul></div>;
}

function TechnologyMark({ technology }: { technology: string }) {
  const markClass = "grid size-11 shrink-0 place-items-center font-mono text-xl font-bold sm:size-12";
  if (technology === "React") return <span aria-hidden className={`${markClass} text-cyan-300 drop-shadow-[0_7px_13px_rgba(34,211,238,0.34)]`}><Atom className="size-10" /></span>;
  if (technology === "TypeScript") return <span aria-hidden className={`${markClass} text-blue-400 drop-shadow-[0_7px_13px_rgba(96,165,250,0.34)]`}>TS</span>;
  if (technology === "Tailwind CSS") return <span aria-hidden className={`${markClass} text-sky-300 drop-shadow-[0_7px_13px_rgba(56,189,248,0.34)]`}><Wind className="size-10" /></span>;
  if (technology === "Vite") return <span aria-hidden className={`${markClass} text-violet-300 drop-shadow-[0_7px_13px_rgba(167,139,250,0.34)]`}><Zap className="size-10" /></span>;
  if (technology === "Framer Motion") return <span aria-hidden className={`${markClass} text-fuchsia-300 drop-shadow-[0_7px_13px_rgba(232,121,249,0.34)]`}>ƒ</span>;
  return <span aria-hidden className={`${markClass} text-rose-300 drop-shadow-[0_7px_13px_rgba(251,113,133,0.34)]`}><Layers className="size-8" /></span>;
}

type WalkthroughMusic = {
  context: AudioContext;
  master: GainNode;
  timer: ReturnType<typeof window.setInterval> | null;
  step: number;
};

const WALKTHROUGH_NOTES = [
  261.63, 329.63, 392, 523.25, 440, 392, 329.63, 293.66,
  349.23, 440, 523.25, 587.33, 523.25, 440, 392, 329.63,
];

function playWalkthroughNote(music: WalkthroughMusic) {
  const now = music.context.currentTime;
  const frequency = WALKTHROUGH_NOTES[music.step % WALKTHROUGH_NOTES.length];
  music.step += 1;

  const filter = music.context.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.setValueAtTime(1850, now);
  filter.Q.setValueAtTime(0.45, now);

  const gain = music.context.createGain();
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.2, now + 0.012);
  gain.gain.exponentialRampToValueAtTime(0.055, now + 0.16);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.12);

  const oscillator = music.context.createOscillator();
  oscillator.type = "triangle";
  oscillator.frequency.setValueAtTime(frequency, now);
  oscillator.detune.setValueAtTime(music.step % 3 === 0 ? 2 : -1, now);

  oscillator.connect(filter).connect(gain).connect(music.master);
  oscillator.start(now);
  oscillator.stop(now + 1.18);
}

function VideoShowcase({ project }: { project: Project & { showcaseVideo: string } }) {
  const reduceMotion = useReducedMotion();
  const [paused, setPaused] = useState(false);
  const [musicEnabled, setMusicEnabled] = useState(false);
  const [selectedScreen, setSelectedScreen] = useState<number | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const musicRef = useRef<WalkthroughMusic | null>(null);
  const musicActivatedRef = useRef(false);
  const stageInView = useInView(stageRef, { amount: 0.25 });

  const stopMusic = useCallback(() => {
    const music = musicRef.current;
    if (!music) return;
    if (music.timer) window.clearInterval(music.timer);
    music.timer = null;
    void music.context.suspend();
  }, []);

  const startMusic = useCallback(() => {
    let music = musicRef.current;
    if (!music) {
      const AudioContextConstructor = window.AudioContext ?? window.webkitAudioContext;
      if (!AudioContextConstructor) return;
      const context = new AudioContextConstructor();
      const master = context.createGain();
      master.gain.value = 0.16;
      master.connect(context.destination);
      music = { context, master, timer: null, step: 0 };
      musicRef.current = music;
    }
    void music.context.resume();
    if (music.timer) return;
    playWalkthroughNote(music);
    music.timer = window.setInterval(() => playWalkthroughNote(music), 500);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (reduceMotion || paused || !stageInView) video.pause();
    else video.play().catch(() => setPaused(true));
  }, [paused, reduceMotion, stageInView]);

  useEffect(() => {
    if (musicActivatedRef.current && musicEnabled && !paused && !reduceMotion && stageInView) startMusic();
    else stopMusic();
  }, [musicEnabled, paused, reduceMotion, stageInView, startMusic, stopMusic]);

  useEffect(() => () => {
    const music = musicRef.current;
    stopMusic();
    if (music) {
      music.master.disconnect();
      void music.context.close();
    }
  }, [stopMusic]);

  const togglePlayback = () => {
    const nextPaused = !paused;
    setPaused(nextPaused);
    if (!nextPaused) {
      musicActivatedRef.current = true;
      setMusicEnabled(true);
      startMusic();
    }
  };

  const toggleMusic = () => {
    if (musicEnabled) stopMusic();
    else {
      musicActivatedRef.current = true;
      if (!paused && !reduceMotion && stageInView) startMusic();
    }
    setMusicEnabled((enabled) => !enabled);
  };

  return <section aria-labelledby="highlights-title">
    <div className="mb-6 flex flex-col gap-2 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
      <div><p className="mb-2 font-mono text-[11px] uppercase tracking-[0.16em] text-primary">Product walkthrough</p><h2 id="highlights-title" className="font-display text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">Design in motion</h2></div>
      <p className="max-w-md text-sm leading-relaxed text-muted-foreground sm:text-right">A short walkthrough of the live product experience.</p>
    </div>
    <div className="mx-auto grid w-full max-w-6xl gap-3 lg:grid-cols-[minmax(0,1fr)_15rem] lg:items-center">
    <motion.div ref={stageRef} initial={reduceMotion ? false : { opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: reduceMotion ? 0 : 0.45, ease: "easeOut" }} className="relative w-full overflow-hidden rounded-[1.5rem] border border-border bg-[radial-gradient(circle_at_15%_0%,color-mix(in_oklab,var(--primary)_13%,transparent),transparent_32%),linear-gradient(145deg,var(--muted)_0%,var(--background)_54%)] p-2 shadow-[0_28px_60px_-42px_color-mix(in_oklab,var(--foreground)_70%,transparent)] sm:p-3">
      <div className="relative aspect-video overflow-hidden rounded-[1.15rem] border border-border/80 bg-black">
        <AnimatePresence initial={false}>{selectedScreen !== null && <motion.img key={project.images[selectedScreen]} src={project.images[selectedScreen]} alt={`${project.title} interface screen ${selectedScreen + 1}`} className="absolute inset-0 h-full w-full object-contain" initial={reduceMotion ? false : { opacity: 0, scale: 0.99 }} animate={{ opacity: 1, scale: 1 }} exit={reduceMotion ? undefined : { opacity: 0 }} transition={{ duration: reduceMotion ? 0 : 0.2 }} />}</AnimatePresence>
        <div className={`absolute overflow-hidden bg-black shadow-2xl transition-[width,height,inset,border-radius] duration-300 ${selectedScreen === null ? "inset-0" : "inset-auto bottom-3 right-3 w-[34%] aspect-video rounded-lg border border-white/20 sm:h-[34%] sm:w-[36%] sm:aspect-auto"}`}>
          <video ref={videoRef} src={stageInView ? project.showcaseVideo : undefined} poster={project.images[0] ?? project.coverImage} autoPlay={!reduceMotion} muted loop playsInline preload="metadata" aria-label={`${project.title} product walkthrough`} className="h-full w-full object-contain" />
          <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-14 bg-gradient-to-b from-black/30 to-transparent" />
          <div className={`absolute left-2 top-2 inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-black/55 px-2 py-1 text-[9px] font-medium uppercase tracking-[0.11em] text-white/90 backdrop-blur-md ${selectedScreen === null ? "sm:left-3 sm:top-3 sm:px-3 sm:py-1.5 sm:text-[10px]" : ""}`}><span className={`size-1.5 rounded-full ${paused || reduceMotion ? "bg-white/50" : "bg-primary"}`} />{selectedScreen === null ? "Ridoz Style" : "Walkthrough"}</div>
          {!reduceMotion && <div className={`absolute flex items-center gap-1.5 ${selectedScreen === null ? "bottom-2 left-2 sm:bottom-3 sm:left-3" : "bottom-2 right-2"}`}>
            <motion.button type="button" onClick={togglePlayback} aria-label={paused ? "Play product walkthrough" : "Pause product walkthrough"} className={`inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/65 font-semibold text-white shadow-lg backdrop-blur-md outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-black ${selectedScreen === null ? "min-h-8 gap-1.5 px-2.5 text-[11px] sm:min-h-11 sm:gap-2 sm:px-4 sm:text-sm" : "size-8 justify-center"}`} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.96 }} transition={{ type: "spring", stiffness: 450, damping: 30 }}>{paused ? <Play aria-hidden className="size-3 fill-current sm:size-3.5" /> : <Pause aria-hidden className="size-3 fill-current sm:size-3.5" />}{selectedScreen === null && (paused ? "Play walkthrough" : "Pause walkthrough")}</motion.button>
            <motion.button type="button" onClick={toggleMusic} aria-label={musicEnabled ? "Turn off walkthrough music" : "Turn on walkthrough music"} aria-pressed={musicEnabled} className="inline-flex size-11 items-center justify-center rounded-full border border-white/15 bg-black/65 text-white shadow-lg backdrop-blur-md outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-black" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.96 }} transition={{ type: "spring", stiffness: 450, damping: 30 }}>{musicEnabled ? <Volume2 aria-hidden className="size-4" /> : <VolumeX aria-hidden className="size-4" />}</motion.button>
          </div>}
        </div>
        {selectedScreen !== null && <motion.button type="button" onClick={() => setSelectedScreen(null)} initial={reduceMotion ? false : { opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} className="absolute left-3 top-3 inline-flex min-h-10 items-center gap-2 rounded-full border border-black/10 bg-background/90 px-3 text-xs font-semibold text-foreground shadow-sm backdrop-blur-md outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"><Play aria-hidden className="size-3.5 fill-current text-primary" />Watch walkthrough</motion.button>}
        {reduceMotion && selectedScreen === null && <div className="absolute inset-0 grid place-items-center bg-black/35 p-5 text-center text-sm font-medium text-white backdrop-blur-[1px]">Motion preview paused for your accessibility preference</div>}
      </div>
      <div className="flex items-center justify-between px-2 pb-1 pt-3 text-xs text-muted-foreground"><span>Website walkthrough</span><span className="font-mono uppercase tracking-[0.12em]">Ridoz Style</span></div>
    </motion.div>
    {project.images.length > 0 && <motion.div initial={reduceMotion ? false : { opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: reduceMotion ? 0 : 0.35, delay: reduceMotion ? 0 : 0.12 }} className="mt-3 w-full lg:mt-0 lg:self-center">
      <div className="mb-2 flex items-center justify-between px-1"><p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">Selected screens</p><p className="text-xs text-muted-foreground">{project.images.length} views</p></div>
      <ul className="grid grid-cols-3 gap-2 sm:grid-cols-4 sm:gap-2.5 lg:grid-cols-2 lg:gap-2">{project.images.map((image, index) => <motion.li key={image} className="min-w-0"><motion.button type="button" onClick={() => setSelectedScreen(index)} aria-label={`Show interface screen ${index + 1}`} aria-pressed={selectedScreen === index} whileHover={reduceMotion ? undefined : { y: -2 }} whileTap={reduceMotion ? undefined : { scale: 0.97 }} transition={{ duration: 0.18 }} className={`w-full overflow-hidden rounded-lg border bg-muted shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${selectedScreen === index ? "border-primary ring-1 ring-primary" : "border-border"}`}><img src={image} alt="" loading="lazy" decoding="async" className="aspect-[16/10] h-auto w-full object-cover object-top" /></motion.button></motion.li>)}</ul>
    </motion.div>}
    </div>
  </section>;
}

function ProjectGallery({ project }: { project: Project }) {
  if (project.showcaseVideo) return <VideoShowcase project={project as Project & { showcaseVideo: string }} />;
  return <ScreenshotGallery project={project} />;
}

function ScreenshotGallery({ project }: { project: Project }) {
  const [selected, setSelected] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduceMotion = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const previewInView = useInView(previewRef, { amount: 0.25 });
  const galleryItems = [
    ...(project.showcaseVideo ? [{ type: "video" as const, src: project.showcaseVideo, poster: project.images[0] ?? project.coverImage }] : []),
    ...project.images.map((src) => ({ type: "image" as const, src })),
  ];
  const item = galleryItems[selected];
  const isVideo = item?.type === "video";

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (reduceMotion || paused || !previewInView || !isVideo) video.pause();
    else video.play().catch(() => setPaused(true));
  }, [isVideo, paused, previewInView, reduceMotion]);

  const togglePlayback = () => setPaused((current) => !current);
  return (
    <section aria-labelledby="highlights-title">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-4"><div><h2 id="highlights-title" className="font-display text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">Design Highlights</h2><p className="mt-1 text-sm text-muted-foreground">{project.showcaseVideo ? "A recorded product walkthrough, followed by selected interface screens." : "A compact view of the project interface."}</p></div>{item && galleryItems.length > 1 && <div className="flex items-center gap-2"><span className="mr-1 font-mono text-xs text-muted-foreground">{String(selected + 1).padStart(2, "0")} / {String(galleryItems.length).padStart(2, "0")}</span><Button size="icon" variant="outline" aria-label="Previous showcase item" onClick={() => { setPaused(false); setSelected((selected + galleryItems.length - 1) % galleryItems.length); }}><ChevronLeft /></Button><Button size="icon" variant="outline" aria-label="Next showcase item" onClick={() => { setPaused(false); setSelected((selected + 1) % galleryItems.length); }}><ChevronRight /></Button></div>}</div>
      {item ? <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[minmax(0,1.5fr)_minmax(15rem,1fr)] lg:gap-4"><div ref={previewRef} className="relative aspect-[16/10] min-w-0 overflow-hidden rounded-2xl border border-border bg-background shadow-sm"><AnimatePresence mode="wait" initial={false}>{isVideo ? <motion.div key={item.src} initial={reduceMotion ? false : { opacity: 0, scale: 0.985 }} animate={{ opacity: 1, scale: 1 }} exit={reduceMotion ? undefined : { opacity: 0, scale: 1.015 }} transition={{ duration: reduceMotion ? 0 : 0.24, ease: "easeOut" }} className="absolute inset-0"><video ref={videoRef} src={previewInView ? item.src : undefined} poster={item.poster} autoPlay={!reduceMotion} muted loop playsInline preload="metadata" aria-label={`${project.title} product walkthrough`} className="h-full w-full object-contain" />{reduceMotion ? <div className="absolute inset-0 grid place-items-center bg-background/55 text-sm font-medium text-foreground backdrop-blur-[1px]">Motion preview paused</div> : <motion.button type="button" onClick={togglePlayback} aria-label={paused ? "Play product walkthrough" : "Pause product walkthrough"} className="absolute bottom-3 left-3 inline-flex min-h-11 items-center gap-2 rounded-full border border-white/25 bg-black/65 px-3 text-xs font-semibold text-white backdrop-blur-sm outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.96 }} transition={{ type: "spring", stiffness: 450, damping: 30 }}>{paused ? <Play aria-hidden className="size-3.5 fill-current" /> : <Pause aria-hidden className="size-3.5 fill-current" />}{paused ? "Play" : "Pause"}</motion.button>}</motion.div> : <motion.img key={item.src} src={item.src} alt={`${project.title} screenshot ${selected}`} className={`absolute inset-0 h-full w-full object-contain ${project.device === "mobile" ? "p-4 sm:p-6" : ""}`} loading="lazy" decoding="async" initial={reduceMotion ? false : { opacity: 0, scale: 0.985 }} animate={{ opacity: 1, scale: 1 }} exit={reduceMotion ? undefined : { opacity: 0, scale: 1.015 }} transition={{ duration: reduceMotion ? 0 : 0.24, ease: "easeOut"}} />}</AnimatePresence></div><div className="grid grid-cols-3 gap-2 sm:grid-cols-2 lg:grid-cols-3">{galleryItems.map((galleryItem, index) => <motion.button key={galleryItem.src} type="button" aria-label={galleryItem.type === "video" ? "Show product walkthrough" : `Show screenshot ${project.showcaseVideo ? index : index + 1}`} aria-pressed={selected === index} onClick={() => { setPaused(false); setSelected(index); }} className={`group relative aspect-[4/3] min-w-0 overflow-hidden rounded-xl border bg-background text-left shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${selected === index ? "border-primary ring-1 ring-primary" : "border-border"}`} whileHover={reduceMotion ? undefined : { y: -2 }} whileTap={reduceMotion ? undefined : { scale: 0.98 }} transition={{ duration: 0.18 }}><img src={galleryItem.type === "video" ? galleryItem.poster : galleryItem.src} alt="" className="h-full w-full object-cover object-top transition-transform duration-300 group-hover:scale-[1.03]" loading="lazy" decoding="async" />{galleryItem.type === "video" && <span aria-hidden className="absolute inset-0 grid place-items-center bg-black/20"><span className="grid size-9 place-items-center rounded-full bg-black/65 text-white shadow-lg"><Play className="ml-0.5 size-4 fill-current" /></span></span>}{selected === index && <motion.span layoutId="active-shot" className="absolute inset-x-2 bottom-2 h-0.5 rounded-full bg-primary" transition={{ type: "spring", stiffness: 450, damping: 32 }} />}</motion.button>)}</div></div> : <div className="grid min-h-60 place-items-center rounded-lg border border-dashed border-border bg-muted/40 px-6 text-center text-muted-foreground"><div><ImageIcon className="mx-auto mb-4 size-8 text-primary" /><p>Screenshots coming soon</p></div></div>}
    </section>
  );
}
