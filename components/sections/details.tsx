"use client"

import { Section } from "@/components/section"
import { useState, useEffect, type ReactNode } from "react"
import { QRCodeSVG } from "qrcode.react"
import { useSiteConfig } from "@/hooks/use-site-config"
import { sectionType } from "@/lib/section-typography"
import { sectionBackground } from "@/lib/section-background"
import Image from "next/image"
import localFont from "next/font/local"
import { Cinzel } from "next/font/google"
import {
  Shirt,
  Clock,
  Utensils,
  Copy,
  Check,
  Navigation,
  Heart,
  Camera,
  X,
  MapPin,
} from "lucide-react"

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

const CORNER_DECO_CLASS =
  "block h-auto w-auto max-w-[120px] sm:max-w-[180px] md:max-w-[260px] lg:max-w-[320px] xl:max-w-[380px]"

const IVORY = "#fffaf4"
const GOLD = "var(--color-welcome-gold)"
const NAVY = "var(--color-welcome-navy)"
const SCRIPT = "var(--color-welcome-green)"
const BODY = "var(--color-welcome-text)"
const NAV_GOLD =
  "linear-gradient(180deg, #E8D5A3 0%, #CDB072 52%, #C4A265 100%)"

const detailText = {
  body: BODY,
  heading: NAVY,
  label: GOLD,
  accent: GOLD,
} as const

const GOLD_BORDER = "color-mix(in srgb, var(--color-welcome-gold) 38%, transparent)"
const GOLD_BORDER_SOFT = "color-mix(in srgb, var(--color-welcome-gold) 22%, transparent)"

const goldDividerStyle = {
  background: "linear-gradient(to right, transparent, var(--color-welcome-gold), transparent)",
} as const

const goldDividerStyleLeft = {
  background: "linear-gradient(to left, transparent, var(--color-welcome-gold), transparent)",
} as const

const cardStyle = {
  background: IVORY,
  borderColor: GOLD_BORDER,
  borderWidth: "1px",
  borderStyle: "solid",
  boxShadow:
    "0 10px 28px color-mix(in srgb, var(--color-welcome-gold) 12%, transparent), inset 0 1px 0 rgb(255 250 244 / 70%)",
} as const

const softPanelStyle = {
  borderColor: GOLD_BORDER_SOFT,
  backgroundColor: `color-mix(in srgb, ${IVORY} 82%, #E8D5A3)`,
} as const

const QR_FG = "#5E5144"
const QR_BG = IVORY

function SectionIconDivider({ icon }: { icon: React.ReactNode }) {
  return (
    <div className="flex items-center justify-center gap-1.5 pt-1 sm:pt-2">
      <span className="h-px w-6 sm:w-10" style={goldDividerStyle} />
      {icon}
      <span className="h-px w-6 sm:w-10" style={goldDividerStyleLeft} />
    </div>
  )
}

function OutsideDivider() {
  return (
    <div className="flex items-center justify-center gap-1.5">
      <span className="h-px w-6 sm:w-10" style={goldDividerStyle} />
      <span className="h-0.5 w-0.5 rounded-full sm:h-1 sm:w-1" style={{ background: GOLD }} aria-hidden />
      <span className="h-px w-6 sm:w-10" style={goldDividerStyleLeft} />
    </div>
  )
}

const detailsTitleSize = {
  main: "clamp(2.35rem, 11.5vw, 4.5rem)",
  script: "clamp(1.45rem, 7vw, 2.7rem)",
  overlap: "clamp(-0.9rem, -3.6vw, -1.75rem)",
} as const

function DetailsTitle() {
  return (
    <h2
      className="welcome-title-lockup relative mx-auto w-full max-w-full text-center"
      style={
        {
          "--title-size": detailsTitleSize.main,
          "--script-size": detailsTitleSize.script,
          "--script-overlap": detailsTitleSize.overlap,
        } as React.CSSProperties
      }
    >
      <span className="sr-only">Event Details — our special day</span>
      <span
        aria-hidden
        className={`${theSeasons.className} block uppercase leading-[0.76] tracking-[0.04em] min-[400px]:tracking-[0.08em] sm:tracking-[0.12em] md:tracking-[0.14em]`}
        style={{
          fontSize: "var(--title-size)",
          color: NAVY,
        }}
      >
        Event Details
      </span>
      <span
        aria-hidden
        className={`${aboveTheBeyond.className} relative z-10 mx-auto mt-[var(--script-overlap)] block w-fit max-w-full px-1 leading-[0.88] sm:leading-[0.9]`}
        style={{
          fontSize: "var(--script-size)",
          color: SCRIPT,
          textShadow:
            "0 1px 0 color-mix(in srgb, var(--color-welcome-bg) 95%, white), 0 0 10px color-mix(in srgb, var(--color-welcome-bg) 65%, white)",
        }}
      >
        our special day
      </span>
    </h2>
  )
}

