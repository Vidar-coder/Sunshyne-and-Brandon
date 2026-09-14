"use client"

import { useRef, useState, useCallback, useEffect, type ReactNode } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import MessageWallDisplay from "./message-wall-display"
import { Cinzel } from "next/font/google"
import localFont from "next/font/local"
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

const IVORY = "#fffaf4"
const GOLD = "var(--color-welcome-gold)"
const NAVY = "var(--color-welcome-navy)"
const BODY = "var(--color-welcome-text)"
const NAV_GOLD =
  "linear-gradient(180deg, #E8D5A3 0%, #CDB072 52%, #C4A265 100%)"

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

const silkTitleShadow =
  "0 1px 0 rgb(42 34 28 / 42%), 0 2px 10px rgb(42 34 28 / 38%), 0 8px 28px rgb(42 34 28 / 28%)"
const silkScriptShadow =
  "0 1px 0 rgb(42 34 28 / 35%), 0 2px 12px rgb(42 34 28 / 32%), 0 0 18px rgb(232 213 163 / 35%)"
const silkBodyShadow =
  "0 1px 1px rgb(42 34 28 / 45%), 0 2px 10px rgb(42 34 28 / 32%)"

const silkGlowStyle = {
  background:
    "radial-gradient(ellipse at center, rgb(94 81 68 / 34%) 0%, rgb(94 81 68 / 12%) 46%, transparent 72%)",
} as const

function SilkTextGlow({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`relative ${className}`}>
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[140%] w-[min(100%,28rem)] -translate-x-1/2 -translate-y-1/2 blur-2xl"
        style={silkGlowStyle}
        aria-hidden
      />
      <div className="relative z-10">{children}</div>
    </div>
  )
}

const cardStyle = {
  background: IVORY,
  borderWidth: "1px",
  borderStyle: "solid",
  borderColor: "color-mix(in srgb, var(--color-welcome-gold) 38%, transparent)",
  boxShadow:
    "0 10px 28px color-mix(in srgb, var(--color-welcome-gold) 12%, transparent), inset 0 1px 0 rgb(255 250 244 / 70%)",
} as const

interface Message {
  timestamp: string
  name: string
  message: string
}

