"use client"

import { useEffect, useMemo, useState } from "react"
import { motion, useReducedMotion } from "motion/react"
import { Cinzel, Playfair_Display } from "next/font/google"
import localFont from "next/font/local"
import Image from "next/image"
import { useSiteConfig } from "@/hooks/use-site-config"
import { parseWeddingDate } from "@/lib/wedding-date"

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
})

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  style: ["normal", "italic"],
})

const theSeasons = localFont({
  src: "../../Font/Fontspring-DEMO-theseasons-reg.otf",
  display: "swap",
  variable: "--font-the-seasons",
})

const aboveTheBeyond = localFont({
  src: "../../Font/above-the-beyond-script.otf",
  display: "swap",
  variable: "--font-above-beyond",
})

const IVORY = "#fffaf4"
const CHAMPAGNE = "#E8D5A3"
const GOLD_BRIGHT = "#d4af37"
const entryEase = [0.22, 1, 0.36, 1] as const
const heroTitleSize = {
  mainMobile: "clamp(2.2rem, 11.5vw, 3.15rem)",
  main: "clamp(3.85rem, min(21vw, 26cqi), 10rem)",
  scriptMobile: "clamp(1.75rem, 9.5vw, 2.65rem)",
  script: "clamp(3.1rem, min(17vw, 19cqi), 7.5rem)",
} as const

const goldGradientText: React.CSSProperties = {
  background:
    "linear-gradient(168deg, #fffef8 0%, #fceabb 14%, #f5d76e 32%, #c9a227 48%, #a67c00 54%, #e8c547 70%, #fff8dc 86%, #d4af37 100%)",
  WebkitBackgroundClip: "text",
  backgroundClip: "text",
  color: "transparent",
  filter:
    "drop-shadow(0 1px 0 rgba(139, 105, 20, 0.85)) drop-shadow(0 2px 8px rgba(0, 0, 0, 0.75)) drop-shadow(0 0 20px rgba(255, 215, 100, 0.4))",
}

const SLIDE_MS = 5600

const MOBILE_HERO_PHOTOS = [
  encodeURI("/mobile-background/couples (9).webp"),
  encodeURI("/mobile-background/couples (14).webp"),
  encodeURI("/mobile-background/couples (69).webp"),
  encodeURI("/mobile-background/couples (62).webp"),
  encodeURI("/mobile-background/couples (76).webp"),
]

const DESKTOP_HERO_PHOTOS = [
  encodeURI("/desktop-background/couples (34).webp"),
  encodeURI("/desktop-background/couples (27).webp"),
  encodeURI("/mobile-background/couples (23).webp"),
  encodeURI("/mobile-background/couples (31).webp"),
  encodeURI("/mobile-background/couples (11).webp"),
]

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

function pad2(n: number) {
  return String(n).padStart(2, "0")
}

function formatCeremonyTimePhrase(raw: string) {
  const match = raw.trim().match(/^(\d{1,2})(?::(\d{2}))?\s*(AM|PM)?/i)
  if (!match) return raw.toUpperCase()

  let hour24 = Number(match[1])
  const minutes = match[2] ?? "00"
  const meridiem = (match[3] || "").toUpperCase()

  if (meridiem === "PM" && hour24 !== 12) hour24 += 12
  if (meridiem === "AM" && hour24 === 12) hour24 = 0

  const period =
    hour24 >= 17 ? "IN THE EVENING" : hour24 >= 12 ? "IN THE AFTERNOON" : "IN THE MORNING"

  let displayHour = hour24 % 12
  if (displayHour === 0) displayHour = 12

  return `${displayHour}:${minutes} ${period}`
}

