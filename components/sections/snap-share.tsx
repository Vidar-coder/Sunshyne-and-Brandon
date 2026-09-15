"use client"

import { useEffect, useState } from "react"
import { Cinzel } from "next/font/google"
import localFont from "next/font/local"
import { Instagram, Facebook, Twitter, Share2, Copy, Download, Check } from "lucide-react"
import { QRCodeCanvas } from "qrcode.react"
import { useSiteConfig } from "@/hooks/use-site-config"
import { layeredSectionTitleSize, sectionType } from "@/lib/section-typography"
import Image from "next/image"

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
const BODY = "var(--color-welcome-text)"
const OUTSIDE_TEXT = "#FFFFFF"
const OUTSIDE_TEXT_MUTED = "rgba(255, 255, 255, 0.88)"
const OUTSIDE_TITLE_SHADOW =
  "0 2px 6px rgba(0, 0, 0, 0.28), 0 0 18px rgba(0, 0, 0, 0.12)"
const READABLE_SHADOW = "0 1px 3px rgba(0,0,0,0.55), 0 2px 10px rgba(0,0,0,0.35)"
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

const goldDividerStyle = {
  background: "linear-gradient(to right, transparent, var(--color-welcome-gold), transparent)",
} as const

const goldDividerStyleLeft = {
  background: "linear-gradient(to left, transparent, var(--color-welcome-gold), transparent)",
} as const

const ct = {
  body: sectionType.text,
  bodyLg: sectionType.textRelaxed,
  label: sectionType.label,
  cardTitle: `${sectionType.subheader} lg:text-xl`,
  btn: sectionType.label,
} as const

const cardStyle = {
  background: IVORY,
  borderColor: GOLD_BORDER,
  borderWidth: "1px",
  borderStyle: "solid",
  boxShadow:
    "0 10px 28px color-mix(in srgb, var(--color-welcome-gold) 12%, transparent), inset 0 1px 0 rgb(255 250 244 / 70%)",
} as const

const QR_FG = "#5E5144"

function OutsideDivider() {
  return (
    <div className="flex items-center justify-center gap-1.5">
      <span
        className="h-px w-6 sm:w-10"
        style={{
          background: "linear-gradient(to right, transparent, rgba(255, 255, 255, 0.55), transparent)",
        }}
      />
      <span className="h-0.5 w-0.5 rounded-full bg-white/50 sm:h-1 sm:w-1" aria-hidden />
      <span
        className="h-px w-6 sm:w-10"
        style={{
          background: "linear-gradient(to left, transparent, rgba(255, 255, 255, 0.55), transparent)",
        }}
      />
    </div>
  )
}

function InsideDivider() {
  return (
    <div className="flex items-center justify-center gap-1.5">
      <span className="h-px w-6 sm:w-10" style={goldDividerStyle} />
      <span className="h-0.5 w-0.5 rounded-full sm:h-1 sm:w-1" style={{ background: GOLD }} aria-hidden />
      <span className="h-px w-6 sm:w-10" style={goldDividerStyleLeft} />
    </div>
  )
}

function SnapShareTitle() {
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
          color: OUTSIDE_TEXT,
          textShadow: OUTSIDE_TITLE_SHADOW,
        }}
      >
        Snap and Share
      </span>
      <span
        aria-hidden
        className={`${aboveTheBeyond.className} mx-auto block w-fit max-w-full px-1 leading-[0.88] sm:leading-[0.9] mt-2 sm:mt-2.5 md:mt-3`}
        style={{
          fontSize: "var(--script-size)",
          color: OUTSIDE_TEXT_MUTED,
          textShadow: OUTSIDE_TITLE_SHADOW,
        }}
      >
        Share your memories
      </span>
      <span className="sr-only">Share your memories</span>
    </h2>
  )
}

