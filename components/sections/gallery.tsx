"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import Image from "next/image"
import localFont from "next/font/local"
import { X, ChevronLeft, ChevronRight, Camera } from "lucide-react"
import { Cinzel } from "next/font/google"
import { Section } from "@/components/section"
import { sectionType } from "@/lib/section-typography"
import { sectionBackground } from "@/lib/section-background"

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
const GOLD = "var(--color-welcome-gold)"
const NAVY = "var(--color-welcome-navy)"
const SCRIPT = "var(--color-welcome-green)"
const BODY = "var(--color-welcome-text)"
const NAV_GOLD =
  "linear-gradient(180deg, #E8D5A3 0%, #CDB072 52%, #C4A265 100%)"
const GOLD_BORDER = "color-mix(in srgb, var(--color-welcome-gold) 38%, transparent)"

const goldDividerStyle = {
  background: "linear-gradient(to right, transparent, var(--color-welcome-gold), transparent)",
} as const

const goldDividerStyleLeft = {
  background: "linear-gradient(to left, transparent, var(--color-welcome-gold), transparent)",
} as const

const CORNER_DECO_CLASS =
  "block h-auto w-auto max-w-[80px] sm:max-w-[120px] md:max-w-[170px] lg:max-w-[205px] xl:max-w-[245px] select-none"

function OutsideDivider() {
  return (
    <div className="flex items-center justify-center gap-1.5">
      <span className="h-px w-6 sm:w-10" style={goldDividerStyle} />
      <span className="h-0.5 w-0.5 rounded-full sm:h-1 sm:w-1" style={{ background: GOLD }} aria-hidden />
      <span className="h-px w-6 sm:w-10" style={goldDividerStyleLeft} />
    </div>
  )
}

const galleryTitleSize = {
  main: "clamp(1.65rem, 8.5vw, 4.5rem)",
  script: "clamp(0.95rem, 4.8vw, 2.7rem)",
} as const

function GalleryTitle() {
  return (
    <h2
      className="welcome-title-lockup relative mx-auto w-full max-w-full text-center"
      style={
        {
          "--title-size": galleryTitleSize.main,
          "--script-size": galleryTitleSize.script,
        } as React.CSSProperties
      }
    >
      <span className="sr-only">Gallery — our favorite moments</span>
      <span
        aria-hidden
        className={`${theSeasons.className} block uppercase leading-[0.9] tracking-[0.04em] min-[400px]:tracking-[0.08em] sm:tracking-[0.12em] md:tracking-[0.14em]`}
        style={{
          fontSize: "var(--title-size)",
          color: NAVY,
        }}
      >
        Gallery
      </span>
      <span
        aria-hidden
        className={`${aboveTheBeyond.className} relative z-10 mx-auto mt-1.5 block w-fit max-w-full px-1 leading-[0.88] sm:mt-2 sm:leading-[0.9]`}
        style={{
          fontSize: "var(--script-size)",
          color: SCRIPT,
          textShadow:
            "0 1px 0 color-mix(in srgb, var(--color-welcome-bg) 95%, white), 0 0 10px color-mix(in srgb, var(--color-welcome-bg) 65%, white)",
        }}
      >
        our favorite moments
      </span>
    </h2>
  )
}

const galleryItems = [
  { image: "/mobile-background/couples (21).webp", text: " " },
  { image: "/mobile-background/couples (8).webp", text: " " },
  { image: "/mobile-background/couples (26).webp", text: " " },
  { image: "/mobile-background/couples (22).webp", text: " " },
  { image: "/mobile-background/couples (7).webp", text: " " },
  { image: "/mobile-background/couples (31).webp", text: " " },
  { image: "/mobile-background/couples (36).webp", text: " " },
  { image: "/mobile-background/couples (73).webp", text: " " },
  { image: "/mobile-background/couples (74).webp", text: " " },
  { image: "/mobile-background/couples (70).webp", text: " " },

]

