'use client';

import React, { useEffect, useMemo, useState } from 'react';
import localFont from 'next/font/local';
import { Cinzel, Playfair_Display } from 'next/font/google';
import { useReducedMotion } from 'motion/react';
import { useAudio } from '@/contexts/audio-context';
import { useSiteConfig } from '@/hooks/use-site-config';
import { normalizeWeddingDateString, parseWeddingDate } from '@/lib/wedding-date';

const loadingCinzel = Cinzel({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-loading-cinzel',
});

const loadingSeasons = localFont({
  src: '../../Font/Fontspring-DEMO-theseasons-reg.otf',
  display: 'swap',
  variable: '--font-loading-seasons',
});

const loadingPlayfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500'],
  style: ['normal', 'italic'],
  variable: '--font-loading-playfair',
});

const BOKEH_ORBS = [
  { top: '8%', left: '12%', size: 120, opacity: 0.14 },
  { top: '14%', left: '78%', size: 90, opacity: 0.1 },
  { top: '42%', left: '8%', size: 70, opacity: 0.08 },
  { top: '38%', left: '88%', size: 100, opacity: 0.11 },
  { top: '62%', left: '22%', size: 55, opacity: 0.07 },
  { top: '72%', left: '68%', size: 85, opacity: 0.09 },
  { top: '28%', left: '48%', size: 140, opacity: 0.06 },
] as const;

interface LoadingScreenProps {
  onComplete: () => void;
  onFadeStart?: () => void;
}

const LOADING_MS = 9000;
const FADE_OUT_MS = 1400;

const INFINITY_PATH =
  'M93.9,46.4c9.3,9.5,13.8,17.9,23.5,17.9s17.5-7.8,17.5-17.5s-7.8-17.6-17.5-17.5c-9.7,0.1-13.3,7.2-22.1,17.1c-8.9,8.8-15.7,17.9-25.4,17.9s-17.5-7.8-17.5-17.5s7.8-17.5,17.5-17.5S86.2,38.6,93.9,46.4z';

function getDaysUntilWedding(from: Date, weddingDay: Date): number {
  const start = new Date(from.getFullYear(), from.getMonth(), from.getDate());
  const end = new Date(weddingDay.getFullYear(), weddingDay.getMonth(), weddingDay.getDate());
  const diffMs = end.getTime() - start.getTime();
  return Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
}

const cornerDeco = [
  { src: '/deco/top-left.png', position: 'top-0 left-0', glow: 'drop-shadow-[0_0_22px_rgba(212,175,55,0.32)]' },
  { src: '/deco/top-right.png', position: 'top-0 right-0', glow: 'drop-shadow-[0_0_22px_rgba(212,175,55,0.32)]' },
  { src: '/deco/bottom-left.png', position: 'bottom-0 left-0', glow: 'drop-shadow-[0_0_26px_rgba(212,175,55,0.38)]' },
  { src: '/deco/bottom-right.png', position: 'bottom-0 right-0', glow: 'drop-shadow-[0_0_26px_rgba(212,175,55,0.38)]' },
] as const;

const SPARKLE_LAYOUT = [
  { top: '5%', left: '16%', size: 8, delay: 0, dur: 2.8 },
  { top: '10%', left: '74%', size: 11, delay: 0.6, dur: 3.4 },
  { top: '20%', left: '6%', size: 7, delay: 1.1, dur: 2.5 },
  { top: '16%', left: '90%', size: 9, delay: 0.3, dur: 3.1 },
  { top: '32%', left: '3%', size: 7, delay: 1.8, dur: 2.9 },
  { top: '38%', left: '95%', size: 10, delay: 0.9, dur: 3.6 },
  { top: '56%', left: '10%', size: 10, delay: 0.2, dur: 3.2 },
  { top: '52%', left: '84%', size: 8, delay: 1.4, dur: 2.7 },
  { top: '70%', left: '5%', size: 9, delay: 0.7, dur: 3.5 },
  { top: '66%', left: '92%', size: 12, delay: 1.2, dur: 2.6 },
  { top: '84%', left: '24%', size: 9, delay: 0.5, dur: 3.3 },
  { top: '80%', left: '64%', size: 7, delay: 1.6, dur: 2.4 },
  { top: '90%', left: '44%', size: 10, delay: 0.8, dur: 3.8 },
  { top: '24%', left: '46%', size: 6, delay: 2, dur: 2.2 },
  { top: '46%', left: '22%', size: 5, delay: 1.3, dur: 2.1 },
  { top: '48%', left: '72%', size: 6, delay: 1.9, dur: 2.3 },
  { top: '13%', left: '40%', size: 7, delay: 0.4, dur: 3 },
  { top: '60%', left: '50%', size: 6, delay: 1.1, dur: 2.8 },
  { top: '93%', left: '16%', size: 9, delay: 0.6, dur: 3.4 },
  { top: '95%', left: '80%', size: 8, delay: 1.5, dur: 3.1 },
] as const;