function ContentCard({
  children,
  className = "",
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-xl border backdrop-blur-xl sm:rounded-2xl sm:backdrop-blur-2xl ${className}`}
      style={cardStyle}
    >
      <div
        className="pointer-events-none absolute inset-0 rounded-[inherit] bg-gradient-to-br from-white/35 via-white/8 to-transparent"
        aria-hidden
      />
      <div className="relative z-20 flex flex-col gap-3 px-4 py-5 sm:gap-4 sm:px-5 sm:py-6 md:px-6 md:py-7">
        {children}
      </div>
    </div>
  )
}

function PrimaryButton({
  onClick,
  children,
  className = "",
  active = false,
}: {
  onClick?: () => void
  children: React.ReactNode
  className?: string
  active?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`${cinzel.className} group relative inline-flex items-center justify-center gap-1.5 rounded-sm border px-5 py-2.5 font-semibold uppercase tracking-[0.18em] shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 sm:px-6 sm:py-3 sm:tracking-[0.2em] md:tracking-[0.24em] ${ct.btn} ${className}`}
      style={
        active
          ? {
              backgroundColor: NAVY,
              borderColor: GOLD_BORDER,
              color: IVORY,
            }
          : {
              background: NAV_GOLD,
              borderColor: GOLD_BORDER,
              color: IVORY,
              boxShadow:
                "0 8px 18px color-mix(in srgb, var(--color-welcome-gold) 22%, transparent)",
            }
      }
      onMouseEnter={(e) => {
        if (active) return
        e.currentTarget.style.background = NAVY
        e.currentTarget.style.borderColor = GOLD_BORDER
      }}
      onMouseLeave={(e) => {
        if (active) return
        e.currentTarget.style.background = NAV_GOLD
        e.currentTarget.style.borderColor = GOLD_BORDER
      }}
    >
      {children}
    </button>
  )
}

export function SnapShare() {
  const siteConfig = useSiteConfig()
  const [copiedHashtagIndex, setCopiedHashtagIndex] = useState<number | null>(null)
  const [copiedAllHashtags, setCopiedAllHashtags] = useState(false)
  const [copiedDriveLink, setCopiedDriveLink] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  const { groomNickname, brideNickname } = siteConfig.couple
  const coupleDisplayName = `${groomNickname} & ${brideNickname}`
  const websiteUrl = typeof window !== "undefined" ? window.location.href : "https://example.com"
  const uploadLink = siteConfig.snapShare.googleDriveLink
  const hashtags = siteConfig.snapShare.hashtag
  const allHashtagsText = hashtags.join(" ")
  const sanitizedGroomName = groomNickname.replace(/\s+/g, "")
  const sanitizedBrideName = brideNickname.replace(/\s+/g, "")

  const shareText = `Celebrate ${coupleDisplayName}'s wedding! Explore the details and share your special memories: ${websiteUrl} ${allHashtagsText}`

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640)
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const shareOnSocial = (platform: "instagram" | "facebook" | "twitter" | "tiktok") => {
    const encodedUrl = encodeURIComponent(websiteUrl)
    const encodedText = encodeURIComponent(shareText)

    const urls: Record<string, string> = {
      instagram: "https://www.instagram.com/",
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodedText}`,
      tiktok: "https://www.tiktok.com/",
    }

    const target = urls[platform]
    if (target) window.open(target, "_blank", "width=600,height=400")
  }

  const downloadQRCode = () => {
    const canvas = document.getElementById("snapshare-qr") as HTMLCanvasElement | null
    if (!canvas) return
    const link = document.createElement("a")
    link.download = `${sanitizedGroomName.toLowerCase()}-${sanitizedBrideName.toLowerCase()}-wedding-qr.png`
    link.href = canvas.toDataURL("image/png")
    link.click()
  }

  const downloadAlbumQRCode = () => {
    const canvas = document.getElementById("album-qr") as HTMLCanvasElement | null
    if (!canvas) return
    const link = document.createElement("a")
    link.download = "album-qr.png"
    link.href = canvas.toDataURL("image/png")
    link.click()
  }

  const copyHashtag = async (hashtag: string, index: number) => {
    try {
      await navigator.clipboard.writeText(hashtag)
      setCopiedHashtagIndex(index)
      setTimeout(() => setCopiedHashtagIndex(null), 2000)
    } catch (err) {
      console.error("Failed to copy: ", err)
    }
  }

  const copyAllHashtags = async () => {
    try {
      await navigator.clipboard.writeText(allHashtagsText)
      setCopiedAllHashtags(true)
      setTimeout(() => setCopiedAllHashtags(false), 2000)
    } catch (err) {
      console.error("Failed to copy: ", err)
    }
  }

  const copyUploadLink = async () => {
    if (!uploadLink) return
    try {
      await navigator.clipboard.writeText(uploadLink)
      setCopiedDriveLink(true)
      setTimeout(() => setCopiedDriveLink(false), 2000)
    } catch (err) {
      console.error("Failed to copy: ", err)
    }
  }

  return (
    <section
      id="snap-share"
      className={`${theSeasons.variable} ${aboveTheBeyond.variable} relative z-10 bg-transparent pt-8 pb-8 sm:pt-10 sm:pb-10 md:pt-12 md:pb-12 lg:pt-14 lg:pb-14`}
    >
      <div className="relative z-20 mx-auto max-w-6xl px-4 @container/snap-share sm:px-6 md:px-8">
        <div className="relative z-20 px-6 text-center sm:px-10 md:px-12">
          <div className="mx-auto mb-5 sm:mb-6 md:mb-7">
            <OutsideDivider />
          </div>
          <div className="mx-auto mt-2 sm:mt-3 md:mt-4">
            <SnapShareTitle />
          </div>
          <p
            className={`font-goudy-italic mx-auto mt-4 max-w-2xl px-2 sm:mt-5 md:mt-6 ${ct.bodyLg}`}
            style={{ color: OUTSIDE_TEXT_MUTED, textShadow: READABLE_SHADOW }}
          >
            Help us remember the little moments of {coupleDisplayName}&apos;s day — every smile,
            embrace, and candid laugh. Your photos and clips complete our love story.
          </p>
          <div className="flex items-center justify-center pt-3 sm:pt-4">
            <span className="h-px w-16 sm:w-24 md:w-32 bg-white/50" />
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 items-start gap-5 sm:mt-8 sm:gap-6 lg:grid-cols-2 lg:gap-8 md:mt-10">
          <ContentCard className="lg:order-1">
            <h4
              className={`${cinzel.className} ${ct.cardTitle} text-center font-semibold uppercase tracking-[0.08em]`}
              style={{ color: palette.heading }}
            >
              Our Favorite Moments
            </h4>
            <div className="grid w-full min-w-0 grid-cols-2 gap-2 sm:gap-3">
              <div className="relative aspect-[2/3] overflow-hidden rounded-xl border shadow-sm" style={{ borderColor: GOLD_BORDER_SOFT }}>
                <Image
                  src="/mobile-background/couples (31).webp"
                  alt="Wedding moment 1"
                  fill
                  className="object-cover"
                  style={{ imageOrientation: "from-image" }}
                />
              </div>
              <div className="relative aspect-[2/3] overflow-hidden rounded-xl border shadow-sm" style={{ borderColor: GOLD_BORDER_SOFT }}>
                <Image
                  src="/mobile-background/couples (73).webp"
                  alt="Wedding moment 2"
                  fill
                  className="object-cover"
                  style={{ imageOrientation: "from-image" }}
                />
              </div>
              <div className="relative col-span-2 aspect-[3/2] overflow-hidden rounded-xl border shadow-sm" style={{ borderColor: GOLD_BORDER_SOFT }}>
                <Image
                  src="/desktop-background/couples (23).webp"
                  alt="Wedding moment 3"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            <p
              className={`font-goudy-italic ${ct.body} text-center`}
              style={{ color: palette.body }}
            >
              Share your snapshots to be featured in our keepsake gallery.
            </p>
          </ContentCard>

          <div className="w-full min-w-0 space-y-5 sm:space-y-6 lg:order-2">
           <ContentCard>
              <h4
                className={`${cinzel.className} ${ct.cardTitle} text-center font-semibold uppercase tracking-[0.08em]`}
                style={{ color: palette.heading }}
              >
                Share Our Wedding Website
              </h4>
              <p
                className={`font-goudy-italic ${ct.body} text-center`}
                style={{ color: palette.body }}
              >
                Spread the word about {coupleDisplayName}&apos;s celebration. Share this QR code so
                friends and family can join us.
              </p>
              <div className="mx-auto flex w-full max-w-[240px] flex-col items-center rounded-xl border p-3 shadow-sm sm:p-4" style={{ borderColor: GOLD_BORDER_SOFT, backgroundColor: IVORY }}>
                <div className="flex w-full max-w-full justify-center overflow-visible">
                  <QRCodeCanvas
                    id="snapshare-qr"
                    value={websiteUrl}
                    size={isMobile ? 160 : 200}
                    includeMargin
                    className="h-auto max-w-full bg-white"
                    fgColor={QR_FG}
                  />
                </div>
              </div>
              <div className="flex justify-center">
                <PrimaryButton onClick={downloadQRCode}>
                  <Download className="h-3.5 w-3.5 flex-shrink-0 sm:h-4 sm:w-4" />
                  Download QR
                </PrimaryButton>
              </div>
              <p
                className={`font-goudy-italic ${ct.body} text-center`}
                style={{ color: palette.body }}
              >
                Scan with any camera app to open the full invitation and schedule.
              </p>
            </ContentCard> 

            <ContentCard>
              <h5
                className={`${cinzel.className} ${ct.body} text-center font-semibold uppercase tracking-[0.1em]`}
                style={{ color: palette.heading }}
              >
                Wedding Hashtags
              </h5>
              <div className="w-full min-w-0 space-y-2">
                {hashtags.map((hashtag, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => copyHashtag(hashtag, index)}
                    className="flex w-full min-w-0 items-center justify-between gap-2 rounded-lg border px-3 py-2.5 transition-all duration-200 active:scale-[0.98]"
                    style={
                      copiedHashtagIndex === index
                        ? {
                            borderColor: GOLD_BORDER,
                            backgroundColor: "color-mix(in srgb, var(--color-welcome-gold) 12%, white)",
                          }
                        : {
                            borderColor: GOLD_BORDER_SOFT,
                            backgroundColor: IVORY,
                          }
                    }
                  >
                    <span
                      className={`font-goudy-italic ${ct.body} min-w-0 flex-1 break-all text-left font-semibold`}
                      style={{
                        color: copiedHashtagIndex === index ? palette.accent : palette.body,
                      }}
                    >
                      {hashtag}
                    </span>
                    <span
                      className={`${cinzel.className} flex flex-shrink-0 items-center gap-1 whitespace-nowrap ${sectionType.label} font-semibold uppercase tracking-wider`}
                      style={{
                        color: copiedHashtagIndex === index ? palette.accent : palette.label,
                      }}
                    >
                      {copiedHashtagIndex === index ? (
                        <>
                          <Check className="h-3 w-3" /> Copied
                        </>
                      ) : (
                        <>
                          <Copy className="h-3 w-3" /> Copy
                        </>
                      )}
                    </span>
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={copyAllHashtags}
                className="flex w-full items-center justify-center gap-1.5 rounded-lg border py-2.5 transition-all duration-200 active:scale-[0.98]"
                style={
                  copiedAllHashtags
                    ? {
                        borderColor: GOLD_BORDER,
                        backgroundColor: "color-mix(in srgb, var(--color-welcome-gold) 12%, white)",
                        color: GOLD,
                      }
                    : {
                        borderColor: GOLD_BORDER,
                        backgroundColor: IVORY,
                        color: NAVY,
                      }
                }
              >
                {copiedAllHashtags ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                <span className={`${cinzel.className} ${ct.btn} font-semibold uppercase tracking-[0.1em]`}>
                  {copiedAllHashtags ? "All Copied!" : "Copy All"}
                </span>
              </button>
            </ContentCard> 

            <ContentCard>
              <h5
                className={`${cinzel.className} ${ct.cardTitle} text-center font-semibold uppercase tracking-[0.08em]`}
                style={{ color: palette.heading }}
              >
                Share on Social Media
              </h5>
              <p
                className={`font-goudy-italic ${ct.body} text-center`}
                style={{ color: palette.body }}
              >
                Help spread the word about {coupleDisplayName}&apos;s wedding across your favorite
                platforms.
              </p>
              <div className="grid w-full min-w-0 grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-3">
                {(
                  [
                    { platform: "instagram" as const, Icon: Instagram, label: "Instagram" },
                    { platform: "facebook" as const, Icon: Facebook, label: "Facebook" },
                    { platform: "tiktok" as const, Icon: Share2, label: "TikTok" },
                    { platform: "twitter" as const, Icon: Twitter, label: "Twitter" },
                  ] as const
                ).map(({ platform, Icon, label }) => (
                  <button
                    key={platform}
                    type="button"
                    onClick={() => shareOnSocial(platform)}
                    className="group flex w-full min-w-0 items-center justify-center gap-2 rounded-lg border px-3 py-3 shadow-sm transition-all duration-200 hover:shadow-md"
                    style={{
                      borderColor: GOLD_BORDER_SOFT,
                      backgroundColor: IVORY,
                    }}
                  >
                    <Icon className="h-4 w-4 flex-shrink-0 sm:h-5 sm:w-5" style={{ color: palette.accent }} />
                    <span
                      className={`${cinzel.className} ${ct.btn} truncate font-semibold uppercase tracking-[0.08em]`}
                      style={{ color: palette.heading }}
                    >
                      {label}
                    </span>
                  </button>
                ))}
              </div>
            </ContentCard> 

            {uploadLink && (
              <ContentCard>
                <p
                  className={`${cinzel.className} ${ct.label} w-full rounded-full border px-3 py-1.5 text-center uppercase leading-snug tracking-[0.14em] sm:tracking-[0.18em] break-words`}
                  style={{
                    color: palette.label,
                    borderColor: GOLD_BORDER,
                    backgroundColor: "color-mix(in srgb, var(--color-welcome-gold) 12%, white)",
                  }}
                >
                  Upload Your Photos &amp; Videos
                </p>
                <p
                  className={`font-goudy-italic ${ct.body} break-words text-center`}
                  style={{ color: palette.body }}
                >
                  {siteConfig.snapShare.instructions}
                </p>
                <div className="mx-auto flex w-full max-w-[240px] flex-col items-center rounded-xl border p-3 shadow-sm sm:p-4" style={{ borderColor: GOLD_BORDER_SOFT, backgroundColor: IVORY }}>
                  <div className="flex w-full max-w-full justify-center overflow-visible">
                    <QRCodeCanvas
                      id="album-qr"
                      value={uploadLink}
                      size={isMobile ? 160 : 200}
                      level="H"
                      includeMargin
                      className="h-auto max-w-full bg-white"
                      fgColor={QR_FG}
                    />
                  </div>
                  <p
                    className={`font-goudy-italic ${ct.body} mt-2 text-center sm:mt-3`}
                    style={{ color: palette.label }}
                  >
                    Scan with your camera app
                  </p>
                </div>
                <div className="mx-auto flex items-center justify-center pt-1 sm:pt-2">
                  <InsideDivider />
                </div>
                <div className="flex w-full flex-col justify-center gap-2 sm:flex-row sm:flex-wrap sm:gap-3">
                  <PrimaryButton onClick={copyUploadLink} active={copiedDriveLink}>
                    {copiedDriveLink ? (
                      <Check className="h-3.5 w-3.5 flex-shrink-0 sm:h-4 sm:w-4" />
                    ) : (
                      <Copy className="h-3.5 w-3.5 flex-shrink-0 sm:h-4 sm:w-4" />
                    )}
                    {copiedDriveLink ? "Copied!" : "Copy Link"}
                  </PrimaryButton>
                  <PrimaryButton onClick={downloadAlbumQRCode}>
                    <Download className="h-3.5 w-3.5 flex-shrink-0 sm:h-4 sm:w-4" />
                    Download QR
                  </PrimaryButton>
                  <a
                    href={uploadLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${cinzel.className} group relative inline-flex items-center justify-center gap-1.5 rounded-sm border px-5 py-2.5 font-semibold uppercase tracking-[0.18em] shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 sm:px-6 sm:py-3 sm:tracking-[0.2em] md:tracking-[0.24em] ${ct.btn}`}
                    style={{
                      backgroundColor: IVORY,
                      borderColor: GOLD_BORDER,
                      color: NAVY,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = NAV_GOLD
                      e.currentTarget.style.borderColor = GOLD_BORDER
                      e.currentTarget.style.color = IVORY
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = IVORY
                      e.currentTarget.style.borderColor = GOLD_BORDER
                      e.currentTarget.style.color = NAVY
                    }}
                  >
                    <Share2 className="h-3.5 w-3.5 flex-shrink-0 sm:h-4 sm:w-4" />
                    Upload Photos
                  </a>
                </div>
              </ContentCard>
            )}
          </div>
        </div>

        <div className="mt-6 space-y-2 text-center sm:mt-8 md:mt-10">
          <p
            className={`font-goudy-italic ${ct.bodyLg}`}
            style={{ color: OUTSIDE_TEXT_MUTED, textShadow: READABLE_SHADOW }}
          >
            Thank you for helping make {coupleDisplayName}&apos;s wedding celebration memorable.
            Your photos and messages create beautiful memories we will treasure for a lifetime.
          </p>
          <p
            className={`${cinzel.className} ${ct.label} uppercase tracking-[0.18em] sm:tracking-[0.2em]`}
            style={{ color: OUTSIDE_TEXT, textShadow: READABLE_SHADOW }}
          >
            Thank you for sharing the joy
          </p>
        </div>
      </div>
    </section>
  )
}