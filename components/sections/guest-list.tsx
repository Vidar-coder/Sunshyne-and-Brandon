"use client"

import { useState, useEffect, useRef, type CSSProperties } from "react"
import { createPortal } from "react-dom"
import {
  Search,
  CheckCircle,
  XCircle,
  AlertCircle,
  User,
  Mail,
  MessageSquare,
  RefreshCw,
  X,
  Heart,
  Sparkles,
  Phone,
  ShieldCheck,
  UserPlus,
  Users,
  ChevronRight,
} from "lucide-react"
import { Cinzel } from "next/font/google"
import localFont from "next/font/local"
import { useSiteConfig } from "@/hooks/use-site-config"
import { modalTitleSize, sectionType, welcomeTitleSize } from "@/lib/section-typography"
import { fetchUntilReady, isAbortError } from "@/lib/fetch-until-ready"
import { fetchInvitationList, invalidateInvitationData } from "@/lib/invitation-data"

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
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
const CHAMPAGNE = "#E8D5A3"
const NAV_GOLD =
  "linear-gradient(180deg, #E8D5A3 0%, #CDB072 52%, #C4A265 100%)"
const LIGHT_OVERLAY = "color-mix(in srgb, #f7f3e9 42%, rgb(91 74 55 / 22%))"

const palette = {
  body: "var(--color-welcome-text)",
  heading: "var(--color-welcome-navy)",
  label: "var(--color-welcome-gold)",
  accent: "var(--color-welcome-gold)",
} as const

const modalCardStyle = {
  background: IVORY,
  borderColor: "color-mix(in srgb, #CDB072 42%, transparent)",
  borderWidth: "1px",
  borderStyle: "solid" as const,
  boxShadow:
    "0 18px 40px rgb(42 34 28 / 28%), inset 0 1px 0 rgb(255 250 244 / 70%)",
} as const

const innerSurfaceStyle = {
  background: `color-mix(in srgb, ${IVORY} 82%, ${CHAMPAGNE})`,
  borderColor: "color-mix(in srgb, #CDB072 22%, transparent)",
} as const

const modalInputClass = `w-full rounded-lg border bg-[#fffaf4] px-2.5 py-1.5 font-goudy-italic ${sectionType.text} transition-all duration-300 focus:ring-2 focus:ring-[color-mix(in_srgb,var(--color-welcome-gold)_28%,transparent)] sm:px-3 sm:py-2`

const modalInputStyle = {
  borderColor: "color-mix(in srgb, #CDB072 32%, transparent)",
  color: palette.heading,
} as const

const modalLabelClass = `font-goudy-italic mb-1.5 flex flex-wrap items-center gap-1.5 ${sectionType.text} font-semibold sm:mb-2 sm:gap-2`

const dividerLineStyle = {
  background:
    "linear-gradient(to right, transparent, var(--color-welcome-gold), transparent)",
} as const

function HighlightedName({ name, query }: { name: string; query: string }) {
  const trimmed = query.trim()
  if (!trimmed) return <>{name}</>

  const lowerName = name.toLowerCase()
  const lowerQuery = trimmed.toLowerCase()
  const index = lowerName.indexOf(lowerQuery)
  if (index === -1) return <>{name}</>

  return (
    <>
      {name.slice(0, index)}
      <span className="font-semibold" style={{ color: "var(--color-welcome-gold)" }}>
        {name.slice(index, index + trimmed.length)}
      </span>
      {name.slice(index + trimmed.length)}
    </>
  )
}

interface ApiGuest {
  id: string | number
  name: string
  role: string
  email: string
  contact: string
  message: string
  allowedGuests: number
  companions: Array<{ name: string; relationship: string }>
  tableNumber: string
  isVip: boolean
  status: string
  addedBy: string
  createdAt: string
  updatedAt: string
}

interface Guest {
  id: string | number
  Name: string
  Email: string
  Phone: string
  RSVP: string
  Guest: string
  Message: string
  Status: string
  AllowedGuests: number
  Companions?: Array<{ name: string; relationship: string }>
}

function mapApiGuests(data: ApiGuest[]): Guest[] {
  return data
    .filter((guest) => guest.name && guest.name.trim() !== "")
    .map((guest) => ({
      id: guest.id,
      Name: guest.name,
      Email: guest.email || "",
      Phone: guest.contact || "",
      RSVP: guest.status === "confirmed" ? "Yes" : guest.status === "declined" ? "No" : "",
      Guest: guest.allowedGuests?.toString() || "1",
      Message: guest.message || "",
      Status: guest.status || "pending",
      AllowedGuests: guest.allowedGuests || 1,
      Companions: Array.isArray(guest.companions) ? guest.companions : [],
    }))
}

async function loadGuestsFromApi(signal?: AbortSignal, reload = false): Promise<Guest[]> {
  const data = await fetchInvitationList<ApiGuest>("/api/guests", { signal, reload })
  return mapApiGuests(data)
}

