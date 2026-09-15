"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useEffect, useRef, useState } from "react"
import { Cinzel } from "next/font/google"
import { sectionType } from "@/lib/section-typography"

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
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

const messageCardStyle = {
  background: IVORY,
  borderWidth: "1px",
  borderStyle: "solid",
  borderColor: "color-mix(in srgb, var(--color-welcome-gold) 38%, transparent)",
  boxShadow:
    "0 10px 28px color-mix(in srgb, var(--color-welcome-gold) 12%, transparent), inset 0 1px 0 rgb(255 250 244 / 70%)",
} as const

const skeletonBg = "color-mix(in srgb, var(--color-welcome-gold) 22%, white)"

interface Message {
  timestamp: string
  name: string
  message: string
}

interface MessageWallDisplayProps {
  messages: Message[]
  loading: boolean
  freshKey?: string | null
}

function messageKey(msg: Message) {
  return `${msg.name.trim().toLowerCase()}|${msg.message.trim().toLowerCase()}`
}

export default function MessageWallDisplay({ messages, loading, freshKey = null }: MessageWallDisplayProps) {
  const seenKeys = useRef(new Set<string>())
  const initialized = useRef(false)
  const [newKeys, setNewKeys] = useState<Set<string>>(new Set())

  useEffect(() => {
    const keys = messages.map((msg) => messageKey(msg))

    if (!initialized.current) {
      keys.forEach((key) => seenKeys.current.add(key))
      initialized.current = messages.length > 0 || !loading
      return
    }

    const incoming = keys.filter((key) => !seenKeys.current.has(key))
    if (incoming.length === 0) return

    incoming.forEach((key) => seenKeys.current.add(key))
    setNewKeys(new Set(incoming))
    const timer = window.setTimeout(() => setNewKeys(new Set()), 900)
    return () => window.clearTimeout(timer)
  }, [messages, loading])

  if (loading) {
    return (
      <div className="space-y-2 sm:space-y-3 md:space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="rounded-[1.35rem] border sm:rounded-[1.5rem]" style={messageCardStyle}>
            <CardContent className="p-3 sm:p-4 md:p-5">
              <div className="mb-3 flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <Skeleton className="h-8 w-8 rounded-full sm:h-9 sm:w-9" style={{ backgroundColor: skeletonBg }} />
                  <div className="space-y-2">
                    <Skeleton className="h-3 w-24 sm:w-32" style={{ backgroundColor: skeletonBg }} />
                    <Skeleton className="h-2.5 w-20" style={{ backgroundColor: skeletonBg }} />
                  </div>
                </div>
              </div>
              <Skeleton className="h-14 w-full rounded-lg sm:h-16" style={{ backgroundColor: skeletonBg }} />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (messages.length === 0) {
    return (
      <div
        className="rounded-[1.85rem] border px-4 py-8 text-center sm:py-12 md:py-16"
        style={messageCardStyle}
      >
        <h3
          className={`${cinzel.className} mb-2 font-semibold uppercase tracking-[0.16em] sm:mb-3 ${sectionType.subheader}`}
          style={{ color: NAVY }}
        >
          No messages yet
        </h3>
        <p
          className={`font-goudy-italic mx-auto mb-5 max-w-md sm:mb-6 ${sectionType.textRelaxed}`}
          style={{ color: BODY }}
        >
          Be the first to leave a note for the happy couple.
        </p>
        <div className="flex justify-center">
          <span
            className={`${cinzel.className} ${sectionType.label} rounded-full border px-4 py-2 font-semibold uppercase tracking-[0.16em]`}
            style={{
              color: GOLD,
              backgroundColor: IVORY,
              borderColor: "color-mix(in srgb, var(--color-welcome-gold) 38%, transparent)",
            }}
          >
            Your message will appear here
          </span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-2.5 sm:space-y-3 md:space-y-4">
      {messages.map((msg, index) => {
        const key = `${messageKey(msg)}-${index}`
        const isNew = Boolean(freshKey && messageKey(msg) === freshKey) || newKeys.has(messageKey(msg))
        return (
        <Card
          key={key}
          className={`group relative transform overflow-hidden rounded-[1.35rem] border transition-shadow duration-300 hover:scale-[1.01] sm:rounded-[1.5rem] ${
            isNew ? "animate-in fade-in slide-in-from-top-3 zoom-in-95 duration-300 fill-mode-both" : ""
          }`}
          style={{
            ...messageCardStyle,
            borderColor: isNew
              ? "color-mix(in srgb, var(--color-welcome-gold) 70%, transparent)"
              : messageCardStyle.borderColor,
            boxShadow: isNew
              ? "0 12px 28px color-mix(in srgb, var(--color-welcome-gold) 28%, transparent), inset 0 1px 0 rgb(255 250 244 / 70%)"
              : messageCardStyle.boxShadow,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow =
              "0 14px 32px color-mix(in srgb, var(--color-welcome-gold) 22%, transparent), inset 0 1px 0 rgb(255 250 244 / 70%)"
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = isNew
              ? "0 12px 28px color-mix(in srgb, var(--color-welcome-gold) 28%, transparent), inset 0 1px 0 rgb(255 250 244 / 70%)"
              : (messageCardStyle.boxShadow as string)
          }}
        >
          <div
            className="absolute left-0 top-0 h-0.5 w-full origin-left scale-x-0 transform transition-transform duration-500 group-hover:scale-x-100"
            style={{ background: NAV_GOLD }}
          />

          <CardContent className="relative p-3 sm:p-4 md:p-5">
            <div className="mb-2 flex items-start justify-between sm:mb-3">
              <div className="flex min-w-0 flex-1 items-center space-x-2 sm:space-x-3">
                <div
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full shadow-md transition-transform duration-300 group-hover:scale-110 sm:h-9 sm:w-9 md:h-10 md:w-10"
                  style={{
                    background: NAV_GOLD,
                    boxShadow: "0 6px 14px color-mix(in srgb, var(--color-welcome-gold) 28%, transparent)",
                  }}
                >
                  <span className={`${cinzel.className} ${sectionType.label} font-semibold`} style={{ color: IVORY }}>
                    {msg.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()
                      .slice(0, 2)}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <h4
                    className={`${cinzel.className} ${sectionType.text} truncate font-semibold tracking-[0.04em]`}
                    style={{ color: palette.heading }}
                  >
                    {msg.name}
                  </h4>
                  <span
                    className={`${cinzel.className} ${sectionType.label} uppercase tracking-[0.12em]`}
                    style={{ color: palette.label }}
                  >
                    {new Date(msg.timestamp).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            </div>

            <div className="relative py-1 pl-5 pr-2 sm:py-2 sm:pl-6 sm:pr-4">
              <span
                className="font-goudy-italic absolute left-0 top-0 select-none text-2xl leading-none sm:text-3xl"
                style={{ color: GOLD, opacity: 0.55 }}
              >
                &ldquo;
              </span>
              <p
                className={`font-goudy-italic relative z-10 italic ${sectionType.textRelaxed}`}
                style={{ color: palette.body }}
              >
                {msg.message}
              </p>
            </div>
          </CardContent>
        </Card>
        )
      })}
    </div>
  )
}
