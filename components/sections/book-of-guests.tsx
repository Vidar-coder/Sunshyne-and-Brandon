"use client"

import { useState, useEffect } from "react"
import { RefreshCw } from "lucide-react"
import localFont from "next/font/local"
import { Cinzel } from "next/font/google"
import { useSiteConfig } from "@/hooks/use-site-config"
import { layeredSectionTitleSize, sectionType } from "@/lib/section-typography"

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

const C = {
  forest: "#5d6f47",
  sage: "#949981",
  mustard: "#eec853",
  butter: "#f4dd97",
  cream: "#f7f3e9",
} as const

const creamWash = `
  radial-gradient(920px 520px at 50% 8%, color-mix(in srgb, ${C.butter} 35%, transparent) 0%, transparent 55%),
  radial-gradient(640px 420px at 12% 88%, color-mix(in srgb, ${C.sage} 16%, transparent) 0%, transparent 58%),
  radial-gradient(560px 380px at 92% 78%, color-mix(in srgb, ${C.mustard} 14%, transparent) 0%, transparent 55%),
  linear-gradient(180deg, ${C.cream} 0%, #faf7ef 48%, ${C.cream} 100%)
`

const IVORY = "#fffaf4"
const GOLD = "var(--color-welcome-gold)"
const NAVY = "var(--color-welcome-navy)"
const BODY = "var(--color-welcome-text)"
const NAV_GOLD =
  "linear-gradient(180deg, #E8D5A3 0%, #CDB072 52%, #C4A265 100%)"
const GOLD_BORDER = "color-mix(in srgb, var(--color-welcome-gold) 38%, transparent)"
const GOLD_BORDER_SOFT = "color-mix(in srgb, var(--color-welcome-gold) 22%, transparent)"

const palette = {
  body: BODY,
  heading: NAVY,
  label: GOLD,
  accent: GOLD,
} as const

const cardStyle = {
  background: "var(--color-welcome-bg)",
  borderColor: "color-mix(in srgb, var(--color-motif-deep) 14%, transparent)",
  borderWidth: "1px",
  borderStyle: "solid",
  boxShadow:
    "0 8px 28px color-mix(in srgb, var(--color-motif-deep) 7%, transparent), inset 0 1px 0 color-mix(in srgb, white 70%, transparent)",
} as const

const ambientGlowStyle = {
  background:
    "linear-gradient(135deg, color-mix(in srgb, var(--color-motif-deep) 18%, transparent) 0%, color-mix(in srgb, var(--color-welcome-green) 12%, transparent) 48%, color-mix(in srgb, var(--color-motif-deep) 10%, transparent) 100%)",
} as const

const dividerLineStyle = {
  background:
    "linear-gradient(to right, transparent, color-mix(in srgb, var(--color-motif-deep) 38%, transparent), transparent)",
} as const

const CORNER_DECO_CLASS =
  "block h-auto w-auto max-w-[120px] sm:max-w-[180px] md:max-w-[260px] lg:max-w-[320px] xl:max-w-[380px] select-none"

const refreshButtonStyle = {
  borderColor: "color-mix(in srgb, var(--color-motif-deep) 14%, transparent)",
  backgroundColor: "var(--color-welcome-bg-soft)",
  boxShadow:
    "0 4px 14px color-mix(in srgb, var(--color-motif-deep) 10%, transparent), inset 0 1px 0 color-mix(in srgb, white 70%, transparent)",
} as const

const chipPrimaryStyle = {
  color: NAVY,
  borderColor: GOLD_BORDER,
  backgroundColor: "color-mix(in srgb, var(--color-welcome-gold) 12%, white)",
} as const

const chipSecondaryStyle = {
  color: NAVY,
  borderColor: GOLD_BORDER_SOFT,
  backgroundColor: "color-mix(in srgb, var(--color-welcome-gold) 8%, white)",
} as const

const ct = {
  label: sectionType.label,
  body: sectionType.text,
  bodyLg: sectionType.subheader,
  stat: "text-2xl sm:text-3xl md:text-4xl",
  guestName: sectionType.subheader,
  meta: sectionType.label,
} as const