function useCeremonyCountdown() {
  const siteConfig = useSiteConfig()

  const targetTimestamp = useMemo(() => {
    const parsedDate = parseWeddingDate(siteConfig.ceremony.date ?? siteConfig.wedding.date)
    const monthMap: Record<string, string> = {
      January: "01",
      February: "02",
      March: "03",
      April: "04",
      May: "05",
      June: "06",
      July: "07",
      August: "08",
      September: "09",
      October: "10",
      November: "11",
      December: "12",
    }
    const monthKey =
      parsedDate.month.charAt(0) + parsedDate.month.slice(1).toLowerCase()
    const monthNum = monthMap[monthKey] ?? "11"
    const timeRaw = siteConfig.ceremony.time ?? siteConfig.wedding.time
    const timeMatch = timeRaw.match(/(\d+):(\d+)\s*(AM|PM)/i)

    let hour = 9
    let minutes = 0
    if (timeMatch) {
      hour = parseInt(timeMatch[1], 10)
      minutes = parseInt(timeMatch[2], 10)
      const ampm = timeMatch[3].toUpperCase()
      if (ampm === "PM" && hour !== 12) hour += 12
      if (ampm === "AM" && hour === 12) hour = 0
    }

    return new Date(
      Date.UTC(
        parseInt(parsedDate.year, 10),
        parseInt(monthNum, 10) - 1,
        parseInt(parsedDate.day, 10),
        hour - 8,
        minutes,
        0,
      ),
    ).getTime()
  }, [
    siteConfig.ceremony.date,
    siteConfig.ceremony.time,
    siteConfig.wedding.date,
    siteConfig.wedding.time,
  ])

  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  useEffect(() => {
    const tick = () => {
      const difference = targetTimestamp - Date.now()
      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
        return
      }
      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      })
    }

    tick()
    const timer = window.setInterval(tick, 1000)
    return () => window.clearInterval(timer)
  }, [targetTimestamp])

  return timeLeft
}

function HeroSlideshow() {
  const reduceMotion = useReducedMotion()
  const [isMobile, setIsMobile] = useState(true)
  const [index, setIndex] = useState(0)
  const photos = isMobile ? MOBILE_HERO_PHOTOS : DESKTOP_HERO_PHOTOS

  useEffect(() => {
    const media = window.matchMedia("(max-width: 767px)")
    const update = () => {
      setIsMobile(media.matches)
      setIndex(0)
    }
    update()
    media.addEventListener("change", update)
    return () => media.removeEventListener("change", update)
  }, [])

  useEffect(() => {
    if (reduceMotion || photos.length < 2) return
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % photos.length)
    }, SLIDE_MS)
    return () => window.clearInterval(timer)
  }, [photos.length, reduceMotion])

  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      {photos.map((src, photoIndex) => {
        const isActive = photoIndex === index
        return (
          <motion.div
            key={src}
            className="absolute inset-0"
            initial={false}
            animate={{
              opacity: isActive ? 1 : 0,
              scale: reduceMotion ? 1 : isActive ? 1.06 : 1.02,
            }}
            transition={{
              opacity: { duration: reduceMotion ? 0.01 : 1.45, ease: "easeInOut" },
              scale: {
                duration: reduceMotion ? 0.01 : isActive ? 8.5 : 1.45,
                ease: isActive ? "linear" : "easeOut",
              },
            }}
          >
            <Image
              src={src}
              alt=""
              fill
              priority={photoIndex === 0}
              className="object-cover object-[center_28%] md:object-center"
              sizes="100vw"
            />
          </motion.div>
        )
      })}
      <div
        className="absolute inset-0"
        style={{
          background: `
            linear-gradient(180deg, rgb(42 34 28 / 46%) 0%, rgb(42 34 28 / 22%) 26%, rgb(42 34 28 / 28%) 48%, rgb(42 34 28 / 52%) 100%),
            radial-gradient(ellipse 88% 62% at 50% 42%, rgb(42 34 28 / 28%) 0%, transparent 72%)
          `,
        }}
      />
    </div>
  )
}

function CountdownUnit({
  value,
  label,
  pad = false,
}: {
  value: number
  label: string
  pad?: boolean
}) {
  const display = pad ? pad2(value) : String(value)

  return (
    <div className="flex min-w-[3rem] flex-1 flex-col items-center sm:min-w-[3.5rem]">
      <span
        className={`${cinzel.className} text-[clamp(1.2rem,5.4vw,1.75rem)] font-semibold leading-none tabular-nums tracking-[0.04em] text-[#fffaf4]`}
      >
        {display}
      </span>
      <span
        className={`${cinzel.className} mt-1.5 text-[0.48rem] font-medium uppercase tracking-[0.16em] text-[#fffaf4] sm:mt-2 sm:text-[0.54rem]`}
      >
        {label}
      </span>
    </div>
  )
}

