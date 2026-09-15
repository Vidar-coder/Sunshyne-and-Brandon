"use client"

import { useState, useEffect, useCallback, useMemo, useRef, useLayoutEffect, Suspense, type CSSProperties, type ReactNode } from "react"
import dynamic from "next/dynamic"
import Link from "next/link"
import Image from "next/image"
import { motion, AnimatePresence } from "motion/react"
import {
  Heart,
  Check,
  X,
  Sparkles,
} from "lucide-react"
import localFont from "next/font/local"
import { Cinzel } from "next/font/google"
import { useSiteConfig } from "@/hooks/use-site-config"
import { LoadingScreen } from "@/components/loader/LoadingScreen"
import { getRoleSingular } from "@/lib/proposal-roles"
import { parseWeddingDate } from "@/lib/wedding-date"
import { sectionType, welcomeTitleSize } from "@/lib/section-typography"
import { sectionBackground } from "@/lib/section-background"
import { siteConfig as defaultSiteConfig } from "@/content/site"
import type { ProposalRole, ProposalResponse } from "@/lib/proposal-types"

const Silk = dynamic(() => import("@/components/silk"), { ssr: false })

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
})

const theSeasons = localFont({
  src: "../Font/Fontspring-DEMO-theseasons-reg.otf",
  display: "swap",
  variable: "--font-the-seasons",
})

const aboveTheBeyond = localFont({
  src: "../Font/above-the-beyond-script.otf",
  display: "swap",
  variable: "--font-above-beyond",
})

const IVORY = "#fffaf4"
const GOLD = "var(--color-welcome-gold)"
const NAVY = "var(--color-welcome-navy)"
const SCRIPT = "var(--color-welcome-green)"
const BODY = "var(--color-welcome-text)"
const NAV_GOLD = "linear-gradient(180deg, #E8D5A3 0%, #CDB072 52%, #C4A265 100%)"
const GOLD_BORDER = "color-mix(in srgb, var(--color-welcome-gold) 38%, transparent)"
const GOLD_BORDER_SOFT = "color-mix(in srgb, var(--color-welcome-gold) 22%, transparent)"
const CHAMPAGNE = "#E8D5A3"

const palette = {
  body: BODY,
  bodySoft: "var(--color-welcome-text-soft)",
  heading: NAVY,
  label: GOLD,
  accent: SCRIPT,
  script: GOLD,
} as const

const NAME_SHADOW =
  "0 1px 0 color-mix(in srgb, var(--color-welcome-bg) 95%, white), 0 0 10px color-mix(in srgb, var(--color-welcome-bg) 65%, white)"

const BORDER_SOFT = GOLD_BORDER_SOFT
const INNER_SURFACE = `color-mix(in srgb, ${IVORY} 82%, ${CHAMPAGNE})`

const CORNER_DECO_CLASS =
  "block h-auto w-auto max-w-[120px] sm:max-w-[180px] md:max-w-[260px] lg:max-w-[320px] xl:max-w-[380px] select-none"

const ambientGlowStyle = {
  background:
    "linear-gradient(135deg, color-mix(in srgb, var(--color-welcome-gold) 18%, transparent) 0%, color-mix(in srgb, var(--color-welcome-green) 10%, transparent) 48%, color-mix(in srgb, var(--color-welcome-gold) 10%, transparent) 100%)",
} as const

const dividerLineStyle = {
  background: "linear-gradient(to right, transparent, var(--color-welcome-gold), transparent)",
} as const

const coupleLabelLineStyle = {
  background: "linear-gradient(to right, transparent, var(--color-welcome-gold))",
} as const

const nameStyle: CSSProperties = {
  fontSize: "clamp(0.6875rem, 2.55vw, 1.0625rem)",
  lineHeight: 1.3,
}

const cardStyle: CSSProperties = {
  background: IVORY,
  borderColor: GOLD_BORDER,
  borderWidth: "1px",
  borderStyle: "solid",
  boxShadow:
    "0 10px 28px color-mix(in srgb, var(--color-welcome-gold) 12%, transparent), inset 0 1px 0 rgb(255 250 244 / 70%)",
}

const primaryBtnStyle: CSSProperties = {
  fontWeight: 600,
  background: NAV_GOLD,
  borderColor: GOLD_BORDER,
  color: IVORY,
  boxShadow: "0 8px 18px color-mix(in srgb, var(--color-welcome-gold) 22%, transparent)",
}

const secondaryBtnStyle: CSSProperties = {
  fontWeight: 600,
  color: NAVY,
  backgroundColor: IVORY,
  borderColor: GOLD_BORDER,
}

const labelStyle = (color: string, extra?: CSSProperties): CSSProperties => ({
  fontFamily: cinzel.style.fontFamily,
  fontWeight: 600,
  color,
  ...extra,
})

