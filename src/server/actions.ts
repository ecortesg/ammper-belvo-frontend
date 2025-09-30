"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { z } from "zod"

const API_BASE_URL = process.env.API_BASE_URL as string

const SignupFormSchema = z.object({
  email: z.email({ message: "Please enter a valid email." }).trim(),
  password: z
    .string()
    .min(8, { message: "Be at least 8 characters long" })
    .regex(/[a-zA-Z]/, { message: "Contain at least one letter." })
    .regex(/[0-9]/, { message: "Contain at least one number." })
    .trim(),
})

const LoginFormSchema = z.object({
  email: z.email({ message: "Please enter a valid email." }).trim(),
  password: z.string().min(1, { message: "Password is required." }).trim(),
})

export async function login(state: FormState, formData: FormData) {
  const validatedFields = LoginFormSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  })

  if (!validatedFields.success) {
    return {
      payload: formData,
      errors: z.treeifyError(validatedFields.error).properties,
    }
  }

  const { email, password } = validatedFields.data

  try {
    const res = await fetch(`${API_BASE_URL}/api/token/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: email, password }),
    })

    if (!res.ok) {
      const data = await res.json()
      return {
        payload: formData,
        message: data.detail || "Login failed. Please try again.",
      }
    }

    const { refresh, access } = await res.json()
    const cookieStore = await cookies()

    cookieStore.set("refresh", refresh, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30, // 30 days
    })
    cookieStore.set("access", access, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "lax",
      maxAge: 60 * 10, // 10 minutes
    })
  } catch (error) {
    console.error("Error during login:", error)
    return {
      payload: formData,
      message: "An unexpected error occurred. Please try again.",
    }
  }

  redirect("/banks")
}

export async function logout() {
  const cookieStore = await cookies()
  cookieStore.delete("refresh")
  cookieStore.delete("access")
  redirect("/")
}

function isJwtExpired(token: string): boolean {
  try {
    const payload = JSON.parse(
      Buffer.from(token.split(".")[1], "base64").toString()
    )
    return Date.now() / 1000 > payload.exp - 30 // 30s leeway
  } catch {
    return true
  }
}

export async function getAccessFromRefresh() {
  const cookieStore = await cookies()
  const access = cookieStore.get("access")?.value

  if (access && !isJwtExpired(access)) {
    return access
  }

  const refresh = cookieStore.get("refresh")?.value
  if (!refresh) {
    redirect("/")
  }
  const res = await fetch(`${API_BASE_URL}/api/token/refresh/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh }),
    next: { revalidate: 3600 },
  })

  if (!res.ok) {
    cookieStore.delete("refresh")
    cookieStore.delete("access")
    redirect("/")
  }
  const { access: newAccess } = await res.json()
  return newAccess
}

type FormState =
  | {
      payload?: FormData
      errors?: {
        email?: { errors: string[] }
        password?: { errors: string[] }
      }
      message?: string
    }
  | undefined

export async function signup(state: FormState, formData: FormData) {
  const validatedFields = SignupFormSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  })

  if (!validatedFields.success) {
    return {
      payload: formData,
      errors: z.treeifyError(validatedFields.error).properties,
    }
  }

  const { email, password } = validatedFields.data

  try {
    const res = await fetch(`${API_BASE_URL}/api/auth/register/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: email, email, password }),
    })

    const data = await res.json()

    if (!res.ok) {
      return {
        payload: formData,
        message:
          data.detail?.[0]?.msg ||
          data.detail ||
          "Registration failed. Please try again.",
      }
    }
  } catch (error) {
    console.error("Error during signup:", error)
    return {
      message: "An unexpected error occurred. Please try again.",
    }
  }

  redirect("/")
}

export async function getInstitutions() {
  const access = await getAccessFromRefresh()

  if (!access) {
    throw new Error("Unauthorized")
  }

  const res = await fetch(`${process.env.API_BASE_URL}/api/institutions/`, {
    headers: { Authorization: `Bearer ${access}` },
    next: { revalidate: 3600 },
  })
  if (!res.ok) {
    throw new Error("Failed to fetch institutions")
  }
  return res.json()
}

export async function getInstitutionById(institutionId: string) {
  const access = await getAccessFromRefresh()

  if (!access) {
    throw new Error("Unauthorized")
  }

  const res = await fetch(
    `${process.env.API_BASE_URL}/api/institutions/${institutionId}/`,
    {
      headers: { Authorization: `Bearer ${access}` },

      next: { revalidate: 3600 },
    }
  )
  if (!res.ok) {
    throw new Error("Failed to fetch institution")
  }
  return res.json()
}

export async function getLinks() {
  const access = await getAccessFromRefresh()

  if (!access) {
    throw new Error("Unauthorized")
  }

  const res = await fetch(`${process.env.API_BASE_URL}/api/links/`, {
    headers: { Authorization: `Bearer ${access}` },
    next: { revalidate: 3600 },
  })
  if (!res.ok) {
    throw new Error("Failed to fetch links")
  }
  return res.json()
}

export async function getAccountsByInstitutionName(
  institutionName: string,
  linkId: string
) {
  const access = await getAccessFromRefresh()

  if (!access) {
    throw new Error("Unauthorized")
  }

  const res = await fetch(
    `${process.env.API_BASE_URL}/api/accounts/?institution_name=${institutionName}&link_id=${linkId}`,
    {
      headers: { Authorization: `Bearer ${access}` },

      next: { revalidate: 3600 },
    }
  )
  if (!res.ok) {
    throw new Error("Failed to fetch accounts")
  }
  return res.json()
}

export async function getAccountById(accountId: string) {
  const access = await getAccessFromRefresh()

  if (!access) {
    throw new Error("Unauthorized")
  }

  const res = await fetch(
    `${process.env.API_BASE_URL}/api/accounts/${accountId}/`,
    {
      headers: { Authorization: `Bearer ${access}` },

      next: { revalidate: 3600 },
    }
  )
  if (!res.ok) {
    throw new Error("Failed to fetch account")
  }
  return res.json()
}

export async function getTransactionsByAccountId(
  accountId: string,
  linkId: string
) {
  const access = await getAccessFromRefresh()

  if (!access) {
    throw new Error("Unauthorized")
  }

  const res = await fetch(
    `${process.env.API_BASE_URL}/api/transactions/?account_id=${accountId}&link_id=${linkId}`,
    {
      headers: { Authorization: `Bearer ${access}` },

      next: { revalidate: 3600 },
    }
  )
  if (!res.ok) {
    throw new Error("Failed to fetch transactions")
  }
  return res.json()
}
