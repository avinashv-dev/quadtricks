import { Link } from "@tanstack/react-router";
import { WebShotButton } from "@/components/ui/web-shot-button";
import { lazy, Suspense, useEffect, useRef, useState, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { contact } from "@/lib/content";
import { ArrowUp, Mail, MapPin, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const Emblem3D = lazy(() => import("./Emblem3D"));

/** Full-screen 3D scene fixed behind the page; reacts to scroll and pointer. */
export function Scene3D() {
  const [ready, setReady] = useState(false);
  const reducedMotion = useReducedMotion();
  useEffect(() => {
    const schedule = window.requestIdleCallback ?? ((callback: IdleRequestCallback) => window.setTimeout(callback, 1));
    const cancel = window.cancelIdleCallback ?? window.clearTimeout;
    const handle = schedule(() => setReady(true), { timeout: 1200 });
    return () => cancel(handle);
  }, []);
  return (
    <div className="fixed inset-0 -z-10 bg-background" aria-hidden>
      {ready && !reducedMotion && (
        <Suspense fallback={null}>
          <Emblem3D />
        </Suspense>
      )}
    </div>
  );
}

const nav = [
  { to: "#services", label: "Services" },
  { to: "#work", label: "Work" },
  { to: "#process", label: "Process" },
  { to: "#why", label: "Why us" },
] as const;

export function Logo() {
  return (
    <Link to="/" className="flex min-w-0 items-center gap-3">
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-border bg-logo-chip">
        <img src="/quadtricks-emblem.webp" alt="Quadtricks emblem" width="32" height="32" decoding="async" className="h-8 w-8 object-contain" />
      </span>
      <span className="font-display truncate text-sm font-semibold tracking-[0.2em] sm:tracking-[0.3em]">QUADTRICKS</span>
    </Link>
  );
}

export function Header() {
  const [open, setOpen] = useState(false);
  return (
    <>
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-4 sm:pt-4">
      <div className="glass mx-auto flex max-w-7xl items-center justify-between gap-4 rounded-2xl px-3 py-2.5 sm:px-4 sm:py-3">
        <Logo />
        <nav className="hidden items-center gap-8 md:flex">
          {nav.map((n) => (
            <Link key={n.to} to="/" hash={n.to.slice(1)} className="label transition-colors hover:text-foreground">
              {n.label}
            </Link>
          ))}
        </nav>
        <WebShotButton
          size="md"
          className="hidden md:inline-flex"
          aria-label="Start a project — go to contact form"
          onClick={() => {
            if (window.location.pathname === "/") document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" });
            else window.location.assign("/#contact");
          }}
        >
          Start a project
        </WebShotButton>
        <button className="label shrink-0 !tracking-[0.15em] md:hidden" onClick={() => setOpen(!open)} aria-label="Menu">{open ? "Close" : "Menu"}</button>
      </div>
      {open && (
        <nav className="glass mx-auto mt-2 flex max-w-7xl flex-col gap-2 rounded-2xl p-5 md:hidden">
          {[...nav, { to: "#contact", label: "Contact" }].map((n) => (
            <Link key={n.to} to="/" hash={n.to.slice(1)} onClick={() => setOpen(false)} className="font-display py-2 text-xl">{n.label}</Link>
          ))}
        </nav>
      )}
    </header>
    </>
  );
}

export function Footer({ landing = false }: { landing?: boolean }) {
  const reducedMotion = useReducedMotion();
  const enter = (delay = 0) => ({ initial: reducedMotion ? false : { opacity: 0, y: 16 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, amount: 0.15 }, transition: { duration: reducedMotion ? 0 : 0.42, delay: reducedMotion ? 0 : delay, ease: "easeOut" as const } });
  const surface = landing ? "border-border bg-background/88 text-foreground" : "border-border bg-footer-background text-footer-foreground";
  const muted = landing ? "text-muted-foreground" : "text-footer-foreground/65";
  const mutedStrong = landing ? "text-foreground/80" : "text-footer-foreground/80";
  const link = landing ? "text-muted-foreground hover:text-foreground focus-visible:ring-primary" : "text-footer-foreground/70 hover:text-footer-foreground focus-visible:ring-primary-glow";
  const accent = landing ? "text-primary" : "text-primary-glow";
  return (
    <footer className={`border-t px-4 py-4 sm:px-6 sm:py-6 ${surface}`}>
      <div className="mx-auto max-w-7xl">
        <motion.div {...enter()} className="grid gap-3.5 border-b border-border pb-4 md:grid-cols-[1.25fr_0.7fr_1fr] md:items-start md:gap-6 md:pb-5">
          <div className="max-w-sm"><Link to="/" className={`inline-flex items-center gap-3 rounded-lg outline-none focus-visible:ring-2 ${landing ? "focus-visible:ring-primary" : "focus-visible:ring-primary-glow"}`}><span className="grid size-8 place-items-center rounded-lg border border-border bg-logo-chip"><img src="/quadtricks-emblem.webp" alt="" width="24" height="24" loading="lazy" decoding="async" className="size-6 object-contain" /></span><span className="font-display text-sm font-semibold tracking-[0.18em]">QUADTRICKS</span></Link><p className={`mt-2 text-sm leading-relaxed ${muted}`}>Software, web & mobile. Built by one team.</p></div>
          <nav aria-label="Footer navigation"><p className={`font-mono text-[10px] uppercase tracking-[0.18em] ${accent}`}>Explore</p><ul className="mt-1.5 grid grid-cols-2 gap-x-4 gap-y-1 md:mt-2 md:gap-y-1.5">{[...nav, { to: "#contact", label: "Contact" }].map((n) => <li key={n.to}><Link to="/" hash={n.to.slice(1)} className={`text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 ${link}`}>{n.label}</Link></li>)}</ul></nav>
          <div><p className={`font-mono text-[10px] uppercase tracking-[0.18em] ${accent}`}>Contact</p><div className="mt-1.5 space-y-1 text-sm md:mt-2 md:space-y-1.5"><a href={`mailto:${contact.email}`} className={`flex w-fit items-center gap-2 transition-colors focus-visible:outline-none focus-visible:ring-2 ${mutedStrong} ${landing ? "hover:text-foreground focus-visible:ring-primary" : "hover:text-footer-foreground focus-visible:ring-primary-glow"}`}><Mail aria-hidden className={`size-4 ${accent}`} />{contact.email}</a><div className="flex flex-wrap gap-x-4 gap-y-1 md:gap-y-1.5">{contact.whatsapp.map((w) => <a key={w} href={`https://wa.me/${w.replace(/\D/g, "")}`} target="_blank" rel="noreferrer" className={`flex items-center gap-2 transition-colors focus-visible:outline-none focus-visible:ring-2 ${muted} ${landing ? "hover:text-foreground focus-visible:ring-primary" : "hover:text-footer-foreground focus-visible:ring-primary-glow"}`}><MessageCircle aria-hidden className={`size-4 ${accent}`} />{w}</a>)}</div><p className={`flex items-start gap-2 ${muted}`}><MapPin aria-hidden className={`mt-0.5 size-4 shrink-0 ${accent}`} /><span>{contact.location}<span className="mt-0.5 block">{contact.serving}</span></span></p></div></div>
        </motion.div>
        <motion.div {...enter(0.1)} className={`flex flex-col gap-1.5 pt-2.5 text-xs sm:flex-row sm:items-center sm:justify-between sm:gap-2 sm:pt-3 ${landing ? "text-muted-foreground" : "text-footer-foreground/50"}`}><p>© {new Date().getFullYear()} Quadtricks. All rights reserved.</p><a href="#top" aria-label="Back to top" className={`group inline-flex w-fit items-center gap-2 transition-colors focus-visible:outline-none focus-visible:ring-2 ${landing ? "hover:text-foreground focus-visible:ring-primary" : "hover:text-footer-foreground focus-visible:ring-primary-glow"}`}>Back to top<ArrowUp aria-hidden className="size-4 transition-transform group-hover:-translate-y-0.5" /></a></motion.div>
      </div>
    </footer>
  );
}

export function Reveal({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e?.isIntersecting) { setShown(true); io.disconnect(); } }, { threshold: 0.12 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} style={{ transitionDelay: `${delay}ms` }} className={`reveal ${shown ? "reveal-in" : ""} ${className}`}>
      {children}
    </div>
  );
}

export function TiltCard({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const frame = useRef(0);
  const pointer = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => () => window.cancelAnimationFrame(frame.current), []);

  return (
    <div
      ref={ref}
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse") return;
        pointer.current = { x: e.clientX, y: e.clientY };
        if (frame.current) return;
        frame.current = window.requestAnimationFrame(() => {
          frame.current = 0;
          const el = ref.current;
          const point = pointer.current;
          if (!el || !point) return;
          const r = el.getBoundingClientRect();
          const x = (point.x - r.left) / r.width - 0.5;
          const y = (point.y - r.top) / r.height - 0.5;
          el.style.transform = `perspective(900px) rotateY(${x * 12}deg) rotateX(${-y * 12}deg)`;
        });
      }}
      onPointerLeave={() => {
        window.cancelAnimationFrame(frame.current);
        frame.current = 0;
        pointer.current = null;
        if (ref.current) ref.current.style.transform = "";
      }}
      className={`tilt-card ${className}`}
    >
      {children}
    </div>
  );
}