function OrnamentalDivider({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`flex items-center justify-center ${compact ? "gap-1.5" : "gap-2"}`}>
      <span
        className={`h-px ${compact ? "w-6 sm:w-10" : "w-8 sm:w-12"}`}
        style={dividerLineStyle}
      />
      <span className="h-0.5 w-0.5 rounded-full sm:h-1 sm:w-1" style={{ background: GOLD }} aria-hidden />
      <span
        className={`h-px ${compact ? "w-6 sm:w-10" : "w-8 sm:w-12"}`}
        style={{
          background:
            "linear-gradient(to left, transparent, var(--color-welcome-gold), transparent)",
        }}
      />
    </div>
  )
}

function CoupleLabel({ groom, bride }: { groom: string; bride: string }) {
  return (
    <div className="flex items-center justify-center gap-2.5 pt-1 sm:gap-3.5 sm:pt-1.5">
      <span className="h-px w-5 sm:w-7 md:w-9" style={coupleLabelLineStyle} aria-hidden />
      <p
        className={`${cinzel.className} ${sectionType.label} shrink-0 py-0.5 font-semibold uppercase leading-normal tracking-[0.34em] min-[400px]:tracking-[0.38em] sm:tracking-[0.44em]`}
        style={{ color: palette.label }}
      >
        {groom}
        <span
          className={`${aboveTheBeyond.className} mx-1.5 inline-block normal-case tracking-normal sm:mx-2`}
          style={{
            fontSize: "1.35em",
            color: palette.accent,
            verticalAlign: "middle",
          }}
          aria-hidden
        >
          &
        </span>
        {bride}
      </p>
      <span
        className="h-px w-5 sm:w-7 md:w-9"
        style={{
          background:
            "linear-gradient(to left, transparent, var(--color-welcome-gold))",
        }}
        aria-hidden
      />
    </div>
  )
}

function LayeredProposalTitle({
  main,
  script,
  titleSize = welcomeTitleSize.main,
  scriptSize = welcomeTitleSize.script,
  scriptOverlap = welcomeTitleSize.overlap,
  scriptClassName = "",
}: {
  main: string
  script: string
  titleSize?: string
  scriptSize?: string
  scriptOverlap?: string
  scriptClassName?: string
}) {
  return (
    <h2
      className="welcome-title-lockup relative mx-auto w-full max-w-full text-center"
      style={
        {
          "--welcome-size": titleSize,
          "--script-size": scriptSize,
          "--script-overlap": scriptOverlap,
        } as CSSProperties
      }
    >
      <span
        className={`${theSeasons.className} block uppercase leading-[0.78] tracking-[0.08em] min-[400px]:tracking-[0.11em] sm:tracking-[0.13em] md:tracking-[0.14em]`}
        style={{
          fontSize: "var(--welcome-size)",
          color: palette.heading,
        }}
      >
        {main}
      </span>
      <span
        aria-hidden
        className={`${aboveTheBeyond.className} relative z-10 mx-auto block w-fit max-w-full px-1 leading-[0.88] sm:leading-[0.9] ${scriptClassName}`}
        style={{
          marginTop: "var(--script-overlap)",
          fontSize: "var(--script-size)",
          color: palette.accent,
          textShadow: NAME_SHADOW,
        }}
      >
        {script}
      </span>
      <span className="sr-only">{script}</span>
    </h2>
  )
}

function ProposalPersonalInvitationTitle() {
  return <LayeredProposalTitle main="A Special Invitation" script="just for you" />
}

function ProposalFlowHeader({
  icon,
  main,
  script,
  iconClassName = "",
  iconStyle,
  animated = false,
}: {
  icon: ReactNode
  main: string
  script: string
  iconClassName?: string
  iconStyle?: CSSProperties
  animated?: boolean
}) {
  const iconNode = (
    <div
      className={`flex h-12 w-12 items-center justify-center rounded-full shadow-sm backdrop-blur-sm ${iconClassName}`}
      style={iconStyle}
    >
      {icon}
    </div>
  )

  return (
    <>
      <div className="mb-6 flex justify-center">
        {animated ? (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.2, 1] }}
            transition={{ duration: 0.6 }}
          >
            {iconNode}
          </motion.div>
        ) : (
          iconNode
        )}
      </div>

      <div className="mb-4">
        <LayeredProposalTitle main={main} script={script} />
      </div>
    </>
  )
}

function ProposalFlowSubheader({ children }: { children: ReactNode }) {
  return (
    <p
      className={`${cinzel.className} ${sectionType.label} mx-auto mb-4 max-w-lg font-semibold uppercase tracking-[0.12em] sm:mb-5 sm:tracking-[0.16em] md:tracking-[0.18em]`}
      style={{ color: palette.label }}
    >
      {children}
    </p>
  )
}

function ProposalFlowBody({
  children,
  className = "",
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <p
      className={`font-goudy-italic mx-auto max-w-lg ${sectionType.textRelaxed} ${className}`}
      style={{ color: palette.body }}
    >
      {children}
    </p>
  )
}

