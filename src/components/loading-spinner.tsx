import { LoaderCircle } from "lucide-react"

export function LoadingSpinner() {
  return (
    <div className="flex flex-1 items-center justify-center p-2">
      <LoaderCircle className="size-16 animate-spin" />
    </div>
  )
}
