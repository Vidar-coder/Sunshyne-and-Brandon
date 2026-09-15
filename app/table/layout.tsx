import type { Metadata } from "next"
import { siteConfig } from "@/content/site"
import { TABLE_FINDER_PATH } from "@/lib/table-finder"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://paul-and-ana.weddinginvitationrsvp.com/"
const canonicalUrl = `${siteUrl.replace(/\/$/, "")}${TABLE_FINDER_PATH}`
const coupleNames = `${siteConfig.couple.groomNickname} & ${siteConfig.couple.brideNickname}`

export const metadata: Metadata = {
  title: "Find Your Table",
  description: `Search your name to find your table at ${coupleNames}'s wedding reception.`,
  alternates: {
    canonical: canonicalUrl,
  },
  openGraph: {
    title: `Find Your Table | ${coupleNames}`,
    description: `Search your name to find your table at ${coupleNames}'s wedding reception.`,
    url: canonicalUrl,
    siteName: `${coupleNames} Wedding`,
    locale: "en_PH",
    type: "website",
  },
}

export default function TableFinderLayout({ children }: { children: React.ReactNode }) {
  return children
}