const goldText: React.CSSProperties = {
  background:
    'linear-gradient(168deg, #fffef8 0%, #fceabb 14%, #f5d76e 32%, #c9a227 48%, #a67c00 54%, #e8c547 70%, #fff8dc 86%, #d4af37 100%)',
  WebkitBackgroundClip: 'text',
  backgroundClip: 'text',
  color: 'transparent',
  filter:
    'drop-shadow(0 1px 0 rgba(139, 105, 20, 0.85)) drop-shadow(0 2px 5px rgba(0, 0, 0, 0.95)) drop-shadow(0 0 18px rgba(255, 215, 100, 0.5))',
};

function SparkleStar({
  top,
  left,
  size,
  delay,
  dur,
  variant = 'default',
}: {
  top: string;
  left: string;
  size: number;
  delay: number;
  dur: number;
  variant?: 'default' | 'soft' | 'spark';
}) {
  const variantClass =
    variant === 'soft'
      ? 'loading-star-soft'
      : variant === 'spark'
        ? 'loading-star-spark'
        : 'loading-star-default';

  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      className={`loading-star pointer-events-none absolute z-[25] text-[#fceabb] ${variantClass}`}
      style={
        {
          top,
          left,
          width: size,
          height: size,
          '--delay': `${delay}s`,
          '--dur': `${dur}s`,
        } as React.CSSProperties
      }
    >
      <path
        fill="currentColor"
        d="M12 0.5l2.2 7.4L22 10l-7.8 2.1L12 20l-2.2-7.9L2 10l7.8-2.1L12 0.5z"
      />
      <path fill="#fff8dc" opacity="0.85" d="M12 4l1.1 3.8L17 9l-3.9 1.1L12 14l-1.1-3.9L7 9l3.9-1.2L12 4z" />
    </svg>
  );
}

function InfinityLoader() {
  return (
    <div
      className="relative mx-auto h-9 w-[4.5rem] sm:h-11 sm:w-24 md:h-12 md:w-28 lg:h-14 lg:w-32"
      aria-hidden
    >
      <svg
        className="absolute left-1/2 top-1/2 h-full w-full -translate-x-1/2 -translate-y-1/2"
        preserveAspectRatio="xMidYMid meet"
        viewBox="0 0 187.3 93.7"
      >
        <path
          d={INFINITY_PATH}
          fill="none"
          stroke="#d4af37"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeMiterlimit={10}
          opacity={0.15}
        />
        <path
          className="loading-infinity-outline"
          d={INFINITY_PATH}
          fill="none"
          stroke="#f5e6a8"
          strokeWidth="2.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeMiterlimit={10}
        />
      </svg>
    </div>
  );
}

function OrnamentalStar({ className, gradId = 'loadingStarGrad' }: { className?: string; gradId?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className={className}>
      <defs>
        <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fff8dc" />
          <stop offset="45%" stopColor="#d4af37" />
          <stop offset="100%" stopColor="#f5e6a8" />
        </linearGradient>
      </defs>
      <path fill={`url(#${gradId})`} d="M12 1l2.5 8.2L22 11.5l-7.5 2.3L12 22l-2.5-8.2L2 11.5l7.5-2.3L12 1z" />
    </svg>
  );
}

