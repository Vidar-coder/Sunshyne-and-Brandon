"use client"

import { useState, useEffect, useCallback, useMemo, Suspense, type CSSProperties, type ReactNode } from "react"
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
import { Cinzel, Playfair_Display } from "next/font/google"
import { useSiteConfig } from "@/hooks/use-site-config"
import { Hero as InvitationHero } from "@/components/loader/Hero"
import { LoadingScreen } from "@/components/loader/LoadingScreen"
import { getRoleSingular } from "@/lib/proposal-roles"
import { parseWeddingDate } from "@/lib/wedding-date"
import { sectionType, welcomeTitleSize } from "@/lib/section-typography"
import { siteConfig as defaultSiteConfig } from "@/content/site"
import type { ProposalRole, ProposalResponse } from "@/lib/proposal-types"

const Silk = dynamic(() => import("@/components/silk"), { ssr: false })

const proposalEntryEase = [0.22, 1, 0.36, 1] as const
const CINEMATIC_ENTRY_MS = 3000
const BEIGE = "#f6efe4"

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
const CHAMPAGNE = "#E8D5A3"
const GOLD_BRIGHT = "#d4af37"
const INK = "#2a221c"
const CREAM = "#3d3228"
const LABEL_GOLD = "#8a6414"
const GOLD_BORDER = "color-mix(in srgb, #d4af37 45%, transparent)"
const GOLD_BORDER_SOFT = "color-mix(in srgb, #d4af37 28%, transparent)"

const goldGradientText: CSSProperties = {
  background:
    "linear-gradient(168deg, #7a5810 0%, #5c400c 42%, #3d2a06 100%)",
  WebkitBackgroundClip: "text",
  backgroundClip: "text",
  color: "transparent",
}

const palette = {
  body: CREAM,
  bodySoft: "#4a3c30",
  heading: INK,
  label: LABEL_GOLD,
  accent: LABEL_GOLD,
  script: CHAMPAGNE,
} as const

const BORDER_SOFT = GOLD_BORDER_SOFT
const INNER_SURFACE = "#efe4d2"

const ambientGlowStyle = {
  background: `radial-gradient(ellipse 80% 65% at 50% 50%, color-mix(in srgb, ${GOLD_BRIGHT} 28%, transparent), transparent 68%)`,
} as const

const dividerLineStyle = {
  background: "linear-gradient(to right, transparent, rgb(212 175 55 / 70%), transparent)",
} as const

const coupleLabelLineStyle = {
  background: "linear-gradient(to right, transparent, rgb(212 175 55 / 70%))",
} as const

const nameStyle: CSSProperties = {
  fontSize: "clamp(0.6875rem, 2.55vw, 1.0625rem)",
  lineHeight: 1.3,
}

const cardStyle: CSSProperties = {
  background: BEIGE,
  borderColor: GOLD_BORDER,
  borderWidth: "1px",
  borderStyle: "solid",
  boxShadow:
    "0 18px 48px rgb(42 34 28 / 18%), inset 0 1px 0 rgb(255 250 244 / 80%)",
}

const primaryBtnStyle: CSSProperties = {
  fontWeight: 600,
  background: "linear-gradient(180deg, #fff8dc 0%, #f5d76e 42%, #c9a227 100%)",
  borderColor: "color-mix(in srgb, #fff8dc 60%, #d4af37)",
  color: INK,
  boxShadow: "0 8px 22px color-mix(in srgb, #d4af37 34%, transparent)",
}

const secondaryBtnStyle: CSSProperties = {
  fontWeight: 600,
  color: INK,
  backgroundColor: BEIGE,
  borderColor: GOLD_BORDER,
  boxShadow: "0 0 24px color-mix(in srgb, #d4af37 16%, transparent)",
}

const labelStyle = (color: string, extra?: CSSProperties): CSSProperties => ({
  fontFamily: cinzel.style.fontFamily,
  fontWeight: 600,
  color,
  ...extra,
})