interface MessageFormProps {
  onSuccess?: () => void
  onMessageSent?: () => void
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

function MessagesTitle() {
  return (
    <h2
      className="welcome-title-lockup relative mx-auto w-full max-w-full text-center"
      style={
        {
          "--title-size": layeredSectionTitleSize.main,
          "--script-size": layeredSectionTitleSize.script,
          "--script-overlap": layeredSectionTitleSize.overlap,
        } as React.CSSProperties
      }
    >
      <span className="sr-only">Love Notes and Prayers — Share your love with us</span>
      <span
        aria-hidden
        className={`${theSeasons.className} block uppercase leading-[0.78] tracking-[0.04em] min-[400px]:tracking-[0.08em] sm:tracking-[0.12em] md:tracking-[0.14em]`}
        style={{
          fontSize: "var(--title-size)",
          color: IVORY,
          textShadow: silkTitleShadow,
        }}
      >
        Love Notes
      </span>
      <span
        aria-hidden
        className={`${aboveTheBeyond.className} relative z-10 mx-auto mt-[var(--script-overlap)] block w-fit max-w-full px-1 leading-[0.88] sm:leading-[0.9]`}
        style={{
          fontSize: "var(--script-size)",
          color: "#F3E6C0",
          textShadow: silkScriptShadow,
        }}
      >
        and prayers
      </span>
    </h2>
  )
}

function MessageForm({ onSuccess, onMessageSent }: MessageFormProps) {
  const siteConfig = useSiteConfig()
  const { brideNickname, groomNickname } = siteConfig.couple
  const coupleDisplayName = `${groomNickname} & ${brideNickname}`

  const formRef = useRef<HTMLFormElement>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const [nameValue, setNameValue] = useState("")
  const [messageValue, setMessageValue] = useState("")
  const [focusedField, setFocusedField] = useState<string | null>(null)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(e.currentTarget)
    const name = formData.get("name") as string
    const message = formData.get("message") as string

    const googleFormData = new FormData()
    googleFormData.append("entry.405401269", name)
    googleFormData.append("entry.893740636", message)

    try {
      await fetch(siteConfig.googleAPI.messageForm, {
        method: "POST",
        mode: "no-cors",
        body: googleFormData,
      })

      toast({
        title: "Message sent",
        description: "Thank you for your kind words.",
        duration: 3000,
      })

      setIsSubmitted(true)
      setNameValue("")
      setMessageValue("")
      formRef.current?.reset()

      setTimeout(() => setIsSubmitted(false), 1000)

      if (onSuccess) onSuccess()
      if (onMessageSent) onMessageSent()
    } catch {
      toast({
        title: "Unable to send message",
        description: "Please try again in a moment.",
        variant: "destructive",
        duration: 3000,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const inputBorder = (field: string) =>
    focusedField === field
      ? palette.accent
      : "color-mix(in srgb, var(--color-welcome-gold) 32%, transparent)"

  const inputClass = (field: string) =>
    `message-form-input w-full rounded-lg border bg-[#fffaf4] px-3 py-2 font-goudy-italic ${sectionType.text} transition-all duration-300 focus:ring-2 focus:ring-[color-mix(in_srgb,var(--color-welcome-gold)_28%,transparent)] sm:px-4 sm:py-2.5 md:py-3 ${
      focusedField === field ? "shadow-md" : ""
    }`

  return (
    <div className="relative mx-auto w-full max-w-md px-3 sm:px-0">
      <style>{`
        .message-form-input::placeholder,
        .message-form-textarea::placeholder {
          color: color-mix(in srgb, var(--color-welcome-text) 55%, transparent) !important;
          opacity: 1 !important;
        }
      `}</style>

      <Card
        className={`relative w-full overflow-hidden rounded-[1.85rem] border transition-all duration-500 ${
          isFocused ? "scale-[1.01]" : ""
        } ${isSubmitted ? "animate-bounce" : ""}`}
        style={cardStyle}
      >
        <div
          className="pointer-events-none absolute inset-0 rounded-[inherit] bg-gradient-to-br from-white/35 via-white/8 to-transparent"
          aria-hidden
        />

        {isSubmitted && (
          <div
            className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none"
            style={{ backgroundColor: IVORY }}
          >
            <p
              className={`${cinzel.className} font-semibold ${sectionType.subheader}`}
              style={{ color: palette.heading }}
            >
              Sent!
            </p>
          </div>
        )}

        <CardContent className="relative p-4 sm:p-5 md:p-6 lg:p-8">
          <div className="mb-4 text-center sm:mb-5 md:mb-6">
            <h3
              className={`${theSeasons.className} ${sectionType.subheader} mb-1.5 font-semibold tracking-[0.08em] uppercase`}
              style={{ color: NAVY }}
            >
              Share Your Love
            </h3>
            <p className={`font-goudy-italic ${sectionType.text}`} style={{ color: BODY }}>
              Leave a note for {coupleDisplayName} to read and keep.
            </p>
          </div>

          <form
            ref={formRef}
            onSubmit={handleSubmit}
            className="space-y-3 sm:space-y-4 md:space-y-5"
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          >
            <div className="space-y-1.5 sm:space-y-2">
              <label
                className={`${cinzel.className} ${sectionType.label} font-semibold uppercase tracking-[0.16em]`}
                style={{ color: GOLD }}
              >
                Your Name
              </label>
              <Input
                name="name"
                required
                value={nameValue}
                onChange={(e) => setNameValue(e.target.value)}
                onFocus={() => setFocusedField("name")}
                onBlur={() => setFocusedField(null)}
                placeholder="Full name"
                className={inputClass("name")}
                style={{
                  color: NAVY,
                  backgroundColor: IVORY,
                  borderColor: inputBorder("name"),
                }}
              />
            </div>

            <div className="space-y-1.5 sm:space-y-2">
              <div className="flex items-center justify-between gap-2">
                <label
                  className={`${cinzel.className} ${sectionType.label} font-semibold uppercase tracking-[0.16em]`}
                  style={{ color: GOLD }}
                >
                  Your Message
                </label>
                {messageValue && (
                  <span
                    className={`${sectionType.label} ${messageValue.length > 500 ? "text-red-500" : ""}`}
                    style={messageValue.length <= 500 ? { color: palette.accent } : undefined}
                  >
                    {messageValue.length}/500
                  </span>
                )}
              </div>
              <Textarea
                name="message"
                required
                value={messageValue}
                onChange={(e) => {
                  if (e.target.value.length <= 500) {
                    setMessageValue(e.target.value)
                  }
                }}
                onFocus={() => setFocusedField("message")}
                onBlur={() => setFocusedField(null)}
                placeholder={`Write your wishes, prayer, or kind words for ${coupleDisplayName}...`}
                className={`message-form-textarea ${inputClass("message")} min-h-[90px] resize-none placeholder:leading-relaxed sm:min-h-[110px] md:min-h-[130px]`}
                style={{
                  color: NAVY,
                  backgroundColor: IVORY,
                  borderColor: inputBorder("message"),
                }}
              />
            </div>

            <Button
              type="submit"
              disabled={isSubmitting || !nameValue.trim() || !messageValue.trim()}
              className={`${cinzel.className} group relative w-full rounded-full border px-5 py-2.5 ${sectionType.label} font-semibold uppercase tracking-[0.16em] shadow-[0_8px_18px_color-mix(in_srgb,var(--color-welcome-gold)_22%,transparent)] transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-70 disabled:transform-none sm:py-3 sm:tracking-[0.18em]`}
              style={{
                background: NAV_GOLD,
                borderColor: "transparent",
                color: IVORY,
              }}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="h-4 w-4 animate-spin sm:h-5 sm:w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Sending...
                </span>
              ) : (
                "Send Message"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export function Messages() {
  const siteConfig = useSiteConfig()
  const { brideNickname, groomNickname } = siteConfig.couple
  const coupleDisplayName = `${groomNickname} & ${brideNickname}`

  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)

  const fetchMessages = useCallback(() => {
    setLoading(true)
    fetch("/api/messages", {
      cache: "no-store",
      headers: { "Cache-Control": "no-cache" },
    })
      .then((res) => res.json())
      .then((data) => {
        if (!Array.isArray(data)) {
          setMessages([])
          setLoading(false)
          return
        }
        const parsed = data.filter((m) => m.name || m.message || m.timestamp).reverse()
        setMessages(parsed)
        setLoading(false)
      })
      .catch((error) => {
        console.error("Failed to fetch messages:", error)
        setLoading(false)
      })
  }, [])

  useEffect(() => {
    fetchMessages()
  }, [fetchMessages])

  return (
    <div
      className={`${theSeasons.variable} ${aboveTheBeyond.variable} relative w-full`}
    >
    <section
      id="messages"
      className="relative z-10 pt-8 pb-8 sm:pt-10 sm:pb-10 md:pt-12 md:pb-12 lg:pt-14 lg:pb-14"
    >
      <div className="relative z-10 mx-auto max-w-6xl px-3 @container/messages sm:px-4 md:px-6 lg:px-8">
        {/* Header — outside container */}
        <SilkTextGlow className="mb-6 text-center sm:mb-8 md:mb-10">
          <div className="mx-auto mb-5 sm:mb-6 md:mb-7">
            <OutsideDivider />
          </div>
          <div className="mx-auto mt-2 sm:mt-3 md:mt-4">
            <MessagesTitle />
          </div>
          <p
            className={`font-goudy-italic mx-auto mt-4 max-w-2xl px-2 sm:mt-5 md:mt-6 ${sectionType.textRelaxed}`}
            style={{ color: IVORY, textShadow: silkBodyShadow }}
          >
            Share a short note, wish, or prayer for {coupleDisplayName}. Every message becomes part of our story.
          </p>
          <div className="mt-4 flex items-center justify-center sm:mt-5">
            <span className="h-px w-16 sm:w-24 md:w-32" style={goldDividerStyle} />
          </div>
        </SilkTextGlow>

        {/* Form container */}
        <div className="mb-6 flex justify-center sm:mb-8 md:mb-10">
          <div className="relative w-full max-w-xl">
            <MessageForm onMessageSent={fetchMessages} />
          </div>
        </div>

     
         <div className="relative mx-auto max-w-4xl pb-2 sm:pb-3">
          <SilkTextGlow className="mb-4 text-center sm:mb-6 md:mb-8">
            <h3
              className={`${theSeasons.className} mb-1.5 font-semibold tracking-[0.08em] uppercase sm:mb-2 ${sectionType.subheader}`}
              style={{ color: IVORY, textShadow: silkTitleShadow }}
            >
              Messages from Loved Ones
            </h3>
            <p
              className={`font-goudy-italic ${sectionType.text}`}
              style={{ color: "#F3E6C0", textShadow: silkBodyShadow }}
            >
              Warm words from family and friends
            </p>
            <div className="mt-4 flex items-center justify-center sm:mt-5">
              <span className="h-px w-16 sm:w-24 md:w-32" style={goldDividerStyle} />
            </div>
          </SilkTextGlow>

          <MessageWallDisplay messages={messages} loading={loading} />
        </div> 
      </div>
    </section>
    </div>
  )
}