function GoldRule({ className = "" }: { className?: string }) {
  return (
    <div
      className={`mx-auto flex max-w-xs items-center justify-center gap-2 sm:max-w-sm ${className}`}
      aria-hidden
    >
      <span className="h-px flex-1 bg-gradient-to-r from-transparent via-[#d4af37]/70 to-transparent" />
      <span className="h-1 w-1 rotate-45 bg-[#d4af37]" />
      <span className="h-px flex-1 bg-gradient-to-l from-transparent via-[#d4af37]/70 to-transparent" />
    </div>
  )
}

function HeroDateFeature({
  weekday,
  day,
  monthLabel,
  year,
  venueLine,
}: {
  weekday: string
  day: string
  monthLabel: string
  year: string
  venueLine: string
}) {
  const dateAria = `${monthLabel} ${day}, ${year}`

  return (
    <div
      className="relative mx-auto mt-6 w-full max-w-2xl px-1 sm:mt-7"
      role="group"
      aria-label={`Wedding date ${dateAria}, ${venueLine}`}
    >
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[min(16rem,55vw)] w-[min(28rem,92vw)] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-90 blur-3xl"
        aria-hidden
        style={{
          background: `radial-gradient(ellipse 80% 65% at 50% 50%, color-mix(in srgb, ${GOLD_BRIGHT} 28%, transparent), transparent 68%)`,
        }}
      />
      <p
        className={`${cinzel.className} relative text-center text-[0.58rem] font-semibold uppercase tracking-[0.4em] text-[#f5e6a8] sm:text-[0.65rem] sm:tracking-[0.46em]`}
      >
        Save the date
      </p>
      <p
        className={`${cinzel.className} relative mt-3 text-center text-[0.62rem] font-medium uppercase tracking-[0.22em] text-[#fffaf4]/85 sm:mt-3.5 sm:text-[0.7rem] sm:tracking-[0.26em]`}
      >
        {weekday}
      </p>
      <p
        className={`${playfair.className} relative mt-2 text-center text-[clamp(3rem,16vw,6rem)] font-semibold italic leading-[0.92] tabular-nums tracking-[0.01em] sm:mt-2.5`}
        style={goldGradientText}
      >
        {day}
      </p>
      <p
        className={`${theSeasons.className} relative mt-1 text-center text-[clamp(1.35rem,6.5vw,2.75rem)] uppercase leading-none tracking-[0.12em] text-[#fff8dc] sm:tracking-[0.16em]`}
        style={{
          textShadow:
            "0 2px 16px rgb(42 34 28 / 55%), 0 0 28px color-mix(in srgb, #d4af37 30%, transparent)",
        }}
      >
        {monthLabel}
      </p>
      <p
        className={`${cinzel.className} relative mt-1.5 text-center text-[clamp(0.95rem,4vw,1.35rem)] font-semibold uppercase tracking-[0.32em] sm:tracking-[0.38em]`}
        style={goldGradientText}
      >
        {year}
      </p>
      <p
        className={`${cinzel.className} relative mt-4 text-center text-[0.58rem] font-medium uppercase leading-relaxed tracking-[0.18em] text-[#fffaf4]/90 sm:mt-4 sm:text-[0.65rem] sm:tracking-[0.22em]`}
      >
        {venueLine}
      </p>
    </div>
  )
}

function CoupleNameCopy({
  groom,
  bride,
  groomNickname,
  brideNickname,
}: {
  groom: string
  bride: string
  groomNickname?: string
  brideNickname?: string
}) {
  const groomLabel = groomNickname?.trim() || groom.split(/\s+/)[0] || groom
  const brideLabel = brideNickname?.trim() || bride.split(/\s+/)[0] || bride

  return (
    <div className="mx-auto max-w-md px-2 text-center">
      <p
        className={`${cinzel.className} text-[0.52rem] font-semibold uppercase tracking-[0.32em] text-[#f5e6a8]/90 sm:text-[0.56rem] sm:tracking-[0.36em]`}
      >
        The wedding of
      </p>
      <p
        className={`${theSeasons.className} mt-2 text-[clamp(1rem,4.2vw,1.35rem)] uppercase leading-snug tracking-[0.14em] text-[#fffaf4]/88 sm:mt-2.5 sm:tracking-[0.18em]`}
        style={{ textShadow: "0 2px 12px rgb(42 34 28 / 48%)" }}
      >
        <span>{groomLabel}</span>
        <span
          className={`${aboveTheBeyond.className} mx-2 inline-block text-[clamp(1.2rem,4.8vw,1.65rem)] normal-case tracking-normal text-[#E8D5A3]`}
          aria-hidden
        >
          &amp;
        </span>
        <span>{brideLabel}</span>
      </p>
    </div>
  )
}

