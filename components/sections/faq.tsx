"use client"

import { useMemo, useState, type CSSProperties, type ReactNode } from "react"
import type { SiteConfig } from "@/lib/site-config"
import { ChevronDown } from "lucide-react"
import { Cinzel } from "next/font/google"
import localFont from "next/font/local"
import { useSiteConfig } from "@/hooks/use-site-config"
import { layeredSectionTitleSize, sectionType } from "@/lib/section-typography"
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
const GOLD_BORDER = "color-mix(in srgb, var(--color-welcome-gold) 38%, transparent)"
const GOLD_BORDER_SOFT = "color-mix(in srgb, var(--color-welcome-gold) 22%, transparent)"

const goldDividerStyle = {
  background: "linear-gradient(to right, transparent, var(--color-welcome-gold), transparent)",
} as const

const goldDividerStyleLeft = {
  background: "linear-gradient(to left, transparent, var(--color-welcome-gold), transparent)",
} as const

const CORNER_DECO_CLASS =
  "block h-auto w-auto max-w-[120px] sm:max-w-[180px] md:max-w-[260px] lg:max-w-[320px] xl:max-w-[380px] select-none"

const ct = {
  label: sectionType.label,
  body: sectionType.textRelaxed,
  bodyLg: sectionType.textRelaxed,
  question: sectionType.text,
} as const

const linkClass =
  "underline font-semibold transition-colors hover:opacity-80"

const cardStyle = {
  background: IVORY,
  borderColor: GOLD_BORDER,
  borderWidth: "1px",
  borderStyle: "solid",
  boxShadow:
    "0 10px 28px color-mix(in srgb, var(--color-welcome-gold) 12%, transparent), inset 0 1px 0 rgb(255 250 244 / 70%)",
} as const

