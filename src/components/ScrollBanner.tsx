"use client";

import { useCallback, useEffect, useRef } from "react";
import { ArrowIcon } from "./Navbar";

// Timing of the text, as a fraction of the scroll (0 = top, 1 = end)
const INTRO_FADE_END = 0.12; // first name block fades out
const MAIN_FADE_START = 0.42; // tagline block fades in once she moves right
const MAIN_FADE_END = 0.56;

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const smooth = (a: number, b: number, v: number) => {
  const t = clamp((v - a) / (b - a));
  return t * t * (3 - 2 * t);
};

export function ScrollBanner({ frames }: { frames: string[] }) {
  const count = frames.length;
  const sectionRef = useRef<HTMLElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const introRef = useRef<HTMLDivElement | null>(null);
  const mainRef = useRef<HTMLDivElement | null>(null);
  const shadeRef = useRef<HTMLDivElement | null>(null);
  const hintRef = useRef<HTMLDivElement | null>(null);

  const imgsRef = useRef<HTMLImageElement[]>([]);
  const progressRef = useRef(0);
  const drawnRef = useRef("");

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const imgs = imgsRef.current;
    if (!canvas || !imgs.length) return;

    const p = progressRef.current;
    const target = Math.min(count - 1, Math.floor(p * count));

    // use the closest frame that has finished loading (no loader screen)
    let index = target;
    while (index > 0 && !(imgs[index]?.complete && imgs[index].naturalWidth)) index--;
    const img = imgs[index];
    if (!img?.complete || !img.naturalWidth) return;

    const cw = canvas.width;
    const ch = canvas.height;
    const key = `${index}:${cw}x${ch}`;
    if (drawnRef.current === key) return;

    const ir = img.naturalWidth / img.naturalHeight;
    let dw: number;
    let dh: number;
    if (cw / ch > ir) {
      dw = cw;
      dh = cw / ir;
    } else {
      dh = ch;
      dw = ch * ir;
    }

    // Portrait screens: follow her as she moves to the right
    const portrait = ch > cw;
    const focusX = portrait ? 0.5 + 0.45 * smooth(0.25, 0.8, p) : 0.5;
    // Wide screens: keep the top of the frame (her head) in view
    const focusY = 0.25;

    const dx = (cw - dw) * focusX;
    const dy = (ch - dh) * focusY;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#050505";
    ctx.fillRect(0, 0, cw, ch);
    ctx.drawImage(img, dx, dy, dw, dh);
    drawnRef.current = key;
  }, [count]);

  // Preload: first frame right away, the rest in order
  useEffect(() => {
    const imgs = frames.map((src, i) => {
      const img = new Image();
      img.decoding = "async";
      if (i === 0) img.fetchPriority = "high";
      img.onload = () => {
        drawnRef.current = "";
        draw();
      };
      img.src = src;
      return img;
    });
    imgsRef.current = imgs;
    return () => {
      imgs.forEach((img) => (img.onload = null));
    };
  }, [frames, draw]);

  // Canvas size
  useEffect(() => {
    const resize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(window.innerWidth * dpr);
      canvas.height = Math.round(window.innerHeight * dpr);
      drawnRef.current = "";
      draw();
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, [draw]);

  // Scroll -> frame + text
  useEffect(() => {
    let ticking = false;
    const update = () => {
      ticking = false;
      const section = sectionRef.current;
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const scrollable = section.offsetHeight - window.innerHeight;
      const p = scrollable <= 0 ? 0 : clamp(-rect.top / scrollable);
      progressRef.current = p;
      draw();

      const intro = 1 - smooth(0, INTRO_FADE_END, p);
      if (introRef.current) {
        introRef.current.style.opacity = String(intro);
        introRef.current.style.transform = `translateY(${(1 - intro) * -16}px)`;
        introRef.current.style.pointerEvents = intro > 0.5 ? "auto" : "none";
      }
      if (hintRef.current) hintRef.current.style.opacity = String(intro);

      const main = smooth(MAIN_FADE_START, MAIN_FADE_END, p);
      if (mainRef.current) {
        mainRef.current.style.opacity = String(main);
        mainRef.current.style.transform = `translateY(${(1 - main) * 24}px)`;
        mainRef.current.style.pointerEvents = main > 0.5 ? "auto" : "none";
      }
      if (shadeRef.current) shadeRef.current.style.opacity = String(main);
    };
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    update();
    return () => window.removeEventListener("scroll", onScroll);
  }, [draw]);

  return (
    <section ref={sectionRef} className="scroll-banner relative">
      <div className="sticky top-0 h-dvh w-full overflow-hidden bg-background">
        {/* first frame shows instantly while the canvas warms up */}
        <div
          aria-hidden
          className="absolute inset-0 bg-cover"
          style={{ backgroundImage: `url(${frames[0]})`, backgroundPosition: "center 25%" }}
        />
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />

        {/* readability shades */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[45%] bg-gradient-to-t from-black/85 via-black/40 to-transparent"
        />
        <div
          ref={shadeRef}
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent opacity-0"
        />

        {/* Intro: name over the centered portrait */}
        <div
          ref={introRef}
          className="absolute inset-x-0 bottom-0 z-10 flex flex-col items-center px-6 pb-20 text-center md:pb-24"
        >
          <p className="mb-5 flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em] text-white/80 md:text-[13px]">
            <span aria-hidden className="text-base leading-none">&#8627;</span>
            The official site of Keturah Hamilton
          </p>
          <h1 className="text-[clamp(3.2rem,10vw,9.5rem)] font-bold leading-[0.9] tracking-[-0.055em] text-white">
            Keturah Hamilton
          </h1>
        </div>

        {/* Main: tagline on the left once she moves to the right */}
        <div
          ref={mainRef}
          className="absolute inset-x-0 bottom-0 z-10 px-6 pb-16 opacity-0 md:inset-y-0 md:flex md:items-center md:px-12 md:pb-0 lg:px-20"
        >
          <div className="max-w-[640px] md:pt-16">
            <p className="mb-6 flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em] text-white/70 md:text-[13px]">
              <span aria-hidden className="text-base leading-none">&#8627;</span>
              Keturah Hamilton
            </p>
            <h2 className="text-[clamp(2.9rem,7vw,7rem)] font-bold leading-[0.92] tracking-[-0.055em]">
              <span className="block text-white">On Stage,</span>
              <span className="block text-white">On Screen,</span>
              <span className="block text-[#8c8c8c]">On Purpose.</span>
            </h2>
            <p className="mt-6 max-w-[440px] text-[15px] leading-relaxed text-white/65 md:mt-8 md:text-[17px]">
              Jamaican-born actress, model, author, producer and philanthropist,
              from St. Catherine to Chicago to Los Angeles, telling stories that matter.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3 md:mt-10">
              <a
                href="#"
                className="group flex h-[54px] items-center gap-4 rounded-full bg-white pl-6 pr-1.5 text-[15px] font-semibold text-[#141414] md:text-[16px]"
              >
                View Gallery
                <span className="grid h-10 w-10 place-items-center rounded-full bg-[#141414] text-white transition-transform group-hover:rotate-45">
                  <ArrowIcon className="h-4 w-4" />
                </span>
              </a>
              <a
                href="#"
                className="flex h-[54px] items-center rounded-full border border-white/25 px-7 text-[15px] font-semibold text-white transition-colors hover:bg-white/10 md:text-[16px]"
              >
                About Keturah
              </a>
            </div>
          </div>
        </div>

        {/* scroll hint */}
        <div
          ref={hintRef}
          className="pointer-events-none absolute inset-x-0 bottom-6 z-10 flex justify-center"
        >
          <span className="text-[10px] font-medium uppercase tracking-[0.3em] text-white/45">
            Scroll &darr;
          </span>
        </div>
      </div>
    </section>
  );
}
