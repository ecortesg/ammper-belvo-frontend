"use client"

import { login } from "@/server/actions"
import { Label } from "./ui/label"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { useActionState } from "react"
import Link from "next/link"

export function LoginForm() {
  const [state, action, pending] = useActionState(login, undefined)

  return (
    <>
      <div className="p-6 bg-white rounded-lg shadow-md w-full max-w-md space-y-6">
        <h1 className="text-2xl font-semibold">Login</h1>
        <form action={action} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Email"
              defaultValue={(state?.payload?.get("email") as string) ?? ""}
            />
          </div>
          {state?.errors?.email && (
            <p className="text-destructive">{state.errors.email.errors[0]}</p>
          )}
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              defaultValue={(state?.payload?.get("password") as string) ?? ""}
            />
          </div>
          {state?.errors?.password && (
            <p className="text-destructive">
              {state.errors.password.errors[0]}
            </p>
          )}
          <Button type="submit" disabled={pending}>
            Login
          </Button>
          {state?.message && (
            <p className="text-destructive">{state.message}</p>
          )}
        </form>
      </div>
      <p className="mt-4">
        Don’t have an account?{" "}
        <Link className="underline" href="/register">
          Register here
        </Link>
      </p>
    </>
  )
}
