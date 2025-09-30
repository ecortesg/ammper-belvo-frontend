import { SignOutButton } from "@/components/signout-button"
import Link from "next/link"

export default function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      <header className="bg-primary text-primary-foreground shadow-lg">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/banks" className="font-medium">
              Belvo App
            </Link>
            <div className="flex items-center space-x-4 sm:space-x-6">
              <Link href="/banks" className="text-sm">
                Banks
              </Link>
              <SignOutButton />
            </div>
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {children}
      </main>
    </>
  )
}
