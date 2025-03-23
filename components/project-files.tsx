"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface ProjectFilesProps {
  projectId: string
}

export function ProjectFiles({ projectId }: ProjectFilesProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Project Files</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-center py-4 text-muted-foreground">No files available for this project</p>
      </CardContent>
    </Card>
  )
}

