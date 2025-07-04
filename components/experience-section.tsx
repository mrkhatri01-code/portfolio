import { Calendar, MapPin } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Experience {
  id: string
  company: string
  position: string
  start_date: string
  end_date: string | null
  current: boolean
  description: string | null
  location: string | null
  display_order: number
  company_url?: string | null // Add this new field
}

interface ExperienceSectionProps {
  experience: Experience[]
}

export function ExperienceSection({ experience }: ExperienceSectionProps) {
  return (
    <section id="experience" className="py-16 bg-muted/40">
      <div className="container px-4">
        <h2 className="text-3xl font-bold tracking-tight mb-12 text-center md:text-left">Experience</h2>

        {experience.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No work experience found</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {experience.map((exp) => (
              <Card key={exp.id}>
                <CardHeader className="pb-2">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-1">
                    <div>
                      <CardTitle className="text-xl">{exp.position}</CardTitle>
                      {exp.company_url ? (
                        <a
                          href={exp.company_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-lg font-medium mt-1 text-primary hover:underline"
                        >
                          {exp.company}
                        </a>
                      ) : (
                        <p className="text-lg font-medium mt-1">{exp.company}</p>
                      )}
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground mt-2 md:mt-0 whitespace-nowrap">
                      <Calendar className="h-4 w-4 mr-1 flex-shrink-0" />
                      <span>
                        {new Date(exp.start_date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                        })}{" "}
                        -{" "}
                        {exp.current
                          ? "Present"
                          : exp.end_date
                            ? new Date(exp.end_date).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "short",
                              })
                            : "Present"}
                      </span>
                    </div>
                  </div>

                  {exp.location && (
                    <div className="flex items-center text-sm text-muted-foreground mt-2">
                      <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                      <span>{exp.location}</span>
                    </div>
                  )}
                </CardHeader>

                {exp.description && (
                  <CardContent>
                    <p className="text-muted-foreground whitespace-pre-line">{exp.description}</p>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

