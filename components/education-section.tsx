import { Calendar, MapPin } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Education {
  id: string
  institution: string
  degree: string
  field_of_study: string
  start_date: string
  end_date: string | null
  current: boolean
  description: string | null
  location: string | null
  display_order: number
}

interface EducationSectionProps {
  education: Education[]
}

export function EducationSection({ education }: EducationSectionProps) {
  return (
    <section id="education" className="py-16">
      <div className="container px-4">
        <h2 className="text-3xl font-bold tracking-tight mb-12 text-center md:text-left">Education</h2>

        {education.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No education history found</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {education.map((edu) => (
              <Card key={edu.id}>
                <CardHeader>
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-1">
                    <div>
                      <CardTitle className="text-xl">{edu.institution}</CardTitle>
                      <p className="text-lg font-medium mt-1">
                        {edu.degree} in {edu.field_of_study}
                      </p>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground mt-2 md:mt-0 whitespace-nowrap">
                      <Calendar className="h-4 w-4 mr-1 flex-shrink-0" />
                      <span>
                        {new Date(edu.start_date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                        })}{" "}
                        -{" "}
                        {edu.current
                          ? "Present"
                          : edu.end_date
                            ? new Date(edu.end_date).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "short",
                              })
                            : "Present"}
                      </span>
                    </div>
                  </div>

                  {edu.location && (
                    <div className="flex items-center text-sm text-muted-foreground mt-2">
                      <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                      <span>{edu.location}</span>
                    </div>
                  )}
                </CardHeader>

                {edu.description && (
                  <CardContent>
                    <p className="text-muted-foreground whitespace-pre-line">{edu.description}</p>
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