function BokehLayer() {
  return (
    <>
      {BOKEH_ORBS.map((orb, i) => (
        <div
          key={i}
          aria-hidden
          className="loading-bokeh pointer-events-none absolute z-[12] rounded-full bg-[#ffe9a8]"
          style={{
            top: orb.top,
            left: orb.left,
            width: orb.size,
            height: orb.size,
            opacity: orb.opacity,
            filter: 'blur(28px)',
            animationDelay: `${i * 0.45}s`,
          }}
        />
      ))}
    </>
  );
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete, onFadeStart }) => {
  const siteConfig = useSiteConfig();
  const { audioRef } = useAudio();
  const reduceMotion = useReducedMotion();
  const [fadeOut, setFadeOut] = useState(false);
  const sparkles = useMemo(() => SPARKLE_LAYOUT, []);

  const weddingDay = useMemo(() => {
    const parsed = parseWeddingDate(siteConfig.wedding.date);
    const d = new Date(`${parsed.month} ${parsed.day}, ${parsed.year}`);
    return Number.isNaN(d.getTime()) ? new Date() : d;
  }, [siteConfig.wedding.date]);

  const weddingDateDisplay = useMemo(() => {
    const raw = normalizeWeddingDateString(siteConfig.wedding.date) || siteConfig.wedding.date;
    return raw.toUpperCase();
  }, [siteConfig.wedding.date]);

  const weddingPlace = useMemo(() => {
    const raw =
      siteConfig.reception?.location ||
      siteConfig.ceremony.location ||
      siteConfig.wedding.venue ||
      '';
    return raw.toUpperCase();
  }, [siteConfig.ceremony.location, siteConfig.reception?.location, siteConfig.wedding.venue]);

  const daysUntil = useMemo(() => getDaysUntilWedding(new Date(), weddingDay), [weddingDay]);
  const daysLabel = daysUntil === 1 ? 'more day to go' : 'more days to go';

  const coupleAlt = `${siteConfig.couple.groomNickname} and ${siteConfig.couple.brideNickname}`;

  useEffect(() => {
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    return () => {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
    };
  }, []);

  useEffect(() => {
    const audioEl = audioRef.current;
    if (!audioEl) return;

    audioEl.loop = true;

    const startMusic = async () => {
      try {
        await audioEl.play();
      } catch {
        audioEl.muted = true;
        try {
          await audioEl.play();
        } catch {
          audioEl.muted = false;
        }
      }
    };

    void startMusic();
  }, [audioRef]);

  useEffect(() => {
    const loadingMs = reduceMotion ? 2000 : LOADING_MS;
    const fadeMs = reduceMotion ? 200 : FADE_OUT_MS;

    const completeTimer = setTimeout(() => {
      onFadeStart?.();
      setFadeOut(true);
      setTimeout(onComplete, fadeMs);
    }, loadingMs);

    return () => clearTimeout(completeTimer);
  }, [onComplete, onFadeStart, reduceMotion]);

  return (
    <div
      className={`${loadingCinzel.variable} ${loadingSeasons.variable} ${loadingPlayfair.variable} loading-screen-fade fixed inset-0 z-50 flex flex-col items-center justify-start overflow-hidden md:justify-center${fadeOut ? ' is-fading' : ''}`}
      aria-live="polite"
      aria-busy={!fadeOut}
      aria-label="Loading invitation"
      style={{ pointerEvents: fadeOut ? 'none' : 'auto' }}
    >
      <style>{`
        .loading-font-cinzel {
          font-family: var(--font-loading-cinzel), var(--font-cinzel), 'Cinzel', serif;
        }
        .loading-font-seasons {
          font-family: var(--font-loading-seasons), 'The Seasons', 'Times New Roman', serif;
          font-weight: 400;
        }
        .loading-font-playfair {
          font-family: var(--font-loading-playfair), 'Playfair Display', Georgia, serif;
        }
        .loading-text-glow {
          text-shadow:
            0 1px 0 rgba(139, 105, 20, 0.55),
            0 2px 6px rgba(0, 0, 0, 0.95),
            0 0 16px rgba(212, 175, 55, 0.35);
        }
        @keyframes loading-bokeh-drift {
          0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
          50% { transform: translate3d(6px, -8px, 0) scale(1.06); }
        }
        .loading-bokeh {
          animation: loading-bokeh-drift 9s ease-in-out infinite;
        }
        @keyframes loading-twinkle {
          0%, 100% {
            opacity: 0.15;
            transform: scale(0.6) rotate(0deg);
            filter: drop-shadow(0 0 1px rgba(255, 248, 220, 0.15));
          }
          30% {
            opacity: 0.55;
            transform: scale(0.88) rotate(10deg);
            filter: drop-shadow(0 0 3px rgba(255, 248, 220, 0.35));
          }
          50% {
            opacity: 1;
            transform: scale(1.12) rotate(22deg);
            filter: drop-shadow(0 0 8px rgba(255, 248, 220, 0.95)) drop-shadow(0 0 14px rgba(212, 175, 55, 0.45));
          }
          70% {
            opacity: 0.65;
            transform: scale(0.92) rotate(8deg);
            filter: drop-shadow(0 0 4px rgba(255, 248, 220, 0.4));
          }
        }
        @keyframes loading-twinkle-spark {
          0%, 100% { opacity: 0.1; transform: scale(0.5); }
          40% { opacity: 0.35; transform: scale(0.75); }
          48% { opacity: 1; transform: scale(1.25); filter: drop-shadow(0 0 12px #fff8dc); }
          52% { opacity: 1; transform: scale(1.15); }
          60% { opacity: 0.4; transform: scale(0.8); }
        }
        @keyframes loading-deco-breathe {
          0%, 100% { opacity: 0.9; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.015); }
        }
        @keyframes loading-fade-in-up {
          from {
            opacity: 0;
            transform: translateY(14px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .loading-screen-fade {
          transition: opacity 1.4s ease;
        }
        .loading-screen-fade.is-fading {
          opacity: 0;
        }
        .animate-fade-in-up {
          animation: loading-fade-in-up 1s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        .loading-star {
          transform-origin: center center;
          will-change: transform, opacity, filter;
        }
        .loading-star-default {
          animation: loading-twinkle var(--dur, 3s) cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite;
          animation-delay: var(--delay, 0s);
        }
        .loading-star-soft {
          animation: loading-twinkle calc(var(--dur, 3s) * 1.35) cubic-bezier(0.4, 0, 0.6, 1) infinite;
          animation-delay: var(--delay, 0s);
        }
        .loading-star-spark {
          animation: loading-twinkle-spark calc(var(--dur, 3s) * 0.85) ease-in-out infinite;
          animation-delay: var(--delay, 0s);
        }
        .loading-deco-corner {
          animation: loading-deco-breathe 4s ease-in-out infinite;
        }
        .loading-infinity-outline {
          stroke-dasharray: 2.42777px, 242.77666px;
          stroke-dashoffset: 0;
          animation: loading-infinity-anim 1.6s linear infinite;
        }
        @keyframes loading-infinity-anim {
          12.5% {
            stroke-dasharray: 33.98873px, 242.77666px;
            stroke-dashoffset: -26.70543px;
          }
          43.75% {
            stroke-dasharray: 84.97183px, 242.77666px;
            stroke-dashoffset: -84.97183px;
          }
          100% {
            stroke-dasharray: 2.42777px, 242.77666px;
            stroke-dashoffset: -240.34889px;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .loading-star-default,
          .loading-star-soft,
          .loading-star-spark,
          .loading-deco-corner,
          .loading-infinity-outline,
          .loading-bokeh,
          .animate-fade-in-up {
            animation: none !important;
          }
        }
        @media (min-width: 768px) {
          .loading-desktop-shell {
            justify-content: space-between;
            padding-top: clamp(1.5rem, 4vh, 3.5rem);
            padding-bottom: clamp(6.5rem, 12vh, 9rem);
            gap: clamp(0.75rem, 2vh, 1.75rem);
            max-width: min(92vw, 52rem);
          }
          .loading-desktop-header,
          .loading-desktop-footer {
            flex-shrink: 0;
            width: 100%;
          }
          .loading-desktop-hero {
            flex: 1 1 auto;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 0;
            width: 100%;
          }
          .loading-desktop-days {
            font-size: clamp(0.9375rem, 0.48vw + 0.58rem, 1.375rem);
            letter-spacing: clamp(0.14em, 0.06em + 0.14vw, 0.22em);
          }
          .loading-desktop-days-count {
            font-family: var(--font-loading-playfair), 'Playfair Display', Georgia, serif;
            font-weight: 600;
            font-style: italic;
            font-size: clamp(1.2rem, 0.55rem + 3.2vw, 1.85rem);
            line-height: 1;
            letter-spacing: 0.04em;
            font-variant-numeric: tabular-nums;
            font-feature-settings: 'tnum' 1;
            background: linear-gradient(
              168deg,
              #fffef8 0%,
              #fceabb 14%,
              #f5d76e 32%,
              #c9a227 48%,
              #a67c00 54%,
              #e8c547 70%,
              #fff8dc 86%,
              #d4af37 100%
            );
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
            filter:
              drop-shadow(0 1px 0 rgba(139, 105, 20, 0.85))
              drop-shadow(0 2px 5px rgba(0, 0, 0, 0.95))
              drop-shadow(0 0 16px rgba(255, 215, 100, 0.45));
          }
          @media (max-height: 680px) {
            .loading-desktop-days-count {
              font-size: clamp(1.05rem, 0.48rem + 2.6vw, 1.35rem);
            }
          }
          @media (min-width: 768px) {
            .loading-desktop-days-count {
              font-size: clamp(1.35rem, 0.4rem + 1.45vw, 1.95rem);
              letter-spacing: 0.05em;
            }
          }
          .loading-desktop-label {
            font-size: clamp(0.5625rem, 0.18vw + 0.44rem, 0.75rem);
            letter-spacing: clamp(0.36em, 0.12em + 0.22vw, 0.48em);
          }
          .loading-desktop-date-value {
            font-size: clamp(0.875rem, 0.42vw + 0.52rem, 1.25rem);
            letter-spacing: clamp(0.14em, 0.05em + 0.12vw, 0.26em);
            font-weight: 600;
          }
          .loading-desktop-tagline {
            font-size: clamp(0.75rem, 0.32vw + 0.5rem, 1rem);
            letter-spacing: clamp(0.16em, 0.06em + 0.12vw, 0.24em);
            max-width: min(36rem, 92%);
          }
          .loading-desktop-body {
            font-size: clamp(0.8125rem, 0.3vw + 0.58rem, 1.0625rem);
            line-height: 1.65;
            max-width: min(34rem, 88%);
          }
          .loading-desktop-loader-label {
            font-size: clamp(0.625rem, 0.2vw + 0.44rem, 0.8125rem);
            letter-spacing: clamp(0.32em, 0.1em + 0.16vw, 0.42em);
          }
          .loading-desktop-img-save {
            width: min(36vw, 24rem) !important;
            max-width: 100%;
          }
          .loading-desktop-img-names {
            width: min(40vw, 32rem) !important;
            max-width: 100%;
          }
          .loading-desktop-img-forever {
            width: min(30vw, 19rem) !important;
            max-width: 100%;
          }
          .loading-desktop-details {
            max-width: min(34rem, 92%);
            padding: clamp(0.875rem, 1.2vw + 0.5rem, 1.375rem) clamp(1rem, 1.5vw + 0.5rem, 1.75rem);
          }
        }
        @media (min-width: 1280px) {
          .loading-desktop-shell {
            max-width: min(90vw, 56rem);
          }
          .loading-desktop-img-save {
            width: min(32vw, 26rem) !important;
          }
          .loading-desktop-img-names {
            width: min(36vw, 34rem) !important;
          }
        }
      `}</style>

      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat md:hidden"
        style={{ backgroundImage: 'url(/image/mobile.jpg)' }}
        aria-hidden
      />
      <div
        className="absolute inset-0 hidden bg-cover bg-[center_18%] bg-no-repeat md:block lg:bg-center"
        style={{ backgroundImage: 'url(/image/desktop.jpg)' }}
        aria-hidden
      />

      <div className="pointer-events-none absolute inset-0 bg-[#0b0e14]/18" aria-hidden />
      <BokehLayer />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_85%_60%_at_50%_38%,rgba(255,215,100,0.09),transparent_55%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_50%_35%_at_50%_45%,rgba(20,28,48,0.15),transparent_70%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#0b0e14]/62 via-[#0b0e14]/22 to-[#0b0e14]/68"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35] mix-blend-soft-light"
        style={{
          backgroundImage:
            'radial-gradient(circle at 20% 30%, rgba(255,248,220,0.08) 0%, transparent 45%), radial-gradient(circle at 80% 70%, rgba(212,175,55,0.06) 0%, transparent 40%)',
        }}
        aria-hidden
      />

      {sparkles.map((star, i) => (
        <SparkleStar
          key={i}
          {...star}
          variant={i % 5 === 0 ? 'spark' : i % 2 === 0 ? 'soft' : 'default'}
        />
      ))}

      {cornerDeco.map(({ src, position, glow }, i) => (
        <img
          key={src}
          src={src}
          alt=""
          aria-hidden
          className={`loading-deco-corner pointer-events-none absolute ${position} z-20 h-auto w-[min(28vw,5.75rem)] max-[height:680px]:w-[5rem] object-contain sm:w-[min(28vw,10rem)] md:w-[min(20vw,15rem)] lg:w-[min(16vw,19rem)] xl:w-[min(14vw,22rem)] ${glow}`}
          style={{ animationDelay: `${i * 0.35}s` }}
        />
      ))}

      <div className="loading-desktop-shell relative z-30 grid min-h-[100dvh] w-full max-w-lg grid-rows-[auto_minmax(0,1fr)_auto] gap-y-0 px-2 pb-[calc(4.75rem+env(safe-area-inset-bottom))] pt-[max(0.625rem,env(safe-area-inset-top))] max-[height:680px]:gap-y-0 max-[height:680px]:pb-[calc(4.25rem+env(safe-area-inset-bottom))] sm:gap-y-1 sm:px-6 md:flex md:min-h-[100dvh] md:flex-col md:items-center md:px-12 lg:px-16">
        <div className="loading-desktop-header relative mt-8 flex w-full flex-col items-center max-[height:680px]:mt-6 sm:mt-10 md:mt-0">
          <OrnamentalStar
            gradId="loadingStarGradA"
            className="absolute -left-0.5 top-0 h-3 w-3 opacity-75 max-[height:680px]:hidden sm:-left-1 sm:h-3.5 sm:w-3.5 md:-left-10 md:-top-3 md:block md:h-7 md:w-7 lg:-left-12 lg:h-8 lg:w-8"
          />
          <OrnamentalStar
            gradId="loadingStarGradB"
            className="absolute -right-0.5 top-0 h-3 w-3 opacity-75 max-[height:680px]:hidden sm:-right-1 sm:h-3.5 sm:w-3.5 md:-right-10 md:-top-3 md:block md:h-7 md:w-7 lg:-right-12 lg:h-8 lg:w-8"
          />
          <img
            src="/image/save-the-date.png"
            alt="Save the Date"
            className="loading-desktop-img-save h-auto w-[min(78vw,11.5rem)] max-w-full object-contain drop-shadow-[0_4px_22px_rgba(0,0,0,0.85)] drop-shadow-[0_0_28px_rgba(212,175,55,0.25)] animate-fade-in-up max-[height:680px]:w-[min(72vw,10.5rem)] sm:w-[min(70vw,14rem)]"
          />
          <p className="loading-desktop-days loading-font-seasons loading-text-glow mt-2 text-sm font-normal uppercase tracking-[0.18em] text-[#fff8dc] max-[height:680px]:mt-1.5 max-[height:680px]:text-[11px] sm:mt-2.5 sm:text-base md:mt-3">
            <span className="loading-desktop-days-count loading-font-playfair">{daysUntil}</span>{' '}
            {daysLabel}
          </p>
        </div>

        <div className="loading-desktop-hero flex min-h-0 items-center justify-center px-0.5 py-1 max-[height:680px]:py-0 sm:px-2">
          <img
            src="/image/couple-name.png"
            alt={coupleAlt}
            className="loading-desktop-img-names h-auto w-full max-h-[min(34dvh,11.5rem)] max-w-full object-contain object-center drop-shadow-[0_6px_28px_rgba(0,0,0,0.9)] drop-shadow-[0_0_32px_rgba(212,175,55,0.35)] animate-fade-in-up max-[height:680px]:max-h-[min(30dvh,10rem)] sm:max-h-[min(38dvh,14rem)] md:max-h-[min(42vh,22rem)]"
            style={{ animationDelay: '0.12s' }}
          />
        </div>

        <div className="loading-desktop-footer mx-auto -mt-3 w-full max-w-sm px-1 text-center max-[height:680px]:-mt-4 max-[height:680px]:max-w-[18rem] sm:-mt-5 sm:max-w-md md:mt-0">
          <img
            src="/image/a-beautiful-forever-is-about-to-begin.png"
            alt="A beautiful forever is about to begin"
            className="loading-desktop-img-forever mx-auto h-auto w-[min(92vw,15.5rem)] max-w-full object-contain drop-shadow-[0_0_18px_rgba(212,175,55,0.45)] max-[height:680px]:w-[min(88vw,13.5rem)] sm:w-[min(78vw,16rem)]"
          />

          <div className="loading-desktop-details relative mx-auto mt-3 grid max-w-md grid-cols-2 gap-3 rounded-none border border-[#d4af37]/55 bg-[#04080f]/52 py-3.5 px-3 shadow-[inset_0_0_36px_rgba(212,175,55,0.07),0_0_32px_rgba(212,175,55,0.16)] backdrop-blur-[3px] max-[height:680px]:mt-2 max-[height:680px]:py-2.5 sm:mt-4 sm:px-4 md:mt-5">
            <div
              className="pointer-events-none absolute inset-[3px] rounded-none border border-[#d4af37]/18"
              aria-hidden
            />
            <div className="border-r border-[#d4af37]/30 px-2 text-center sm:px-3">
              <p className="loading-desktop-label loading-font-cinzel text-[8px] font-medium uppercase tracking-[0.4em] text-[#f5e6a8]/95 sm:text-[9px] sm:tracking-[0.44em]">
                Date
              </p>
              <p
                className="loading-desktop-date-value loading-font-cinzel mt-1.5 text-[10px] uppercase leading-snug tracking-[0.16em] max-[height:680px]:mt-1 sm:mt-2 sm:text-sm sm:tracking-[0.2em] md:mt-2.5"
                style={goldText}
              >
                {weddingDateDisplay}
              </p>
            </div>
            <div className="px-2 text-center sm:px-3">
              <p className="loading-desktop-label loading-font-cinzel text-[8px] font-medium uppercase tracking-[0.4em] text-[#f5e6a8]/95 sm:text-[9px] sm:tracking-[0.44em]">
                Place
              </p>
              <p
                className="loading-desktop-date-value loading-font-cinzel mt-1.5 text-[10px] uppercase leading-snug tracking-[0.18em] max-[height:680px]:mt-1 sm:mt-2 sm:text-sm sm:tracking-[0.22em] md:mt-2.5"
                style={goldText}
              >
                {weddingPlace}
              </p>
            </div>
          </div>

          <p className="loading-desktop-tagline loading-font-seasons loading-text-glow mx-auto mt-3 max-w-md text-[10px] font-normal uppercase leading-snug tracking-[0.18em] text-[#fff8dc] max-[height:680px]:mt-2 max-[height:680px]:text-[9px] sm:mt-4 sm:text-xs sm:tracking-[0.2em] md:mt-5">
            The Date Is Set. The Celebration Awaits.
          </p>
          <p className="loading-desktop-body loading-font-playfair mx-auto mt-2 max-w-md text-[11px] font-normal leading-relaxed text-[#f0e6c8]/92 max-[height:680px]:mt-1.5 max-[height:680px]:text-[10px] sm:mt-3 sm:text-sm md:mt-3.5">
            You&apos;re warmly invited to celebrate our wedding with us. Please RSVP to confirm your
            attendance.
          </p>
        </div>
      </div>

      <div
        className="fixed inset-x-0 bottom-0 z-[60] flex flex-col items-center px-5 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-1 sm:px-8 md:px-12 md:pb-6 md:pt-3 lg:pb-8"
        role="progressbar"
        aria-valuetext="Loading invitation"
        aria-label="Loading invitation"
      >
        <p className="loading-desktop-loader-label loading-font-cinzel loading-text-glow mb-1.5 text-center text-[9px] font-medium uppercase tracking-[0.34em] text-[#f5e6a8] sm:text-[10px] sm:tracking-[0.4em]">
          Opening your invitation
        </p>
        <InfinityLoader />
      </div>
    </div>
  );
};