export function Gallery() {

  const [selectedImage, setSelectedImage] = useState<(typeof galleryItems)[0] | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  // reserved for potential skeleton tracking; not used after fade-in simplification
  const [touchStartX, setTouchStartX] = useState<number | null>(null)
  const [touchDeltaX, setTouchDeltaX] = useState(0)
  const [zoomScale, setZoomScale] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [pinchStartDist, setPinchStartDist] = useState<number | null>(null)
  const [pinchStartScale, setPinchStartScale] = useState(1)
  const [lastTap, setLastTap] = useState(0)
  const [panStart, setPanStart] = useState<{ x: number; y: number; panX: number; panY: number } | null>(null)

  useEffect(() => {
    // Simulate loading for better UX
    const timer = setTimeout(() => setIsLoading(false), 500)
    return () => clearTimeout(timer)
  }, [])

  const navigateImage = useCallback((direction: 'prev' | 'next') => {
    setCurrentIndex((prevIndex) => {
      let newIndex = prevIndex
      if (direction === 'next') {
        newIndex = (prevIndex + 1) % galleryItems.length
      } else {
        newIndex = (prevIndex - 1 + galleryItems.length) % galleryItems.length
      }
      setSelectedImage(galleryItems[newIndex])
      return newIndex
    })
  }, [])

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!selectedImage) return
      if (e.key === 'ArrowLeft') navigateImage('prev')
      if (e.key === 'ArrowRight') navigateImage('next')
      if (e.key === 'Escape') setSelectedImage(null)
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [selectedImage, currentIndex, navigateImage])

  // Prevent background scroll when lightbox is open
  useEffect(() => {
    if (selectedImage) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [selectedImage])

  // Preload adjacent images for smoother nav
  useEffect(() => {
    if (selectedImage) {
      const next = new window.Image()
      next.src = galleryItems[(currentIndex + 1) % galleryItems.length].image
      const prev = new window.Image()
      prev.src = galleryItems[(currentIndex - 1 + galleryItems.length) % galleryItems.length].image
    }
  }, [selectedImage, currentIndex])

  const clamp = (val: number, min: number, max: number) => Math.min(max, Math.max(min, val))
  const resetZoom = () => {
    setZoomScale(1)
    setPan({ x: 0, y: 0 })
    setPanStart(null)
  }

  return (
    <div
      className={`${theSeasons.variable} ${aboveTheBeyond.variable} relative w-full`}
      style={{ background: sectionBackground }}
    >
      <Section
        id="gallery"
        className="relative z-10 overflow-hidden pt-8 pb-8 sm:pt-10 sm:pb-10 md:pt-12 md:pb-12 lg:pt-14 lg:pb-14"
      >
        {/* Corner decorations */}
        <div className="pointer-events-none absolute left-0 top-0 z-10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/decoration/top-left-corner.png"
            alt=""
            aria-hidden="true"
            className={CORNER_DECO_CLASS}
          />
        </div>
        <div className="pointer-events-none absolute right-0 top-0 z-10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/decoration/top-right-corner.png"
            alt=""
            aria-hidden="true"
            className={CORNER_DECO_CLASS}
          />
        </div>
        <div className="pointer-events-none absolute bottom-0 left-0 z-10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/decoration/deco/bottom-left.png"
            alt=""
            aria-hidden="true"
            className={CORNER_DECO_CLASS}
          />
        </div>
        <div className="pointer-events-none absolute bottom-0 right-0 z-10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/decoration/deco/bottom-right.png"
            alt=""
            aria-hidden="true"
            className={CORNER_DECO_CLASS}
          />
        </div>

      {/* Header */}
      <div className="relative z-20 mx-auto mb-8 max-w-5xl px-3 text-center sm:mb-10 sm:px-4 md:mb-12">
        <div className="mx-auto mb-4 sm:mb-5 md:mb-6">
          <OutsideDivider />
        </div>
        <p
          className={`${cinzel.className} mx-auto mt-4 max-w-[20rem] px-2 text-[0.6875rem] font-semibold leading-snug tracking-[0.12em] min-[400px]:max-w-none min-[400px]:text-[0.75rem] min-[400px]:tracking-[0.16em] sm:mt-6 sm:text-[0.9375rem] sm:tracking-[0.2em] md:text-base md:tracking-[0.22em]`}
          style={{ color: GOLD }}
        >
          Our Moments
        </p>
        <div className="mx-auto mt-3 sm:mt-4 md:mt-5">
          <GalleryTitle />
        </div>
        <p
          className={`font-goudy-italic mx-auto mt-4 max-w-xl px-2 sm:mt-5 md:mt-6 ${sectionType.textRelaxed}`}
          style={{ color: BODY }}
        >
          From our first chapter to this beautiful season of commitment — every moment has been a
          testament to love, faith, and grace.
        </p>

        <div className="mt-4 flex items-center justify-center gap-1.5 sm:mt-5">
          <span className="h-px w-8 sm:w-12 md:w-16" style={goldDividerStyle} />
          <Camera
            className="h-3.5 w-3.5 sm:h-4 sm:w-4"
            style={{ color: GOLD }}
            aria-hidden
          />
          <span className="h-px w-8 sm:w-12 md:w-16" style={goldDividerStyleLeft} />
        </div>
      </div>

      {/* Gallery content — images outside container */}
      <div className="relative z-20 w-full max-w-6xl mx-auto px-6 sm:px-10 md:px-12 pb-2 sm:pb-3">
        {isLoading ? (
          <div className="flex items-center justify-center h-64 sm:h-80 md:h-96">
            <div
              className="h-12 w-12 animate-spin rounded-full border-[3px]"
              style={{
                borderColor: "color-mix(in srgb, var(--color-welcome-gold) 30%, transparent)",
                borderTopColor: GOLD,
              }}
            />
          </div>
        ) : (
          <>
            {/* Mobile: swipeable sliding gallery (scroll-snap carousel) */}
            <div className="sm:hidden">
              <div
                className="flex gap-3 overflow-x-auto px-1 pb-3 snap-x snap-mandatory scroll-px-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                aria-label="Gallery carousel"
              >
                {galleryItems.map((item, index) => (
                  <button
                    key={item.image + index}
                    type="button"
                    className="group relative snap-center shrink-0 w-[82%] overflow-hidden rounded-lg transition-all duration-300"
                    onClick={() => {
                      setSelectedImage(item)
                      setCurrentIndex(index)
                    }}
                    aria-label={`Open image ${index + 1}`}
                  >
                    <div
                      className="absolute -inset-0.5 rounded-lg opacity-0 blur-sm transition-opacity duration-300 group-active:opacity-100"
                      style={{
                        background:
                          "color-mix(in srgb, var(--color-welcome-gold) 32%, transparent)",
                      }}
                    />

                    <div className="relative aspect-[3/4] overflow-hidden rounded-lg">
                      <Image
                        src={item.image}
                        alt={item.text || `Gallery image ${index + 1}`}
                        fill
                        sizes="82vw"
                        className="object-cover transition-transform duration-500 group-active:scale-[1.02]"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-active:opacity-100 transition-opacity duration-300" />
                    </div>

                    <div
                      className="absolute top-2 right-2 rounded-full px-2 py-1 backdrop-blur-sm"
                      style={{
                        backgroundColor:
                          "color-mix(in srgb, var(--color-welcome-navy) 65%, transparent)",
                      }}
                    >
                      <span
                        className="text-xs font-medium"
                        style={{ color: "var(--color-welcome-bg)" }}
                      >
                        {index + 1}/{galleryItems.length}
                      </span>
                    </div>
                  </button>
                ))}
              </div>

              <p
                className={`${cinzel.className} mt-2 text-center tracking-[0.16em] uppercase ${sectionType.label}`}
                style={{ color: GOLD }}
              >
                Swipe to explore
              </p>
            </div>

            {/* Tablet/Desktop: grid */}
            <div className="hidden sm:grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-5 lg:gap-6">
              {galleryItems.map((item, index) => (
                <button
                  key={item.image + index}
                  type="button"
                  className="group relative w-full overflow-hidden rounded-xl transition-all duration-300"
                  onClick={() => {
                    setSelectedImage(item)
                    setCurrentIndex(index)
                  }}
                  aria-label={`Open image ${index + 1}`}
                >
                  <div
                    className="absolute -inset-0.5 rounded-xl opacity-0 blur-sm transition-opacity duration-300 group-hover:opacity-100"
                    style={{
                      background:
                        "color-mix(in srgb, var(--color-welcome-gold) 28%, transparent)",
                    }}
                  />

                  <div className="relative aspect-[3/4] md:aspect-square overflow-hidden rounded-xl">
                    <Image
                      src={item.image}
                      alt={item.text || `Gallery image ${index + 1}`}
                      fill
                      sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>

                  <div
                    className="absolute top-2 right-2 rounded-full px-2 py-1 opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100"
                    style={{
                      backgroundColor:
                        "color-mix(in srgb, var(--color-welcome-navy) 65%, transparent)",
                    }}
                  >
                    <span
                      className="text-xs font-medium"
                      style={{ color: "var(--color-welcome-bg)" }}
                    >
                      {index + 1}/{galleryItems.length}
                    </span>
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-10 sm:mt-12 md:mt-14 flex justify-center">
              <Link
                href="/gallery"
                className={`${cinzel.className} inline-flex items-center justify-center rounded-full border px-8 py-3 text-[0.625rem] font-semibold uppercase tracking-[0.18em] shadow-[0_8px_18px_color-mix(in_srgb,var(--color-welcome-gold)_22%,transparent)] transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] sm:text-[0.6875rem] sm:tracking-[0.22em]`}
                style={{
                  background: NAV_GOLD,
                  borderColor: GOLD_BORDER,
                  color: IVORY,
                }}
              >
                View Full Gallery
              </Link>
            </div>
          </>
        )}
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4"
          onClick={() => {
            setSelectedImage(null)
            resetZoom()
          }}
        >
            <div
              className="relative max-w-6xl w-full h-full sm:h-auto flex flex-col items-center justify-center"
              onTouchStart={(e) => {
                if (e.touches.length === 1) {
                  const now = Date.now()
                  if (now - lastTap < 300) {
                    setZoomScale((s) => (s > 1 ? 1 : 2))
                    setPan({ x: 0, y: 0 })
                  }
                  setLastTap(now)
                  const t = e.touches[0]
                  setTouchStartX(t.clientX)
                  setTouchDeltaX(0)
                  if (zoomScale > 1) {
                    setPanStart({ x: t.clientX, y: t.clientY, panX: pan.x, panY: pan.y })
                  }
                }
                if (e.touches.length === 2) {
                  const dx = e.touches[0].clientX - e.touches[1].clientX
                  const dy = e.touches[0].clientY - e.touches[1].clientY
                  const dist = Math.hypot(dx, dy)
                  setPinchStartDist(dist)
                  setPinchStartScale(zoomScale)
                }
              }}
              onTouchMove={(e) => {
                if (e.touches.length === 2 && pinchStartDist) {
                  const dx = e.touches[0].clientX - e.touches[1].clientX
                  const dy = e.touches[0].clientY - e.touches[1].clientY
                  const dist = Math.hypot(dx, dy)
                  const scale = clamp((dist / pinchStartDist) * pinchStartScale, 1, 3)
                  setZoomScale(scale)
                } else if (e.touches.length === 1) {
                  const t = e.touches[0]
                  if (zoomScale > 1 && panStart) {
                    const dx = t.clientX - panStart.x
                    const dy = t.clientY - panStart.y
                    setPan({ x: panStart.panX + dx, y: panStart.panY + dy })
                  } else if (touchStartX !== null) {
                    setTouchDeltaX(t.clientX - touchStartX)
                  }
                }
              }}
              onTouchEnd={() => {
                setPinchStartDist(null)
                setPanStart(null)
                if (zoomScale === 1 && Math.abs(touchDeltaX) > 50) {
                  navigateImage(touchDeltaX > 0 ? 'prev' : 'next')
                }
                setTouchStartX(null)
                setTouchDeltaX(0)
              }}
            >
            {/* Top bar with counter and close */}
            <div className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between p-4 sm:p-6">
              {/* Image counter */}
              <div
                className="rounded-full border px-4 py-2 backdrop-blur-md"
                style={{
                  backgroundColor: "rgba(0,0,0,0.4)",
                  borderColor:
                    "color-mix(in srgb, var(--color-welcome-gold) 50%, transparent)",
                }}
              >
                <span
                  className="text-sm font-medium sm:text-base"
                  style={{ color: "var(--color-welcome-bg)" }}
                >
                  {currentIndex + 1} / {galleryItems.length}
                </span>
              </div>
              
              {/* Close button */}
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setSelectedImage(null)
                  resetZoom()
                }}
                className="bg-black/40 hover:bg-black/60 backdrop-blur-md rounded-full p-2 sm:p-3 transition-all duration-200 border border-white/20 hover:border-white/40"
                aria-label="Close lightbox"
              >
                <X size={20} className="sm:w-6 sm:h-6 text-white" />
              </button>
            </div>

            {/* Navigation buttons */}
            {galleryItems.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    navigateImage('prev')
                    resetZoom()
                  }}
                  className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 bg-black/40 hover:bg-black/60 backdrop-blur-md rounded-full p-3 sm:p-4 transition-all duration-200 border border-white/20 hover:border-white/40"
                  aria-label="Previous image"
                >
                  <ChevronLeft size={24} className="sm:w-7 sm:h-7 text-white" />
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    navigateImage('next')
                    resetZoom()
                  }}
                  className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 bg-black/40 hover:bg-black/60 backdrop-blur-md rounded-full p-3 sm:p-4 transition-all duration-200 border border-white/20 hover:border-white/40"
                  aria-label="Next image"
                >
                  <ChevronRight size={24} className="sm:w-7 sm:h-7 text-white" />
                </button>
              </>
            )}

            {/* Image container */}
            <div className="relative w-full h-full flex items-center justify-center pt-16 sm:pt-20 pb-4 sm:pb-6 overflow-hidden">
              <div
                className="relative inline-block max-w-full max-h-full"
                onClick={(e) => e.stopPropagation()}
              >
                <Image
                  src={selectedImage.image || "/placeholder.svg"}
                  alt={selectedImage.text || "Gallery image"}
                  width={1200}
                  height={1600}
                  sizes="100vw"
                  priority
                  style={{
                    transform: `translate3d(${pan.x}px, ${pan.y}px, 0) scale(${zoomScale})`,
                    transition: pinchStartDist ? "none" : "transform 200ms ease-out",
                  }}
                  className="max-w-full max-h-[75vh] w-auto h-auto sm:max-h-[85vh] object-contain rounded-lg shadow-2xl will-change-transform"
                />
                
                {/* Zoom reset button */}
                {zoomScale > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      resetZoom()
                    }}
                    className="absolute bottom-2 right-2 bg-black/60 hover:bg-black/80 backdrop-blur-md text-white rounded-full px-3 py-1.5 text-xs font-medium border border-white/20 transition-all duration-200"
                  >
                    Reset Zoom
                  </button>
                )}
              </div>
            </div>

            {/* Bottom hint for mobile */}
            {galleryItems.length > 1 && (
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 sm:hidden z-20">
                <p className="text-xs text-white/60 bg-black/40 backdrop-blur-sm rounded-full px-3 py-1.5 border border-white/10">
                  Swipe to navigate
                </p>
              </div>
            )}
          </div>
        </div>
      )}
      </Section>
    </div>
  )
}