interface FAQItem {
  question: string
  answer: string | ReactNode
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

function FaqTitle() {
  return (
    <h2
      className="welcome-title-lockup relative mx-auto w-full max-w-full text-center"
      style={
        {
          "--title-size": layeredSectionTitleSize.main,
          "--script-size": layeredSectionTitleSize.script,
          "--script-overlap": layeredSectionTitleSize.overlap,
        } as CSSProperties
      }
    >
      <span className="sr-only">Frequently Asked Questions — everything you need to know</span>
      <span
        aria-hidden
        className={`${theSeasons.className} block uppercase leading-[0.76] tracking-[0.04em] min-[400px]:tracking-[0.08em] sm:tracking-[0.12em] md:tracking-[0.14em]`}
        style={{
          fontSize: "var(--title-size)",
          color: NAVY,
        }}
      >
        Frequently Asked Questions
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
        everything you need to know
      </span>
    </h2>
  )
}

function getFaqItems(siteConfig: SiteConfig): FAQItem[] {
  const guestArrival = siteConfig.ceremony.guestsTime ?? "9:00 AM"
  const rsvpPhone = siteConfig.details.rsvp.phone.trim()
  const showRsvpPhone =
    rsvpPhone.length > 0 && !/to be announced/i.test(rsvpPhone)

  return [
    {
      question: "When is the wedding?",
      answer: `Our wedding will be held on ${siteConfig.ceremony.date}, ${siteConfig.ceremony.day}. The ceremony begins at ${siteConfig.ceremony.time}, and the reception follows at ${siteConfig.reception.time}.`,
    },
    {
      question: "What time should I arrive for the ceremony?",
      answer: `Please arrive by ${guestArrival} so you have time to find your seat and settle in. The ceremony will begin promptly at ${siteConfig.ceremony.time}. Entourage members are requested to assemble at ${siteConfig.ceremony.entourageTime}.`,
    },
    {
      question: "Where will the ceremony take place?",
      answer: (
        <>
          Our ceremony will be held at {siteConfig.ceremony.location}, {siteConfig.ceremony.venue}.{" "}
          <a
            href={siteConfig.ceremony.map}
            target="_blank"
            rel="noopener noreferrer"
            className={linkClass}
            style={{ color: GOLD }}
          >
            Open in Google Maps
          </a>
          .
        </>
      ),
    },
    {
      question: "Where will the reception be held?",
      answer: (
        <>
          The reception will be at {siteConfig.reception.location}, {siteConfig.reception.venue},
          beginning at {siteConfig.reception.time}.{" "}
          <a
            href={siteConfig.reception.map}
            target="_blank"
            rel="noopener noreferrer"
            className={linkClass}
            style={{ color: GOLD }}
          >
            Open in Google Maps
          </a>
          .
        </>
      ),
    },
    {
      question: "Is there a recommended hotel?",
      answer: (
        <>
          Yes. We recommend Microtel by Wyndham South Forbes near Nuvali, a short drive from both
          the ceremony and reception. Please see the{" "}
          <a
            href="#hotel"
            className={linkClass}
            style={{ color: GOLD }}
            onClick={(e) => {
              e.preventDefault()
              document.getElementById("hotel")?.scrollIntoView({ behavior: "smooth" })
            }}
          >
            Recommended Hotel
          </a>{" "}
          section for the map, or{" "}
          <a
            href="https://maps.app.goo.gl/qPai4AGyx3uyMBXX6?g_st=ifm"
            target="_blank"
            rel="noopener noreferrer"
            className={linkClass}
            style={{ color: GOLD }}
          >
            open in Google Maps
          </a>
          .
        </>
      ),
    },
    {
      question: "How do I RSVP?",
      answer: (
        <>
          Please RSVP using the{" "}
          <a
            href="#guest-list"
            className={linkClass}
            style={{ color: GOLD }}
            onClick={(e) => {
              e.preventDefault()
              document.getElementById("guest-list")?.scrollIntoView({ behavior: "smooth" })
            }}
          >
            guest list
          </a>{" "}
          on this invitation: search for your name and confirm your attendance.
          {"\n\n"}
          Please respond by {siteConfig.details.rsvp.deadline.replace(/\.\s*$/, "")}.
          {showRsvpPhone
            ? `\n\nIf you have questions, please contact ${siteConfig.details.rsvp.coordinator} at ${rsvpPhone}.`
            : `\n\nIf you have questions, please contact ${siteConfig.details.rsvp.coordinator}.`}
        </>
      ),
    },
    {
      question: 'Do we really need to RSVP? We already said "Yes" to the couple.',
      answer:
        "Yes, please. We will be needing your formal RSVP to consolidate guest details and finalize the headcount for catering and seating purposes.",
    },
    {
      question: "Can I sit anywhere at the reception?",
      answer:
        "Please don't. It took us a lot of effort and discussion to finish the seating arrangement, which is planned for everyone's convenience and preference.",
    },
    {
      question: 'Can I bring a "Plus One" to the event?',
      answer:
        "As much as we would love to accommodate all our friends and family, we have a limited number of guests. Please understand that this event is strictly by invitation only.",
    },
    {
      question: "Can I bring my child to the event?",
      answer:
        "If your invitation includes your child or children, they are warmly welcome to celebrate with us. Please RSVP with the correct number of guests in your party so we can prepare accordingly.",
    },
    {
      question:
        'I said "No" to the RSVP but I had a change of plans—I can attend now! What should I do?',
      answer:
        "Please check with us first as we have a strict guest list. If seats become available, we will let you know as soon as possible. Please do not attend unannounced, as we may not have any available seats for you.",
    },
    {
      question: "What if I RSVP'd but cannot attend?",
      answer:
        "We would love to have you at our wedding, but we understand that there are circumstances beyond our control. However, please let us know as soon as possible so we can reallocate your seat/s.",
    },
    {
      question: "Is there parking available?",
      answer:
        "Yes, parking is available at both the ceremony and reception venues. Please arrive a little early so you have time to park comfortably.",
    },
    {
      question: "What is the dress code?",
      answer:
        "Our theme is Whimsical Spring Minimalist. Entourage: women, a flowy spring sage green dress, strictly floor length; gentlemen, a black and white suit, a white and gray suit, or sage green long sleeves with gray or brown pants — kindly no rubber shoes. Guests: casual attire, Whimsical Spring.",
    },
    {
      question: "Will the ceremony be unplugged?",
      answer:
        "Yes. Your presence at our wedding is the greatest gift of all. As we say \"I do,\" we kindly ask that you refrain from taking photos or videos during the ceremony and keep all devices tucked away. Be fully present, share in our joy, and leave the capturing of memories to our professional photographers.",
    },
    {
      question: "Can I take photos or videos during the reception?",
      answer:
        "Yes. We would love for you to capture the joy throughout the reception. We prepared this celebration wholeheartedly and we want everyone to enjoy it fully.",
    },
    {
      question: "When is the appropriate time to leave?",
      answer:
        "It took us some time to plan a heartfelt wedding that everyone would hopefully enjoy. We humbly request that you celebrate with us until the program ends. Let's laugh, take pictures, and have fun!",
    },
    {
      question: "What if I have dietary restrictions or allergies?",
      answer:
        "Please let us know about any dietary restrictions or allergies when you RSVP. We want to ensure everyone can enjoy the celebration comfortably.",
    },
    {
      question: "How can I help the couple have a great time during their wedding?",
      answer:
        "• Pray with us for favorable weather and the continuous blessings of our Lord as we enter this new chapter of our lives as husband and wife.\n\n• RSVP as soon as your schedule is cleared.\n\n• Dress according to the attire guide and color palette.\n\n• Arrive on time.\n\n• Follow the seating arrangement at the reception.\n\n• Stay until the end of the program.\n\n• Join the activities and enjoy!",
    },
  ]
}

function FaqAnswer({ answer }: { answer: string | ReactNode }) {
  if (typeof answer !== "string") {
    return (
      <div
        className={`font-goudy-italic ${ct.body} whitespace-pre-line`}
        style={{ color: BODY }}
      >
        {answer}
      </div>
    )
  }

  return (
    <p
      className={`font-goudy-italic ${ct.body} whitespace-pre-line`}
      style={{ color: BODY }}
    >
      {answer}
    </p>
  )
}

export function FAQ() {
  const siteConfig = useSiteConfig()
  const faqItems = useMemo(() => getFaqItems(siteConfig), [siteConfig])
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <div
      className={`${theSeasons.variable} ${aboveTheBeyond.variable} relative w-full`}
      style={{ background: sectionBackground }}
    >
      <section
        id="faq"
        className="relative z-10 overflow-hidden pt-8 pb-8 sm:pt-10 sm:pb-10 md:pt-12 md:pb-12 lg:pt-14 lg:pb-14"
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

        <div className="relative z-20 mx-auto mb-8 max-w-5xl px-3 text-center @container/faq sm:mb-10 sm:px-4 md:mb-12">
          <div className="mx-auto mb-4 sm:mb-5 md:mb-6">
            <OutsideDivider />
          </div>
          <p
            className={`${cinzel.className} mx-auto mt-4 max-w-[20rem] px-2 text-[0.6875rem] font-semibold leading-snug tracking-[0.12em] min-[400px]:max-w-none min-[400px]:text-[0.75rem] min-[400px]:tracking-[0.16em] sm:mt-6 sm:text-[0.9375rem] sm:tracking-[0.2em] md:text-base md:tracking-[0.22em]`}
            style={{ color: GOLD }}
          >
            A Few Notes
          </p>
          <div className="mx-auto mt-3 sm:mt-4 md:mt-5">
            <FaqTitle />
          </div>
          <p
            className={`font-goudy-italic mx-auto mt-4 max-w-xl px-2 sm:mt-5 md:mt-6 ${ct.bodyLg}`}
            style={{ color: BODY }}
          >
            Helpful notes so you can simply arrive, celebrate, and enjoy this new chapter with us.
          </p>
          <div className="mt-4 flex items-center justify-center sm:mt-5">
            <span className="h-px w-16 sm:w-24 md:w-32" style={goldDividerStyle} />
          </div>
        </div>

        <div className="relative z-20 mx-auto max-w-3xl px-4 pb-8 sm:px-6 md:px-8 md:pb-12">
          <div
            className="relative overflow-hidden rounded-xl border sm:rounded-2xl"
            style={cardStyle}
          >
            <div className="relative z-20 space-y-2 p-3 sm:space-y-2.5 sm:p-4 md:p-5">
              {faqItems.map((item, index) => {
                const isOpen = openIndex === index
                const contentId = `faq-item-${index}`
                return (
                  <div
                    key={index}
                    className="relative z-20 rounded-xl border transition-all duration-300"
                    style={{
                      borderColor: isOpen ? GOLD_BORDER : GOLD_BORDER_SOFT,
                      backgroundColor: isOpen
                        ? "color-mix(in srgb, var(--color-welcome-gold) 10%, #fffaf4)"
                        : "color-mix(in srgb, var(--color-welcome-gold) 4%, #fffaf4)",
                      boxShadow: isOpen
                        ? "0 8px 20px color-mix(in srgb, var(--color-welcome-gold) 14%, transparent)"
                        : "none",
                    }}
                  >
                    <button
                      onClick={() => toggleItem(index)}
                      className="group flex w-full items-center justify-between px-3 py-2.5 text-left outline-none transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 sm:px-4 sm:py-3 md:px-5"
                      style={{ outlineColor: GOLD }}
                      aria-expanded={isOpen}
                      aria-controls={contentId}
                    >
                      <span
                        className={`${cinzel.className} ${ct.question} pr-3 font-semibold leading-snug transition-colors duration-200`}
                        style={{ color: isOpen ? GOLD : NAVY }}
                      >
                        {item.question}
                      </span>
                      <ChevronDown
                        size={18}
                        className={`h-4 w-4 flex-shrink-0 transition-transform duration-300 sm:h-5 sm:w-5 ${isOpen ? "rotate-180" : ""}`}
                        style={{ color: GOLD }}
                        aria-hidden
                      />
                    </button>

                    <div
                      id={contentId}
                      role="region"
                      className={`grid transition-all duration-300 ease-out ${
                        isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                      }`}
                    >
                      <div className="overflow-hidden">
                        <div
                          className="border-t px-3 pb-3 pt-0 sm:px-4 sm:pb-4 md:px-5"
                          style={{ borderColor: GOLD_BORDER_SOFT }}
                        >
                          <FaqAnswer answer={item.answer} />
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
