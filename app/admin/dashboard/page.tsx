"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { createClientSupabaseClient } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"
import { PlusCircle, Settings, Pencil, Trash2, MessageSquare, Users } from "lucide-react"
import { deleteProject } from "@/app/actions/project-actions"
import { deleteEducation } from "@/app/actions/education-actions"
import { deleteExperience } from "@/app/actions/experience-actions"
import { deleteClient } from "@/app/actions/client-actions"
import { RatingsManager } from "@/components/admin/ratings-manager"
import { getAllRatings } from "@/app/actions/admin-actions"

export default function AdminDashboardPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [projects, setProjects] = useState([])
  const [education, setEducation] = useState([])
  const [experience, setExperience] = useState([])
  const [clients, setClients] = useState([])
  const [messages, setMessages] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [ratings, setRatings] = useState([])

  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()

  const activeTab = searchParams.get("tab") || "projects"

  // Memoize the fetchData function to prevent unnecessary re-renders
  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true)
      const supabase = createClientSupabaseClient()

      // Use Promise.all to fetch data in parallel
      const [
        projectsResponse,
        educationResponse,
        experienceResponse,
        clientsResponse,
        messagesResponse,
        ratingsResponse,
      ] = await Promise.all([
        supabase.from("projects").select("*").order("created_at", { ascending: false }),
        supabase.from("education").select("*").order("display_order", { ascending: true }),
        supabase.from("experience").select("*").order("display_order", { ascending: true }),
        supabase.from("clients").select("*").order("name", { ascending: true }),
        supabase.from("messages").select("*").order("created_at", { ascending: false }),
        getAllRatings(),
      ])

      // Handle errors
      if (projectsResponse.error) throw projectsResponse.error
      if (educationResponse.error) throw educationResponse.error
      if (experienceResponse.error) throw experienceResponse.error
      if (clientsResponse.error) throw educationResponse.error
      if (experienceResponse.error) throw experienceResponse.error
      if (clientsResponse.error) throw clientsResponse.error
      if (messagesResponse.error) throw messagesResponse.error

      // Set state with fetched data
      setProjects(projectsResponse.data || [])
      setEducation(educationResponse.data || [])
      setExperience(experienceResponse.data || [])
      setClients(clientsResponse.data || [])
      setMessages(messagesResponse.data || [])
      setRatings(ratingsResponse.success ? ratingsResponse.data : [])

      // Count unread messages
      const unread = messagesResponse.data ? messagesResponse.data.filter((msg) => !msg.read).length : 0
      setUnreadCount(unread)
    } catch (error) {
      console.error("Error fetching data:", error)
      toast({
        title: "Error loading data",
        description: "There was a problem loading your data. Some features may not work correctly.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleDeleteProject = useCallback(
    async (id) => {
      if (!confirm("Are you sure you want to delete this project? This action cannot be undone.")) {
        return
      }

      try {
        const result = await deleteProject(id)

        if (!result.success) {
          throw new Error(result.message)
        }

        toast({
          title: "Project deleted",
          description: result.message,
        })

        // Refresh data
        fetchData()
      } catch (error) {
        console.error("Error deleting project:", error)
        toast({
          title: "Delete failed",
          description: "There was an error deleting the project",
          variant: "destructive",
        })
      }
    },
    [fetchData, toast],
  )

  const handleDeleteEducation = useCallback(
    async (id) => {
      if (!confirm("Are you sure you want to delete this education entry? This action cannot be undone.")) {
        return
      }

      try {
        const result = await deleteEducation(id)

        if (!result.success) {
          throw new Error(result.message)
        }

        toast({
          title: "Education deleted",
          description: result.message,
        })

        // Refresh data
        fetchData()
      } catch (error) {
        console.error("Error deleting education:", error)
        toast({
          title: "Delete failed",
          description: "There was an error deleting the education entry",
          variant: "destructive",
        })
      }
    },
    [fetchData, toast],
  )

  const handleDeleteExperience = useCallback(
    async (id) => {
      if (!confirm("Are you sure you want to delete this experience entry? This action cannot be undone.")) {
        return
      }

      try {
        const result = await deleteExperience(id)

        if (!result.success) {
          throw new Error(result.message)
        }

        toast({
          title: "Experience deleted",
          description: result.message,
        })

        // Refresh data
        fetchData()
      } catch (error) {
        console.error("Error deleting experience:", error)
        toast({
          title: "Delete failed",
          description: "There was an error deleting the experience entry",
          variant: "destructive",
        })
      }
    },
    [fetchData, toast],
  )

  const handleDeleteClient = useCallback(
    async (id) => {
      if (!confirm("Are you sure you want to delete this client? This action cannot be undone.")) {
        return
      }

      try {
        const result = await deleteClient(id)

        if (!result.success) {
          throw new Error(result.message)
        }

        toast({
          title: "Client deleted",
          description: result.message,
        })

        // Refresh data
        fetchData()
      } catch (error) {
        console.error("Error deleting client:", error)
        toast({
          title: "Delete failed",
          description: "There was an error deleting the client",
          variant: "destructive",
        })
      }
    },
    [fetchData, toast],
  )

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="bg-background border-b">
        <div className="container py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold">Admin Dashboard</h1>
          <div className="flex items-center gap-4">
            <Button asChild variant="ghost">
              <Link href="/">View Site</Link>
            </Button>
            <Button variant="outline" onClick={() => router.push("/")}>
              Back to Site
            </Button>
          </div>
        </div>
      </header>

      <main className="container py-8">
        <Tabs defaultValue={activeTab} onValueChange={(value) => router.push(`/admin/dashboard?tab=${value}`)}>
          <TabsList className="mb-8">
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="clients">Clients</TabsTrigger>
            <TabsTrigger value="experience">Experience</TabsTrigger>
            <TabsTrigger value="education">Education</TabsTrigger>
            <TabsTrigger value="messages">
              Messages
              {unreadCount > 0 && (
                <span className="ml-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                  {unreadCount}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="ratings">Ratings</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="projects">
            <div className="grid gap-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Projects</h2>
                <Button asChild>
                  <Link href="/admin/projects/new">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add New Project
                  </Link>
                </Button>
              </div>

              {projects.length === 0 ? (
                <Card>
                  <CardHeader>
                    <CardTitle>No Projects</CardTitle>
                    <CardDescription>
                      You haven't created any projects yet. Add your first project to get started.
                    </CardDescription>
                  </CardHeader>
                  <CardFooter>
                    <Button asChild>
                      <Link href="/admin/projects/new">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add New Project
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ) : (
                <div className="grid gap-4">
                  {projects.map((project) => (
                    <Card key={project.id}>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle>{project.title}</CardTitle>
                            <CardDescription>/{project.slug}</CardDescription>
                          </div>
                          <div className="flex gap-2">
                            <Button asChild variant="outline" size="sm">
                              <Link href={`/admin/projects/${project.id}`}>Manage</Link>
                            </Button>
                            <Button asChild variant="outline" size="sm">
                              <Link href={`/admin/projects/edit/${project.id}`}>
                                <Pencil className="mr-1 h-3 w-3" />
                                Edit
                              </Link>
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-destructive hover:text-destructive"
                              onClick={() => handleDeleteProject(project.id)}
                            >
                              <Trash2 className="mr-1 h-3 w-3" />
                              Delete
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground line-clamp-2">{project.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="clients">
            <div className="grid gap-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Clients</h2>
                <Button asChild>
                  <Link href="/admin/clients/new">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add New Client
                  </Link>
                </Button>
              </div>

              {clients.length === 0 ? (
                <Card>
                  <CardHeader>
                    <CardTitle>No Clients</CardTitle>
                    <CardDescription>
                      You haven't added any clients yet. Add your first client to get started.
                    </CardDescription>
                  </CardHeader>
                  <CardFooter>
                    <Button asChild>
                      <Link href="/admin/clients/new">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add New Client
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ) : (
                <div className="grid gap-4">
                  {clients.map((client) => (
                    <Card key={client.id}>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-4">
                            {client.logo_url && (
                              <img
                                src={client.logo_url || "/placeholder.svg"}
                                alt={client.name}
                                className="w-12 h-12 object-contain rounded-md"
                              />
                            )}
                            <div>
                              <CardTitle>{client.name}</CardTitle>
                              {client.website_url && (
                                <CardDescription>
                                  <a
                                    href={client.website_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:underline"
                                  >
                                    {client.website_url}
                                  </a>
                                </CardDescription>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button asChild variant="outline" size="sm">
                              <Link href={`/admin/clients/edit/${client.id}`}>
                                <Pencil className="mr-1 h-3 w-3" />
                                Edit
                              </Link>
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-destructive hover:text-destructive"
                              onClick={() => handleDeleteClient(client.id)}
                            >
                              <Trash2 className="mr-1 h-3 w-3" />
                              Delete
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        {client.description && (
                          <p className="text-sm text-muted-foreground line-clamp-2">{client.description}</p>
                        )}
                        {client.featured && (
                          <div className="mt-2">
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                              Featured
                            </span>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
              <div className="flex justify-center mt-4">
                <Button asChild variant="outline">
                  <Link href="/admin/clients">
                    <Users className="mr-2 h-4 w-4" />
                    Manage All Clients
                  </Link>
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="experience">
            <div className="grid gap-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Experience</h2>
                <Button asChild>
                  <Link href="/admin/experience/new">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Experience
                  </Link>
                </Button>
              </div>

              {experience.length === 0 ? (
                <Card>
                  <CardHeader>
                    <CardTitle>No Experience</CardTitle>
                    <CardDescription>
                      You haven't added any work experience yet. Add your first experience to get started.
                    </CardDescription>
                  </CardHeader>
                  <CardFooter>
                    <Button asChild>
                      <Link href="/admin/experience/new">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add Experience
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ) : (
                <div className="grid gap-4">
                  {experience.map((exp) => (
                    <Card key={exp.id}>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle>{exp.position}</CardTitle>
                            <CardDescription>{exp.company}</CardDescription>
                          </div>
                          <div className="flex gap-2">
                            <Button asChild variant="outline" size="sm">
                              <Link href={`/admin/experience/edit/${exp.id}`}>
                                <Pencil className="mr-1 h-3 w-3" />
                                Edit
                              </Link>
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-destructive hover:text-destructive"
                              onClick={() => handleDeleteExperience(exp.id)}
                            >
                              <Trash2 className="mr-1 h-3 w-3" />
                              Delete
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">
                          {new Date(exp.start_date).toLocaleDateString()} -
                          {exp.current
                            ? " Present"
                            : exp.end_date
                              ? ` ${new Date(exp.end_date).toLocaleDateString()}`
                              : " Present"}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="education">
            <div className="grid gap-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Education</h2>
                <Button asChild>
                  <Link href="/admin/education/new">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Education
                  </Link>
                </Button>
              </div>

              {education.length === 0 ? (
                <Card>
                  <CardHeader>
                    <CardTitle>No Education</CardTitle>
                    <CardDescription>
                      You haven't added any education yet. Add your first education to get started.
                    </CardDescription>
                  </CardHeader>
                  <CardFooter>
                    <Button asChild>
                      <Link href="/admin/education/new">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add Education
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ) : (
                <div className="grid gap-4">
                  {education.map((edu) => (
                    <Card key={edu.id}>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle>{edu.institution}</CardTitle>
                            <CardDescription>
                              {edu.degree} in {edu.field_of_study}
                            </CardDescription>
                          </div>
                          <div className="flex gap-2">
                            <Button asChild variant="outline" size="sm">
                              <Link href={`/admin/education/edit/${edu.id}`}>
                                <Pencil className="mr-1 h-3 w-3" />
                                Edit
                              </Link>
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-destructive hover:text-destructive"
                              onClick={() => handleDeleteEducation(edu.id)}
                            >
                              <Trash2 className="mr-1 h-3 w-3" />
                              Delete
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">
                          {new Date(edu.start_date).toLocaleDateString()} -
                          {edu.current
                            ? " Present"
                            : edu.end_date
                              ? ` ${new Date(edu.end_date).toLocaleDateString()}`
                              : " Present"}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="messages">
            <div className="grid gap-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Messages</h2>
                <Button asChild>
                  <Link href="/admin/messages">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    View All Messages
                  </Link>
                </Button>
              </div>

              {messages.length === 0 ? (
                <Card>
                  <CardHeader>
                    <CardTitle>No Messages</CardTitle>
                    <CardDescription>You haven't received any messages yet.</CardDescription>
                  </CardHeader>
                </Card>
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Messages</CardTitle>
                    <CardDescription>
                      You have {messages.length} message(s), {unreadCount} unread.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4">
                      {messages.slice(0, 3).map((message) => (
                        <div key={message.id} className="border-b pb-4 last:border-0 last:pb-0">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium">{message.name}</h3>
                              <p className="text-sm text-muted-foreground">{message.email}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              {!message.read && <span className="bg-primary h-2 w-2 rounded-full" />}
                              <span className="text-xs text-muted-foreground">
                                {new Date(message.created_at).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          <p className="mt-2 text-sm line-clamp-2">{message.message}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button asChild variant="outline" className="w-full">
                      <Link href="/admin/messages">View All Messages</Link>
                    </Button>
                  </CardFooter>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="ratings">
            <div className="grid gap-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Project Ratings</h2>
              </div>
              <RatingsManager initialRatings={ratings} />
            </div>
          </TabsContent>

          <TabsContent value="settings">
            <div className="grid gap-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Settings</h2>
                <Button asChild>
                  <Link href="/admin/settings">
                    <Settings className="mr-2 h-4 w-4" />
                    Manage Settings
                  </Link>
                </Button>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Site Settings</CardTitle>
                    <CardDescription>Manage your site title, description, and about text</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button asChild variant="outline">
                      <Link href="/admin/settings?tab=general">Edit Site Settings</Link>
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Profile</CardTitle>
                    <CardDescription>Manage your profile image and resume</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button asChild variant="outline">
                      <Link href="/admin/settings?tab=profile">Edit Profile</Link>
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Social Links</CardTitle>
                    <CardDescription>Manage your social media links</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button asChild variant="outline">
                      <Link href="/admin/settings?tab=social">Edit Social Links</Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