function ProposalDateBlock({
  month,
  dayShort,
  dayNumber,
  time,
  year,
}: {
  month: string
  dayShort: string
  dayNumber: string
  time: string
  year: string
}) {
  const dateLineStyle = {
    background:
      "linear-gradient(to right, transparent, var(--color-welcome-gold), transparent)",
  } as const

  return (
    <div className="mx-auto w-full max-w-2xl">
      <div className="flex flex-col items-center gap-1.5 sm:gap-2.5 md:gap-3">
        <span
          className={`${cinzel.className} ${sectionType.label} font-light uppercase tracking-[0.4em] sm:tracking-[0.5em]`}
          style={{ color: palette.heading }}
        >
          {month}
        </span>

        <div className="flex w-full items-center gap-2 sm:gap-4 md:gap-5">
          <div className="flex flex-1 items-center justify-end gap-1.5 sm:gap-2.5">
            <span className="h-[0.5px] flex-1" style={dateLineStyle} aria-hidden />
            <span
              className={`${cinzel.className} text-[0.6rem] font-light uppercase tracking-[0.3em] sm:text-[0.7rem] sm:tracking-[0.4em] md:text-xs`}
              style={{ color: palette.heading }}
            >
              {dayShort}
            </span>
            <span
              className="h-[0.5px] w-6 sm:w-8 md:w-10"
              style={dateLineStyle}
              aria-hidden
            />
          </div>

          <div className="relative flex items-center justify-center px-3 sm:px-4 md:px-5">
            <span
              aria-hidden
              className="absolute inset-0 mx-auto h-[70%] max-h-[180px] w-[100px] rounded-full opacity-80 blur-[28px] sm:w-[140px] md:w-[170px]"
              style={{
                background:
                  "linear-gradient(to bottom, color-mix(in srgb, var(--color-welcome-gold) 35%, transparent), color-mix(in srgb, var(--color-welcome-gold) 18%, transparent), transparent)",
              }}
            />
            <span
              className={`${cinzel.className} relative text-[4rem] font-light leading-none tracking-wider sm:text-[5.5rem] md:text-[6.5rem] lg:text-[7rem]`}
              style={{
                color: palette.accent,
                textShadow:
                  "0 0 18px color-mix(in srgb, var(--color-welcome-gold) 45%, transparent), 0 2px 8px color-mix(in srgb, var(--color-welcome-navy) 12%, transparent)",
              }}
            >
              {dayNumber}
            </span>
          </div>

          <div className="flex flex-1 items-center gap-1.5 sm:gap-2.5">
            <span
              className="h-[0.5px] w-6 sm:w-8 md:w-10"
              style={dateLineStyle}
              aria-hidden
            />
            <span
              className={`${cinzel.className} text-[0.6rem] font-light uppercase tracking-[0.3em] sm:text-[0.7rem] sm:tracking-[0.4em] md:text-xs`}
              style={{ color: palette.heading }}
            >
              {time.split(",")[0]}
            </span>
            <span className="h-[0.5px] flex-1" style={dateLineStyle} aria-hidden />
          </div>
        </div>

        <span
          className={`${cinzel.className} ${sectionType.label} font-light uppercase tracking-[0.4em] sm:tracking-[0.5em]`}
          style={{ color: palette.heading }}
        >
          {year}
        </span>
      </div>
    </div>
  )
}

function ProposalRoleTitle({ roleSingular }: { roleSingular: string }) {
  return (
    <div className="mx-auto w-full max-w-xl space-y-3 text-center sm:space-y-4">
      {/* <p
        className={`${cinzel.className} ${sectionType.label} font-semibold uppercase tracking-[0.16em] sm:tracking-[0.2em] md:tracking-[0.24em]`}
        style={{ color: palette.label }}
      >
        Will You Stand With Us As Our
      </p> */}

      {/* <div className="flex items-center justify-center gap-3">
       <InlineDivider compact />
        <span
          className={`${aboveTheBeyond.className} shrink-0 text-[clamp(1rem,3vw,1.35rem)] leading-none`}
          style={{ color: palette.accent }}
          aria-hidden
        >
          &
        </span>
        <InlineDivider compact /> 
      </div> */}

      <h2
        className={`${theSeasons.className} capitalize leading-[1.1] tracking-[0.06em] sm:tracking-[0.08em] [overflow-wrap:anywhere]`}
        style={{
          fontSize: "clamp(2rem, 8.5vw, 3.75rem)",
          color: palette.heading,
          textShadow: NAME_SHADOW,
        }}
      >
        {roleSingular}?
      </h2>
    </div>
  )
}

function CoupleNameImage({
  groom,
  bride,
  className = "",
}: {
  groom: string
  bride: string
  className?: string
}) {
  return (
    <div
      className={`relative mx-auto aspect-[528/473] w-full max-w-[min(88vw,18rem)] sm:max-w-xs md:max-w-sm ${className}`}
    >
      <Image
        src="/Details/couplename.png"
        alt={`${groom} and ${bride}`}
        fill
        className="object-contain drop-shadow-[0_10px_28px_rgba(45,67,79,0.14)]"
        sizes="(max-width: 640px) 88vw, 320px"
        priority
      />
    </div>
  )
}