// Slightly compact type inside card containers (not the page header)
const ct = {
  label: "text-[11px] sm:text-xs md:text-sm",
  labelSm: "text-[10px] sm:text-[11px] md:text-xs",
  body: "text-xs sm:text-sm md:text-base",
  bodyMd: "text-xs sm:text-sm md:text-base lg:text-lg",
  bodyLg: "text-sm sm:text-base md:text-lg",
  subhead: "text-xs sm:text-sm md:text-base lg:text-lg",
  time: "text-xs sm:text-sm md:text-base lg:text-xl",
  cardTitle: "text-sm sm:text-lg md:text-xl lg:text-2xl",
  overlayTitle: "text-sm sm:text-lg md:text-xl lg:text-2xl",
  overlaySub: "text-xs sm:text-sm md:text-base",
  month: "text-base sm:text-xl md:text-2xl lg:text-3xl",
  dayNum: "text-2xl sm:text-4xl md:text-5xl lg:text-6xl",
  year: "text-base sm:text-xl md:text-2xl lg:text-3xl",
  sectionTitle: "text-sm sm:text-lg md:text-xl lg:text-2xl",
  attireCardTitle: "text-sm sm:text-lg md:text-xl lg:text-2xl",
  btn: "text-xs sm:text-sm md:text-base",
  noteTitle: "text-xl sm:text-2xl md:text-3xl",
  reminderHead: "text-base sm:text-lg md:text-xl",
  reminderBody: "text-xs sm:text-sm md:text-base lg:text-lg",
} as const

const MOTIF_COLORS = ["#FFCA8B", "#FFB383", "#F6CEC8", "#E99997", "#C8C29E"] as const
const SAGE_COLORS = ["#304A3C", "#6E856A", "#889F87", "#B8C8B6", "#D1DDD0"] as const

function ColorPalette({
  colors,
  className = "max-w-xs",
}: {
  colors: readonly string[]
  className?: string
}) {
  return (
    <div
      className={`mx-auto flex h-7 w-full overflow-hidden rounded-full sm:h-8 ${className}`}
      style={{ border: `1px solid ${GOLD_BORDER}` }}
    >
      {colors.map((color, i) => (
        <div key={color + i} className="min-w-0 flex-1" style={{ backgroundColor: color }} />
      ))}
    </div>
  )
}

function CoupleImagesCarousel({
  coupleImages,
  currentImageIndex,
  rotationOffset,
}: {
  coupleImages: string[]
  currentImageIndex: number
  rotationOffset: number
}) {
  return (
    <div className="mb-4 flex justify-center gap-2 sm:mb-5 sm:gap-2.5">
      {coupleImages.map((image, index) => {
        const isActive = index === currentImageIndex
        const baseRotation = index === 0 ? -5 : index === 1 ? 5 : index === 2 ? -3 : 3
        const currentRotation = isActive
          ? baseRotation + Math.sin((rotationOffset * Math.PI) / 180) * 2
          : baseRotation
        const scale = isActive ? "scale(1.1)" : "scale(1)"
        const itemClass = `relative h-14 w-14 overflow-hidden rounded-lg border-2 shadow-md transition-all duration-700 ease-in-out sm:h-16 sm:w-16 ${isActive ? "z-10 scale-110" : "scale-100 opacity-70"}`
        const imgClass = `object-cover transition-opacity duration-500 ${isActive ? "opacity-100" : "opacity-70"}`

        return (
          <div
            key={image}
            className={itemClass}
            style={{
              transform: `rotate(${currentRotation}deg) ${scale}`,
              borderColor: GOLD_BORDER,
            }}
          >
            <Image
              src={image}
              alt={`Wedding couple ${index + 1}`}
              fill
              className={imgClass}
              sizes="(max-width: 640px) 56px, 64px"
            />
          </div>
        )
      })}
    </div>
  )
}

function ReminderCard({
  title,
  children,
  variant = "soft",
}: {
  title: string
  children: ReactNode
  variant?: "soft" | "accent"
}) {
  const panelStyle =
    variant === "accent"
      ? {
          borderColor: GOLD_BORDER,
          backgroundColor: `color-mix(in srgb, ${IVORY} 88%, #E8D5A3)`,
        }
      : softPanelStyle

  return (
    <div
      className="rounded-xl border p-4 shadow-sm sm:rounded-2xl sm:p-5"
      style={panelStyle}
    >
      <h4
        className={`${cinzel.className} ${ct.reminderHead} mb-2 font-semibold uppercase tracking-[0.08em] sm:mb-2.5`}
        style={{ color: detailText.heading }}
      >
        {title}
      </h4>
      <div
        className={`font-goudy-italic ${ct.reminderBody} leading-relaxed`}
        style={{ color: detailText.body }}
      >
        {children}
      </div>
    </div>
  )
}

function MotifLook({
  label,
  src,
  alt,
  colors,
  children,
}: {
  label: string
  src: string
  alt: string
  colors: readonly string[]
  children?: ReactNode
}) {
  return (
    <div className="space-y-3 text-center sm:space-y-3.5">
      <p
        className={`${cinzel.className} ${ct.labelSm} font-semibold uppercase tracking-[0.22em] sm:tracking-[0.28em]`}
        style={{ color: detailText.label }}
      >
        {label}
      </p>
      <Image
        src={src}
        alt={alt}
        width={1400}
        height={800}
        className="mx-auto h-auto w-full object-contain"
        sizes="(max-width: 768px) 100vw, 768px"
      />
      <ColorPalette colors={colors} className="max-w-sm sm:max-w-md" />
      {children ? <div className="space-y-4 pt-1 sm:space-y-5">{children}</div> : null}
    </div>
  )
}

