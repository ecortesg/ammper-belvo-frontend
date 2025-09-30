"use client"

import { signup } from "@/server/actions"
import { Label } from "./ui/label"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { useActionState } from "react"

export function SignupForm() {
  const [state, action, pending] = useActionState(signup, undefined)

  return (
    <div className="p-6 bg-white rounded-lg shadow-md w-full max-w-md space-y-6">
      <h1 className="text-2xl font-semibold">Sign Up</h1>
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
          <p className="text-destructive">{state.errors.email.errors}</p>
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
          <div className="text-destructive">
            <p>Password must:</p>
            <ul>
              {state.errors.password.errors.map((error) => (
                <li key={error}>- {error}</li>
              ))}
            </ul>
          </div>
        )}
        <Button type="submit" disabled={pending}>
          Sign Up
        </Button>
        {state?.message && <p className="text-destructive">{state.message}</p>}
      </form>
    </div>
  )
}
