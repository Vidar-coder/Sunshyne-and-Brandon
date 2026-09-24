'use client';

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import Image from 'next/image';
import {
  motion,
  useReducedMotion,
  type Transition,
  type Variants,
} from 'motion/react';
import { useSiteConfig } from '@/hooks/use-site-config';
import { normalizeWeddingDateString, parseWeddingDate } from '@/lib/wedding-date';
import './envelope-invite.css';

const HERO_SPARKLE_LAYOUT = [
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

function HeroSparkleStar({
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
      ? 'env-invite-star-soft'
      : variant === 'spark'
        ? 'env-invite-star-spark'
        : 'env-invite-star-default';

  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      className={`env-invite-star ${variantClass}`}
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

interface HeroProps {
  onOpen: () => void;
  onTransitionStart?: () => void;
  visible: boolean;
  enterFromLoading?: boolean;
}

const focusLiftEase: Transition = { duration: 1.15, ease: [0.22, 1, 0.36, 1] };
const revealEntryEase: Transition = { duration: 0.9, ease: [0.22, 1, 0.36, 1] };
const buttonEntryEase: Transition = { duration: 0.95, ease: [0.16, 1, 0.3, 1] };

type EnvelopePhase =
  | 'idle'
  | 'seal-press'
  | 'seal-break'
  | 'flap-open'
  | 'rising'
  | 'photos'
  | 'revealed'
  | 'cta';

function getFocusLiftPhase(phase: EnvelopePhase): 'idle' | 'opening' | 'photos' | 'revealed' | 'cta' {
  if (phase === 'idle') return 'idle';
  if (
    phase === 'seal-press' ||
    phase === 'seal-break' ||
    phase === 'flap-open' ||
    phase === 'rising'
  ) {
    return 'opening';
  }
  if (phase === 'photos') return 'photos';
  if (phase === 'revealed') return 'revealed';
  return 'cta';
}

const letterRiseDurationSec = 3.75;

const letterRiseTransition: Transition = {
  duration: letterRiseDurationSec,
  times: [0, 0.72, 1],
  ease: [0.16, 1, 0.28, 1],
  y: { duration: letterRiseDurationSec, times: [0, 0.72, 1], ease: [0.12, 1, 0.24, 1] },
  scale: { duration: letterRiseDurationSec, times: [0, 0.68, 1], ease: [0.34, 1.15, 0.64, 1] },
  rotate: {
    duration: letterRiseDurationSec * 0.92,
    times: [0, 0.7, 1],
    ease: [0.22, 1, 0.36, 1],
  },
  filter: { duration: letterRiseDurationSec * 0.55, times: [0, 0.55, 1], ease: 'easeOut' },
};
const flapEase: Transition = { duration: 1.1, ease: [0.65, 0, 0.35, 1] };
const inviteExitEase: Transition = { duration: 1.65, ease: [0.22, 1, 0.36, 1], delay: 0.75 };
const inviteEnterEase: Transition = { duration: 1.2, ease: [0.22, 1, 0.36, 1] };
const letterExitEase: Transition = { duration: 1.55, ease: [0.16, 1, 0.3, 1] };
const inviteRevealLeadMs = 460;
const INVITE_EXIT_MS = 2500;

const HERO_BG_VIDEO = `/background_music/${encodeURIComponent(
  'Fast Motion Night Full of Stars 4K Relaxing Screensaver 3 online video cutter com - Vlogs Ysu (1080p) (online-video-cutter.com).mp4',
)}`;

export const Hero: React.FC<HeroProps> = ({
  onOpen,
  onTransitionStart,
  visible,
  enterFromLoading = false,
}) => {
  const siteConfig = useSiteConfig();
  const reduceMotion = useReducedMotion();
  const openedRef = useRef(false);
  const bgVideoRef = useRef<HTMLVideoElement>(null);
  const enterBtnRef = useRef<HTMLButtonElement>(null);
  const [mounted, setMounted] = useState(false);
  const [phase, setPhase] = useState<EnvelopePhase>('idle');
  const [liveMessage, setLiveMessage] = useState('');
  const [isExiting, setIsExiting] = useState(false);
  const [isMobileViewport, setIsMobileViewport] = useState(false);

  const groomName = siteConfig.couple.groomNickname;
  const brideName = siteConfig.couple.brideNickname;
  const coupleNames = `${groomName} & ${brideName}`;

  const letterDateNumeric = useMemo(() => {
    const parsed = parseWeddingDate(siteConfig.ceremony.date ?? siteConfig.wedding.date);
    const wedding = new Date(`${parsed.month} ${parsed.day}, ${parsed.year}`);
    if (Number.isNaN(wedding.getTime())) {
      const monthDate = new Date(`${parsed.month} 1, ${parsed.year}`);
      const month = Number.isNaN(monthDate.getTime())
        ? '00'
        : String(monthDate.getMonth() + 1).padStart(2, '0');
      const day = String(parsed.day).padStart(2, '0');
      const year = String(parsed.year).slice(-2);
      return `${month} | ${day} | ${year}`;
    }
    const month = String(wedding.getMonth() + 1).padStart(2, '0');
    const day = String(wedding.getDate()).padStart(2, '0');
    const year = String(wedding.getFullYear()).slice(-2);
    return `${month} | ${day} | ${year}`;
  }, [siteConfig.ceremony.date, siteConfig.wedding.date]);

  const weddingDateGhost = useMemo(() => {
    const [month, day, year] = letterDateNumeric.split(' | ');
    return { month, day, year };
  }, [letterDateNumeric]);

  const daysToGo = useMemo(() => {
    const parsed = parseWeddingDate(siteConfig.wedding.date);
    const wedding = new Date(`${parsed.month} ${parsed.day}, ${parsed.year}`);
    if (Number.isNaN(wedding.getTime())) return null;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    wedding.setHours(0, 0, 0, 0);

    const diff = Math.ceil((wedding.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return Math.max(0, diff);
  }, [siteConfig.wedding.date]);

  const daysToGoLabel =
    daysToGo === null
      ? null
      : daysToGo === 1
        ? '1 day to go'
        : `${daysToGo} days to go`;

  const weddingDateDisplay = useMemo(() => {
    const raw = normalizeWeddingDateString(siteConfig.wedding.date) || siteConfig.wedding.date;
    const place =
      siteConfig.wedding.venue?.trim() ||
      siteConfig.ceremony.location?.trim() ||
      '';
    return place ? `${raw} · ${place}` : raw;
  }, [siteConfig.wedding.date, siteConfig.wedding.venue, siteConfig.ceremony.location]);

  const flapIsOpen =
    phase === 'flap-open' ||
    phase === 'rising' ||
    phase === 'photos' ||
    phase === 'revealed' ||
    phase === 'cta';

  const contentsVisible =
    phase === 'rising' ||
    phase === 'photos' ||
    phase === 'revealed' ||
    phase === 'cta';

  const sealGone =
    phase === 'seal-break' ||
    phase === 'flap-open' ||
    phase === 'rising' ||
    phase === 'photos' ||
    phase === 'revealed' ||
    phase === 'cta';

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 767px)');
    const updateViewport = () => setIsMobileViewport(mediaQuery.matches);
    updateViewport();
    mediaQuery.addEventListener('change', updateViewport);
    return () => mediaQuery.removeEventListener('change', updateViewport);
  }, []);

  useEffect(() => {
    if (!visible) {
      openedRef.current = false;
      setPhase('idle');
      setLiveMessage('');
      setIsExiting(false);
    }
  }, [visible]);

  useEffect(() => {
    if (!visible || isExiting) return;

    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';

    return () => {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
    };
  }, [visible, isExiting]);

  useEffect(() => {
    const video = bgVideoRef.current;
    if (!video) return;

    if (!visible) {
      video.pause();
      return;
    }

    video.muted = true;
    video.loop = true;
    video.playsInline = true;

    const playVideo = async () => {
      try {
        await video.play();
      } catch {
        /* autoplay may be blocked until user gesture */
      }
    };

    void playVideo();
  }, [visible]);

  useEffect(() => {
    if (phase === 'cta') {
      enterBtnRef.current?.focus({ preventScroll: true });
    }
  }, [phase]);

  const handleEnterInvitation = useCallback(async () => {
    if (isExiting || phase !== 'cta') return;

    setIsExiting(true);
    setLiveMessage('Opening your invitation.');

    if (reduceMotion) {
      onTransitionStart?.();
      onOpen();
      return;
    }

    await wait(inviteRevealLeadMs);
    onTransitionStart?.();
    await wait(INVITE_EXIT_MS - inviteRevealLeadMs);
    onOpen();
  }, [isExiting, onOpen, onTransitionStart, phase, reduceMotion]);

  const runOpenSequence = useCallback(async () => {
    if (reduceMotion) {
      setPhase('cta');
      setLiveMessage('Invitation opened.');
      return;
    }

    setLiveMessage('Pressing seal.');
    setPhase('seal-press');
    await wait(180);

    setLiveMessage('Breaking seal.');
    setPhase('seal-break');
    await wait(320);

    setLiveMessage('Opening envelope.');
    setPhase('flap-open');
    await wait(1100);

    setLiveMessage('Invitation rising.');
    setPhase('rising');
    await wait(Math.round(letterRiseDurationSec * 1000) + 450);

    setPhase('revealed');
    await wait(650);

    setPhase('cta');
    setLiveMessage('Invitation ready.');
  }, [reduceMotion]);

  const handleSealClick = useCallback(
    (e: React.MouseEvent | React.KeyboardEvent) => {
      e.stopPropagation();
      if (openedRef.current || phase !== 'idle') return;
      openedRef.current = true;
      void runOpenSequence();
    },
    [phase, runOpenSequence]
  );

  /* Match reference sample: single flap, rotateX(180deg) positive, origin top center */
  const flapVariants: Variants = {
    closed: { rotateX: 0 },
    open: { rotateX: 180 },
  };

  const sealVariants: Variants = {
    idle: { scale: 1, opacity: 1, rotate: 0, y: 0 },
    press: { scale: 0.94, opacity: 1, rotate: 0, y: 2 },
    break: { scale: 0.2, opacity: 0, rotate: 12, y: -4 },
  };

  const letterSettleY = isMobileViewport ? '-18%' : '-14%';
  const letterLiftY = isMobileViewport ? '-28%' : '-20%';

  /*
    Letter pulls up through the pocket with a slow lead, slight overshoot, then settle.
  */
  const letterVariants: Variants = useMemo(
    () => ({
      hidden: {
        y: '108%',
        scale: 0.82,
        opacity: 1,
        rotate: -0.75,
        filter: 'blur(2px)',
        zIndex: 14,
      },
      rising: {
        y: ['108%', letterLiftY, letterSettleY],
        scale: [0.82, 1.045, 1],
        rotate: [-0.75, 0.45, 0],
        filter: ['blur(2px)', 'blur(0px)', 'blur(0px)'],
        zIndex: [14, 52, 58],
        opacity: 1,
        transition: {
          ...letterRiseTransition,
          zIndex: { duration: letterRiseDurationSec, times: [0, 0.58, 1], ease: 'easeOut' },
        },
      },
      out: {
        y: letterSettleY,
        scale: 1,
        opacity: 1,
        rotate: 0,
        filter: 'blur(0px)',
        zIndex: 58,
        transition: { duration: 0.42, ease: [0.22, 1, 0.36, 1] },
      },
      exitPortal: {
        y: '-118%',
        scale: 3.35,
        opacity: 1,
        rotate: 0,
        filter: 'blur(0px)',
        zIndex: 52,
      },
    }),
    [isMobileViewport, letterLiftY, letterSettleY],
  );

  const revealCopyContainerVariants: Variants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.16, delayChildren: 0.1 },
    },
    exit: {
      transition: { staggerChildren: 0.05, staggerDirection: -1 },
    },
  };

  const revealCopyItemVariants: Variants = {
    hidden: { opacity: 0, y: 22, filter: 'blur(4px)' },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: revealEntryEase,
    },
    exit: {
      opacity: 0,
      y: 28,
      filter: 'blur(6px)',
      transition: { duration: 0.35, ease: [0.4, 0, 1, 1] },
    },
  };

  const buttonRevealVariants: Variants = {
    hidden: { opacity: 0, y: 28, x: '-50%', scale: 0.92, filter: 'blur(6px)' },
    visible: {
      opacity: 1,
      y: 0,
      x: '-50%',
      scale: 1,
      filter: 'blur(0px)',
      transition: buttonEntryEase,
    },
    exit: {
      opacity: 0,
      y: 18,
      x: '-50%',
      scale: 1.06,
      filter: 'blur(8px)',
      transition: { duration: 0.32, ease: [0.4, 0, 1, 1] },
    },
  };

  const focusLiftVariants: Variants = {
    idle: { y: 0, scale: 1, opacity: 1 },
    opening: { y: 0, scale: 1, opacity: 1 },
    photos: { y: 0, scale: 1, opacity: 1 },
    revealed: { y: 0, scale: 1, opacity: 1 },
    cta: { y: 0, scale: 1, opacity: 1 },
    exit: {
      y: -18,
      scale: 0.94,
      opacity: 0,
      transition: { duration: 1.15, delay: 0.52, ease: [0.4, 0, 0.2, 1] },
    },
  };

  if (!mounted) return null;

  const letterState =
    phase === 'idle' ||
    phase === 'seal-press' ||
    phase === 'seal-break' ||
    phase === 'flap-open'
      ? 'hidden'
      : phase === 'rising'
        ? 'rising'
        : 'out';

  const sealState =
    phase === 'idle' ? 'idle' : phase === 'seal-press' ? 'press' : 'break';

  return (
    <motion.div
      className={`env-invite-screen env-invite-screen--starry-bg ${visible ? '' : 'is-hidden'}`}
      data-phase={isExiting ? 'exiting' : phase}
      aria-hidden={!visible}
      initial={false}
      animate={
        isExiting
          ? { opacity: 0, y: 0, scale: 1 }
          : visible
            ? { opacity: 1, y: 0, scale: 1 }
            : { opacity: 0, y: 18, scale: 0.985 }
      }
      transition={
        isExiting
          ? inviteExitEase
          : visible && enterFromLoading && !reduceMotion
            ? inviteEnterEase
            : { duration: reduceMotion ? 0.2 : 0.01 }
      }
      style={{
        pointerEvents: !visible || isExiting ? 'none' : undefined,
      }}
    >
      <div className="env-invite-bg-video-wrap pointer-events-none" aria-hidden="true">
        <video
          ref={bgVideoRef}
          className="env-invite-bg-video"
          src={HERO_BG_VIDEO}
          muted
          loop
          playsInline
          preload="auto"
        />
        <div className="env-invite-bg-video-veil" />
      </div>

      {!reduceMotion && (
        <div className="env-invite-stars pointer-events-none" aria-hidden="true">
          {HERO_SPARKLE_LAYOUT.map((star, i) => (
            <HeroSparkleStar
              key={`hero-star-${i}`}
              {...star}
              variant={i % 5 === 0 ? 'spark' : i % 3 === 0 ? 'soft' : 'default'}
            />
          ))}
        </div>
      )}

      <div className="env-invite-bg-glow pointer-events-none" aria-hidden="true" />

      <div className="env-invite-ghost-date pointer-events-none select-none" aria-hidden="true">
        <span className="env-invite-ghost-date-part">{weddingDateGhost.month}</span>
        <span className="env-invite-ghost-date-sep" aria-hidden="true" />
        <span className="env-invite-ghost-date-part">{weddingDateGhost.day}</span>
        <span className="env-invite-ghost-date-sep" aria-hidden="true" />
        <span className="env-invite-ghost-date-part">{weddingDateGhost.year}</span>
      </div>

      {isExiting && !reduceMotion && (
        <>
          <motion.div
            className="env-invite-exit-ring"
            aria-hidden="true"
            initial={{ scale: 0.4, opacity: 0 }}
            animate={{ scale: 3.45, opacity: [0, 0.62, 0] }}
            transition={{ duration: 1.65, ease: [0.22, 1, 0.36, 1], times: [0, 0.34, 1], delay: 0.06 }}
          />
          <motion.div
            className="env-invite-exit-bloom"
            aria-hidden="true"
            initial={{ opacity: 0, scale: 0.28 }}
            animate={{ opacity: [0, 0.96, 0.72, 0], scale: [0.28, 1.08, 1.52, 1.78] }}
            transition={{
              duration: 1.72,
              ease: [0.22, 1, 0.36, 1],
              times: [0, 0.26, 0.58, 1],
              delay: 0.1,
            }}
          />
          <motion.div
            className="env-invite-exit-shimmer"
            aria-hidden="true"
            initial={{ x: '-130%', opacity: 0 }}
            animate={{ x: '130%', opacity: [0, 0.85, 0] }}
            transition={{ duration: 1.25, ease: 'easeInOut', delay: 0.22 }}
          />
          <motion.div
            className="env-invite-exit-curtain env-invite-exit-curtain--left"
            aria-hidden="true"
            initial={{ x: '-105%' }}
            animate={{ x: 0 }}
            transition={{ duration: 0.95, delay: 1.15, ease: [0.65, 0, 0.35, 1] }}
          />
          <motion.div
            className="env-invite-exit-curtain env-invite-exit-curtain--right"
            aria-hidden="true"
            initial={{ x: '105%' }}
            animate={{ x: 0 }}
            transition={{ duration: 0.95, delay: 1.15, ease: [0.65, 0, 0.35, 1] }}
          />
        </>
      )}

      <p className="env-invite-live" aria-live="polite">
        {liveMessage}
      </p>

      <div className="env-invite-stage">
        <div className="env-invite-cluster">
          <motion.div
            className="env-invite-focus"
            variants={focusLiftVariants}
            initial="idle"
            animate={isExiting ? 'exit' : getFocusLiftPhase(phase)}
            transition={
              reduceMotion
                ? { duration: 0.01 }
                : isExiting
                  ? { duration: 1.15, delay: 0.52, ease: [0.4, 0, 0.2, 1] }
                  : focusLiftEase
            }
          >
          <div className="env-invite-invited-heading-wrap" aria-hidden="true">
            <Image
              src="/image/your-are-invited.png"
              alt=""
              width={2146}
              height={733}
              priority
              sizes="(min-width: 768px) 360px, 88vw"
              className="env-invite-invited-heading"
            />
          </div>
          <motion.div
            className="env-invite-scene"
            initial={false}
            animate={
              isExiting
                ? { opacity: 0, scale: 0.98, y: 0 }
                : { opacity: 1, scale: 1, y: 0 }
            }
            transition={
              isExiting
                ? { duration: 1.1, delay: 0.68, ease: [0.4, 0, 0.2, 1] }
                : { duration: 0.01 }
            }
          >
          <div className="env-invite-ground-shadow" aria-hidden="true" />
          <div className="env-invite-ground-contact" aria-hidden="true" />

          <div className="env-invite-envelope">
            {/* Flap behind body when open — rendered first in paint order */}
            <div className="env-invite-flap-shadow" aria-hidden="true" />
            <motion.div
              className="env-invite-flap"
              variants={flapVariants}
              initial="closed"
              animate={flapIsOpen ? 'open' : 'closed'}
              transition={flapEase}
              style={{ transformOrigin: 'top center' }}
              aria-hidden="true"
            />

            <div className="env-invite-envelope-body">
              {/* Back panel */}
              <div className="env-invite-back" aria-hidden="true" />

              {/* Interior shadow — only visible once contents rise */}
              <div className="env-invite-interior" aria-hidden="true" />

              {/* Contents — clipped inside pocket */}
              <div className="env-invite-contents-clip" aria-hidden={!contentsVisible}>
              <div className="env-invite-contents">
                <div className="env-invite-emerge-stack">
                  <motion.div
                    className="env-invite-letter"
                    variants={letterVariants}
                    initial="hidden"
                    animate={isExiting ? 'exitPortal' : letterState}
                    transition={
                      isExiting
                        ? { ...letterExitEase, delay: 0.14 }
                        : letterState === 'rising'
                          ? reduceMotion
                            ? { duration: 0.45, ease: [0.22, 1, 0.36, 1] }
                            : letterRiseTransition
                          : letterState === 'out'
                            ? { duration: reduceMotion ? 0.01 : 0.42, ease: [0.22, 1, 0.36, 1] }
                            : { duration: 0.01 }
                    }
                  >
                    <div className="env-invite-letter-grain" aria-hidden="true" />
                    <div className="env-invite-letter-frame" aria-hidden="true" />
                    <div className="env-invite-letter-inner">
                      <span className="env-invite-letter-label">Save the Date</span>
                      <span className="env-invite-letter-invited">you are invited</span>
                      <div className="env-invite-letter-couple-wrap">
                        <Image
                          src="/image/couple-name.png"
                          alt={coupleNames}
                          width={1774}
                          height={887}
                          sizes="(min-width: 768px) 320px, 78vw"
                          className="env-invite-letter-couple-img"
                        />
                      </div>
                      <span className="env-invite-letter-date">{weddingDateDisplay}</span>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>

            {/* 3. Closed front skin — solid cover, hides when open */}
            <div className="env-invite-front-closed" aria-hidden="true">
              <div className="env-invite-fold env-invite-fold--tl" />
              <div className="env-invite-fold env-invite-fold--bl" />
              <div className="env-invite-fold env-invite-fold--br" />
              <div className="env-invite-fold env-invite-fold--b" />
              <svg
                className="env-invite-creases"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
              >
                <line x1="0" y1="0" x2="50" y2="50" />
                <line x1="100" y1="0" x2="50" y2="50" />
                <line x1="0" y1="100" x2="50" y2="50" />
                <line x1="100" y1="100" x2="50" y2="50" />
              </svg>
            </div>

            {/* Front pocket — inside body so it stacks with letter without hiding behind the back panel */}
            <div className="env-invite-pocket" aria-hidden="true">
              <div className="env-invite-pocket-front" />
              <div className="env-invite-pocket-left" />
              <div className="env-invite-pocket-right" />
            </div>

            <div className="env-invite-hinge" aria-hidden="true" />
            </div>

            {/* Wax seal — centered on flap junction */}
            <div
              className="env-invite-seal-wrap"
              style={{
                display: sealGone && phase !== 'seal-break' ? 'none' : undefined,
              }}
            >
              <motion.button
                type="button"
                className="env-invite-seal-btn"
                variants={sealVariants}
                initial="idle"
                animate={sealState}
                transition={
                  sealState === 'break'
                    ? { duration: 0.28, ease: 'easeIn' }
                    : { duration: 0.16, ease: 'easeOut' }
                }
                onClick={handleSealClick}
                disabled={phase !== 'idle'}
                aria-label="Break the wax seal to open the invitation"
              >
                <Image
                  src="/image/seal.png"
                  alt=""
                  fill
                  priority
                  sizes="(min-width: 768px) 148px, 132px"
                  className="env-invite-seal-img object-contain"
                />
              </motion.button>
            </div>

            {phase === 'seal-break' && !reduceMotion && (
              <>
                <motion.span
                  className="env-invite-seal-shard"
                  initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                  animate={{ x: -28, y: -30, opacity: 0, scale: 0.35 }}
                  transition={{ duration: 0.35, ease: 'easeOut' }}
                  aria-hidden="true"
                />
                <motion.span
                  className="env-invite-seal-shard"
                  initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                  animate={{ x: 30, y: 18, opacity: 0, scale: 0.3 }}
                  transition={{ duration: 0.38, ease: 'easeOut' }}
                  aria-hidden="true"
                />
                <motion.span
                  className="env-invite-seal-shard"
                  initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                  animate={{ x: 14, y: -24, opacity: 0, scale: 0.4 }}
                  transition={{ duration: 0.32, ease: 'easeOut' }}
                  aria-hidden="true"
                />
              </>
            )}
          </div>

          <div className="env-invite-deco env-invite-deco--left" aria-hidden="true">
            <Image
              src="/image/decoration-image-left.png"
              alt=""
              width={340}
              height={360}
              priority
              sizes="(min-width: 768px) 320px, 62vw"
              className="env-invite-deco-img"
            />
          </div>
          <div className="env-invite-deco env-invite-deco--right" aria-hidden="true">
            <Image
              src="/image/decoratoin-image-right.png"
              alt=""
              width={252}
              height={400}
              priority
              sizes="(min-width: 768px) 252px, 44vw"
              className="env-invite-deco-img"
            />
          </div>
        </motion.div>

          <p className="env-invite-hint">
            Tap the Seal to Open
          </p>

          </motion.div>
        </div>
      </div>

      <motion.div
        className="env-invite-reveal-copy"
        variants={revealCopyContainerVariants}
        initial="hidden"
        animate={
          isExiting
            ? 'exit'
            : phase === 'revealed' || phase === 'cta'
              ? 'visible'
              : 'hidden'
        }
      >
        <motion.div
          className="env-invite-reveal-silhouette-wrap"
          variants={revealCopyItemVariants}
        >
          <Image
            src="/image/beauty-and-beast.png"
            alt=""
            width={640}
            height={280}
            sizes="(min-width: 768px) 200px, 46vw"
            className="env-invite-reveal-silhouette"
          />
        </motion.div>
        {daysToGoLabel && (
          <motion.p
            className="env-invite-days-to-go"
            variants={revealCopyItemVariants}
          >
            {daysToGoLabel}
          </motion.p>
        )}
        <motion.h2 variants={revealCopyItemVariants}>
          We can't wait to celebrate with you!
        </motion.h2>
      </motion.div>

      <motion.button
        ref={enterBtnRef}
        type="button"
        className="env-invite-enter-btn"
        variants={buttonRevealVariants}
        initial="hidden"
        animate={
          isExiting
            ? 'exit'
            : phase === 'cta'
              ? 'visible'
              : 'hidden'
        }
        whileHover={
          phase === 'cta' && !isExiting && !reduceMotion
            ? { y: -2, x: '-50%', scale: 1.02 }
            : undefined
        }
        whileTap={
          phase === 'cta' && !isExiting && !reduceMotion
            ? { y: 0, x: '-50%', scale: 0.98 }
            : undefined
        }
        onClick={handleEnterInvitation}
        disabled={phase !== 'cta' || isExiting}
      >
        View the Invitation
      </motion.button>
    </motion.div>
  );
};

function wait(ms: number) {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, ms);
  });
}