"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Play } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { SectionHead, fade } from "./SectionHead";

/**
 * Videos — "La filmoteca Nutragen": every real film the client delivered,
 * streamed from public/videos with generated posters. Editorial masonry:
 * the landscape spot as the feature piece + portrait pieces in a clean
 * grid. Click opens an in-page theater dialog (controls, autoplay).
 * All copy follows the site-wide initial-capital orthography rule.
 */

interface Film {
  src: string;
  poster: string;
  title: string;
  caption: string;
  duration: string;
  wide?: boolean;
}

const FILMOTECA: Film[] = [
  {
    src: "/videos/nutragen-hero-web.mp4",
    poster: "/videos/posters/nutragen-hero-web.jpg",
    title: "Spot oficial · Nutragen",
    caption: "La película de marca · 1 min",
    duration: "1:00",
    wide: true,
  },
  {
    src: "/videos/video-242763909.mp4",
    poster: "/videos/posters/video-242763909.jpg",
    title: "El protocolo en laboratorio",
    caption: "Tratamiento + Moisturizer sobre mármol",
    duration: "0:08",
  },
  {
    src: "/videos/video-141336798.mp4",
    poster: "/videos/posters/video-141336798.jpg",
    title: "La fórmula en macro",
    caption: "Textura real de la crema",
    duration: "0:08",
  },
  {
    src: "/videos/video-gemini-8fb6fd96.mp4",
    poster: "/videos/posters/video-gemini-8fb6fd96.jpg",
    title: "La psoriasis por dentro · I",
    caption: "Educación visual de la raíz",
    duration: "0:20",
  },
  {
    src: "/videos/video-gemini-dc0eb139.mp4",
    poster: "/videos/posters/video-gemini-dc0eb139.jpg",
    title: "La psoriasis por dentro · II",
    caption: "Segunda pieza del protocolo",
    duration: "0:20",
  },
  {
    src: "/videos/video-nutragen-ia.mp4",
    poster: "/videos/posters/video-nutragen-ia.jpg",
    title: "Revolución Natural · IA",
    caption: "El mensaje de la nueva era",
    duration: "0:10",
  },
  {
    src: "/videos/video-mauricio-1.mp4",
    poster: "/videos/posters/video-mauricio-1.jpg",
    title: "Testimonio real · Lizeth",
    caption: "Dermatitis atópica, desde el día uno",
    duration: "0:21",
  },
  {
    src: "/videos/video-mauricio-2.mp4",
    poster: "/videos/posters/video-mauricio-2.jpg",
    title: "Origen · En el laboratorio",
    caption: "Donde todo empezó",
    duration: "1:30",
  },
];

function FilmCard({
  film,
  index,
  className = "",
  onOpen,
}: {
  film: Film;
  index: number;
  className?: string;
  onOpen: () => void;
}) {
  return (
    <motion.button
      {...fade}
      transition={{ duration: 0.7, delay: 0.05 * (index % 5) }}
      onClick={onOpen}
      data-testid={`film-card-${index}`}
      aria-label={`Reproducir video: ${film.title}`}
      className={`group relative block w-full cursor-pointer overflow-hidden rounded-3xl bg-white text-left shadow-[0_10px_34px_rgba(20,20,22,0.07)] ring-1 ring-black/5 outline-none transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_22px_54px_rgba(20,20,22,0.14)] focus-visible:ring-2 focus-visible:ring-gold ${className}`}
    >
      <div className={`relative overflow-hidden ${film.wide ? "aspect-video" : "aspect-[9/16]"}`}>
        <img
          src={film.poster}
          alt={`Miniatura del video ${film.title}`}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
        <span className="absolute inset-0 m-auto grid h-14 w-14 place-items-center rounded-full bg-gold text-graphite shadow-[0_10px_30px_rgba(212,175,55,0.5)] transition-transform duration-300 group-hover:scale-110">
          <Play size={20} className="ml-0.5 fill-current" aria-hidden />
        </span>
        <span className="absolute bottom-3 right-3 rounded-full bg-black/60 px-2.5 py-1 font-mono text-[10px] tracking-wider text-white backdrop-blur-sm">
          {film.duration}
        </span>
      </div>
      <div className="p-4 sm:p-5">
        <p className="text-[13.5px] font-semibold tracking-tight text-ink sm:text-[15px]">
          {film.title}
        </p>
        <p className="mt-1.5 font-mono text-[9px] uppercase tracking-[0.22em] text-black/45 sm:text-[9.5px]">
          {film.caption}
        </p>
      </div>
    </motion.button>
  );
}

