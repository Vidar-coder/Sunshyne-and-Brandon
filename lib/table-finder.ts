export const TABLE_FINDER_PATH = "/table"

export function getTableFinderUrl(origin?: string) {
  const base =
    origin ??
    (typeof window !== "undefined"
      ? window.location.origin
      : (process.env.NEXT_PUBLIC_SITE_URL ?? "https://paul-and-ana.weddinginvitationrsvp.com/"))

  return `${base.replace(/\/$/, "")}${TABLE_FINDER_PATH}`
}