function DressCodePalette() {
  return (
    <div
      className="relative mx-auto mb-8 max-w-3xl overflow-hidden rounded-2xl border shadow-sm sm:mb-10 md:rounded-3xl"
      style={{
        background: IVORY,
        borderColor: GOLD_BORDER,
        boxShadow:
          "0 10px 28px color-mix(in srgb, var(--color-welcome-gold) 12%, transparent), inset 0 1px 0 rgb(255 250 244 / 70%)",
      }}
    >
      <div className="px-5 pb-4 pt-6 text-center sm:px-8 sm:pb-5 sm:pt-8">
        <p
          className={`${cinzel.className} text-[0.55rem] font-semibold uppercase tracking-[0.28em] sm:text-[0.6rem] sm:tracking-[0.36em]`}
          style={{ color: GOLD }}
        >
          Theme / Color Motif
        </p>
        <h3
          className={`${aboveTheBeyond.className} mt-1 block px-1 text-[1.55rem] leading-tight sm:text-[1.95rem]`}
          style={{ color: SCRIPT }}
        >
          Whimsical Spring Minimalist
        </h3>

        <div className="mt-3 flex items-center justify-center gap-2 sm:mt-4">
          <span className="h-px flex-1" style={goldDividerStyle} />
          <Heart
            className="h-2 w-2 sm:h-2.5 sm:w-2.5"
            style={{ color: GOLD, fill: "currentColor" }}
            aria-hidden
          />
          <span className="h-px flex-1" style={goldDividerStyleLeft} />
        </div>
      </div>

      <div className="space-y-10 px-5 pb-8 sm:space-y-12 sm:px-8 sm:pb-10">
        <MotifLook
          label="Entourage"
          src="/Details/entourage.png"
          alt="Entourage attire"
          colors={SAGE_COLORS}
        >
          <div className="space-y-2">
            <p
              className={`${cinzel.className} ${ct.labelSm} font-semibold uppercase tracking-[0.18em]`}
              style={{ color: detailText.label }}
            >
              Women
            </p>
            <p
              className={`font-goudy-italic ${ct.body} leading-relaxed`}
              style={{ color: detailText.body }}
            >
              Flowy / Spring Sage Green Dress — strictly floor length.
            </p>
          </div>
          <div className="space-y-2">
            <p
              className={`${cinzel.className} ${ct.labelSm} font-semibold uppercase tracking-[0.18em]`}
              style={{ color: detailText.label }}
            >
              Gentlemen&apos;s Attire
            </p>
            <p
              className={`font-goudy-italic ${ct.body} leading-relaxed`}
              style={{ color: detailText.body }}
            >
              Strictly no rubber shoes.
            </p>
            <ul
              className={`font-goudy-italic ${ct.body} mx-auto max-w-[16rem] space-y-1 text-left leading-relaxed`}
              style={{ color: detailText.body }}
            >
              <li>Black and white suit</li>
              <li>White and gray suit</li>
              <li>Sage green long sleeves + gray or brown pants</li>
            </ul>
          </div>
        </MotifLook>
        <MotifLook
          label="Guest"
          src="/Details/Guest.png"
          alt="Guest attire"
          colors={MOTIF_COLORS}
        >
          <div className="space-y-2">
            <p
              className={`${cinzel.className} ${ct.labelSm} font-semibold uppercase tracking-[0.18em]`}
              style={{ color: detailText.label }}
            >
              Casual Attire
            </p>
            <p
              className={`font-goudy-italic ${ct.body} leading-relaxed`}
              style={{ color: detailText.body }}
            >
              Whimsical Spring
            </p>
          </div>
        </MotifLook>
      </div>
    </div>
  )
}

type EventVenueCardProps = {
  badge: string
  images: string[]
  activeImageIndex: number
  locationName: string
  venueAddress: string
  venueDetail?: string
  day: string
  dateString: string
  time: string
  venueSectionLabel: string
  mapsLink: string
  copyId: string
  fullVenue: string
  copiedItems: Set<string>
  onCopy: (text: string, id: string) => void
  onOpenMaps: (link: string) => void
  showDateDetails?: boolean
}

