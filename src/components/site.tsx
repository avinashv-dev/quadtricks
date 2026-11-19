import { Link } from "@tanstack/react-router";
import { lazy, Suspense, useEffect, useRef, useState, type ReactNode } from "react";
import { contact } from "@/lib/content";
import { ArrowUp, Mail, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const Emblem3D = lazy(() => import("./Emblem3D"));

/** Full-screen 3D scene fixed behind the page; reacts to scroll and pointer. */
export function Scene3D() {
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  return (
    <div className="fixed inset-0 -z-10 bg-background" aria-hidden>
      {ready && (
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
        <img src="/quadtricks-emblem.png" alt="Quadtricks emblem" className="h-8 w-8 object-contain" />
      </span>
      <span className="font-display truncate text-sm font-semibold tracking-[0.2em] sm:tracking-[0.3em]">QUADTRICKS</span>
    </Link>
  );
}

export function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-4 sm:pt-4">
      <div className="glass mx-auto flex max-w-7xl items-center justify-between gap-4 rounded-2xl px-3 py-2.5 sm:px-4 sm:py-3">
        <Logo />
        <nav className="hidden items-center gap-8 md:flex">
          {nav.map((n, i) => (
            <Link key={n.to} to="/" hash={n.to.slice(1)} className="label transition-colors hover:text-foreground">
              <span className="text-primary">0{i + 1}</span> {n.label}
            </Link>
          ))}
        </nav>
        <Link to="/" hash="contact" className="btn-glow hidden !py-2.5 md:inline-flex">Start a project</Link>
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
  );
}

export function Footer() {
  return (
    <footer className="border-t border-border bg-background/45 px-4 py-7 sm:px-5">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-3">
            <Logo />
            <p className="text-xs text-muted-foreground">Software, web & mobile. Built by one team.</p>
          </div>
          <nav aria-label="Footer" className="flex flex-wrap gap-x-4 gap-y-1 sm:gap-x-5">
            {[...nav, { to: "#contact", label: "Contact" }].map((n) => (
              <Button key={n.to} asChild variant="link" className="h-10 p-0 text-xs text-muted-foreground hover:text-primary"><Link to="/" hash={n.to.slice(1)}>{n.label}</Link></Button>
            ))}
          </nav>
        </div>
        <div className="mt-5 grid gap-4 border-t border-border pt-5 lg:grid-cols-[1fr_auto] lg:items-center">
          <div className="flex min-w-0 flex-wrap gap-x-5 gap-y-2 text-xs">
            <Button asChild variant="link" className="h-auto min-h-10 max-w-full whitespace-normal p-0 text-xs text-foreground"><a href={`mailto:${contact.email}`}><Mail aria-hidden className="shrink-0" /><span className="break-all">{contact.email}</span></a></Button>
            {contact.whatsapp.map((w) => <Button key={w} asChild variant="link" className="h-10 p-0 text-xs text-muted-foreground"><a href={`https://wa.me/${w.replace(/\D/g, "")}`} target="_blank" rel="noreferrer"><MessageCircle aria-hidden />{w}</a></Button>)}
          </div>
          <p className="text-xs text-muted-foreground lg:text-right">{contact.location}<span className="mt-1 block">{contact.serving}</span></p>
        </div>
        <div className="mt-4 flex items-center justify-between gap-4 text-[11px] text-muted-foreground">
          <p>© {new Date().getFullYear()} Quadtricks. All rights reserved.</p>
          <Button asChild variant="ghost" size="icon" className="shrink-0" title="Back to top"><a href="#top" aria-label="Back to top"><ArrowUp /></a></Button>
        </div>
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
  return (
    <div
      ref={ref}
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse") return;
        const el = ref.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        el.style.transform = `perspective(900px) rotateY(${x * 12}deg) rotateX(${-y * 12}deg)`;
      }}
      onPointerLeave={() => { if (ref.current) ref.current.style.transform = ""; }}
      className={`tilt-card ${className}`}
    >
      {children}
    </div>
  );
}
