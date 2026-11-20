"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

const FOCUS = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";
const SPRING = { type: "spring", stiffness: 420, damping: 34, mass: 0.8 } as const;
const twMerge = extendTailwindMerge({
  extend: { classGroups: { "font-size": [{ text: ["figure", "title", "body", "sub", "dense", "meta", "chip", "micro"] }], shadow: [{ shadow: ["float", "overlay"] }] } },
});
const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

export interface WebShotButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "color" | "onDrag" | "onDragStart" | "onDragEnd" | "onAnimationStart" | "onAnimationEnd"> {
  size?: "md" | "lg";
  color?: string;
  reach?: number;
  threads?: number;
}

const SIZES = { md: "h-11 px-6 text-[14px]", lg: "h-14 px-8 text-[16px]" };
const RED = "#E0242F";
const GLASS = "bg-white/[0.07] text-foreground backdrop-blur-md backdrop-saturate-150 ring-1 ring-inset ring-white/70 dark:bg-white/[0.05] dark:ring-white/20 shadow-[inset_0_1px_0_rgb(255_255_255/0.95),inset_0_-1px_0_rgb(255_255_255/0.3),inset_0_-12px_18px_-10px_rgb(0_0_0/0.14),inset_0_10px_16px_-8px_rgb(255_255_255/0.55),0_12px_28px_-12px_rgb(0_0_0/0.3),0_1px_3px_rgb(0_0_0/0.1)] dark:shadow-[inset_0_1px_0_rgb(255_255_255/0.35),inset_0_-12px_18px_-10px_rgb(0_0_0/0.5),inset_0_10px_16px_-8px_rgb(255_255_255/0.08),0_12px_28px_-12px_rgb(0_0_0/0.7)]";
const SEGS = 16;
const SPREAD = 17;
const DAMP = 0.9;
const GRAVITY = 0.05;

function lightness(color: string) {
  if (color.startsWith("#")) {
    const hex = color.length === 4 ? color.slice(1).split("").map((value) => value + value).join("") : color.slice(1, 7);
    const values = [0, 2, 4].map((index) => parseInt(hex.slice(index, index + 2), 16));
    return (0.2126 * values[0] + 0.7152 * values[1] + 0.0722 * values[2]) / 255;
  }
  const values = (color.match(/[\d.]+/g) ?? []).map(Number);
  return values.length >= 3 ? (0.2126 * values[0] + 0.7152 * values[1] + 0.0722 * values[2]) / 255 : 0;
}

type Point = { x: number; y: number; px: number; py: number };
type Thread = { points: Point[]; lag: number; anchorX: number; anchorY: number; seeded: boolean };