function EventVenueCard({
  badge,
  images,
  activeImageIndex,
  locationName,
  venueAddress,
  venueDetail,
  day,
  dateString,
  time,
  venueSectionLabel,
  mapsLink,
  copyId,
  fullVenue,
  copiedItems,
  onCopy,
  onOpenMaps,
  showDateDetails = true,
}: EventVenueCardProps) {
  const eventDate = showDateDetails ? new Date(dateString) : null

  return (
    <div className="relative group">
      <div
        className="absolute -inset-1 rounded-2xl opacity-0 blur-lg transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            "linear-gradient(to bottom right, color-mix(in srgb, var(--color-welcome-gold) 22%, transparent), transparent)",
        }}
      />

      <div
        className="relative rounded-xl sm:rounded-2xl overflow-hidden border transition-all duration-300"
        style={cardStyle}
      >
        <div className="relative w-full h-64 sm:h-72 md:h-80 lg:h-96 xl:h-[30rem] overflow-hidden">
          {images.length === 1 ? (
            <Image
              src={images[0]}
              alt={locationName}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 1280px"
              priority
            />
          ) : (
            images.map((src, index) => {
              const isActive = index === activeImageIndex
              return (
                <div
                  key={index}
                  className={`absolute inset-0 transition-[opacity,transform] duration-[1600ms] ease-[cubic-bezier(0.45,0.05,0.55,0.95)] ${
                    isActive
                      ? "opacity-100 scale-100 z-10"
                      : "opacity-0 scale-[1.06] z-0 pointer-events-none"
                  }`}
                >
                  <Image
                    src={src}
                    alt={locationName}
                    fill
                    className={`object-cover transition-transform duration-[9000ms] ease-out ${
                      isActive ? "scale-[1.08] group-hover:scale-[1.12]" : "scale-100"
                    }`}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 1280px"
                    priority={index === 0}
                  />
                </div>
              )
            })
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent z-20 pointer-events-none" />

          <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 md:bottom-6 md:left-6 right-3 sm:right-4 md:right-6 z-30">
            <span className={`${cinzel.className} inline-block mb-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-[10px] sm:text-xs uppercase tracking-[0.2em] text-white border border-white/30`}>
              {badge}
            </span>
            <h3 className={`${theSeasons.className} text-base sm:text-lg md:text-xl lg:text-2xl font-semibold text-white mb-1 sm:mb-1.5 drop-shadow-lg uppercase tracking-[0.12em] leading-tight`}>
              {locationName}
            </h3>
            <p className={`${theSeasons.className} text-[10px] sm:text-xs md:text-sm lg:text-base text-white/95 drop-shadow-md tracking-[0.06em] leading-snug`}>
              {venueAddress}
            </p>
          </div>
        </div>

        <div className="p-3 sm:p-5 md:p-7 lg:p-9">
          <div className="text-center mb-5 sm:mb-8 md:mb-10 space-y-2 sm:space-y-2.5 md:space-y-3">
            {showDateDetails && eventDate && (
              <>
                <p
                  className={`${cinzel.className} ${ct.label} font-semibold uppercase tracking-[0.2em]`}
                  style={{ color: detailText.heading }}
                >
                  {day}
                </p>

                <p
                  className={`${cinzel.className} ${ct.month} font-semibold leading-none`}
                  style={{ color: detailText.heading }}
                >
                  {eventDate.toLocaleString("default", { month: "long" })}
                </p>

                <div className="flex items-center justify-center gap-3 sm:gap-4 md:gap-5 py-1 sm:py-2">
                  <p
                    className={`${cinzel.className} ${ct.dayNum} font-semibold leading-none`}
                    style={{ color: detailText.accent }}
                  >
                    {eventDate.getDate()}
                  </p>
                  <div
                    className="h-10 sm:h-12 md:h-14 w-[2px] rounded-full"
                    style={{ backgroundColor: GOLD }}
                  />
                  <p
                    className={`${cinzel.className} ${ct.year} font-semibold leading-none`}
                    style={{ color: detailText.heading }}
                  >
                    {eventDate.getFullYear()}
                  </p>
                </div>
              </>
            )}

            <p
              className={`${cinzel.className} text-sm sm:text-base md:text-lg lg:text-xl font-semibold tracking-[0.14em] uppercase ${showDateDetails ? "" : "py-2 sm:py-3"}`}
              style={{ color: detailText.heading }}
            >
              At {time}
            </p>
          </div>

          <div className="rounded-xl p-3 sm:p-4 md:p-5 mb-4 sm:mb-6 border" style={softPanelStyle}>
            <div className="flex items-start gap-2 sm:gap-3 md:gap-4">
              <MapPin className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 mt-0.5 flex-shrink-0" style={{ color: detailText.accent }} />
              <div className="flex-1 min-w-0">
                <p className={`${cinzel.className} ${ct.label} font-semibold mb-1.5 sm:mb-2 uppercase tracking-wide`} style={{ color: detailText.label }}>
                  {venueSectionLabel}
                </p>
                <p className={`${theSeasons.className} text-sm sm:text-base md:text-lg lg:text-xl font-semibold leading-snug tracking-[0.06em] uppercase`} style={{ color: detailText.heading }}>
                  {locationName}
                </p>
                {venueDetail && (
                  <p className={`${theSeasons.className} ${ct.body} leading-relaxed mt-1 tracking-wide`} style={{ color: detailText.label }}>
                    {venueDetail}
                  </p>
                )}
                <p className={`${theSeasons.className} ${ct.body} leading-relaxed mt-1 tracking-[0.04em]`} style={{ color: detailText.body }}>
                  {venueAddress}
                </p>
              </div>
              <div className="flex flex-col items-center gap-1.5 sm:gap-2 flex-shrink-0">
                <div
                  className="p-1.5 sm:p-2 md:p-2.5 rounded-lg border shadow-sm"
                  style={{
                    backgroundColor: IVORY,
                    borderColor: GOLD_BORDER_SOFT,
                  }}
                >
                  <QRCodeSVG
                    value={mapsLink}
                    size={80}
                    level="M"
                    includeMargin={false}
                    fgColor={QR_FG}
                    bgColor={QR_BG}
                  />
                </div>
                <p className={`font-goudy-italic ${ct.label} text-center max-w-[90px]`} style={{ color: detailText.label }}>
                  Scan for directions
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 md:gap-4">
            <button
              type="button"
              onClick={() => onOpenMaps(mapsLink)}
              className={`${cinzel.className} flex-1 flex items-center justify-center gap-1.5 sm:gap-2 px-4 sm:px-5 py-2.5 sm:py-3 md:py-3.5 rounded-full border font-semibold uppercase tracking-[0.12em] ${ct.btn} transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]`}
              style={{
                background: NAV_GOLD,
                borderColor: GOLD_BORDER,
                color: IVORY,
                boxShadow:
                  "0 8px 18px color-mix(in srgb, var(--color-welcome-gold) 22%, transparent)",
              }}
              aria-label={`Get directions to ${badge.toLowerCase()} venue`}
            >
              <Navigation className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 flex-shrink-0" />
              <span>Get Directions</span>
            </button>
            <button
              type="button"
              onClick={() => onCopy(fullVenue, copyId)}
              className={`${cinzel.className} flex-1 flex items-center justify-center gap-1.5 sm:gap-2 px-4 sm:px-5 py-2.5 sm:py-3 md:py-3.5 border-2 rounded-full font-semibold uppercase tracking-[0.12em] ${ct.btn} transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]`}
              style={{
                color: NAVY,
                backgroundColor: IVORY,
                borderColor: GOLD_BORDER,
              }}
              aria-label={`Copy ${badge.toLowerCase()} venue address`}
            >
              {copiedItems.has(copyId) ? (
                <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 flex-shrink-0" style={{ color: GOLD }} />
              ) : (
                <Copy className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 flex-shrink-0" />
              )}
              <span>{copiedItems.has(copyId) ? "Copied!" : "Copy Address"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Colors sourced from globals.css @theme inline — edit there to update everywhere

const COUPLE_IMAGES = [
  "/envelope/boxes (1).JPG",
  "/envelope/boxes (2).JPG",
  "/envelope/boxes (3).JPG",
  "/envelope/boxes (4).JPG",
]

export function Details() {
  const siteConfig = useSiteConfig()
  const [copiedItems, setCopiedItems] = useState<Set<string>>(new Set())
  const [currentCeremonyImageIndex, setCurrentCeremonyImageIndex] = useState(0)
  const [currentReceptionImageIndex, setCurrentReceptionImageIndex] = useState(0)
  const [showImageModal, setShowImageModal] = useState<string | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [rotationOffset, setRotationOffset] = useState(0)

  const ceremonyImages = siteConfig.ceremony.image
  const receptionImages = siteConfig.reception.image

  useEffect(() => {
    if (ceremonyImages.length <= 1) return
    const timer = setInterval(() => {
      setCurrentCeremonyImageIndex((prev) => (prev + 1) % ceremonyImages.length)
    }, 4500)
    return () => clearInterval(timer)
  }, [ceremonyImages.length])

  useEffect(() => {
    if (receptionImages.length <= 1) return
    const timer = setInterval(() => {
      setCurrentReceptionImageIndex((prev) => (prev + 1) % receptionImages.length)
    }, 4500)
    return () => clearInterval(timer)
  }, [receptionImages.length])

  // Gentle reminders couple photos — subtle carousel + wobble animation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % COUPLE_IMAGES.length)
      setRotationOffset((prev) => (prev + 10) % 360)
    }, 2600)

    return () => clearInterval(interval)
  }, [])

  const copyToClipboard = async (text: string, itemId: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedItems(prev => new Set(prev).add(itemId))
      setTimeout(() => {
        setCopiedItems(prev => {
          const newSet = new Set(prev)
          newSet.delete(itemId)
          return newSet
        })
      }, 2000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  // Venue information from site config
  const ceremonyVenueName = siteConfig.ceremony.location
  const ceremonyVenueDetail = ""
  const ceremonyAddress = siteConfig.ceremony.venue
  const ceremonyVenue = `${ceremonyVenueName}, ${ceremonyAddress}`
  const ceremonyMapsLink = siteConfig.ceremony.map

  const receptionVenueName = siteConfig.reception.location
  const receptionVenueDetail = ""
  const receptionAddress = siteConfig.reception.venue
  const receptionVenue = `${receptionVenueName}, ${receptionAddress}`
  const receptionMapsLink =
    siteConfig.reception.map ||
    `https://maps.google.com/?q=${encodeURIComponent(receptionVenue)}`

  // Aliases used in the image modal
  const ceremonyLocationFormatted = ceremonyVenueName
  const receptionLocationFormatted = receptionVenueName
  const ceremonyLocation = ceremonyVenue
  const receptionLocation = receptionVenue
  const formattedCeremonyDate = siteConfig.ceremony.date
  const formattedReceptionDate = siteConfig.reception.date

  const openInMaps = (link: string) => {
    window.open(link, '_blank', 'noopener,noreferrer')
  }


  return (
    <div
      className={`${theSeasons.variable} ${aboveTheBeyond.variable} relative w-full`}
      style={{ background: sectionBackground }}
    >
      <Section
        id="details"
        className="relative z-10 pt-8 pb-8 sm:pt-10 sm:pb-10 md:pt-12 md:pb-12 lg:pt-14 lg:pb-14 overflow-hidden"
      >
        {/* Corner decorations */}
        <div className="pointer-events-none absolute left-0 top-0 z-10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/decoration/deco/left-top-deco.png"
            alt=""
            className={CORNER_DECO_CLASS}
          />
        </div>
        <div className="pointer-events-none absolute right-0 top-0 z-10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/decoration/deco/right-top-deco.png"
            alt=""
            className={CORNER_DECO_CLASS}
          />
        </div>
        <div className="pointer-events-none absolute bottom-0 left-0 z-10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/decoration/deco/left-bottom-deco.png"
            alt=""
            className={CORNER_DECO_CLASS}
          />
        </div>
        <div className="pointer-events-none absolute bottom-0 right-0 z-10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/decoration/deco/right-bottom-deco.png"
            alt=""
            className={CORNER_DECO_CLASS}
          />
        </div>

        {/* Header */}
        <div className="relative z-20 mb-8 px-3 text-center sm:mb-10 sm:px-4 md:mb-12">
          <div className="mx-auto mb-4 sm:mb-5 md:mb-6">
            <OutsideDivider />
          </div>
          <p
            className={`${cinzel.className} mx-auto max-w-[20rem] px-2 text-[0.8125rem] font-semibold leading-snug tracking-[0.12em] min-[400px]:max-w-none min-[400px]:text-[0.875rem] min-[400px]:tracking-[0.16em] sm:text-[0.9375rem] sm:tracking-[0.2em] md:text-base md:tracking-[0.22em]`}
            style={{ color: GOLD }}
          >
            Our Celebration
          </p>
          <div className="mx-auto mt-3 sm:mt-4 md:mt-5">
            <DetailsTitle />
          </div>
          <p
            className={`font-goudy-italic mx-auto mt-4 max-w-xl px-2 sm:mt-5 md:mt-6 ${sectionType.textRelaxed}`}
            style={{ color: BODY }}
          >
            Everything you need to know about our special day.
          </p>
          <div className="mt-4 flex items-center justify-center sm:mt-5">
            <span className="h-px w-16 sm:w-24 md:w-32" style={goldDividerStyle} />
          </div>
        </div>

      {/* Venue and Event Information */}
      <div className="relative z-20 max-w-5xl mx-auto px-4 sm:px-6 md:px-8 mb-8 sm:mb-10 md:mb-12 space-y-6 sm:space-y-10 md:space-y-14">
        <EventVenueCard
          badge="Ceremony"
          images={ceremonyImages}
          activeImageIndex={currentCeremonyImageIndex}
          locationName={ceremonyVenueName}
          venueAddress={ceremonyAddress}
          venueDetail={ceremonyVenueDetail}
          day={siteConfig.ceremony.day}
          dateString={siteConfig.ceremony.date}
          time={siteConfig.ceremony.time}
          venueSectionLabel="Ceremony Venue"
          mapsLink={ceremonyMapsLink}
          copyId="ceremony"
          fullVenue={ceremonyVenue}
          copiedItems={copiedItems}
          onCopy={copyToClipboard}
          onOpenMaps={openInMaps}
        />

        <EventVenueCard
          badge="Reception"
          images={receptionImages}
          activeImageIndex={currentReceptionImageIndex}
          locationName={receptionVenueName}
          venueAddress={receptionAddress}
          venueDetail={receptionVenueDetail}
          day={siteConfig.reception.day}
          dateString={siteConfig.reception.date}
          time={siteConfig.reception.time}
          showDateDetails={false}
          venueSectionLabel="Reception Venue"
          mapsLink={receptionMapsLink}
          copyId="reception"
          fullVenue={receptionVenue}
          copiedItems={copiedItems}
          onCopy={copyToClipboard}
          onOpenMaps={openInMaps}
        />
       
      </div>

      {/* Attire Guidelines */}
      <div className="relative z-20 mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
        <div className="text-center mb-8 sm:mb-10 md:mb-12">
          <SectionIconDivider
            icon={
              <Shirt
                className="h-3.5 w-3.5 sm:h-4 sm:w-4"
                style={{ color: GOLD }}
                aria-hidden
              />
            }
          />
          <h3
            className={`${theSeasons.className} ${ct.sectionTitle} mt-3 uppercase font-semibold leading-tight tracking-[0.12em] sm:mt-4 md:tracking-[0.15em]`}
            style={{ color: NAVY }}
          >
            Attire Guidelines
          </h3>
          <p
            className={`font-goudy-italic ${ct.bodyLg} mt-3 leading-relaxed sm:mt-4`}
            style={{ color: BODY }}
          >
            Please dress according to the guidelines below.
          </p>
        </div>

        {/* Dress Code Palette */}
        <DressCodePalette />

        {/* <div
          className="mb-8 sm:mb-10 md:mb-12 p-4 sm:p-5 md:p-6 rounded-xl sm:rounded-2xl border shadow-sm"
          style={cardStyle}
        >
          <p className={`${cinzel.className} ${ct.label} uppercase tracking-[0.18em] text-center mb-3 sm:mb-4 font-semibold`} style={{ color: detailText.label }}>
            Note to Sponsors, Entourage & Guests
          </p>
          <ul className="space-y-2 sm:space-y-3 max-w-2xl mx-auto">
            <li className="flex gap-3 items-start">
              <span
                className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
                style={{ backgroundColor: GOLD }}
              />
              <p className={`font-goudy-italic ${ct.body} leading-relaxed`} style={{ color: detailText.body }}>
                Please wear comfortable footwear fit for outdoor reception.
              </p>
            </li>
          </ul>
        </div> */}

        {/* Gentle Reminders */}
        <div className="relative mx-auto mt-6 max-w-4xl px-3 sm:mt-8 sm:px-5">
          <div
            className="relative overflow-hidden rounded-xl border sm:rounded-2xl"
            style={cardStyle}
          >
            <div className="relative z-10 px-4 py-5 text-center sm:px-6 sm:py-6">
              <CoupleImagesCarousel
                coupleImages={COUPLE_IMAGES}
                currentImageIndex={currentImageIndex}
                rotationOffset={rotationOffset}
              />

              <h3
                className={`${theSeasons.className} ${ct.sectionTitle} uppercase font-semibold tracking-[0.12em] md:tracking-[0.15em]`}
                style={{ color: NAVY }}
              >
                Gentle Reminders
              </h3>
              <p
                className={`font-goudy-italic ${ct.body} mx-auto mt-2 max-w-lg leading-relaxed`}
                style={{ color: detailText.body }}
              >
                A few thoughtful notes to help everyone enjoy our celebration.
              </p>

              <div className="mx-auto mt-4 max-w-2xl space-y-3 sm:mt-5 sm:space-y-4">
                <ReminderCard title="Adults-Only Celebration" variant="accent">
                  <p>
                    We kindly request that our wedding be an adults-only occasion. We hope this allows
                    everyone to relax and fully enjoy the celebration with us.
                  </p>
                </ReminderCard>

                <ReminderCard title="Unplugged Ceremony">
                  <p>
                    We&apos;re having a mostly unplugged ceremony. Guests may take photos, but we kindly
                    ask that it be kept minimal. Please avoid blocking or crowding our official
                    photographers so they can capture the special moments. We&apos;d love for everyone
                    to stay present and share the moment with us. Don&apos;t worry—professional photos
                    will be shared with you after the event. Thank you for your understanding.
                  </p>
                </ReminderCard>

                <ReminderCard title="Whimsical Spring Minimalist" variant="accent">
                  <div className="space-y-2.5">
                    <p>
                      Kindly follow our suggested attire and color palette above to match our wedding
                      theme.
                    </p>
                    <p>
                      Entourage: flowy / spring sage green dress, strictly floor length. Gentlemen,
                      black and white suit, white and gray suit, or sage green long sleeves with gray
                      or brown pants — strictly no rubber shoes.
                    </p>
                    <p>Guests: casual attire, Whimsical Spring.</p>
                  </div>
                </ReminderCard>

                <ReminderCard title="Arrival">
                  <p>
                    To ensure everything runs smoothly, please arrive at least 30 minutes before the
                    ceremony starts. The program will begin at {siteConfig.ceremony.time}, so we kindly
                    ask everyone to arrive by {siteConfig.ceremony.guestsTime}. This will give you time
                    to find your seat, take in the beautiful setup, and be fully present for our special
                    moment.
                  </p>
                </ReminderCard>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Enhanced Image Modal */}
      {showImageModal && (
        <div
          className="fixed inset-0 backdrop-blur-xl z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 animate-in fade-in duration-500"
          onClick={() => setShowImageModal(null)}
          style={{ backgroundColor: "rgba(94, 81, 68, 0.96)" }}
        >
          {/* Decorative background elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div
              className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl animate-pulse"
              style={{ backgroundColor: "#E8D5A3", opacity: 0.12 }}
            />
            <div
              className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl animate-pulse"
              style={{ backgroundColor: "#E8D5A3", opacity: 0.14, animationDelay: "1s" }}
            />
          </div>

          <div
            className="relative max-w-6xl w-full max-h-[95vh] sm:max-h-[90vh] bg-[#5E5144] rounded-3xl overflow-hidden shadow-2xl border-2 animate-in zoom-in-95 duration-500 group"
            onClick={(e) => e.stopPropagation()}
            style={{ borderColor: "#E8D5A3" }}
          >
            {/* Decorative top accent */}
            <div
              className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r"
              style={{ background: "linear-gradient(to right, #E8D5A3, #E8D5A3, #5E5144)" }}
            />

            {/* Enhanced close button */}
            <button
              onClick={() => setShowImageModal(null)}
              className="absolute top-4 right-4 sm:top-5 sm:right-5 md:top-6 md:right-6 z-20 hover:bg-[#6E6256] backdrop-blur-sm p-2.5 sm:p-3 rounded-xl shadow-xl transition-all duration-300 hover:scale-110 hover:shadow-2xl active:scale-95 border-2 group/close"
              title="Close (ESC)"
              style={{ backgroundColor: "#5E5144", borderColor: "#E8D5A3", color: "#E8D5A3" }}
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 group-hover/close:text-[#E1D5C7] transition-colors" />
            </button>

            {/* Venue badge */}
            <div className="absolute top-4 left-4 sm:top-5 sm:left-5 md:top-6 md:left-6 z-20">
              <div
                className="flex items-center gap-2 backdrop-blur-md px-4 py-2 rounded-full shadow-xl border-2"
                style={{ backgroundColor: "#5E5144", borderColor: "#E8D5A3" }}
              >
                {showImageModal === "ceremony" ? (
                  <>
                    <Heart className="w-4 h-4" fill="#E8D5A3" style={{ color: "#E8D5A3" }} />
                    <span className="text-xs sm:text-sm font-bold text-[#E8D5A3]">
                      Ceremony Venue
                    </span>
                  </>
                ) : (
                  <>
                    <Utensils className="w-4 h-4 text-[#E8D5A3]" />
                    <span className="text-xs sm:text-sm font-bold text-[#E8D5A3]">
                      Reception Venue
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Image section with enhanced effects */}
            <div
              className="relative w-full h-[50vh] sm:h-[60vh] md:h-[70vh] overflow-hidden"
              style={{ backgroundColor: "#5E5144" }}
            >
              {/* Shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-1000 z-0" />

              <Image
                src={
                  showImageModal === "ceremony"
                    ? ceremonyImages[currentCeremonyImageIndex] ?? ceremonyImages[0]
                    : receptionImages[currentReceptionImageIndex] ?? receptionImages[0]
                }
                alt={showImageModal === "ceremony" ? ceremonyLocationFormatted : receptionLocationFormatted}
                fill
                className="object-contain p-6 sm:p-8 md:p-10 transition-transform duration-700 group-hover:scale-105 z-10"
                sizes="95vw"
                priority
              />
            </div>

            {/* Enhanced content section */}
            <div
              className="relative border-t-2 p-5 sm:p-6 md:p-8 bg-[#5E5144] backdrop-blur-sm"
              style={{ borderColor: "#E8D5A3" }}
            >
              {/* Decorative line */}
              <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-[#E8D5A3]/30 to-transparent" />

              <div className="space-y-5">
                {/* Header with venue info */}
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="space-y-2">
                    <h3
                      className={`${cinzel.className} text-xl sm:text-2xl md:text-3xl font-bold flex items-center gap-3`}
                      style={{ color: "#E8D5A3" }}
                    >
                      {showImageModal === "ceremony" ? (
                        <Heart className="w-6 h-6 text-[#E8D5A3]" fill="#E8D5A3" />
                      ) : (
                        <Utensils className="w-6 h-6 text-[#E8D5A3]" />
                      )}
                      {showImageModal === "ceremony" ? siteConfig.ceremony.venue : siteConfig.reception.venue}
                    </h3>
                    <div className="flex items-center gap-2 text-sm opacity-70 text-[#E8D5A3]">
                      <MapPin className="w-4 h-4 text-[#E8D5A3]" />
                      <span>
                        {showImageModal === "ceremony"
                          ? ceremonyLocationFormatted
                          : receptionLocationFormatted}
                      </span>
                    </div>

                    {/* Date & Time info */}
                    {showImageModal === "ceremony" && (
                      <div
                        className="flex items-center gap-2 text-sm font-medium px-3 py-2 rounded-lg border"
                        style={{
                          color: "#E8D5A3",
                          backgroundColor: "#5E5144",
                          opacity: 0.9,
                          borderColor: "#E8D5A3",
                        }}
                      >
                        <Clock className="w-4 h-4 text-[#E8D5A3] shrink-0" />
                        <span>
                          {formattedCeremonyDate} at {siteConfig.ceremony.time}
                        </span>
                      </div>
                    )}
                    {showImageModal === "reception" && (
                      <div
                        className="flex items-center gap-2 text-sm font-medium px-3 py-2 rounded-lg border"
                        style={{
                          color: "#E8D5A3",
                          backgroundColor: "#5E5144",
                          opacity: 0.9,
                          borderColor: "#E8D5A3",
                        }}
                      >
                        <Clock className="w-4 h-4 text-[#E8D5A3]" />
                        <span>
                          {formattedReceptionDate} - {siteConfig.reception.time}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Action buttons */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
                    <button
                      onClick={() =>
                        copyToClipboard(
                          showImageModal === "ceremony"
                            ? ceremonyLocation
                            : receptionLocation,
                          `modal-${showImageModal}`,
                        )
                      }
                      className="flex items-center justify-center gap-2 px-4 py-2.5 sm:px-5 sm:py-3 bg-[#5E5144] border-2 rounded-xl font-semibold text-sm transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-95 shadow-md hover:bg-[#6E6256] whitespace-nowrap text-[#E8D5A3]"
                      title="Copy address"
                      style={{ borderColor: "#E8D5A3" }}
                    >
                      {copiedItems.has(`modal-${showImageModal}`) ? (
                        <>
                          <Check className="w-4 h-4" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          <span>Copy Address</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() =>
                        openInMaps(showImageModal === "ceremony" ? ceremonyMapsLink : receptionMapsLink)
                      }
                      className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm transition-all duration-300 hover:scale-105 hover:shadow-xl active:scale-95 shadow-lg whitespace-nowrap bg-[#E8D5A3] text-[#5E5144]"
                    >
                      <Navigation className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span>Get Directions</span>
                    </button>
                  </div>
                </div>

                {/* Additional info */}
                  <div className="flex items-center gap-2 text-xs opacity-65 text-[#E8D5A3]">
                  <span className="flex items-center gap-1.5">
                    <Camera className="w-3 h-3" />
                    Click outside to close
                  </span>
                  <span className="hidden sm:inline">•</span>
                  <span className="hidden sm:inline-flex items-center gap-1.5">Press ESC to close</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      </Section>
    </div>
  )
}