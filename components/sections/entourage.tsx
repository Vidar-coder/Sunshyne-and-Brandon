"use client"

import React from "react"
import { useState, useEffect, useMemo, useRef } from "react"
import localFont from "next/font/local"
import Image from "next/image"
import { layeredSectionTitleSize, sectionType } from "@/lib/section-typography"
import { Cinzel } from "next/font/google"
import { useSiteConfig } from "@/hooks/use-site-config"
import { fetchUntilReady, isAbortError } from "@/lib/fetch-until-ready"
import { fetchInvitationList } from "@/lib/invitation-data"

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
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
const CREAM = "#f7f2e8"
const BURGUNDY = "#51080f"
const BURGUNDY_MID = "#751a23"
const BURGUNDY_DEEP = "#3d0810"
const BURGUNDY_INK = "#5c241c"
const GOLD = "#c4a265"
const GOLD_BRIGHT = "#d4af37"
const CHAMPAGNE = "#e8c547"
const BODY_ON_DARK = "color-mix(in srgb, #fffaf4 90%, #e8c547 10%)"
const BODY_ON_CARD = "#6b4a42"
const GOLD_BORDER = "color-mix(in srgb, #c4a265 55%, #751a23)"
const GOLD_BORDER_SOFT = "color-mix(in srgb, #c4a265 32%, transparent)"

const entourageSectionBackground = `
  radial-gradient(ellipse 90% 55% at 50% 0%, color-mix(in srgb, ${GOLD_BRIGHT} 18%, transparent) 0%, transparent 58%),
  radial-gradient(ellipse 70% 45% at 8% 92%, color-mix(in srgb, ${BURGUNDY_MID} 35%, transparent) 0%, transparent 52%),
  radial-gradient(ellipse 65% 40% at 94% 88%, color-mix(in srgb, ${GOLD} 14%, transparent) 0%, transparent 50%),
  linear-gradient(180deg, ${BURGUNDY_DEEP} 0%, ${BURGUNDY} 42%, ${BURGUNDY_MID} 78%, ${BURGUNDY_DEEP} 100%)
`.trim()

/** Seamless damask tile (141×308); shifted to gold via CSS filters */
const DAMASK_TEXTURE = "/textures/damask-burgundy.png"
const damaskTileBackground = {
  backgroundImage: `url("${DAMASK_TEXTURE}")`,
  backgroundRepeat: "repeat",
  backgroundSize: "clamp(118px, 16vw, 188px) auto",
} as const

const goldDamaskMotifFilter =
  "sepia(1) saturate(2.85) hue-rotate(358deg) brightness(1.12) contrast(1.08)"

const goldDamaskSheenFilter =
  "brightness(0) saturate(100%) invert(84%) sepia(38%) saturate(520%) hue-rotate(358deg) brightness(108%) contrast(96%)"

