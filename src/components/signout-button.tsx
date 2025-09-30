"use client"

import { logout } from "@/server/actions"
import { LogOutIcon } from "lucide-react"
import { Button } from "./ui/button"

export function SignOutButton() {
  return (
    <Button
      variant="secondary"
      size="sm"
      onClick={async () => {
        await logout()
      }}
    >
      <LogOutIcon className="h-4 w-4" />
      <span>Sign Out</span>
    </Button>
  )
}
