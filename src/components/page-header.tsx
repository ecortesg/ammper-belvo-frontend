import { cn } from "@/lib/utils"

export function PageHeader({
  title,
  className,
}: {
  title: string
  className?: string
}) {
  return (
    <div
      className={cn(
        "mb-6 flex flex-wrap items-center justify-between gap-4",
        className
      )}
    >
      <h1 className="text-3xl font-semibold">{title}</h1>
    </div>
  )
}
