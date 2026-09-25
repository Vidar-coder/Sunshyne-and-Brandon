import { type NextRequest, NextResponse } from "next/server"
import { siteConfig } from "@/content/site"
import { PROPOSAL_ROLES, getProposalRoleById } from "@/lib/proposal-roles"
import type { ProposalResponse, ProposalSubmitPayload } from "@/lib/proposal-types"
import {
  fetchGoogleScriptJson,
  invalidateSheetsCache,
  postGoogleScriptJson,
  SHEETS_CACHE_KEYS,
} from "@/lib/sheets-cache"

const ENTOURAGE_SCRIPT_URL = siteConfig.googleAPI.entourage
const SPONSORS_SCRIPT_URL = siteConfig.googleAPI.sponsors

function text(value: unknown) {
  return typeof value === "string" ? value.trim() : ""
}

function roleIdForCategory(category: string) {
  const normalized = category.trim().toLowerCase()
  const role = PROPOSAL_ROLES.find(
    (entry) =>
      entry.roleCategory.trim().toLowerCase() === normalized ||
      entry.roleCategoryAliases?.some((alias) => alias.trim().toLowerCase() === normalized)
  )
  return role?.id ?? normalized
}

function entourageResponses(rows: unknown[]): ProposalResponse[] {
  return rows.flatMap((row) => {
    const record = row as Record<string, unknown>
    const name = text(record.Name ?? record.name)
    const category = text(record.RoleCategory ?? record.roleCategory)
    if (!name || !category) return []

    return [
      {
        id: `entourage-${category}-${name}`,
        role: roleIdForCategory(category),
        name,
        status: "Confirmed" as const,
        submittedAt: text(record.SubmittedAt ?? record.submittedAt),
        category,
      },
    ]
  })
}

function sponsorResponses(rows: unknown[]): ProposalResponse[] {
  return rows.flatMap((row, index) => {
    const record = row as Record<string, unknown>
    const responses: ProposalResponse[] = []
    const male = text(record.MalePrincipalSponsor ?? record.malePrincipalSponsor)
    const female = text(record.FemalePrincipalSponsor ?? record.femalePrincipalSponsor)

    if (male) {
      responses.push({
        id: `sponsor-ninong-${index}-${male}`,
        role: "principal-sponsor-ninong",
        name: male,
        status: "Confirmed",
        submittedAt: "",
        category: "Principal Sponsors",
      })
    }

    if (female) {
      responses.push({
        id: `sponsor-ninang-${index}-${female}`,
        role: "principal-sponsor-ninang",
        name: female,
        status: "Confirmed",
        submittedAt: "",
        category: "Principal Sponsors",
      })
    }

    return responses
  })
}

async function readSheet(url: string) {
  const payload = await fetchGoogleScriptJson(url)
  return Array.isArray(payload) ? payload : []
}

async function saveConfirmedResponse(payload: ProposalSubmitPayload) {
  const roleDef = getProposalRoleById(payload.role)
  if (!roleDef) {
    throw new Error("Invalid role")
  }

  if (roleDef.type === "entourage") {
    await postGoogleScriptJson(ENTOURAGE_SCRIPT_URL, {
      Name: payload.name.trim(),
      RoleCategory: roleDef.roleCategory,
      RoleTitle: roleDef.title,
      Email: "",
    })
    invalidateSheetsCache(SHEETS_CACHE_KEYS.entourage)
    return
  }

  if (roleDef.type === "sponsor-ninong") {
    await postGoogleScriptJson(SPONSORS_SCRIPT_URL, {
      MalePrincipalSponsor: payload.name.trim(),
      FemalePrincipalSponsor: "",
    })
    invalidateSheetsCache(SHEETS_CACHE_KEYS.sponsors)
    return
  }

  await postGoogleScriptJson(SPONSORS_SCRIPT_URL, {
    MalePrincipalSponsor: "",
    FemalePrincipalSponsor: payload.name.trim(),
  })
  invalidateSheetsCache(SHEETS_CACHE_KEYS.sponsors)
}

export async function GET() {
  try {
    const [entourageRows, sponsorRows] = await Promise.all([
      readSheet(ENTOURAGE_SCRIPT_URL),
      readSheet(SPONSORS_SCRIPT_URL),
    ])

    return NextResponse.json(
      [...entourageResponses(entourageRows), ...sponsorResponses(sponsorRows)],
      {
        status: 200,
        headers: { "Cache-Control": "no-store" },
      }
    )
  } catch (error) {
    console.error("Error fetching proposal responses:", error)
    return NextResponse.json(
      { error: "Failed to fetch proposal responses" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as ProposalSubmitPayload
    const { role, name, status, submittedAt } = body

    if (!role || !status) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    if (status !== "Confirmed" && status !== "Declined") {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 })
    }

    const roleDef = getProposalRoleById(role)
    if (!roleDef) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 })
    }

    const payload: ProposalSubmitPayload = {
      role,
      name: name?.trim() || "",
      status,
      submittedAt: submittedAt || new Date().toISOString(),
    }

    if (status === "Confirmed") {
      if (!payload.name) {
        return NextResponse.json({ error: "Name is required" }, { status: 400 })
      }
      await saveConfirmedResponse(payload)
    }

    return NextResponse.json(
      {
        success: true,
        synced: status === "Confirmed",
        category: roleDef.roleCategory,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Error saving proposal response:", error)
    return NextResponse.json(
      { error: "Failed to save proposal response" },
      { status: 500 }
    )
  }
}
