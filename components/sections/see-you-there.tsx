"use client"

import { Cinzel } from "next/font/google"
import localFont from "next/font/local"
import Image from "next/image"
import { motion } from "motion/react"

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "500"],
})

const theSeasons = localFont({
  src: "../../Font/Fontspring-DEMO-theseasons-reg.otf",
  display: "swap",
  variable: "--font-the-seasons",
})

const IVORY = "#fffaf4"
const entryEase = [0.22, 1, 0.36, 1] as const

const MOBILE_PHOTO = encodeURI("/mobile-background/couples (14).webp")
const DESKTOP_PHOTO = encodeURI("/desktop-background/couples (34).webp")

const titleSize = "clamp(2.85rem, 13.5vw, 6.75rem)"
const titleShadow =
  "0 1px 0 rgb(255 250 244 / 28%), 0 2px 18px rgb(42 34 28 / 55%), 0 12px 36px rgb(42 34 28 / 40%)"

export function SeeYouThere() {
  return (
    <section
      id="see-you-there"
      className={`${theSeasons.variable} relative isolate w-full overflow-hidden`}
    >
      <div className="relative min-h-[100svh] w-full">
        <Image
          src={MOBILE_PHOTO}
          alt="Ricky and Jonna"
          fill
          priority={false}
          sizes="100vw"
          className="object-cover object-[center_42%] sm:hidden"
        />
        <Image
          src={DESKTOP_PHOTO}
          alt="Ricky and Jonna"
          fill
          priority={false}
          sizes="100vw"
          className="hidden object-cover object-[center_38%] sm:block"
        />

        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgb(20 16 12 / 38%) 0%, rgb(20 16 12 / 18%) 38%, rgb(20 16 12 / 12%) 58%, rgb(20 16 12 / 42%) 100%)",
          }}
          aria-hidden
        />

        <div className="absolute inset-0 flex items-center justify-center px-5 pb-[18vh] pt-16 sm:pb-[14vh]">
          <motion.h2
            className="relative text-center"
            initial={{ opacity: 0, y: 22, filter: "blur(8px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, amount: 0.45 }}
            transition={{ duration: 0.9, ease: entryEase }}
          >
            <span className="sr-only">See you there!</span>
            <span
              aria-hidden
              className={`${theSeasons.className} block uppercase leading-[0.88] tracking-[0.06em] sm:tracking-[0.08em]`}
              style={{
                fontSize: titleSize,
                color: IVORY,
                textShadow: titleShadow,
              }}
            >
              See you
              <br />
              there
              <span
                className={`${cinzel.className} relative -top-[0.06em] ml-[0.04em] inline-block font-normal tracking-normal`}
              >
                !
              </span>
            </span>
          </motion.h2>
        </div>
      </div>
    </section>
  )
}