function HeroCountdown() {
  const timeLeft = useCeremonyCountdown()
  const colonClass = `${cinzel.className} shrink-0 self-start px-0.5 text-[clamp(1.2rem,5.4vw,1.75rem)] font-semibold leading-none tabular-nums text-[#fffaf4] sm:px-1`

  return (
    <div className="relative z-10 w-full px-4 py-4 sm:px-6 sm:py-5">
      <p
        className={`${cinzel.className} text-center text-[0.58rem] font-semibold uppercase tracking-[0.22em] text-[#fffaf4] sm:text-[0.64rem] sm:tracking-[0.26em]`}
      >
        Until we begin our forever
      </p>
      <div
        className="mx-auto mt-2 flex max-w-md items-start justify-center text-[#fffaf4] sm:mt-2.5 sm:max-w-lg"
        aria-live="polite"
        aria-label={`${timeLeft.days} days, ${timeLeft.hours} hours, ${timeLeft.minutes} minutes, ${timeLeft.seconds} seconds`}
      >
        <CountdownUnit value={timeLeft.days} label="Days" />
        <span className={colonClass} aria-hidden="true">
          :
        </span>
        <CountdownUnit value={timeLeft.hours} label="Hours" pad />
        <span className={colonClass} aria-hidden="true">
          :
        </span>
        <CountdownUnit value={timeLeft.minutes} label="Minutes" pad />
        <span className={colonClass} aria-hidden="true">
          :
        </span>
        <CountdownUnit value={timeLeft.seconds} label="Seconds" pad />
      </div>
    </div>
  )
}