export function GuestList() {
  const siteConfig = useSiteConfig()
  const [guests, setGuests] = useState<Guest[]>([])
  const [filteredGuests, setFilteredGuests] = useState<Guest[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isFetchingGuests, setIsFetchingGuests] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [requestSuccess, setRequestSuccess] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [showSearchModal, setShowSearchModal] = useState(false)
  const [hasResponded, setHasResponded] = useState(false)
  const [showRequestModal, setShowRequestModal] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    Name: "",
    Email: "",
    Phone: "",
    RSVP: "",
    Guest: "1",
    Message: "",
    Status: "pending",
  })

  // Companion state
  const [companions, setCompanions] = useState<Array<{ name: string; relationship: string }>>([])

  // Request form state
  const [requestFormData, setRequestFormData] = useState({
    Name: "",
    Email: "",
    Phone: "",
    Guest: "1",
    Message: "",
  })

  const searchRef = useRef<HTMLDivElement>(null)
  const phoneInputRef = useRef<HTMLInputElement>(null)
  const [isMounted, setIsMounted] = useState(false)
  const [showPhoneAlert, setShowPhoneAlert] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (!showSearchModal) return

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !showModal && !showRequestModal) {
        setShowSearchModal(false)
      }
    }
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    window.addEventListener("keydown", onKey)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener("keydown", onKey)
    }
  }, [showSearchModal, showModal, showRequestModal])

  // Update companions array based on allowedGuests when a guest is selected
  useEffect(() => {
    if (selectedGuest && formData.RSVP === "Yes") {
      const allowedGuests = selectedGuest.AllowedGuests || 1
      const companionCount = Math.max(0, allowedGuests - 1) // Main guest + companions
      
      setCompanions((prev) => {
        // If we have existing companions from the selected guest, use them as base
        const existingCompanions = selectedGuest.Companions && selectedGuest.Companions.length > 0 
          ? [...selectedGuest.Companions] 
          : [...prev]
        
        const newCompanions = [...existingCompanions]
        if (newCompanions.length < companionCount) {
          // Add empty slots
          for (let i = newCompanions.length; i < companionCount; i++) {
            newCompanions.push({ name: '', relationship: '' })
          }
        } else if (newCompanions.length > companionCount) {
          // Remove excess slots
          newCompanions.splice(companionCount)
        }
        return newCompanions
      })
    } else {
      // Clear companions if not attending or no guest selected
      setCompanions([])
    }
  }, [selectedGuest, formData.RSVP])

  // Fetch guests on mount and retry until the list is ready to display
  useEffect(() => {
    const controller = new AbortController()

    const load = async () => {
      setIsFetchingGuests(true)
      try {
        const mappedGuests = await fetchUntilReady({
          signal: controller.signal,
          load: loadGuestsFromApi,
          isReady: (list) => list.length > 0,
        })
        setGuests(mappedGuests)
        setError(null)
      } catch (error) {
        if (isAbortError(error)) return
        console.error("Error fetching guests:", error)
        setError("Failed to load guest list")
        setTimeout(() => setError(null), 5000)
      } finally {
        if (!controller.signal.aborted) {
          setIsFetchingGuests(false)
        }
      }
    }

    void load()
    return () => controller.abort()
  }, [])

  // Filter guests based on search query with real-time auto-suggestion
  // Shows suggestions for ANY letter typed (even just 1 character)
  // Matches names that START with OR CONTAIN the typed letters (case-insensitive)
  // Results automatically narrow down as more letters are typed
  useEffect(() => {
    // Don't show suggestions if search is empty
    if (!searchQuery.trim()) {
      setFilteredGuests([])
      return
    }

    // Convert search query to lowercase for case-insensitive matching
    const query = searchQuery.toLowerCase().trim()
    
    // Filter guests where name contains the search query anywhere in the name
    // This includes both:
    // - Names that START with the query (e.g., "Ro" matches "Rolando")
    // - Names that CONTAIN the query (e.g., "ro" matches "Aaron")
    const filtered = guests.filter((guest) => {
      // Safety check: ensure guest.Name exists and is not empty
      if (!guest.Name || guest.Name.trim() === "") {
        return false
      }
      
      const guestName = guest.Name.toLowerCase()
      return guestName.includes(query)
    })

    // Sort results to prioritize names that START with the query
    // This provides a better user experience
    const sorted = filtered.sort((a, b) => {
      const aName = a.Name.toLowerCase()
      const bName = b.Name.toLowerCase()
      const aStarts = aName.startsWith(query)
      const bStarts = bName.startsWith(query)
      
      // If one starts with query and other doesn't, prioritize the one that starts
      if (aStarts && !bStarts) return -1
      if (!aStarts && bStarts) return 1
      
      // Otherwise maintain alphabetical order
      return aName.localeCompare(bName)
    })

    setFilteredGuests(sorted)
  }, [searchQuery, guests])

  const fetchGuests = async () => {
    try {
      invalidateInvitationData("/api/guests")
      const mappedGuests = await loadGuestsFromApi(undefined, true)
      if (mappedGuests.length > 0) {
        setGuests(mappedGuests)
      }
    } catch (error) {
      console.error("Error fetching guests:", error)
    }
  }

  const handleSearchSelect = (guest: Guest) => {
    setSelectedGuest(guest)
    setSearchQuery(guest.Name)
    
    // Set form data with existing guest info
    setFormData({
      Name: guest.Name,
      Email: guest.Email && guest.Email !== "Pending" && guest.Email !== "" ? guest.Email : "",
      Phone: guest.Phone || "",
      RSVP: guest.RSVP || "",
      Guest: guest.Guest && guest.Guest !== "" ? guest.Guest : "1",
      Message: guest.Message || "",
      Status: guest.Status || "pending",
    })
    
    // Load existing companions if available
    if (guest.Companions && guest.Companions.length > 0) {
      setCompanions(guest.Companions)
    } else {
      setCompanions([])
    }
    
    // Check if guest has already responded (status is confirmed or declined)
    setHasResponded(!!(guest.Status && (guest.Status === "confirmed" || guest.Status === "declined")))
    
    setShowSearchModal(false)
    setShowModal(true)
  }

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmitRSVP = async () => {
    if (!selectedGuest) return

    if (!formData.RSVP) {
      setError("Please select if you can attend")
      setTimeout(() => setError(null), 5000)
      return
    }

    const phoneDigits = formData.Phone.replace(/\D/g, "")
    if (!formData.Phone.trim() || phoneDigits.length < 7) {
      setShowPhoneAlert(true)
      return
    }

    setIsLoading(true)
    setError(null)
    setSuccess(null)

    try {
      // Use the allowedGuests from selectedGuest
      const guestCount = formData.RSVP === "Yes" ? selectedGuest.AllowedGuests.toString() : "0"
      
      // Determine the status based on RSVP
      const status = formData.RSVP === "Yes" ? "confirmed" : formData.RSVP === "No" ? "declined" : "pending"
      
      const response = await fetch("/api/guests", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: String(selectedGuest.id),
          name: formData.Name,
          email: formData.Email || "Pending",
          contact: formData.Phone.trim(),
          status: status,
          allowedGuests: parseInt(guestCount),
          message: formData.Message,
          companions: companions,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to submit RSVP")
      }

      // Show success and close modal after delay
      setSuccess("Thank you for your response!")
      setHasResponded(true)
      
      // Trigger event to refresh Book of Guests
      window.dispatchEvent(new Event("rsvpUpdated"))
      
      // Refresh guest list in the background
      fetchGuests()
    } catch (error) {
      console.error("Error submitting RSVP:", error)
      setError("Failed to submit RSVP. Please try again.")
      setTimeout(() => setError(null), 5000)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setSelectedGuest(null)
    setSearchQuery("")
    setFormData({ Name: "", Email: "", Phone: "", RSVP: "", Guest: "1", Message: "", Status: "pending" })
    setCompanions([])
    setHasResponded(false)
    setError(null)
    setShowPhoneAlert(false)
  }

  const handleClosePhoneAlert = () => {
    setShowPhoneAlert(false)
    requestAnimationFrame(() => phoneInputRef.current?.focus())
  }

  useEffect(() => {
    if (!showPhoneAlert) return

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.stopPropagation()
        handleClosePhoneAlert()
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [showPhoneAlert])

  const handleSubmitRequest = async () => {
    if (!requestFormData.Name) {
      setError("Name is required")
      setTimeout(() => setError(null), 5000)
      return
    }

    setIsLoading(true)
    setError(null)
    setRequestSuccess(null)

    try {
      // Submit to guest-requests API
      const response = await fetch("/api/guest-requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Name: requestFormData.Name,
          Email: requestFormData.Email || "",
          Phone: requestFormData.Phone || "",
          RSVP: "",
          Guest: requestFormData.Guest || "1",
          Message: requestFormData.Message || "",
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to submit request")
      }

      setRequestSuccess("Request submitted! We'll review and get back to you.")
      
      // Close modal and reset after showing success
      setTimeout(() => {
        setShowRequestModal(false)
        setRequestFormData({ Name: "", Email: "", Phone: "", Guest: "1", Message: "" })
        setSearchQuery("")
        setRequestSuccess(null)
      }, 3000)
    } catch (error) {
      console.error("Error submitting request:", error)
      setError("Failed to submit request. Please try again.")
      setTimeout(() => setError(null), 5000)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCloseRequestModal = () => {
    setShowRequestModal(false)
    setRequestFormData({ Name: "", Email: "", Phone: "", Guest: "1", Message: "" })
    setError(null)
    setRequestSuccess(null)
  }

  return (
    <div
      className={`${theSeasons.variable} ${aboveTheBeyond.variable} relative w-full overflow-visible`}
    >
    <section
      id="guest-list"
      className="relative z-30 overflow-visible px-5 pb-10 pt-12 sm:px-8 sm:pb-12 sm:pt-14"
    >
      <fieldset
        className="relative mx-auto w-full max-w-[22.5rem] overflow-visible rounded-[1.85rem] px-5 pb-8 pt-6 text-center @container/rsvp sm:max-w-[24rem] sm:px-7 sm:pb-9 sm:pt-7"
        style={{
          background: IVORY,
          border: "1px solid color-mix(in srgb, var(--color-welcome-gold) 38%, transparent)",
          boxShadow: "0 10px 28px color-mix(in srgb, var(--color-welcome-gold) 12%, transparent)",
        }}
      >
        <h2
          className="welcome-title-lockup relative mx-auto w-full max-w-full text-center"
          style={
            {
              "--welcome-size": welcomeTitleSize.main,
              "--script-size": welcomeTitleSize.script,
            } as React.CSSProperties
          }
        >
          <span className="sr-only">RSVP. Are you going?</span>
          <span
            aria-hidden
            className={`${theSeasons.className} block uppercase leading-[0.9] tracking-[0.08em] min-[400px]:tracking-[0.11em] sm:tracking-[0.13em] md:tracking-[0.14em]`}
            style={{
              fontSize: "var(--welcome-size)",
              color: "var(--color-welcome-navy)",
            }}
          >
            RSVP
          </span>
          <span
            aria-hidden
            className={`${aboveTheBeyond.className} relative z-10 mx-auto mt-1.5 block w-fit max-w-full px-1 leading-[0.88] sm:mt-2 sm:leading-[0.9]`}
            style={{
              fontSize: "var(--script-size)",
              color: "var(--color-welcome-green)",
              textShadow:
                "0 1px 0 color-mix(in srgb, var(--color-welcome-bg) 95%, white), 0 0 10px color-mix(in srgb, var(--color-welcome-bg) 65%, white)",
            }}
          >
            Are you going
            <span className={`${cinzel.className} relative -top-[0.06em] ml-[0.04em] inline-block font-normal`}>
              ?
            </span>
          </span>
        </h2>

        <p
          className={`font-goudy-italic mx-auto mt-3 max-w-[17.5rem] ${sectionType.textSnug} sm:mt-4`}
          style={{ color: "var(--color-welcome-text)" }}
        >
          Kindly confirm your attendance so we may prepare a place for you at our celebration.
        </p>

        {siteConfig.details.rsvp.deadline ? (
          <p
            className={`${cinzel.className} ${sectionType.label} mx-auto mt-4 font-semibold uppercase tracking-[0.16em] sm:mt-5 sm:tracking-[0.18em]`}
            style={{ color: "var(--color-welcome-gold)" }}
          >
            RSVP Deadline
            <span
              className={`font-goudy-italic mt-1.5 block font-normal normal-case tracking-normal ${sectionType.textSnug}`}
              style={{ color: "var(--color-welcome-navy)" }}
            >
              {siteConfig.details.rsvp.deadline.replace(/\.\s*$/, "")}
            </span>
          </p>
        ) : null}

        <button
          type="button"
          onClick={() => {
            setSearchQuery("")
            setShowSearchModal(true)
          }}
          className={`${cinzel.className} ${sectionType.label} mt-5 inline-flex min-h-11 w-full max-w-[13.5rem] items-center justify-center rounded-full px-6 py-2.5 font-semibold uppercase tracking-[0.16em] shadow-[0_8px_18px_color-mix(in_srgb,var(--color-welcome-gold)_22%,transparent)] transition-transform duration-200 hover:scale-[1.03] active:scale-[0.98] sm:mt-6 sm:tracking-[0.18em]`}
          style={{ background: NAV_GOLD, color: IVORY }}
        >
          Tap here if Yes
        </button>
      </fieldset>
    </section>

      {isMounted && showSearchModal && createPortal(
        <div
          className="fixed inset-0 z-[9998] flex items-start justify-center overflow-hidden px-4 pb-6 pt-[max(4.75rem,11dvh)] backdrop-blur-[6px] animate-in fade-in sm:px-6 sm:pt-[max(5.5rem,13dvh)]"
          style={{ background: LIGHT_OVERLAY }}
          onClick={() => setShowSearchModal(false)}
          role="presentation"
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="rsvp-search-title"
            className="relative w-full max-w-[22.75rem] @container/guest-modal sm:max-w-md"
            onClick={(event) => event.stopPropagation()}
          >
            <div
              className="relative overflow-hidden rounded-[1.35rem] border"
              style={modalCardStyle}
            >
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-6 top-0 h-px"
                style={{
                  background:
                    "linear-gradient(to right, transparent, var(--color-motif-yellow), transparent)",
                }}
              />
              <button
                type="button"
                onClick={() => setShowSearchModal(false)}
                className="absolute right-3 top-3 z-10 rounded-full p-1.5 transition-colors hover:bg-black/5"
                style={{ color: palette.heading }}
                aria-label="Close search"
              >
                <X className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>

              <div className="px-5 pb-4 pt-6 sm:px-6 sm:pt-7">
                <h2
                  id="rsvp-search-title"
                  className="welcome-title-lockup relative mx-auto w-full max-w-full text-center"
                  style={
                    {
                      "--title-size": modalTitleSize.main,
                      "--script-size": modalTitleSize.script,
                    } as CSSProperties
                  }
                >
                  <span className="sr-only">RSVP — Find your name</span>
                  <span
                    aria-hidden
                    className={`${theSeasons.className} block uppercase leading-[0.78] tracking-[0.08em] min-[400px]:tracking-[0.11em] sm:tracking-[0.13em]`}
                    style={{
                      fontSize: "var(--title-size)",
                      color: palette.heading,
                    }}
                  >
                    RSVP
                  </span>
                  <span
                    aria-hidden
                    className={`${aboveTheBeyond.className} relative z-10 mx-auto mt-1.5 block w-fit max-w-full px-1 leading-[0.88] sm:mt-2 sm:leading-[0.9]`}
                    style={{
                      fontSize: "var(--script-size)",
                      color: palette.accent,
                    }}
                  >
                    Find your Name
                  </span>
                </h2>

                <div className="mx-auto mt-3 flex items-center justify-center gap-1.5 sm:mt-4">
                  <span className="h-px w-6 sm:w-8" style={dividerLineStyle} />
                  <Heart className="h-3 w-3 sm:h-3.5 sm:w-3.5" style={{ color: "var(--color-welcome-gold)" }} aria-hidden />
                  <span className="h-px w-6 sm:w-8" style={dividerLineStyle} />
                </div>

                <div ref={searchRef} className="relative mt-4 sm:mt-5">
                  <Search
                    className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2"
                    style={{ color: "var(--color-welcome-gold)" }}
                  />
                  <input
                    id="rsvp-name-search"
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Begin with your first name"
                    autoFocus
                    autoComplete="off"
                    className="w-full rounded-full border bg-[#fffaf4] py-2.5 pl-10 pr-4 font-goudy-italic text-[0.95rem] shadow-sm outline-none transition-all duration-200 placeholder:text-[color-mix(in_srgb,var(--color-welcome-text)_45%,transparent)] sm:py-3 sm:text-base"
                    style={{
                      borderColor: searchQuery
                        ? "var(--color-welcome-gold)"
                        : "color-mix(in srgb, var(--color-motif-deep) 22%, transparent)",
                      color: palette.heading,
                      boxShadow: searchQuery
                        ? "0 0 0 3px color-mix(in srgb, var(--color-welcome-gold) 22%, transparent)"
                        : undefined,
                    }}
                  />
                </div>
              </div>

              {isFetchingGuests && guests.length === 0 && (
                <div
                  className="border-t px-5 py-4 text-center sm:px-6 sm:py-5"
                  style={{
                    borderColor: "color-mix(in srgb, var(--color-motif-deep) 10%, transparent)",
                    background: "var(--color-welcome-bg-soft)",
                  }}
                >
                  <RefreshCw
                    className="mx-auto mb-2 h-4 w-4 animate-spin"
                    style={{ color: "var(--color-welcome-gold)" }}
                    aria-hidden
                  />
                  <p
                    className={`font-goudy-italic ${sectionType.textSnug}`}
                    style={{ color: palette.body }}
                  >
                    Preparing the guest list. We&apos;ll keep trying until names appear.
                  </p>
                </div>
              )}

              {searchQuery.trim() && filteredGuests.length > 0 && (
                <div
                  className="border-t"
                  style={{
                    borderColor: "color-mix(in srgb, #CDB072 28%, transparent)",
                    background: `color-mix(in srgb, ${IVORY} 82%, ${CHAMPAGNE})`,
                  }}
                >
                  {filteredGuests.slice(0, 6).map((guest, index) => (
                    <button
                      key={guest.id ?? index}
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => handleSearchSelect(guest)}
                      className="group flex w-full items-center gap-3 border-b px-5 py-3 text-left last:border-b-0 hover:bg-[color-mix(in_srgb,#fffaf4_55%,#E8D5A3)] sm:px-6 sm:py-3.5"
                      style={{
                        borderColor: "color-mix(in srgb, #CDB072 22%, transparent)",
                      }}
                    >
                      <div
                        className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full sm:h-9 sm:w-9"
                        style={{ background: NAV_GOLD }}
                      >
                        <User className="h-3.5 w-3.5 text-[#fffaf4] sm:h-4 sm:w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div
                          className="truncate font-goudy-italic text-[0.95rem] sm:text-base"
                          style={{ color: palette.heading }}
                        >
                          <HighlightedName name={guest.Name} query={searchQuery} />
                        </div>
                        {guest.Email && guest.Email !== "Pending" && (
                          <div
                            className={`mt-0.5 truncate ${sectionType.label}`}
                            style={{ color: "var(--color-welcome-text-soft)" }}
                          >
                            {guest.Email}
                          </div>
                        )}
                      </div>
                      <ChevronRight
                        className="h-4 w-4 flex-shrink-0 transition-transform duration-200 group-hover:translate-x-0.5"
                        style={{ color: "var(--color-welcome-gold)" }}
                      />
                    </button>
                  ))}
                  {filteredGuests.length > 6 && (
                    <p
                      className={`${cinzel.className} px-5 py-2.5 text-center text-[0.62rem] font-medium tracking-[0.14em] sm:px-6`}
                      style={{ color: "var(--color-welcome-gold)" }}
                    >
                      Keep typing to refine results
                    </p>
                  )}
                </div>
              )}

              {searchQuery.trim() && filteredGuests.length === 0 && !isFetchingGuests && (
                <div
                  className="border-t px-5 py-4 sm:px-6 sm:py-5"
                  style={{
                    borderColor: "color-mix(in srgb, var(--color-motif-deep) 10%, transparent)",
                    background: "var(--color-welcome-bg-soft)",
                  }}
                >
                  <div className="mb-3 flex items-start gap-3">
                    <div
                      className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full"
                      style={{ background: NAV_GOLD }}
                    >
                      <UserPlus className="h-4 w-4 text-[#fffaf4]" />
                    </div>
                    <div className="flex-1">
                      <h4
                        className={`${cinzel.className} text-[0.78rem] font-semibold tracking-[0.08em]`}
                        style={{ color: palette.heading }}
                      >
                        Not finding your name?
                      </h4>
                      <p
                        className={`font-goudy-italic mt-1 ${sectionType.textSnug}`}
                        style={{ color: palette.body }}
                      >
                        We&apos;d love to have you with us. Send a request to join the celebration.
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setRequestFormData({ ...requestFormData, Name: searchQuery })
                      setShowRequestModal(true)
                    }}
                    className={`${cinzel.className} flex w-full items-center justify-center rounded-full py-2.5 text-[0.72rem] font-semibold tracking-[0.12em] text-[#fffaf4] transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]`}
                    style={{ background: NAV_GOLD }}
                  >
                    <UserPlus className="mr-2 h-3.5 w-3.5" />
                    Request to Join
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* RSVP Modal — portaled to escape motion/filter stacking context */}
      {isMounted && showModal && createPortal(
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden p-3 backdrop-blur-sm animate-in fade-in sm:p-4"
          style={{ background: LIGHT_OVERLAY }}
          onClick={handleCloseModal}
        >
          <div
            className="relative mx-1 flex w-full max-w-md flex-col overflow-visible rounded-xl animate-in zoom-in-95 duration-300 @container/guest-modal sm:mx-2 sm:max-w-lg sm:rounded-2xl md:mx-4"
            style={modalCardStyle}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-5 top-0 h-px sm:inset-x-8"
              style={{
                background:
                  "linear-gradient(to right, transparent, var(--color-motif-yellow), transparent)",
              }}
            />

            {/* Modal Header */}
            <div className="relative flex-shrink-0 px-4 pb-4 pt-5 text-center sm:px-6 sm:pb-5 sm:pt-6">
              {!hasResponded && (
                <button
                  onClick={handleCloseModal}
                  className="absolute right-2 top-2 rounded-full p-1 transition-colors hover:bg-black/5 sm:right-3 sm:top-3 sm:p-1.5"
                  style={{ color: palette.heading }}
                  aria-label="Close"
                >
                  <X className="h-4 w-4 sm:h-5 sm:w-5" />
                </button>
              )}

              <div className="mx-auto mb-4 flex items-center justify-center gap-1.5 sm:mb-5">
                <span className="h-px w-6 sm:w-10" style={dividerLineStyle} />
                <Heart className="h-3 w-3 sm:h-3.5 sm:w-3.5" style={{ color: palette.accent }} aria-hidden />
                <span className="h-px w-6 sm:w-10" style={dividerLineStyle} />
              </div>

              <h3
                className="welcome-title-lockup relative mx-auto w-full max-w-full text-center"
                style={
                  {
                    "--title-size": modalTitleSize.main,
                    "--script-size": modalTitleSize.script,
                  } as CSSProperties
                }
              >
                <span
                  className={`${theSeasons.className} block uppercase leading-[0.78] tracking-[0.08em] min-[400px]:tracking-[0.11em] sm:tracking-[0.13em] pb-1 sm:pb-1.5`}
                  style={{ fontSize: "var(--title-size)", color: palette.heading }}
                >
                  You are Invited
                </span>
                <span
                  aria-hidden
                  className={`${aboveTheBeyond.className} mx-auto block w-fit max-w-full px-1 leading-[0.88] sm:leading-[0.9] mt-2 sm:mt-2.5 md:mt-3`}
                  style={{
                    fontSize: "var(--script-size)",
                    color: palette.accent,
                  }}
                >
                  {selectedGuest?.Name || "to our celebration"}
                </span>
              </h3>

              <p
                className={`font-goudy-italic mx-auto mt-4 max-w-md sm:mt-5 ${sectionType.textSnug}`}
                style={{ color: palette.body }}
              >
                Hello <span style={{ color: palette.heading }}>{selectedGuest?.Name}</span>, you are
                invited to our wedding!
              </p>
              <p
                className={`font-goudy-italic mx-auto mt-2 ${sectionType.text}`}
                style={{ color: palette.body }}
              >
                We&apos;ve reserved{" "}
                <span className="font-semibold" style={{ color: palette.accent }}>
                  {selectedGuest?.AllowedGuests || 1}
                </span>{" "}
                {selectedGuest?.AllowedGuests === 1 ? "seat" : "seats"} for you.
              </p>
            </div>

            {/* Modal Content */}
            <div className="px-4 pb-4 sm:px-6 sm:pb-5 md:px-7 md:pb-6">
                {hasResponded ? (
                  <div className="py-3 text-center sm:py-4 md:py-6">
                    <div
                      className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-full sm:mb-4 sm:h-14 sm:w-14 md:h-16 md:w-16"
                      style={{ backgroundColor: palette.accent }}
                    >
                      <CheckCircle className="h-6 w-6 text-white sm:h-7 sm:w-7 md:h-8 md:w-8" />
                    </div>
                    <h4
                      className={`${theSeasons.className} mb-2 uppercase tracking-[0.12em] sm:text-lg md:text-xl ${sectionType.subheader}`}
                      style={{ color: palette.heading }}
                    >
                      Thank You for Responding!
                    </h4>
                    <p
                      className={`font-goudy-italic mb-4 px-2 ${sectionType.text}`}
                      style={{ color: palette.body }}
                    >
                      We&apos;ve received your RSVP and look forward to celebrating with you!
                    </p>
                    <div
                      className="space-y-2.5 rounded-lg border p-3 sm:space-y-3 sm:p-4"
                      style={innerSurfaceStyle}
                    >
                      <div className="mb-1.5 flex items-center justify-center gap-2 sm:mb-2">
                        {selectedGuest?.RSVP === "Yes" && (
                          <>
                            <CheckCircle className="h-4 w-4 text-green-600 sm:h-5 sm:w-5" />
                            <span className="font-goudy-italic text-xs font-semibold text-green-600 sm:text-sm">
                              You&apos;re Attending!
                            </span>
                          </>
                        )}
                        {selectedGuest?.RSVP === "No" && (
                          <>
                            <XCircle className="h-4 w-4 text-red-600 sm:h-5 sm:w-5" />
                            <span className="font-goudy-italic text-xs font-semibold text-red-600 sm:text-sm">
                              Unable to Attend
                            </span>
                          </>
                        )}
                      </div>
                      {selectedGuest?.RSVP === "Yes" && (
                        <div className="rounded-lg border p-2.5 sm:p-3" style={innerSurfaceStyle}>
                          <div className="text-center">
                            <p
                              className={`font-goudy-italic mb-1 ${sectionType.label} font-medium`}
                              style={{ color: palette.label }}
                            >
                              Number of Guests
                            </p>
                            <p
                              className={`${theSeasons.className} text-lg sm:text-xl md:text-2xl`}
                              style={{ color: palette.heading }}
                            >
                              {selectedGuest.AllowedGuests || 1}
                            </p>
                          </div>
                        </div>
                      )}
                      {selectedGuest && selectedGuest.Message && selectedGuest.Message.trim() !== "" && (
                        <div className="border-t pt-2" style={{ borderColor: innerSurfaceStyle.borderColor }}>
                          <p
                            className={`font-goudy-italic px-1 ${sectionType.label} italic`}
                            style={{ color: palette.body }}
                          >
                            &ldquo;{selectedGuest.Message}&rdquo;
                          </p>
                        </div>
                      )}
                    </div>
                    <button
                      onClick={handleCloseModal}
                      className={`${cinzel.className} mt-4 rounded-sm border px-6 py-2.5 ${sectionType.label} font-semibold uppercase tracking-[0.2em] shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md sm:mt-5 sm:px-8 sm:py-3 md:mt-6`}
                      style={{
                        backgroundColor: palette.accent,
                        borderColor: "color-mix(in srgb, var(--color-welcome-navy) 35%, transparent)",
                        color: "var(--color-welcome-bg)",
                      }}
                    >
                      Close
                    </button>
                  </div>
                ) : (
                  // RSVP Form for guests who haven't responded
                  <form
                    onSubmit={(e) => {
                      e.preventDefault()
                      handleSubmitRSVP()
                    }}
                    className="space-y-2.5 sm:space-y-3 md:space-y-4"
                  >
                    <div>
                      <label className={modalLabelClass} style={{ color: palette.heading }}>
                        <Sparkles className="h-3.5 w-3.5 flex-shrink-0 sm:h-4 sm:w-4" style={{ color: palette.accent }} />
                        <span>Can you attend? *</span>
                      </label>
                      <div className="grid grid-cols-2 gap-1.5 sm:gap-2 md:gap-3">
                        <button
                          type="button"
                          onClick={() =>
                            setFormData((prev) => ({ ...prev, RSVP: "Yes", Guest: "1" }))
                          }
                          className={`relative rounded-lg border-2 p-2 transition-all duration-300 sm:p-2.5 md:p-3 lg:p-4 ${
                            formData.RSVP === "Yes"
                              ? "scale-[1.02] shadow-md"
                              : "bg-white hover:shadow-sm"
                          }`}
                          style={
                            formData.RSVP === "Yes"
                              ? {
                                  borderColor: palette.accent,
                                  backgroundColor:
                                    "color-mix(in srgb, var(--color-welcome-gold) 14%, white)",
                                }
                              : { borderColor: innerSurfaceStyle.borderColor }
                          }
                        >
                          <div className="flex items-center justify-center gap-1.5 sm:gap-2">
                            <CheckCircle
                              className="h-4 w-4 flex-shrink-0 sm:h-5 sm:w-5"
                              style={{
                                color:
                                  formData.RSVP === "Yes" ? palette.accent : "var(--color-welcome-text-soft)",
                              }}
                            />
                            <span
                              className="font-goudy-italic text-xs font-semibold sm:text-sm"
                              style={{ color: palette.heading }}
                            >
                              Yes!
                            </span>
                          </div>
                        </button>
                        <button
                          type="button"
                          onClick={() => setFormData((prev) => ({ ...prev, RSVP: "No" }))}
                          className={`relative rounded-lg border-2 p-2 transition-all duration-300 sm:p-2.5 md:p-3 lg:p-4 ${
                            formData.RSVP === "No"
                              ? "scale-[1.02] border-red-500 bg-red-50 shadow-md"
                              : "border-[color-mix(in_srgb,var(--color-motif-deep)_10%,transparent)] bg-white hover:shadow-sm"
                          }`}
                        >
                          <div className="flex items-center justify-center gap-1.5 sm:gap-2">
                            <XCircle
                              className={`h-4 w-4 flex-shrink-0 sm:h-5 sm:w-5 ${
                                formData.RSVP === "No" ? "text-red-600" : "text-[color-mix(in_srgb,var(--color-welcome-text)_45%,transparent)]"
                              }`}
                            />
                            <span
                              className={`font-goudy-italic text-xs font-semibold sm:text-sm ${
                                formData.RSVP === "No" ? "text-red-600" : ""
                              }`}
                              style={formData.RSVP !== "No" ? { color: palette.heading } : undefined}
                            >
                              Sorry, No
                            </span>
                          </div>
                        </button>
                      </div>
                    </div>

                    {formData.RSVP === "Yes" && companions.length > 0 && (
                      <div className="space-y-2.5 sm:space-y-3">
                        <label className={modalLabelClass} style={{ color: palette.heading }}>
                          <Users className="h-3.5 w-3.5 flex-shrink-0 sm:h-4 sm:w-4" style={{ color: palette.accent }} />
                          <span>Who&apos;s Coming With You?</span>
                        </label>
                        <p
                          className={`font-goudy-italic -mt-1 sm:-mt-1.5 ${sectionType.label}`}
                          style={{ color: palette.body }}
                        >
                          Please provide names and relationships for your{" "}
                          <span className="font-semibold" style={{ color: palette.heading }}>
                            {companions.length}
                          </span>{" "}
                          additional {companions.length === 1 ? "guest" : "guests"}
                        </p>
                        {companions.map((companion, index) => (
                          <div
                            key={index}
                            className="space-y-2 rounded-lg border p-2.5 sm:space-y-2.5 sm:p-3"
                            style={innerSurfaceStyle}
                          >
                            <div className="mb-1 flex items-center gap-1.5 sm:mb-1.5">
                              <User className="h-3 w-3 sm:h-3.5 sm:w-3.5" style={{ color: palette.accent }} />
                              <span
                                className={`font-goudy-italic ${sectionType.label} font-semibold`}
                                style={{ color: palette.heading }}
                              >
                                Guest {index + 2}
                              </span>
                            </div>
                            <div className="space-y-1.5 sm:space-y-2">
                              <div>
                                <label
                                  className={`font-goudy-italic mb-1 block ${sectionType.label} font-medium`}
                                  style={{ color: palette.label }}
                                >
                                  Full Name
                                </label>
                                <input
                                  type="text"
                                  value={companion.name}
                                  onChange={(e) => {
                                    const newCompanions = [...companions]
                                    newCompanions[index] = { ...newCompanions[index], name: e.target.value }
                                    setCompanions(newCompanions)
                                  }}
                                  placeholder={`Name of guest ${index + 2}`}
                                  className={modalInputClass}
                                  style={modalInputStyle}
                                />
                              </div>
                              <div>
                                <label
                                  className={`font-goudy-italic mb-1 block ${sectionType.label} font-medium`}
                                  style={{ color: palette.label }}
                                >
                                  Relationship with {selectedGuest?.Name || "Primary Guest"}
                                </label>
                                <input
                                  type="text"
                                  value={companion.relationship}
                                  onChange={(e) => {
                                    const newCompanions = [...companions]
                                    newCompanions[index] = {
                                      ...newCompanions[index],
                                      relationship: e.target.value,
                                    }
                                    setCompanions(newCompanions)
                                  }}
                                  placeholder="e.g., Spouse, Friend, Child, Parent"
                                  className={modalInputClass}
                                  style={modalInputStyle}
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    <div>
                      <label className={modalLabelClass} htmlFor="rsvp-phone" style={{ color: palette.heading }}>
                        <Phone className="h-3.5 w-3.5 flex-shrink-0 sm:h-4 sm:w-4" style={{ color: palette.accent }} />
                        <span>Phone Number *</span>
                      </label>
                      <input
                        ref={phoneInputRef}
                        id="rsvp-phone"
                        type="tel"
                        name="Phone"
                        value={formData.Phone}
                        onChange={handleFormChange}
                        autoComplete="tel"
                        inputMode="tel"
                        aria-required="true"
                        placeholder="09XX XXX XXXX"
                        className={modalInputClass}
                        style={modalInputStyle}
                      />
                      <p
                        className={`font-goudy-italic mt-1.5 flex items-start gap-1.5 ${sectionType.label} leading-snug`}
                        style={{ color: palette.body }}
                      >
                        <ShieldCheck
                          className="mt-0.5 h-3 w-3 flex-shrink-0 sm:h-3.5 sm:w-3.5"
                          style={{ color: palette.accent }}
                          aria-hidden
                        />
                        <span>
                          For wedding updates only. Your number stays private and will never be shown to
                          other guests.
                        </span>
                      </p>
                    </div>

                    <div className="pt-2 sm:pt-3">
                      <button
                        type="submit"
                        disabled={isLoading}
                        className={`${cinzel.className} flex w-full items-center justify-center gap-1.5 rounded-sm border py-2.5 ${sectionType.label} font-semibold uppercase tracking-[0.2em] shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md disabled:opacity-70 sm:gap-2 sm:py-3`}
                        style={{
                          backgroundColor: palette.accent,
                          borderColor: "color-mix(in srgb, var(--color-welcome-navy) 35%, transparent)",
                          color: "var(--color-welcome-bg)",
                        }}
                      >
                        {isLoading ? (
                          <>
                            <RefreshCw className="h-3.5 w-3.5 sm:h-4 sm:w-4 animate-spin" />
                            <span className="text-xs sm:text-sm">Submitting...</span>
                          </>
                        ) : (
                          <>
                            <Heart className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                            <span className="text-xs sm:text-sm">Submit RSVP</span>
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </div>

              {/* Error message */}
              {error && !success && (
                <div className="px-2 sm:px-2.5 md:px-4 lg:px-6 xl:px-8 pb-2 sm:pb-2.5 md:pb-4 lg:pb-6">
                  <div className="bg-red-50 border-2 border-red-200 rounded-xl p-2 sm:p-2.5 md:p-3 lg:p-4">
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <AlertCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5 text-red-600 flex-shrink-0" />
                      <span className={`text-red-600 font-semibold ${sectionType.text}`}>{error}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>,
        document.body
      )}

      {isMounted && showPhoneAlert && createPortal(
        <div
          className="fixed inset-0 z-[10050] flex items-center justify-center bg-black/55 p-5 backdrop-blur-md animate-in fade-in duration-200 sm:p-8"
          onClick={handleClosePhoneAlert}
          role="presentation"
        >
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="phone-alert-title"
            aria-describedby="phone-alert-copy"
            className="w-full max-w-sm animate-in zoom-in-95 duration-200"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="overflow-hidden rounded-2xl" style={modalCardStyle}>
              <div
                aria-hidden
                className="h-[3px] w-full"
                style={{
                  background:
                    "linear-gradient(to right, transparent, var(--color-welcome-gold), transparent)",
                }}
              />
              <div className="px-6 pb-6 pt-6 text-center">
                <div
                  className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full"
                  style={{ backgroundColor: palette.accent }}
                >
                  <Phone className="h-6 w-6 text-white" strokeWidth={2} />
                </div>

                <h4
                  id="phone-alert-title"
                  className={`${theSeasons.className} mb-2 text-base uppercase tracking-[0.12em]`}
                  style={{ color: palette.heading }}
                >
                  A phone number is needed
                </h4>

                <div
                  id="phone-alert-copy"
                  className={`font-goudy-italic space-y-2.5 ${sectionType.text} leading-relaxed`}
                  style={{ color: palette.body }}
                >
                  <p>
                    We ask for your number so we can reach you with important updates — seating,
                    timing, or anything you may need on the day.
                  </p>
                  <p>
                    Your number will not appear on this invitation, and it will not be shared with
                    other guests. It is kept private and used only by us and our coordinators to
                    take care of you.
                  </p>
                </div>

                <div className="my-4 flex items-center gap-3">
                  <span className="h-px flex-1" style={dividerLineStyle} />
                  <ShieldCheck className="h-3.5 w-3.5 flex-shrink-0" style={{ color: palette.accent }} />
                  <span className="h-px flex-1" style={dividerLineStyle} />
                </div>

                <button
                  type="button"
                  onClick={handleClosePhoneAlert}
                  className={`${cinzel.className} inline-flex min-h-11 w-full items-center justify-center rounded-full px-6 py-2.5 ${sectionType.label} font-semibold uppercase tracking-[0.16em] transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]`}
                  style={{ background: NAV_GOLD, color: IVORY }}
                >
                  Add my number
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}

        {/* RSVP Success — rendered outside RSVP modal to escape transform stacking context */}
        {isMounted && success && createPortal(
          <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-5 backdrop-blur-md animate-in fade-in duration-200 sm:p-8">
            <div className="w-full max-w-sm animate-in zoom-in-95 duration-200">
              <div className="overflow-hidden rounded-2xl" style={modalCardStyle}>
                <div
                  aria-hidden
                  className="h-[3px] w-full"
                  style={{
                    background:
                      "linear-gradient(to right, transparent, var(--color-welcome-gold), transparent)",
                  }}
                />
                <div className="px-6 pb-6 pt-6 text-center">
                  <div className="relative mb-4 inline-flex items-center justify-center">
                    <div
                      className="absolute h-14 w-14 animate-ping rounded-full"
                      style={{
                        animationDuration: "2.5s",
                        backgroundColor: "color-mix(in srgb, var(--color-welcome-gold) 20%, transparent)",
                      }}
                    />
                    <div
                      className="relative flex h-12 w-12 items-center justify-center rounded-full shadow-md"
                      style={{ backgroundColor: palette.accent }}
                    >
                      <CheckCircle className="h-6 w-6 text-white" strokeWidth={2} />
                    </div>
                  </div>

                  <h4
                    className={`${theSeasons.className} mb-1 text-base uppercase tracking-[0.12em]`}
                    style={{ color: palette.heading }}
                  >
                    RSVP Confirmed
                  </h4>

                  {formData.RSVP === "Yes" && (
                    <p className="font-goudy-italic text-sm leading-snug" style={{ color: palette.body }}>
                      We&apos;re thrilled you&apos;ll be joining us — your spot is saved!
                    </p>
                  )}
                  {formData.RSVP === "No" && (
                    <p className="font-goudy-italic text-sm leading-snug" style={{ color: palette.body }}>
                      We&apos;ll miss you, but thank you for letting us know.
                    </p>
                  )}
                  {!formData.RSVP && (
                    <p className="font-goudy-italic text-sm leading-snug" style={{ color: palette.body }}>
                      Thank you for your response!
                    </p>
                  )}

                  <div className="my-4 flex items-center gap-3">
                    <span className="h-px flex-1" style={dividerLineStyle} />
                    <Heart className="h-2.5 w-2.5 flex-shrink-0" style={{ color: palette.accent }} />
                    <span className="h-px flex-1" style={dividerLineStyle} />
                  </div>

                  <p className="font-goudy-italic mb-4 text-sm leading-relaxed" style={{ color: palette.body }}>
                    Before you go, leave a message for the couple — your words will be a cherished memory
                    they can always look back on.
                  </p>

                  <a
                    href="#messages"
                    onClick={() => {
                      setSuccess(null)
                      setShowModal(false)
                      setSearchQuery("")
                      setSelectedGuest(null)
                      setTimeout(() => {
                        const el = document.getElementById("messages")
                        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" })
                      }, 100)
                    }}
                    className={`${cinzel.className} mb-3 inline-flex w-full items-center justify-center gap-2 rounded-sm border py-3 ${sectionType.label} font-semibold uppercase tracking-[0.2em] shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md active:scale-[0.98]`}
                    style={{
                      backgroundColor: palette.accent,
                      borderColor: "color-mix(in srgb, var(--color-welcome-navy) 35%, transparent)",
                      color: "var(--color-welcome-bg)",
                    }}
                  >
                    <MessageSquare className="h-3 w-3 flex-shrink-0" />
                    Leave a Message
                  </a>

                  <button
                    onClick={() => {
                      setSuccess(null)
                      setShowModal(false)
                      setSearchQuery("")
                      setSelectedGuest(null)
                    }}
                    className={`font-goudy-italic ${sectionType.label} tracking-wide transition-colors duration-200`}
                    style={{ color: palette.body }}
                  >
                    Maybe later — close
                  </button>
                </div>
              </div>
            </div>
          </div>,
        document.body
      )}

        {/* Request to Join Modal */}
        {isMounted && showRequestModal && createPortal(
          <div
            className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden p-3 backdrop-blur-sm animate-in fade-in sm:p-4"
            style={{ background: LIGHT_OVERLAY }}
            onClick={handleCloseRequestModal}
          >
            <div
              className="relative mx-1 flex w-full max-w-md flex-col overflow-visible rounded-xl animate-in zoom-in-95 duration-300 @container/guest-modal sm:mx-2 sm:max-w-lg sm:rounded-2xl md:mx-4"
              style={modalCardStyle}
              onClick={(e) => e.stopPropagation()}
            >
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-5 top-0 h-px sm:inset-x-8"
                style={{
                  background:
                    "linear-gradient(to right, transparent, var(--color-motif-yellow), transparent)",
                }}
              />

              <div className="relative flex-shrink-0 px-4 pb-4 pt-5 text-center sm:px-6 sm:pb-5 sm:pt-6">
                <button
                  onClick={handleCloseRequestModal}
                  className="absolute right-2 top-2 rounded-full p-1 transition-colors hover:bg-black/5 sm:right-3 sm:top-3 sm:p-1.5"
                  style={{ color: palette.heading }}
                  aria-label="Close"
                >
                  <X className="h-4 w-4 sm:h-5 sm:w-5" />
                </button>

                <div className="mx-auto mb-4 flex items-center justify-center gap-1.5 sm:mb-5">
                  <span className="h-px w-6 sm:w-10" style={dividerLineStyle} />
                  <UserPlus className="h-3 w-3 sm:h-3.5 sm:w-3.5" style={{ color: palette.accent }} aria-hidden />
                  <span className="h-px w-6 sm:w-10" style={dividerLineStyle} />
                </div>

                <h3
                  className="welcome-title-lockup relative mx-auto w-full max-w-full text-center"
                  style={
                    {
                      "--title-size": modalTitleSize.main,
                      "--script-size": modalTitleSize.script,
                    } as CSSProperties
                  }
                >
                  <span
                    className={`${theSeasons.className} block uppercase leading-[0.78] tracking-[0.08em] min-[400px]:tracking-[0.11em] sm:tracking-[0.13em] pb-1 sm:pb-1.5`}
                    style={{ fontSize: "var(--title-size)", color: palette.heading }}
                  >
                    Request
                  </span>
                  <span
                    aria-hidden
                    className={`${aboveTheBeyond.className} mx-auto block w-fit max-w-full px-1 leading-[0.88] sm:leading-[0.9] mt-2 sm:mt-2.5 md:mt-3`}
                    style={{
                      fontSize: "var(--script-size)",
                      color: palette.accent,
                    }}
                  >
                    to join us
                  </span>
                </h3>

                <p
                  className={`font-goudy-italic mx-auto mt-4 max-w-md sm:mt-5 ${sectionType.textSnug}`}
                  style={{ color: palette.body }}
                >
                  {requestFormData.Name ? (
                    <>
                      Hi <span style={{ color: palette.heading }}>{requestFormData.Name}</span> — want to
                      celebrate with us? Send a request!
                    </>
                  ) : (
                    <>Want to celebrate with us? Send a request!</>
                  )}
                </p>
              </div>

              <div className="px-4 pb-4 sm:px-6 sm:pb-5 md:px-7 md:pb-6">
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    handleSubmitRequest()
                  }}
                  className="space-y-2.5 sm:space-y-3 md:space-y-4"
                >
                  <div>
                    <label className={modalLabelClass} style={{ color: palette.heading }}>
                      <User className="h-3.5 w-3.5 flex-shrink-0 sm:h-4 sm:w-4" style={{ color: palette.accent }} />
                      <span>Full Name *</span>
                    </label>
                    <input
                      type="text"
                      name="Name"
                      value={requestFormData.Name}
                      onChange={(e) => setRequestFormData({ ...requestFormData, Name: e.target.value })}
                      required
                      placeholder="Enter your full name"
                      className={modalInputClass}
                      style={modalInputStyle}
                    />
                  </div>

                  <div>
                    <label className={modalLabelClass} style={{ color: palette.heading }}>
                      <Mail className="h-3.5 w-3.5 flex-shrink-0 sm:h-4 sm:w-4" style={{ color: palette.accent }} />
                      <span>Email Address</span>
                      <span className={`${sectionType.label} font-normal`} style={{ color: palette.body }}>
                        (Optional)
                      </span>
                    </label>
                    <input
                      type="email"
                      name="Email"
                      value={requestFormData.Email}
                      onChange={(e) => setRequestFormData({ ...requestFormData, Email: e.target.value })}
                      placeholder="your.email@example.com"
                      className={modalInputClass}
                      style={modalInputStyle}
                    />
                  </div>

                  <div>
                    <label className={modalLabelClass} style={{ color: palette.heading }}>
                      <Phone className="h-3.5 w-3.5 flex-shrink-0 sm:h-4 sm:w-4" style={{ color: palette.accent }} />
                      <span>Phone Number</span>
                      <span className={`${sectionType.label} font-normal`} style={{ color: palette.body }}>
                        (Optional)
                      </span>
                    </label>
                    <input
                      type="tel"
                      name="Phone"
                      value={requestFormData.Phone}
                      onChange={(e) => setRequestFormData({ ...requestFormData, Phone: e.target.value })}
                      placeholder="+63 912 345 6789"
                      className={modalInputClass}
                      style={modalInputStyle}
                    />
                  </div>

                  <div>
                    <label className={modalLabelClass} style={{ color: palette.heading }}>
                      <Users className="h-3.5 w-3.5 flex-shrink-0 sm:h-4 sm:w-4" style={{ color: palette.accent }} />
                      <span>Number of Guests *</span>
                    </label>
                    <input
                      type="number"
                      name="Guest"
                      value={requestFormData.Guest}
                      onChange={(e) => setRequestFormData({ ...requestFormData, Guest: e.target.value })}
                      min="1"
                      required
                      placeholder="How many guests?"
                      className={modalInputClass}
                      style={modalInputStyle}
                    />
                  </div>

                  <div>
                    <label className={modalLabelClass} style={{ color: palette.heading }}>
                      <MessageSquare className="h-3.5 w-3.5 flex-shrink-0 sm:h-4 sm:w-4" style={{ color: palette.accent }} />
                      <span>Message</span>
                      <span className={`${sectionType.label} font-normal`} style={{ color: palette.body }}>
                        (Optional)
                      </span>
                    </label>
                    <textarea
                      name="Message"
                      value={requestFormData.Message}
                      onChange={(e) => setRequestFormData({ ...requestFormData, Message: e.target.value })}
                      placeholder="Share why you'd like to join..."
                      rows={3}
                      className={`${modalInputClass} resize-none`}
                      style={modalInputStyle}
                    />
                  </div>

                  <div className="pt-2 sm:pt-3">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className={`${cinzel.className} flex w-full items-center justify-center gap-1.5 rounded-sm border py-2.5 ${sectionType.label} font-semibold uppercase tracking-[0.2em] shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md disabled:opacity-70 sm:gap-2 sm:py-3`}
                      style={{
                        backgroundColor: palette.accent,
                        borderColor: "color-mix(in srgb, var(--color-welcome-navy) 35%, transparent)",
                        color: "var(--color-welcome-bg)",
                      }}
                    >
                      {isLoading ? (
                        <>
                          <RefreshCw className="h-3.5 w-3.5 sm:h-4 sm:w-4 animate-spin" />
                          <span className="text-xs sm:text-sm">Submitting...</span>
                        </>
                      ) : (
                        <>
                          <UserPlus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                          <span className="text-xs sm:text-sm">Send Request</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>

              {/* Enhanced Success Overlay */}
              {requestSuccess && (
                <div className="absolute inset-0 bg-motif-soft/98 backdrop-blur-md flex items-center justify-center z-50 animate-in fade-in duration-300 p-2 sm:p-3 md:p-4">
                  <div className="text-center p-3 sm:p-4 md:p-5 lg:p-6 max-w-sm mx-auto">
                    {/* Enhanced Icon Circle */}
                    <div className="relative inline-flex items-center justify-center mb-3 sm:mb-4">
                      {/* Animated rings */}
                      <div className="absolute inset-0 rounded-full border-2 border-motif-deep/20 animate-ping" />
                      <div className="absolute inset-0 rounded-full border-2 border-motif-deep/30" />
                      {/* Icon container */}
                      <div className="relative w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 bg-white rounded-full flex items-center justify-center shadow-xl">
                        <CheckCircle className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 lg:h-10 lg:w-10 text-white" strokeWidth={2.5} />
                      </div>
                    </div>
                    
                    {/* Title */}
                    <h4 className={`mb-2 font-serif font-bold text-motif-deep sm:mb-3 ${sectionType.subheader}`}>
                      Request Sent!
                    </h4>
                    
                    {/* Message */}
                    <div className="space-y-1 sm:space-y-1.5 mb-2 sm:mb-3">
                      <p className={`text-motif-deep/95 font-medium ${sectionType.text}`}>
                        We've received your request
                      </p>
                      <p className={`text-motif-deep/85 ${sectionType.label}`}>
                        We'll review it and get back to you soon
                      </p>
                    </div>
                    
                    {/* Subtle closing indicator */}
                    <div className="flex items-center justify-center gap-1 sm:gap-1.5 mt-2 sm:mt-3">
                      <div className="w-0.5 h-0.5 sm:w-1 sm:h-1 bg-motif-deep/60 rounded-full animate-pulse" />
                      <p className={`text-motif-deep/70 ${sectionType.label}`}>
                        This will close automatically
                      </p>
                      <div className="w-0.5 h-0.5 sm:w-1 sm:h-1 bg-motif-deep/60 rounded-full animate-pulse" />
                    </div>
                  </div>
                </div>
              )}

              {/* Error message */}
              {error && !requestSuccess && (
                <div className="px-2 sm:px-2.5 md:px-4 lg:px-6 xl:px-8 pb-2 sm:pb-2.5 md:pb-4 lg:pb-6">
                  <div className="bg-red-50 border-2 border-red-200 rounded-xl p-2 sm:p-2.5 md:p-3 lg:p-4">
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <AlertCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5 text-red-600 flex-shrink-0" />
                      <span className={`text-red-600 font-semibold ${sectionType.text}`}>{error}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>,
        document.body
      )}

      {/* Floating Status Messages (outside modals) */}
      {success && !showModal && !showRequestModal && !requestSuccess && (
        <div className="fixed top-16 sm:top-20 left-1/2 transform -translate-x-1/2 z-50 max-w-md w-full mx-2 sm:mx-4">
          <div className="bg-green-50 border-2 border-green-200 rounded-xl p-2 sm:p-3 md:p-4 shadow-lg animate-in slide-in-from-top">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <CheckCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5 text-green-600" />
              <span className={`text-green-600 font-semibold ${sectionType.text}`}>{success}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}