function EntourageDamaskPattern() {
  return (
    <>
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-[0.32] sm:opacity-[0.28] md:opacity-[0.24]"
        aria-hidden
        style={{
          ...damaskTileBackground,
          filter: goldDamaskMotifFilter,
          mixBlendMode: "soft-light",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-[0.12] sm:opacity-[0.1]"
        aria-hidden
        style={{
          ...damaskTileBackground,
          filter: goldDamaskSheenFilter,
          mixBlendMode: "overlay",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          background: `
            linear-gradient(180deg, color-mix(in srgb, ${BURGUNDY_DEEP} 55%, transparent) 0%, transparent 22%, transparent 78%, color-mix(in srgb, ${BURGUNDY_DEEP} 50%, transparent) 100%),
            radial-gradient(ellipse 85% 55% at 50% 45%, transparent 35%, color-mix(in srgb, ${BURGUNDY_DEEP} 38%, transparent) 100%)
          `,
        }}
      />
    </>
  )
}

const palette = {
  body: BODY_ON_CARD,
  heading: BURGUNDY_INK,
  label: BURGUNDY_MID,
  accent: GOLD,
} as const

const goldDividerStyle = {
  background: `linear-gradient(to right, transparent, ${GOLD_BRIGHT}, transparent)`,
} as const

const goldDividerStyleLeft = {
  background: `linear-gradient(to left, transparent, ${CHAMPAGNE}, transparent)`,
} as const

const dividerLineStyle = {
  background: `linear-gradient(to right, transparent, color-mix(in srgb, ${GOLD} 65%, ${BURGUNDY_MID}), transparent)`,
} as const

const cardStyle = {
  background: `linear-gradient(180deg, ${IVORY} 0%, ${CREAM} 48%, ${IVORY} 100%)`,
  borderColor: GOLD_BORDER,
  borderWidth: "1px",
  borderStyle: "solid",
  boxShadow:
    "0 18px 42px color-mix(in srgb, #3d0810 42%, transparent), 0 0 0 1px color-mix(in srgb, #c4a265 22%, transparent), inset 0 1px 0 rgb(255 250 244 / 85%)",
} as const

const BB_MOTIF = "/image/beauty-and-beast.png"

function OutsideDivider() {
  return (
    <div className="flex items-center justify-center gap-1.5">
      <span className="h-px w-6 sm:w-10" style={goldDividerStyle} />
      <span className="h-0.5 w-0.5 rounded-full sm:h-1 sm:w-1" style={{ background: GOLD }} aria-hidden />
      <span className="h-px w-6 sm:w-10" style={goldDividerStyleLeft} />
    </div>
  )
}

const SECTION_TITLE_CLASS = `${theSeasons.className} text-[0.8rem] sm:text-[0.95rem] md:text-[1.1rem] tracking-[0.08em] sm:tracking-[0.12em] md:tracking-[0.14em] uppercase leading-tight`

const nameStyle: React.CSSProperties = {
  fontSize: "clamp(0.82rem, min(2.6vw, 6.4cqi), 1.28rem)",
  lineHeight: 1.35,
  letterSpacing: "0.03em",
}

const roleTitleStyle: React.CSSProperties = {
  fontSize: "clamp(0.58rem, min(1.8vw, 4.2cqi), 0.82rem)",
  lineHeight: 1.1,
}

const ROMAN_NUMERAL = /^(I|II|III|IV|V|VI|VII|VIII|IX|X|XI|XII|XIII|XIV|XV)$/i
const SPECIAL_GLYPH = /^(?:I|II|III|IV|V|VI|VII|VIII|IX|X|XI|XII|XIII|XIV|XV|&|\+|[.’'`´-]|—|–)$/i
const SPECIAL_SPLIT = /(\b(?:I|II|III|IV|V|VI|VII|VIII|IX|X|XI|XII|XIII|XIV|XV)\b|&|\+|[.’'`´-]|—|–)/g
const DASH_GLYPH = /^[-—–]$/
const PLUS_GLYPH = /^\+$/

function toDisplayName(value: string) {
  return value
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((word) =>
      word
        .split("-")
        .map((part) => {
          if (!part) return part
          if (ROMAN_NUMERAL.test(part)) return part.toUpperCase()
          return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()
        })
        .join("-"),
    )
    .join(" ")
}

function MixedFontText({
  text,
  specialClassName,
}: {
  text: string
  specialClassName: string
}) {
  const parts = text.split(new RegExp(SPECIAL_SPLIT.source, "g"))
  return (
    <>
      {parts.map((part, index) => {
        if (!part) return null
        if (DASH_GLYPH.test(part)) {
          return (
            <span
              key={`${part}-${index}`}
              className="font-normal not-italic tracking-normal"
              style={{ fontFamily: '"SortsMillGoudy", Georgia, "Times New Roman", serif' }}
            >
              {part}
            </span>
          )
        }
        if (PLUS_GLYPH.test(part)) {
          return (
            <span
              key={`${part}-${index}`}
              className="relative -top-[0.08em] mx-[0.1em] inline-block font-normal not-italic tracking-normal"
              style={{
                fontFamily: '"SortsMillGoudy", Georgia, "Times New Roman", serif',
                fontSize: "0.95em",
              }}
              aria-label="of blessed memory"
            >
              †
            </span>
          )
        }
        if (SPECIAL_GLYPH.test(part)) {
          return (
            <span key={`${part}-${index}`} className={specialClassName}>
              {part}
            </span>
          )
        }
        return <React.Fragment key={`${part}-${index}`}>{part}</React.Fragment>
      })}
    </>
  )
}

function BeautyBeastMotif({
  className = "",
  tone = "burgundy",
  size = "hero",
}: {
  className?: string
  tone?: "burgundy" | "ivory"
  size?: "hero" | "compact"
}) {
  const filter =
    tone === "ivory"
      ? "brightness(0) invert(1) drop-shadow(0 0 14px rgba(212, 175, 55, 0.4))"
      : "brightness(0) saturate(100%) invert(18%) sepia(42%) saturate(1800%) hue-rotate(314deg) brightness(92%) contrast(95%)"

  const sizeClass =
    size === "compact"
      ? "w-[min(160px,44vw)] sm:w-[min(180px,32vw)] md:w-[200px]"
      : "w-[min(220px,52vw)] sm:w-[min(260px,38vw)] md:w-[280px]"

  return (
    <div className={`pointer-events-none mx-auto ${className}`} aria-hidden>
      <Image
        src={BB_MOTIF}
        alt=""
        width={640}
        height={280}
        sizes={size === "compact" ? "200px" : "(min-width: 768px) 280px, 52vw"}
        className={`mx-auto h-auto object-contain opacity-[0.92] ${sizeClass}`}
        style={{ filter }}
      />
    </div>
  )
}

function CouplePromiseMark() {
  return (
    <div className="mb-4 text-center sm:mb-5 md:mb-6">
      <BeautyBeastMotif size="compact" className="mb-3 sm:mb-4" />
      <p
        className={`${cinzel.className} text-[0.625rem] font-semibold uppercase tracking-[0.2em] sm:text-[0.6875rem] sm:tracking-[0.24em] md:text-xs md:tracking-[0.28em]`}
        style={{ color: BURGUNDY_MID }}
      >
        Together as one
      </p>
      <p
        className={`font-goudy-italic mx-auto mt-1.5 max-w-[16rem] ${sectionType.textSnug} sm:mt-2`}
        style={{ color: BODY_ON_CARD }}
      >
        A tale as old as time — the beginning of our forever
      </p>
    </div>
  )
}

function EntourageTitle() {
  return (
    <h2
      className="welcome-title-lockup relative mx-auto w-full max-w-full text-center"
      style={
        {
          "--title-size": layeredSectionTitleSize.main,
          "--script-size": layeredSectionTitleSize.script,
        } as React.CSSProperties
      }
    >
      <span className="sr-only">Wedding Entourage — standing with us</span>
      <span
        aria-hidden
        className={`${theSeasons.className} block uppercase leading-[0.9] tracking-[0.04em] min-[400px]:tracking-[0.08em] sm:tracking-[0.12em] md:tracking-[0.14em]`}
        style={{
          fontSize: "var(--title-size)",
          color: IVORY,
          textShadow: "0 2px 14px color-mix(in srgb, #3d0810 75%, transparent)",
        }}
      >
        Wedding Entourage
      </span>
      <span
        aria-hidden
        className={`${aboveTheBeyond.className} relative z-10 mx-auto mt-1.5 block w-fit max-w-full px-1 leading-[0.88] sm:mt-2 sm:leading-[0.9]`}
        style={{
          fontSize: "var(--script-size)",
          color: CHAMPAGNE,
          textShadow:
            "0 1px 0 color-mix(in srgb, #3d0810 85%, transparent), 0 0 18px color-mix(in srgb, #d4af37 45%, transparent)",
        }}
      >
        standing with us
      </span>
    </h2>
  )
}

interface EntourageMember {
  name: string
  roleCategory: string
  roleTitle: string
  email: string
}

interface PrincipalSponsor {
  malePrincipalSponsor: string
  femalePrincipalSponsor: string
}

/** Accepts PascalCase from API / Sheets or camelCase */
function entourageMemberFromApi(row: Record<string, unknown>): EntourageMember {
  const r = row as Record<string, string | undefined>
  return {
    name: r.name ?? r.Name ?? "",
    roleCategory: r.roleCategory ?? r.RoleCategory ?? "",
    roleTitle: r.roleTitle ?? r.RoleTitle ?? "",
    email: r.email ?? r.Email ?? "",
  }
}

function principalSponsorFromApi(row: Record<string, unknown>): PrincipalSponsor {
  const r = row as Record<string, string | undefined>
  return {
    malePrincipalSponsor: r.malePrincipalSponsor ?? r.MalePrincipalSponsor ?? "",
    femalePrincipalSponsor: r.femalePrincipalSponsor ?? r.FemalePrincipalSponsor ?? "",
  }
}

const ct = {
  label: sectionType.label,
  sectionTitle: `${sectionType.label} lg:text-base`,
  body: sectionType.text,
  bodyLg: sectionType.subheader,
} as const

const ROLE_CATEGORY_ORDER = [
  "OFFICIATING MINISTER",
  "The Couple",
  "Parents of the Groom",
  "Parents of the Bride",
  "Family of the Groom",
  "Family of the Bride",
  "Man of Honor",
  "Matron of Honor",
  "Best Man",
  "Maid of Honor",
  "Groomsmen",
  "Bridesmaids",
  "Candle Sponsors",
  "Veil Sponsors",
  "Cord Sponsors",
  "Ribbon Sponsors",
  "Little Groom",
  "Little Bride",
  "Ring Bearer",
  "Bible Bearer",
  "Coin Bearer",
  "Flower Ladies",
]

const SINGLE_COLUMN_SECTIONS = new Set([
  "Best Man",
  "Maid of Honor",
  "Ring Bearer",
  "Coin Bearer",
  "Bible Bearer",
  "Flower Ladies",
  "Flower Girls",
  "Presider",
])

const ROLE_CATEGORY_DISPLAY_TITLES: Record<string, string> = {
  "Candle Sponsors": "To light our path",
  "Candle Sponsor": "To light our path",
  "Veil Sponsors": "To Cloth us as one",
  "Veil Sponsor": "To Cloth us as one",
  Veil: "To Cloth us as one",
  "Cord Sponsors": "To bind us together",
  "Cord Sponsor": "To bind us together",
  "Chord Sponsors": "To bind us together",
  "Chord Sponsor": "To bind us together",
  Chord: "To bind us together",
  Cord: "To bind us together",
}

function displayRoleCategory(category: string) {
  return ROLE_CATEGORY_DISPLAY_TITLES[category] ?? category
}

const HONOR_ATTENDANT_BLOCK_CATEGORIES = [
  "Man of Honor",
  "Matron of Honor",
  "Best Man",
  "Maid of Honor",
] as const

function normalizeRoleCategory(category: string): string {
  const normalized = category.trim()
  if (normalized.toLowerCase() === "officiating minister") {
    return "OFFICIATING MINISTER"
  }
  const honorAliases: Record<string, string> = {
    "man of honor": "Man of Honor",
    "best man": "Best Man",
    "maid of honor": "Maid of Honor",
    "matron of honor": "Matron of Honor",
  }
  const alias = honorAliases[normalized.toLowerCase()]
  if (alias) return alias
  if (normalized.toLowerCase() === "peer sponsors") {
    return "Peer Sponsors"
  }
  if (
    normalized.toLowerCase() === "flower ladies" ||
    normalized.toLowerCase() === "flower girls"
  ) {
    return "Flower Ladies"
  }
  return normalized
}

function isCoupleMember(member: EntourageMember): boolean {
  return normalizeRoleCategory(member.roleCategory) === "The Couple"
}

function sortGroomParents(members: EntourageMember[]): EntourageMember[] {
  return [...members].sort((a, b) => {
    const aIsFather = a.roleTitle?.toLowerCase().includes("father") ?? false
    const bIsFather = b.roleTitle?.toLowerCase().includes("father") ?? false
    if (aIsFather && !bIsFather) return -1
    if (!aIsFather && bIsFather) return 1
    return 0
  })
}

function sortBrideParents(members: EntourageMember[]): EntourageMember[] {
  return [...members].sort((a, b) => {
    const aIsMother = a.roleTitle?.toLowerCase().includes("mother") ?? false
    const bIsMother = b.roleTitle?.toLowerCase().includes("mother") ?? false
    if (aIsMother && !bIsMother) return -1
    if (!aIsMother && bIsMother) return 1
    return 0
  })
}

async function loadEntourageFromApi(signal?: AbortSignal, reload = false): Promise<EntourageMember[]> {
  const data = await fetchInvitationList<Record<string, unknown>>("/api/entourage", { signal, reload })
  return data
    .map((row) => entourageMemberFromApi(row))
    .filter((member) => member.roleCategory.trim() || member.roleTitle.trim() || member.name.trim())
    .filter((member) => !isCoupleMember(member))
}

async function loadSponsorsFromApi(signal?: AbortSignal, reload = false): Promise<PrincipalSponsor[]> {
  const data = await fetchInvitationList<Record<string, unknown>>("/api/principal-sponsor", { signal, reload })
  return data
    .map((row) => principalSponsorFromApi(row))
    .filter((sponsor) => sponsor.malePrincipalSponsor.trim() || sponsor.femalePrincipalSponsor.trim())
}

export function Entourage() {
  const siteConfig = useSiteConfig()
  const groomName = siteConfig.couple.groom
  const brideName = siteConfig.couple.bride
  const [entourage, setEntourage] = useState<EntourageMember[]>([])
  const [sponsors, setSponsors] = useState<PrincipalSponsor[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isRetrying, setIsRetrying] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isVisible, setIsVisible] = useState(true)
  const sectionRef = useRef<HTMLDivElement>(null)

  const loadPartyUntilReady = async (signal?: AbortSignal, { replace = true } = {}) => {
    if (replace) {
      setIsLoading(true)
      setError(null)
    }
    setIsRetrying(false)
    try {
      const [members, sponsorList] = await Promise.all([
        fetchUntilReady({
          signal,
          load: (signal) => loadEntourageFromApi(signal, !replace),
          isReady: () => true,
          maxAttempts: 3,
          onRetry: () => setIsRetrying(true),
        }),
        fetchUntilReady({
          signal,
          load: (signal) => loadSponsorsFromApi(signal, !replace),
          isReady: () => true,
          maxAttempts: 3,
          onRetry: () => setIsRetrying(true),
        }),
      ])
      setEntourage(members)
      setSponsors(sponsorList)
      setError(null)
      setIsRetrying(false)
    } catch (err: unknown) {
      if (isAbortError(err)) return
      console.error("Failed to load entourage:", err)
      setIsRetrying(false)
      if (replace) {
        setError("Unable to load entourage")
      }
    } finally {
      if (!signal?.aborted) {
        setIsLoading(false)
      }
    }
  }

  useEffect(() => {
    const controller = new AbortController()
    void loadPartyUntilReady(controller.signal)

    const handleEntourageUpdate = () => {
      setTimeout(() => {
        void loadPartyUntilReady(undefined, { replace: false })
      }, 1000)
    }

    window.addEventListener("entourageUpdated", handleEntourageUpdate)

    return () => {
      controller.abort()
      window.removeEventListener("entourageUpdated", handleEntourageUpdate)
    }
  }, [])

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current)
      }
    }
  }, [])

  // Group entourage by role category
  const grouped = useMemo(() => {
    const grouped: Record<string, EntourageMember[]> = {}
    
    entourage.forEach((member) => {
      const category = normalizeRoleCategory(member.roleCategory)

      // Skip members without a category or in "Other"
      if (!category || category === "Other") {
        return
      }
      if (!grouped[category]) {
        grouped[category] = []
      }
      grouped[category].push(member)
    })
    
    return grouped
  }, [entourage])

  const hasParents =
    (grouped["Parents of the Groom"]?.length ?? 0) > 0 || (grouped["Parents of the Bride"]?.length ?? 0) > 0

  // Helper component for elegant section titles (category labels)
  const SectionTitle = ({
    children,
    align = "center",
    className = "",
  }: {
    children: React.ReactNode
    align?: "left" | "center" | "right"
    className?: string
  }) => {
    const textAlign =
      align === "right" ? "text-right" : align === "left" ? "text-left" : "text-center"
    return (
      <h3
        className={`relative ${SECTION_TITLE_CLASS} mb-1.5 sm:mb-2 md:mb-2.5 ${textAlign} ${className} transition-all duration-300`}
        style={{ color: BURGUNDY_MID }}
      >
        {typeof children === "string" ? (
          <MixedFontText
            text={children}
            specialClassName="font-goudy-italic normal-case tracking-normal"
          />
        ) : (
          children
        )}
      </h3>
    )
  }

  // Helper component for name items with role title (supports alignment)
  const NameItem = ({
    member,
    align = "center",
    showRole = true,
    featured = false,
  }: {
    member: EntourageMember
    align?: "left" | "center" | "right"
    showRole?: boolean
    featured?: boolean
  }) => {
    const containerAlign =
      align === "right" ? "items-end" : align === "left" ? "items-start" : "items-center"
    const textAlign =
      align === "right" ? "text-right" : align === "left" ? "text-left" : "text-center"
    const displayName = toDisplayName(member.name)
    const displayRole = member.roleTitle ? toDisplayName(member.roleTitle) : ""
    return (
      <div
        className={`relative flex flex-col ${containerAlign} justify-center py-1 sm:py-1.5 min-w-0 w-full max-w-full group/item transition-all duration-300`}
      >
        <div
          className="absolute inset-0 opacity-0 group-hover/item:opacity-100 transition-opacity duration-300 rounded-md"
          style={{ background: `linear-gradient(to right, transparent, color-mix(in srgb, ${GOLD} 18%, transparent), transparent)` }}
        />
        <p
          className={`${theSeasons.className} relative ${textAlign} text-balance transition-all duration-300 max-w-full break-words`}
          style={{
            ...nameStyle,
            ...(featured
              ? {
                  fontSize: "clamp(0.82rem, min(2.5vw, 6.2cqi), 1.3rem)",
                }
              : {}),
            color: BURGUNDY_INK,
          }}
          title={displayName.replace(/\+/g, "†")}
        >
          {displayName ? (
            <MixedFontText
              text={displayName}
              specialClassName="font-goudy-italic tracking-normal"
            />
          ) : (
            <span
              className={`${aboveTheBeyond.className} normal-case tracking-normal`}
              style={{ color: GOLD, fontSize: "1.2em" }}
            >
              Coming soon
            </span>
          )}
        </p>
        {showRole && displayRole && (
          <p
            className={`${theSeasons.className} relative mt-0.5 ${textAlign} max-w-full break-words`}
            style={{ ...roleTitleStyle, color: GOLD }}
            title={displayRole}
          >
            <MixedFontText
              text={displayRole}
              specialClassName="font-goudy-italic tracking-normal"
            />
          </p>
        )}
      </div>
    )
  }

  // Helper component for two-column layout wrapper
  const TwoColumnLayout = ({ 
    children, 
    leftTitle, 
    rightTitle,
    singleTitle,
    centerContent = false 
  }: { 
    children: React.ReactNode
    leftTitle?: string
    rightTitle?: string
    singleTitle?: string
    centerContent?: boolean
  }) => {
    if (singleTitle) {
      return (
        <div className="mb-2 sm:mb-2.5 md:mb-3">
          <SectionTitle>{singleTitle}</SectionTitle>
          <div className={`grid grid-cols-2 gap-x-1.5 sm:gap-x-3 md:gap-x-5 gap-y-1 sm:gap-y-1.5 ${centerContent ? 'max-w-3xl mx-auto' : ''}`}>
            {children}
          </div>
        </div>
      )
    }

    return (
      <div className="mb-2 sm:mb-2.5 md:mb-3">
        <div className="grid grid-cols-2 gap-x-1.5 sm:gap-x-3 md:gap-x-5 mb-2 sm:mb-2.5 md:mb-3">
          {leftTitle && (
            <SectionTitle align="right" className="pr-0.5 sm:pr-1">{leftTitle}</SectionTitle>
          )}
          {rightTitle && (
            <SectionTitle align="left" className="pl-0.5 sm:pl-1">{rightTitle}</SectionTitle>
          )}
        </div>
        <div className={`grid grid-cols-2 gap-x-1.5 sm:gap-x-3 md:gap-x-5 gap-y-1 sm:gap-y-1.5 ${centerContent ? 'max-w-3xl mx-auto' : ''}`}>
          {children}
        </div>
      </div>
    )
  }

  return (
    <div
      ref={sectionRef}
      className={`${theSeasons.variable} ${aboveTheBeyond.variable} relative isolate w-full overflow-hidden`}
    >
      <div
        className="pointer-events-none absolute inset-0 z-0"
        aria-hidden
        style={{ background: entourageSectionBackground }}
      />
      <EntourageDamaskPattern />
      <section
        id="entourage"
        className="relative z-10 w-full overflow-hidden py-8 sm:py-10 md:py-12 lg:py-14"
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.05]"
          aria-hidden
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 30%, #fff8dc 0.5px, transparent 0.5px), radial-gradient(circle at 70% 60%, #fffaf4 0.5px, transparent 0.5px)",
            backgroundSize: "120px 120px, 180px 180px",
          }}
        />
        <div className="relative z-20 mx-auto w-full max-w-7xl px-3 sm:px-4 md:px-6 lg:px-8">
      {/* Section Header */}
      <div className={`relative mx-auto mb-8 max-w-5xl text-center @container/entourage sm:mb-10 md:mb-12 transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-10"}`}>
        <div className="mx-auto mb-4 sm:mb-5 md:mb-6">
          <OutsideDivider />
        </div>
        <p
          className={`${cinzel.className} mx-auto max-w-[20rem] px-2 text-[0.6875rem] font-semibold leading-snug tracking-[0.12em] min-[400px]:max-w-none min-[400px]:text-[0.75rem] min-[400px]:tracking-[0.16em] sm:text-[0.9375rem] sm:tracking-[0.2em] md:text-base md:tracking-[0.22em]`}
          style={{ color: CHAMPAGNE }}
        >
          Our People
        </p>
        <div className="mx-auto mt-3 sm:mt-4 md:mt-5">
          <EntourageTitle />
        </div>

        <p
          className={`font-goudy-italic mx-auto mt-4 max-w-xl px-2 sm:mt-5 md:mt-6 ${sectionType.textRelaxed}`}
          style={{ color: BODY_ON_DARK }}
        >
          Honoring those who stand with us on our special day
        </p>

        <div className="mt-4 flex items-center justify-center sm:mt-5">
          <span
            className="h-px w-16 sm:w-24 md:w-32"
            style={goldDividerStyle}
          />
        </div>
      </div>

      {/* Arch container */}
      <div
        className={`relative mx-auto max-w-3xl pb-2 sm:max-w-4xl @container/entourage-card transition-all duration-1000 delay-300 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <div className="relative isolate">
          <div
            className="pointer-events-none absolute -inset-x-4 -top-6 bottom-1/2 z-0 rounded-full opacity-80 blur-2xl sm:-inset-x-8"
            aria-hidden
            style={{
              background: `radial-gradient(ellipse 80% 70% at 50% 100%, color-mix(in srgb, ${GOLD_BRIGHT} 22%, transparent), transparent 70%)`,
            }}
          />
          <div
            className="relative z-10 w-full overflow-hidden rounded-t-[min(28rem,50vw)] sm:rounded-t-[min(32rem,45vw)]"
            style={cardStyle}
          >
            <div
              className="pointer-events-none absolute inset-3 z-20 rounded-t-[inherit] sm:inset-4 md:inset-5"
              style={{ border: `1px solid ${GOLD_BORDER_SOFT}` }}
              aria-hidden
            />

            <div className="relative z-10 px-4 pb-10 pt-8 sm:px-8 sm:pb-12 sm:pt-10 md:px-12 md:pb-14 md:pt-11 lg:px-14">
            {isLoading ? (
              <div className="flex items-center justify-center py-24 sm:py-28 md:py-32">
                <div className="text-center">
                  <p className={`font-goudy-italic ${ct.body}`} style={{ color: palette.body }}>
                    {isRetrying
                      ? "Still gathering the wedding party. Trying again..."
                      : "Loading entourage..."}
                  </p>
                </div>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center py-24 sm:py-28 md:py-32">
                <div className="text-center">
                  <p className={`font-goudy-italic ${ct.bodyLg} mb-3`} style={{ color: palette.body }}>
                    {error}
                  </p>
                  <button
                    onClick={() => void loadPartyUntilReady()}
                    className={`${cinzel.className} ${ct.body} underline transition-colors duration-200 hover:opacity-80`}
                    style={{ color: palette.accent }}
                  >
                    Try again
                  </button>
                </div>
              </div>
            ) : (
            <>
              <CouplePromiseMark />
              <div className="mb-2 sm:mb-2.5 md:mb-3">
                <SectionTitle>The Couple</SectionTitle>
                <div className="grid grid-cols-2 gap-x-1.5 sm:gap-x-3 md:gap-x-5 gap-y-1 sm:gap-y-1.5">
                  <div className="px-0.5 sm:px-1 md:px-1.5 min-w-0">
                    <NameItem
                      member={{
                        name: groomName,
                        roleCategory: "The Couple",
                        roleTitle: "Groom",
                        email: "",
                      }}
                      align="right"
                      featured
                    />
                  </div>
                  <div className="px-0.5 sm:px-1 md:px-1.5 min-w-0">
                    <NameItem
                      member={{
                        name: brideName,
                        roleCategory: "The Couple",
                        roleTitle: "Bride",
                        email: "",
                      }}
                      align="left"
                      featured
                    />
                  </div>
                </div>
              </div>
              {entourage.length === 0 && sponsors.length === 0 && (
                <p
                  className={`${aboveTheBeyond.className} mt-8 text-center sm:mt-10`}
                  style={{ color: GOLD, fontSize: "clamp(1.6rem, 4vw, 2.25rem)" }}
                >
                  Coming soon
                </p>
              )}
              {ROLE_CATEGORY_ORDER.map((category, categoryIndex) => {
                const members = grouped[category] || []
                const bridalPartyHasMembers =
                  (grouped["Groomsmen"]?.length ?? 0) > 0 ||
                  (grouped["Bridesmaids"]?.length ?? 0) > 0

                if (category === "The Couple") return null
                
                if (
                  members.length === 0 &&
                  !(category === "Groomsmen" && bridalPartyHasMembers)
                ) {
                  return null
                }
                if (category === "Peer Sponsors") return null

                // Render OFFICIATING MINISTER directly above Principal Sponsors (in Parents block)
                if (category === "OFFICIATING MINISTER" && hasParents) return null

                // Special handling for Parents sections - combine into single two-column layout
                if (category === "Parents of the Bride" || category === "Parents of the Groom") {
                  // Get both parent groups
                  const parentsBride = grouped["Parents of the Bride"] || []
                  const parentsGroom = grouped["Parents of the Groom"] || []

                  // Only render once (when processing "Parents of the Groom")
                  if (category === "Parents of the Groom") {
                    return (
                      <div key="Parents">
                        {categoryIndex > 0 && (
                          <div className="flex justify-center py-2 sm:py-2.5 md:py-3 mb-2 sm:mb-2.5 md:mb-3">
                            <div className="w-full max-w-md h-px" style={dividerLineStyle} />
                          </div>
                        )}
                        <TwoColumnLayout leftTitle="Parents of the Groom" rightTitle="Parents of the Bride">
                          {(() => {
                            const leftArr = sortGroomParents(parentsGroom)
                            const rightArr = sortBrideParents(parentsBride)
                            const maxLen = Math.max(leftArr.length, rightArr.length)
                            const rows = []
                            for (let i = 0; i < maxLen; i++) {
                              const left = leftArr[i]
                              const right = rightArr[i]
                              rows.push(
                                <React.Fragment key={`parents-row-${i}`}>
                                  <div key={`parent-groom-${i}`} className="px-0.5 sm:px-1 md:px-1.5 min-w-0 overflow-hidden">
                                    {left ? <NameItem member={left} align="right" showRole={false} /> : <div className="py-0.5" />}
                                  </div>
                                  <div key={`parent-bride-${i}`} className="px-0.5 sm:px-1 md:px-1.5 min-w-0 overflow-hidden">
                                    {right ? <NameItem member={right} align="left" showRole={false} /> : <div className="py-0.5" />}
                                  </div>
                                </React.Fragment>
                              )
                            }
                            return rows
                          })()}
                        </TwoColumnLayout>
                        
                        {/* Officiating Minister section - displayed above Principal Sponsors */}
                        {(() => {
                          const officiating = grouped["OFFICIATING MINISTER"] || []
                          if (officiating.length === 0) return null
                          return (
                            <div key="OfficiatingMinisterBeforeSponsors" className="mt-4 sm:mt-5 md:mt-6">
                              <TwoColumnLayout singleTitle="OFFICIATING MINISTER" centerContent={true}>
                                {officiating.map((member, idx) => (
                                  <div
                                    key={`officiating-${idx}-${member.name}`}
                                    className="col-span-2 flex justify-center min-w-0 overflow-hidden px-0.5 sm:px-1"
                                  >
                                    <NameItem member={member} align="center" showRole={false} />
                                  </div>
                                ))}
                              </TwoColumnLayout>
                            </div>
                          )
                        })()}

                        {/* Principal Sponsors section - displayed after Parents */}
                        {sponsors.length > 0 && (
                          <div key="SponsorsAfterParents">
                            <div className="flex justify-center py-1.5 sm:py-2 md:py-2.5 mb-2 sm:mb-2.5 md:mb-3">
                            </div>
                            <TwoColumnLayout singleTitle="Principal Sponsors" centerContent={true}>
                              {sponsors.map((sponsor, idx) => (
                                <React.Fragment key={`sponsor-row-${idx}`}>
                                  <div key={`sponsor-male-${idx}`} className="px-0.5 sm:px-1 md:px-1.5 min-w-0 overflow-hidden">
                                    <NameItem
                                      member={{
                                        name: sponsor.malePrincipalSponsor,
                                        roleCategory: "",
                                        roleTitle: "",
                                        email: "",
                                      }}
                                      align="right"
                                      showRole={false}
                                    />
                                  </div>
                                  <div key={`sponsor-female-${idx}`} className="px-0.5 sm:px-1 md:px-1.5 min-w-0 overflow-hidden">
                                    <NameItem
                                      member={{
                                        name: sponsor.femalePrincipalSponsor,
                                        roleCategory: "",
                                        roleTitle: "",
                                        email: "",
                                      }}
                                      align="left"
                                      showRole={false}
                                    />
                                  </div>
                                </React.Fragment>
                              ))}
                            </TwoColumnLayout>
                          </div>
                        )}

                        {/* Peer Sponsors section - displayed after Principal Sponsors */}
                        {(() => {
                          const peerSponsors = grouped["Peer Sponsors"] || []
                          if (peerSponsors.length === 0) return null
                          return (
                            <div key="PeerSponsorsAfterPrincipal">
                              <div className="flex justify-center py-1.5 sm:py-2 md:py-2.5 mb-2 sm:mb-2.5 md:mb-3" />
                              <TwoColumnLayout singleTitle="Peer Sponsors" centerContent={true}>
                                {peerSponsors.length === 2 ? (
                                  <>
                                    <div className="px-0.5 sm:px-1 md:px-1.5 min-w-0 overflow-hidden">
                                      <NameItem member={peerSponsors[0]} align="right" showRole={false} />
                                    </div>
                                    <div className="px-0.5 sm:px-1 md:px-1.5 min-w-0 overflow-hidden">
                                      <NameItem member={peerSponsors[1]} align="left" showRole={false} />
                                    </div>
                                  </>
                                ) : peerSponsors.length <= 2 ? (
                                  <div className="col-span-full">
                                    <div className="max-w-sm mx-auto flex flex-col items-center gap-0.5 sm:gap-1 md:gap-1">
                                      {peerSponsors.map((member, idx) => (
                                        <NameItem
                                          key={`peer-sponsor-${idx}-${member.name}`}
                                          member={member}
                                          align="center"
                                          showRole={false}
                                        />
                                      ))}
                                    </div>
                                  </div>
                                ) : (
                                  (() => {
                                    const half = Math.ceil(peerSponsors.length / 2)
                                    const left = peerSponsors.slice(0, half)
                                    const right = peerSponsors.slice(half)
                                    const maxLen = Math.max(left.length, right.length)
                                    const rows = []
                                    for (let i = 0; i < maxLen; i++) {
                                      const l = left[i]
                                      const r = right[i]
                                      rows.push(
                                        <React.Fragment key={`peer-sponsor-row-${i}`}>
                                          <div className="px-0.5 sm:px-1 md:px-1.5 min-w-0 overflow-hidden">
                                            {l ? (
                                              <NameItem member={l} align="right" showRole={false} />
                                            ) : (
                                              <div className="py-0.5 sm:py-1 md:py-1.5" />
                                            )}
                                          </div>
                                          <div className="px-0.5 sm:px-1 md:px-1.5 min-w-0 overflow-hidden">
                                            {r ? (
                                              <NameItem member={r} align="left" showRole={false} />
                                            ) : (
                                              <div className="py-0.5 sm:py-1 md:py-1.5" />
                                            )}
                                          </div>
                                        </React.Fragment>
                                      )
                                    }
                                    return rows
                                  })()
                                )}
                              </TwoColumnLayout>
                            </div>
                          )
                        })()}
                      </div>
                    )
                  }
                  // Skip rendering for "Parents of the Bride" since it's already rendered above
                  return null
                }

                // Special handling for Family of the Groom/Bride - combine into single two-column layout
                if (category === "Family of the Groom" || category === "Family of the Bride") {
                  const familyGroom = grouped["Family of the Groom"] || []
                  const familyBride = grouped["Family of the Bride"] || []

                  if (category === "Family of the Groom") {
                    return (
                      <div key="Family">
                        {categoryIndex > 0 && (
                          <div className="flex justify-center py-2 sm:py-2.5 md:py-3 mb-2 sm:mb-2.5 md:mb-3">
                            <div className="w-full max-w-md h-px" style={dividerLineStyle} />
                          </div>
                        )}
                        <TwoColumnLayout leftTitle="Family of the Groom" rightTitle="Family of the Bride">
                          {(() => {
                            const maxLen = Math.max(familyGroom.length, familyBride.length)
                            const rows = []
                            for (let i = 0; i < maxLen; i++) {
                              const left = familyGroom[i]
                              const right = familyBride[i]
                              rows.push(
                                <React.Fragment key={`family-row-${i}`}>
                                  <div key={`family-groom-${i}`} className="px-0.5 sm:px-1 md:px-1.5 min-w-0 overflow-hidden">
                                    {left ? <NameItem member={left} align="right" /> : <div className="py-0.5" />}
                                  </div>
                                  <div key={`family-bride-${i}`} className="px-0.5 sm:px-1 md:px-1.5 min-w-0 overflow-hidden">
                                    {right ? <NameItem member={right} align="left" /> : <div className="py-0.5" />}
                                  </div>
                                </React.Fragment>
                              )
                            }
                            return rows
                          })()}
                        </TwoColumnLayout>
                      </div>
                    )
                  }

                  return null
                }

                // Man of Honor, Maid/Matron of Honor, and Best Man — Man of Honor above Best Men
                if (
                  category === "Man of Honor" ||
                  category === "Matron of Honor" ||
                  category === "Maid of Honor" ||
                  category === "Best Man"
                ) {
                  const manOfHonor = grouped["Man of Honor"] || []
                  const matronOfHonor = grouped["Matron of Honor"] || []
                  const maidOfHonor = grouped["Maid of Honor"] || []
                  const bestMan = grouped["Best Man"] || []

                  const firstHonorCategory = HONOR_ATTENDANT_BLOCK_CATEGORIES.find(
                    (honorCategory) => (grouped[honorCategory]?.length ?? 0) > 0
                  )
                  if (category !== firstHonorCategory) return null

                  const hasSideHonors = bestMan.length > 0 || maidOfHonor.length > 0
                  const hasMatron = matronOfHonor.length > 0

                  return (
                    <div key="HonorAttendants">
                      {categoryIndex > 0 && (
                        <div className="flex justify-center py-2 sm:py-2.5 md:py-3 mb-2 sm:mb-2.5 md:mb-3">
                          <div className="w-full max-w-md h-px" style={dividerLineStyle} />
                        </div>
                      )}

                      {manOfHonor.length > 0 && (
                        <TwoColumnLayout singleTitle="Man of Honor" centerContent={true}>
                          {manOfHonor.map((member, idx) => (
                            <div
                              key={`man-of-honor-${idx}-${member.name}`}
                              className="col-span-2 flex justify-center min-w-0 overflow-hidden px-0.5 sm:px-1"
                            >
                              <NameItem member={member} align="center" />
                            </div>
                          ))}
                        </TwoColumnLayout>
                      )}

                      {manOfHonor.length > 0 && (hasSideHonors || hasMatron) && (
                        <div className="flex justify-center py-1.5 sm:py-2 md:py-2.5 mb-2 sm:mb-2.5 md:mb-3">
                          <div className="w-full max-w-md h-px" style={dividerLineStyle} />
                        </div>
                      )}

                      {hasSideHonors && (
                        <TwoColumnLayout leftTitle="Best Man" rightTitle="Maid of Honor">
                          {(() => {
                            const maxLen = Math.max(bestMan.length, maidOfHonor.length)
                            const rows = []
                            for (let i = 0; i < maxLen; i++) {
                              const left = bestMan[i]
                              const right = maidOfHonor[i]
                              rows.push(
                                <React.Fragment key={`honor-row-${i}`}>
                                  <div
                                    key={`bestman-cell-${i}`}
                                    className="px-0.5 sm:px-1 md:px-1.5 min-w-0 overflow-hidden"
                                  >
                                    {left ? (
                                      <NameItem member={left} align="right" />
                                    ) : (
                                      <div className="py-0.5" />
                                    )}
                                  </div>
                                  <div
                                    key={`maid-cell-${i}`}
                                    className="px-0.5 sm:px-1 md:px-1.5 min-w-0 overflow-hidden"
                                  >
                                    {right ? (
                                      <NameItem member={right} align="left" />
                                    ) : (
                                      <div className="py-0.5" />
                                    )}
                                  </div>
                                </React.Fragment>
                              )
                            }
                            return rows
                          })()}
                        </TwoColumnLayout>
                      )}

                      {hasSideHonors && hasMatron && (
                        <div className="flex justify-center py-1.5 sm:py-2 md:py-2.5 mb-2 sm:mb-2.5 md:mb-3">
                          <div className="w-full max-w-md h-px" style={dividerLineStyle} />
                        </div>
                      )}

                      {hasMatron && (
                        <TwoColumnLayout singleTitle="Matron of Honor" centerContent={true}>
                          {matronOfHonor.map((member, idx) => (
                            <div
                              key={`matron-of-honor-${idx}-${member.name}`}
                              className="col-span-2 flex justify-center min-w-0 overflow-hidden px-0.5 sm:px-1"
                            >
                              <NameItem member={member} align="center" showRole={false} />
                            </div>
                          ))}
                        </TwoColumnLayout>
                      )}
                    </div>
                  )
                }

                // Special handling for Little Groom and Little Bride - combine into single two-column layout
                if (category === "Little Groom" || category === "Little Bride") {
                  // Get both little ones groups
                  const littleGroom = grouped["Little Groom"] || []
                  const littleBride = grouped["Little Bride"] || []
                  
                  // Only render once (when processing "Little Groom")
                  if (category === "Little Groom") {
                    return (
                      <div key="LittleOnes">
                        {categoryIndex > 0 && (
                          <div className="flex justify-center py-2 sm:py-2.5 md:py-3 mb-2 sm:mb-2.5 md:mb-3">
                            <div className="w-full max-w-md h-px" style={dividerLineStyle} />
                          </div>
                        )}
                        <TwoColumnLayout leftTitle="Little Groom" rightTitle="Little Bride">
                          {(() => {
                            const maxLen = Math.max(littleGroom.length, littleBride.length)
                            const rows = []
                            for (let i = 0; i < maxLen; i++) {
                              const left = littleGroom[i]
                              const right = littleBride[i]
                              rows.push(
                                <React.Fragment key={`little-row-${i}`}>
                                  <div key={`littlegroom-cell-${i}`} className="px-0.5 sm:px-1 md:px-1.5 min-w-0 overflow-hidden">
                                    {left ? <NameItem member={left} align="right" /> : <div className="py-0.5" />}
                                  </div>
                                  <div key={`littlebride-cell-${i}`} className="px-0.5 sm:px-1 md:px-1.5 min-w-0 overflow-hidden">
                                    {right ? <NameItem member={right} align="left" /> : <div className="py-0.5" />}
                                  </div>
                                </React.Fragment>
                              )
                            }
                            return rows
                          })()}
                        </TwoColumnLayout>
                      </div>
                    )
                  }
                  // Skip rendering for "Little Bride" since it's already rendered above
                  return null
                }

                // Flower Ladies — always a single centered column
                if (category === "Flower Ladies") {
                  if (members.length === 0) return null

                  return (
                    <div key="FlowerLadies">
                      {categoryIndex > 0 && (
                        <div className="flex justify-center py-2 sm:py-2.5 md:py-3 mb-2 sm:mb-2.5 md:mb-3">
                          <div className="w-full max-w-md h-px" style={dividerLineStyle} />
                        </div>
                      )}
                      <div className="mb-2 sm:mb-2.5 md:mb-3">
                        <SectionTitle>Flower Girls</SectionTitle>
                        <div className="max-w-sm mx-auto flex flex-col items-center gap-1 sm:gap-1.5 md:gap-2">
                          {members.map((member, idx) => (
                            <NameItem
                              key={`flower-lady-${idx}-${member.name}`}
                              member={member}
                              align="center"
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  )
                }

                // Special handling for Bridesmaids and Groomsmen - combine into single two-column layout
                if (category === "Bridesmaids" || category === "Groomsmen") {
                  // Get both bridal party groups
                  const bridesmaids = grouped["Bridesmaids"] || []
                  const groomsmen = grouped["Groomsmen"] || []
                  
                  // Only render once (when processing "Groomsmen")
                  if (category === "Groomsmen") {
                    return (
                      <React.Fragment key="BridalPartySection">
                        {/* Groomsmen/Bridesmaids section */}
                        <div key="BridalParty">
                          {categoryIndex > 0 && (
                            <div className="flex justify-center py-2 sm:py-2.5 md:py-3 mb-2 sm:mb-2.5 md:mb-3">
                              <div className="w-full max-w-md h-px" style={dividerLineStyle} />
                            </div>
                          )}
                          <TwoColumnLayout singleTitle="Beloved Entourage">
                            {(() => {
                              const maxLen = Math.max(bridesmaids.length, groomsmen.length)
                              const rows = []
                              for (let i = 0; i < maxLen; i++) {
                                const groomsman = groomsmen[i]
                                const bridesmaid = bridesmaids[i]
                                rows.push(
                                  <React.Fragment key={`bridal-row-${i}`}>
                                    <div key={`groomsman-cell-${i}`} className="px-0.5 sm:px-1 md:px-1.5 min-w-0 overflow-hidden">
                                      {groomsman ? <NameItem member={groomsman} align="right" /> : <div className="py-0.5 sm:py-1 md:py-1.5" />}
                                    </div>
                                    <div key={`bridesmaid-cell-${i}`} className="px-0.5 sm:px-1 md:px-1.5 min-w-0 overflow-hidden">
                                      {bridesmaid ? <NameItem member={bridesmaid} align="left" /> : <div className="py-0.5 sm:py-1 md:py-1.5" />}
                                    </div>
                                  </React.Fragment>
                                )
                              }
                              return rows
                            })()}
                          </TwoColumnLayout>
                        </div>
                      </React.Fragment>
                    )
                  }
                  // Skip rendering for "Bridesmaids" since it's already rendered above
                  return null
                }

                // Secondary Sponsors block: render all three groups under one heading
                if (category === "Candle Sponsors" || category === "Veil Sponsors" || category === "Cord Sponsors" || category === "Ribbon Sponsors") {
                  // Only render the full block once — when processing the first one that exists in order
                  const secondarySponsorGroups = ["Candle Sponsors", "Veil Sponsors", "Cord Sponsors", "Ribbon Sponsors"] as const
                  const firstPresentGroup = secondarySponsorGroups.find((g) => (grouped[g]?.length ?? 0) > 0)
                  if (category !== firstPresentGroup) return null

                  const renderPairedGroup = (groupName: string) => {
                    const grpMembers = grouped[groupName] || []
                    if (grpMembers.length === 0) return null
                    return (
                      <div key={groupName} className="mb-2 sm:mb-2.5 md:mb-3">
                        <TwoColumnLayout singleTitle={displayRoleCategory(groupName)} centerContent={true}>
                          {grpMembers.length === 2 ? (
                            <>
                              <div className="px-0.5 sm:px-1 md:px-1.5 min-w-0 overflow-hidden">
                                <NameItem member={grpMembers[0]} align="right" />
                              </div>
                              <div className="px-0.5 sm:px-1 md:px-1.5 min-w-0 overflow-hidden">
                                <NameItem member={grpMembers[1]} align="left" />
                              </div>
                            </>
                          ) : (
                            <div className="col-span-full">
                              <div className="max-w-sm mx-auto flex flex-col items-center gap-0.5 sm:gap-1 md:gap-1">
                                {grpMembers.map((member, idx) => (
                                  <NameItem key={`${groupName}-${idx}-${member.name}`} member={member} align="center" />
                                ))}
                              </div>
                            </div>
                          )}
                        </TwoColumnLayout>
                      </div>
                    )
                  }

                  return (
                    <div key="SecondarySponsorBlock">
                      {categoryIndex > 0 && (
                        <div className="flex justify-center py-2 sm:py-2.5 md:py-3 mb-2 sm:mb-2.5 md:mb-3">
                          <div className="w-full max-w-md h-px" style={dividerLineStyle} />
                        </div>
                      )}
                      {/* Parent heading */}
                      <div className="mb-2 sm:mb-2.5 md:mb-3">
                        <SectionTitle>Secondary Sponsors</SectionTitle>
                      </div>
                      {secondarySponsorGroups.map(renderPairedGroup)}
                    </div>
                  )
                }

                // Default: single title, centered content
                return (
                  <div key={category}>
                    {categoryIndex > 0 && (
                      <div className="flex justify-center py-2 sm:py-2.5 md:py-3 mb-2 sm:mb-2.5 md:mb-3">
                            <div className="w-full max-w-md h-px" style={dividerLineStyle} />
                      </div>
                    )}
                    <TwoColumnLayout singleTitle={displayRoleCategory(category)} centerContent={true}>
                      {(() => {
                        // Special rule: paired sponsor roles with exactly 2 names should meet at center
                        const PAIRED_SECTIONS = new Set(["Candle Sponsors", "Cord Sponsors", "Veil Sponsors"])
                        if (PAIRED_SECTIONS.has(category) && members.length === 2) {
                          const left = members[0]
                          const right = members[1]
                          return (
                            <>
                              <div className="px-0.5 sm:px-1 md:px-1.5 min-w-0 overflow-hidden">
                                <NameItem member={left} align="right" />
                              </div>
                              <div className="px-0.5 sm:px-1 md:px-1.5 min-w-0 overflow-hidden">
                                <NameItem member={right} align="left" />
                              </div>
                            </>
                          )
                        }
                        if (SINGLE_COLUMN_SECTIONS.has(category) || members.length <= 2) {
                          return (
                            <div className="col-span-full">
                              <div className="max-w-sm mx-auto flex flex-col items-center gap-1 sm:gap-1.5 md:gap-2">
                                {members.map((member, idx) => (
                                  <NameItem key={`${category}-${idx}-${member.name}`} member={member} align="center" />
                                ))}
                              </div>
                            </div>
                          )
                        }
                        // Default two-column sections: render row-by-row pairs to keep alignment on small screens
                        const half = Math.ceil(members.length / 2)
                        const left = members.slice(0, half)
                        const right = members.slice(half)
                        const maxLen = Math.max(left.length, right.length)
                        const rows = []
                        for (let i = 0; i < maxLen; i++) {
                          const l = left[i]
                          const r = right[i]
                          rows.push(
                            <React.Fragment key={`${category}-row-${i}`}>
                              <div key={`${category}-cell-left-${i}`} className="px-0.5 sm:px-1 md:px-1.5 min-w-0 overflow-hidden">
                                {l ? <NameItem member={l} align="right" /> : <div className="py-0.5 sm:py-1 md:py-1.5" />}
                              </div>
                              <div key={`${category}-cell-right-${i}`} className="px-0.5 sm:px-1 md:px-1.5 min-w-0 overflow-hidden">
                                {r ? <NameItem member={r} align="left" /> : <div className="py-0.5 sm:py-1 md:py-1.5" />}
                              </div>
                            </React.Fragment>
                          )
                        }
                        return rows
                      })()}
                    </TwoColumnLayout>
                  </div>
                )
              })}
              
              {/* Display any other categories not in the ordered list */}
              {Object.keys(grouped).filter(cat => !ROLE_CATEGORY_ORDER.includes(cat) && cat !== "Other" && cat !== "Peer Sponsors").map((category) => {
                const members = grouped[category]
                return (
                  <div key={category}>
                    <div className="flex justify-center py-2 sm:py-2.5 md:py-3 mb-2 sm:mb-2.5 md:mb-3">
                      <div className="w-full max-w-md h-px" style={dividerLineStyle} />
                    </div>
                    <TwoColumnLayout singleTitle={displayRoleCategory(category)} centerContent={true}>
                      {(() => {
                        if (SINGLE_COLUMN_SECTIONS.has(category) || members.length <= 2) {
                          return (
                            <div className="col-span-full">
                              <div className="max-w-sm mx-auto flex flex-col items-center gap-1 sm:gap-1.5 md:gap-2">
                                {members.map((member, idx) => (
                                  <NameItem key={`${category}-${idx}-${member.name}`} member={member} align="center" />
                                ))}
                              </div>
                            </div>
                          )
                        }
                        // Pair row-by-row for other categories as well
                        const half = Math.ceil(members.length / 2)
                        const left = members.slice(0, half)
                        const right = members.slice(half)
                        const maxLen = Math.max(left.length, right.length)
                        const rows = []
                        for (let i = 0; i < maxLen; i++) {
                          const l = left[i]
                          const r = right[i]
                          rows.push(
                            <React.Fragment key={`${category}-row-${i}`}>
                              <div key={`${category}-cell-left-${i}`} className="px-0.5 sm:px-1 md:px-1.5 min-w-0 overflow-hidden">
                                {l ? <NameItem member={l} align="right" /> : <div className="py-0.5 sm:py-1 md:py-1.5" />}
                              </div>
                              <div key={`${category}-cell-right-${i}`} className="px-0.5 sm:px-1 md:px-1.5 min-w-0 overflow-hidden">
                                {r ? <NameItem member={r} align="left" /> : <div className="py-0.5 sm:py-1 md:py-1.5" />}
                              </div>
                            </React.Fragment>
                          )
                        }
                        return rows
                      })()}
                    </TwoColumnLayout>
                  </div>
                )
              })}
            </>
            )}
          </div>
        </div>
        </div>
      </div>
        </div>
      </section>
    </div>
  )
}