function DividerLine({ className = "w-16 sm:w-24 md:w-32" }: { className?: string }) {
  return <span className={`h-px ${className}`} style={dividerLineStyle} aria-hidden />
}

function CornerDecorations() {
  return (
    <>
      <div className="pointer-events-none absolute left-0 top-0 z-10">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/decoration/left-top-corner.png" alt="" aria-hidden="true" className={CORNER_DECO_CLASS} />
      </div>
      <div className="pointer-events-none absolute right-0 top-0 z-10">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/decoration/right-top-corner.png" alt="" aria-hidden="true" className={CORNER_DECO_CLASS} />
      </div>
      <div className="pointer-events-none absolute bottom-0 left-0 z-10">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/decoration/left-bottom-corner.png" alt="" aria-hidden="true" className={CORNER_DECO_CLASS} />
      </div>
      <div className="pointer-events-none absolute bottom-0 right-0 z-10">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/decoration/right-bottom-corner.png" alt="" aria-hidden="true" className={CORNER_DECO_CLASS} />
      </div>
    </>
  )
}

function ProposalCard({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`relative w-full ${className}`}>
      <div className="relative">
        <div
          className="pointer-events-none absolute -inset-1 rounded-2xl opacity-50 blur-2xl sm:-inset-2"
          style={ambientGlowStyle}
          aria-hidden
        />
        <div
          className="relative overflow-hidden rounded-xl border sm:rounded-2xl"
          style={cardStyle}
        >
          <div className="wedding-frame-inner hidden min-[400px]:block" aria-hidden />

          <div className="relative z-20 p-6 text-center sm:p-10 md:p-12 md:py-14 lg:p-14 lg:py-16">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

function ProposalIntroSection() {
  const siteConfig = useSiteConfig()

  const groomNickname = siteConfig.couple.groomNickname || siteConfig.couple.groom
  const brideNickname = siteConfig.couple.brideNickname || siteConfig.couple.bride
  const ceremonyDate =
    siteConfig.ceremony.date ?? siteConfig.wedding.date ?? defaultSiteConfig.ceremony.date
  const parsedDate = useMemo(
    () => parseWeddingDate(ceremonyDate, parseWeddingDate(defaultSiteConfig.ceremony.date)),
    [ceremonyDate],
  )
  const ceremonyDayShort = (
    siteConfig.ceremony.day ?? parsedDate.dayOfWeek ?? defaultSiteConfig.ceremony.day
  )
    .slice(0, 3)
    .toUpperCase()
  const ceremonyTime =
    siteConfig.ceremony.time ?? siteConfig.wedding.time ?? defaultSiteConfig.ceremony.time
  const { month, day: dateNum, year } = parsedDate
  const venue =
    siteConfig.wedding.venue ?? siteConfig.ceremony.location ?? defaultSiteConfig.ceremony.location

  return (
    <div
      className="mx-auto w-full max-w-xl space-y-5 text-center sm:space-y-6 md:space-y-7"
      style={{ color: palette.body, WebkitFontSmoothing: "antialiased" }}
    >
      <header className="space-y-3 px-1 sm:space-y-3.5 sm:px-2 md:space-y-4">
        <CoupleLabel groom={groomNickname} bride={brideNickname} />
        <ProposalPersonalInvitationTitle />
        <div className="pt-2 sm:pt-2.5">
          <OrnamentalDivider compact />
        </div>
      </header>

      <div
        className={`font-goudy-italic mx-auto max-w-xl space-y-3 px-1 text-pretty sm:space-y-3.5 sm:px-2 ${sectionType.textRelaxed}`}
        style={{ color: palette.body }}
      >
        <p>
          As we prepare for our wedding day, we keep coming back to the people who have meant the
          most to us — and you are one of them.
        </p>
        <p>
          This is not a general invitation. It is a personal ask, from our hearts to yours: we would
          love for you to be part of our celebration in a way that is truly special.
        </p>
      </div>

      <p
        className={`${cinzel.className} ${sectionType.label} font-semibold uppercase tracking-[0.14em] sm:tracking-[0.18em] md:tracking-[0.22em]`}
        style={{ color: palette.label }}
      >
        Our wedding day
      </p>

      {/* <CoupleNameImage groom={groomNickname} bride={brideNickname} className="my-1 sm:my-2" /> */}

      <ProposalDateBlock
        month={month}
        dayShort={ceremonyDayShort}
        dayNumber={dateNum}
        time={ceremonyTime}
        year={year}
      />

      <p
        className={`${cinzel.className} ${sectionType.subheader} font-medium uppercase tracking-[0.22em] sm:tracking-[0.26em] md:tracking-[0.3em]`}
        style={{ color: palette.heading }}
      >
        {venue}
      </p>

      <div className="pt-1 sm:pt-2">
        <OrnamentalDivider compact />
      </div>
    </div>
  )
}

const primaryBtnClass =
  `${cinzel.className} cursor-pointer rounded-full border px-5 py-3 text-[0.65rem] font-semibold uppercase tracking-[0.2em] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 sm:px-7 sm:py-3.5 sm:text-xs sm:tracking-[0.24em] md:px-8 md:py-4 md:tracking-[0.28em]`

const secondaryBtnClass =
  `${cinzel.className} cursor-pointer rounded-full border px-5 py-3 text-[0.65rem] font-semibold uppercase tracking-[0.2em] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] sm:px-7 sm:py-3.5 sm:text-xs sm:tracking-[0.24em] md:px-8 md:py-4 md:tracking-[0.28em]`

function ProposalAskSection({
  roleSingular,
  description,
  coAttendants,
  onYes,
  onNo,
}: {
  roleSingular: string
  description: string
  coAttendants: string[]
  onYes: () => void
  onNo: () => void
}) {
  const questionRef = useRef<HTMLDivElement>(null)
  const [questionHeight, setQuestionHeight] = useState<number | null>(null)

  useLayoutEffect(() => {
    const node = questionRef.current
    if (!node) return

    const syncHeight = () => {
      setQuestionHeight(node.getBoundingClientRect().height)
    }

    syncHeight()
    const observer = new ResizeObserver(syncHeight)
    observer.observe(node)

    return () => observer.disconnect()
  }, [roleSingular, description])

  return (
    <div className="relative mx-auto mt-0 w-full sm:mt-10">
      {/* {coAttendants.length > 0 && (
        <div
          className="mx-auto mb-8 max-w-lg space-y-3 rounded-xl px-5 py-4 text-center sm:px-6 sm:py-5"
          style={{ border: `1px solid ${BORDER_SOFT}`, backgroundColor: INNER_SURFACE }}
        >
          <div
            className={`${cinzel.className} flex items-center justify-center gap-2 text-[10px] font-semibold tracking-[0.2em] uppercase sm:text-xs`}
            style={labelStyle(palette.label)}
          >
            <Sparkles className="h-3.5 w-3.5 shrink-0" />
            <span>Co-members standing in this position</span>
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            {coAttendants.map((name, idx) => (
              <span
                key={idx}
                className="font-goudy-italic rounded-full px-3 py-1 text-xs shadow-sm"
                style={{ color: palette.body, border: `1px solid ${BORDER_SOFT}`, backgroundColor: "var(--color-welcome-bg)" }}
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      )} */}

      <div
        className="relative pt-2 sm:pt-12"
      >
        <div className="mb-6 flex items-center justify-center sm:mb-8">
          <DividerLine className="w-full max-w-md" />
        </div>
        <div className="relative mt-8 flex flex-col gap-5 sm:mt-10 sm:flex-row sm:items-end sm:justify-between sm:gap-8 md:gap-10">
          {/* Question + quote — text wraps around floated image on mobile */}
          <div className="relative z-10 min-w-0 flex-1 text-center sm:text-left">
            {/* <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.1, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
              aria-hidden
              className="pointer-events-none relative float-right ml-3 mb-2 h-[clamp(240px,62vw,340px)] w-[44%] max-w-[190px] shrink-0 sm:hidden"
              style={{ shapeOutside: "margin-box" }}
            >
              <Image
                src="/Details/coupleImage.png"
                alt=""
                fill
                className="object-contain object-bottom drop-shadow-[0_20px_48px_rgba(42,37,32,0.12)]"
                sizes="44vw"
                priority
              />
            </motion.div> */}

            <div ref={questionRef} className="mx-auto w-full max-w-xl space-y-5 sm:space-y-6">
              <ProposalRoleTitle roleSingular={roleSingular} />

              <p
                className={`font-goudy-italic mx-auto max-w-lg ${sectionType.textRelaxed} sm:text-left`}
                style={{ color: palette.body }}
              >
                &ldquo;{description}&rdquo;
              </p>
            </div>

            <div className="clear-both mt-10 hidden w-full flex-row gap-3 sm:mt-12 sm:flex sm:max-w-md md:mt-14">
              <button
                onClick={onYes}
                className={`${primaryBtnClass} min-w-0 flex-1`}
                style={primaryBtnStyle}
              >
                Yes, I&apos;d Be Honored
              </button>
              <button
                onClick={onNo}
                className={`${secondaryBtnClass} min-w-0 flex-1`}
                style={secondaryBtnStyle}
              >
                Regretfully Decline
              </button>
            </div>
          </div>

          {/* Couple illustration — desktop */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            aria-hidden
            style={
              questionHeight
                ? ({ "--ask-image-h": `${questionHeight}px` } as CSSProperties)
                : undefined
            }
            className="pointer-events-none relative hidden shrink-0 sm:block sm:w-[min(36vw,240px)] md:w-[min(32vw,280px)] lg:w-[300px]"
          >
            <div
              className="relative w-full sm:aspect-[3/4] sm:translate-y-4 md:translate-y-6"
              style={questionHeight ? { minHeight: "var(--ask-image-h)" } : undefined}
            >
              <Image
                src="/Details/coupleImage.png"
                alt=""
                fill
                className="object-contain object-bottom drop-shadow-[0_20px_48px_rgba(42,37,32,0.12)]"
                sizes="(max-width: 640px) 44vw, 300px"
                priority
              />
            </div>
          </motion.div>

          <div className="flex w-full flex-row gap-2.5 sm:hidden">
            <button
              onClick={onYes}
              className={`${primaryBtnClass} min-h-11 min-w-0 flex-1 px-4 py-3.5`}
              style={primaryBtnStyle}
            >
              Yes
            </button>
            <button
              onClick={onNo}
              className={`${secondaryBtnClass} min-h-11 min-w-0 flex-1 px-4 py-3.5`}
              style={secondaryBtnStyle}
            >
              Decline
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

type ProposalFlowState =
  | "question"
  | "yes_details"
  | "yes_submitted"
  | "no_clicked"
  | "no_submitted"

interface ProposalPageProps {
  role: ProposalRole
}

export function ProposalPage({ role }: ProposalPageProps) {
  const [isReady, setIsReady] = useState(false)
  const [flowState, setFlowState] = useState<ProposalFlowState>("question")
  const [preferredName, setPreferredName] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [validationError, setValidationError] = useState("")
  const [responses, setResponses] = useState<ProposalResponse[]>([])

  const handleLoadingComplete = useCallback(() => {
    setIsReady(true)
  }, [])

  useEffect(() => {
    fetch("/api/proposal-responses", { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setResponses(Array.isArray(data) ? data : []))
      .catch(() => setResponses([]))
  }, [])

  const coAttendants = responses
    .filter((r) => r.role === role.id && r.status === "Confirmed")
    .map((r) => r.name || "A Secret Supporter")

  const submitResponse = async (status: "Confirmed" | "Declined", name: string) => {
    const response = await fetch("/api/proposal-responses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        role: role.id,
        name,
        status,
        submittedAt: new Date().toISOString(),
      }),
    })

    if (!response.ok) {
      throw new Error("Failed to submit response")
    }

    window.dispatchEvent(new Event("entourageUpdated"))
  }

  const handleYesSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!preferredName.trim()) {
      setValidationError(
        "Please type your preferred name so we can add it to our invitation."
      )
      return
    }
    setValidationError("")
    setSubmitting(true)

    try {
      await submitResponse("Confirmed", preferredName.trim())
      setFlowState("yes_submitted")
    } catch (err) {
      console.error("Failed to submit confirmation:", err)
    } finally {
      setSubmitting(false)
    }
  }

  const handleNoSubmit = async () => {
    setSubmitting(true)
    try {
      await submitResponse("Declined", "Declined Entourage Offer")
      setFlowState("no_submitted")
    } catch (err) {
      console.error("Failed to submit decline:", err)
    } finally {
      setSubmitting(false)
    }
  }

  const roleSingular = getRoleSingular(role.title)

  return (
    <div
      className={`${theSeasons.variable} ${aboveTheBeyond.variable} relative min-h-screen select-none overflow-x-hidden px-3 py-10 sm:px-6 sm:py-16 md:py-20`}
      style={{ background: sectionBackground }}
    >
      {process.env.NEXT_PUBLIC_ENABLE_DECOR !== "false" && (
        <div className="pointer-events-none fixed inset-0 z-0" aria-hidden>
          <Suspense fallback={<div className="h-full w-full" style={{ background: sectionBackground }} />}>
            <Silk speed={8} scale={0.9} color="#EFDAC1" noiseIntensity={0} rotation={0.3} />
          </Suspense>
        </div>
      )}

      <CornerDecorations />

      {!isReady && <LoadingScreen onComplete={handleLoadingComplete} />}

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={isReady ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 mx-auto flex w-full max-w-2xl flex-col items-center justify-center lg:max-w-4xl min-h-[calc(100dvh-5rem)] sm:min-h-[calc(100dvh-8rem)]"
        style={{ color: palette.body }}
      >
        <AnimatePresence mode="wait">
          {flowState === "question" && (
            <motion.div
              key="question-box"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <ProposalCard>
              <div className="relative z-10 w-full space-y-6 pt-2 sm:space-y-9 sm:pt-3">
                <ProposalIntroSection />

                <div
                  className="mx-auto max-w-xl space-y-4 px-1 py-6 sm:space-y-5 sm:px-2 sm:py-9"
                >
                  <figure
                    className="rounded-md border px-4 py-3.5 sm:rounded-lg sm:px-5 sm:py-4"
                    style={{
                      background: INNER_SURFACE,
                      borderColor: BORDER_SOFT,
                    }}
                  >
                    <blockquote>
                      <p
                        className={`font-goudy-italic ${sectionType.textSnug}`}
                        style={{ color: palette.body }}
                      >
                        In choosing who will stand with us, we did not begin with titles — we began
                        with the people who have walked with us, believed in us, and loved us along
                        the way.
                      </p>
                    </blockquote>
                  </figure>

                  <div
                    className={`font-goudy-italic space-y-3 text-pretty sm:space-y-3.5 ${sectionType.textRelaxed}`}
                    style={{ color: palette.body }}
                  >
                    <p>
                      You have been a blessing in our lives — through your kindness, your laughter,
                      and the love you have shown us. That is why we are reaching out to you
                      personally, and not to everyone.
                    </p>
                    <p>
                      We cannot imagine this day without the people who matter most standing close
                      beside us. If your heart is open to it, it would mean the world to us to
                      have you there not only as someone we cherish, but as an important part of
                      our wedding.
                    </p>
                    <p
                      className={`${cinzel.className} ${sectionType.label} font-semibold uppercase tracking-[0.1em] sm:tracking-[0.14em] md:tracking-[0.16em]`}
                      style={{ color: palette.label }}
                    >
                      With sincerity and gratitude, we ask — would you stand with us as our:
                    </p>
                  </div>
                </div>

                <ProposalAskSection
                  roleSingular={roleSingular}
                  description={role.description}
                  coAttendants={coAttendants}
                  onYes={() => setFlowState("yes_details")}
                  onNo={() => setFlowState("no_clicked")}
                />
              </div>
              </ProposalCard>
            </motion.div>
          )}

          {flowState === "yes_details" && (
            <motion.form
              key="yes-form"
              onSubmit={handleYesSubmit}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4 }}
            >
              <ProposalCard>
              <div className="relative z-10 w-full space-y-4 py-1 sm:space-y-6 sm:py-3">
                <ProposalFlowHeader
                  icon={<Check className="h-6 w-6" style={{ color: IVORY }} />}
                  iconClassName=""
                  iconStyle={{
                    border: `1px solid ${GOLD_BORDER}`,
                    background: NAV_GOLD,
                    color: IVORY,
                  }}
                  main="We are Honored"
                  script="you said yes"
                />

                <ProposalFlowSubheader>A few details to complete your response</ProposalFlowSubheader>

                <ProposalFlowBody className="mb-2 max-w-md text-center sm:mb-3">
                  Thank you for accepting our invitation to stand with us. Your yes means more to
                  us than we can easily put into words — we are truly grateful.
                </ProposalFlowBody>

                <p
                  className={`font-goudy-italic mx-auto mb-1 max-w-md text-center ${sectionType.textSnug}`}
                  style={{ color: palette.bodySoft }}
                >
                  Please enter the exact name you would like displayed on our wedding invitation
                  and guest lists:
                </p>

                <div className="mx-auto max-w-md text-left">
                  <label className={`${cinzel.className} mb-2 block text-[10px] font-semibold tracking-[0.16em] uppercase sm:text-[12px]`} style={labelStyle(palette.label)}>
                    Your Preferred Name <span style={{ color: palette.accent }}>*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Aunt Maria Clara / Mr. James Bond"
                    value={preferredName}
                    onChange={(e) => setPreferredName(e.target.value)}
                    className="font-goudy-italic w-full rounded-xl px-4 py-2.5 text-xs transition-all focus:outline-none focus:ring-2 focus:ring-[color-mix(in_srgb,var(--color-welcome-gold)_28%,transparent)] sm:py-3 sm:text-sm"
                    style={{
                      color: palette.body,
                      backgroundColor: INNER_SURFACE,
                      border: `1px solid ${BORDER_SOFT}`,
                      boxShadow: "inset 0 1px 2px color-mix(in srgb, var(--color-welcome-gold) 10%, transparent)",
                    }}
                  />
                  {validationError && (
                    <p className="mt-2 flex items-center gap-1 text-xs font-medium text-rose-500">
                      <span>⚠️</span> {validationError}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-center pt-4">
                  <DividerLine className="w-full max-w-md" />
                </div>
                <div className="mx-auto flex max-w-md flex-col gap-3 sm:flex-row">
                  <button
                    type="submit"
                    disabled={submitting}
                    className={`${primaryBtnClass} flex-1`}
                    style={primaryBtnStyle}
                  >
                    {submitting ? "Saving..." : "Submit Response"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setFlowState("question")}
                    className={secondaryBtnClass}
                    style={secondaryBtnStyle}
                  >
                    Cancel
                  </button>
                </div>
              </div>
              </ProposalCard>
            </motion.form>
          )}

          {flowState === "yes_submitted" && (
            <motion.div
              key="yes-success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <ProposalCard>
              <div className="relative z-10 space-y-4">
                <ProposalFlowHeader
                  animated
                  icon={<Sparkles className="h-8 w-8" style={{ color: palette.heading }} />}
                  iconClassName=""
                  iconStyle={{
                    color: palette.heading,
                    border: `1px solid ${BORDER_SOFT}`,
                    backgroundColor: INNER_SURFACE,
                    boxShadow: "0 8px 24px color-mix(in srgb, var(--color-welcome-gold) 16%, transparent)",
                  }}
                  main="It's Official"
                  script="thank you"
                />

                <ProposalFlowSubheader>Your response has been received</ProposalFlowSubheader>

                <div
                  className="mx-auto mb-2 max-w-sm rounded-2xl px-6 py-4 shadow-sm backdrop-blur-sm sm:mb-4"
                  style={{ border: `1px solid ${BORDER_SOFT}`, backgroundColor: INNER_SURFACE }}
                >
                  <span
                    className={`${cinzel.className} mb-1 block text-[10px] font-semibold tracking-[0.16em] uppercase sm:text-[12px]`}
                    style={labelStyle(palette.label)}
                  >
                    Registered name
                  </span>
                  <p
                    className={`font-goudy-italic ${sectionType.text} font-medium`}
                    style={{ ...nameStyle, color: palette.heading }}
                  >
                    {preferredName}
                  </p>
                  <span
                    className={`${cinzel.className} mt-2 block text-[10px] font-semibold tracking-[0.14em] uppercase sm:text-[11px]`}
                    style={{ color: palette.bodySoft }}
                  >
                    Standing as our {role.title}
                  </span>
                </div>

                <ProposalFlowBody className="mb-8 max-w-md text-center sm:mb-10">
                  Having you stand with us fills our hearts with joy and gratitude. We cannot wait
                  to celebrate this beautiful day together with you by our side.
                </ProposalFlowBody>

                <div className="flex items-center justify-center pb-2 sm:pb-3">
                  <DividerLine className="w-full max-w-md" />
                </div>

                <Link
                  href="/"
                  className={`${primaryBtnClass} mx-auto inline-block w-full max-w-sm`}
                  style={primaryBtnStyle}
                >
                  Return to Wedding Page
                </Link>
              </div>
              </ProposalCard>
            </motion.div>
          )}

          {flowState === "no_clicked" && (
            <motion.div
              key="no-confirm"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <ProposalCard>
              <div className="relative z-10 space-y-4">
                <ProposalFlowHeader
                  icon={<X className="h-6 w-6" style={{ color: "#9b3d3d" }} />}
                  iconClassName=""
                  iconStyle={{
                    border: "1px solid color-mix(in srgb, #C99F91 45%, transparent)",
                    backgroundColor: "color-mix(in srgb, #C99F91 14%, white)",
                  }}
                  main="Thank You"
                  script="for responding"
                />

                <ProposalFlowSubheader>We understand and appreciate your honesty</ProposalFlowSubheader>

                <ProposalFlowBody className="mb-8 max-w-lg text-center sm:mb-10">
                  While we&apos;re saddened that you won&apos;t be able to join us in this role, we
                  truly appreciate your support and well wishes as we begin this new chapter
                  together.
                </ProposalFlowBody>

                <div className="flex items-center justify-center pt-4">
                  <DividerLine className="w-full max-w-md" />
                </div>
                <div className="mx-auto flex max-w-xs flex-col gap-3 sm:max-w-md sm:flex-row">
                  <button
                    onClick={handleNoSubmit}
                    disabled={submitting}
                    className={`${cinzel.className} flex-1 cursor-pointer rounded-full border px-8 py-4 text-[11px] font-semibold tracking-[0.18em] uppercase shadow-md transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50`}
                    style={{
                      backgroundColor: "#C99F91",
                      borderColor: "color-mix(in srgb, #C99F91 70%, transparent)",
                      color: IVORY,
                    }}
                  >
                    {submitting ? "Sending..." : "Send Response"}
                  </button>
                  <button
                    onClick={() => setFlowState("question")}
                    className={secondaryBtnClass}
                    style={secondaryBtnStyle}
                  >
                    Go Back
                  </button>
                </div>
              </div>
              </ProposalCard>
            </motion.div>
          )}

          {flowState === "no_submitted" && (
            <motion.div
              key="no-submitted-box"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <ProposalCard>
              <div className="relative z-10 space-y-4">
                <ProposalFlowHeader
                  icon={<Heart className="h-6 w-6" style={{ color: palette.heading }} />}
                  iconStyle={{
                    color: palette.heading,
                    border: `1px solid ${BORDER_SOFT}`,
                    backgroundColor: INNER_SURFACE,
                  }}
                  main="Response Sent"
                  script="successfully"
                />

                <ProposalFlowSubheader>Your message has reached us</ProposalFlowSubheader>

                <ProposalFlowBody className="mb-6 max-w-md text-center sm:mb-8">
                  We have received your response. Your love, support, and well wishes mean the
                  world to us regardless. We look forward to celebrating other special milestones
                  with you in the future.
                </ProposalFlowBody>

                <div className="flex items-center justify-center pb-2 sm:pb-3">
                  <DividerLine className="w-full max-w-md" />
                </div>

                <Link
                  href="/"
                  className={`${secondaryBtnClass} mx-auto inline-block w-full max-w-sm`}
                  style={secondaryBtnStyle}
                >
                  Return to Wedding Page
                </Link>
              </div>
              </ProposalCard>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
