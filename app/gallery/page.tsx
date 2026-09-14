import MasonryGallery from "@/components/masonry-gallery"
import { getSiteConfig } from "@/lib/site-config"
import { fetchGalleryImages } from "@/lib/fetch-gallery-images"
import localFont from "next/font/local"
import { Camera } from "lucide-react"

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
  "block h-auto w-auto max-w-[72px] sm:max-w-[96px] md:max-w-[120px] lg:max-w-[140px] xl:max-w-[160px]"

export const dynamic = "force-static"

function GalleryTitle() {
  return (
    <h1
      className="relative mx-auto w-full max-w-full text-center"
      style={
        {
          "--title-size": "clamp(2.15rem, 11vw, 4.5rem)",
          "--script-size": "clamp(1.1rem, 4.5vw, 2.25rem)",
          "--script-overlap": "clamp(-0.65rem, -2.8vw, -1.5rem)",
        } as React.CSSProperties
      }
    >
      <span
        className={`${theSeasons.className} block uppercase leading-[0.78] tracking-[0.08em] min-[400px]:tracking-[0.11em] sm:tracking-[0.15em] md:tracking-[0.18em]`}
        style={{
          fontSize: "var(--title-size)",
          color: "var(--color-welcome-navy)",
        }}
      >
        Gallery
      </span>
      <span
        aria-hidden
        className={`${aboveTheBeyond.className} relative z-10 mx-auto block w-fit max-w-full px-1 leading-[0.88] sm:leading-[0.9]`}
        style={{
          marginTop: "var(--script-overlap)",
          fontSize: "var(--script-size)",
          color: "var(--color-welcome-green)",
          textShadow:
            "0 1px 0 color-mix(in srgb, var(--color-welcome-bg) 95%, white), 0 0 10px color-mix(in srgb, var(--color-welcome-bg) 65%, white)",
        }}
      >
        our favorite moments
      </span>
      <span className="sr-only">our favorite moments</span>
    </h1>
  )
}

function toGalleryItems(
  srcs: string[],
  category: "desktop" | "mobile",
) {
  const isMobile = category === "mobile"
  return srcs.map((src) => ({
    src,
    category,
    width: isMobile ? 900 : 1600,
    height: isMobile ? 1200 : 900,
    orientation: (isMobile ? "portrait" : "landscape") as "portrait" | "landscape",
  }))
}

export default async function GalleryPage() {
  const siteConfig = await getSiteConfig()
  const { desktop, mobile } = await fetchGalleryImages()
  const images = [
    ...toGalleryItems(desktop, "desktop"),
    ...toGalleryItems(mobile, "mobile"),
  ]

  return (
    <main
      className={`${theSeasons.variable} ${aboveTheBeyond.variable} relative min-h-screen overflow-hidden`}
      style={{ background: "var(--color-welcome-bg)" }}
    >
      <div className="pointer-events-none absolute left-0 top-0 z-10">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {/* <img
          src="/decoration/left-top-corner.png"
          alt=""
          className={CORNER_DECO_CLASS}
        /> */}
      </div>
      <div className="pointer-events-none absolute right-0 top-0 z-10">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {/* <img
          src="/decoration/right-top-corner.png"
          alt=""
          className={CORNER_DECO_CLASS}
        /> */}
      </div>
      <div className="pointer-events-none absolute bottom-0 left-0 z-10">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {/* <img
          src="/decoration/left-bottom-corner.png"
          alt=""
          className={CORNER_DECO_CLASS}
        /> */}
      </div>
      <div className="pointer-events-none absolute bottom-0 right-0 z-10">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {/* <img
          src="/decoration/right-bottom-corner.png"
          alt=""
          className={CORNER_DECO_CLASS}
        /> */}
      </div>

      <section className="relative z-20 mx-auto max-w-7xl px-3 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
        <div className="mb-6 px-3 text-center sm:mb-8 sm:px-4 md:mb-10">
          <div className="my-4 sm:my-5 md:my-6">
            <GalleryTitle />
          </div>
          <p
            className="font-goudy-italic mx-auto max-w-2xl px-2 text-[0.75rem] leading-[1.62] sm:text-[0.8125rem] sm:leading-[1.65] md:text-[0.84375rem]"
            style={{ color: "var(--color-welcome-text)" }}
          >
            From our first chapter to this beautiful season of commitment — every moment has been a
            testament to love, faith, and grace.
          </p>

          <div className="flex items-center justify-center gap-2 pt-3 sm:pt-4">
            <span
              className="h-px w-8 sm:w-12 md:w-16"
              style={{
                background:
                  "linear-gradient(to right, transparent, color-mix(in srgb, var(--color-welcome-navy) 38%, transparent))",
              }}
            />
            <Camera
              className="h-3.5 w-3.5 sm:h-4 sm:w-4"
              style={{ color: "var(--color-welcome-green)" }}
              aria-hidden
            />
            <span
              className="h-px w-8 sm:w-12 md:w-16"
              style={{
                background:
                  "linear-gradient(to left, transparent, color-mix(in srgb, var(--color-welcome-navy) 38%, transparent))",
              }}
            />
          </div>
        </div>

        {images.length > 0 ? (
          <MasonryGallery images={images} />
        ) : (
          <p
            className="text-center font-sans text-sm"
            style={{ color: "var(--color-welcome-text)" }}
          >
            No images to display.
          </p>
        )}
      </section>
    </main>
  )
}