function BookOfGuestsTitle() {
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
      <span
        className={`${theSeasons.className} block uppercase leading-[0.78] tracking-[0.08em] min-[400px]:tracking-[0.11em] sm:tracking-[0.13em] md:tracking-[0.14em] pb-1 sm:pb-1.5`}
        style={{
          fontSize: "var(--title-size)",
          color: "var(--color-welcome-navy)",
        }}
      >
        Book of Guests
      </span>
      <span
        aria-hidden
        className={`${aboveTheBeyond.className} mx-auto block w-fit max-w-full px-1 leading-[0.88] sm:leading-[0.9] mt-2 sm:mt-2.5 md:mt-3`}
        style={{
          fontSize: "var(--script-size)",
          color: "var(--color-welcome-green)",
        }}
      >
        celebrating with us
      </span>
      <span className="sr-only">celebrating with us</span>
    </h2>
  )
}

interface Guest {
  id: string | number
  name: string
  role: string
  email?: string
  contact?: string
  message?: string
  allowedGuests: number
  companions: { name: string; relationship: string }[]
  tableNumber: string
  isVip: boolean
  status: 'pending' | 'confirmed' | 'declined' | 'request'
  addedBy?: string
  createdAt?: string
  updatedAt?: string
}

const CARDS_PER_VIEW = 4

