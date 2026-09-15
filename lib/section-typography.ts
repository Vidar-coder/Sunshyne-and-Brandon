/** Standard typography scale for invitation sections */
export const sectionType = {
  /** Small uppercase labels — Cinzel captions, tags, citations */
  label: "text-[0.625rem] sm:text-xs md:text-sm",
  /** Body copy — Goudy italic paragraphs */
  text: "text-[0.8125rem] sm:text-[0.9375rem] md:text-base",
  textRelaxed: "text-[0.8125rem] sm:text-[0.9375rem] md:text-base leading-[1.58] sm:leading-[1.65]",
  textSnug: "text-[0.8125rem] sm:text-[0.9375rem] md:text-base leading-snug",
  /** Secondary emphasis — sign-off names, supporting titles */
  subheader: "text-[0.8125rem] sm:text-base md:text-lg",
  /** Decorative script phrases */
  script: "text-[1.25rem] leading-none min-[400px]:text-[1.4rem] sm:text-[1.875rem] md:text-[2.1rem]",
} as const

/** CSS values for layered display titles (Welcome, Details, etc.) */
export const layeredTitleSize = {
  main: "clamp(1.75rem, 9vw, 4.5rem)",
  script: "clamp(0.95rem, 3.8vw, 2.25rem)",
  overlap: "clamp(-0.55rem, -2.4vw, -1.5rem)",
} as const

/** Welcome card title — scales to card width so "Welcome" never overflows on desktop */
export const welcomeTitleSize = {
  main: "clamp(1.85rem, min(10vw, 17cqi), 5.75rem)",
  script: "clamp(1rem, min(4.6vw, 7.5cqi), 2.85rem)",
  overlap: "clamp(-0.7rem, min(-3vw, -3.5cqi), -2rem)",
} as const

/** Layered section titles — container-aware sizing for longer multi-word headings */
export const layeredSectionTitleSize = {
  main: "clamp(1.65rem, min(7.5vw, 10cqi), 3.75rem)",
  script: "clamp(0.95rem, min(4vw, 5.8cqi), 2.35rem)",
  overlap: "clamp(-0.5rem, min(-2.4vw, -2.8cqi), -1.5rem)",
} as const

/** Story chapter titles — scales within the story text column */
export const storyChapterTitleSize = "clamp(1.125rem, min(5.5vw, 13cqi), 2.25rem)"

/** Modal layered titles — compact container-aware sizing */
export const modalTitleSize = {
  main: "clamp(1.5rem, min(5vw, 12cqi), 2.35rem)",
  script: "clamp(1.05rem, min(3.5vw, 7cqi), 1.85rem)",
  overlap: "clamp(-0.55rem, min(-2.2vw, -2.2cqi), -1rem)",
} as const