export const WebShotButton = React.forwardRef<HTMLButtonElement, WebShotButtonProps>(function WebShotButton(
  { size = "lg", color, reach = 140, threads = 5, className, style, children, disabled, ...rest },
  forwardedRef,
) {
  const reduced = useReducedMotion();
  const buttonRef = React.useRef<HTMLButtonElement | null>(null);
  const wrapperRef = React.useRef<HTMLSpanElement | null>(null);
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const setRefs = React.useCallback((node: HTMLButtonElement | null) => {
    buttonRef.current = node;
    if (typeof forwardedRef === "function") forwardedRef(node);
    else if (forwardedRef) forwardedRef.current = node;
  }, [forwardedRef]);
  const tone = color === "clear" ? undefined : color ?? RED;
  const light = tone ? lightness(tone) > 0.62 : false;

  React.useEffect(() => {
    const button = buttonRef.current;
    const wrapper = wrapperRef.current;
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (reduced || !button || !wrapper || !canvas || !context) return;

    const count = Math.max(1, Math.round(threads));
    const padding = reach + 24;
    let width = 0, height = 0, dpr = 1, ink = "#000", active = false, extension = 0, frame = 0;
    const pointer = { x: 0, y: 0, known: false };
    const hold = { x: 0, y: 0 };
    const list: Thread[] = Array.from({ length: count }, (_, index) => ({
      points: Array.from({ length: SEGS }, () => ({ x: 0, y: 0, px: 0, py: 0 })), lag: 0.14 + (((index * 37) % 10) / 10) * 0.22, anchorX: 0, anchorY: 0, seeded: false,
    }));
    const measure = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2); width = button.offsetWidth; height = button.offsetHeight;
      const canvasWidth = width + padding * 2, canvasHeight = height + padding * 2;
      Object.assign(canvas.style, { width: `${canvasWidth}px`, height: `${canvasHeight}px`, left: `${-padding}px`, top: `${-padding}px` });
      canvas.width = Math.round(canvasWidth * dpr); canvas.height = Math.round(canvasHeight * dpr);
    };
    const local = () => { const rect = button.getBoundingClientRect(); return { x: pointer.x - rect.left + padding, y: pointer.y - rect.top + padding }; };
    const cap = (x: number, y: number) => {
      const radius = Math.min(width, height) / 2, centerY = padding + height / 2, centerX = Math.min(Math.max(x, padding + radius), padding + width - radius);
      const dx = x - centerX, dy = y - centerY, distance = Math.hypot(dx, dy) || 1e-6;
      return { centerX, centerY, radius, nx: dx / distance, ny: dy / distance, distance: distance - radius };
    };
    const kick = () => { if (!frame) frame = requestAnimationFrame(tick); };
    const drawPath = (points: Point[]) => { context.moveTo(points[0].x, points[0].y); for (let index = 1; index < points.length - 1; index++) context.quadraticCurveTo(points[index].x, points[index].y, (points[index].x + points[index + 1].x) / 2, (points[index].y + points[index + 1].y) / 2); context.lineTo(points[points.length - 1].x, points[points.length - 1].y); };
    const draw = () => { context.save(); context.strokeStyle = ink; context.lineCap = "round"; context.globalAlpha = 0.92; context.lineWidth = 1.15; for (const item of list) { context.beginPath(); drawPath(item.points); context.stroke(); } context.restore(); };
    const tick = () => {
      frame = 0; const position = local(); const edge = cap(position.x, position.y); const wanted = pointer.known && !button.disabled && edge.distance > 1 && edge.distance < reach;
      if (wanted && !active) ink = getComputedStyle(wrapper).color || ink;
      active = wanted; if (active) Object.assign(hold, position);
      extension += ((active ? 1 : 0) - extension) * (active ? 0.1 : 0.2); if (!active && extension < 0.003) extension = 0;
      const held = cap(hold.x, hold.y), perpendicularX = -held.ny, perpendicularY = held.nx, inset = Math.min(6, held.radius * 0.5);
      list.forEach((item, index) => {
        const offset = index - (count - 1) / 2, base = cap(held.centerX + held.nx * (held.radius - inset) + perpendicularX * offset * SPREAD, held.centerY + held.ny * (held.radius - inset) + perpendicularY * offset * SPREAD);
        const targetX = base.centerX + base.nx * (base.radius - inset), targetY = base.centerY + base.ny * (base.radius - inset);
        if (!item.seeded) { item.anchorX = targetX; item.anchorY = targetY; item.points.forEach((point) => { point.x = point.px = targetX; point.y = point.py = targetY; }); item.seeded = true; }
        if (active) { item.anchorX += (targetX - item.anchorX) * 0.3; item.anchorY += (targetY - item.anchorY) * 0.3; }
        const dx = hold.x - item.anchorX, dy = hold.y - item.anchorY, distance = Math.hypot(dx, dy) || 1e-6, length = extension * Math.min(distance, reach + held.radius), segment = length / (SEGS - 1), points = item.points;
        for (let pointIndex = 1; pointIndex < points.length; pointIndex++) { const point = points[pointIndex], velocityX = (point.x - point.px) * DAMP, velocityY = (point.y - point.py) * DAMP; point.px = point.x; point.py = point.y; point.x += velocityX; point.y += velocityY + GRAVITY * extension; }
        const tip = points[points.length - 1]; tip.x += (item.anchorX + (dx / distance) * length - tip.x) * item.lag; tip.y += (item.anchorY + (dy / distance) * length - tip.y) * item.lag; points[0].x = points[0].px = item.anchorX; points[0].y = points[0].py = item.anchorY;
        for (let loop = 0; loop < 6; loop++) for (let pointIndex = 1; pointIndex < points.length; pointIndex++) { const previous = points[pointIndex - 1], point = points[pointIndex], dx2 = point.x - previous.x, dy2 = point.y - previous.y, length2 = Math.hypot(dx2, dy2) || 1e-6; if (length2 > segment) { const difference = (length2 - segment) / length2; if (pointIndex === 1) { point.x -= dx2 * difference; point.y -= dy2 * difference; } else { previous.x += dx2 * difference * 0.5; previous.y += dy2 * difference * 0.5; point.x -= dx2 * difference * 0.5; point.y -= dy2 * difference * 0.5; } } }
      });
      context.setTransform(dpr, 0, 0, dpr, 0, 0); context.clearRect(0, 0, width + padding * 2, height + padding * 2); if (extension > 0.01) draw();
      if (active || extension > 0) kick(); else list.forEach((item) => { item.seeded = false; });
    };
    const onMove = (event: PointerEvent) => { if (event.pointerType === "touch" && event.buttons === 0) return; pointer.x = event.clientX; pointer.y = event.clientY; pointer.known = true; if (frame) return; const rect = button.getBoundingClientRect(); if (event.clientX > rect.left - reach && event.clientX < rect.right + reach && event.clientY > rect.top - reach && event.clientY < rect.bottom + reach) kick(); };
    const onEnd = (event: PointerEvent) => { if (event.pointerType !== "touch") return; pointer.known = false; kick(); };
    measure(); const observer = new ResizeObserver(() => { measure(); kick(); }); observer.observe(button);
    window.addEventListener("pointermove", onMove, { passive: true }); window.addEventListener("pointerdown", onMove, { passive: true }); window.addEventListener("pointerup", onEnd, { passive: true }); window.addEventListener("pointercancel", onEnd, { passive: true });
    return () => { cancelAnimationFrame(frame); observer.disconnect(); window.removeEventListener("pointermove", onMove); window.removeEventListener("pointerdown", onMove); window.removeEventListener("pointerup", onEnd); window.removeEventListener("pointercancel", onEnd); };
  }, [reduced, reach, threads]);

  return <span ref={wrapperRef} className="relative isolate inline-flex text-foreground">
    {!reduced && <canvas ref={canvasRef} aria-hidden className="pointer-events-none absolute -z-10" />}
    <motion.button ref={setRefs} type="button" disabled={disabled} whileTap={reduced || disabled ? undefined : { scale: 0.96 }} transition={SPRING}
      className={cn("relative inline-flex select-none items-center justify-center gap-2 whitespace-nowrap rounded-full font-semibold tracking-[-0.01em]", "disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-[1.1em] [&_svg]:shrink-0", GLASS, FOCUS, SIZES[size], className)}
      style={tone ? { backgroundColor: `color-mix(in oklab, ${tone} 92%, transparent)`, color: light ? "#111111" : "#ffffff", ...style } : style} {...rest}>
      <span aria-hidden className="pointer-events-none absolute inset-x-[7%] top-[2px] h-[48%] rounded-full bg-gradient-to-b from-white/75 to-white/0 dark:from-white/20" />
      <span aria-hidden className="pointer-events-none absolute inset-x-[20%] bottom-[2px] h-[34%] rounded-full bg-gradient-to-t from-white/45 to-white/0 blur-[2px] dark:from-white/10" />
      <span className={cn("relative inline-flex items-center gap-2", tone && !light ? "[text-shadow:0_1px_1px_rgb(0_0_0/0.3)]" : "[text-shadow:0_1px_0_rgb(255_255_255/0.6)]")}>{children}</span>
    </motion.button>
  </span>;
});

export { WebShotButton as Component };