export function Hero() {
  const siteConfig = useSiteConfig()
  const reduceMotion = useReducedMotion()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const id = window.setTimeout(() => setVisible(true), 40)
    return () => window.clearTimeout(id)
  }, [])

  const parsedDate = useMemo(
    () => parseWeddingDate(siteConfig.ceremony.date ?? siteConfig.wedding.date),
    [siteConfig.ceremony.date, siteConfig.wedding.date],
  )

  const weddingDate = new Date(`${parsedDate.month} ${parsedDate.day}, ${parsedDate.year}`)
  const monthTitle =
    parsedDate.month.charAt(0) + parsedDate.month.slice(1).toLowerCase()

  const ceremonyTimePhrase = formatCeremonyTimePhrase(
    siteConfig.ceremony.time ?? siteConfig.wedding.time,
  )
  const ceremonyName =
    siteConfig.ceremony.location || siteConfig.wedding.venue

  const weekdayLabel = parsedDate.dayOfWeek
    ? parsedDate.dayOfWeek.toUpperCase()
    : weddingDate.toLocaleDateString("en-US", { weekday: "long" }).toUpperCase()

  const fadeUp = (delay: number) => {
    if (reduceMotion) {
      return { initial: false as const, animate: { opacity: 1, y: 0 } }
    }
    return {
      initial: { opacity: 0, y: 18 },
      animate: visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 },
      transition: { duration: 0.9, delay, ease: entryEase },
    }
  }

  return (
    <section
      id="home"
      className={`${theSeasons.variable} ${aboveTheBeyond.variable} relative -mt-12 flex min-h-[100dvh] w-full flex-col overflow-hidden sm:-mt-14 md:-mt-16`}
    >
      <HeroSlideshow />

      <div className="relative z-10 mx-auto flex w-full max-w-4xl flex-1 flex-col items-center justify-center px-5 pb-6 pt-[max(clamp(3.75rem,14vw,5.5rem),calc(3rem+env(safe-area-inset-top)))] text-center sm:px-8 sm:py-8">
        <div className="flex w-full max-w-3xl flex-col items-center justify-center md:max-w-4xl">
        <motion.div
          className={`${cinzel.className} inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-[0.52rem] font-semibold uppercase tracking-[0.28em] text-[#f5e6a8] sm:px-4 sm:py-2 sm:text-[0.58rem] sm:tracking-[0.32em]`}
          style={{
            borderColor: "color-mix(in srgb, #d4af37 45%, transparent)",
            background: "rgb(42 34 28 / 52%)",
            boxShadow: "0 0 24px color-mix(in srgb, #d4af37 18%, transparent)",
          }}
          {...fadeUp(0.04)}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-[#d4af37] shadow-[0_0_10px_#d4af37]" aria-hidden />
          Official website
        </motion.div>

        <motion.div className="mt-3 w-full sm:mt-3.5" {...fadeUp(0.1)}>
          <CoupleNameCopy
            groom={siteConfig.couple.groom}
            bride={siteConfig.couple.bride}
            groomNickname={siteConfig.couple.groomNickname}
            brideNickname={siteConfig.couple.brideNickname}
          />
        </motion.div>

        <motion.h1
          className="relative mx-auto mt-5 flex w-full max-w-4xl flex-col items-center justify-center gap-0 px-1 text-center @container sm:mt-6 md:max-w-5xl"
          style={
            {
              "--hero-title-size-mobile": heroTitleSize.mainMobile,
              "--hero-title-size": heroTitleSize.main,
              "--hero-script-size-mobile": heroTitleSize.scriptMobile,
              "--hero-script-size": heroTitleSize.script,
            } as React.CSSProperties
          }
          {...fadeUp(0.16)}
        >
          <span className="sr-only">Coming soon — official wedding website</span>
          <span
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-1/2 h-[min(18rem,62vw)] w-[min(32rem,100%)] -translate-x-1/2 -translate-y-1/2 rounded-full sm:h-[min(24rem,78vw)] sm:w-[min(38rem,100%)]"
            style={{
              background: `radial-gradient(ellipse 78% 65% at 50% 50%, color-mix(in srgb, ${GOLD_BRIGHT} 30%, transparent), transparent 68%)`,
            }}
          />
          <span
            aria-hidden
            className={`${theSeasons.className} relative z-10 block w-full max-w-full text-center uppercase leading-[0.92] tracking-[0.05em] [font-size:var(--hero-title-size-mobile)] min-[400px]:tracking-[0.08em] sm:leading-[0.94] sm:tracking-[0.12em] sm:[font-size:var(--hero-title-size)] md:tracking-[0.14em]`}
            style={{
              ...goldGradientText,
              filter:
                "drop-shadow(0 1px 0 rgba(139, 105, 20, 0.85)) drop-shadow(0 3px 14px rgba(0, 0, 0, 0.8)) drop-shadow(0 0 36px rgba(255, 215, 100, 0.6))",
            }}
          >
            Coming
          </span>
          <span
            aria-hidden
            className={`${aboveTheBeyond.className} relative z-10 mx-auto mt-1 block w-fit max-w-full px-2 leading-[1] [font-size:var(--hero-script-size-mobile)] sm:mt-1.5 sm:[font-size:var(--hero-script-size)] md:mt-2`}
            style={{
              color: CHAMPAGNE,
              textShadow:
                "0 1px 0 rgb(255 250 244 / 35%), 0 6px 24px rgb(42 34 28 / 55%), 0 0 44px rgb(212 175 55 / 58%), 0 0 72px rgb(232 197 71 / 38%)",
            }}
          >
            Soon
          </span>
        </motion.h1>

        <motion.div {...fadeUp(0.22)}>
          <GoldRule className="mt-4 sm:mt-5" />
        </motion.div>

        <motion.div className="w-full" {...fadeUp(0.28)}>
          <HeroDateFeature
            weekday={weekdayLabel}
            day={parsedDate.day}
            monthLabel={monthTitle.toUpperCase()}
            year={parsedDate.year}
            venueLine={`${ceremonyName} · ${ceremonyTimePhrase}`}
          />
        </motion.div>

        <motion.p
          className={`${playfair.className} mx-auto mt-4 max-w-md px-3 text-[clamp(0.84rem,3.1vw,1.02rem)] font-normal italic leading-[1.65] text-[#f0e6c8]/96 sm:mt-5`}
          style={{ textShadow: "0 1px 12px rgb(42 34 28 / 45%)" }}
          {...fadeUp(0.34)}
        >
          Our full invitation is on its way — hold the date close. A tale as old as time, the
          beginning of our forever.
        </motion.p>
        </div>
      </div>

      <motion.div
        className="relative z-10 mt-auto w-full"
        style={{
          background:
            "linear-gradient(180deg, transparent 0%, rgb(42 34 28 / 35%) 32%, rgb(42 34 28 / 72%) 100%)",
        }}
        {...fadeUp(0.42)}
      >
        <HeroCountdown />
      </motion.div>
    </section>
  )
}
