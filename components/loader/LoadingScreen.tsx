'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Image from 'next/image';
import { useReducedMotion } from 'motion/react';
import { useSiteConfig } from '@/hooks/use-site-config';
import {
  LOADING_BG_PHOTOS,
  PhotoMarquee,
} from '@/components/loader/invite-photo-backdrop';
import './loading-screen.css';

interface LoadingScreenProps {
  onComplete: () => void;
  onFadeStart?: () => void;
}

const COUNTDOWN_BOXES = [
  { src: '/envelope/boxes (5).JPG' },
  { src: '/envelope/boxes (2).JPG' },
  { src: '/envelope/boxes (3).JPG' },
];

const STAGGER_DELAY_MS = 1500;
const BOX_TRANSITION_MS = 1200;
const TOTAL_DURATION_MS = 10000;
const FADE_OUT_MS = 1400;

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete, onFadeStart }) => {
  const siteConfig = useSiteConfig();
  const reduceMotion = useReducedMotion();
  const [fadeOut, setFadeOut] = useState(false);
  const [progress, setProgress] = useState(0);
  const [visibleBoxes, setVisibleBoxes] = useState<number[]>([]);
  const [now, setNow] = useState(() => new Date());
  const photoCopies = reduceMotion ? 1 : 2;

  const weddingDateIso = siteConfig.wedding.date;

  const countdown = useMemo(() => {
    const weddingDate = new Date(weddingDateIso);
    const diff = weddingDate.getTime() - now.getTime();
    if (diff <= 0) return { days: 0 };
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    return { days };
  }, [now, weddingDateIso]);

  const debutDateObj = useMemo(() => new Date(weddingDateIso), [weddingDateIso]);
  const debutMonthName = debutDateObj
    .toLocaleString('default', { month: 'short' })
    .toUpperCase();
  const debutDay = String(debutDateObj.getDate()).padStart(2, '0');
  const debutYear = String(debutDateObj.getFullYear());

  const countdownNumbers = [debutMonthName, debutDay, debutYear];
  const countdownLabels = ['Month', 'Day', 'Year'];

  useEffect(() => {
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    return () => {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
    };
  }, []);

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (reduceMotion) {
      setVisibleBoxes(COUNTDOWN_BOXES.map((_, i) => i));
      return;
    }
    const timers: ReturnType<typeof setTimeout>[] = [];
    COUNTDOWN_BOXES.forEach((_, i) => {
      timers.push(
        setTimeout(() => setVisibleBoxes((prev) => [...prev, i]), i * STAGGER_DELAY_MS),
      );
    });
    return () => timers.forEach(clearTimeout);
  }, [reduceMotion]);

  useEffect(() => {
    const startTime = Date.now();
    const progressInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, (elapsed / TOTAL_DURATION_MS) * 100);
      setProgress(pct);
    }, 50);

    const completeTimer = setTimeout(() => {
      setProgress(100);
      onFadeStart?.();
      setFadeOut(true);
      setTimeout(onComplete, reduceMotion ? 200 : FADE_OUT_MS);
    }, TOTAL_DURATION_MS);

    return () => {
      clearTimeout(completeTimer);
      clearInterval(progressInterval);
    };
  }, [onComplete, onFadeStart, reduceMotion]);

  const coupleNames = `${siteConfig.couple.groomNickname} & ${siteConfig.couple.brideNickname}`;

  return (
    <div
      className={`loading-screen loading-screen--invitation fixed inset-0 z-50 flex flex-col overflow-hidden overscroll-none h-dvh max-h-dvh w-screen${fadeOut ? ' is-fading' : ''}`}
      aria-live="polite"
      aria-busy={!fadeOut}
      aria-label="Loading invitation"
      style={{ pointerEvents: fadeOut ? 'none' : 'auto' }}
    >
      <div className="loading-screen__backdrop" aria-hidden="true">
        <PhotoMarquee
          photos={LOADING_BG_PHOTOS}
          copies={photoCopies}
          variant="loader"
          shuffle={false}
        />
        <div className="loading-screen__backdrop-veil" />
      </div>

      <div className="loading-screen__save-date">
        <div className="flex flex-col items-center justify-center w-full pt-8 sm:pt-12 md:pt-16 px-4 sm:px-6 flex-shrink-0">
          <div className="w-full max-w-lg mx-auto">
            <div className="flex flex-col items-center">
              <span className="loading-screen__std-headline mt-4 sm:mt-6">Save the Date</span>
              <span className="loading-screen__std-kicker">
                {countdown.days} more days to go
              </span>
            </div>
          </div>
        </div>

        <div className="loading-screen__std-names-slot">
          <div
            className="loading-screen__std-names"
            role="img"
            aria-label={coupleNames}
          >
            <span className="loading-screen__std-names-mark" aria-hidden="true" />
          </div>
        </div>

        <div className="flex items-stretch justify-center gap-3 sm:gap-4 md:gap-6 px-3 sm:px-4 pt-1 pb-3 sm:pb-4 flex-shrink-0">
          {COUNTDOWN_BOXES.map((item, i) => {
            const isVisible = visibleBoxes.includes(i);
            return (
              <div
                key={item.src}
                className="loading-screen__std-box relative flex-1 max-w-[28vw] sm:max-w-[140px] md:max-w-[160px] aspect-[3/4] overflow-hidden rounded-2xl"
                style={{
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible
                    ? 'translateY(0) scale(1)'
                    : 'translateY(28px) scale(0.94)',
                  transition: reduceMotion
                    ? 'none'
                    : `opacity ${BOX_TRANSITION_MS}ms cubic-bezier(0.4, 0, 0.2, 1), transform ${BOX_TRANSITION_MS}ms cubic-bezier(0.4, 0, 0.2, 1)`,
                }}
              >
                <Image
                  src={item.src}
                  alt={coupleNames}
                  fill
                  className="object-cover scale-105"
                  sizes="(max-width: 640px) 28vw, 160px"
                />
                <div className="loading-screen__std-box-overlay absolute inset-0" />
                <div className="absolute bottom-2 inset-x-0 sm:bottom-3 flex flex-col items-center">
                  <span className="loading-screen__std-box-num text-2xl sm:text-3xl md:text-4xl font-medium select-none leading-none text-center">
                    {countdownNumbers[i]}
                  </span>
                  <span className="loading-screen__std-box-label text-[8px] sm:text-[9px] uppercase mt-0.5">
                    {countdownLabels[i]}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex flex-col items-center w-full pt-1 pb-6 sm:pb-8 px-6 flex-shrink-0">
          <p className="loading-screen__std-eyebrow">You are invited</p>
          <p className="loading-screen__std-copy">
            We can&apos;t wait to celebrate with you
          </p>
          <div className="loading-screen__std-rule" aria-hidden="true" />
          <p className="loading-screen__std-status">Crafting your invitation experience</p>
          <div className="w-full max-w-[200px] sm:max-w-xs mx-auto">
            <div className="loading-screen__std-track">
              <div className="loading-screen__std-bar" style={{ width: `${progress}%` }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
