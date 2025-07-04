import { cn } from "@/lib/utils"

interface ProjectDescriptionProps {
  description: string
  className?: string
}

export function ProjectDescription({ description, className }: ProjectDescriptionProps) {
  return (
    <div
      className={cn("text-muted-foreground", className)}
      dangerouslySetInnerHTML={{
        __html: description.replace(/\n/g, "<br />"),
      }}
    />
  )
}
