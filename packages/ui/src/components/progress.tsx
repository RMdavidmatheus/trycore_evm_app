import * as React from "react"
import { cn } from "cn"

function Progress({
  className,
  value = 0,
  ...props
}: React.ComponentProps<"div"> & { value?: number }) {
  const clamped = Math.min(100, Math.max(0, value))
  return (
    <div
      data-slot="progress"
      className={cn(
        "bg-primary/20 relative h-2 w-full overflow-hidden rounded-full",
        className
      )}
      {...props}
    >
      <div
        data-slot="progress-indicator"
        className="bg-primary h-full transition-all"
        style={{ width: `${clamped}%` }}
      />
    </div>
  )
}

export { Progress }