export function BookOfGuests() {
  const siteConfig = useSiteConfig()
  const [totalGuests, setTotalGuests] = useState(0)
  const [rsvpCount, setRsvpCount] = useState(0)
  const [confirmedGuests, setConfirmedGuests] = useState<Guest[]>([])
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())
  const [previousTotal, setPreviousTotal] = useState(0)
  const [showIncrease, setShowIncrease] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [justEntered, setJustEntered] = useState(false)

  // Helper function to get initials from name
  const getInitials = (name: string): string => {
    const words = name.trim().split(' ')
    if (words.length >= 2) {
      return (words[0][0] + words[words.length - 1][0]).toUpperCase()
    }
    return name.substring(0, 2).toUpperCase()
  }

  // Helper function to format date
  const formatDate = (dateString?: string): string => {
    if (!dateString) return 'Recently'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  const formatLastUpdate = (date: Date): string =>
    date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })

  const fetchGuests = async (showLoading = false) => {
    if (showLoading) setIsRefreshing(true)
    
    try {
      // Fetch from local API route which connects to Google Sheets
      const response = await fetch("/api/guests", {
        cache: "no-store"
      })

      if (!response.ok) {
        throw new Error("Failed to fetch guest list")
      }

      const data: Guest[] = await response.json()

      // Filter only confirmed/attending guests
      const attendingGuests = data.filter((guest) => guest.status === "confirmed")
      
      // Sort guests: VIPs first, then by updatedAt (most recent first)
      const sortedGuests = attendingGuests.sort((a, b) => {
        // VIPs come first
        if (a.isVip && !b.isVip) return -1
        if (!a.isVip && b.isVip) return 1
        
        // Then sort by most recent update
        const dateA = new Date(a.updatedAt || 0).getTime()
        const dateB = new Date(b.updatedAt || 0).getTime()
        return dateB - dateA
      })
      
      // Calculate total guests by summing allowedGuests for each confirmed guest
      const totalGuestCount = attendingGuests.reduce((sum, guest) => {
        return sum + (guest.allowedGuests || 1)
      }, 0)
      
      // Show increase animation if count went up
      if (totalGuestCount > totalGuests && totalGuests > 0) {
        setPreviousTotal(totalGuests)
        setShowIncrease(true)
        setTimeout(() => setShowIncrease(false), 2000)
      }
      
      setTotalGuests(totalGuestCount)
      setRsvpCount(attendingGuests.length)
      setConfirmedGuests(sortedGuests)
      setLastUpdate(new Date())
    } catch (error: any) {
      console.error("Failed to load guests:", error)
    } finally {
      if (showLoading) {
        setTimeout(() => setIsRefreshing(false), 500)
      }
    }
  }

  // Get visible guests (max 4 cards) for carousel
  const getVisibleGuests = () => {
    if (confirmedGuests.length <= CARDS_PER_VIEW) return confirmedGuests
    const visible: Guest[] = []
    for (let i = 0; i < CARDS_PER_VIEW; i++) {
      const index = (currentIndex + i) % confirmedGuests.length
      visible.push(confirmedGuests[index])
    }
    return visible
  }

  useEffect(() => {
    // Initial fetch
    fetchGuests()

    // Set up automatic polling every 30 seconds for real-time updates
    const pollInterval = setInterval(() => {
      fetchGuests()
    }, 30000) // 30 seconds

    // Set up event listener for RSVP updates
    const handleRsvpUpdate = () => {
      // Add a small delay to allow Google Sheets to update
      setTimeout(() => {
        fetchGuests(true)
      }, 2000)
    }

    window.addEventListener("rsvpUpdated", handleRsvpUpdate)

    return () => {
      clearInterval(pollInterval)
      window.removeEventListener("rsvpUpdated", handleRsvpUpdate)
    }
  }, [totalGuests])

  // Auto-rotate carousel every 5 seconds when more than 4 guests
  useEffect(() => {
    if (confirmedGuests.length <= CARDS_PER_VIEW) return
    const interval = setInterval(() => {
      setIsTransitioning(true)
      setTimeout(() => {
        setCurrentIndex((prev) => {
          const next = prev + CARDS_PER_VIEW
          return next >= confirmedGuests.length ? 0 : next
        })
        setIsTransitioning(false)
        setJustEntered(true)
        setTimeout(() => setJustEntered(false), 1100)
      }, 600)
    }, 5000)
    return () => clearInterval(interval)
  }, [confirmedGuests.length])

  return (
    <div
      id="guests"
      className={`${theSeasons.variable} ${aboveTheBeyond.variable} relative isolate z-10 overflow-hidden pt-8 pb-8 sm:pt-10 sm:pb-10 md:pt-12 md:pb-12 lg:pt-14 lg:pb-14`}
      style={{ background: creamWash }}
    >
      {/* Corner decorations */}
      <div className="pointer-events-none absolute left-0 top-0 z-10">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/decoration/left-top-corner.png"
          alt=""
          aria-hidden="true"
          className={CORNER_DECO_CLASS}
        />
      </div>
      <div className="pointer-events-none absolute right-0 top-0 z-10">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/decoration/right-top-corner.png"
          alt=""
          aria-hidden="true"
          className={CORNER_DECO_CLASS}
        />
      </div>
      <div className="pointer-events-none absolute bottom-0 left-0 z-10">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/decoration/left-bottom-corner.png"
          alt=""
          aria-hidden="true"
          className={CORNER_DECO_CLASS}
        />
      </div>
      <div className="pointer-events-none absolute bottom-0 right-0 z-10">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/decoration/right-bottom-corner.png"
          alt=""
          aria-hidden="true"
          className={CORNER_DECO_CLASS}
        />
      </div>

      {/* Section Header */}
      <div className="relative z-20 mx-auto mb-6 max-w-5xl px-6 text-center @container/book-of-guests sm:mb-8 sm:px-10 md:mb-10 md:px-12">
        <div className="mt-8 mb-4 sm:mt-10 sm:mb-5 md:mt-12 md:mb-6">
          <BookOfGuestsTitle />
        </div>
        <p
          className={`font-goudy-italic mx-auto max-w-2xl px-2 ${sectionType.textRelaxed}`}
          style={{ color: "var(--color-welcome-text)" }}
        >
          Meet the cherished souls joining us in celebration — your presence makes our day truly
          special.
        </p>
        <div className="flex items-center justify-center pt-3 sm:pt-4">
          <span className="h-px w-16 sm:w-24 md:w-32" style={dividerLineStyle} />
        </div>
      </div>

      {/* Guests content */}
      <div className="relative z-20 my-6 sm:my-8 md:my-10 mb-12 sm:mb-16 md:mb-20 px-6 sm:px-10 md:px-12">
        {/* Stats card */}
        <div className="text-center mb-8 sm:mb-10 md:mb-12">
          <div className="relative max-w-3xl mx-auto z-20">
            <div
              className="pointer-events-none absolute -inset-1 rounded-2xl opacity-50 blur-2xl sm:-inset-2"
              style={ambientGlowStyle}
              aria-hidden
            />
            <div
              className="relative z-20 overflow-hidden rounded-xl border backdrop-blur-xl transition-all duration-300 sm:rounded-2xl sm:backdrop-blur-2xl"
              style={cardStyle}
            >
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/40 via-white/10 to-transparent" aria-hidden />
              <div
                className="pointer-events-none absolute inset-0 rounded-xl sm:rounded-2xl ring-1 ring-inset ring-white/35"
                aria-hidden
              />

              {/* Refresh — corner icon, outside centered content flow */}
              <button
                type="button"
                onClick={() => fetchGuests(true)}
                disabled={isRefreshing}
                className="group absolute top-3 right-3 sm:top-4 sm:right-4 z-30 flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full border transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-45 disabled:hover:scale-100"
                style={refreshButtonStyle}
                title="Refresh guest counts"
                aria-label="Refresh guest counts"
              >
                <RefreshCw
                  className={`h-3.5 w-3.5 sm:h-4 sm:w-4 transition-transform duration-500 ${isRefreshing ? "animate-spin" : "group-hover:rotate-180"}`}
                  style={{ color: GOLD }}
                  aria-hidden
                />
              </button>

              <div className="relative z-[1] px-6 sm:px-10 md:px-12 py-5 sm:py-6 md:py-8 text-center">
                <p
                  className={`${cinzel.className} ${ct.label} uppercase tracking-[0.2em] font-semibold mb-3 sm:mb-4`}
                  style={{ color: palette.label }}
                >
                  Our Celebration
                </p>

                <div className="flex items-center justify-center gap-3 sm:gap-4 mb-1 sm:mb-2">
                  <span
                    className={`${cinzel.className} ${ct.stat} font-semibold tabular-nums leading-none transition-transform duration-500 ${showIncrease ? "scale-110" : ""}`}
                    style={{ color: palette.accent }}
                  >
                    {totalGuests}
                  </span>
                  <p
                    className={`${cinzel.className} ${ct.bodyLg} font-medium leading-snug text-left max-w-[10rem] sm:max-w-none`}
                    style={{ color: palette.heading }}
                  >
                    {totalGuests === 1 ? "Guest" : "Guests"}
                    <span className="block text-[0.85em] font-normal opacity-90">Celebrating With Us</span>
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mt-4 sm:mt-5 mb-4 sm:mb-5">
                  <span
                    className={`${cinzel.className} ${ct.meta} px-3 py-1 rounded-full border font-semibold uppercase tracking-[0.12em]`}
                    style={chipPrimaryStyle}
                  >
                    {rsvpCount} {rsvpCount === 1 ? "RSVP" : "RSVPs"}
                  </span>
                  <span
                    className={`${cinzel.className} ${ct.meta} px-3 py-1 rounded-full border font-semibold uppercase tracking-[0.12em]`}
                    style={chipSecondaryStyle}
                  >
                    {confirmedGuests.length} {confirmedGuests.length === 1 ? "Party" : "Parties"}
                  </span>
                </div>

                <div className="mx-auto mb-4 h-px w-12 sm:mb-5 sm:w-16" style={dividerLineStyle} />

                <p className={`font-goudy-italic ${ct.body} mx-auto max-w-md leading-relaxed`} style={{ color: palette.body }}>
                  Thank you for confirming your RSVP — your presence means the world to us.
                </p>

                <p className={`${cinzel.className} ${ct.meta} mt-3 sm:mt-4 uppercase tracking-[0.14em] opacity-70`} style={{ color: palette.body }}>
                  Updated {formatLastUpdate(lastUpdate)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Guest List Display */}
        {confirmedGuests.length > 0 && (
          <div className="relative z-20 max-w-5xl mx-auto">
            <div className="text-center mb-4 sm:mb-6 md:mb-8">
              <p
                className={`${cinzel.className} ${ct.label} uppercase tracking-[0.2em] font-semibold`}
                style={{ color: palette.label }}
              >
                Joining Us
              </p>
              <p className={`font-goudy-italic ${ct.body} mt-1.5`} style={{ color: palette.body }}>
                A glimpse of the wonderful guests celebrating with us
              </p>
            </div>
            <div
              className="relative overflow-hidden"
              style={{
                perspective: "1200px",
                perspectiveOrigin: "center 85%",
                transformStyle: "preserve-3d",
              }}
            >
              <div
                className={`space-y-2 sm:space-y-3 md:space-y-4 ${isTransitioning ? "animate-guest-roll-out" : ""}`}
                style={{ transformStyle: "preserve-3d" }}
              >
                {getVisibleGuests().map((guest, index) => (
                  <div
                    key={`${guest.id}-${currentIndex}-${index}`}
                    className={`relative z-20 group rounded-xl sm:rounded-2xl p-3.5 sm:p-4 md:p-5 transition-all duration-300 border backdrop-blur-xl overflow-hidden hover:shadow-xl ${justEntered ? "animate-guest-roll-in" : ""}`}
                    style={{
                      ...cardStyle,
                      ...(justEntered
                        ? {
                            animationDelay: `${index * 120}ms`,
                            backfaceVisibility: "hidden",
                          }
                        : {}),
                    }}
                  >
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" aria-hidden />
                  <div
                    className="pointer-events-none absolute inset-0 rounded-xl sm:rounded-2xl ring-1 ring-inset ring-white/20 group-hover:ring-white/40 transition-all duration-300"
                    aria-hidden
                  />
                  <div className="relative z-[1] flex items-start gap-3 sm:gap-4">
                    <div className="relative flex-shrink-0">
                      <div
                        className="flex h-11 w-11 items-center justify-center rounded-full ring-2 ring-white/80 sm:h-12 sm:w-12 md:h-14 md:w-14"
                        style={{
                          background: NAV_GOLD,
                          boxShadow:
                            "0 6px 14px color-mix(in srgb, var(--color-welcome-gold) 28%, transparent)",
                        }}
                      >
                        <span
                          className={`${cinzel.className} font-semibold ${sectionType.text}`}
                          style={{ color: IVORY }}
                        >
                          {getInitials(guest.name)}
                        </span>
                      </div>
                    </div>

                    <div className="flex-1 min-w-0 pt-0.5">
                      <div className="flex items-start justify-between gap-2 mb-2 sm:mb-2.5">
                        <div className="min-w-0">
                          <h3
                            className={`font-goudy-italic ${ct.guestName} truncate font-semibold leading-tight`}
                            style={{ color: palette.heading }}
                            title={guest.name}
                          >
                            {guest.name}
                          </h3>
                          {guest.role && (
                            <p
                              className={`${cinzel.className} ${ct.meta} font-medium uppercase tracking-wide mt-0.5`}
                              style={{ color: palette.label }}
                            >
                              {guest.role}
                            </p>
                          )}
                        </div>
                        {guest.isVip && (
                          <span
                            className={`${cinzel.className} shrink-0 ${ct.meta} px-2 py-0.5 rounded-full font-semibold uppercase tracking-[0.12em] border`}
                            style={{
                              background: NAV_GOLD,
                              color: IVORY,
                              borderColor: GOLD_BORDER,
                            }}
                          >
                            VIP
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
                        <span
                          className={`${cinzel.className} ${ct.meta} px-2.5 py-1 rounded-full border font-semibold uppercase tracking-[0.1em]`}
                          style={chipPrimaryStyle}
                        >
                          {guest.allowedGuests} {guest.allowedGuests === 1 ? "Guest" : "Guests"}
                        </span>
                        <span
                          className={`${cinzel.className} ${ct.meta} px-2.5 py-1 rounded-full border font-semibold uppercase tracking-[0.1em]`}
                          style={chipSecondaryStyle}
                        >
                          {guest.tableNumber && guest.tableNumber.trim() !== "" ? (
                            <> {guest.tableNumber}</>
                          ) : (
                            <span className="opacity-65">No Table Yet</span>
                          )}
                        </span>
                      </div>

                      {guest.companions && guest.companions.length > 0 && (
                        <div
                          className="pt-2.5 sm:pt-3 border-t"
                          style={{
                            borderColor: "color-mix(in srgb, var(--color-motif-deep) 14%, transparent)",
                          }}
                        >
                          <span
                            className={`${cinzel.className} ${ct.meta} font-semibold uppercase tracking-[0.14em] mb-2 block`}
                            style={{ color: palette.label }}
                          >
                            With Them
                          </span>
                          <div className="flex flex-wrap gap-1.5 sm:gap-2">
                            {guest.companions.map((companion, idx) => (
                              <div
                                key={idx}
                                className="inline-flex items-center gap-1.5 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg border transition-colors"
                                style={{
                                  borderColor: "color-mix(in srgb, var(--color-motif-deep) 14%, transparent)",
                                  backgroundColor: "var(--color-welcome-bg-soft)",
                                }}
                              >
                                <span className={`font-goudy-italic ${ct.meta} whitespace-nowrap font-medium`} style={{ color: palette.body }}>
                                  {companion.name}
                                </span>
                                {companion.relationship && companion.relationship.trim() !== "" && (
                                  <span
                                    className={`${cinzel.className} rounded-full border px-1.5 py-0.5 ${sectionType.label} font-medium whitespace-nowrap sm:px-2`}
                                    style={chipSecondaryStyle}
                                  >
                                    {companion.relationship}
                                  </span>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div
                        className="pt-2.5 sm:pt-3 mt-2.5 border-t flex items-center justify-between gap-2"
                        style={{
                          borderColor: "color-mix(in srgb, var(--color-motif-deep) 12%, transparent)",
                        }}
                      >
                        <span className={`font-goudy-italic ${ct.meta}`} style={{ color: palette.body, opacity: 0.85 }}>
                          Confirmed {formatDate(guest.updatedAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              </div>

              {/* Carousel indicators */}
              {/* {confirmedGuests.length > CARDS_PER_VIEW && (
                <div className="flex flex-col items-center gap-2 mt-5 sm:mt-7">
                  <div className="flex items-center justify-center gap-2">
                    {Array.from({ length: Math.ceil(confirmedGuests.length / CARDS_PER_VIEW) }).map((_, idx) => {
                      const pageIndex = Math.floor(currentIndex / CARDS_PER_VIEW)
                      const isActive = pageIndex === idx
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            setIsTransitioning(true)
                            setTimeout(() => {
                              setCurrentIndex(idx * CARDS_PER_VIEW)
                              setIsTransitioning(false)
                              setJustEntered(true)
                              setTimeout(() => setJustEntered(false), 1100)
                            }, 600)
                          }}
                          className="h-2 rounded-full transition-all duration-300 hover:opacity-90"
                          style={{
                            width: isActive ? "1.75rem" : "0.5rem",
                            backgroundColor: isActive
                              ? palette.accent
                              : "color-mix(in srgb, var(--color-motif-deep) 35%, transparent)",
                          }}
                          aria-label={`Go to page ${idx + 1}`}
                        />
                      )
                    })}
                  </div>
                  <p className={`${cinzel.className} ${ct.meta} uppercase tracking-[0.14em] opacity-70`} style={{ color: palette.body }}>
                    Page {Math.floor(currentIndex / CARDS_PER_VIEW) + 1} of {Math.ceil(confirmedGuests.length / CARDS_PER_VIEW)}
                  </p>
                </div>
              )} */}
            </div>
          </div>
        )}

        {confirmedGuests.length === 0 && !isRefreshing && (
          <div className="relative z-20 max-w-xl mx-auto text-center px-4">
            <div className="rounded-xl border px-6 py-10 backdrop-blur-xl sm:rounded-2xl sm:py-12" style={cardStyle}>
              <p className={`${cinzel.className} ${ct.bodyLg} mb-2 font-semibold`} style={{ color: palette.heading }}>
                Guest list updating
              </p>
              <p className={`font-goudy-italic ${ct.body}`} style={{ color: palette.body }}>
                Confirmed guests will appear here as RSVPs come in.
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}