export function Videos() {
  const [active, setActive] = useState<Film | null>(null);

  return (
    <section id="filmoteca" className="relative w-full py-24 sm:py-32">
      <div className="mx-auto max-w-[1700px] px-5 sm:px-10">
        <SectionHead
          kicker="Detrás del producto · Producción real"
          lines={[[{ t: "La " }, { t: "filmoteca", c: "gold-text glow-gold" }, { t: " Nutragen." }]]}
          titleClassName="mt-7 text-[clamp(2.2rem,4.8vw,4.4rem)] font-medium leading-[1.03] tracking-[-0.04em] text-ink"
        />

        <motion.p
          {...fade}
          transition={{ duration: 0.8 }}
          className="mt-6 max-w-xl text-[13.5px] leading-relaxed text-black/55 sm:text-[15px]"
        >
          Ocho piezas reales del universo Cosalka · Nutragen: producción,
          educación, testimonios y origen. Toca cualquiera y mira la película
          completa, sin salir de esta página.
        </motion.p>

        <div className="pointer-events-auto relative z-30 mt-12 grid grid-cols-1 gap-5 lg:grid-cols-12">
          {/* feature piece — the landscape spot */}
          <div className="lg:col-span-7">
            <FilmCard film={FILMOTECA[0]} index={0} onOpen={() => setActive(FILMOTECA[0])} />
          </div>

          {/* two portrait companions beside the spot */}
          <div className="grid grid-cols-2 gap-5 lg:col-span-5">
            <FilmCard film={FILMOTECA[1]} index={1} onOpen={() => setActive(FILMOTECA[1])} />
            <FilmCard film={FILMOTECA[2]} index={2} onOpen={() => setActive(FILMOTECA[2])} />
          </div>

          {/* the remaining five portrait pieces */}
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:col-span-12 lg:grid-cols-5">
            {FILMOTECA.slice(3).map((film, i) => (
              <FilmCard
                key={film.src}
                film={film}
                index={i + 3}
                onOpen={() => setActive(film)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ── in-page theater ───────────────────────────────────────── */}
      <Dialog open={!!active} onOpenChange={(o) => !o && setActive(null)}>
        <DialogContent
          className={`overflow-hidden bg-white p-0 sm:rounded-3xl ${
            active?.wide ? "sm:max-w-4xl" : "sm:max-w-[440px]"
          }`}
        >
          <DialogTitle className="sr-only">{active?.title}</DialogTitle>
          <DialogDescription className="sr-only">{active?.caption}</DialogDescription>
          {active && (
            <div>
              <video
                key={active.src}
                src={active.src}
                poster={active.poster}
                controls
                autoPlay
                playsInline
                preload="auto"
                data-testid="film-player"
                className={`w-full bg-black ${active.wide ? "aspect-video" : "aspect-[9/16] object-cover"}`}
              />
              <div className="flex items-center justify-between gap-4 px-5 py-4">
                <div>
                  <p className="text-sm font-semibold tracking-tight text-ink">{active.title}</p>
                  <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.24em] text-black/45">
                    {active.caption}
                  </p>
                </div>
                <span className="shrink-0 font-mono text-[10px] tracking-wider text-black/40">
                  {active.duration}
                </span>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