function OrnamentalDivider({ compact = false }: { compact?: boolean }) {
  return (
    <div
      className={`mx-auto flex items-center justify-center gap-2 ${compact ? "max-w-[10rem]" : "max-w-xs sm:max-w-sm"}`}
      aria-hidden
    >
      <span className="h-px flex-1 bg-gradient-to-r from-transparent via-[#d4af37]/70 to-transparent" />
      <span className="h-1 w-1 rotate-45 bg-[#d4af37]" />
      <span className="h-px flex-1 bg-gradient-to-l from-transparent via-[#d4af37]/70 to-transparent" />
    </div>
  )
}

function CoupleLabel({ groom, bride }: { groom: string; bride: string }) {
  return (
    <div className="flex items-center justify-center gap-2.5 pt-1 sm:gap-3.5 sm:pt-1.5">
      <span className="h-px w-5 sm:w-7 md:w-9" style={coupleLabelLineStyle} aria-hidden />
      <p
        className={`${theSeasons.className} shrink-0 py-0.5 text-[clamp(0.95rem,3.6vw,1.25rem)] uppercase leading-snug tracking-[0.14em] sm:tracking-[0.18em]`}
        style={{ color: INK }}
      >
        {groom}
        <span
          className={`${aboveTheBeyond.className} mx-2 inline-block text-[clamp(1.15rem,4.2vw,1.5rem)] normal-case tracking-normal`}
          style={{ color: "#8a6840", verticalAlign: "middle" }}
          aria-hidden
        >
          &
        </span>
        {bride}
      </p>
      <span
        className="h-px w-5 sm:w-7 md:w-9"
        style={{
          background: "linear-gradient(to left, transparent, rgb(212 175 55 / 70%))",
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
        className={`${theSeasons.className} block uppercase leading-[0.92] tracking-[0.05em] min-[400px]:tracking-[0.08em] sm:leading-[0.94] sm:tracking-[0.12em] md:tracking-[0.14em]`}
        style={{
          fontSize: "var(--welcome-size)",
          ...goldGradientText,
        }}
      >
        {main}
      </span>
      <span
        aria-hidden
        className={`${aboveTheBeyond.className} relative z-10 mx-auto block w-fit max-w-full px-1 leading-[1] ${scriptClassName}`}
        style={{
          marginTop: "var(--script-overlap)",
          fontSize: "var(--script-size)",
          color: "#5c4014",
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
      className={`${playfair.className} mx-auto max-w-lg italic ${sectionType.textRelaxed} ${className}`}
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
    background: "linear-gradient(to right, transparent, rgb(212 175 55 / 70%), transparent)",
  } as const

  return (
    <div className="mx-auto w-full max-w-2xl">
      <div className="flex flex-col items-center gap-1.5 sm:gap-2.5 md:gap-3">
        <span
          className={`${theSeasons.className} text-[clamp(1.15rem,4.5vw,1.85rem)] uppercase leading-none tracking-[0.12em] sm:tracking-[0.16em]`}
          style={{
            color: INK,
          }}
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
                background: `radial-gradient(ellipse 80% 65% at 50% 50%, color-mix(in srgb, ${GOLD_BRIGHT} 42%, transparent), transparent 68%)`,
              }}
            />
            <span
              className={`${playfair.className} relative text-[clamp(3rem,16vw,6rem)] font-semibold italic leading-[0.92] tabular-nums tracking-[0.01em]`}
              style={goldGradientText}
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
          className={`${cinzel.className} text-[clamp(0.85rem,3.2vw,1.15rem)] font-semibold uppercase tracking-[0.32em] sm:tracking-[0.38em]`}
          style={goldGradientText}
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
        className={`${theSeasons.className} capitalize leading-[0.94] tracking-[0.06em] sm:tracking-[0.1em] [overflow-wrap:anywhere]`}
        style={{
          fontSize: "clamp(2rem, 8.5vw, 3.75rem)",
          ...goldGradientText,
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
        className={`${playfair.className} italic mx-auto max-w-xl space-y-3 px-1 text-pretty sm:space-y-3.5 sm:px-2 ${sectionType.textRelaxed}`}
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
        className={`${cinzel.className} text-[0.58rem] font-medium uppercase leading-relaxed tracking-[0.18em] sm:text-[0.65rem] sm:tracking-[0.22em]`}
        style={{ color: INK }}
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
                className="italic rounded-full px-3 py-1 text-xs shadow-sm"
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
        <div className="relative mt-8 flex flex-col gap-5 sm:mt-10">
          <div className="relative z-10 min-w-0 flex-1 text-center sm:text-left">
            <div className="mx-auto flex w-full max-w-xl items-center gap-3 sm:gap-6">
              <div className="min-w-0 flex-1 space-y-5 sm:space-y-6">
                <ProposalRoleTitle roleSingular={roleSingular} />

                <p
                  className={`${playfair.className} italic mx-auto max-w-lg ${sectionType.textRelaxed} sm:text-left`}
                  style={{ color: palette.body }}
                >
                  &ldquo;{description}&rdquo;
                </p>
              </div>

              <div className="relative h-[9.5rem] w-[5.75rem] shrink-0 sm:h-64 sm:w-40 md:h-72 md:w-48">
                <Image
                  src="/image/couple-image.png"
                  alt=""
                  fill
                  className="object-contain object-bottom drop-shadow-[0_16px_32px_rgba(42,37,32,0.18)]"
                  sizes="(max-width: 640px) 92px, 192px"
                  priority
                />
              </div>
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
  const [flowState, setFlowState] = useState<ProposalFlowState>("question")
  const [preferredName, setPreferredName] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [validationError, setValidationError] = useState("")
  const [responses, setResponses] = useState<ProposalResponse[]>([])
  const [showInvitation, setShowInvitation] = useState(false)
  const [loadingOverlayVisible, setLoadingOverlayVisible] = useState(true)
  const [heroEnterFromLoading, setHeroEnterFromLoading] = useState(false)
  const [proposalVisible, setProposalVisible] = useState(false)
  const [enteringFromInvite, setEnteringFromInvite] = useState(false)

  const handleLoadingFadeStart = useCallback(() => {
    setShowInvitation(true)
    setHeroEnterFromLoading(true)
  }, [])

  const handleLoadingComplete = useCallback(() => {
    setLoadingOverlayVisible(false)
  }, [])

  const handleTransitionStart = useCallback(() => {
    setEnteringFromInvite(true)
    setProposalVisible(true)
    window.scrollTo({ top: 0, behavior: "instant" })
  }, [])

  const handleOpenInvitation = useCallback(() => {
    setShowInvitation(false)
    window.scrollTo({ top: 0, behavior: "smooth" })
    window.setTimeout(() => setEnteringFromInvite(false), CINEMATIC_ENTRY_MS)
  }, [])

  const pageScrollLocked = loadingOverlayVisible || showInvitation
  const cinematicEntry = enteringFromInvite && proposalVisible

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
      className={`${theSeasons.variable} ${aboveTheBeyond.variable} ${playfair.className} relative min-h-screen select-none px-3 py-10 text-[#3d3228] sm:px-6 sm:py-16 md:py-20 ${pageScrollLocked ? "overflow-hidden" : "overflow-x-hidden"}`}
      style={{ background: "#780008" }}
    >
      <div className="pointer-events-none fixed inset-0 z-0" aria-hidden>
        <Suspense fallback={<div className="h-full w-full bg-[#780008]" />}>
          <Silk speed={8} scale={0.9} color="#780008" noiseIntensity={0} rotation={0.3} />
        </Suspense>
      </div>

      {loadingOverlayVisible && (
        <LoadingScreen
          onFadeStart={handleLoadingFadeStart}
          onComplete={handleLoadingComplete}
        />
      )}

      {(loadingOverlayVisible || showInvitation) && (
        <InvitationHero
          onOpen={handleOpenInvitation}
          onTransitionStart={handleTransitionStart}
          enterFromLoading={heroEnterFromLoading}
          visible={showInvitation}
        />
      )}

      {cinematicEntry && (
        <motion.div
          className="pointer-events-none fixed inset-0 z-[28] bg-[#faf7f1]"
          aria-hidden="true"
          initial={{ clipPath: "circle(0% at 50% 46%)", opacity: 0.98 }}
          animate={{ clipPath: "circle(145% at 50% 46%)", opacity: 0 }}
          transition={{ duration: 1.55, delay: 0.12, ease: proposalEntryEase }}
        />
      )}

      <motion.div
        initial={false}
        animate={
          proposalVisible
            ? { opacity: 1, y: 0, filter: "blur(0px)" }
            : { opacity: 0, y: 40, filter: "blur(8px)" }
        }
        transition={
          cinematicEntry
            ? { duration: 1.08, ease: proposalEntryEase, delay: 0.86 }
            : { duration: 0.01 }
        }
        className={`relative z-10 mx-auto flex w-full max-w-2xl flex-col items-center justify-center lg:max-w-4xl min-h-[calc(100dvh-5rem)] sm:min-h-[calc(100dvh-8rem)] ${proposalVisible ? "" : "pointer-events-none"}`}
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
                        className={`${playfair.className} italic ${sectionType.textSnug}`}
                        style={{ color: palette.body }}
                      >
                        In choosing who will stand with us, we did not begin with titles — we began
                        with the people who have walked with us, believed in us, and loved us along
                        the way.
                      </p>
                    </blockquote>
                  </figure>

                  <div
                    className={`${playfair.className} italic space-y-3 text-pretty sm:space-y-3.5 ${sectionType.textRelaxed}`}
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
                  icon={<Check className="h-6 w-6" style={{ color: INK }} />}
                  iconClassName=""
                  iconStyle={{
                    border: `1px solid ${GOLD_BORDER}`,
                    background: "linear-gradient(180deg, #fff8dc 0%, #d4af37 100%)",
                    color: INK,
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
                  className={`${playfair.className} italic mx-auto mb-1 max-w-md text-center ${sectionType.textSnug}`}
                  style={{ color: INK }}
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
                    className={`${playfair.className} italic w-full rounded-xl px-4 py-2.5 text-xs text-[#3d3228] placeholder:text-[#3d3228]/45 transition-all focus:outline-none focus:ring-2 focus:ring-[#d4af37]/40 sm:py-3 sm:text-sm`}
                    style={{
                      color: INK,
                      backgroundColor: INNER_SURFACE,
                      border: `1px solid ${BORDER_SOFT}`,
                      boxShadow: "inset 0 1px 2px rgb(0 0 0 / 28%)",
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
                  icon={<Sparkles className="h-8 w-8" style={{ color: CHAMPAGNE }} />}
                  iconClassName=""
                  iconStyle={{
                    color: CHAMPAGNE,
                    border: `1px solid ${BORDER_SOFT}`,
                    backgroundColor: INNER_SURFACE,
                    boxShadow: "0 8px 24px color-mix(in srgb, #d4af37 28%, transparent)",
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
                    className={`${playfair.className} italic ${sectionType.text} font-medium`}
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
                  icon={<X className="h-6 w-6" style={{ color: CHAMPAGNE }} />}
                  iconClassName=""
                  iconStyle={{
                    border: `1px solid ${BORDER_SOFT}`,
                    backgroundColor: INNER_SURFACE,
                    color: CHAMPAGNE,
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
                    style={primaryBtnStyle}
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
                  icon={<Heart className="h-6 w-6" style={{ color: CHAMPAGNE }} />}
                  iconStyle={{
                    color: CHAMPAGNE,
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
